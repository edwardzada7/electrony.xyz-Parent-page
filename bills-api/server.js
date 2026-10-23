const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { promisify } = require("util");
const os = require("os");
const http = require("http");
const { URL } = require("url");
const { buildProviderAdapter, readEnv } = require("./provider-adapter");
const { createPostgresPersistence } = require("./postgres-persistence");
const { PLATFORM_FEE_RULES, createPlatformFeeQuote, parseMoneyToMinor } = require("./platform-fees");
const {
  CONTACT_BODY_LIMIT,
  ContactEnquiryError,
  submitContactEnquiry
} = require("./contact-enquiries");

const APP_ROOT = path.resolve(__dirname, "..");
const ALLOWED_SERVICES = ["electricity", "airtime", "data", "bills"];
const AUTH_RATE_LIMITS = new Map();
const FEE_QUOTES = new Map();
const TOKEN_LIFETIME_SECONDS = 60 * 60;
const GUEST_ORDER_SECRET_BYTES = 32;
const PAYMENT_OPERATIONS_ENABLED = false;
const BILL_FULFILLMENT_ENABLED = false;
const scrypt = promisify(crypto.scrypt);

function readUsers() {
  ensureDataDirectory();
  return readJsonFile(USER_STORE_PATH, {});
}

function getAuthSecret() {
  const secret = readEnv("BILLS_JWT_SECRET");
  if (secret.length < 32 || /replace_with|change_me|example/i.test(secret)) {
    throw new Error("Account authentication is not configured. Set BILLS_JWT_SECRET to a random value of at least 32 characters.");
  }
  return secret;
}

function signAuthToken(user) {
  const secret = getAuthSecret();
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_SECONDS
  })).toString("base64url");
  const unsigned = `${header}.${payload}`;
  const signature = crypto.createHmac("sha256", secret).update(unsigned).digest("base64url");
  return `${unsigned}.${signature}`;
}

function authenticateRequest(request) {
  const authorization = request.headers.authorization || "";
  const token = authorization.match(/^Bearer ([A-Za-z0-9._-]+)$/)?.[1];
  if (!token) return null;

  try {
    const secret = getAuthSecret();
    const [header, payload, signature, extra] = token.split(".");
    if (!header || !payload || !signature || extra) return null;
    const expected = crypto.createHmac("sha256", secret).update(`${header}.${payload}`).digest();
    const received = Buffer.from(signature, "base64url");
    if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) return null;

    const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof claims.sub !== "string" || claims.exp <= Math.floor(Date.now() / 1000)) return null;
    const user = readUsers()[claims.sub];
    return user ? { id: user.id, email: user.email, name: user.name } : null;
  } catch {
    return null;
  }
}

function createGuestOrderSecret() {
  return crypto.randomBytes(GUEST_ORDER_SECRET_BYTES).toString("base64url");
}

function hashGuestOrderSecret(secret) {
  return crypto.createHash("sha256").update(secret).digest("hex");
}

function canAccessTransaction(transaction, user, guestOrderSecret) {
  if (transaction.userId !== null && transaction.userId !== undefined) {
    return user?.id === transaction.userId;
  }
  if (typeof guestOrderSecret !== "string"
    || !/^[A-Za-z0-9_-]{43}$/.test(guestOrderSecret)
    || Buffer.from(guestOrderSecret, "base64url").length !== GUEST_ORDER_SECRET_BYTES
    || Buffer.from(guestOrderSecret, "base64url").toString("base64url") !== guestOrderSecret) {
    return false;
  }

  const storedHashValue = String(transaction.guestAccessHash || "");
  if (!/^[a-f0-9]{64}$/.test(storedHashValue)) return false;
  const storedHash = Buffer.from(storedHashValue, "hex");
  const suppliedHash = Buffer.from(hashGuestOrderSecret(guestOrderSecret), "hex");
  return storedHash.length === suppliedHash.length
    && crypto.timingSafeEqual(storedHash, suppliedHash);
}

function enforceAuthRateLimit(request) {
  const key = request.socket.remoteAddress || "unknown";
  const now = Date.now();
  const recent = (AUTH_RATE_LIMITS.get(key) || []).filter((timestamp) => now - timestamp < 15 * 60 * 1000);
  if (recent.length >= 10) return false;
  recent.push(now);
  AUTH_RATE_LIMITS.set(key, recent);
  return true;
}

function createQuoteToken(quote) {
  const token = crypto.randomBytes(32).toString("hex");
  FEE_QUOTES.set(token, {
    service: quote.service,
    amountMinor: quote.serviceAmountMinor,
    platformFeeMinor: quote.platformFeeMinor,
    expiresAt: Date.now() + 5 * 60 * 1000
  });
  for (const [key, value] of FEE_QUOTES) {
    if (value.expiresAt <= Date.now()) FEE_QUOTES.delete(key);
  }
  return token;
}

function verifyQuoteToken(token, quote) {
  const claims = FEE_QUOTES.get(token);
  return Boolean(claims
    && claims.expiresAt > Date.now()
    && claims.service === quote.service
    && claims.amountMinor === quote.serviceAmountMinor
    && claims.platformFeeMinor === quote.platformFeeMinor);
}

async function hashPassword(password, salt) {
  return scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 });
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

