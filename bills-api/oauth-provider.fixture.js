const crypto = require("node:crypto");

const PROJECT_URL = "https://identity.supabase.co";
const CLIENT_ID = "electrony-bills-client";
const USER_ID = "5a64cc19-377f-4f4e-a0b1-38da49865004";
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicExponent: 0x10001
});
const publicJwk = publicKey.export({ format: "jwk" });
publicJwk.kid = "test-oauth-key";
publicJwk.alg = "RS256";
publicJwk.use = "sig";

function response(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

function createIdToken(nonce) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({
    alg: "RS256",
    kid: publicJwk.kid,
    typ: "JWT"
  })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({
    iss: `${PROJECT_URL}/auth/v1`,
    aud: CLIENT_ID,
    sub: USER_ID,
    nonce,
    iat: now,
    exp: now + 300
  })).toString("base64url");
  const signingInput = `${header}.${payload}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(signingInput), privateKey).toString("base64url");
  return `${signingInput}.${signature}`;
}

globalThis.fetch = async (input, init = {}) => {
  const url = new URL(typeof input === "string" ? input : input.url);
  if (url.origin !== PROJECT_URL) return Response.json({ error: "Unexpected fixture request." }, { status: 500 });

  if (url.pathname === "/auth/v1/.well-known/jwks.json") {
    return response({ keys: [publicJwk] });
  }

  if (url.pathname === "/auth/v1/oauth/token" && init.method === "POST") {
    const form = new URLSearchParams(init.body);
    if (form.get("client_secret")) return response({ error: "invalid_client" }, 401);
    if (form.get("grant_type") === "authorization_code") {
      const [flow, nonce, expectedVerifier] = String(form.get("code") || "").split(":");
      if (flow === "expired" || !expectedVerifier || form.get("code_verifier") !== expectedVerifier) {
        return response({ error: "invalid_grant" }, 400);
      }
      return response({
        access_token: flow === "unverified" ? "fixture-unverified" : "fixture-access",
        refresh_token: "fixture-refresh",
        expires_in: 3600,
        id_token: createIdToken(nonce)
      });
    }
    if (form.get("grant_type") === "refresh_token") {
      if (form.get("refresh_token") === "fixture-expired-refresh") {
        return response({ error: "invalid_grant" }, 400);
      }
      return response({
        access_token: "fixture-refreshed",
        refresh_token: "fixture-refresh-rotated",
        expires_in: 3600
      });
    }
  }

  if (url.pathname === "/auth/v1/user" && init.method === "GET") {
    const authorization = new Headers(init.headers).get("Authorization") || "";
    if (!/^Bearer fixture-(?:access|refreshed|unverified)$/.test(authorization)) {
      return response({ error: "invalid_token" }, 401);
    }
    const unverified = authorization === "Bearer fixture-unverified";
    return response({
      id: USER_ID,
      email: "fixture@example.test",
      email_confirmed_at: unverified ? null : "2026-01-01T00:00:00.000Z",
      user_metadata: { full_name: "Fixture User" }
    });
  }

  if (url.pathname === "/auth/v1/logout" && init.method === "POST") {
    return new Response(null, { status: 204 });
  }

  return response({ error: "Unexpected fixture endpoint." }, 404);
};
