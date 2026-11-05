const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const crypto = require("node:crypto");
const net = require("node:net");
const path = require("node:path");
const test = require("node:test");
const { SignJWT } = require("jose");
const {
  validateOAuthCallback,
  validateBillsAppUrl,
  validateBillsReturnUrl,
  validateOAuthStartConfiguration,
  createOAuthAuthorizationRequest,
  getSafeOAuthProviderFailure,
  getAllowedOrigins,
  verifySupabaseIdToken,
  validateOAuthStateCookie,
  isSupabaseEmailVerified
} = require("./oauth-security");

const PROJECT_URL = "https://identity.supabase.co";
const ISSUER = `${PROJECT_URL}/auth/v1`;
const CLIENT_ID = "electrony-bills-client";
const OAUTH_CONFIG = {
  projectUrl: PROJECT_URL,
  publishableKey: "sb_publishable_test_key_value_0123456789",
  clientId: CLIENT_ID,
  callbackUrl: "https://electronyxyz-parent-page-production.up.railway.app/api/auth/oauth/callback",
  jwtSecret: "test-only-bills-jwt-secret-with-at-least-32-characters",
  nodeEnv: "production"
};

async function getAvailablePort() {
  const listener = net.createServer();
  await new Promise((resolve, reject) => {
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", resolve);
  });
  const { port } = listener.address();
  await new Promise((resolve, reject) => listener.close((error) => error ? reject(error) : resolve()));
  return port;
}

function waitForServer(child) {
  return new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => reject(new Error("Bills API test server did not start.")), 5000);
    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
      if (output.includes("Electrony Bills API listening")) {
        clearTimeout(timer);
        resolve();
      }
    });
    child.once("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Bills API test server exited before listening (${code}).`));
    });
  });
}

test("OAuth start reports missing configuration by variable name only", () => {
  const result = validateOAuthStartConfiguration({ nodeEnv: "production" });
  assert.equal(result.ok, false);
  assert.equal(result.diagnosticCode, "oauth_configuration_missing");
  assert.deepEqual(result.missingSettings, [
    "ELECTRONY_IDENTITY_SUPABASE_URL",
    "ELECTRONY_IDENTITY_SUPABASE_PUBLISHABLE_KEY",
    "ELECTRONY_IDENTITY_OAUTH_CLIENT_ID",
    "BILLS_OAUTH_CALLBACK_URL",
    "BILLS_JWT_SECRET"
  ]);
  assert.equal(JSON.stringify(result).includes(OAUTH_CONFIG.jwtSecret), false);
});

test("invalid production callback is diagnosed without weakening exact callback validation", () => {
  const result = validateOAuthStartConfiguration({
    ...OAUTH_CONFIG,
    callbackUrl: "https://other.example/api/auth/oauth/callback"
  });
  assert.equal(result.ok, false);
  assert.equal(result.diagnosticCode, "oauth_callback_invalid");
  assert.deepEqual(result.invalidSettings, ["BILLS_OAUTH_CALLBACK_URL"]);
});

test("valid production OAuth configuration is accepted", () => {
  const result = validateOAuthStartConfiguration(OAUTH_CONFIG);
  assert.equal(result.ok, true);
  assert.equal(result.projectUrl, PROJECT_URL);
  assert.equal(result.clientId, CLIENT_ID);
  assert.equal(result.callbackUrl, OAUTH_CONFIG.callbackUrl);
});

test("production Bills app URL is restricted to the standalone root", () => {
  assert.equal(
    validateBillsAppUrl("https://bills.electrony.xyz/", "production").href,
    "https://bills.electrony.xyz/"
  );
  assert.equal(validateBillsAppUrl("https://bills.electrony.xyz/bills/app/", "production"), null);
  assert.equal(validateBillsAppUrl("https://attacker.example/", "production"), null);
});