async function createAccount(payload) {
  const email = normalizeEmail(payload.email);
  const name = String(payload.name || "").trim();
  const password = String(payload.password || "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }
  if (name.length < 1 || name.length > 100) {
    throw new Error("Enter a name up to 100 characters.");
  }
  if (password.length < 12 || password.length > 128) {
    throw new Error("Password must be between 12 and 128 characters.");
  }

  const users = readUsers();
  if (Object.values(users).some((user) => user.email === email)) {
    throw new Error("An account with this email already exists.");
  }

  const salt = crypto.randomBytes(16);
  const passwordHash = await hashPassword(password, salt);
  const user = {
    id: crypto.randomUUID(),
    email,
    name,
    passwordSalt: salt.toString("hex"),
    passwordHash: passwordHash.toString("hex"),
    createdAt: nowIso()
  };
  users[user.id] = user;
  writeJsonFile(USER_STORE_PATH, users);
  return { id: user.id, email: user.email, name: user.name };
}

async function verifyAccountCredentials(payload) {
  const email = normalizeEmail(payload.email);
  const password = String(payload.password || "");
  const user = Object.values(readUsers()).find((candidate) => candidate.email === email);
  const salt = user ? Buffer.from(user.passwordSalt, "hex") : Buffer.alloc(16);
  const actual = await hashPassword(password, salt);
  const expected = Buffer.from(user?.passwordHash || "0".repeat(128), "hex");
  if (!user || actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
    throw new Error("Email or password is incorrect.");
  }
  return { id: user.id, email: user.email, name: user.name };
}

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
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

loadEnvFromFiles();

const postgresPersistence = createPostgresPersistence(readEnv("BILLS_RUNTIME_DATABASE_URL"));
const configuredStorePath = readEnv("BILLS_DATABASE_URL") || path.join(os.homedir(), ".electrony-bills", "transactions.json");
if (/^[a-z][a-z\d+.-]*:\/\//i.test(configuredStorePath)) {
  throw new Error("BILLS_DATABASE_URL must be a local JSON file path; this backend does not support database URLs.");
}
const expandedStorePath = configuredStorePath.startsWith("~/")
  ? path.join(os.homedir(), configuredStorePath.slice(2))
  : configuredStorePath;
const TRANSACTION_STORE_PATH = path.resolve(APP_ROOT, expandedStorePath);
const relativeStorePath = path.relative(APP_ROOT, TRANSACTION_STORE_PATH);
if (relativeStorePath === "" || (!relativeStorePath.startsWith(`..${path.sep}`) && relativeStorePath !== ".." && !path.isAbsolute(relativeStorePath))) {
  throw new Error("BILLS_DATABASE_URL must point outside the publicly served project directory.");
}
const DATA_DIR = path.dirname(TRANSACTION_STORE_PATH);
const WEBHOOK_STORE_PATH = path.join(DATA_DIR, "processed-webhooks.json");
const USER_STORE_PATH = path.join(DATA_DIR, "users.json");
const LEGACY_DATA_DIR = path.join(__dirname, "data");

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true, mode: 0o700 });
  }
  fs.chmodSync(DATA_DIR, 0o700);
}

function moveLegacyRecord(source, destination) {
  if (!fs.existsSync(source)) return;

  if (fs.existsSync(destination)) {
    const legacyRecords = readJsonFile(source, {});
    const destinationRecords = readJsonFile(destination, {});
    writeJsonFile(destination, { ...legacyRecords, ...destinationRecords });
    fs.unlinkSync(source);
    fs.chmodSync(destination, 0o600);
    return;
  }

  try {
    fs.renameSync(source, destination);
  } catch (error) {
    if (error && error.code !== "EXDEV") {
      throw error;
    }
    const temporaryPath = `${destination}.${process.pid}.${crypto.randomUUID()}.tmp`;
    try {
      fs.copyFileSync(source, temporaryPath, fs.constants.COPYFILE_EXCL);
      fs.chmodSync(temporaryPath, 0o600);
      fs.renameSync(temporaryPath, destination);
      fs.unlinkSync(source);
    } catch (copyError) {
      if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
      throw copyError;
    }
  }

  fs.chmodSync(destination, 0o600);
}

function migrateLegacyRecords() {
  if (path.resolve(LEGACY_DATA_DIR) === DATA_DIR || !fs.existsSync(LEGACY_DATA_DIR)) return;
  ensureDataDirectory();
  for (const filename of ["transactions.json", "processed-webhooks.json", "users.json"]) {
    const source = path.join(LEGACY_DATA_DIR, filename);
    const destination = filename === "transactions.json"
      ? TRANSACTION_STORE_PATH
      : path.join(DATA_DIR, filename);
    moveLegacyRecord(source, destination);
  }
}

if (process.env.NODE_ENV !== "production") {
  migrateLegacyRecords();
}

function readJsonFile(filePath, fallback) {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    if (!fileContents.trim()) {
      throw new Error("The file is empty.");
    }
    const value = JSON.parse(fileContents);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("The file does not contain an object.");
    }
    return value;
  } catch (error) {
    if (error && error.code === "ENOENT") return fallback;
    throw new Error(`Unable to read Bills data file "${path.basename(filePath)}".`);
  }
}

