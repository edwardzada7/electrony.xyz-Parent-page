"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const test = require("node:test");
const {
  SANDBOX_BASE_URL,
  createSogoAdapter,
  getSogoFailureDiagnostics
} = require("./adapters/sogo-adapter");

function createResponse(status, payload, headers = {}) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: new Headers(headers),
    async text() {
      return JSON.stringify(payload);
    }
  };
}

function createRawResponse(status, text) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: new Headers(),
    async text() {
      return text;
    }
  };
}

function configuredEnv(overrides = {}) {
  return {
    SOGO_ENABLED: "true",
    SOGO_API_BASE_URL: SANDBOX_BASE_URL,
    SOGO_SECRET_KEY: "sogo_sk_test_123456789",
    SOGO_WEBHOOK_SECRET: "sandbox-webhook-secret",
    ...overrides
  };
}

test("catalogue, plans, packages, verification, purchases, and status use documented sandbox routes", async () => {
  const calls = [];
  const adapter = createSogoAdapter({
    readEnv: (name) => configuredEnv()[name] || "",
    fetchImpl: async (url, options) => {
      calls.push({ url, options });
      return createResponse(200, { data: { providers: [] } });
    }
  });
  const key = crypto.randomUUID();

  await adapter.getCatalogue();
  await adapter.getDataPlans("mtn");
  await adapter.getCablePackages("dstv");
  await adapter.getEducationPlans();
  await adapter.verifyMeter({ disco_slug: "ikedc", meter_number: "45012345678", meter_type: "prepaid" });
  await adapter.verifySmartcard({ provider: "dstv", smartcard_number: "1234567890" });
  await adapter.verifyJamb({ profile_id: "12345678" });
  await adapter.verifyBetAccount({ provider: "bet9ja", account_id: "123456" });
  await adapter.purchaseAirtime({ network: "mtn", phone: "08012345678", amount: 1000 }, key);
  await adapter.purchaseData({ network: "mtn", phone: "08012345678", variation_code: "actual-code" }, key);
  await adapter.purchaseElectricity({
    disco_slug: "ikedc",
    meter_number: "45012345678",
    meter_type: "prepaid",
    amount: 1000
  }, key);
  await adapter.purchaseCableTv({
    provider: "dstv",
    smartcard_number: "1234567890",
    subscription_type: "renew",
    variation_code: "actual-package",
    amount: 1000
  }, key);
  await adapter.purchaseEducation({ provider: "jamb", profile_id: "12345678", variation_code: "actual-plan", amount: 1000 }, key);
  await adapter.getTransaction(key, { byIdempotencyKey: true });

  assert.deepEqual(calls.map(({ url }) => url), [
    `${SANDBOX_BASE_URL}/bills/catalog`,
    `${SANDBOX_BASE_URL}/bills/data-plans?network=mtn`,
    `${SANDBOX_BASE_URL}/bills/cable-packages?provider=dstv`,
    `${SANDBOX_BASE_URL}/bills/education-plans`,
    `${SANDBOX_BASE_URL}/bills/electricity/verify-meter`,
    `${SANDBOX_BASE_URL}/bills/cable-tv/verify-smartcard`,
    `${SANDBOX_BASE_URL}/bills/education/verify-jamb`,
    `${SANDBOX_BASE_URL}/bills/bet-funding/verify-account`,
    `${SANDBOX_BASE_URL}/bills/airtime`,
    `${SANDBOX_BASE_URL}/bills/data`,
    `${SANDBOX_BASE_URL}/bills/electricity`,
    `${SANDBOX_BASE_URL}/bills/cable-tv`,
    `${SANDBOX_BASE_URL}/bills/education`,
    `${SANDBOX_BASE_URL}/transactions/${key}?type=bill_payment`
  ]);
  for (const { options } of calls) {
    assert.equal(options.headers.Authorization, "Bearer sogo_sk_test_123456789");
  }
  for (const { options } of calls.slice(8, 13)) {
    assert.equal(options.headers["Idempotency-Key"], key);
  }
  assert.equal(calls[4].options.body, JSON.stringify({
    disco_slug: "ikedc",
    meter_number: "45012345678",
    meter_type: "prepaid"
  }));
  assert.equal(calls[5].options.body, JSON.stringify({
    provider: "dstv",
    smartcard_number: "1234567890"
  }));
});

