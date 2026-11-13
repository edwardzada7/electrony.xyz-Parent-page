"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { buildProviderAdapter } = require("./provider-adapter");

const configuredEnvironment = {
  MONNIFY_API_KEY: "sandbox-api-key",
  MONNIFY_SECRET_KEY: "sandbox-secret-key",
  MONNIFY_CONTRACT_CODE: "sandbox-contract-code",
  MONNIFY_ENVIRONMENT: "sandbox",
  MONNIFY_BASE_URL: "https://sandbox.monnify.com"
};

function jsonResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return payload;
    }
  };
}

function successful(responseBody) {
  return jsonResponse({
    requestSuccessful: true,
    responseCode: "0",
    responseBody
  });
}

function createFetch(respond) {
  const requests = [];
  const fetch = async (url, options = {}) => {
    const request = { url: new URL(url), options };
    requests.push(request);
    return respond(request, requests.length);
  };
  return { fetch, requests };
}

test("Monnify adapter requires explicit, environment-matched sandbox configuration", async () => {
  const configuredAdapter = buildProviderAdapter(configuredEnvironment);
  assert.equal(configuredAdapter.getEnvironment(), "sandbox");

  const adapter = buildProviderAdapter({
    ...configuredEnvironment,
    MONNIFY_BASE_URL: "https://api.monnify.com"
  }, { fetch: async () => assert.fail("Unconfigured adapter must not call Monnify.") });

  assert.equal(adapter.isConfigured(), false);
  assert.equal(adapter.getEnvironment(), null);
  assert.deepEqual(adapter.getMissingConfiguration(), ["MONNIFY_BASE_URL"]);
  await assert.rejects(adapter.getCatalogue(), {
    code: "provider_unconfigured",
    statusCode: 503
  });
});

test("Monnify configuration accepts only documented environment names and base URLs", () => {
  const adapter = buildProviderAdapter({
    ...configuredEnvironment,
    MONNIFY_ENVIRONMENT: "test",
    MONNIFY_BASE_URL: "https://sandbox.monnify.com/v1"
  });

  assert.equal(adapter.isConfigured(), false);
  assert.equal(adapter.getEnvironment(), null);
  assert.deepEqual(adapter.getMissingConfiguration(), [
    "MONNIFY_ENVIRONMENT",
    "MONNIFY_BASE_URL"
  ]);
});

test("Monnify mode follows the selected API environment, not NODE_ENV", () => {
  const productionAdapter = buildProviderAdapter({
    ...configuredEnvironment,
    NODE_ENV: "development",
    MONNIFY_ENVIRONMENT: "production",
    MONNIFY_BASE_URL: "https://api.monnify.com"
  });
  const sandboxAdapter = buildProviderAdapter({
    ...configuredEnvironment,
    NODE_ENV: "production"
  });

  assert.equal(productionAdapter.getEnvironment(), "production");
  assert.equal(sandboxAdapter.getEnvironment(), "sandbox");
});

test("catalogue reads authenticated Monnify categories and billers and caches the result", async () => {
  const { fetch, requests } = createFetch(({ url, options }) => {
    if (url.pathname === "/api/v1/auth/login") {
      assert.equal(options.method, "POST");
      assert.equal(
        options.headers.Authorization,
        `Basic ${Buffer.from("sandbox-api-key:sandbox-secret-key").toString("base64")}`
      );
      return successful({ accessToken: "sandbox-access-token", expiresIn: 3600 });
    }
    assert.equal(options.headers.Authorization, "Bearer sandbox-access-token");
    if (url.pathname.endsWith("/biller-categories")) {
      return successful({
        content: [
          { code: "ELECTRICITY", name: "Electricity" },
          { code: "CABLE_TV", name: "Cable TV" },
          { code: "UNSUPPORTED", name: "Unsupported category" }
        ],
        nextPage: null
      });
    }
    if (url.pathname.endsWith("/billers")) {
      if (url.searchParams.get("categoryCode") !== "ELECTRICITY") {
        return successful({ content: [], nextPage: null });
      }
      return successful({
        content: [{ code: "LIVE-DISCO", name: "Catalogue Disco", categories: [{ code: "ELECTRICITY" }] }],
        nextPage: null
      });
    }
    assert.fail(`Unexpected Monnify request: ${url.pathname}`);
  });
  const adapter = buildProviderAdapter(configuredEnvironment, { fetch });

  const [first, second] = await Promise.all([
    adapter.getCatalogue(),
    adapter.getCatalogue()
  ]);

  assert.equal(first, second);
  assert.equal(first.available, true);
  assert.equal(first.status, "available");
  assert.deepEqual(first.categories.electricity.billers, [
    { code: "LIVE-DISCO", name: "Catalogue Disco" }
  ]);
  assert.equal(first.categories.bills.available, true);
  assert.deepEqual(first.categories.bills.billers, []);
  assert.deepEqual(first.diagnostics, {
    stage: "catalogue",
    providerCategoryCount: 3,
    providerCategories: [
      { code: "ELECTRICITY", name: "Electricity" },
      { code: "CABLE_TV", name: "Cable TV" },
      { code: "UNSUPPORTED", name: "Unsupported category" }
    ],
    supportedCategoryCount: 2
  });
  assert.equal(requests.filter(({ url }) => url.pathname === "/api/v1/auth/login").length, 1);
  assert.equal(requests.filter(({ url }) => url.pathname.endsWith("/biller-categories")).length, 1);
});

