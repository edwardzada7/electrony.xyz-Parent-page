const crypto = require("crypto");
const { createRemoteJWKSet, createLocalJWKSet, jwtVerify } = require("jose");

const PRODUCTION_CALLBACK =
  "https://electronyxyz-parent-page-production.up.railway.app/api/auth/oauth/callback";
const ALLOWED_JWT_ALGORITHMS = ["RS256", "ES256"];

const remoteJwks = new Map();

function validateHttpsSupabaseProject(projectUrl) {
  try {
    const url = new URL(projectUrl);
    if (url.protocol !== "https:"
      || url.pathname !== "/"
      || url.search
      || url.hash
      || url.username
      || url.password
      || url.port) return null;
    return url.href.replace(/\/+$/, "");
  } catch {
    return null;
  }
}

function validateOAuthCallback(rawCallbackUrl, nodeEnv = process.env.NODE_ENV) {
  if (typeof rawCallbackUrl !== "string" || !rawCallbackUrl.trim()) return null;
  try {
    const callback = new URL(rawCallbackUrl.trim());
    if (callback.username || callback.password || callback.search || callback.hash) return null;
    if (callback.pathname !== "/api/auth/oauth/callback" || callback.pathname.endsWith("/")) return null;

    if (nodeEnv === "production") {
      if (callback.href !== PRODUCTION_CALLBACK) return null;
      return callback;
    }

    if (callback.protocol !== "http:"
      || !["localhost", "127.0.0.1"].includes(callback.hostname)) return null;
    return callback;
  } catch {
    return null;
  }
}

function validateConfiguredOrigin(rawOrigin, nodeEnv = process.env.NODE_ENV, { allowLocalDefault = false } = {}) {
  if (typeof rawOrigin !== "string" || !rawOrigin.trim()) return null;
  try {
    const origin = new URL(rawOrigin.trim());
    if (origin.username || origin.password || origin.search || origin.hash) return null;
    if (origin.pathname !== "/" && origin.pathname !== "") return null;
    if (origin.href !== `${origin.origin}/`) return null;
    if (/^https?:\/\/[^/]+:\d+/i.test(rawOrigin.trim())) return null;

    if (nodeEnv === "production") {
      if (origin.protocol !== "https:" || origin.port) return null;
    } else {
      if (origin.protocol === "http:"
        && ["localhost", "127.0.0.1"].includes(origin.hostname)) {
        return origin.origin;
      }
      if (!allowLocalDefault) return null;
      return null;
    }
    return origin.origin;
  } catch {
    return null;
  }
}

function getAllowedOrigins({
  nodeEnv = process.env.NODE_ENV,
  billsAppUrl = "",
  allowedOrigins = ""
} = {}) {
  const origins = new Set();

  if (nodeEnv !== "production") {
    origins.add("http://localhost:4173");
    origins.add("http://127.0.0.1:4173");
  }

  const configured = [
    ...String(allowedOrigins || "").split(",")
  ];

  if (billsAppUrl.trim()) {
    try {
      const appUrl = new URL(billsAppUrl.trim());
      if (appUrl.username || appUrl.password || appUrl.search || appUrl.hash) {
        throw new Error("Invalid Bills application URL.");
      }
      if (nodeEnv === "production"
        && (appUrl.protocol !== "https:" || appUrl.port)) {
        throw new Error("Production BILLS_APP_URL must be an exact HTTPS origin.");
      }
      if (nodeEnv !== "production"
        && appUrl.protocol === "http:"
        && !["localhost", "127.0.0.1"].includes(appUrl.hostname)) {
        throw new Error("Development BILLS_APP_URL HTTP origin must use localhost or 127.0.0.1.");
      }
      if (appUrl.protocol !== "http:" && appUrl.protocol !== "https:") {
        throw new Error("BILLS_APP_URL must use HTTP or HTTPS.");
      }
      origins.add(appUrl.origin);
    } catch {
      throw new Error("BILLS_APP_URL must be a valid HTTP(S) application URL.");
    }
  }

  for (const raw of configured) {
    if (!raw.trim()) continue;
    const origin = validateConfiguredOrigin(raw, nodeEnv);
    if (!origin) throw new Error("BILLS_APP_URL and BILLS_ALLOWED_ORIGINS must contain valid exact origins.");
    if (nodeEnv === "production" && new URL(origin).protocol !== "https:") {
      throw new Error("Production origins must use HTTPS.");
    }
    origins.add(origin);
  }

  if (nodeEnv === "production" && (!billsAppUrl.trim() || origins.size === 0)) {
    throw new Error("BILLS_APP_URL is required for production CORS.");
  }
  if (nodeEnv === "production" && [...origins].some((origin) => origin.includes("*"))) {
    throw new Error("Wildcard origins are not allowed in production.");
  }
  return origins;
}