test("OAuth authorization request uses Supabase endpoint, exact callback, scopes, state, nonce, and PKCE S256", () => {
  const config = validateOAuthStartConfiguration(OAUTH_CONFIG);
  const request = createOAuthAuthorizationRequest(config);
  const url = request.authorizeUrl;
  assert.equal(url.origin, PROJECT_URL);
  assert.equal(url.pathname, "/auth/v1/oauth/authorize");
  assert.equal(url.searchParams.get("client_id"), CLIENT_ID);
  assert.equal(url.searchParams.get("redirect_uri"), OAUTH_CONFIG.callbackUrl);
  assert.equal(url.searchParams.get("response_type"), "code");
  assert.equal(url.searchParams.get("scope"), "openid email");
  assert.equal(url.searchParams.get("state"), request.state);
  assert.equal(url.searchParams.get("nonce"), request.nonce);
  assert.equal(url.searchParams.get("code_challenge_method"), "S256");
  assert.equal(url.searchParams.get("code_challenge"), request.challenge);
  assert.equal(request.verifier.length, 43);
  assert.equal(request.state.length, 43);
  assert.equal(request.nonce.length, 43);
  assert.equal(request.challenge, crypto.createHash("sha256").update(request.verifier).digest("base64url"));
});

test("OAuth provider failures expose only a safe message and status", () => {
  const providerMessage = "raw-provider-error-description-with-secret";
  const result = getSafeOAuthProviderFailure(400);
  assert.equal(result.statusCode, 400);
  assert.equal(result.message, "Electrony Accounts authorization could not be completed.");
  assert.equal(JSON.stringify(result).includes(providerMessage), false);
  assert.equal(getSafeOAuthProviderFailure(503).statusCode, 502);
});

