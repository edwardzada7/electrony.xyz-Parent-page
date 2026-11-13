"use strict";

const TOKEN_REFRESH_MARGIN_MS = 60_000;
const CATALOGUE_CACHE_MS = 5 * 60 * 1000;
const MAX_PAGES = 100;
const MAX_CUSTOMER_IDENTIFIER_LENGTH = 128;
const BILLING_SERVICES = Object.freeze({
  electricity: new Set(["ELECTRICITY"]),
  airtime: new Set(["AIRTIME"]),
  data: new Set(["DATA", "DATA_BUNDLE"]),
  bills: new Set(["CABLE_TV"])
});

function normalizeConfigValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function readEnv(name, fallback = "") {
  return normalizeConfigValue(process.env[name]) || fallback;
}

function createProviderError(message, code = "provider_unavailable", statusCode = 502) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

function getResponseShape(payload, stage) {
  if (payload === null) return "null";
  if (Array.isArray(payload)) return "array";
  if (typeof payload !== "object") return typeof payload;

  const body = payload.responseBody;
  if (body === null) return "object; responseBody=null";
  if (Array.isArray(body)) return "object; responseBody=array";
  if (typeof body !== "object") {
    return `object; responseBody=${body === undefined ? "missing" : typeof body}`;
  }
  if (stage !== "catalogue" && !Object.hasOwn(body, "content")) return "object; responseBody=object";
  if (!Array.isArray(body.content)) {
    return `object; responseBody=object; content=${body.content === undefined ? "missing" : Array.isArray(body.content) ? "array" : typeof body.content}`;
  }
  const itemType = body.content.length === 0
    ? "empty"
    : body.content.every((item) => item && typeof item === "object" && !Array.isArray(item)
      && typeof item.code === "string" && typeof item.name === "string")
      ? "category"
      : body.content.every((item) => item && typeof item === "object" && !Array.isArray(item))
        ? "object"
        : "mixed";
  return `object; responseBody=object; content=array<${itemType}>`;
}

function sanitizeProviderErrorCode(value, secrets = []) {
  if (typeof value !== "string" && typeof value !== "number") return null;
  let code = String(value);
  for (const secret of secrets) {
    if (typeof secret === "string" && secret.length > 0) code = code.replaceAll(secret, "[redacted]");
  }
  return code.replace(/[^a-zA-Z0-9_.:-]/g, "").slice(0, 80) || null;
}

function sanitizeProviderErrorMessage(value, secrets = []) {
  if (typeof value !== "string") return null;
  let message = value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\b(Bearer|Basic)\s+\S+/gi, "$1 [redacted]")
    .replace(/\b(authorization|api[_ -]?key|secret[_ -]?key|access[_ -]?token)\b\s*[:=]\s*\S+/gi, "$1=[redacted]")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted]")
    .replace(/\b\d{8,16}\b/g, "[redacted]");
  for (const secret of secrets) {
    if (typeof secret === "string" && secret.length > 0) {
      message = message.replaceAll(secret, "[redacted]");
    }
  }
  return message.trim().slice(0, 300) || null;
}

function isValidCustomerIdentifier(value) {
  return typeof value === "string"
    && value.length > 0
    && value.length <= MAX_CUSTOMER_IDENTIFIER_LENGTH
    && value === value.trim()
    && !/[\u0000-\u001f\u007f]/.test(value);
}

function getProviderDiagnosticStatus(response, payload, stage) {
  const providerMessage = [
    payload?.responseMessage,
    payload?.message,
    payload?.errorMessage
  ].filter((value) => typeof value === "string").join(" ");

  if (response.status === 401) return "authentication_failed";
  if (/not\s+(?:been\s+)?(?:enabled|activated|subscribed)|activation\s+required/i.test(providerMessage)) {
    return "feature_not_activated";
  }
  if (response.status === 403) return "access_denied";
  if (stage === "authentication") return "authentication_failed";
  if (response.status >= 500) return `${stage}_retrieval_failed`;
  if (response.status === 404) return "endpoint_or_request_error";
  if (response.status === 400) return "invalid_provider_request";
  if (response.status >= 400) return "provider_service_error";
  return `${stage}_retrieval_failed`;
}