function writeJsonFile(filePath, content) {
  const temporaryPath = `${filePath}.${process.pid}.${crypto.randomUUID()}.tmp`;
  try {
    fs.writeFileSync(temporaryPath, JSON.stringify(content, null, 2), { encoding: "utf8", mode: 0o600, flag: "wx" });
    fs.chmodSync(temporaryPath, 0o600);
    fs.renameSync(temporaryPath, filePath);
  } catch (error) {
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
    throw error;
  }
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
  const suffix = crypto.randomBytes(16).toString("hex").toUpperCase();
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
  const isProduction = process.env.NODE_ENV === "production";
  return {
    apiKey: readEnv("MONNIFY_API_KEY"),
    secretKey: readEnv("MONNIFY_SECRET_KEY"),
    contractCode: readEnv("MONNIFY_CONTRACT_CODE"),
    baseUrl: readEnv("MONNIFY_BASE_URL") || (isProduction ? "" : "https://sandbox.monnify.com"),
    webhookSecret: readEnv("MONNIFY_WEBHOOK_SECRET"),
    redirectUrl: readEnv("BILLS_PAYMENT_REDIRECT_URL") || (isProduction ? "" : "http://localhost:4173/bills/app/?payment=success"),
    webhookBaseUrl: readEnv("BILLS_WEBHOOK_BASE_URL") || (isProduction ? "" : "http://localhost:4174"),
    appUrl: readEnv("BILLS_APP_URL") || (isProduction ? "" : "http://localhost:4173/bills/app/")
  };
}

function toEnvName(key) {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toUpperCase();
}

function getMissingMonnifyConfig() {
  const config = getMonnifyConfig();
  const missing = [];

  ["apiKey", "secretKey", "contractCode", "webhookSecret"].forEach((key) => {
    if (!config[key] || /replace_with|change_me|example/i.test(config[key])) {
      missing.push(`MONNIFY_${toEnvName(key)}`);
    }
  });

  try {
    const baseUrl = new URL(config.baseUrl);
    const allowedHosts = process.env.NODE_ENV === "production"
      ? ["api.monnify.com"]
      : ["sandbox.monnify.com", "api.monnify.com"];
    if (baseUrl.protocol !== "https:"
      || !allowedHosts.includes(baseUrl.hostname)
      || baseUrl.pathname !== "/"
      || baseUrl.username
      || baseUrl.password
      || baseUrl.search
      || baseUrl.hash) {
      missing.push("MONNIFY_BASE_URL");
    }
  } catch {
    missing.push("MONNIFY_BASE_URL");
  }

  if (process.env.NODE_ENV === "production") {
    for (const [name, value] of [
      ["BILLS_PAYMENT_REDIRECT_URL", config.redirectUrl],
      ["BILLS_WEBHOOK_BASE_URL", config.webhookBaseUrl]
    ]) {
      try {
        if (new URL(value).protocol !== "https:") {
          missing.push(`${name} (HTTPS URL required)`);
        }
      } catch {
        missing.push(`${name} (HTTPS URL required)`);
      }
    }
  }

  return missing;
}

function hasMonnifyConfig() {
  return getMissingMonnifyConfig().length === 0;
}

function getAllowedOrigins() {
  const configured = [
    readEnv("BILLS_APP_URL"),
    ...readEnv("BILLS_ALLOWED_ORIGINS").split(",")
  ];
  const origins = new Set(["http://localhost:4173", "http://127.0.0.1:4173"]);

  for (const value of configured) {
    if (!value) continue;
    try {
      const url = new URL(value);
      if (url.protocol === "http:" || url.protocol === "https:") origins.add(url.origin);
    } catch (error) {
      throw new Error("BILLS_APP_URL and BILLS_ALLOWED_ORIGINS must contain valid HTTP(S) URLs.");
    }
  }

  return origins;
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function serveWebsite(request, response, url) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    sendJson(response, 400, { ok: false, error: "Invalid URL path." });
    return true;
  }

  if (pathname === "/health" || pathname === "/api" || pathname.startsWith("/api/")) {
    return false;
  }

  const segments = pathname.split("/").filter(Boolean);
  if (segments.some((segment) => segment.startsWith("."))
    || ["bills-api", "node_modules"].includes(segments[0])) {
    return false;
  }

  let filePath = path.resolve(APP_ROOT, `.${pathname}`);
  const relativePath = path.relative(APP_ROOT, filePath);
  if (relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
    return false;
  }

  try {
    let stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
      stat = fs.statSync(filePath);
    }
    if (!stat.isFile()) return false;

    const contentTypes = {
      ".css": "text/css; charset=utf-8",
      ".gif": "image/gif",
      ".html": "text/html; charset=utf-8",
      ".ico": "image/x-icon",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".png": "image/png",
      ".svg": "image/svg+xml",
      ".webp": "image/webp",
      ".woff": "font/woff",
      ".woff2": "font/woff2"
    };
    const content = request.method === "HEAD" ? null : fs.readFileSync(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Content-Length": stat.size,
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff"
    });
    if (content) response.end(content);
    else response.end();
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") return false;
    console.error("Website file could not be served.");
    sendJson(response, 500, { ok: false, error: "Website file could not be served." });
    return true;
  }
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