test("configuration fails closed for missing keys, disabled integration, and live URLs or keys", async () => {
  for (const env of [
    configuredEnv({ SOGO_ENABLED: "false" }),
    configuredEnv({ SOGO_API_BASE_URL: "https://api.sogo.africa/v1" }),
    configuredEnv({ SOGO_SECRET_KEY: "sogo_sk_live_123456789" }),
    configuredEnv({ SOGO_SECRET_KEY: "" })
  ]) {
    const adapter = createSogoAdapter({ readEnv: (name) => env[name] || "" });
    assert.equal(adapter.isConfigured(), false);
    await assert.rejects(adapter.getCatalogue(), (error) => error.code === "sogo_not_configured");
  }
});

test("purchase timeout is marked uncertain and does not retry or create another key", async () => {
  let requestCount = 0;
  const adapter = createSogoAdapter({
    readEnv: (name) => configuredEnv()[name] || "",
    fetchImpl: async () => {
      requestCount += 1;
      throw new Error("network timeout");
    }
  });
  const key = crypto.randomUUID();

  await assert.rejects(
    adapter.purchaseAirtime({ network: "mtn", phone: "08012345678", amount: 1000 }, key),
    (error) => error.code === "sogo_request_uncertain" && error.uncertain === true
  );
  assert.equal(requestCount, 1);
});

test("catalogue HTTP failures expose only safe, classified diagnostics", async (t) => {
  const secretKey = configuredEnv().SOGO_SECRET_KEY;
  const responseBody = `provider response with ${secretKey}`;
  for (const [status, code, category, configurationHint] of [
    [401, "invalid_credentials", "authentication", "Verify SOGO_SECRET_KEY is a valid, active sandbox key."],
    [403, "missing_scope", "authorization", "Verify sandbox API access is enabled and the key has bills:read permission."],
    [404, "route_unavailable", "not_found"],
    [429, "rate_limited", "rate_limit"],
    [503, "provider_unavailable", "upstream_unavailable"]
  ]) {
    await t.test(`HTTP ${status}`, async () => {
      const adapter = createSogoAdapter({
        readEnv: (name) => configuredEnv()[name] || "",
        fetchImpl: async () => createResponse(status, {
          error: {
            code,
            message: responseBody
          }
        })
      });

      await assert.rejects(adapter.getCatalogue(), (error) => {
        assert.equal(error.statusCode, status);
        assert.equal(error.providerErrorCode, code);
        const diagnostics = getSogoFailureDiagnostics(error);
        assert.deepEqual(diagnostics, {
          operation: "sogo_catalogue",
          upstreamStatus: status,
          providerErrorCode: code,
          ...(configurationHint ? { configurationHint } : {}),
          failureCategory: category,
          upstreamResponseReceived: true
        });
        assert.equal(JSON.stringify(diagnostics).includes(secretKey), false);
        assert.equal(JSON.stringify(diagnostics).includes(responseBody), false);
        return true;
      });
    });
  }
});

test("catalogue accepts root and data-wrapped object payloads", async (t) => {
  for (const [name, payload] of [
    ["root object", { airtime: { providers: [] } }],
    ["data-wrapped object", { data: { airtime: { providers: [] } } }]
  ]) {
    await t.test(name, async () => {
      const adapter = createSogoAdapter({
        readEnv: (name) => configuredEnv()[name] || "",
        fetchImpl: async () => createResponse(200, payload)
      });

      const catalogue = await adapter.getCatalogue();
      assert.deepEqual(catalogue.airtime, { providers: [] });
    });
  }
});

test("catalogue network, DNS, and timeout failures are distinguishable without response details", async (t) => {
  for (const [name, requestError, category] of [
    ["network failure", new Error("network failure containing private data"), "network_failure"],
    ["DNS failure", Object.assign(new Error("DNS lookup failed"), { cause: { code: "ENOTFOUND" } }), "dns_failure"],
    ["timeout", Object.assign(new Error("timeout containing private data"), { name: "TimeoutError" }), "timeout"]
  ]) {
    await t.test(name, async () => {
      const adapter = createSogoAdapter({
        readEnv: (envName) => configuredEnv()[envName] || "",
        fetchImpl: async () => {
          throw requestError;
        }
      });

      await assert.rejects(adapter.getCatalogue(), (error) => {
        const diagnostics = getSogoFailureDiagnostics(error);
        assert.deepEqual(diagnostics, {
          operation: "sogo_catalogue",
          ...(category === "dns_failure" ? { networkCode: "ENOTFOUND" } : {}),
          failureCategory: category,
          upstreamResponseReceived: false
        });
        assert.equal(JSON.stringify(diagnostics).includes("private data"), false);
        return true;
      });
    });
  }
});