test("OAuth start sends a secure-cookie 302 and callback provider errors stay redacted", async () => {
  const port = await getAvailablePort();
  const jwtSecret = "test-only-bills-jwt-secret-with-at-least-32-characters";
  const child = spawn(process.execPath, ["bills-api/server.js"], {
    cwd: path.resolve(__dirname, ".."),
    env: {
      PATH: process.env.PATH,
      NODE_ENV: "production",
      PORT: String(port),
      NODE_OPTIONS: `--require=${path.join(__dirname, "oauth-provider.fixture.js")}`,
      ELECTRONY_IDENTITY_SUPABASE_URL: PROJECT_URL,
      ELECTRONY_IDENTITY_SUPABASE_PUBLISHABLE_KEY: OAUTH_CONFIG.publishableKey,
      ELECTRONY_IDENTITY_OAUTH_CLIENT_ID: CLIENT_ID,
      BILLS_OAUTH_CALLBACK_URL: OAUTH_CONFIG.callbackUrl,
      BILLS_APP_URL: "https://bills.electrony.xyz/",
      BILLS_JWT_SECRET: jwtSecret
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  try {
    await waitForServer(child);
    const appUrl = "https://bills.electrony.xyz/";
    const startOAuth = async (returnTo = appUrl) => fetch(
      `http://127.0.0.1:${port}/api/auth/oauth/start?return_to=${encodeURIComponent(returnTo)}`,
      { redirect: "manual" }
    );
    const getOAuthCookie = (response) => {
      const cookie = response.headers.getSetCookie()
        .find((value) => value.startsWith("__Secure-electrony-bills-oauth="));
      const pair = cookie.split(";", 1)[0];
      const encoded = pair.slice(pair.indexOf("=") + 1);
      const [body] = decodeURIComponent(encoded).split(".");
      return {
        pair,
        payload: JSON.parse(Buffer.from(body, "base64url").toString("utf8"))
      };
    };
    const callCallback = (oauthCookie, code, cookiePair = oauthCookie.pair) => {
      const callbackUrl = new URL(`http://127.0.0.1:${port}/api/auth/oauth/callback`);
      callbackUrl.searchParams.set("state", oauthCookie.payload.state);
      if (code !== null) callbackUrl.searchParams.set("code", code);
      return fetch(callbackUrl, {
        headers: { Cookie: cookiePair },
        redirect: "manual"
      });
    };
    const invalidReturnResponse = await fetch(
      `http://127.0.0.1:${port}/api/auth/oauth/start?return_to=${encodeURIComponent("https://attacker.example/")}`,
      { redirect: "manual" }
    );
    assert.equal(invalidReturnResponse.status, 302);
    const invalidReturnUrl = new URL(invalidReturnResponse.headers.get("location"));
    assert.equal(invalidReturnUrl.origin, "https://bills.electrony.xyz");
    assert.equal(invalidReturnUrl.pathname, "/");
    assert.equal(invalidReturnUrl.searchParams.get("auth"), "unavailable");

    const unavailableReturnResponse = await fetch(
      `http://127.0.0.1:${port}/api/auth/oauth/start?return_to=${encodeURIComponent("https://bills.electrony.xyz/bills/app/")}`,
      { redirect: "manual" }
    );
    assert.equal(unavailableReturnResponse.status, 302);
    const unavailableReturnUrl = new URL(unavailableReturnResponse.headers.get("location"));
    assert.equal(unavailableReturnUrl.pathname, "/");
    assert.equal(unavailableReturnUrl.searchParams.get("auth"), "unavailable");

    const returnTo = "https://bills.electrony.xyz/?service=data";
    const startResponse = await fetch(
      `http://127.0.0.1:${port}/api/auth/oauth/start?return_to=${encodeURIComponent(returnTo)}`,
      { redirect: "manual" }
    );
    assert.equal(startResponse.status, 302);
    assert.equal(startResponse.headers.get("cache-control"), "no-store");

    const authorizationUrl = new URL(startResponse.headers.get("location"));
    assert.equal(authorizationUrl.origin, PROJECT_URL);
    assert.equal(authorizationUrl.pathname, "/auth/v1/oauth/authorize");
    const cookieHeader = startResponse.headers.get("set-cookie");
    assert.match(cookieHeader, /^__Secure-electrony-bills-oauth=/);
    assert.match(cookieHeader, /; HttpOnly; Secure; SameSite=None/);
    const cookiePair = cookieHeader.split(";", 1)[0];
    const cookieValue = decodeURIComponent(cookiePair.slice(cookiePair.indexOf("=") + 1));
    const [cookieBody, cookieSignature] = cookieValue.split(".");
    const expectedSignature = crypto.createHmac("sha256", jwtSecret).update(cookieBody).digest("base64url");
    assert.equal(cookieSignature, expectedSignature);
    const oauthCookie = JSON.parse(Buffer.from(cookieBody, "base64url").toString("utf8"));
    assert.equal(authorizationUrl.searchParams.get("state"), oauthCookie.state);
    assert.equal(authorizationUrl.searchParams.get("nonce"), oauthCookie.nonce);
    assert.equal(authorizationUrl.searchParams.get("client_id"), CLIENT_ID);
    assert.equal(authorizationUrl.searchParams.get("redirect_uri"), OAUTH_CONFIG.callbackUrl);
    assert.equal(authorizationUrl.searchParams.get("response_type"), "code");
    assert.equal(authorizationUrl.searchParams.get("scope"), "openid email");
    assert.equal(oauthCookie.returnTo, returnTo);
    assert.equal(authorizationUrl.searchParams.get("code_challenge_method"), "S256");
    assert.equal(
      authorizationUrl.searchParams.get("code_challenge"),
      crypto.createHash("sha256").update(oauthCookie.verifier).digest("base64url")
    );

    const providerMessage = "provider-private-error-detail";
    const callbackResponse = await fetch(
      `http://127.0.0.1:${port}/api/auth/oauth/callback?error=access_denied&state=${encodeURIComponent(oauthCookie.state)}&error_description=${encodeURIComponent(providerMessage)}`,
      { headers: { Cookie: cookiePair }, redirect: "manual" }
    );
    const callbackBody = await callbackResponse.text();
    assert.equal(callbackResponse.status, 302);
    assert.equal(callbackBody.includes(providerMessage), false);
    assert.equal(callbackBody.includes("access_denied"), false);
    const cancelledUrl = new URL(callbackResponse.headers.get("location"));
    assert.equal(cancelledUrl.origin, "https://bills.electrony.xyz");
    assert.equal(cancelledUrl.pathname, "/");
    assert.equal(cancelledUrl.searchParams.get("service"), "data");
    assert.equal(cancelledUrl.searchParams.get("auth"), "cancelled");

    const invalidStateResponse = await fetch(
      `http://127.0.0.1:${port}/api/auth/oauth/callback?code=not-used&state=attacker-state`,
      { headers: { Cookie: cookiePair }, redirect: "manual" }
    );
    assert.equal(invalidStateResponse.status, 302);
    const failedUrl = new URL(invalidStateResponse.headers.get("location"));
    assert.equal(failedUrl.searchParams.get("auth"), "failed");
    assert.equal(failedUrl.searchParams.get("service"), "data");

    const missingStateResponse = await fetch(
      `http://127.0.0.1:${port}/api/auth/oauth/callback?code=not-used`,
      { headers: { Cookie: cookiePair }, redirect: "manual" }
    );
    assert.equal(missingStateResponse.status, 302);
    const missingStateUrl = new URL(missingStateResponse.headers.get("location"));
    assert.equal(missingStateUrl.pathname, "/");
    assert.equal(missingStateUrl.searchParams.get("auth"), "failed");

    const expiredStateStart = await startOAuth();
    const expiredStateOAuth = getOAuthCookie(expiredStateStart);
    expiredStateOAuth.payload.expiresAt = Date.now() - 1;
    const expiredStateBody = Buffer.from(JSON.stringify(expiredStateOAuth.payload)).toString("base64url");
    const expiredStateSignature = crypto.createHmac("sha256", jwtSecret)
      .update(expiredStateBody).digest("base64url");
    const expiredStateCookie = `__Secure-electrony-bills-oauth=${encodeURIComponent(`${expiredStateBody}.${expiredStateSignature}`)}`;
    const expiredStateCallback = await callCallback(
      expiredStateOAuth,
      "not-used",
      expiredStateCookie
    );
    assert.equal(expiredStateCallback.status, 302);
    const expiredStateUrl = new URL(expiredStateCallback.headers.get("location"));
    assert.equal(expiredStateUrl.origin, "https://bills.electrony.xyz");
    assert.equal(expiredStateUrl.pathname, "/");
    assert.equal(expiredStateUrl.searchParams.get("auth"), "failed");

    const successStart = await startOAuth("https://bills.electrony.xyz/?service=airtime");
    const successOAuth = getOAuthCookie(successStart);
    const successCode = `authorization:${successOAuth.payload.nonce}:${successOAuth.payload.verifier}`;
    const successCallback = await callCallback(successOAuth, successCode);
    assert.equal(successCallback.status, 302);
    const successUrl = new URL(successCallback.headers.get("location"));
    assert.equal(successUrl.searchParams.get("auth"), "success");
    assert.equal(successUrl.searchParams.get("service"), "airtime");

    const sessionCookieNames = [
      "__Secure-electrony-bills-session",
      "__Secure-electrony-bills-refresh",
      "__Secure-electrony-bills-csrf"
    ];
    const sessionCookies = successCallback.headers.getSetCookie()
      .filter((value) => sessionCookieNames.some((name) => value.startsWith(`${name}=`)))
      .map((value) => value.split(";", 1)[0]);
    assert.equal(sessionCookies.length, 3);
    const billsSessionCookie = sessionCookies.join("; ");
    const csrfCookie = sessionCookies.find((value) => value.startsWith("__Secure-electrony-bills-csrf="));
    const csrfToken = csrfCookie.slice(csrfCookie.indexOf("=") + 1);

    const meResponse = await fetch(`http://127.0.0.1:${port}/api/auth/me`, {
      headers: { Cookie: billsSessionCookie }
    });
    assert.equal(meResponse.status, 200);
    assert.equal((await meResponse.json()).user.id, "5a64cc19-377f-4f4e-a0b1-38da49865004");

    const transactionResponse = await fetch(`http://127.0.0.1:${port}/api/customer/transactions`, {
      headers: { Cookie: billsSessionCookie }
    });
    assert.equal(transactionResponse.status, 503);
    const transactionPayload = await transactionResponse.json();
    assert.equal(transactionPayload.ok, false);
    assert.equal(transactionPayload.status, "unavailable");
    assert.match(transactionPayload.error, /transaction history is temporarily unavailable/i);

    const logoutResponse = await fetch(`http://127.0.0.1:${port}/api/auth/logout`, {
      method: "POST",
      headers: {
        Cookie: billsSessionCookie,
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      body: "{}"
    });
    assert.equal(logoutResponse.status, 200);
    assert.equal((await logoutResponse.json()).providerRevoked, true);

    const expiredCodeStart = await startOAuth();
    const expiredCodeOAuth = getOAuthCookie(expiredCodeStart);
    const expiredCodeCallback = await callCallback(expiredCodeOAuth, "expired");
    assert.equal(expiredCodeCallback.status, 302);
    assert.equal(new URL(expiredCodeCallback.headers.get("location")).searchParams.get("auth"), "expired");

    const missingVerifierStart = await startOAuth();
    const missingVerifier = getOAuthCookie(missingVerifierStart);
    missingVerifier.payload.verifier = "";
    const missingVerifierBody = Buffer.from(JSON.stringify(missingVerifier.payload)).toString("base64url");
    const missingVerifierSignature = crypto.createHmac("sha256", jwtSecret)
      .update(missingVerifierBody).digest("base64url");
    const missingVerifierCookie = `__Secure-electrony-bills-oauth=${encodeURIComponent(`${missingVerifierBody}.${missingVerifierSignature}`)}`;
    const missingVerifierCode = `authorization:${missingVerifier.payload.nonce}:`;
    const missingVerifierCallback = await callCallback(missingVerifier, missingVerifierCode, missingVerifierCookie);
    assert.equal(new URL(missingVerifierCallback.headers.get("location")).searchParams.get("auth"), "expired");

    const unverifiedStart = await startOAuth();
    const unverifiedOAuth = getOAuthCookie(unverifiedStart);
    const unverifiedCode = `unverified:${unverifiedOAuth.payload.nonce}:${unverifiedOAuth.payload.verifier}`;
    const unverifiedCallback = await callCallback(unverifiedOAuth, unverifiedCode);
    assert.equal(new URL(unverifiedCallback.headers.get("location")).searchParams.get("auth"), "verification_required");

    const expiredSessionResponse = await fetch(`http://127.0.0.1:${port}/api/auth/me`, {
      headers: {
        Cookie: [
          "__Secure-electrony-bills-session=fixture-expired-access",
          "__Secure-electrony-bills-refresh=fixture-expired-refresh"
        ].join("; ")
      }
    });
    assert.equal(expiredSessionResponse.status, 401);
    assert.ok(expiredSessionResponse.headers.getSetCookie().some((value) => value.includes("Max-Age=0")));
  } finally {
    const stopped = new Promise((resolve) => child.once("exit", resolve));
    child.kill("SIGTERM");
    await stopped;
  }
});

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

test("unverified Supabase accounts are not accepted as Bills customers", () => {
  assert.equal(isSupabaseEmailVerified({ email_confirmed_at: "2026-01-01T00:00:00Z" }), true);
  assert.equal(isSupabaseEmailVerified({ confirmed_at: "2026-01-01T00:00:00Z" }), true);
  assert.equal(isSupabaseEmailVerified({ email_confirmed_at: null }), false);
  assert.equal(isSupabaseEmailVerified(null), false);
});

test("Bills OAuth return URL is limited to the configured app route", () => {
  const appUrl = "https://bills.electrony.xyz/";
  assert.equal(
    validateBillsReturnUrl(`${appUrl}?service=data`, appUrl).href,
    `${appUrl}?service=data`
  );
  assert.equal(validateBillsReturnUrl("https://attacker.example/collect", appUrl), null);
  assert.equal(validateBillsReturnUrl("https://bills.electrony.xyz/bills/app/", appUrl), null);
  assert.equal(validateBillsReturnUrl("https://other.bills.electrony.xyz/", appUrl), null);
  assert.equal(validateBillsReturnUrl(`${appUrl}#fragment`, appUrl), null);
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

test("production callback must use the exact registered URI", () => {
  assert.equal(validateOAuthCallback(
    "https://electronyxyz-parent-page-production.up.railway.app/api/auth/oauth/callback/", "production"
  ), null);
  assert.equal(validateOAuthCallback(
    "https://electronyxyz-parent-page-production.up.railway.app/api/auth/callback", "production"
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
    billsAppUrl: "https://bills.electrony.xyz/",
    allowedOrigins: "https://other.electrony.xyz"
  });
  assert.equal(allowed.has("https://evil.example"), false);
});

test("valid configured HTTPS production origin is accepted", () => {
  const allowed = getAllowedOrigins({
    nodeEnv: "production",
    billsAppUrl: "https://bills.electrony.xyz/",
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
