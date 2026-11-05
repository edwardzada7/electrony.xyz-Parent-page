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
  const adapter = buildProviderAdapter({
    ...configuredEnvironment,
    MONNIFY_BASE_URL: "https://api.monnify.com"
  }, { fetch: async () => assert.fail("Unconfigured adapter must not call Monnify.") });

  assert.equal(adapter.isConfigured(), false);
  assert.deepEqual(adapter.getMissingConfiguration(), ["MONNIFY_BASE_URL"]);
  await assert.rejects(adapter.getCatalogue(), {
    code: "provider_unconfigured",
    statusCode: 503
  });
});

test("catalogue reads authenticated Monnify categories and billers and caches the result", async () => {
  const { fetch, requests } = createFetch(({ url, options }) => {
    if (url.pathname === "/api/v1/auth/login") {
      assert.equal(options.method, "POST");
      assert.match(options.headers.Authorization, /^Basic /);
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
      if (url.searchParams.get("category_code") !== "ELECTRICITY") {
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
  assert.deepEqual(first.categories.electricity.billers, [
    { code: "LIVE-DISCO", name: "Catalogue Disco" }
  ]);
  assert.equal(first.categories.bills.available, true);
  assert.deepEqual(first.categories.bills.billers, []);
  assert.equal(requests.filter(({ url }) => url.pathname === "/api/v1/auth/login").length, 1);
  assert.equal(requests.filter(({ url }) => url.pathname.endsWith("/biller-categories")).length, 1);
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
      assert.equal(url.searchParams.get("biller_code"), "LIVE-DISCO");
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
        vendReference: sentBodies.at(-1).reference,
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
  assert.equal(sentBodies[0].amount, 1500);
  assert.equal(sentBodies[0].validationReference, "validated-reference");
  assert.equal(sentBodies[0].reference, "ELECBILLS-20261105-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  assert.equal(Object.hasOwn(sentBodies[1], "validationReference"), false);
  await assert.rejects(adapter.vend({
    productCode: "LIVE-PREPAID",
    customerId: "1234567890",
    amount: 1500,
    reference: "another-reference"
  }), { code: "validation_required" });
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
