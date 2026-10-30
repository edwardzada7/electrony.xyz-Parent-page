const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { promisify } = require("util");
const os = require("os");
const http = require("http");
const { URL } = require("url");
const { buildProviderAdapter, readEnv } = require("./provider-adapter");
const { createMonnifyBillsAdapter } = require("./monnify-bills-adapter");
const { createPostgresPersistence } = require("./postgres-persistence");
const { PLATFORM_FEE_RULES, createPlatformFeeQuote, parseMoneyToMinor } = require("./platform-fees");
const { createMarpleradAdapter } = require("./adapters/marplerad-adapter");
const { createTeloadlyAdapter } = require("./adapters/teloadly-adapter");
const {
  CONTACT_BODY_LIMIT,
  ContactEnquiryError,
  submitContactEnquiry
} = require("./contact-enquiries");
const {
  validateOAuthCallback,
  getAllowedOrigins: getSecurityAllowedOrigins,
  verifySupabaseIdToken
} = require("./oauth-security");

const APP_ROOT = path.resolve(__dirname, "..");
const ALLOWED_SERVICES = ["electricity", "airtime", "data", "bills"];
const AUTH_RATE_LIMITS = new Map();
const FEE_QUOTES = new Map();
const TOKEN_LIFETIME_SECONDS = 60 * 60;
const GUEST_ORDER_SECRET_BYTES = 32;
const BILLS_ACCESS_SESSION_COOKIE = "__Secure-electrony-bills-session";
const BILLS_REFRESH_SESSION_COOKIE = "__Secure-electrony-bills-refresh";
const BILLS_CSRF_COOKIE = "__Secure-electrony-bills-csrf";
const BILLS_OAUTH_COOKIE = "__Secure-electrony-bills-oauth";
const MONNIFY_PAYMENT_CONTRACT_VERIFIED = false;
const BILL_FULFILLMENT_ENABLED = false;
const monnifyBillsAdapter = createMonnifyBillsAdapter();
const marpleradAdapter = createMarpleradAdapter(readEnv);
const teloadlyAdapter = createTeloadlyAdapter(readEnv);
const scrypt = promisify(crypto.scrypt);
const PRODUCTION_BILLS_OAUTH_CALLBACK_URL =
  "https://electronyxyz-parent-page-production.up.railway.app/api/auth/oauth/callback";

function getValidatedBillsOAuthCallback() {
  return validateOAuthCallback(readEnv("BILLS_OAUTH_CALLBACK_URL"));
}

function getValidatedBillsAppUrl() {
  const rawAppUrl = readEnv("BILLS_APP_URL").trim();
  const fallback = "https://bills.electrony.xyz/bills/app/";
  try {
    const appUrl = new URL(rawAppUrl || fallback);
    if (appUrl.username || appUrl.password || appUrl.search || appUrl.hash) return null;
    if (process.env.NODE_ENV === "production"
      && (!rawAppUrl || appUrl.protocol !== "https:" || appUrl.port)) return null;
    if (!["http:", "https:"].includes(appUrl.protocol)) return null;
    if (appUrl.protocol === "http:"
      && !["localhost", "127.0.0.1"].includes(appUrl.hostname)) return null;
    return appUrl;
  } catch {
    return null;
  }
}

function paymentsBlocked() {
  return !MONNIFY_PAYMENT_CONTRACT_VERIFIED
    || readEnv("PAYMENTS_BLOCKED", "true").toLowerCase() !== "false";
}

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

function readRequestCookie(request, name) {
  if (typeof request.headers.cookie !== "string") return "";
  for (const part of request.headers.cookie.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0 || part.slice(0, separator).trim() !== name) continue;
    return decodeURIComponent(part.slice(separator + 1).trim());
  }
  return "";
}

function appendSetCookie(response, cookie) {
  const existing = response.getHeader("Set-Cookie");
  response.setHeader("Set-Cookie", existing ? [...existing, cookie] : [cookie]);
}

function setSecureCookie(response, name, value, maxAge) {
  appendSetCookie(response, `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=None${maxAge ? `; Max-Age=${maxAge}` : ""}`);
}

function clearSecureCookie(response, name) {
  appendSetCookie(response, `${name}=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`);
}

function setCsrfCookie(response, token, maxAge) {
  appendSetCookie(response, `${BILLS_CSRF_COOKIE}=${encodeURIComponent(token)}; Path=/; Secure; SameSite=None${maxAge ? `; Max-Age=${maxAge}` : ""}`);
}

function clearCsrfCookie(response) {
  appendSetCookie(response, `${BILLS_CSRF_COOKIE}=; Path=/; Secure; SameSite=None; Max-Age=0`);
}

function getIdentityProjectConfig() {
  const projectUrl = readEnv("ELECTRONY_IDENTITY_SUPABASE_URL").trim().replace(/\/+$/, "");
  const publishableKey = readEnv("ELECTRONY_IDENTITY_SUPABASE_PUBLISHABLE_KEY").trim();
  if (!projectUrl || !publishableKey || /replace_with/i.test(publishableKey)) return null;
  try {
    const url = new URL(projectUrl);
    if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash || url.username || url.password) return null;
    return { projectUrl, publishableKey };
  } catch {
    return null;
  }
}

