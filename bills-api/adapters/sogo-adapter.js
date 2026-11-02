"use strict";

const crypto = require("node:crypto");

const SANDBOX_BASE_URL = "https://sandbox.sogo.africa/v1";
const SOGO_EVENTS = new Set([
  "transaction.completed",
  "transaction.failed",
  "transaction.refunded"
]);
const SOGO_FAILURE_CATEGORIES = new Set([
  "authentication",
  "authorization",
  "rate_limit",
  "upstream_unavailable",
  "timeout",
  "network_failure",
  "invalid_response",
  "unknown"
]);

function getSafeProviderErrorCode(payload, secretKey) {
  const candidates = [payload?.error?.code, payload?.code];
  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;
    const code = candidate.trim();
    if (!/^[A-Za-z][A-Za-z0-9_.-]{0,63}$/.test(code)
      || code === secretKey
      || /^(?:sogo_sk_|sk_|pk_|bearer|token|secret|eyJ)/i.test(code)) continue;
    return code.toLowerCase();
  }
  return undefined;
}

function getSogoFailureCategory(statusCode) {
  if (statusCode === 401) return "authentication";
  if (statusCode === 403) return "authorization";
  if (statusCode === 429) return "rate_limit";
  if (statusCode === 408 || statusCode === 504) return "timeout";
  if (Number.isInteger(statusCode) && statusCode >= 500) return "upstream_unavailable";
  return "unknown";
}

function getSogoFailureDiagnostics(error) {
  const statusCode = Number.isInteger(error?.statusCode)
    && error.statusCode >= 100
    && error.statusCode <= 599
    ? error.statusCode
    : undefined;
  const providerErrorCode = getSafeProviderErrorCode(
    { code: error?.providerErrorCode },
    ""
  );
  const failureCategory = SOGO_FAILURE_CATEGORIES.has(error?.failureCategory)
    ? error.failureCategory
    : statusCode === undefined
      ? "unknown"
      : getSogoFailureCategory(statusCode);

  return {
    operation: "sogo_catalogue",
    ...(statusCode === undefined ? {} : { upstreamStatus: statusCode }),
    ...(providerErrorCode === undefined ? {} : { providerErrorCode }),
    failureCategory,
    upstreamResponseReceived: error?.upstreamResponseReceived === true
  };
}