function buildProviderAdapter(environment = process.env, options = {}) {
  const fetchImpl = options.fetch || globalThis.fetch;
  let tokenCache = null;
  let authenticationPromise = null;
  let cataloguePromise = null;
  const catalogueCache = { expiresAt: 0, value: null };
  const productCache = new Map();
  const productRequests = new Map();

  function getConfiguration() {
    const monnifyEnvironment = normalizeConfigValue(environment.MONNIFY_ENVIRONMENT).toLowerCase();
    const baseUrl = normalizeConfigValue(environment.MONNIFY_BASE_URL).replace(/\/+$/, "");
    const expectedBaseUrl = monnifyEnvironment === "sandbox"
      ? "https://sandbox.monnify.com"
      : monnifyEnvironment === "production"
        ? "https://api.monnify.com"
        : "";
    return {
      apiKey: normalizeConfigValue(environment.MONNIFY_API_KEY),
      secretKey: normalizeConfigValue(environment.MONNIFY_SECRET_KEY),
      contractCode: normalizeConfigValue(environment.MONNIFY_CONTRACT_CODE),
      environment: monnifyEnvironment,
      baseUrl,
      expectedBaseUrl
    };
  }

  function getEnvironment() {
    const config = getConfiguration();
    if (config.baseUrl === "https://sandbox.monnify.com" && config.environment === "sandbox") return "sandbox";
    if (config.baseUrl === "https://api.monnify.com" && config.environment === "production") return "production";
    return null;
  }

  function getMissingConfiguration() {
    const config = getConfiguration();
    const missing = [];
    for (const [name, value] of [
      ["MONNIFY_API_KEY", config.apiKey],
      ["MONNIFY_SECRET_KEY", config.secretKey],
      ["MONNIFY_CONTRACT_CODE", config.contractCode]
    ]) {
      if (!value || /replace_with|change_me|example/i.test(value)) missing.push(name);
    }
    if (!["sandbox", "production"].includes(config.environment)) {
      missing.push("MONNIFY_ENVIRONMENT");
    }
    if (!config.baseUrl || config.baseUrl !== config.expectedBaseUrl) {
      missing.push("MONNIFY_BASE_URL");
    }
    return missing;
  }

  function getSafeProviderError(payload) {
    const body = payload?.responseBody;
    const hasError = payload?.requestSuccessful !== true
      || String(payload?.responseCode ?? "") !== "0";
    const errorCode = hasError
      ? payload?.errorCode ?? payload?.responseCode ?? body?.errorCode
      : null;
    const errorMessage = [
      payload?.responseMessage,
      payload?.message,
      payload?.errorMessage,
      body?.errorMessage
    ].find((value) => typeof value === "string");
    const config = getConfiguration();
    const secrets = [config.apiKey, config.secretKey, tokenCache?.token];
    return {
      providerErrorCode: sanitizeProviderErrorCode(errorCode, secrets),
      providerErrorMessage: sanitizeProviderErrorMessage(errorMessage, secrets)
    };
  }

  async function readJsonResponse(response, stage) {
    let payload;
    try {
      payload = await response.json();
    } catch {
      const error = createProviderError(
        response.ok ? "Monnify returned an invalid response." : "Monnify could not complete the request.",
        response.ok ? "provider_invalid_response" : "provider_request_failed",
        response.status >= 400 && response.status < 600 ? response.status : 502
      );
      error.diagnosticStatus = response.ok
        ? "application_parsing_failure"
        : getProviderDiagnosticStatus(response, null, stage);
      error.failureClassification = response.ok
        ? "application_parsing_failure"
        : response.status === 401
          ? "authentication_failure"
          : response.status === 403
            ? "permission_or_activation_failure"
            : "provider_service_error";
      error.stage = stage;
      error.upstreamStatus = response.status;
      error.upstreamSuccess = false;
      error.responseShape = "invalid_json";
      error.providerErrorCode = null;
      error.providerErrorMessage = null;
      throw error;
    }
    const diagnostics = {
      upstreamStatus: response.status,
      upstreamSuccess: response.ok
        && payload?.requestSuccessful === true
        && String(payload?.responseCode ?? "") === "0",
      responseShape: getResponseShape(payload, stage),
      ...getSafeProviderError(payload)
    };
    const validEnvelope = payload && typeof payload === "object" && !Array.isArray(payload)
      && typeof payload.requestSuccessful === "boolean"
      && (typeof payload.responseCode === "string" || typeof payload.responseCode === "number");
    if (!response.ok || !validEnvelope
      || payload.requestSuccessful !== true
      || String(payload.responseCode ?? "") !== "0") {
      const error = createProviderError(
        "Monnify could not complete the request.",
        "provider_request_failed",
        response.status >= 400 && response.status < 600 ? response.status : 502
      );
      error.diagnosticStatus = response.ok && !validEnvelope
        ? "unexpected_response_shape"
        : getProviderDiagnosticStatus(response, payload, stage);
      error.failureClassification = response.ok && !validEnvelope
        ? "unexpected_response_shape"
        : error.diagnosticStatus === "feature_not_activated" || response.status === 403
          ? "permission_or_activation_failure"
          : response.status === 401 || stage === "authentication"
            ? "authentication_failure"
            : "provider_service_error";
      error.stage = stage;
      Object.assign(error, diagnostics);
      throw error;
    }
    return payload;
  }

  async function authenticate() {
    const config = getConfiguration();
    const missing = getMissingConfiguration().filter((name) => name !== "MONNIFY_CONTRACT_CODE");
    if (missing.length) {
      const error = createProviderError(
        `Monnify Bills services are unavailable. Configure ${missing.join(", ")}.`,
        "provider_unconfigured",
        503
      );
      error.missingConfiguration = missing;
      error.diagnosticStatus = "configuration_missing";
      error.stage = "configuration";
      throw error;
    }
    if (tokenCache && tokenCache.expiresAt - TOKEN_REFRESH_MARGIN_MS > Date.now()) {
      return {
        token: tokenCache.token,
        config: {
          environment: config.environment,
          baseUrl: config.baseUrl,
          contractCode: config.contractCode
        }
      };
    }
    if (authenticationPromise) return authenticationPromise;

    authenticationPromise = (async () => {
      let response;
      try {
        response = await fetchImpl(`${config.baseUrl}/api/v1/auth/login`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`${config.apiKey}:${config.secretKey}`).toString("base64")}`
          },
          signal: AbortSignal.timeout(10_000)
        });
      } catch (cause) {
        const failureClassification = cause?.name === "TimeoutError" || cause?.name === "AbortError"
          ? "network_timeout"
          : "network_connection_failure";
        const error = createProviderError("Monnify authentication is temporarily unavailable.", "provider_unavailable");
        error.diagnosticStatus = failureClassification;
        error.failureClassification = failureClassification;
        error.stage = "authentication";
        error.upstreamStatus = null;
        error.upstreamSuccess = false;
        error.responseShape = "unavailable";
        error.providerErrorCode = null;
        error.providerErrorMessage = null;
        throw error;
      }

      const payload = await readJsonResponse(response, "authentication");
      const body = payload.responseBody;
      const token = typeof body?.accessToken === "string" ? body.accessToken : "";
      if (!token) {
        const error = createProviderError("Monnify did not return an access token.", "provider_invalid_response");
        error.diagnosticStatus = "authentication_failed";
        error.failureClassification = "application_parsing_failure";
        error.stage = "authentication";
        error.upstreamStatus = response.status;
        error.upstreamSuccess = true;
        error.responseShape = "object; responseBody=object; accessToken=missing";
        error.providerErrorCode = null;
        error.providerErrorMessage = null;
        throw error;
      }
      const expiresInSeconds = Number(body.expiresIn);
      const lifetimeMs = Number.isFinite(expiresInSeconds) && expiresInSeconds > 0
        ? expiresInSeconds * 1000
        : 60 * 60 * 1000;
      tokenCache = { token, expiresAt: Date.now() + lifetimeMs };
      return {
        token,
        config: {
          environment: config.environment,
          baseUrl: config.baseUrl,
          contractCode: config.contractCode
        }
      };
    })();

    try {
      return await authenticationPromise;
    } finally {
      authenticationPromise = null;
    }
  }

  async function request(pathname, {
    method = "GET",
    query,
    body,
    stage = "catalogue",
    onResponse
  } = {}) {
    const { token, config } = await authenticate();
    const endpoint = new URL(pathname, `${config.baseUrl}/`);
    if (query) {
      for (const [name, value] of Object.entries(query)) {
        if (value !== undefined && value !== null && value !== "") {
          endpoint.searchParams.set(name, String(value));
        }
      }
    }
    let response;
    try {
      response = await fetchImpl(endpoint.href, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(body ? { "Content-Type": "application/json" } : {})
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(method === "POST" ? 20_000 : 10_000)
      });
    } catch (cause) {
      const failureClassification = cause?.name === "TimeoutError" || cause?.name === "AbortError"
        ? "network_timeout"
        : "network_connection_failure";
      const error = createProviderError("Monnify is temporarily unavailable.", "provider_unavailable");
      error.diagnosticStatus = failureClassification;
      error.failureClassification = failureClassification;
      error.stage = stage;
      error.upstreamStatus = null;
      error.upstreamSuccess = false;
      error.responseShape = "unavailable";
      error.providerErrorCode = null;
      error.providerErrorMessage = null;
      if (method === "POST" && pathname.endsWith("/vend")) error.outcomeUncertain = true;
      throw error;
    }
    try {
      const payload = await readJsonResponse(response, stage);
      onResponse?.({
        upstreamStatus: response.status,
        upstreamSuccess: true,
        responseShape: getResponseShape(payload, stage),
        providerErrorCode: null,
        providerErrorMessage: null
      });
      return payload;
    } catch (error) {
      onResponse?.({
        upstreamStatus: error.upstreamStatus ?? response.status,
        upstreamSuccess: error.upstreamSuccess ?? false,
        responseShape: error.responseShape || "unavailable",
        providerErrorCode: error.providerErrorCode ?? null,
        providerErrorMessage: error.providerErrorMessage ?? null
      });
      if (response.status === 401) tokenCache = null;
      if (method === "POST" && pathname.endsWith("/vend")
        && (response.status >= 500 || (response.ok && error.code === "provider_invalid_response"))) {
        error.outcomeUncertain = true;
      }
      throw error;
    }
  }

  async function getPages(pathname, query = {}, stage = "catalogue", onResponse) {
    const records = [];
    let page = 1;
    for (let count = 0; count < MAX_PAGES; count += 1) {
      const payload = await request(pathname, {
        query: { ...query, page },
        stage,
        onResponse
      });
      const pageBody = payload.responseBody;
      if (!Array.isArray(pageBody?.content)) {
        const error = createProviderError("Monnify returned an invalid catalogue page.", "provider_invalid_response");
        error.diagnosticStatus = "unexpected_response_shape";
        error.failureClassification = "unexpected_response_shape";
        error.stage = stage;
        error.upstreamSuccess = true;
        error.responseShape = getResponseShape(payload, stage);
        error.providerCategoryCount = null;
        error.providerCategories = [];
        throw error;
      }
      if (stage === "catalogue" && pageBody.content.some((category) => (
        !category || typeof category !== "object" || Array.isArray(category)
        || typeof category.code !== "string" || typeof category.name !== "string"
      ))) {
        const error = createProviderError("Monnify returned an invalid category record.", "provider_invalid_response");
        error.diagnosticStatus = "unexpected_response_shape";
        error.failureClassification = "unexpected_response_shape";
        error.stage = stage;
        error.upstreamSuccess = true;
        error.responseShape = getResponseShape(payload, stage);
        error.providerCategoryCount = pageBody.content.length;
        error.providerCategories = pageBody.content
          .filter((category) => typeof category?.code === "string" && typeof category?.name === "string")
          .map((category) => ({ code: category.code, name: category.name }));
        throw error;
      }
      records.push(...pageBody.content);
      const nextPage = pageBody.nextPage;
      if (nextPage === null || nextPage === undefined || nextPage === "") return records;
      const nextPageNumber = Number(nextPage);
      if (!Number.isInteger(nextPageNumber) || nextPageNumber < 0 || nextPageNumber === page) {
        const error = createProviderError("Monnify returned invalid catalogue pagination.", "provider_invalid_response");
        error.diagnosticStatus = `${stage}_retrieval_failed`;
        error.stage = stage;
        throw error;
      }
      page = nextPageNumber;
    }
    const error = createProviderError("Monnify catalogue pagination exceeded the supported limit.", "provider_invalid_response");
    error.diagnosticStatus = `${stage}_retrieval_failed`;
    error.stage = stage;
    throw error;
  }

  function getServiceForCategory(categoryCode) {
    const code = String(categoryCode || "").trim().toUpperCase();
    return Object.entries(BILLING_SERVICES).find(([, categoryCodes]) => categoryCodes.has(code))?.[0] || "";
  }

  async function getCatalogue({ refresh = false } = {}) {
    if (!refresh && catalogueCache.value && catalogueCache.expiresAt > Date.now()) {
      return {
        ...catalogueCache.value,
        diagnostics: {
          ...catalogueCache.value.diagnostics,
          catalogueCacheHit: true
        }
      };
    }
    if (cataloguePromise) return cataloguePromise;
    cataloguePromise = (async () => {
      const catalogueFetchedAt = new Date().toISOString();
      let upstream = {
        upstreamStatus: null,
        upstreamSuccess: false,
        responseShape: "unavailable",
        providerErrorCode: null,
        providerErrorMessage: null
      };
      let categoryRows;
      try {
        categoryRows = await getPages(
          "/api/v1/vas/bills-payment/biller-categories",
          {},
          "catalogue",
          (responseDiagnostics) => {
            upstream = responseDiagnostics;
          }
        );
      } catch (error) {
        Object.assign(error, {
          catalogueFetchedAt,
          environment: getEnvironment(),
          upstreamStatus: error.upstreamStatus ?? upstream.upstreamStatus,
          upstreamSuccess: error.upstreamSuccess ?? upstream.upstreamSuccess,
          responseShape: error.responseShape || upstream.responseShape,
          providerErrorCode: error.providerErrorCode ?? upstream.providerErrorCode,
          providerErrorMessage: error.providerErrorMessage ?? upstream.providerErrorMessage,
          providerCategoryCount: error.providerCategoryCount ?? null,
          providerCategories: error.providerCategories || [],
          catalogueCacheHit: false
        });
        throw error;
      }
      if (!Array.isArray(categoryRows)) {
        const error = createProviderError("Monnify returned an invalid category list.", "provider_invalid_response");
        error.diagnosticStatus = "unexpected_response_shape";
        error.failureClassification = "unexpected_response_shape";
        error.stage = "catalogue";
        Object.assign(error, {
          catalogueFetchedAt,
          environment: getEnvironment(),
          ...upstream,
          providerCategoryCount: error.providerCategoryCount ?? null,
          providerCategories: error.providerCategories || [],
          catalogueCacheHit: false
        });
        throw error;
      }
      const categories = Object.fromEntries(Object.keys(BILLING_SERVICES).map((service) => [
        service,
        {
          available: false,
          status: "unsupported",
          billers: [],
          products: [],
          message: "This service is not currently listed in the Monnify catalogue."
        }
      ]));
      const supportedCategories = categoryRows.filter((category) => getServiceForCategory(category?.code));
      try {
        for (const category of supportedCategories) {
          const service = getServiceForCategory(category.code);
          const billers = await getPages("/api/v1/vas/bills-payment/billers", {
            categoryCode: category.code
          }, "biller");
          const current = categories[service];
          current.available = true;
          current.status = "available";
          current.category = { code: category.code, name: category.name };
          current.billers.push(...billers
            .filter((biller) => typeof biller?.code === "string" && typeof biller?.name === "string")
            .map((biller) => ({ code: biller.code, name: biller.name })));
          current.message = current.billers.length
            ? ""
            : "Monnify currently lists no billers for this service.";
        }
      } catch (error) {
        Object.assign(error, {
          catalogueFetchedAt,
          environment: getEnvironment(),
          providerCategoryCount: categoryRows.length,
          providerCategories: categoryRows
            .filter((category) => typeof category?.code === "string" && typeof category?.name === "string")
            .map((category) => ({ code: category.code, name: category.name })),
          catalogueCacheHit: false
        });
        throw error;
      }
      const value = {
        ok: true,
        available: supportedCategories.length > 0,
        status: supportedCategories.length
          ? "available"
          : categoryRows.length
            ? "no_supported_categories"
            : "empty_categories",
        categories,
        message: supportedCategories.length
          ? ""
          : categoryRows.length
            ? "Monnify returned categories, but none match the supported bill services."
            : "Monnify returned no bill categories. Verify the selected environment and provider catalogue response.",
        diagnostics: {
          stage: "catalogue",
          environment: getEnvironment(),
          ...upstream,
          providerCategoryCount: categoryRows.length,
          providerCategories: categoryRows
            .filter((category) => typeof category?.code === "string" && typeof category?.name === "string")
            .map((category) => ({ code: category.code, name: category.name })),
          catalogueFetchedAt,
          catalogueCacheHit: false,
          supportedCategoryCount: supportedCategories.length
        }
      };
      catalogueCache.value = value;
      catalogueCache.expiresAt = Date.now() + CATALOGUE_CACHE_MS;
      return value;
    })();
    try {
      return await cataloguePromise;
    } finally {
      cataloguePromise = null;
    }
  }

  async function getProducts(billerCode) {
    if (typeof billerCode !== "string" || !billerCode.trim()) {
      throw createProviderError("A biller code is required.", "invalid_input", 400);
    }
    const catalogue = await getCatalogue();
    const knownBiller = Object.values(catalogue.categories)
      .some((category) => category.billers.some((biller) => biller.code === billerCode));
    if (!knownBiller) {
      throw createProviderError("The selected provider is not in the current Monnify catalogue.", "unknown_biller", 404);
    }
    const cached = productCache.get(billerCode);
    if (cached && cached.expiresAt > Date.now()) return cached.products;
    if (productRequests.has(billerCode)) return productRequests.get(billerCode);
    const request = (async () => {
      const products = await getPages("/api/v1/vas/bills-payment/biller-products", {
        billerCode
      }, "product");
      const normalized = products
        .filter((product) => typeof product?.code === "string" && typeof product?.name === "string")
        .map((product) => ({
          code: product.code,
          name: product.name,
          minAmount: product.minAmount ?? null,
          maxAmount: product.maxAmount ?? null,
          price: product.price ?? null,
          priceType: product.priceType || "",
          categories: Array.isArray(product.categories) ? product.categories : [],
          biller: Array.isArray(product.biller) ? product.biller : [],
          metadata: product.metadata && typeof product.metadata === "object" ? product.metadata : {}
        }));
      productCache.set(billerCode, {
        products: normalized,
        expiresAt: Date.now() + CATALOGUE_CACHE_MS
      });
      return normalized;
    })();
    productRequests.set(billerCode, request);
    try {
      return await request;
    } finally {
      if (productRequests.get(billerCode) === request) productRequests.delete(billerCode);
    }
  }

  async function validateCustomer({ productCode, customerId } = {}) {
    if (typeof productCode !== "string" || !productCode.trim()
      || !isValidCustomerIdentifier(customerId)) {
      throw createProviderError("A product code and customer identifier are required.", "invalid_input", 400);
    }
    const payload = await request("/api/v1/vas/bills-payment/validate-customer", {
      method: "POST",
      body: { productCode, customerId },
      stage: "customer_validation"
    });
    const result = payload.responseBody;
    const instruction = result?.vendInstruction;
    if (!result || typeof instruction?.requireValidationRef !== "boolean"
      || (instruction.requireValidationRef
        && (typeof instruction.validationReference !== "string" || !instruction.validationReference))) {
      throw createProviderError("Monnify returned an incomplete customer validation response.", "provider_invalid_response");
    }
    return {
      productCode,
      customerId,
      ...(typeof result.customerName === "string" ? { customerName: result.customerName } : {}),
      priceType: typeof result.priceType === "string" ? result.priceType : "",
      price: result.price ?? null,
      requireValidationRef: instruction.requireValidationRef,
      ...(instruction.requireValidationRef
        ? { validationReference: instruction.validationReference }
        : {})
    };
  }

  async function vend({
    productCode,
    customerId,
    amount,
    reference,
    emailAddress,
    phoneNumber,
    validation
  } = {}) {
    if (!validation || validation.productCode !== productCode
      || validation.customerId !== customerId
      || typeof validation.requireValidationRef !== "boolean") {
      throw createProviderError("A matching Monnify customer validation is required before vending.", "validation_required", 400);
    }
    if (validation.requireValidationRef
      && (typeof validation.validationReference !== "string" || !validation.validationReference)) {
      throw createProviderError("The validated customer reference is required before vending.", "validation_required", 400);
    }
    if (typeof productCode !== "string" || !productCode
      || typeof customerId !== "string" || !customerId
      || typeof reference !== "string" || !reference
      || typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
      throw createProviderError("The vending request is invalid.", "invalid_input", 400);
    }
    const body = {
      productCode,
      customerId,
      vendAmount: amount,
      vendReference: reference,
      ...(validation.requireValidationRef
        ? { validationReference: validation.validationReference }
        : {}),
      ...(emailAddress ? { emailAddress } : {}),
      ...(phoneNumber ? { phoneNumber } : {})
    };
    const payload = await request("/api/v1/vas/bills-payment/vend", {
      method: "POST",
      body,
      stage: "vending"
    });
    const result = payload.responseBody;
    if (!result || typeof result.vendStatus !== "string" || !result.vendReference) {
      const error = createProviderError("Monnify returned an incomplete vending response.", "provider_invalid_response");
      error.outcomeUncertain = true;
      throw error;
    }
    return { ...result, raw: payload };
  }

  async function requery(reference) {
    if (typeof reference !== "string" || !reference.trim()) {
      throw createProviderError("A vending reference is required for requery.", "invalid_input", 400);
    }
    const payload = await request("/api/v1/vas/bills-payment/requery", {
      query: { reference },
      stage: "requery"
    });
    const result = payload.responseBody;
    if (!result || typeof result.vendStatus !== "string") {
      throw createProviderError("Monnify returned an incomplete requery response.", "provider_invalid_response");
    }
    return { ...result, raw: payload };
  }

  return {
    isConfigured: () => getMissingConfiguration().length === 0,
    getMissingConfiguration,
    getEnvironment() {
      return getEnvironment();
    },
    getAccessToken: authenticate,
    getCatalogue,
    getProducts,
    validateCustomer,
    vend,
    requery,
    clearCaches() {
      tokenCache = null;
      cataloguePromise = null;
      catalogueCache.expiresAt = 0;
      catalogueCache.value = null;
      productCache.clear();
      productRequests.clear();
    }
  };
}

module.exports = {
  buildProviderAdapter,
  readEnv,
  normalizeConfigValue,
  isValidCustomerIdentifier
};