function readContactPayload(request) {
  const contentType = String(request.headers["content-type"] || "");
  if (!/^application\/json(?:\s*;|$)/i.test(contentType)) {
    return Promise.reject(new ContactEnquiryError(400, "Submit enquiry details as JSON."));
  }
  if (Number(request.headers["content-length"] || 0) > CONTACT_BODY_LIMIT) {
    request.resume();
    return Promise.reject(new ContactEnquiryError(413, "The enquiry is too large. Shorten it and try again."));
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let tooLarge = false;
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > CONTACT_BODY_LIMIT) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      if (!tooLarge) chunks.push(chunk);
    });
    request.on("end", () => {
      if (tooLarge) {
        reject(new ContactEnquiryError(413, "The enquiry is too large. Shorten it and try again."));
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new ContactEnquiryError(400, "Enter valid enquiry details."));
      }
    });
    request.on("error", () => reject(new ContactEnquiryError(400, "Unable to read enquiry details.")));
  });
}

function getTransaction(reference) {
  const store = readStore();
  if (Object.prototype.hasOwnProperty.call(store, reference)) {
    return store[reference];
  }
  return Object.values(store).find((transaction) => transaction.monnifyReference === reference) || null;
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

  let response;
  try {
    response = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: AbortSignal.timeout(20000)
    });
  } catch {
    throw new Error("Payment provider is temporarily unavailable.");
  }

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
    throw new Error(`Payment provider request failed with status ${response.status}.`);
  }

  return payload;
}

async function authenticateMonnify() {
  if (!hasMonnifyConfig()) {
    throw new Error("Monnify is not configured. Set the required payment-provider and Bills return/webhook URL values.");
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
    amount: Number(transaction.totalAmount),
    currency: "NGN",
    paymentReference: transaction.reference,
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
      webhookUrl: `${config.webhookBaseUrl.replace(/\/$/, "")}/api/payments/webhook`
    }
  };

  const response = await requestJson(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: payload
  });

  const transactionReference = response?.data?.transactionReference || response?.transactionReference || response?.reference || "";
  const checkoutUrl = response?.data?.checkoutUrl || response?.checkoutUrl || response?.paymentLink || response?.data?.paymentLink || response?.data?.authorizationUrl || "";
  let parsedCheckoutUrl;
  try {
    parsedCheckoutUrl = new URL(checkoutUrl);
  } catch {
    throw new Error("Monnify did not return a valid checkout URL.");
  }
  if (!transactionReference
    || parsedCheckoutUrl.protocol !== "https:"
    || parsedCheckoutUrl.origin !== new URL(config.baseUrl).origin
    || parsedCheckoutUrl.username
    || parsedCheckoutUrl.password) {
    throw new Error("Monnify returned an invalid transaction reference or unsafe checkout URL.");
  }

  return {
    monnifyReference: transactionReference,
    checkoutUrl,
    raw: response
  };
}

