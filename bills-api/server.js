const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const http = require("http");
const { URL } = require("url");
const { buildProviderAdapter, readEnv } = require("./provider-adapter");

const APP_ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(__dirname, "data");
const TRANSACTION_STORE_PATH = path.join(DATA_DIR, "transactions.json");
const WEBHOOK_STORE_PATH = path.join(DATA_DIR, "processed-webhooks.json");
const ALLOWED_SERVICES = ["electricity", "airtime", "data", "bills"];

function loadEnvFromFiles() {
  const files = [
    path.join(APP_ROOT, ".env"),
    path.join(__dirname, ".env"),
    path.join(APP_ROOT, "bills-api", ".env")
  ];

  for (const filePath of files) {
    if (!fs.existsSync(filePath)) continue;

    const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

      const separatorIndex = trimmed.indexOf("=");
      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim();
      if (key) {
        process.env[key] = value;
      }
    }
  }
}

loadEnvFromFiles();

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile(filePath, fallback) {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    if (!fileContents.trim()) return fallback;
    return JSON.parse(fileContents);
  } catch (error) {
    return fallback;
  }
}

function writeJsonFile(filePath, content) {
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf8");
}

function readStore() {
  ensureDataDirectory();
  return readJsonFile(TRANSACTION_STORE_PATH, {});
}

function readWebhookStore() {
  ensureDataDirectory();
  return readJsonFile(WEBHOOK_STORE_PATH, {});
}

function persistStore(store) {
  ensureDataDirectory();
  writeJsonFile(TRANSACTION_STORE_PATH, store);
}

function persistWebhookStore(store) {
  ensureDataDirectory();
  writeJsonFile(WEBHOOK_STORE_PATH, store);
}

function nowIso() {
  return new Date().toISOString();
}

