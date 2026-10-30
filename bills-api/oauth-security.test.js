const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const test = require("node:test");
const { SignJWT } = require("jose");
const {
  validateOAuthCallback,
  getAllowedOrigins,
  verifySupabaseIdToken,
  validateOAuthStateCookie
} = require("./oauth-security");

const PROJECT_URL = "https://identity.supabase.co";
const ISSUER = `${PROJECT_URL}/auth/v1`;
const CLIENT_ID = "electrony-bills-client";

async function createSigningFixture() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicExponent: 0x10001
  });
  const publicJwk = publicKey.export({ format: "jwk" });
  publicJwk.kid = "test-key";
  publicJwk.alg = "RS256";
  publicJwk.use = "sig";
  return {
    privateKey,
    jwks: { keys: [publicJwk] }
  };
}

async function signToken(privateKey, claims = {}) {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({
    nonce: "expected-nonce",
    ...claims
  })
    .setProtectedHeader({ alg: "RS256", kid: "test-key", typ: "JWT" })
    .setIssuer(ISSUER)
    .setAudience(CLIENT_ID)
    .setIssuedAt(now)
    .setExpirationTime(now + 300)
    .sign(privateKey);
}

test("valid ID-token signature and claims are accepted", async () => {
  const fixture = await createSigningFixture();
  const token = await signToken(fixture.privateKey);
  const payload = await verifySupabaseIdToken(token, {
    projectUrl: PROJECT_URL,
    clientId: CLIENT_ID,
    expectedNonce: "expected-nonce",
    jwks: fixture.jwks
  });
  assert.equal(payload.nonce, "expected-nonce");
});

test("invalid ID-token signature is rejected", async () => {
  const first = await createSigningFixture();
  const second = await createSigningFixture();
  const token = await signToken(first.privateKey);
  await assert.rejects(
    verifySupabaseIdToken(token, {
      projectUrl: PROJECT_URL,
      clientId: CLIENT_ID,
      expectedNonce: "expected-nonce",
      jwks: second.jwks
    })
  );
});

test("wrong issuer is rejected", async () => {
  const fixture = await createSigningFixture();
  const token = await signToken(fixture.privateKey, {});
  const parts = token.split(".");
  const payload = JSON.parse(Buffer.from(parts[1], "base64url"));
  payload.iss = "https://attacker.supabase.co/auth/v1";
  const unsigned = `${parts[0]}.${Buffer.from(JSON.stringify(payload)).toString("base64url")}`;
  const signature = crypto.sign("RSA-SHA256", Buffer.from(unsigned), fixture.privateKey).toString("base64url");
  await assert.rejects(verifySupabaseIdToken(`${unsigned}.${signature}`, {
    projectUrl: PROJECT_URL,
    clientId: CLIENT_ID,
    expectedNonce: "expected-nonce",
    jwks: fixture.jwks
  }));
});

test("wrong audience is rejected", async () => {
  const fixture = await createSigningFixture();
  const now = Math.floor(Date.now() / 1000);
  const token = await new SignJWT({ nonce: "expected-nonce" })
    .setProtectedHeader({ alg: "RS256", kid: "test-key", typ: "JWT" })
    .setIssuer(ISSUER).setAudience("other-client").setIssuedAt(now)
    .setExpirationTime(now + 300).sign(fixture.privateKey);
  await assert.rejects(verifySupabaseIdToken(token, {
    projectUrl: PROJECT_URL,
    clientId: CLIENT_ID,
    expectedNonce: "expected-nonce",
    jwks: fixture.jwks
  }));
});

test("expired ID token is rejected", async () => {
  const fixture = await createSigningFixture();
  const now = Math.floor(Date.now() / 1000);
  const token = await new SignJWT({ nonce: "expected-nonce" })
    .setProtectedHeader({ alg: "RS256", kid: "test-key", typ: "JWT" })
    .setIssuer(ISSUER).setAudience(CLIENT_ID).setIssuedAt(now - 600)
    .setExpirationTime(now - 1).sign(fixture.privateKey);
  await assert.rejects(verifySupabaseIdToken(token, {
    projectUrl: PROJECT_URL,
    clientId: CLIENT_ID,
    expectedNonce: "expected-nonce",
    jwks: fixture.jwks
  }));
});

test("missing nonce is rejected", async () => {
  const fixture = await createSigningFixture();
  const now = Math.floor(Date.now() / 1000);
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "RS256", kid: "test-key", typ: "JWT" })
    .setIssuer(ISSUER).setAudience(CLIENT_ID).setIssuedAt(now)
    .setExpirationTime(now + 300).sign(fixture.privateKey);
  await assert.rejects(verifySupabaseIdToken(token, {
    projectUrl: PROJECT_URL,
    clientId: CLIENT_ID,
    expectedNonce: "expected-nonce",
    jwks: fixture.jwks
  }));
});

test("incorrect nonce is rejected", async () => {
  const fixture = await createSigningFixture();
  const token = await signToken(fixture.privateKey, { nonce: "wrong-nonce" });
  await assert.rejects(verifySupabaseIdToken(token, {
    projectUrl: PROJECT_URL,
    clientId: CLIENT_ID,
    expectedNonce: "expected-nonce",
    jwks: fixture.jwks
  }));
});

test("expired OAuth state is rejected", () => {
  assert.equal(validateOAuthStateCookie({
    state: "state-value",
    expiresAt: Date.now() - 1
  }, "state-value"), false);
});

test("incorrect OAuth state is rejected", () => {
  assert.equal(validateOAuthStateCookie({
    state: "state-value",
    expiresAt: Date.now() + 60000
  }, "different-state"), false);
});

test("invalid production callback hostname is rejected", () => {
  assert.equal(validateOAuthCallback(
    "https://other.example/api/auth/oauth/callback", "production"
  ), null);
});

test("invalid production callback protocol is rejected", () => {
  assert.equal(validateOAuthCallback(
    "http://electronyxyz-parent-page-production.up.railway.app/api/auth/oauth/callback", "production"
  ), null);
});

test("unexpected callback path is rejected", () => {
  assert.equal(validateOAuthCallback(
    "https://electronyxyz-parent-page-production.up.railway.app/other", "production"
  ), null);
});

test("HTTP origin is rejected in production", () => {
  assert.throws(() => getAllowedOrigins({
    nodeEnv: "production",
    billsAppUrl: "http://bills.example/bills/app/",
    allowedOrigins: ""
  }));
});

test("unapproved credentialed CORS origin is rejected", () => {
  const allowed = getAllowedOrigins({
    nodeEnv: "production",
    billsAppUrl: "https://bills.electrony.xyz/bills/app/",
    allowedOrigins: "https://other.electrony.xyz"
  });
  assert.equal(allowed.has("https://evil.example"), false);
});

test("valid configured HTTPS production origin is accepted", () => {
  const allowed = getAllowedOrigins({
    nodeEnv: "production",
    billsAppUrl: "https://bills.electrony.xyz/bills/app/",
    allowedOrigins: "https://admin.electrony.xyz"
  });
  assert.equal(allowed.has("https://bills.electrony.xyz"), true);
  assert.equal(allowed.has("https://admin.electrony.xyz"), true);
});

test("explicitly configured localhost development origin is accepted", () => {
  const allowed = getAllowedOrigins({
    nodeEnv: "development",
    billsAppUrl: "http://localhost:4173/bills/app/",
    allowedOrigins: ""
  });
  assert.equal(allowed.has("http://localhost:4173"), true);
});
