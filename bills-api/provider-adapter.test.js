"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { buildProviderAdapter, isValidCustomerIdentifier } = require("./provider-adapter");

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
    environment: "sandbox",
    upstreamStatus: 200,
    upstreamSuccess: true,
    responseShape: "object; responseBody=object; content=array<category>",
    providerCategoryCount: 3,
    providerCategories: [
      { code: "ELECTRICITY", name: "Electricity" },
      { code: "CABLE_TV", name: "Cable TV" },
      { code: "UNSUPPORTED", name: "Unsupported category" }
    ],
    providerErrorCode: null,
    providerErrorMessage: null,
    catalogueFetchedAt: first.diagnostics.catalogueFetchedAt,
    catalogueCacheHit: false,
    supportedCategoryCount: 2
  });
  assert.equal(Number.isNaN(Date.parse(first.diagnostics.catalogueFetchedAt)), false);
  assert.equal((await adapter.getCatalogue()).diagnostics.catalogueCacheHit, true);
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

test("catalogue diagnostics distinguish unexpected JSON shape from malformed JSON", async () => {
  const unexpectedFetch = createFetch(({ url }) => {
    if (url.pathname === "/api/v1/auth/login") return successful({ accessToken: "token", expiresIn: 3600 });
    if (url.pathname.endsWith("/biller-categories")) return successful({ categories: [] });
    assert.fail(`Unexpected Monnify request: ${url.pathname}`);
  });
  await assert.rejects(
    buildProviderAdapter(configuredEnvironment, { fetch: unexpectedFetch.fetch }).getCatalogue(),
    (error) => {
      assert.equal(error.diagnosticStatus, "unexpected_response_shape");
      assert.equal(error.failureClassification, "unexpected_response_shape");
      assert.equal(error.upstreamStatus, 200);
      assert.equal(error.upstreamSuccess, true);
      assert.equal(error.responseShape, "object; responseBody=object; content=missing");
      return true;
    }
  );

  const unexpectedEnvelopeFetch = createFetch(({ url }) => {
    if (url.pathname === "/api/v1/auth/login") return successful({ accessToken: "token", expiresIn: 3600 });
    if (url.pathname.endsWith("/biller-categories")) return jsonResponse({ content: [] }, 200);
    assert.fail(`Unexpected Monnify request: ${url.pathname}`);
  });
  await assert.rejects(
    buildProviderAdapter(configuredEnvironment, { fetch: unexpectedEnvelopeFetch.fetch }).getCatalogue(),
    (error) => {
      assert.equal(error.diagnosticStatus, "unexpected_response_shape");
      assert.equal(error.failureClassification, "unexpected_response_shape");
      assert.equal(error.upstreamStatus, 200);
      assert.equal(error.upstreamSuccess, false);
      assert.equal(error.responseShape, "object; responseBody=missing");
      return true;
    }
  );

  const malformedCategoryFetch = createFetch(({ url }) => {
    if (url.pathname === "/api/v1/auth/login") return successful({ accessToken: "token", expiresIn: 3600 });
    if (url.pathname.endsWith("/biller-categories")) {
      return successful({ content: [{ providerCategory: "MISC" }], nextPage: null });
    }
    assert.fail(`Unexpected Monnify request: ${url.pathname}`);
  });
  await assert.rejects(
    buildProviderAdapter(configuredEnvironment, { fetch: malformedCategoryFetch.fetch }).getCatalogue(),
    (error) => {
      assert.equal(error.diagnosticStatus, "unexpected_response_shape");
      assert.equal(error.responseShape, "object; responseBody=object; content=array<object>");
      assert.equal(error.providerCategoryCount, 1);
      assert.deepEqual(error.providerCategories, []);
      return true;
    }
  );

  const malformedFetch = createFetch(({ url }) => {
    if (url.pathname === "/api/v1/auth/login") return successful({ accessToken: "token", expiresIn: 3600 });
    if (url.pathname.endsWith("/biller-categories")) {
      return {
        ok: true,
        status: 200,
        async json() {
          throw new SyntaxError("invalid JSON");
        }
      };
    }
    assert.fail(`Unexpected Monnify request: ${url.pathname}`);
  });
  await assert.rejects(
    buildProviderAdapter(configuredEnvironment, { fetch: malformedFetch.fetch }).getCatalogue(),
    (error) => {
      assert.equal(error.diagnosticStatus, "application_parsing_failure");
      assert.equal(error.failureClassification, "application_parsing_failure");
      assert.equal(error.upstreamStatus, 200);
      assert.equal(error.upstreamSuccess, false);
      assert.equal(error.responseShape, "invalid_json");
      return true;
    }
  );
});

