const assert = require("node:assert/strict");
const test = require("node:test");
const { createMonnifyBillsAdapter } = require("./monnify-bills-adapter");

test("Monnify Bills operations stay unavailable until activation and contracts are verified", async () => {
  const adapter = createMonnifyBillsAdapter();
  const results = await Promise.all([
    adapter.listCategories(),
    adapter.listBillersByCategory("category-code"),
    adapter.listProductsByBiller("biller-code"),
    adapter.validateCustomer("product-code", "customer-id"),
    adapter.vendBill({
      productCode: "product-code",
      customerId: "customer-id",
      vendAmount: 100,
      vendReference: "merchant-vend-reference",
      validationReference: "validation-reference"
    }),
    adapter.requeryVendReference({
      vendReference: "merchant-vend-reference",
      transactionReference: "monnify-transaction-reference"
    })
  ]);

  assert.deepEqual(results.map(({ operation, status, available }) => [
    operation,
    status,
    available
  ]), [
    ["listCategories", "contract_unverified", false],
    ["listBillersByCategory", "contract_unverified", false],
    ["listProductsByBiller", "contract_unverified", false],
    ["validateCustomer", "contract_unverified", false],
    ["vendBill", "contract_unverified", false],
    ["requeryVendReference", "contract_unverified", false]
  ]);
  assert.deepEqual(Object.values(adapter.getReadiness()).map(({ ready }) => ready), [false, false, false, false]);
});