function getRemoteJwks(projectUrl) {
  if (!remoteJwks.has(projectUrl)) {
    const jwksUrl = new URL(`${projectUrl}/auth/v1/.well-known/jwks.json`);
    if (jwksUrl.protocol !== "https:" || jwksUrl.origin !== projectUrl) {
      throw new Error("Supabase JWKS URL must be HTTPS.");
    }
    remoteJwks.set(projectUrl, createRemoteJWKSet(jwksUrl, {
      cooldownDuration: 30000,
      timeoutDuration: 10000
    }));
  }
  return remoteJwks.get(projectUrl);
}

async function verifySupabaseIdToken(idToken, {
  projectUrl,
  clientId,
  expectedNonce,
  jwks,
  now = Date.now()
}) {
  if (typeof idToken !== "string" || !idToken.trim()) throw new Error("Missing ID token.");
  const trustedProjectUrl = validateHttpsSupabaseProject(projectUrl);
  if (!trustedProjectUrl || typeof clientId !== "string" || !clientId.trim()) {
    throw new Error("Invalid Supabase identity or OAuth client configuration.");
  }
  if (typeof expectedNonce !== "string" || !expectedNonce) {
    throw new Error("Missing OAuth nonce.");
  }

  const resolver = jwks
    ? (typeof jwks === "function" ? jwks : createLocalJWKSet(jwks))
    : getRemoteJwks(trustedProjectUrl);

  const { payload } = await jwtVerify(idToken, resolver, {
    issuer: `${trustedProjectUrl}/auth/v1`,
    audience: clientId,
    algorithms: ALLOWED_JWT_ALGORITHMS,
    clockTolerance: 30
  });

  const nowSeconds = Math.floor(now / 1000);
  if (typeof payload.exp !== "number" || payload.exp <= nowSeconds) {
    throw new Error("Expired or missing ID-token expiration.");
  }
  if (payload.nbf !== undefined && (typeof payload.nbf !== "number" || payload.nbf > nowSeconds + 30)) {
    throw new Error("ID token is not active yet.");
  }
  if (payload.iat !== undefined && (typeof payload.iat !== "number" || payload.iat > nowSeconds + 30)) {
    throw new Error("ID token has an invalid issued-at claim.");
  }
  if (typeof payload.nonce !== "string" || payload.nonce.length !== expectedNonce.length) {
    throw new Error("OAuth nonce mismatch.");
  }
  if (!crypto.timingSafeEqual(Buffer.from(payload.nonce), Buffer.from(expectedNonce))) {
    throw new Error("OAuth nonce mismatch.");
  }
  return payload;
}

function isValidSignedState(state, expectedState) {
  if (typeof state !== "string" || typeof expectedState !== "string"
    || !state || state.length !== expectedState.length) return false;
  return crypto.timingSafeEqual(Buffer.from(state), Buffer.from(expectedState));
}

function validateOAuthStateCookie(payload, submittedState, now = Date.now()) {
  if (!payload || typeof payload !== "object" || typeof payload.expiresAt !== "number") return false;
  if (payload.expiresAt <= now) return false;
  return isValidSignedState(submittedState, payload.state);
}

module.exports = {
  PRODUCTION_CALLBACK,
  validateOAuthCallback,
  validateConfiguredOrigin,
  getAllowedOrigins,
  verifySupabaseIdToken,
  isValidSignedState,
  validateOAuthStateCookie
};