test("catalogue diagnostics classify network timeouts and connection failures", async () => {
  for (const [failure, expected] of [
    [Object.assign(new Error("timed out"), { name: "TimeoutError" }), "network_timeout"],
    [new Error("connection refused"), "network_connection_failure"]
  ]) {
    const adapter = buildProviderAdapter(configuredEnvironment, {
      fetch: async () => {
        throw failure;
      }
    });
    await assert.rejects(adapter.getCatalogue(), (error) => {
      assert.equal(error.diagnosticStatus, expected);
      assert.equal(error.failureClassification, expected);
      assert.equal(error.upstreamStatus, null);
      assert.equal(error.upstreamSuccess, false);
      return true;
    });
  }
});

test("catalogue cache hits are reported and an explicit adapter refresh fetches new categories", async () => {
  let categoryResponseCount = 0;
  const { fetch, requests } = createFetch(({ url }) => {
    if (url.pathname === "/api/v1/auth/login") return successful({ accessToken: "token", expiresIn: 3600 });
    if (url.pathname.endsWith("/biller-categories")) {
      categoryResponseCount += 1;
      return successful({
        content: [{ code: `CATEGORY_${categoryResponseCount}`, name: `Category ${categoryResponseCount}` }],
        nextPage: null
      });
    }
    assert.fail(`Unexpected Monnify request: ${url.pathname}`);
  });
  const adapter = buildProviderAdapter(configuredEnvironment, { fetch });

  const first = await adapter.getCatalogue();
  const cached = await adapter.getCatalogue();
  const refreshed = await adapter.getCatalogue({ refresh: true });

  assert.equal(first.diagnostics.catalogueCacheHit, false);
  assert.equal(cached.diagnostics.catalogueCacheHit, true);
  assert.equal(refreshed.diagnostics.catalogueCacheHit, false);
  assert.deepEqual(refreshed.diagnostics.providerCategories, [
    { code: "CATEGORY_2", name: "Category 2" }
  ]);
  assert.equal(requests.filter(({ url }) => url.pathname.endsWith("/biller-categories")).length, 2);
});