function extractMonnifyStatus(payload) {
  const candidate = payload?.eventData || payload?.data || payload?.result || payload || {};
  const status = candidate.paymentStatus || candidate.status || candidate.transactionStatus || payload.status || payload.paymentStatus || "";
  const normalized = String(status).toUpperCase();

  if (["PAID", "SUCCESS", "SUCCESSFUL", "COMPLETED"].includes(normalized)) return "paid";
  if (["PENDING", "AWAITING_PAYMENT", "PROCESSING"].includes(normalized)) return "payment_pending";
  if (["FAILED", "DECLINED", "CANCELLED", "CANCELED"].includes(normalized)) return "payment_failed";
  return normalized || "unknown";
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

    if (validation?.ok !== true) {
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

async function fulfillPaidTransaction(reference) {
  if (!BILL_FULFILLMENT_ENABLED) {
    throw new Error("Bill fulfilment remains disabled pending verified payment, database authorization, and provider readiness.");
  }

  const current = getTransaction(reference);
  if (!current || current.fulfillmentStartedAt) return current;

  const transaction = {
    ...current,
    paymentStatus: "payment_success",
    status: "processing",
    fulfillmentStatus: "processing",
    fulfillmentStartedAt: nowIso(),
    updatedAt: nowIso()
  };
  saveTransaction(reference, transaction);

  let vendingResult;
  try {
    vendingResult = await processVendingForTransaction(transaction);
  } catch (error) {
    console.error("Bills fulfillment request failed; reconciliation is required.", { reference });
    vendingResult = {
      ok: false,
      status: "pending_reconciliation",
      message: "Provider delivery could not be confirmed and requires reconciliation."
    };
  }
  const updated = {
    ...transaction,
    providerReference: vendingResult?.providerReference || transaction.providerReference || "",
    providerMessage: vendingResult?.message || "",
    fulfillmentStatus: vendingResult?.ok === true ? "success" : (vendingResult?.status || "pending"),
    status: vendingResult?.ok === true ? "success" : (vendingResult?.status === "pending_reconciliation" ? "pending" : "failed"),
    updatedAt: nowIso()
  };
  saveTransaction(reference, updated);
  return updated;
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

function makeBillFeeQuote(service, amount, network = "", plan = "") {
  if (!ALLOWED_SERVICES.includes(service) || !PLATFORM_FEE_RULES[service]) {
    throw new Error("Unsupported service type.");
  }
  const amountMinor = parseMoneyToMinor(amount);
  const amountLimits = {
    electricity: 5000000,
    airtime: 500000
  };
  if (amountLimits[service] && amountMinor > amountLimits[service] * 100) {
    throw new Error(`${service === "electricity" ? "Electricity" : "Airtime"} amount exceeds the supported maximum.`);
  }

  if (service === "data" || service === "bills") {
    const expected = getExpectedAmount(service, { network, plan });
    if (!expected || amountMinor !== expected * 100) {
      throw new Error("The selected service option does not match its configured price.");
    }
  }
  return createPlatformFeeQuote(service, amountMinor);
}

function validateServiceRequest(payload) {
  const service = normalizeService(payload.service);
  if (!service) {
    throw new Error("Unsupported service type.");
  }

  const amountMinor = parseMoneyToMinor(payload.amount);
  if (amountMinor <= 0) {
    throw new Error("Amount must be a positive number.");
  }
  const rawAmount = amountMinor / 100;

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
    if (amountMinor !== expected * 100) {
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
    if (amountMinor !== expected * 100) {
      throw new Error("The selected package amount does not match the configured price.");
    }
  }

  return {
    service,
    amount: rawAmount,
    amountMinor,
    customer
  };
}

async function handleWebhook(request, response) {
  if (!PAYMENT_OPERATIONS_ENABLED) {
    sendJson(response, 503, {
      ok: false,
      error: "Webhook processing remains disabled until database authorization and payment verification are ready."
    });
    return;
  }

  try {
    const rawBody = await readRawBody(request);
    const signature = request.headers["x-monnify-signature"] || request.headers["X-Monnify-Signature"] || request.headers["x-monnify-signature"] || "";
    const webhookSecret = readEnv("MONNIFY_WEBHOOK_SECRET") || "";

    if (!webhookSecret || !signature) {
      sendJson(response, 401, { ok: false, error: "Webhook signature verification is unavailable or missing." });
      return;
    }

    const expected = Buffer.from(crypto.createHmac("sha256", webhookSecret).update(rawBody).digest("hex"), "hex");
    const received = Buffer.from(signature, "hex");
    if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
      sendJson(response, 401, { ok: false, error: "Webhook signature verification failed." });
      return;
    }

    if (!rawBody.trim()) {
      sendJson(response, 400, { ok: false, error: "Missing webhook payload." });
      return;
    }

    const payload = parseJsonBody(rawBody);
    const event = payload?.eventData || payload?.event || payload?.data || payload;
    const transactionReference = event?.transactionReference || event?.reference || payload?.reference || "";
    if (!transactionReference) {
      sendJson(response, 400, { ok: false, error: "Webhook transaction reference is required." });
      return;
    }
    const monnifyStatus = extractMonnifyStatus(payload);
    const eventId = `${transactionReference}:${event?.eventType || payload?.eventType || "payment"}:${monnifyStatus}`;
    const processed = readWebhookStore();

    if (processed[eventId]) {
      sendJson(response, 200, { ok: true, duplicate: true, reference: transactionReference });
      return;
    }

    const fallbackReference = event?.customerReference || event?.paymentReference || "";
    const transaction = getTransaction(transactionReference) || getTransaction(fallbackReference);

    if (!transaction) {
      sendJson(response, 202, { ok: true, queued: true, reference: transactionReference, note: "Webhook accepted, but no matching local transaction was found." });
      return;
    }

    if (transactionReference
      && transactionReference !== transaction.reference
      && transactionReference !== transaction.monnifyReference) {
      sendJson(response, 400, { ok: false, error: "Webhook transaction reference does not match the local payment." });
      return;
    }

    if (processed[eventId] || transaction.fulfillmentStartedAt) {
      sendJson(response, 200, { ok: true, duplicate: true, reference: transaction.reference });
      return;
    }

    if (monnifyStatus === "paid") {
      sendJson(response, 503, {
        ok: false,
        error: "Payment notification received, but server-side amount, currency, and reference verification is not implemented. No bill was fulfilled."
      });
      return;
    }

    processed[eventId] = { processedAt: nowIso(), reference: transactionReference };
    persistWebhookStore(processed);

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
    sendJson(response, 400, { ok: false, error: "Unable to process webhook." });
  }
}

const port = Number(process.env.PORT || readEnv("ELECTRONY_BILLS_PORT") || 4174);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT or ELECTRONY_BILLS_PORT must be a valid TCP port.");
}

async function handleRequest(request, response) {
  const origin = request.headers.origin;
  if (origin) {
    let allowedOrigins;
    try {
      allowedOrigins = getAllowedOrigins();
    } catch (error) {
      sendJson(response, 500, { ok: false, error: error.message });
      return;
    }
    if (!allowedOrigins.has(origin)) {
      sendJson(response, 403, { ok: false, error: "Origin is not allowed." });
      return;
    }
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, X-Guest-Order-Secret, x-monnify-signature");
    response.setHeader("Vary", "Origin");
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  const url = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "GET" && url.pathname === "/health") {
    const vendingProvider = buildProviderAdapter();
    const production = process.env.NODE_ENV === "production";
    const databaseReadiness = await postgresPersistence.getReadiness();
    const providerFeeQuoteAvailable = typeof vendingProvider.quotePurchase === "function";
    const databaseSecurityChecks = databaseReadiness.checks || {};
    const paymentBlockers = [
      "postgres_business_persistence_not_wired_to_routes",
      "rls_authorization_semantics_unverified",
      "authoritative_monnify_verification_not_implemented",
      "provider_fulfillment_contract_unverified",
      "durable_transactional_idempotency_not_implemented"
    ];
    if (!providerFeeQuoteAvailable) paymentBlockers.push("provider_fee_quote_unavailable");
    if (databaseSecurityChecks.otherRoleGrants?.status !== "none_detected") {
      paymentBlockers.push("anon_authenticated_grants_require_review");
    }
    sendJson(response, 200, {
      ok: true,
      ready: false,
      readiness: "blocked",
      service: "electrony-bills",
      mode: !hasMonnifyConfig() ? "configuration-required" : "payments-blocked",
      database: databaseReadiness,
      checks: {
        databaseConnectivity: {
          status: databaseReadiness.connected ? "verified" : "unavailable",
          connected: databaseReadiness.connected
        },
        runtimeRole: databaseSecurityChecks.runtimeRole || {
          status: databaseReadiness.connected ? "not_verified" : "not_checked",
          exists: false,
          connectedAsExpectedRole: false,
          leastPrivilegeVerified: false
        },
        tablePermissions: databaseSecurityChecks.tablePermissions || {
          status: databaseReadiness.connected ? "not_verified" : "not_checked",
          requiredGrantsVerified: false,
          excessiveGrantsFound: null
        },
        rlsPolicies: databaseSecurityChecks.rlsPolicies || {
          status: databaseReadiness.connected ? "not_verified" : "not_checked",
          enabledOnAllTables: false,
          roleScopedOperationCoverage: false,
          authorizationSemantics: "not_verified"
        },
        otherRoleGrants: databaseSecurityChecks.otherRoleGrants || {
          status: "not_checked",
          unexpectedGrants: []
        },
        businessPersistence: {
          ready: false,
          status: "disabled",
          reason: "postgres_repository_not_wired_to_api_routes"
        },
        payment: {
          ready: false,
          status: "disabled",
          blockers: paymentBlockers
        },
        vending: {
          ready: false,
          status: "disabled",
          providerConfigured: vendingProvider.isConfigured(),
          providerFeeQuoteAvailable,
          fulfillmentContractVerified: false,
          blockers: [
            "postgres_business_persistence_not_wired_to_routes",
            "rls_authorization_semantics_unverified",
            "provider_fulfillment_contract_unverified"
          ]
        }
      },
      billsApi: production ? "blocked-until-database-schema-and-RLS-are-verified" : "available-local-development",
      payments: "blocked-until-authoritative-verification-and-vending-contracts-are-implemented",
      hasDatabase: databaseReadiness.connected,
      persistence: production
        ? (databaseReadiness.status === "connection_verified"
          ? "postgres-connection-verified-business-persistence-disabled"
          : `postgres-${databaseReadiness.status}-business-persistence-disabled`)
        : "json-file",
      configuration: {
        monnify: hasMonnifyConfig(),
        missingMonnify: getMissingMonnifyConfig(),
        monnifyPaymentVerification: false,
        vendingProvider: vendingProvider.isConfigured(),
        providerFeeQuote: providerFeeQuoteAvailable,
        providerFulfillmentContractVerified: false,
        durableTransactionalIdempotency: false,
        postgresSecurityControlsVerified: false,
        postgresBusinessTablePersistence: false
      },
      virtualCards: "provider_unconfigured",
      giftCards: "provider_unconfigured"
    });
    return;
  }

  if (url.pathname === "/api/contact") {
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      sendJson(response, 405, { ok: false, error: "Use POST to submit an enquiry." });
      return;
    }
    try {
      const payload = await readContactPayload(request);
      const forwarded = request.headers["x-forwarded-for"];
      const clientKey = typeof forwarded === "string" && forwarded.trim()
        ? forwarded.split(",")[0].trim()
        : request.socket.remoteAddress || "unknown";
      await submitContactEnquiry(payload, { clientKey });
      sendJson(response, 200, {
        ok: true,
        message: "Your enquiry was accepted by the email provider for delivery."
      });
    } catch (error) {
      if (error instanceof ContactEnquiryError) {
        sendJson(response, error.statusCode, { ok: false, error: error.message });
        return;
      }
      sendJson(response, 500, { ok: false, error: "We couldn't process your enquiry right now. Please try again later." });
    }
    return;
  }

  if (request.method === "POST"
    && !PAYMENT_OPERATIONS_ENABLED
    && ["/api/payments/session", "/api/payments/verify", "/api/payments/webhook"].includes(url.pathname)) {
    sendJson(response, 503, {
      ok: false,
      error: "Payment operations are disabled until database authorization/readiness, authoritative Monnify verification, and a verified vending-provider contract are implemented."
    });
    return;
  }

  if (process.env.NODE_ENV === "production"
    && (url.pathname === "/api" || url.pathname.startsWith("/api/"))) {
    sendJson(response, 503, {
      ok: false,
      error: "Bills API persistence is unavailable. Configure the verified production database adapter before using Bills API routes."
    });
    return;
  }

  if (request.method === "POST" && (url.pathname === "/api/auth/register" || url.pathname === "/api/auth/login")) {
    if (!enforceAuthRateLimit(request)) {
      sendJson(response, 429, { ok: false, error: "Too many account attempts. Please try again later." });
      return;
    }
    try {
      getAuthSecret();
      const payload = await readPayload(request);
      const user = url.pathname.endsWith("/register")
        ? await createAccount(payload)
        : await verifyAccountCredentials(payload);
      sendJson(response, url.pathname.endsWith("/register") ? 201 : 200, {
        ok: true,
        user,
        token: signAuthToken(user),
        expiresIn: TOKEN_LIFETIME_SECONDS
      });
    } catch (error) {
      sendJson(response, error.message.includes("BILLS_JWT_SECRET") ? 503 : 400, { ok: false, error: error.message });
    }
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/auth/me") {
    const user = authenticateRequest(request);
    sendJson(response, user ? 200 : 401, user
      ? { ok: true, user }
      : { ok: false, error: "Sign in to continue." });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/services/virtual-cards/catalog") {
    sendJson(response, 200, {
      ok: true,
      service: "virtual-cards",
      available: false,
      status: "provider_unconfigured",
      products: [],
      message: "Virtual-card products cannot be displayed or purchased until a card provider and its product catalogue are configured."
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/services/gift-cards/catalog") {
    sendJson(response, 200, {
      ok: true,
      service: "gift-cards",
      available: false,
      status: "provider_unconfigured",
      products: [],
      platformFeeMinor: 0,
      currency: "NGN",
      message: "Gift-card products cannot be displayed or purchased until a gift-card provider and its product catalogue are configured."
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/services/virtual-cards/eligibility") {
    if (!authenticateRequest(request)) {
      sendJson(response, 401, { ok: false, error: "Sign in to check virtual-card eligibility." });
      return;
    }
    sendJson(response, 503, {
      ok: false,
      status: "provider_unconfigured",
      message: "A card provider is not configured, so eligibility and provider KYC status cannot be checked."
    });
    return;
  }

  if (request.method === "POST" && /^\/api\/services\/(virtual-cards|gift-cards)\/purchase$/.test(url.pathname)) {
    if (!authenticateRequest(request)) {
      sendJson(response, 401, { ok: false, error: "Sign in before purchasing this service." });
      return;
    }
    sendJson(response, 503, {
      ok: false,
      error: "This service is unavailable because its fulfilment provider is not configured. No payment was created."
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/fees/quote") {
    try {
      const service = url.searchParams.get("service") || "";
      const quote = makeBillFeeQuote(
        service,
        url.searchParams.get("amount"),
        url.searchParams.get("network") || "",
        url.searchParams.get("plan") || ""
      );
      sendJson(response, 200, {
        ok: true,
        quote,
        quoteToken: createQuoteToken(quote)
      });
    } catch (error) {
      sendJson(response, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/payments/session") {
    try {
      const payload = await readPayload(request);
      const validation = validateServiceRequest(payload);
      const quote = createPlatformFeeQuote(validation.service, validation.amountMinor);
      if (!verifyQuoteToken(payload.quoteToken, quote)) {
        sendJson(response, 409, { ok: false, error: "Your fee quote is missing or has expired. Refresh the breakdown before confirming payment." });
        return;
      }
      if (payload.totalAmount !== undefined
        && parseMoneyToMinor(payload.totalAmount) !== quote.totalBeforeProviderFeesMinor) {
        sendJson(response, 400, { ok: false, error: "The submitted total does not match the server fee quote." });
        return;
      }
      const reference = String(payload.reference || createReference()).trim();
      if (!/^ELECBILLS-\d{8}-(?:[A-Z0-9]{6}|[A-F0-9]{32})$/.test(reference)) {
        sendJson(response, 400, { ok: false, error: "Invalid transaction reference." });
        return;
      }
      const user = authenticateRequest(request);
      const guestOrderSecret = user ? null : createGuestOrderSecret();

      const existing = getTransaction(reference);
      if (existing && existing.status !== "cancelled") {
        if (!canAccessTransaction(existing, user, request.headers["x-guest-order-secret"])) {
          sendJson(response, 403, { ok: false, error: "This transaction reference belongs to another customer." });
          return;
        }
        if (existing.service !== validation.service
          || existing.amountMinor !== validation.amountMinor
          || existing.totalAmountMinor !== quote.totalBeforeProviderFeesMinor
          || JSON.stringify(existing.customer) !== JSON.stringify(validation.customer)) {
          sendJson(response, 409, { ok: false, error: "The quote has changed. Refresh the breakdown and confirm again." });
          return;
        }
        sendJson(response, 200, {
          ok: true,
          reference: existing.reference,
          amount: existing.amount,
          amountMinor: existing.amountMinor,
          platformFeeMinor: existing.platformFeeMinor,
          providerFeeMinor: existing.providerFeeMinor,
          totalAmountMinor: existing.totalAmountMinor,
          status: existing.status,
          mode: process.env.NODE_ENV === "production" ? "monnify-production" : "monnify-sandbox",
          checkoutUrl: existing.checkoutUrl || "",
          idempotent: true
        });
        return;
      }

      const transaction = {
        reference,
        service: validation.service,
        amount: validation.amount,
        amountMinor: validation.amountMinor,
        currency: quote.currency,
        platformFeeMinor: quote.platformFeeMinor,
        platformFeeCurrency: quote.currency,
        providerFeeMinor: null,
        providerFeeCurrency: quote.currency,
        totalAmountMinor: quote.totalBeforeProviderFeesMinor,
        totalAmount: quote.totalBeforeProviderFeesMinor / 100,
        userId: user ? user.id : null,
        ...(guestOrderSecret ? { guestAccessHash: hashGuestOrderSecret(guestOrderSecret) } : {}),
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

      const vendingProvider = buildProviderAdapter();
      if (!vendingProvider.isConfigured()) {
        sendJson(response, 503, {
          ok: false,
          error: "No bill-fulfilment provider is configured. No payment was created.",
          requiredConfig: ["BILLS_PROVIDER_BASE_URL", "BILLS_PROVIDER_API_KEY", "BILLS_PROVIDER_SECRET_KEY"]
        });
        return;
      }
      if (typeof vendingProvider.quotePurchase !== "function") {
        sendJson(response, 503, {
          ok: false,
          error: "The configured bill provider cannot quote any applicable provider fee. No payment was created."
        });
        return;
      }

      saveTransaction(reference, transaction);

      if (!hasMonnifyConfig()) {
        const missing = getMissingMonnifyConfig();
        const updated = {
          ...transaction,
          status: "awaiting_payment",
          paymentStatus: "configuration_required",
          note: "Monnify is not configured. Set required environment values before launching a checkout.",
          requiredConfig: missing
        };
        saveTransaction(reference, updated);

        sendJson(response, 503, {
          ok: false,
          error: "Monnify is not configured.",
          reference,
          ...(guestOrderSecret ? { guestOrderSecret } : {}),
          requiredConfig: missing,
          note: "Set the required MONNIFY_* credentials and BILLS_PAYMENT_REDIRECT_URL/BILLS_WEBHOOK_BASE_URL values before processing transactions."
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
          amount: transaction.amount,
          amountMinor: transaction.amountMinor,
          platformFeeMinor: transaction.platformFeeMinor,
          providerFeeMinor: transaction.providerFeeMinor,
          totalAmountMinor: transaction.totalAmountMinor,
          status: "awaiting_payment",
          mode: process.env.NODE_ENV === "production" ? "monnify-production" : "monnify-sandbox",
          checkoutUrl: result.checkoutUrl,
          monnifyReference: result.monnifyReference,
          ...(guestOrderSecret ? { guestOrderSecret } : {}),
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
          error: "Unable to create a payment session with the configured provider.",
          reference,
          ...(guestOrderSecret ? { guestOrderSecret } : {})
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
      const transactionReference = transaction.reference;
      const user = authenticateRequest(request);
      if (!canAccessTransaction(transaction, user, request.headers["x-guest-order-secret"])) {
        sendJson(response, 403, { ok: false, error: "You do not have access to this transaction." });
        return;
      }

      if (!hasMonnifyConfig()) {
        sendJson(response, 400, {
          ok: false,
          error: "Payment verification is unavailable because the required configuration is missing.",
          reference: transactionReference,
          status: transaction.status || "unknown"
        });
        return;
      }

      sendJson(response, 503, {
        ok: false,
        reference,
        verified: false,
        status: transaction.status || "payment_pending",
        paymentStatus: transaction.paymentStatus || "payment_pending",
        error: "Authoritative Monnify amount, currency, and transaction-reference verification is not implemented. Payment remains unconfirmed."
      });
      return;
    } catch (error) {
      sendJson(response, 400, { ok: false, verified: false, error: "Unable to verify payment." });
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
    const user = authenticateRequest(request);
    if (!canAccessTransaction(transaction, user, request.headers["x-guest-order-secret"])) {
      sendJson(response, 403, { ok: false, error: "You do not have access to this transaction." });
      return;
    }

    sendJson(response, 200, {
      ok: true,
      reference: transaction.reference,
      status: transaction.status,
      paymentStatus: transaction.paymentStatus,
      fulfillmentStatus: transaction.fulfillmentStatus,
      providerReference: transaction.providerReference || "",
      note: "Status checks are intentionally server-side to avoid exposing payment credentials or provider details."
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/payments/webhook") {
    await handleWebhook(request, response);
    return;
  }

  if (serveWebsite(request, response, url)) return;

  if (url.pathname === "/health") {
    sendJson(response, 404, { ok: false, error: "Route not found." });
    return;
  }

  sendJson(response, 404, { ok: false, error: "Route not found." });
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error("Bills API request failed.", error);
    if (response.writableEnded) return;
    if (response.headersSent) {
      response.destroy();
      return;
    }
    sendJson(response, 500, { ok: false, error: "Bills API request failed." });
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Electrony Bills API listening on 0.0.0.0:${port}`);
});

let shuttingDown = false;
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    if (shuttingDown) return;
    shuttingDown = true;
    server.close(() => {
      postgresPersistence.close().catch(() => {
        console.error("Bills PostgreSQL connection pool shutdown failed.");
        process.exitCode = 1;
      });
    });
  });
}
