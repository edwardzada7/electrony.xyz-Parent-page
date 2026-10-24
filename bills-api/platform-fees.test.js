const assert = require("node:assert/strict");
const test = require("node:test");
const { createPlatformFeeQuote, PLATFORM_FEE_RULES } = require("./platform-fees");

test("the four guest Bills services keep their existing NGN platform fees", () => {
  for (const service of ["electricity", "airtime", "data", "bills"]) {
    assert.equal(PLATFORM_FEE_RULES[service].currency, "NGN");
    assert.equal(PLATFORM_FEE_RULES[service].fixedFeeMinor, 10000);
  }
});

test("card services have no invented fee or currency quote", () => {
  for (const service of ["virtual-cards", "gift-cards"]) {
    assert.equal(Object.hasOwn(PLATFORM_FEE_RULES, service), false);
    assert.throws(() => createPlatformFeeQuote(service, 100), /Unsupported service type/);
  }
});