test("catalogue diagnostics distinguish empty categories from unmapped provider categories", async () => {
  for (const [responseBody, expectedStatus, expectedCount] of [
    [{ content: [], nextPage: null }, "empty_categories", 0],
    [{
      content: [{ code: "MISC", name: "A provider category" }],
      nextPage: null
    }, "no_supported_categories", 1]
  ]) {
    const { fetch } = createFetch(({ url }) => {
      if (url.pathname === "/api/v1/auth/login") return successful({ accessToken: "token", expiresIn: 3600 });
      if (url.pathname.endsWith("/biller-categories")) return successful(responseBody);
      assert.fail(`Unexpected Monnify request: ${url.pathname}`);
    });
    const result = await buildProviderAdapter(configuredEnvironment, { fetch }).getCatalogue();

    assert.equal(result.ok, true);
    assert.equal(result.available, false);
    assert.equal(result.status, expectedStatus);
    assert.equal(result.diagnostics.providerCategoryCount, expectedCount);
  }
});

test("catalogue pagination follows the returned next-page code", async () => {
  const { fetch, requests } = createFetch(({ url }) => {
    if (url.pathname === "/api/v1/auth/login") return successful({ accessToken: "token", expiresIn: 3600 });
    if (url.pathname.endsWith("/biller-categories")) {
      return url.searchParams.get("page") === "1"
        ? successful({
          content: [{ code: "ELECTRICITY", name: "Electricity" }],
          nextPage: 2
        })
        : successful({
          content: [{ code: "AIRTIME", name: "Airtime" }],
          nextPage: null
        });
    }
    if (url.pathname.endsWith("/billers")) {
      return successful({ content: [], nextPage: null });
    }
    assert.fail(`Unexpected Monnify request: ${url.pathname}`);
  });
  const result = await buildProviderAdapter(configuredEnvironment, { fetch }).getCatalogue();

  assert.deepEqual(result.diagnostics.providerCategories.map(({ code }) => code), [
    "ELECTRICITY",
    "AIRTIME"
  ]);
  assert.deepEqual(
    requests
      .filter(({ url }) => url.pathname.endsWith("/biller-categories"))
      .map(({ url }) => url.searchParams.get("page")),
    ["1", "2"]
  );
});

test("catalogue failures identify authentication, activation, access, and endpoint errors without provider bodies", async () => {
  const cases = [
    {
      url: "/api/v1/auth/login",
      status: 401,
      responseMessage: "Invalid credentials",
      expected: "authentication_failed",
      stage: "authentication"
    },
    {
      url: "/api/v1/vas/bills-payment/biller-categories",
      status: 403,
      responseMessage: "Bills Payment feature is not enabled for this merchant",
      expected: "feature_not_activated",
      stage: "catalogue"
    },
    {
      url: "/api/v1/vas/bills-payment/biller-categories",
      status: 403,
      responseMessage: "Access denied",
      expected: "access_denied",
      stage: "catalogue"
    },
    {
      url: "/api/v1/vas/bills-payment/biller-categories",
      status: 404,
      responseMessage: "Not found",
      expected: "endpoint_or_request_error",
      stage: "catalogue"
    }
  ];

  for (const item of cases) {
    const { fetch } = createFetch(({ url }) => {
      if (url.pathname === "/api/v1/auth/login" && item.url !== url.pathname) {
        return successful({ accessToken: "token", expiresIn: 3600 });
      }
      if (url.pathname === item.url) {
        return jsonResponse({
          requestSuccessful: false,
          responseCode: "ERROR",
          responseMessage: item.responseMessage
        }, item.status);
      }
      assert.fail(`Unexpected Monnify request: ${url.pathname}`);
    });
    const adapter = buildProviderAdapter(configuredEnvironment, { fetch });

    await assert.rejects(adapter.getCatalogue(), (error) => {
      assert.equal(error.diagnosticStatus, item.expected);
      assert.equal(error.stage, item.stage);
      assert.equal(error.message.includes(item.responseMessage), false);
      return true;
    });
  }
});