function createSogoAdapter({
  readEnv = (name) => process.env[name] || "",
  fetchImpl = globalThis.fetch
} = {}) {
  function getConfiguration() {
    const baseUrl = String(readEnv("SOGO_API_BASE_URL") || "").trim().replace(/\/+$/, "");
    const secretKey = String(readEnv("SOGO_SECRET_KEY") || "").trim();
    const enabled = String(readEnv("SOGO_ENABLED") || "").trim().toLowerCase() === "true";
    const timeoutValue = Number(readEnv("SOGO_TIMEOUT_MS") || 20000);
    let validSandboxUrl = false;
    try {
      const url = new URL(baseUrl);
      validSandboxUrl = url.href.replace(/\/+$/, "") === SANDBOX_BASE_URL
        && url.protocol === "https:"
        && !url.username
        && !url.password
        && !url.search
        && !url.hash;
    } catch {}

    return {
      baseUrl,
      secretKey,
      enabled,
      validSandboxUrl,
      timeoutMs: Number.isSafeInteger(timeoutValue) && timeoutValue > 0 && timeoutValue <= 120000
        ? timeoutValue
        : 20000
    };
  }

  function isConfigured() {
    const config = getConfiguration();
    return config.enabled
      && config.validSandboxUrl
      && /^sogo_sk_test_.{8,}$/.test(config.secretKey);
  }

  function isWebhookConfigured() {
    return isConfigured() && Boolean(String(readEnv("SOGO_WEBHOOK_SECRET") || "").trim());
  }

  function getMissingConfiguration({ webhook = false } = {}) {
    const config = getConfiguration();
    const missing = [];
    if (!config.enabled) missing.push("SOGO_ENABLED");
    if (!config.validSandboxUrl) missing.push("SOGO_API_BASE_URL");
    if (!/^sogo_sk_test_.{8,}$/.test(config.secretKey)) missing.push("SOGO_SECRET_KEY (sandbox key required)");
    if (webhook && !String(readEnv("SOGO_WEBHOOK_SECRET") || "").trim()) {
      missing.push("SOGO_WEBHOOK_SECRET");
    }
    return missing;
  }

  async function request(path, { method = "GET", body, headers = {}, idempotencyKey } = {}) {
    if (!isConfigured()) {
      const error = new Error("Sogo sandbox is unavailable until its enabled sandbox configuration is complete.");
      error.code = "sogo_not_configured";
      throw error;
    }
    if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
      throw new Error("Sogo endpoint path is invalid.");
    }
    if (idempotencyKey && !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idempotencyKey)) {
      throw new Error("Sogo idempotency key must be a UUID v4.");
    }

    const config = getConfiguration();
    let response;
    try {
      response = await fetchImpl(`${config.baseUrl}${path}`, {
        method,
        headers: {
          Accept: "application/json",
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
          Authorization: `Bearer ${config.secretKey}`,
          ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
          ...headers
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(config.timeoutMs)
      });
    } catch (requestError) {
      const error = new Error("Sogo sandbox request outcome is uncertain; reconcile before retrying.");
      error.code = "sogo_request_uncertain";
      error.uncertain = method === "POST";
      error.failureCategory = requestError?.name === "TimeoutError"
        || requestError?.code === "ETIMEDOUT"
        ? "timeout"
        : "network_failure";
      error.upstreamResponseReceived = false;
      throw error;
    }

    let responseText;
    try {
      responseText = await response.text();
    } catch {
      const error = new Error("Sogo sandbox returned an invalid response.");
      error.code = "sogo_invalid_response";
      error.statusCode = response.status;
      error.failureCategory = "invalid_response";
      error.upstreamResponseReceived = true;
      error.uncertain = method === "POST" && response.status >= 500;
      throw error;
    }
    let payload;
    try {
      payload = responseText ? JSON.parse(responseText) : {};
    } catch {
      const error = new Error("Sogo sandbox returned an invalid response.");
      error.code = "sogo_invalid_response";
      error.statusCode = response.status;
      error.failureCategory = "invalid_response";
      error.upstreamResponseReceived = true;
      error.uncertain = method === "POST" && response.status >= 500;
      throw error;
    }

    if (!response.ok) {
      const error = new Error(`Sogo sandbox request failed with HTTP ${response.status}.`);
      error.code = response.status === 404 ? "sogo_not_found" : "sogo_request_failed";
      error.statusCode = response.status;
      error.providerErrorCode = getSafeProviderErrorCode(payload, config.secretKey);
      error.failureCategory = getSogoFailureCategory(response.status);
      error.upstreamResponseReceived = true;
      error.uncertain = method === "POST" && response.status >= 500;
      throw error;
    }
    return { payload, statusCode: response.status, replayed: response.headers.get("Idempotency-Replayed") === "true" };
  }

  function getData(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("Sogo returned an invalid data payload.");
    }
    return payload.data ?? payload;
  }

  function getProviders(category) {
    const providers = getData(category);
    if (!providers || typeof providers !== "object" || Array.isArray(providers)) return [];
    const entries = Array.isArray(providers.providers) ? providers.providers : [];
    return entries.filter((provider) => typeof provider?.slug === "string" && provider.slug
      && typeof provider?.name === "string" && provider.name)
      .map(({ slug, name }) => ({ slug, name }));
  }

  async function getCatalogue() {
    const { payload, statusCode } = await request("/bills/catalog");
    const data = payload && typeof payload === "object" && !Array.isArray(payload)
      ? getData(payload)
      : null;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      const error = new Error("Sogo returned an invalid bill catalogue.");
      error.code = "sogo_invalid_response";
      error.statusCode = statusCode;
      error.failureCategory = "invalid_response";
      error.upstreamResponseReceived = true;
      throw error;
    }
    return data;
  }

  async function getDataPlans(network) {
    const query = network ? `?network=${encodeURIComponent(network)}` : "";
    const { payload } = await request(`/bills/data-plans${query}`);
    return getData(payload);
  }

  async function getCablePackages(provider) {
    const query = provider ? `?provider=${encodeURIComponent(provider)}` : "";
    const { payload } = await request(`/bills/cable-packages${query}`);
    return getData(payload);
  }

  async function getEducationPlans() {
    const { payload } = await request("/bills/education-plans");
    return getData(payload);
  }

  async function verifyMeter({ disco_slug, meter_number, meter_type }) {
    const { payload } = await request("/bills/electricity/verify-meter", {
      method: "POST",
      body: { disco_slug, meter_number, meter_type }
    });
    return payload;
  }

  async function verifySmartcard({ provider, smartcard_number }) {
    const { payload } = await request("/bills/cable-tv/verify-smartcard", {
      method: "POST",
      body: { provider, smartcard_number }
    });
    return payload;
  }

  async function verifyJamb({ profile_id }) {
    const { payload } = await request("/bills/education/verify-jamb", {
      method: "POST",
      body: { profile_id }
    });
    return payload;
  }

  async function verifyBetAccount({ provider, account_id }) {
    const { payload } = await request("/bills/bet-funding/verify-account", {
      method: "POST",
      body: { provider, account_id }
    });
    return payload;
  }

  async function purchase(path, body, idempotencyKey) {
    const result = await request(path, { method: "POST", body, idempotencyKey });
    return {
      ...result,
      transaction: getData(result.payload)
    };
  }

  async function purchaseAirtime(body, idempotencyKey) {
    return purchase("/bills/airtime", body, idempotencyKey);
  }

  async function purchaseData(body, idempotencyKey) {
    return purchase("/bills/data", body, idempotencyKey);
  }

  async function purchaseElectricity(body, idempotencyKey) {
    return purchase("/bills/electricity", body, idempotencyKey);
  }

  async function purchaseCableTv(body, idempotencyKey) {
    return purchase("/bills/cable-tv", body, idempotencyKey);
  }

  async function purchaseEducation(body, idempotencyKey) {
    return purchase("/bills/education", body, idempotencyKey);
  }

  async function getTransaction(reference, { byIdempotencyKey = false } = {}) {
    const keyOrReference = encodeURIComponent(reference);
    const query = byIdempotencyKey ? "?type=bill_payment" : "";
    const { payload } = await request(`/transactions/${keyOrReference}${query}`);
    return getData(payload);
  }

  function verifyWebhookSignature(rawBody, signature) {
    if (!Buffer.isBuffer(rawBody) || typeof signature !== "string" || !isWebhookConfigured()) return false;
    const match = signature.match(/^sha256=([a-f0-9]{64})$/i);
    if (!match) return false;
    const expected = crypto.createHmac("sha256", String(readEnv("SOGO_WEBHOOK_SECRET")).trim())
      .update(rawBody)
      .digest();
    const supplied = Buffer.from(match[1], "hex");
    return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
  }

  return Object.freeze({
    provider: "sogo",
    isConfigured,
    isWebhookConfigured,
    getMissingConfiguration,
    getCatalogue,
    getProviders,
    getDataPlans,
    getCablePackages,
    getEducationPlans,
    verifyMeter,
    verifySmartcard,
    verifyJamb,
    verifyBetAccount,
    purchaseAirtime,
    purchaseData,
    purchaseElectricity,
    purchaseCableTv,
    purchaseEducation,
    getTransaction,
    verifyWebhookSignature,
    supportedWebhookEvents: SOGO_EVENTS
  });
}

module.exports = {
  SANDBOX_BASE_URL,
  createSogoAdapter,
  getSogoFailureDiagnostics
};