test("catalogue provider error diagnostics sanitize credentials and customer data", async () => {
  const { fetch } = createFetch(({ url }) => {
    if (url.pathname === "/api/v1/auth/login") return successful({ accessToken: "sensitive-access-token", expiresIn: 3600 });
    if (url.pathname.endsWith("/biller-categories")) {
      return jsonResponse({
        requestSuccessful: false,
        responseCode: "PROVIDER_ERROR",
        responseMessage: "API key=sandbox-api-key; Secret key=sandbox-secret-key; Authorization: Bearer sensitive-access-token; customer jane@example.com 1234567890"
      }, 503);
    }
    assert.fail(`Unexpected Monnify request: ${url.pathname}`);
  });
  const adapter = buildProviderAdapter(configuredEnvironment, { fetch });

  await assert.rejects(adapter.getCatalogue(), (error) => {
    assert.equal(error.providerErrorCode, "PROVIDER_ERROR");
    assert.equal(error.providerErrorMessage.includes("sandbox-api-key"), false);
    assert.equal(error.providerErrorMessage.includes("sandbox-secret-key"), false);
    assert.equal(error.providerErrorMessage.includes("sensitive-access-token"), false);
    assert.equal(error.providerErrorMessage.includes("jane@example.com"), false);
    assert.equal(error.providerErrorMessage.includes("1234567890"), false);
    return true;
  });
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
      status: 503,
      responseMessage: "Provider unavailable",
      expected: "catalogue_retrieval_failed",
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
      assert.equal(error.failureClassification, item.status === 401
        ? "authentication_failure"
        : item.status === 403
          ? "permission_or_activation_failure"
          : "provider_service_error");
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

test("customer identifiers are bounded strings and are not silently normalized", async () => {
  assert.equal(isValidCustomerIdentifier("080123456789"), true);
  assert.equal(isValidCustomerIdentifier("00000000100"), true);
  assert.equal(isValidCustomerIdentifier(" 080123456789"), false);
  assert.equal(isValidCustomerIdentifier("080123456789 "), false);
  assert.equal(isValidCustomerIdentifier("080123456789\n"), false);
  assert.equal(isValidCustomerIdentifier("x".repeat(129)), false);
  assert.equal(isValidCustomerIdentifier(80123456789), false);

  const { fetch, requests } = createFetch(({ url }) => {
    if (url.pathname === "/api/v1/auth/login") return successful({ accessToken: "token", expiresIn: 3600 });
    assert.fail(`Invalid customer identifiers must not call Monnify: ${url.pathname}`);
  });
  const adapter = buildProviderAdapter(configuredEnvironment, { fetch });

  for (const customerId of ["", " 080123456789", "080123456789\n", "x".repeat(129), 80123456789]) {
    await assert.rejects(adapter.validateCustomer({
      productCode: "11",
      customerId
    }), { code: "invalid_input", statusCode: 400 });
  }
  assert.equal(requests.length, 0);
});

test("adapter preserves supplied fixture identifiers and mocked provider vending statuses", async () => {
  const validations = [
    { productCode: "11", customerId: "080123456789" },
    { productCode: "product-ikedc-pre", customerId: "55555666666" },
    { productCode: "product-aedc-pre", customerId: "00000000100" },
    { productCode: "product-gotv-max", customerId: "8059999999" }
  ];
  const vending = [
    { productCode: "11", customerId: "080123456789", vendStatus: "SUCCESS" },
    { productCode: "13", customerId: "080123456789", vendStatus: "FAILED" },
    { productCode: "product-aedc-pre", customerId: "00000000100", vendStatus: "IN-PROGRESS" },
    { productCode: "product-ikedc-post", customerId: "00000000100", vendStatus: "SUCCESS" },
    { productCode: "product-gotv-max", customerId: "8059999999", vendStatus: "PROVIDER-RETURNED" }
  ];
  const vendingResponses = [...vending];
  const { fetch, requests } = createFetch(({ url, options }) => {
    if (url.pathname === "/api/v1/auth/login") {
      return successful({ accessToken: "sandbox-token", expiresIn: 3600 });
    }
    if (url.pathname.endsWith("/validate-customer")) {
      const request = JSON.parse(options.body);
      assert.deepEqual(request, validations.shift());
      return successful({
        vendInstruction: { requireValidationRef: false }
      });
    }
    if (url.pathname.endsWith("/vend")) {
      const request = JSON.parse(options.body);
      const fixture = vendingResponses.shift();
      assert.equal(request.productCode, fixture.productCode);
      assert.equal(request.customerId, fixture.customerId);
      return successful({
        vendReference: request.vendReference,
        transactionReference: `provider-${request.vendReference}`,
        vendStatus: fixture.vendStatus
      });
    }
    assert.fail(`Unexpected Monnify request: ${url.pathname}`);
  });
  const adapter = buildProviderAdapter(configuredEnvironment, { fetch });

  for (const fixture of [
    { productCode: "11", customerId: "080123456789" },
    { productCode: "product-ikedc-pre", customerId: "55555666666" },
    { productCode: "product-aedc-pre", customerId: "00000000100" },
    { productCode: "product-gotv-max", customerId: "8059999999" }
  ]) {
    const result = await adapter.validateCustomer(fixture);
    assert.equal(result.productCode, fixture.productCode);
    assert.equal(result.customerId, fixture.customerId);
    assert.equal(Object.hasOwn(result, "customerName"), false);
  }
  assert.equal(validations.length, 0);

  for (const fixture of vending) {
    const reference = `ELECBILLS-${fixture.productCode.replace(/[^A-Z0-9]/gi, "").toUpperCase()}`;
    const result = await adapter.vend({
      productCode: fixture.productCode,
      customerId: fixture.customerId,
      amount: 100,
      reference,
      validation: {
        productCode: fixture.productCode,
        customerId: fixture.customerId,
        requireValidationRef: false
      }
    });
    assert.equal(result.vendStatus, fixture.vendStatus);
    assert.equal(result.vendReference, reference);
    assert.equal(result.transactionReference, `provider-${reference}`);
  }
  assert.equal(vendingResponses.length, 0);
  assert.equal(requests.filter(({ url }) => url.pathname.endsWith("/vend")).length, 5);
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