test("catalogue diagnostics distinguish biller and product retrieval failures", async () => {
  for (const [failedPath, expectedStage, expectedStatus] of [
    ["/api/v1/vas/bills-payment/billers", "biller", "biller_retrieval_failed"],
    ["/api/v1/vas/bills-payment/biller-products", "product", "product_retrieval_failed"]
  ]) {
    const { fetch } = createFetch(({ url }) => {
      if (url.pathname === "/api/v1/auth/login") return successful({ accessToken: "token", expiresIn: 3600 });
      if (url.pathname.endsWith("/biller-categories")) {
        return successful({ content: [{ code: "ELECTRICITY", name: "Electricity" }], nextPage: null });
      }
      if (url.pathname === failedPath) {
        return jsonResponse({
          requestSuccessful: false,
          responseCode: "TEMPORARY_FAILURE"
        }, 503);
      }
      if (url.pathname.endsWith("/billers")) {
        return successful({ content: [{ code: "LIVE-DISCO", name: "Catalogue Disco" }], nextPage: null });
      }
      assert.fail(`Unexpected Monnify request: ${url.pathname}`);
    });
    const adapter = buildProviderAdapter(configuredEnvironment, { fetch });

    await assert.rejects(
      expectedStage === "biller" ? adapter.getCatalogue() : adapter.getProducts("LIVE-DISCO"),
      (error) => {
        assert.equal(error.diagnosticStatus, expectedStatus);
        assert.equal(error.stage, expectedStage);
        return true;
      }
    );
  }
});

test("products and customer validation use catalogue codes and preserve requireValidationRef", async () => {
  const { fetch, requests } = createFetch(({ url, options }) => {
    if (url.pathname === "/api/v1/auth/login") {
      return successful({ accessToken: "token", expiresIn: 3600 });
    }
    if (url.pathname.endsWith("/biller-categories")) {
      return successful({ content: [{ code: "ELECTRICITY", name: "Electricity" }], nextPage: null });
    }
    if (url.pathname.endsWith("/billers")) {
      return successful({ content: [{ code: "LIVE-DISCO", name: "Catalogue Disco" }], nextPage: null });
    }
    if (url.pathname.endsWith("/biller-products")) {
      assert.equal(url.searchParams.get("billerCode"), "LIVE-DISCO");
      return successful({
        content: [{
          code: "LIVE-PREPAID",
          name: "Prepaid product returned by Monnify",
          price: null,
          priceType: "OPEN",
          minAmount: 100,
          maxAmount: 200000
        }],
        nextPage: null
      });
    }
    if (url.pathname.endsWith("/validate-customer")) {
      assert.equal(options.method, "POST");
      assert.deepEqual(JSON.parse(options.body), {
        productCode: "LIVE-PREPAID",
        customerId: "1234567890"
      });
      return successful({
        customerName: "Provider-confirmed customer",
        vendInstruction: {
          requireValidationRef: true,
          validationReference: "validated-reference"
        }
      });
    }
    assert.fail(`Unexpected Monnify request: ${url.pathname}`);
  });
  const adapter = buildProviderAdapter(configuredEnvironment, { fetch });

  const [products, duplicateProducts] = await Promise.all([
    adapter.getProducts("LIVE-DISCO"),
    adapter.getProducts("LIVE-DISCO")
  ]);
  assert.deepEqual(duplicateProducts, products);
  const validation = await adapter.validateCustomer({
    productCode: products[0].code,
    customerId: "1234567890"
  });

  assert.equal(products[0].price, null);
  assert.equal(products[0].minAmount, 100);
  assert.equal(validation.customerName, "Provider-confirmed customer");
  assert.equal(validation.requireValidationRef, true);
  assert.equal(validation.validationReference, "validated-reference");
  assert.equal(requests.filter(({ url }) => url.pathname === "/api/v1/auth/login").length, 1);
});