function createReference(prefix = "ELECBILLS") {
  const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${dateStamp}-${suffix}`;
}

function parseJsonBody(rawBody) {
  if (!rawBody) return {};

  try {
    return JSON.parse(rawBody);
  } catch (error) {
    throw new Error("Invalid JSON body.");
  }
}

function getMonnifyConfig() {
  return {
    apiKey: readEnv("MONNIFY_API_KEY"),
    secretKey: readEnv("MONNIFY_SECRET_KEY"),
    contractCode: readEnv("MONNIFY_CONTRACT_CODE"),
    baseUrl: readEnv("MONNIFY_BASE_URL") || "https://sandbox.monnify.com",
    webhookSecret: readEnv("MONNIFY_WEBHOOK_SECRET"),
    redirectUrl: readEnv("BILLS_PAYMENT_REDIRECT_URL") || "http://localhost:4173/bills/app/?payment=success",
    appUrl: readEnv("BILLS_APP_URL") || "http://localhost:4173/bills/app/"
  };
}

function toEnvName(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toUpperCase();
}

function getMissingMonnifyConfig() {
  const config = getMonnifyConfig();
  const missing = [];

  ["apiKey", "secretKey", "contractCode", "webhookSecret"].forEach((key) => {
    if (!config[key]) missing.push(`MONNIFY_${toEnvName(key)}`);
  });

  if (!config.baseUrl) missing.push("MONNIFY_BASE_URL");

  return missing;
}

function hasMonnifyConfig() {
  return getMissingMonnifyConfig().length === 0;
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, x-monnify-signature"
  });
  response.end(JSON.stringify(payload));
}

function readPayload(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error("Invalid JSON body."));
      }
    });
    request.on("error", reject);
  });
}

function readRawBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];

    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      resolve(raw);
    });
    request.on("error", reject);
  });
}

function getTransaction(reference) {
  const store = readStore();
  return store[reference] || null;
}

function saveTransaction(reference, transaction) {
  const store = readStore();
  store[reference] = transaction;
  persistStore(store);
}

function upsertTransaction(reference, updater) {
  const store = readStore();
  const current = store[reference] || null;
  const next = updater(current);
  if (!next) return null;
  store[reference] = next;
  persistStore(store);
  return next;
}

async function requestJson(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const rawText = await response.text();
  let payload = {};

  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch (error) {
      payload = { raw: rawText };
    }
  }

  if (!response.ok) {
    const errorMessage = payload?.message || payload?.error || payload?.responseMessage || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return payload;
}

async function authenticateMonnify() {
  if (!hasMonnifyConfig()) {
    throw new Error("Monnify sandbox is not configured. Set MONNIFY_API_KEY, MONNIFY_SECRET_KEY, MONNIFY_CONTRACT_CODE, and MONNIFY_WEBHOOK_SECRET.");
  }

  const config = getMonnifyConfig();
  const endpoint = `${config.baseUrl.replace(/\/$/, "")}/api/v1/auth/login`;
  const payload = await requestJson(endpoint, {
    method: "POST",
    body: {
      apiKey: config.apiKey,
      secretKey: config.secretKey
    }
  });

  const token = payload?.data?.accessToken || payload?.accessToken || payload?.token;
  if (!token) {
    throw new Error("Monnify authentication succeeded without returning an access token.");
  }

  return {
    token,
    config
  };
}

async function createMonnifyReservation(transaction) {
  const { token, config } = await authenticateMonnify();
  const endpoint = `${config.baseUrl.replace(/\/$/, "")}/api/v1/transactions/init-transaction`;
  const payload = {
    amount: Number(transaction.amount),
    currency: "NGN",
    reference: transaction.reference,
    contractCode: config.contractCode,
    redirectUrl: config.redirectUrl,
    customerName: transaction.customer?.name || "Electrony Bills Customer",
    customerEmail: transaction.customer?.email || "guest@electrony.com",
    customerMobileNumber: transaction.customer?.phone || "08000000000",
    paymentMethods: ["CARD", "ACCOUNT_TRANSFER", "USSD", "BANK_TRANSFER"],
    narration: `Electrony Bills ${transaction.service} purchase`,
    metadata: {
      service: transaction.service,
      internalReference: transaction.reference,
      provider: "monnify",
      webhookUrl: `${readEnv("BILLS_WEBHOOK_BASE_URL") || "http://localhost:4174"}/api/payments/webhook`
    }
  };

  const response = await requestJson(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: payload
  });

  const transactionReference = response?.data?.transactionReference || response?.transactionReference || response?.reference || transaction.reference;
  const checkoutUrl = response?.data?.checkoutUrl || response?.checkoutUrl || response?.paymentLink || response?.data?.paymentLink || response?.data?.authorizationUrl || "";

  return {
    monnifyReference: transactionReference,
    checkoutUrl,
    raw: response
  };
}

function extractMonnifyStatus(payload) {
  const candidate = payload?.data || payload?.result || payload || {};
  const status = candidate.paymentStatus || candidate.status || candidate.transactionStatus || payload.status || payload.paymentStatus || "";
  const normalized = String(status).toUpperCase();

  if (["PAID", "SUCCESS", "SUCCESSFUL", "COMPLETED"].includes(normalized)) return "paid";
  if (["PENDING", "AWAITING_PAYMENT", "PROCESSING"].includes(normalized)) return "payment_pending";
  if (["FAILED", "DECLINED", "CANCELLED", "CANCELED"].includes(normalized)) return "payment_failed";
  return normalized || "unknown";
}

async function getMonnifyTransactionStatus(transaction) {
  const { token, config } = await authenticateMonnify();
  const reference = transaction.monnifyReference || transaction.reference;
  const candidates = [
    `${config.baseUrl.replace(/\/$/, "")}/api/v1/transactions/query?reference=${encodeURIComponent(reference)}`,
    `${config.baseUrl.replace(/\/$/, "")}/api/v1/transactions/${encodeURIComponent(reference)}`,
    `${config.baseUrl.replace(/\/$/, "")}/api/v1/transactions/query?transactionReference=${encodeURIComponent(reference)}`
  ];

  for (const endpoint of candidates) {
    try {
      const payload = await requestJson(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const status = extractMonnifyStatus(payload);
      if (status && status !== "unknown") {
        return {
          status,
          raw: payload
        };
      }
    } catch (error) {
      // try next candidate if one endpoint is unavailable.
    }
  }

  return { status: "unknown", raw: {} };
}

function getProviderAdapter() {
  return buildProviderAdapter();
}

async function processVendingForTransaction(transaction) {
  const provider = getProviderAdapter();
  if (!provider.isConfigured()) {
    return {
      ok: false,
      status: "pending_reconciliation",
      message: "No vending provider is configured. Set BILLS_PROVIDER_* or BILLS_VENDING_PROVIDER before enabling bill fulfillment."
    };
  }

  const payload = {
    reference: transaction.reference,
    amount: transaction.amount,
    service: transaction.service,
    customer: transaction.customer,
    providerReference: transaction.providerReference,
    metadata: transaction.metadata || {}
  };

  if (transaction.service === "electricity") {
    const validation = await provider.validateMeter({
      distributor: transaction.customer?.disco || transaction.customer?.company || "",
      meterNumber: transaction.customer?.meterNumber || "",
      meterType: transaction.customer?.meterType || "prepaid"
    });

    if (!validation?.ok) {
      return {
        ok: false,
        status: "payment_failed",
        message: validation?.message || "Meter validation failed before service delivery."
      };
    }

    const result = await provider.purchaseElectricity({
      ...payload,
      meterNumber: transaction.customer?.meterNumber || "",
      distributor: transaction.customer?.disco || transaction.customer?.company || "",
      meterType: transaction.customer?.meterType || "prepaid",
      amount: transaction.amount
    });

    return result;
  }

  if (transaction.service === "airtime") {
    return provider.purchaseAirtime({
      ...payload,
      network: transaction.customer?.network || "",
      recipient: transaction.customer?.recipient || "",
      amount: transaction.amount
    });
  }

  if (transaction.service === "data") {
    return provider.purchaseData({
      ...payload,
      network: transaction.customer?.network || "",
      recipient: transaction.customer?.recipient || "",
      plan: transaction.customer?.plan || "",
      amount: transaction.amount
    });
  }

  if (transaction.service === "bills") {
    return provider.purchaseBill({
      ...payload,
      biller: transaction.customer?.biller || "",
      customerId: transaction.customer?.customerId || "",
      plan: transaction.customer?.plan || "",
      amount: transaction.amount
    });
  }

  return {
    ok: false,
    status: "pending_reconciliation",
    message: "Unsupported service type."
  };
}

function normalizeService(service) {
  if (!service || !ALLOWED_SERVICES.includes(service)) {
    return "";
  }
  return service;
}

function normalizePhoneNumber(value) {
  return String(value || "").replace(/\s+/g, "").trim();
}

function isValidNigerianPhone(value) {
  const number = normalizePhoneNumber(value);
  return /^(\+234|234|0)[789][01]\d{8}$/.test(number);
}

function getExpectedAmount(service, customer = {}) {
  const amount = Number(customer.amount ?? 0);

  if (service === "electricity" || service === "airtime") {
    return Number.isFinite(amount) ? amount : 0;
  }

  if (service === "data") {
    const network = String(customer.network || "").toLowerCase();
    const dataPlans = {
      mtn: { "mtn-1gb": 130, "mtn-5gb": 650, "mtn-20gb": 2800 },
      airtel: { "airtel-1gb": 150, "airtel-10gb": 1650 },
      glo: { "glo-1gb": 110, "glo-10gb": 1450 },
      "9mobile": { "9m-2gb": 630, "9m-15gb": 2200 }
    };
    const planValue = String(customer.plan || "");
    const planPrice = dataPlans[network]?.[planValue];
    return Number.isFinite(planPrice) ? planPrice : 0;
  }

  if (service === "bills") {
    const billPlans = {
      compact: 9000,
      "compact-plus": 15000,
      premium: 19000
    };
    const planValue = String(customer.plan || "");
    const planPrice = billPlans[planValue];
    return Number.isFinite(planPrice) ? planPrice : 0;
  }

  return 0;
}

function validateServiceRequest(payload) {
  const service = normalizeService(payload.service);
  if (!service) {
    throw new Error("Unsupported service type.");
  }

  const rawAmount = Number(payload.amount ?? 0);
  if (!Number.isFinite(rawAmount) || rawAmount <= 0) {
    throw new Error("Amount must be a positive number.");
  }

  const customer = {
    name: String(payload.customerName || payload.name || "Electrony Bills Customer").trim(),
    email: String(payload.customerEmail || payload.email || "guest@electrony.com").trim(),
    phone: normalizePhoneNumber(payload.customerPhone || payload.phone || payload.recipient || ""),
    meterNumber: String(payload.meterNumber || "").trim(),
    meterType: String(payload.meterType || "prepaid").trim() || "prepaid",
    disco: String(payload.disco || "").trim(),
    network: String(payload.network || "").trim(),
    recipient: normalizePhoneNumber(payload.recipient || payload.customerPhone || payload.phone || ""),
    customerId: String(payload.customerId || "").trim(),
    biller: String(payload.biller || "").trim(),
    plan: String(payload.plan || "").trim()
  };

  if (service === "electricity") {
    if (!/^\d{6,14}$/.test(customer.meterNumber)) {
      throw new Error("A valid meter number is required for electricity purchases.");
    }
    if (!isValidNigerianPhone(customer.phone)) {
      throw new Error("A valid customer phone number is required for electricity purchases.");
    }
    if (rawAmount > 5000000) {
      throw new Error("Electricity amount exceeds the supported maximum.");
    }
  }

  if (service === "airtime") {
    if (!isValidNigerianPhone(customer.recipient || customer.phone)) {
      throw new Error("A valid phone number is required for airtime purchases.");
    }
    if (rawAmount > 500000) {
      throw new Error("Airtime amount exceeds the supported maximum.");
    }
  }

  if (service === "data") {
    if (!isValidNigerianPhone(customer.recipient || customer.phone)) {
      throw new Error("A valid phone number is required for data purchases.");
    }
    const expected = getExpectedAmount(service, { network: customer.network, plan: customer.plan });
    if (!customer.plan || !expected) {
      throw new Error("Select a valid data bundle before continuing.");
    }
    if (rawAmount !== expected) {
      throw new Error("The selected data bundle amount does not match the configured price.");
    }
  }

  if (service === "bills") {
    if (!customer.customerId || customer.customerId.length < 4) {
      throw new Error("A valid smart card or decoder number is required.");
    }
    const expected = getExpectedAmount(service, { plan: customer.plan });
    if (!customer.plan || !expected) {
      throw new Error("Select a valid bill package before continuing.");
    }
    if (rawAmount !== expected) {
      throw new Error("The selected package amount does not match the configured price.");
    }
  }

  return {
    service,
    amount: rawAmount,
    customer
  };
}

async function handleWebhook(request, response) {
  try {
    const rawBody = await readRawBody(request);
    const signature = request.headers["x-monnify-signature"] || request.headers["X-Monnify-Signature"] || request.headers["x-monnify-signature"] || "";
    const webhookSecret = readEnv("MONNIFY_WEBHOOK_SECRET") || "";

    if (webhookSecret && signature) {
      const expected = crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex");
      if (expected !== signature) {
        sendJson(response, 401, { ok: false, error: "Webhook signature verification failed." });
        return;
      }
    }

    if (!rawBody.trim()) {
      sendJson(response, 400, { ok: false, error: "Missing webhook payload." });
      return;
    }

    const payload = parseJsonBody(rawBody);
    const event = payload?.event || payload?.data || payload;
    const transactionReference = event?.transactionReference || event?.reference || payload?.reference || "";
    const eventId = `${transactionReference}:${event?.eventType || payload?.eventType || "payment"}`;
    const processed = readWebhookStore();

    if (processed[eventId]) {
      sendJson(response, 200, { ok: true, duplicate: true, reference: transactionReference });
      return;
    }

    processed[eventId] = { processedAt: nowIso(), reference: transactionReference };
    persistWebhookStore(processed);

    const transaction = getTransaction(transactionReference) || getTransaction(event?.customerReference || event?.paymentReference || "");

    if (!transaction) {
      sendJson(response, 202, { ok: true, queued: true, reference: transactionReference, note: "Webhook accepted, but no matching local transaction was found." });
      return;
    }

    const monnifyStatus = extractMonnifyStatus(payload);
    if (monnifyStatus === "paid") {
      transaction.paymentStatus = "payment_success";
      transaction.status = "processing";
      transaction.fulfillmentStatus = "processing";
      transaction.monnifyReference = transaction.monnifyReference || transactionReference;
      transaction.updatedAt = nowIso();
      saveTransaction(transaction.reference, transaction);

      const vendingResult = await processVendingForTransaction(transaction);

      transaction.providerReference = vendingResult?.providerReference || transaction.providerReference || "";
      transaction.providerMessage = vendingResult?.message || "";
      transaction.fulfillmentStatus = vendingResult?.ok ? "success" : (vendingResult?.status || "pending");
      transaction.paymentStatus = "payment_success";
      transaction.status = vendingResult?.ok ? "success" : (vendingResult?.status === "pending_reconciliation" ? "pending" : "failed");
      transaction.updatedAt = nowIso();
      saveTransaction(transaction.reference, transaction);

      sendJson(response, 200, {
        ok: true,
        reference: transaction.reference,
        vendorStatus: transaction.status,
        providerMessage: vendingResult?.message || "Webhook processed successfully."
      });
      return;
    }

    if (monnifyStatus === "payment_failed") {
      transaction.status = "payment_failed";
      transaction.paymentStatus = "payment_failed";
      transaction.fulfillmentStatus = "not_started";
      transaction.updatedAt = nowIso();
      saveTransaction(transaction.reference, transaction);
      sendJson(response, 200, { ok: true, reference: transaction.reference, status: transaction.status });
      return;
    }

    transaction.status = monnifyStatus === "payment_pending" ? "payment_pending" : "pending";
    transaction.paymentStatus = monnifyStatus || "payment_pending";
    transaction.updatedAt = nowIso();
    saveTransaction(transaction.reference, transaction);
    sendJson(response, 200, { ok: true, reference: transaction.reference, status: transaction.status });
  } catch (error) {
    sendJson(response, 400, { ok: false, error: error.message || "Unable to process webhook." });
  }
}

const port = Number(readEnv("ELECTRONY_BILLS_PORT") || 4174);

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "GET" && url.pathname === "/health") {
    sendJson(response, 200, {
      ok: true,
      service: "electrony-bills",
      mode: hasMonnifyConfig() ? "monnify-sandbox" : "configuration-required",
      hasDatabase: fs.existsSync(TRANSACTION_STORE_PATH)
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/payments/session") {
    try {
      const payload = await readPayload(request);
      const validation = validateServiceRequest(payload);
      const reference = String(payload.reference || createReference());

      const existing = getTransaction(reference);
      if (existing && existing.status !== "cancelled") {
        sendJson(response, 200, {
          ok: true,
          reference: existing.reference,
          amount: existing.amount,
          status: existing.status,
          mode: "monnify-sandbox",
          checkoutUrl: existing.checkoutUrl || "",
          idempotent: true
        });
        return;
      }

      const transaction = {
        reference,
        service: validation.service,
        amount: validation.amount,
        status: "created",
        paymentStatus: "not_started",
        fulfillmentStatus: "not_started",
        createdAt: nowIso(),
        updatedAt: nowIso(),
        customer: validation.customer,
        metadata: payload.metadata || {},
        providerReference: "",
        monnifyReference: "",
        checkoutUrl: "",
        note: "Transaction stored before external payment authorization."
      };

      saveTransaction(reference, transaction);

      if (!hasMonnifyConfig()) {
        const missing = getMissingMonnifyConfig();
        const updated = {
          ...transaction,
          status: "awaiting_payment",
          paymentStatus: "configuration_required",
          note: "Monnify sandbox is not configured. Set required environment values before launching a real checkout.",
          requiredConfig: missing
        };
        saveTransaction(reference, updated);

        sendJson(response, 503, {
          ok: false,
          error: "Monnify sandbox is not configured.",
          reference,
          requiredConfig: missing,
          note: "Set MONNIFY_API_KEY, MONNIFY_SECRET_KEY, MONNIFY_CONTRACT_CODE, MONNIFY_WEBHOOK_SECRET, and MONNIFY_BASE_URL before processing real transactions."
        });
        return;
      }

      try {
        const result = await createMonnifyReservation(transaction);
        const updated = {
          ...transaction,
          status: "awaiting_payment",
          paymentStatus: "payment_pending",
          monnifyReference: result.monnifyReference,
          checkoutUrl: result.checkoutUrl,
          updatedAt: nowIso(),
          note: "Monnify sandbox session created. Payment remains pending until customer authorization."
        };

        saveTransaction(reference, updated);

        sendJson(response, 200, {
          ok: true,
          reference,
          amount,
          status: "awaiting_payment",
          mode: "monnify-sandbox",
          checkoutUrl: result.checkoutUrl,
          monnifyReference: result.monnifyReference,
          note: "Only the payment redirect URL is exposed to the browser. Monnify credentials remain server-side only."
        });
      } catch (error) {
        const updated = {
          ...transaction,
          status: "payment_failed",
          paymentStatus: "configuration_error",
          updatedAt: nowIso(),
          note: error.message || "Unable to create Monnify reservation."
        };
        saveTransaction(reference, updated);

        sendJson(response, 502, {
          ok: false,
          error: error.message || "Unable to create Monnify reservation.",
          reference
        });
      }
      return;
    } catch (error) {
      sendJson(response, 400, { ok: false, error: error.message || "Unable to create checkout session." });
      return;
    }
  }

  if (request.method === "POST" && url.pathname === "/api/payments/verify") {
    try {
      const payload = await readPayload(request);
      const reference = String(payload.reference || "").trim();

      if (!reference) {
        sendJson(response, 400, { ok: false, error: "Missing payment reference." });
        return;
      }

      const transaction = getTransaction(reference);
      if (!transaction) {
        sendJson(response, 404, { ok: false, error: "Transaction reference not found." });
        return;
      }

      if (!hasMonnifyConfig()) {
        sendJson(response, 400, {
          ok: false,
          error: "Monnify sandbox verification is unavailable because the required configuration is missing.",
          reference,
          status: transaction.status || "unknown"
        });
        return;
      }

      const verification = await getMonnifyTransactionStatus(transaction);
      const paymentStatus = verification.status;

      if (paymentStatus === "paid") {
        transaction.paymentStatus = "payment_success";
        transaction.status = "processing";
        transaction.fulfillmentStatus = "processing";
        transaction.updatedAt = nowIso();
        saveTransaction(reference, transaction);

        sendJson(response, 200, {
          ok: true,
          reference,
          verified: true,
          status: "processing",
          paymentStatus: "payment_success",
          mode: "monnify-sandbox"
        });
        return;
      }

      transaction.paymentStatus = paymentStatus;
      transaction.status = paymentStatus === "payment_pending" ? "payment_pending" : "payment_failed";
      transaction.fulfillmentStatus = paymentStatus === "payment_pending" ? "not_started" : "not_started";
      transaction.updatedAt = nowIso();
      saveTransaction(reference, transaction);

      sendJson(response, 200, {
        ok: true,
        reference,
        verified: false,
        status: transaction.status,
        paymentStatus: transaction.paymentStatus,
        mode: "monnify-sandbox"
      });
      return;
    } catch (error) {
      sendJson(response, 400, { ok: false, error: error.message || "Unable to verify payment." });
      return;
    }
  }

  if (request.method === "GET" && url.pathname === "/api/payments/status") {
    const reference = url.searchParams.get("reference") || "";
    if (!reference) {
      sendJson(response, 400, { ok: false, error: "Missing payment reference." });
      return;
    }

    const transaction = getTransaction(reference);
    if (!transaction) {
      sendJson(response, 404, { ok: false, error: "Transaction reference not found." });
      return;
    }

    sendJson(response, 200, {
      ok: true,
      reference,
      status: transaction.status,
      paymentStatus: transaction.paymentStatus,
      providerReference: transaction.providerReference || "",
      note: "Status checks are intentionally server-side to avoid exposing payment credentials or provider details."
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/payments/webhook") {
    await handleWebhook(request, response);
    return;
  }

  sendJson(response, 404, { ok: false, error: "Route not found." });
});

server.listen(port, () => {
  console.log(`Electrony Bills API listening on http://localhost:${port}`);
});