test("catalogue invalid JSON response is classified without logging its body", async () => {
  const responseBody = "not-json-with-private-response-content";
  const adapter = createSogoAdapter({
    readEnv: (name) => configuredEnv()[name] || "",
    fetchImpl: async () => createRawResponse(200, responseBody)
  });

  await assert.rejects(adapter.getCatalogue(), (error) => {
    assert.equal(error.statusCode, 200);
    const diagnostics = getSogoFailureDiagnostics(error);
    assert.deepEqual(diagnostics, {
      operation: "sogo_catalogue",
      upstreamStatus: 200,
      failureCategory: "invalid_response",
      upstreamResponseReceived: true,
      responseStructure: {
        validJson: false,
        topLevelType: "unavailable",
        topLevelKeys: [],
        topLevelKeysTruncated: false,
        dataExists: null,
        dataType: "unavailable",
        categoryFields: {
          airtime: { exists: null, type: "unavailable" },
          data: { exists: null, type: "unavailable" },
          electricity: { exists: null, type: "unavailable" },
          cable_tv: { exists: null, type: "unavailable" },
          education: { exists: null, type: "unavailable" }
        }
      }
    });
    assert.equal(JSON.stringify(diagnostics).includes(responseBody), false);
    return true;
  });
});

test("catalogue response read failures report JSON structure as unavailable", async () => {
  const adapter = createSogoAdapter({
    readEnv: (name) => configuredEnv()[name] || "",
    fetchImpl: async () => ({
      status: 200,
      ok: true,
      headers: new Headers(),
      async text() {
        throw new Error("private response detail");
      }
    })
  });

  await assert.rejects(adapter.getCatalogue(), (error) => {
    const diagnostics = getSogoFailureDiagnostics(error);
    assert.equal(diagnostics.responseStructure.validJson, null);
    assert.equal(diagnostics.responseStructure.topLevelType, "unavailable");
    assert.equal(JSON.stringify(diagnostics).includes("private response detail"), false);
    return true;
  });
});

test("structurally invalid catalogue JSON diagnostics contain types and keys only", async () => {
  const privateValue = "private-customer-value";
  const adapter = createSogoAdapter({
    readEnv: (name) => configuredEnv()[name] || "",
    fetchImpl: async () => createResponse(200, {
      data: [privateValue],
      privateCustomerField: privateValue
    })
  });

  await assert.rejects(adapter.getCatalogue(), (error) => {
    const diagnostics = getSogoFailureDiagnostics(error);
    assert.deepEqual(diagnostics.responseStructure, {
      validJson: true,
      topLevelType: "object",
      topLevelKeys: ["data", "privateCustomerField"],
      topLevelKeysTruncated: false,
      dataExists: true,
      dataType: "array",
      categoryFields: {
        airtime: { exists: false, type: "missing" },
        data: { exists: false, type: "missing" },
        electricity: { exists: false, type: "missing" },
        cable_tv: { exists: false, type: "missing" },
        education: { exists: false, type: "missing" }
      }
    });
    assert.equal(JSON.stringify(diagnostics).includes(privateValue), false);
    return true;
  });
});

test("catalogue diagnostics omit credential-shaped provider error codes", async () => {
  const secretKey = configuredEnv().SOGO_SECRET_KEY;
  const adapter = createSogoAdapter({
    readEnv: (name) => configuredEnv()[name] || "",
    fetchImpl: async () => createResponse(503, {
      error: {
        code: secretKey,
        message: "provider response body"
      }
    })
  });

  await assert.rejects(adapter.getCatalogue(), (error) => {
    const diagnostics = getSogoFailureDiagnostics(error);
    assert.deepEqual(diagnostics, {
      operation: "sogo_catalogue",
      upstreamStatus: 503,
      failureCategory: "upstream_unavailable",
      upstreamResponseReceived: true
    });
    assert.equal(JSON.stringify(diagnostics).includes(secretKey), false);
    assert.equal(JSON.stringify(diagnostics).includes("provider response body"), false);
    return true;
  });
});

test("webhook signature verifies raw bytes with constant-time-safe format validation", () => {
  const rawBody = Buffer.from('{"event":"transaction.completed"}');
  const secret = configuredEnv().SOGO_WEBHOOK_SECRET;
  const signature = `sha256=${crypto.createHmac("sha256", secret).update(rawBody).digest("hex")}`;
  const adapter = createSogoAdapter({ readEnv: (name) => configuredEnv()[name] || "" });

  assert.equal(adapter.verifyWebhookSignature(rawBody, signature), true);
  assert.equal(adapter.verifyWebhookSignature(rawBody, `sha256=${"0".repeat(64)}`), false);
  assert.equal(adapter.verifyWebhookSignature(rawBody, signature.slice(7)), false);
});