test("vending uses the documented request fields and only includes required validation references", async () => {
  const sentBodies = [];
  const { fetch } = createFetch(({ url, options }) => {
    if (url.pathname === "/api/v1/auth/login") return successful({ accessToken: "token", expiresIn: 3600 });
    if (url.pathname.endsWith("/vend")) {
      sentBodies.push(JSON.parse(options.body));
      return successful({
        vendReference: sentBodies.at(-1).vendReference,
        transactionReference: "provider-transaction",
        vendStatus: "IN_PROGRESS",
        description: "Pending"
      });
    }
    assert.fail(`Unexpected Monnify request: ${url.pathname}`);
  });
  const adapter = buildProviderAdapter(configuredEnvironment, { fetch });

  const withReference = await adapter.vend({
    productCode: "LIVE-PREPAID",
    customerId: "1234567890",
    amount: 1500,
    reference: "ELECBILLS-20261105-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    validation: {
      productCode: "LIVE-PREPAID",
      customerId: "1234567890",
      requireValidationRef: true,
      validationReference: "validated-reference"
    }
  });
  await adapter.vend({
    productCode: "OPEN-AIRTIME",
    customerId: "08012345678",
    amount: 500,
    reference: "ELECBILLS-20261105-BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
    validation: {
      productCode: "OPEN-AIRTIME",
      customerId: "08012345678",
      requireValidationRef: false
    }
  });

  assert.equal(withReference.vendStatus, "IN_PROGRESS");
  assert.equal(sentBodies[0].vendAmount, 1500);
  assert.equal(sentBodies[0].validationReference, "validated-reference");
  assert.equal(sentBodies[0].vendReference, "ELECBILLS-20261105-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  assert.equal(Object.hasOwn(sentBodies[0], "amount"), false);
  assert.equal(Object.hasOwn(sentBodies[0], "reference"), false);
  assert.equal(Object.hasOwn(sentBodies[1], "validationReference"), false);
  await assert.rejects(adapter.vend({
    productCode: "LIVE-PREPAID",
    customerId: "1234567890",
    amount: 1500,
    reference: "another-reference"
  }), { code: "validation_required" });
});

test("malformed successful vending responses are uncertain and are never retried", async () => {
  let vendCalls = 0;
  const { fetch } = createFetch(({ url }) => {
    if (url.pathname === "/api/v1/auth/login") return successful({ accessToken: "token", expiresIn: 3600 });
    if (url.pathname.endsWith("/vend")) {
      vendCalls += 1;
      return {
        ok: true,
        status: 200,
        async json() {
          throw new Error("invalid JSON");
        }
      };
    }
    assert.fail(`Unexpected Monnify request: ${url.pathname}`);
  });
  const adapter = buildProviderAdapter(configuredEnvironment, { fetch });

  await assert.rejects(adapter.vend({
    productCode: "OPEN-AIRTIME",
    customerId: "08012345678",
    amount: 500,
    reference: "merchant-reference",
    validation: {
      productCode: "OPEN-AIRTIME",
      customerId: "08012345678",
      requireValidationRef: false
    }
  }), {
    code: "provider_invalid_response",
    outcomeUncertain: true
  });

  assert.equal(vendCalls, 1);
});

test("uncertain vending failures are not retried and are resolved only by GET requery", async () => {
  let vendCalls = 0;
  const { fetch, requests } = createFetch(({ url }) => {
    if (url.pathname === "/api/v1/auth/login") return successful({ accessToken: "token", expiresIn: 3600 });
    if (url.pathname.endsWith("/vend")) {
      vendCalls += 1;
      throw new Error("network timeout");
    }
    if (url.pathname.endsWith("/requery")) {
      return successful({ vendReference: "merchant-reference", vendStatus: "IN_PROGRESS" });
    }
    assert.fail(`Unexpected Monnify request: ${url.pathname}`);
  });
  const adapter = buildProviderAdapter(configuredEnvironment, { fetch });
  const transaction = {
    productCode: "OPEN-AIRTIME",
    customerId: "08012345678",
    amount: 500,
    reference: "merchant-reference",
    validation: {
      productCode: "OPEN-AIRTIME",
      customerId: "08012345678",
      requireValidationRef: false
    }
  };

  await assert.rejects(adapter.vend(transaction), {
    code: "provider_unavailable",
    outcomeUncertain: true
  });
  const result = await adapter.requery("merchant-reference");

  assert.equal(vendCalls, 1);
  assert.equal(result.vendStatus, "IN_PROGRESS");
  const requery = requests.find(({ url }) => url.pathname.endsWith("/requery"));
  assert.equal(requery.options.method || "GET", "GET");
  assert.equal(requery.url.searchParams.get("reference"), "merchant-reference");
});