async function verifySupabaseAccessToken(accessToken) {
  const identity = getIdentityProjectConfig();
  if (!identity || typeof accessToken !== "string" || !accessToken.trim()) return null;
  try {
    const response = await fetch(`${identity.projectUrl}/auth/v1/user`, {
      method: "GET",
      headers: {
        apikey: identity.publishableKey,
        Authorization: `Bearer ${accessToken.trim()}`
      },
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return null;
    const user = await response.json();
    if (typeof user?.id !== "string" || !/^[0-9a-f-]{36}$/i.test(user.id)) return null;
    if (!user.email_confirmed_at && !user.confirmed_at) return null;
    return {
      id: user.id,
      email: String(user.email || ""),
      name: String(user.user_metadata?.full_name || "")
    };
  } catch {
    return null;
  }
}

async function exchangeSupabaseOAuthToken(form) {
  const identity = getIdentityProjectConfig();
  if (!identity) throw new Error("Electrony Accounts OAuth is not configured.");
  const response = await fetch(`${identity.projectUrl}/auth/v1/oauth/token`, {
    method: "POST",
    headers: {
      apikey: identity.publishableKey,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams(form),
    signal: AbortSignal.timeout(10000)
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.access_token) {
    throw Object.assign(
      new Error(payload?.error_description || payload?.error || "OAuth token exchange failed."),
      { statusCode: response.status >= 400 && response.status < 500 ? response.status : 502 }
    );
  }
  return payload;
}

function encodeSignedOAuthCookie(payload) {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = crypto.createHmac("sha256", getAuthSecret()).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function readSignedOAuthCookie(request) {
  const value = readRequestCookie(request, BILLS_OAUTH_COOKIE);
  const separator = value.lastIndexOf(".");
  if (!value || separator < 1) return null;
  const body = value.slice(0, separator);
  const signature = value.slice(separator + 1);
  const expected = crypto.createHmac("sha256", getAuthSecret()).update(body).digest("base64url");
  const supplied = Buffer.from(signature, "base64url");
  const expectedBuffer = Buffer.from(expected, "base64url");
  if (supplied.length !== expectedBuffer.length || !crypto.timingSafeEqual(supplied, expectedBuffer)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    return payload?.expiresAt > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

function setIdentitySessionCookies(response, tokens, existingCsrfToken) {
  const accessMaxAge = Number.isInteger(tokens.expires_in) && tokens.expires_in > 0 ? tokens.expires_in : 3600;
  const refreshMaxAge = 30 * 24 * 60 * 60;
  setSecureCookie(response, BILLS_ACCESS_SESSION_COOKIE, tokens.access_token, accessMaxAge);
  if (tokens.refresh_token) setSecureCookie(response, BILLS_REFRESH_SESSION_COOKIE, tokens.refresh_token, refreshMaxAge);
  const csrf = typeof existingCsrfToken === "string" && /^[A-Za-z0-9_-]{43}$/.test(existingCsrfToken)
    ? existingCsrfToken
    : crypto.randomBytes(32).toString("base64url");
  setCsrfCookie(response, csrf, refreshMaxAge);
  return csrf;
}

function clearIdentitySessionCookies(response) {
  clearSecureCookie(response, BILLS_ACCESS_SESSION_COOKIE);
  clearSecureCookie(response, BILLS_REFRESH_SESSION_COOKIE);
  clearSecureCookie(response, BILLS_OAUTH_COOKIE);
  clearCsrfCookie(response);
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

async function authenticateSupabaseRequest(request) {
  const authorization = String(request.headers.authorization || "").trim();
  const match = authorization.match(/^Bearer ([^\s]+)$/i);
  if (!match) return null;

  const projectUrl = readEnv("ELECTRONY_IDENTITY_SUPABASE_URL").trim().replace(/\/+$/, "");
  const publishableKey = readEnv("ELECTRONY_IDENTITY_SUPABASE_PUBLISHABLE_KEY").trim();
  if (!projectUrl || !publishableKey || /replace_with/i.test(publishableKey)) return null;

  try {
    const urlOrigin = new URL(projectUrl);
    if (urlOrigin.protocol !== "https:" || urlOrigin.pathname !== "/" || urlOrigin.search || urlOrigin.hash
      || urlOrigin.username || urlOrigin.password) return null;
    const url = new URL(`${projectUrl}/auth/v1/user`);
    const response = await fetch(url, {
      method: "GET",
      headers: { apikey: publishableKey, Authorization: `Bearer ${match[1]}` },
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return null;
    const user = await response.json();
    if (typeof user?.id !== "string" || !/^[0-9a-f-]{36}$/i.test(user.id)) return null;
    if (!user.email_confirmed_at && !user.confirmed_at) return null;
    return {
      id: user.id,
      email: String(user.email || ""),
      name: String(user.user_metadata?.full_name || "")
    };
  } catch {
    return null;
  }
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

async function authenticateBillsRequest(request, response) {
  const sessionAccessToken = readRequestCookie(request, BILLS_ACCESS_SESSION_COOKIE);
  if (sessionAccessToken) {
    const sessionUser = await verifySupabaseAccessToken(sessionAccessToken);
    if (sessionUser) return sessionUser;
    const refreshToken = readRequestCookie(request, BILLS_REFRESH_SESSION_COOKIE);
    if (refreshToken && response) {
      const clientId = readEnv("ELECTRONY_IDENTITY_OAUTH_CLIENT_ID").trim();
      if (clientId) {
        try {
          const tokens = await exchangeSupabaseOAuthToken({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
            client_id: clientId
          });
          setIdentitySessionCookies(response, tokens, readRequestCookie(request, BILLS_CSRF_COOKIE));
          return await verifySupabaseAccessToken(tokens.access_token);
        } catch {
          clearIdentitySessionCookies(response);
        }
      }
    }
  }
  return await authenticateSupabaseRequest(request) || authenticateRequest(request);
}

function createGuestOrderSecret() {
  return crypto.randomBytes(GUEST_ORDER_SECRET_BYTES).toString("base64url");
}

function hashGuestOrderSecret(secret) {
  return crypto.createHash("sha256").update(secret).digest("hex");
}

function guestOrderCookieName(reference) {
  if (!/^ELECBILLS-\d{8}-(?:[A-Z0-9]{6}|[A-F0-9]{32})$/.test(reference)) return "";
  return `__Secure-electrony-bills-guest-${reference}`;
}

function getGuestOrderSecretFromRequest(request, reference) {
  const cookieName = guestOrderCookieName(reference);
  if (!cookieName || typeof request.headers.cookie !== "string") return "";
  for (const part of request.headers.cookie.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0 || part.slice(0, separator).trim() !== cookieName) continue;
    return part.slice(separator + 1).trim();
  }
  return "";
}

function setGuestOrderSecretCookie(response, reference, secret) {
  const cookieName = guestOrderCookieName(reference);
  if (!cookieName) throw new Error("Cannot issue guest authorization for an invalid transaction reference.");
  response.setHeader("Cache-Control", "no-store");
  response.setHeader(
    "Set-Cookie",
    `${cookieName}=${secret}; Path=/api/payments/; HttpOnly; Secure; SameSite=None; Max-Age=604800`
  );
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

function createQuoteToken(quote, quoteReference) {
  const token = crypto.randomBytes(32).toString("hex");
  FEE_QUOTES.set(token, {
    quoteReference,
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
  return claims
    && claims.expiresAt > Date.now()
    && claims.service === quote.service
    && claims.amountMinor === quote.serviceAmountMinor
    && claims.platformFeeMinor === quote.platformFeeMinor
    ? claims
    : null;
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
    baseUrl: readEnv("MONNIFY_BASE_URL"),
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

  ["apiKey", "secretKey", "contractCode"].forEach((key) => {
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

async function getMonnifyCatalogueStatus() {
  const result = await monnifyBillsAdapter.listCategories();
  const status = result.status;
  const message = result.message;

  return {
    ok: true,
    available: false,
    status,
    categories: ["electricity", "airtime", "data", "bills"].reduce((categories, service) => {
      categories[service] = {
        available: false,
        status,
        billers: [],
        products: [],
        message
      };
      return categories;
    }, {}),
    monnifyCategories: [],
    message
  };
}

function getMissingHealthConfiguration() {
  const missing = getMissingMonnifyConfig().filter((name) => (
    !name.startsWith("BILLS_PAYMENT_REDIRECT_URL")
    && !name.startsWith("BILLS_WEBHOOK_BASE_URL")
  ));
  const paymentsBlockedValue = readEnv("PAYMENTS_BLOCKED").toLowerCase();
  if (paymentsBlockedValue !== "true" && paymentsBlockedValue !== "false") {
    missing.push("PAYMENTS_BLOCKED");
  }
  return missing;
}

function getAllowedOrigins() {
  return getSecurityAllowedOrigins({
    nodeEnv: process.env.NODE_ENV,
    billsAppUrl: readEnv("BILLS_APP_URL"),
    allowedOrigins: readEnv("BILLS_ALLOWED_ORIGINS")
  });
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
    const error = new Error("Payment provider is temporarily unavailable.");
    error.code = "payment_provider_unavailable";
    throw error;
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
    const error = new Error(`Payment provider request failed with status ${response.status}.`);
    error.code = "payment_provider_unavailable";
    throw error;
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
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.apiKey}:${config.secretKey}`).toString("base64")}`
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

async function queryMonnifyTransaction(paymentReference) {
  if (!paymentReference) {
    throw new Error("A Monnify payment reference is required.");
  }

  let authenticated;
  try {
    authenticated = await authenticateMonnify();
  } catch (error) {
    error.code ||= "payment_provider_unavailable";
    throw error;
  }
  const { token, config } = authenticated;
  const endpoint = new URL("/api/v1/merchant/transactions/query", config.baseUrl);
  endpoint.searchParams.set("paymentReference", paymentReference);
  const payload = await requestJson(endpoint.toString(), {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (payload?.requestSuccessful === false
    || (payload?.responseCode && payload.responseCode !== "0")) {
    const error = new Error("Monnify could not verify the payment reference.");
    error.code = "payment_verification_mismatch";
    throw error;
  }

  const transaction = payload?.responseBody || payload?.data?.responseBody || payload?.data || payload;
  return {
    transaction,
    status: extractMonnifyStatus({ data: transaction }),
    paymentReference: transaction?.paymentReference || transaction?.customerReference || "",
    providerReference: transaction?.transactionReference || "",
    amount: transaction?.amountPaid ?? transaction?.totalPayable ?? transaction?.amount,
    currency: transaction?.currencyCode || transaction?.currency || ""
  };
}

async function verifyMonnifyPayment(paymentReference, attempt) {
  const result = await queryMonnifyTransaction(paymentReference);
  let amountMinor;
  try {
    amountMinor = parseMoneyToMinor(result.amount);
  } catch {
    const error = new Error("Monnify returned an invalid transaction amount.");
    error.code = "payment_verification_mismatch";
    throw error;
  }

  if (result.status !== "paid"
    || result.paymentReference !== paymentReference
    || amountMinor !== Number(attempt.amount_minor)
    || String(result.currency).toUpperCase() !== String(attempt.currency).toUpperCase()
    || (attempt.provider_reference && result.providerReference !== attempt.provider_reference)) {
    const error = new Error("Monnify transaction details do not match the payment attempt.");
    error.code = "payment_verification_mismatch";
    throw error;
  }

  return {
    providerReference: result.providerReference,
    verification: {
      verified: true,
      reference: paymentReference,
      status: "successful",
      amountMinor,
      currency: String(result.currency).toUpperCase(),
      verifiedAt: nowIso()
    }
  };
}

async function createMonnifyReservation(transaction) {
  const { token, config } = await authenticateMonnify();
  const endpoint = `${config.baseUrl.replace(/\/$/, "")}/api/v1/transactions/init-transaction`;
  const payload = {
    amount: Number(transaction.totalAmount),
    currencyCode: "NGN",
    paymentReference: transaction.reference,
    contractCode: config.contractCode,
    redirectUrl: config.redirectUrl,
    customerName: transaction.customer?.name || "Electrony Bills Customer",
    customerEmail: transaction.customer?.email || "guest@electrony.com",
    customerMobileNumber: transaction.customer?.phone || "",
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
  const candidate = payload?.eventData || payload?.data || payload?.responseBody || payload?.result || payload || {};
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
      meterType: transaction.customer?.meterType || ""
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
      meterType: transaction.customer?.meterType || "",
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
    meterType: String(payload.meterType || "").trim(),
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
  let claimedEventId = "";
  try {
    const rawBody = await readRawBody(request);
    const signature = request.headers["monnify-signature"] || "";
    const webhookSecret = getMonnifyConfig().secretKey;

    if (!webhookSecret || !signature) {
      sendJson(response, 401, { ok: false, error: "Webhook signature verification is unavailable or missing." });
      return;
    }

    const expected = crypto.createHmac("sha512", webhookSecret).update(rawBody).digest();
    if (!/^[a-f\d]{128}$/i.test(signature)) {
      sendJson(response, 401, { ok: false, error: "Webhook signature verification failed." });
      return;
    }
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
    const providerReference = event?.transactionReference || event?.reference || payload?.reference || "";
    const merchantReference = event?.paymentReference || event?.customerReference || event?.merchantReference
      || payload?.paymentReference || payload?.customerReference || "";
    if (!merchantReference) {
      sendJson(response, 400, { ok: false, error: "Webhook payment reference is required." });
      return;
    }
    const monnifyStatus = extractMonnifyStatus(payload);
    const eventType = String(event?.eventType || payload?.eventType || "payment");
    const eventId = String(event?.eventId || payload?.eventId || crypto.createHash("sha256").update(rawBody).digest("hex"));
    const recorded = await postgresPersistence.recordWebhookEvent({
      provider: "monnify",
      providerEventId: eventId,
      eventType,
      merchantReference,
      payload: { eventType, status: monnifyStatus, merchantReference, providerReference }
    });

    if (recorded.duplicate
      && (recorded.event?.event_type !== eventType
        || recorded.event?.merchant_reference !== merchantReference)) {
      sendJson(response, 409, { ok: false, error: "Webhook event identifier conflicts with a previously recorded event." });
      return;
    }

    if (recorded.duplicate && recorded.event?.processing_status !== "failed") {
      sendJson(response, 200, { ok: true, duplicate: true, reference: merchantReference });
      return;
    }

    const claimed = await postgresPersistence.claimWebhookEvent("monnify", eventId);
    if (!claimed) {
      sendJson(response, 200, { ok: true, duplicate: true, reference: merchantReference });
      return;
    }
    claimedEventId = eventId;

    if (monnifyStatus !== "paid") {
      await postgresPersistence.completeWebhookEvent({
        provider: "monnify",
        providerEventId: eventId,
        status: "ignored"
      });
      claimedEventId = "";
      sendJson(response, 200, { ok: true, reference: merchantReference, status: monnifyStatus });
      return;
    }

    const attempt = await postgresPersistence.getPaymentAttemptByMerchantReference(merchantReference, merchantReference);
    if (!attempt) {
      await postgresPersistence.completeWebhookEvent({
        provider: "monnify",
        providerEventId: eventId,
        status: "ignored",
        errorMessage: "No matching payment attempt was found."
      });
      claimedEventId = "";
      sendJson(response, 200, { ok: true, reference: merchantReference, status: "unmatched" });
      return;
    }

    const verified = await verifyMonnifyPayment(merchantReference, attempt);
    await postgresPersistence.recordVerifiedPaymentAttemptStateChange({
      merchantReference,
      orderReference: merchantReference,
      status: "successful",
      providerReference: verified.providerReference || providerReference,
      verification: verified.verification
    });
    await postgresPersistence.completeWebhookEvent({
      provider: "monnify",
      providerEventId: eventId,
      status: "processed"
    });
    claimedEventId = "";
    sendJson(response, 200, { ok: true, reference: merchantReference, status: "paid" });
  } catch (error) {
    console.error("Monnify webhook processing failed.", error?.code || "verification_failed");
    if (claimedEventId) {
      try {
        await postgresPersistence.completeWebhookEvent({
          provider: "monnify",
          providerEventId: claimedEventId,
          status: "failed",
          errorMessage: error?.message || "Webhook processing failed."
        });
      } catch (completionError) {
        console.error("Monnify webhook failure could not be persisted.", completionError?.code || "unknown");
      }
    }
    sendJson(response, 503, { ok: false, error: "Unable to verify or persist the payment notification." });
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
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, monnify-signature");
    response.setHeader("Access-Control-Allow-Credentials", "true");
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
    const missingHealthConfiguration = getMissingHealthConfiguration();
    const databaseSecurityReady = databaseReadiness.securityStatus === "controls_verified";
    const catalogueStatus = await getMonnifyCatalogueStatus();
    const catalogueReady = catalogueStatus.available === true;
    const providerFeeQuoteAvailable = typeof vendingProvider.quotePurchase === "function";
    const databaseSecurityChecks = databaseReadiness.checks || {};
    const paymentBlockers = [
      "monnify_payment_contract_not_verified",
      "payment_operations_disabled_pending_contract_review"
    ];
    if (!databaseSecurityReady) paymentBlockers.push("database_security_controls_not_verified");
    if (missingHealthConfiguration.length) paymentBlockers.push(...missingHealthConfiguration);
    if (databaseReadiness.securityFailure) {
      paymentBlockers.push(databaseReadiness.securityFailure);
    }
    if (!providerFeeQuoteAvailable) paymentBlockers.push("provider_fee_quote_unavailable");
    if (databaseSecurityChecks.otherRoleGrants?.status !== "none_detected") {
      paymentBlockers.push("anon_authenticated_grants_require_review");
    }
    const billsReadiness = monnifyBillsAdapter.getReadiness();
    const readinessChecks = {
      billsApiActivation: billsReadiness.billsApiActivation,
      verifiedApiContract: billsReadiness.verifiedApiContract,
      catalogueAccess: billsReadiness.catalogueAccess,
      authoritativeCollectionPaymentVerification: {
        ready: false,
        status: "unverified",
        blocker: "authoritative_collection_payment_verification_unverified"
      },
      durableIdempotency: {
        ready: false,
        status: "unverified",
        blocker: "durable_idempotency_unverified"
      },
      databaseBackedOrderPersistence: {
        ready: false,
        status: databaseReadiness.status === "connection_verified" ? "not_end_to_end_verified" : "unavailable",
        blocker: "database_backed_order_persistence_unverified"
      },
      vendingAndReconciliation: billsReadiness.vendingAndReconciliation
    };
    const readinessBlockers = Object.values(readinessChecks)
      .filter((check) => !check.ready)
      .map((check) => check.blocker);
    const healthReady = databaseSecurityReady
      && catalogueReady
      && !paymentsBlocked()
      && BILL_FULFILLMENT_ENABLED
      && readinessBlockers.length === 0;
    sendJson(response, 200, {
      ok: true,
      ready: healthReady,
      readiness: healthReady ? "ready" : "not-ready",
      readinessChecks,
      readinessBlockers,
      service: "electrony-bills",
      mode: healthReady ? "ready" : "fail-closed",
      database: databaseReadiness,
      checks: {
        databaseConnectivity: {
          status: databaseReadiness.connected ? "verified" : "unavailable",
          connected: databaseReadiness.connected
        },
        runtimeRole: databaseSecurityChecks.runtimeRole || {
          status: databaseReadiness.connected ? "not_verified" : "not_checked",
          exists: null,
          connectedAsExpectedRole: null,
          leastPrivilegeVerified: false,
          excessivePrivilegeDetails: null
        },
        tablePermissions: databaseSecurityChecks.tablePermissions || {
          status: databaseReadiness.connected ? "not_verified" : "not_checked",
          requiredGrantsVerified: null,
          excessiveGrantsFound: null,
          excessivePrivilegeDetails: null
        },
        rlsPolicies: databaseSecurityChecks.rlsPolicies || {
          status: databaseReadiness.connected ? "not_verified" : "not_checked",
          enabledOnAllTables: null,
          roleScopedOperationCoverage: null,
          authorizationSemantics: "not_verified",
          publicRolePoliciesFound: null,
          unrestrictedServerPolicies: null,
          policyEvidence: null
        },
        otherRoleGrants: databaseSecurityChecks.otherRoleGrants || {
          status: "not_checked",
          unexpectedGrants: null
        },
        diagnosticFailure: databaseReadiness.diagnosticFailure || null,
        privilegeDiagnostics: {
          requiredGrantsVerified:
            databaseSecurityChecks.privilegeDiagnostics?.requiredGrantsVerified
            ?? databaseSecurityChecks.tablePermissions?.requiredGrantsVerified
            ?? null,
          publicSchemaUsageVerified:
            databaseSecurityChecks.privilegeDiagnostics?.publicSchemaUsageVerified ?? null,
          excessiveBillsTableGrants:
            databaseSecurityChecks.privilegeDiagnostics?.excessiveBillsTableGrants ?? null,
          unexpectedSchemaCreateGrants:
            databaseSecurityChecks.privilegeDiagnostics?.unexpectedSchemaCreateGrants ?? null,
          privateTablePublicAccess:
            databaseSecurityChecks.privilegeDiagnostics?.privateTablePublicAccess ?? null,
          unexpectedSequenceAccess:
            databaseSecurityChecks.privilegeDiagnostics?.unexpectedSequenceAccess ?? null,
          sensitiveFunctionExposure:
            databaseSecurityChecks.privilegeDiagnostics?.sensitiveFunctionExposure ?? null,
          diagnosticsUnverified:
            databaseSecurityChecks.privilegeDiagnostics?.diagnosticsUnverified
            ?? (databaseReadiness.connected ? true : null),
          runtimeRole: databaseSecurityChecks.runtimeRole?.excessivePrivilegeDetails ?? null,
          tables: databaseSecurityChecks.tablePermissions?.excessivePrivilegeDetails ?? null,
          privateTableAccess: databaseSecurityChecks.otherRoleGrants?.unexpectedGrants ?? null
        },
        businessPersistence: {
          ready: readinessChecks.databaseBackedOrderPersistence.ready,
          status: readinessChecks.databaseBackedOrderPersistence.status,
          reason: databaseReadiness.status === "connection_verified"
            ? "PostgreSQL connectivity is verified, but Bills order persistence has not been verified end to end; payment routes remain blocked."
            : "Bills order persistence is unavailable until PostgreSQL connectivity and end-to-end route persistence are verified."
        },
        databaseSecurity: {
          ready: databaseSecurityReady,
          status: databaseReadiness.securityStatus || "not_checked",
          reason: databaseSecurityReady
            ? "PostgreSQL security controls have been verified."
            : databaseReadiness.securityFailure || "Runtime role, table privileges, RLS policies, and related grants are not verified."
        },
        catalogue: {
          ready: catalogueReady,
          status: catalogueStatus.status,
          reason: catalogueStatus.message,
          blockers: [
            readinessChecks.billsApiActivation.blocker,
            readinessChecks.verifiedApiContract.blocker,
            readinessChecks.catalogueAccess.blocker
          ]
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
            "monnify_bills_vending_contract_unverified",
            "provider_fee_and_reconciliation_contract_unverified"
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
        missingRequired: missingHealthConfiguration,
        paymentsBlocked: paymentsBlocked(),
        paymentsBlockedConfigured: !missingHealthConfiguration.includes("PAYMENTS_BLOCKED"),
        monnifyPaymentVerification: false,
        monnifyPaymentContractVerified: MONNIFY_PAYMENT_CONTRACT_VERIFIED,
        vendingProvider: vendingProvider.isConfigured(),
        providerFeeQuote: providerFeeQuoteAvailable,
        providerFulfillmentContractVerified: false,
        durableTransactionalIdempotency: false,
        postgresSecurityControlsVerified: databaseSecurityReady,
        postgresBusinessTablePersistence: false
      },
      virtualCards: marpleradAdapter.isConfigured() ? "provider_configured_api_review_required" : "provider_unconfigured",
      giftCards: teloadlyAdapter.isConfigured() ? "provider_configured_api_review_required" : "provider_unconfigured"
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

  if (request.method === "GET" && url.pathname === "/api/auth/oauth/start") {
    const identity = getIdentityProjectConfig();
    const clientId = readEnv("ELECTRONY_IDENTITY_OAUTH_CLIENT_ID").trim();
    const callback = getValidatedBillsOAuthCallback();
    if (!identity || !clientId || !callback) {
      sendJson(response, 503, { ok: false, error: "Electrony Accounts OAuth is not configured." });
      return;
    }
    const verifier = crypto.randomBytes(32).toString("base64url");
    const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
    const state = crypto.randomBytes(32).toString("base64url");
    const nonce = crypto.randomBytes(32).toString("base64url");
    setSecureCookie(response, BILLS_OAUTH_COOKIE, encodeSignedOAuthCookie({
      verifier,
      state,
      nonce,
      clientId,
      callbackUrl: callback.href,
      expiresAt: Date.now() + 10 * 60 * 1000
    }), 600);
    response.setHeader("Cache-Control", "no-store");
    const authorizeUrl = new URL(`${identity.projectUrl}/auth/v1/oauth/authorize`);
    authorizeUrl.searchParams.set("response_type", "code");
    authorizeUrl.searchParams.set("client_id", clientId);
    authorizeUrl.searchParams.set("redirect_uri", callback.href);
    authorizeUrl.searchParams.set("state", state);
    authorizeUrl.searchParams.set("nonce", nonce);
    authorizeUrl.searchParams.set("scope", "openid email profile");
    authorizeUrl.searchParams.set("code_challenge", challenge);
    authorizeUrl.searchParams.set("code_challenge_method", "S256");
    response.writeHead(302, { Location: authorizeUrl.href });
    response.end();
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/auth/oauth/callback") {
    const oauth = readSignedOAuthCookie(request);
    const code = String(url.searchParams.get("code") || "").trim();
    const state = String(url.searchParams.get("state") || "").trim();
    const oauthError = String(url.searchParams.get("error_description") || url.searchParams.get("error") || "").trim();
    if (oauthError) {
      clearIdentitySessionCookies(response);
      sendJson(response, 400, { ok: false, error: "Electrony Accounts authorization was denied or failed." });
      return;
    }
    if (!oauth || !code || !state || state.length !== String(oauth.state || "").length || !crypto.timingSafeEqual(
      Buffer.from(state),
      Buffer.from(oauth.state || "")
    )) {
      clearIdentitySessionCookies(response);
      sendJson(response, 400, { ok: false, error: "Invalid or expired OAuth callback state." });
      return;
    }
    const clientId = readEnv("ELECTRONY_IDENTITY_OAUTH_CLIENT_ID").trim();
    const callback = getValidatedBillsOAuthCallback();
    if (!callback || !oauth.callbackUrl || oauth.callbackUrl !== callback.href
      || !oauth.clientId || oauth.clientId !== clientId) {
      clearIdentitySessionCookies(response);
      sendJson(response, 400, { ok: false, error: "Invalid OAuth callback configuration." });
      return;
    }
    try {
      const tokens = await exchangeSupabaseOAuthToken({
        grant_type: "authorization_code",
        client_id: oauth.clientId,
        code,
        code_verifier: oauth.verifier,
        redirect_uri: oauth.callbackUrl
      });
      if (!tokens?.id_token) {
        clearIdentitySessionCookies(response);
        sendJson(response, 401, { ok: false, error: "The OAuth nonce could not be validated." });
        return;
      }
      const identity = getIdentityProjectConfig();
      if (!identity) {
        clearIdentitySessionCookies(response);
        sendJson(response, 503, { ok: false, error: "Electrony Accounts OAuth is not configured." });
        return;
      }
      await verifySupabaseIdToken(tokens.id_token, {
        projectUrl: identity.projectUrl,
        clientId: oauth.clientId,
        expectedNonce: oauth.nonce
      });
      const user = await verifySupabaseAccessToken(tokens.access_token);
      if (!user) {
        clearIdentitySessionCookies(response);
        sendJson(response, 401, { ok: false, error: "The OAuth access token could not be verified." });
        return;
      }
      setIdentitySessionCookies(response, tokens);
      clearSecureCookie(response, BILLS_OAUTH_COOKIE);
      const returnUrl = getValidatedBillsAppUrl();
      if (!returnUrl) {
        clearIdentitySessionCookies(response);
        sendJson(response, 503, { ok: false, error: "The Bills application redirect is not configured safely." });
        return;
      }
      returnUrl.searchParams.set("signed_in", "1");
      response.writeHead(302, {
        Location: returnUrl.href,
        "Cache-Control": "no-store"
      });
      response.end();
    } catch (error) {
      clearIdentitySessionCookies(response);
      sendJson(response, error.statusCode || 502, { ok: false, error: error.message || "OAuth callback exchange failed." });
    }
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/auth/refresh") {
    const csrf = readRequestCookie(request, BILLS_CSRF_COOKIE);
    const supplied = String(request.headers["x-csrf-token"] || "");
    if (!csrf || !supplied || supplied.length !== csrf.length
      || !crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(csrf))) {
      sendJson(response, 403, { ok: false, error: "Invalid CSRF token." });
      return;
    }
    const refreshToken = readRequestCookie(request, BILLS_REFRESH_SESSION_COOKIE);
    const clientId = readEnv("ELECTRONY_IDENTITY_OAUTH_CLIENT_ID").trim();
    if (!refreshToken || !clientId) {
      clearIdentitySessionCookies(response);
      sendJson(response, 401, { ok: false, error: "The session has expired. Sign in again." });
      return;
    }
    try {
      const tokens = await exchangeSupabaseOAuthToken({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId
      });
      const user = await verifySupabaseAccessToken(tokens.access_token);
      if (!user) throw new Error("The refreshed access token could not be verified.");
      const csrfToken = setIdentitySessionCookies(response, tokens, csrf);
      sendJson(response, 200, { ok: true, user, csrfToken });
    } catch (error) {
      clearIdentitySessionCookies(response);
      sendJson(response, error.statusCode || 401, { ok: false, error: error.message || "The session has expired. Sign in again." });
    }
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/customer/transactions") {
    const user = await authenticateBillsRequest(request, response);
    if (!user) {
      sendJson(response, 401, { ok: false, error: "Sign in with Electrony Accounts to view registered transaction history." });
      return;
    }
    sendJson(response, 503, {
      ok: false,
      status: "unavailable",
      error: "Registered transaction history is unavailable until customer-owned query authorization is verified.",
      user: { id: user.id }
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/auth/link") {
    sendJson(response, 501, {
      ok: false,
      error: "Explicit legacy-account linking is not enabled. Legacy credentials are preserved and no automatic email-based merge occurs."
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/auth/logout") {
    const csrf = readRequestCookie(request, BILLS_CSRF_COOKIE);
    const supplied = String(request.headers["x-csrf-token"] || "");
    if (!csrf || !supplied || supplied.length !== csrf.length
      || !crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(csrf))) {
      sendJson(response, 403, { ok: false, error: "Invalid CSRF token." });
      return;
    }
    const accessToken = readRequestCookie(request, BILLS_ACCESS_SESSION_COOKIE);
    if (accessToken) {
      const identity = getIdentityProjectConfig();
      if (identity) {
        try {
          await fetch(`${identity.projectUrl}/auth/v1/logout`, {
            method: "POST",
            headers: { apikey: identity.publishableKey, Authorization: `Bearer ${accessToken}` },
            signal: AbortSignal.timeout(10000)
          });
        } catch {}
      }
    }
    clearIdentitySessionCookies(response);
    sendJson(response, 200, { ok: true, signedOut: true });
    return;
  }

  if (request.method === "POST"
    && paymentsBlocked()
    && ["/api/payments/session", "/api/payments/verify", "/api/payments/webhook"].includes(url.pathname)) {
    sendJson(response, 503, {
      ok: false,
      error: "Payment operations are blocked until the Monnify contract, persistence, idempotency, and fulfillment safety requirements are verified."
    });
    return;
  }

  if (process.env.NODE_ENV === "production"
    && !(request.method === "GET" && url.pathname === "/api/fees/quote")
    && !(request.method === "GET" && url.pathname === "/api/services/catalog")
    && !(request.method === "GET" && url.pathname === "/api/services/virtual-cards/catalog")
    && !(request.method === "GET" && url.pathname === "/api/services/gift-cards/catalog")
    && !(request.method === "GET" && url.pathname === "/api/auth/me")
    && !((request.method === "GET" || request.method === "POST") && (
      url.pathname === "/api/auth/oauth/start"
      || url.pathname === "/api/auth/oauth/callback"
      || url.pathname === "/api/auth/logout"
      || url.pathname === "/api/auth/refresh"
      || url.pathname === "/api/auth/link"
      || url.pathname === "/api/customer/transactions"
    ))
    && !(request.method === "POST" && (url.pathname === "/api/auth/register" || url.pathname === "/api/auth/login"))
    && !(request.method === "GET" && url.pathname === "/api/services/virtual-cards/eligibility")
    && !(request.method === "POST" && /^\/api\/services\/(virtual-cards|gift-cards)\/purchase$/.test(url.pathname))
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
      response.setHeader("Deprecation", "true");
      response.setHeader("Link", "</>; rel=\"migration\"");
      sendJson(response, url.pathname.endsWith("/register") ? 201 : 200, {
        ok: true,
        user,
        token: signAuthToken(user),
        expiresIn: TOKEN_LIFETIME_SECONDS,
        migrationRequired: "This legacy Bills login is retained only as a transition compatibility path. Link it to Electrony Accounts through an explicit verified flow."
      });
    } catch (error) {
      sendJson(response, error.message.includes("BILLS_JWT_SECRET") ? 503 : 400, { ok: false, error: error.message });
    }
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/auth/me") {
    const user = await authenticateBillsRequest(request, response);
    const csrfToken = user ? readRequestCookie(request, BILLS_CSRF_COOKIE) : "";
    sendJson(response, user ? 200 : 401, user
      ? { ok: true, user, csrfToken }
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

  if (request.method === "GET" && url.pathname === "/api/services/catalog") {
    sendJson(response, 200, await getMonnifyCatalogueStatus());
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/services/gift-cards/catalog") {
    sendJson(response, 200, {
      ok: true,
      service: "gift-cards",
      available: false,
      status: "provider_unconfigured",
      products: [],
      message: "Gift-card products cannot be displayed or purchased until a gift-card provider and its product catalogue are configured."
    });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/services/virtual-cards/eligibility") {
    if (!await authenticateBillsRequest(request)) {
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
    if (!await authenticateBillsRequest(request)) {
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
    sendJson(response, 503, {
      ok: false,
      error: "Bill fee quotes are unavailable until the Monnify catalogue and its service products are verified.",
      status: (await getMonnifyCatalogueStatus()).status
    });
    return;
  }

  if (request.method === "POST" && url.pathname === "/api/payments/session") {
    try {
      const readiness = await postgresPersistence.getReadiness();
      if (readiness.status !== "connection_verified") {
        sendJson(response, 503, {
          ok: false,
          error: "Payment sessions are unavailable until PostgreSQL persistence is verified."
        });
        return;
      }
      const payload = await readPayload(request);
      const validation = validateServiceRequest(payload);
      const quote = createPlatformFeeQuote(validation.service, validation.amountMinor);
      const quoteClaims = verifyQuoteToken(payload.quoteToken, quote);
      if (!quoteClaims) {
        sendJson(response, 409, { ok: false, error: "Your fee quote is missing or has expired. Refresh the breakdown before confirming payment." });
        return;
      }
      const storedQuote = await postgresPersistence.getFeeQuoteByReference(quoteClaims.quoteReference);
      if (!storedQuote
        || storedQuote.service_type !== validation.service
        || Number(storedQuote.amount_minor) !== validation.amountMinor
        || Number(storedQuote.platform_fee_minor) !== quote.platformFeeMinor
        || (storedQuote.provider_fee_minor === null ? null : Number(storedQuote.provider_fee_minor)) !== quote.providerFeeMinor
        || storedQuote.currency !== quote.currency) {
        sendJson(response, 409, { ok: false, error: "Your fee quote is missing or has changed. Refresh the breakdown before confirming payment." });
        return;
      }
      if ((storedQuote.provider_code || "") !== validation.customer.network
        || (storedQuote.product_code || "") !== validation.customer.plan) {
        sendJson(response, 409, { ok: false, error: "Your fee quote does not match the selected service options." });
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
      const user = await authenticateBillsRequest(request);
      const existingOrder = await postgresPersistence.getOrderByReference(reference, user
        ? { customerId: user.id }
        : { guestOrderSecret: getGuestOrderSecretFromRequest(request, reference) });
      let existingAttempt = null;
      if (existingOrder) {
        if (existingOrder.service_type !== validation.service
          || existingOrder.quote_id !== storedQuote.id
          || Number(existingOrder.amount_minor) !== validation.amountMinor
          || Number(existingOrder.total_amount_minor) !== quote.totalBeforeProviderFeesMinor
          || JSON.stringify(existingOrder.metadata?.customer) !== JSON.stringify(validation.customer)) {
          sendJson(response, 409, { ok: false, error: "The quote has changed. Refresh the breakdown and confirm again." });
          return;
        }
        existingAttempt = await postgresPersistence.getPaymentAttemptByMerchantReference(reference, reference);
        if (existingAttempt || existingOrder.payment_status !== "pending") {
          sendJson(response, 200, {
            ok: true,
            reference,
            amount: validation.amount,
            amountMinor: Number(existingOrder.amount_minor),
            platformFeeMinor: Number(existingOrder.platform_fee_minor),
            providerFeeMinor: existingOrder.provider_fee_minor === null ? null : Number(existingOrder.provider_fee_minor),
            totalAmountMinor: Number(existingOrder.total_amount_minor),
            status: existingOrder.payment_status === "pending" ? "created" : existingOrder.payment_status,
            mode: process.env.NODE_ENV === "production" ? "monnify-production" : "monnify-sandbox",
            checkoutUrl: existingAttempt?.checkout_url || "",
            idempotent: true
          });
          return;
        }
      }

      if (!existingOrder && storedQuote.is_valid !== true) {
        sendJson(response, 409, { ok: false, error: "Your fee quote has expired or has already been used." });
        return;
      }
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
      const order = existingOrder || await postgresPersistence.createOrderFromQuote({
        orderReference: reference,
        quoteReference: quoteClaims.quoteReference,
        customerId: user?.id || null,
        metadata: { channel: "web", customer: validation.customer }
      });
      const guestOrderSecret = order.guestOrderSecret || null;
      const transaction = {
        reference,
        service: validation.service,
        amount: Number(order.amount_minor) / 100,
        amountMinor: Number(order.amount_minor),
        currency: order.currency,
        platformFeeMinor: Number(order.platform_fee_minor),
        platformFeeCurrency: order.currency,
        providerFeeMinor: order.provider_fee_minor === null ? null : Number(order.provider_fee_minor),
        providerFeeCurrency: order.currency,
        totalAmountMinor: Number(order.total_amount_minor),
        totalAmount: Number(order.total_amount_minor) / 100,
        userId: user?.id || null,
        status: order.payment_status === "pending" ? "created" : order.payment_status,
        paymentStatus: "not_started",
        fulfillmentStatus: "not_started",
        createdAt: order.created_at || nowIso(),
        updatedAt: order.updated_at || nowIso(),
        customer: validation.customer,
        metadata: payload.metadata || {},
        providerReference: "",
        monnifyReference: "",
        checkoutUrl: "",
        note: "Transaction stored before external payment authorization."
      };

      if (!hasMonnifyConfig()) {
        if (guestOrderSecret) setGuestOrderSecretCookie(response, reference, guestOrderSecret);
        const missing = getMissingMonnifyConfig();

        sendJson(response, 503, {
          ok: false,
          error: "Monnify is not configured.",
          reference,
          requiredConfig: missing,
          note: "Set the required MONNIFY_* credentials and BILLS_PAYMENT_REDIRECT_URL/BILLS_WEBHOOK_BASE_URL values before processing transactions."
        });
        return;
      }

      let result;
      try {
        result = await createMonnifyReservation(transaction);
      } catch (error) {
        await postgresPersistence.updateOrderPaymentState({
          orderReference: reference,
          expectedStatus: "pending",
          paymentStatus: "failed",
          failureReason: "Unable to create a payment session with the configured provider."
        });
        if (guestOrderSecret) setGuestOrderSecretCookie(response, reference, guestOrderSecret);
        sendJson(response, 502, {
          ok: false,
          error: "Unable to create a payment session with the configured provider.",
          reference
        });
        return;
      }

      try {
        await postgresPersistence.createPaymentAttempt({
          orderReference: reference,
          provider: "monnify",
          merchantReference: reference,
          amountMinor: transaction.totalAmountMinor,
          currency: transaction.currency,
          checkoutUrl: result.checkoutUrl,
          metadata: { providerReference: result.monnifyReference }
        });
      } catch (error) {
        await postgresPersistence.updateOrderPaymentState({
          orderReference: reference,
          expectedStatus: "pending",
          paymentStatus: "review_required",
          failureReason: "Payment reservation exists but its attempt could not be persisted."
        });
        if (guestOrderSecret) setGuestOrderSecretCookie(response, reference, guestOrderSecret);
        console.error("Bills PostgreSQL payment-attempt persistence failed.", error?.code || "unknown");
        sendJson(response, 503, {
          ok: false,
          error: "Payment reservation was created but its attempt could not be persisted. The order requires review.",
          reference
        });
        return;
      }
      if (guestOrderSecret) setGuestOrderSecretCookie(response, reference, guestOrderSecret);

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
        note: "Only the payment redirect URL is exposed to the browser. Monnify credentials remain server-side only."
      });
      return;
    } catch (error) {
      if (error?.code === "order_not_found") {
        sendJson(response, 403, { ok: false, error: "This transaction reference belongs to another customer." });
      } else if (error?.code === "quote_unavailable" || error?.code === "reference_conflict") {
        sendJson(response, 409, { ok: false, error: error.message });
      } else if (error?.safePersistenceError || postgresPersistence.status !== "configured_unverified") {
        console.error("Bills PostgreSQL payment-session persistence failed.", error?.code || "unknown");
        sendJson(response, 503, { ok: false, error: "Unable to create checkout session right now." });
      } else {
        sendJson(response, 400, { ok: false, error: error.message || "Unable to create checkout session." });
      }
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

      const user = await authenticateBillsRequest(request);
      const order = await postgresPersistence.getOrderByReference(reference, user
        ? { customerId: user.id }
        : { guestOrderSecret: getGuestOrderSecretFromRequest(request, reference) });
      if (!order) {
        sendJson(response, 404, { ok: false, error: "Transaction reference not found." });
        return;
      }
      if (order.payment_status === "paid") {
        sendJson(response, 200, { ok: true, reference, verified: true, status: "paid" });
        return;
      }
      const attempt = await postgresPersistence.getPaymentAttemptByMerchantReference(reference, reference);
      if (!attempt) {
        sendJson(response, 409, { ok: false, reference, verified: false, status: order.payment_status });
        return;
      }

      const verified = await verifyMonnifyPayment(reference, attempt);
      await postgresPersistence.recordVerifiedPaymentAttemptStateChange({
        merchantReference: reference,
        orderReference: order.order_reference,
        status: "successful",
        providerReference: verified.providerReference,
        verification: verified.verification
      });
      sendJson(response, 200, {
        ok: true,
        reference,
        verified: true,
        status: "paid",
        providerReference: verified.providerReference
      });
      return;
    } catch (error) {
      if (error?.code === "order_not_found") {
        sendJson(response, 403, { ok: false, verified: false, error: "You do not have access to this transaction." });
      } else {
        console.error("Bills payment verification failed.", error?.code || "unknown");
        const statusCode = error?.message === "Invalid JSON body."
          ? 400
          : (error?.code === "payment_verification_mismatch" ? 409 : 503);
        sendJson(response, statusCode, { ok: false, verified: false, error: error.message || "Payment verification is unavailable right now." });
      }
      return;
    }
  }

  if (request.method === "GET" && url.pathname === "/api/payments/status") {
    const reference = url.searchParams.get("reference") || "";
    if (!reference) {
      sendJson(response, 400, { ok: false, error: "Missing payment reference." });
      return;
    }

    const user = await authenticateBillsRequest(request);
    let order;
    try {
      order = await postgresPersistence.getOrderByReference(reference, user
        ? { customerId: user.id }
        : { guestOrderSecret: getGuestOrderSecretFromRequest(request, reference) });
    } catch (error) {
      if (error?.code === "order_not_found") {
        sendJson(response, 403, { ok: false, error: "You do not have access to this transaction." });
      } else {
        console.error("Bills PostgreSQL order lookup failed.", error?.code || "unknown");
        sendJson(response, 503, { ok: false, error: "Transaction status is unavailable right now." });
      }
      return;
    }
    if (!order) {
      sendJson(response, 404, { ok: false, error: "Transaction reference not found." });
      return;
    }

    sendJson(response, 200, {
      ok: true,
      reference: order.order_reference,
      status: order.payment_status === "pending"
        ? "created"
        : (order.payment_status === "initiated" ? "awaiting_payment" : order.payment_status),
      paymentStatus: order.payment_status === "pending"
        ? "not_started"
        : (order.payment_status === "initiated" ? "payment_pending" : order.payment_status),
      fulfillmentStatus: order.fulfilment_status,
      providerReference: order.provider_transaction_reference || "",
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
