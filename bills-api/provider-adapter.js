"use strict";

const TOKEN_REFRESH_MARGIN_MS = 60_000;
const CATALOGUE_CACHE_MS = 5 * 60 * 1000;
const MAX_PAGES = 100;
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

  async function readJsonResponse(response) {
    let payload;
    try {
      payload = await response.json();
    } catch {
      throw createProviderError("Monnify returned an invalid response.", "provider_invalid_response");
    }
    if (!response.ok
      || payload?.requestSuccessful !== true
      || String(payload?.responseCode ?? "") !== "0") {
      const error = createProviderError(
        "Monnify could not complete the request.",
        "provider_request_failed",
        response.status >= 400 && response.status < 600 ? response.status : 502
      );
      error.responseCode = String(payload?.responseCode ?? "");
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
      } catch {
        throw createProviderError("Monnify authentication is temporarily unavailable.", "provider_unavailable");
      }

      const payload = await readJsonResponse(response);
      const body = payload.responseBody;
      const token = typeof body?.accessToken === "string" ? body.accessToken : "";
      if (!token) {
        throw createProviderError("Monnify did not return an access token.", "provider_invalid_response");
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

  async function request(pathname, { method = "GET", query, body } = {}) {
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
    } catch {
      const error = createProviderError("Monnify is temporarily unavailable.", "provider_unavailable");
      if (method === "POST" && pathname.endsWith("/vend")) error.outcomeUncertain = true;
      throw error;
    }
    try {
      return await readJsonResponse(response);
    } catch (error) {
      if (response.status === 401) tokenCache = null;
      if (method === "POST" && pathname.endsWith("/vend") && response.status >= 500) {
        error.outcomeUncertain = true;
      }
      throw error;
    }
  }

  async function getPages(pathname, query = {}) {
    const records = [];
    let page = 1;
    for (let count = 0; count < MAX_PAGES; count += 1) {
      const payload = await request(pathname, {
        query: { ...query, page }
      });
      const pageBody = payload.responseBody;
      if (!Array.isArray(pageBody?.content)) {
        throw createProviderError("Monnify returned an invalid catalogue page.", "provider_invalid_response");
      }
      records.push(...pageBody.content);
      const nextPage = pageBody.nextPage;
      if (nextPage === null || nextPage === undefined || nextPage === "") return records;
      const nextPageNumber = Number(nextPage);
      if (!Number.isInteger(nextPageNumber) || nextPageNumber < 0 || nextPageNumber === page) {
        throw createProviderError("Monnify returned invalid catalogue pagination.", "provider_invalid_response");
      }
      page = nextPageNumber;
    }
    throw createProviderError("Monnify catalogue pagination exceeded the supported limit.", "provider_invalid_response");
  }

  function getServiceForCategory(categoryCode) {
    const code = String(categoryCode || "").trim().toUpperCase();
    return Object.entries(BILLING_SERVICES).find(([, categoryCodes]) => categoryCodes.has(code))?.[0] || "";
  }

  async function getCatalogue() {
    if (catalogueCache.value && catalogueCache.expiresAt > Date.now()) {
      return catalogueCache.value;
    }
    if (cataloguePromise) return cataloguePromise;
    cataloguePromise = (async () => {
      const categoryRows = await getPages("/api/v1/vas/bills-payment/biller-categories");
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
      for (const category of supportedCategories) {
        const service = getServiceForCategory(category.code);
        const billers = await getPages("/api/v1/vas/bills-payment/billers", {
          category_code: category.code
        });
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
      const value = {
        ok: true,
        available: supportedCategories.length > 0,
        status: supportedCategories.length ? "available" : "no_supported_categories",
        categories,
        message: supportedCategories.length
          ? ""
          : "Monnify currently lists no supported bill categories."
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
        biller_code: billerCode
      });
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
      || typeof customerId !== "string" || !customerId.trim()) {
      throw createProviderError("A product code and customer identifier are required.", "invalid_input", 400);
    }
    const payload = await request("/api/v1/vas/bills-payment/validate-customer", {
      method: "POST",
      body: { productCode, customerId }
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
      customerName: typeof result.customerName === "string" ? result.customerName : "",
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
      amount,
      reference,
      ...(validation.requireValidationRef
        ? { validationReference: validation.validationReference }
        : {}),
      ...(emailAddress ? { emailAddress } : {}),
      ...(phoneNumber ? { phoneNumber } : {})
    };
    const payload = await request("/api/v1/vas/bills-payment/vend", {
      method: "POST",
      body
    });
    const result = payload.responseBody;
    if (!result || typeof result.vendStatus !== "string" || !result.vendReference) {
      throw createProviderError("Monnify returned an incomplete vending response.", "provider_invalid_response");
    }
    return { ...result, raw: payload };
  }

  async function requery(reference) {
    if (typeof reference !== "string" || !reference.trim()) {
      throw createProviderError("A vending reference is required for requery.", "invalid_input", 400);
    }
    const payload = await request("/api/v1/vas/bills-payment/requery", {
      query: { reference }
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
  normalizeConfigValue
};
