const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = (filename) => fs.readFileSync(path.join(__dirname, filename), "utf8");
const context = { window: {} };
for (const filename of ["energy-catalogue.js", "energy-packages.js", "energy-pricing.js"]) {
  vm.runInNewContext(source(filename), context, { filename });
}

const products = context.window.ElectronyEnergyProducts;
const packages = context.window.ElectronySolarPackages;
const { calculateSolarPackagePricing } = context.window.ElectronyEnergyPricing;
const packageById = (id) => packages.find((solarPackage) => solarPackage.id === id);
const pricingFor = (id, catalogue = products) => calculateSolarPackagePricing(packageById(id), catalogue);

test("reconciles all source catalogue products and preserves explicit price provenance", () => {
  assert.equal(products.length, 130);
  assert.equal(new Set(products.map((product) => product.id)).size, products.length);
  assert.equal(new Set(products.map((product) => `${product.brand}|${product.model}`)).size, products.length);
  assert.equal(products.filter((product) => product.priceNgn !== null).length, 128);

  products.forEach((product) => {
    assert.equal(product.source.document, "POWER-SOLAR PL-1.pdf", product.model);
    assert.ok(product.source.page >= 1 && product.source.page <= 5, product.model);
    assert.equal(product.priceSource.document, "POWER-SOLAR PL-1.pdf", product.model);
    assert.equal(product.priceSource.page, product.source.page, product.model);
    if (product.priceNgn === null) {
      assert.equal(product.priceDisplay, null, product.model);
    } else {
      assert.ok(Number.isSafeInteger(product.priceNgn) && product.priceNgn > 0, product.model);
      assert.equal(Number(product.priceDisplay.replaceAll(",", "")), product.priceNgn, product.model);
    }
  });

  const productByModel = new Map(products.map((product) => [`${product.brand}|${product.model}`, product]));
  assert.deepEqual(
    [...products].filter((product) => product.priceNgn === null).map((product) => `${product.brand}|${product.model}`).sort(),
    ["ANTAI|PV ROOF MOUNTING SET", "SUNTREE|SUNDB24WAY"]
  );
  assert.equal(productByModel.get("SUNTREE|SUNBRKAC32AMPS-2P").priceDisplay, "2,700.00");
  assert.equal(productByModel.get("HUAWEI|HUWSMARTMODUL1000A01").source.page, 3);
  assert.equal(productByModel.get("HUAWEI|SMART LOGGER 3000A01EU").source.page, 3);
  assert.equal(productByModel.get("GROWATT|ABM 5.5-A1-H").warranty, undefined);
  assert.equal(productByModel.get("GROWATT|ABM 5-LS-B1-H").warranty, undefined);
  assert.equal(
    productByModel.get("GROWATT|SIM 6000ES PLUS-H + BATTERY + BASE 6KW + 5.5 KWH").warranty,
    "INVERTER 2 YEARS & BATTEY 5 YEARS"
  );
});

test("calculates every confirmed line and package subtotal in exact naira", () => {
  const expected = [
    ["basic-small-home-office", 591200, null, 3],
    ["medium-home-office", 2389400, null, 3],
    ["premium-executive-corporate", 3290000, null, 5],
    ["heavy-commercial-industrial", 26352800, 26352800, 0]
  ];

  expected.forEach(([id, subtotalNgn, totalNgn, unpricedCount]) => {
    const result = pricingFor(id);
    assert.equal(result.subtotalNgn, subtotalNgn, id);
    assert.equal(result.totalNgn, totalNgn, id);
    assert.equal(result.unpricedLines.length, unpricedCount, id);
    assert.equal(result.complete, unpricedCount === 0, id);
  });
});

test("maps the listed models to the exact catalogue products and quantities", () => {
  const basic = packageById("basic-small-home-office");
  assert.equal(basic.capacity, "3.6 kW");
  const basicPanels = basic.components.find((component) => component.category === "Solar panels");
  assert.equal(basicPanels.productId, undefined);
  assert.equal(basicPanels.model, "585N-72HL4-BD");
  assert.equal(basicPanels.manufacturer, "JINKO");
  assert.equal(basic.components.find((component) => component.category === "Inverter").productId, "growatt-sph-3600tl-bl-up");

  const mediumPanels = pricingFor("medium-home-office").lines.find((line) => line.component.category === "Solar panels");
  assert.equal(mediumPanels.model, "620N-66HL4-BD");
  assert.equal(mediumPanels.component.quantity, 10);
  assert.equal(mediumPanels.unitPriceNgn, 122500);
  assert.equal(mediumPanels.lineTotalNgn, 1225000);

  const heavy = pricingFor("heavy-commercial-industrial");
  const heavyPanels = heavy.lines.find((line) => line.component.category === "Solar panels");
  const heavyRails = heavy.lines.find((line) => line.model === "ANTAIRAILCG010-01");
  const heavyBatteries = heavy.lines.find((line) => line.model === "BOS-B-PACK16");
  assert.equal(heavyPanels.component.quantity, 70);
  assert.equal(heavyPanels.lineTotalNgn, 10850000);
  assert.equal(heavyRails.component.quantity, 36);
  assert.equal(heavyRails.lineTotalNgn, 738000);
  assert.equal(heavyBatteries.component.quantity, 3);
  assert.equal(heavyBatteries.lineTotalNgn, 6975000);
});

test("recalculates package prices when a catalogue unit price changes", () => {
  const catalogueWithPriceChange = products.map((product) =>
    product.id === "jinko-725n-66hl5-bd"
      ? { ...product, priceNgn: product.priceNgn + 1000 }
      : product);
  const result = pricingFor("heavy-commercial-industrial", catalogueWithPriceChange);
  assert.equal(result.totalNgn, 26422800);
});

test("keeps missing prices unpriced and excludes them from partial subtotals", () => {
  const packageData = {
    id: "partial-test",
    components: [
      { category: "priced", productId: "priced", quantity: 2 },
      { category: "unpriced", productId: "unpriced", quantity: 4 }
    ]
  };
  const result = calculateSolarPackagePricing(packageData, [
    { id: "priced", brand: "Brand", model: "Known", priceNgn: 125 },
    { id: "unpriced", brand: "Brand", model: "Unknown" }
  ]);
  assert.equal(result.lines[1].unitPriceNgn, null);
  assert.equal(result.lines[1].lineTotalNgn, null);
  assert.equal(result.subtotalNgn, 250);
  assert.equal(result.totalNgn, null);
});

test("rejects invalid quantities, catalogue prices, and product references", () => {
  const validProduct = { id: "known", brand: "Brand", model: "Model", priceNgn: 100 };
  const invalidQuantityPackage = { id: "invalid-quantity", components: [{ productId: "known", quantity: 0 }] };
  assert.throws(() => calculateSolarPackagePricing(invalidQuantityPackage, [validProduct]), /Invalid quantity/);

  const invalidPricePackage = { id: "invalid-price", components: [{ productId: "known", quantity: 1 }] };
  assert.throws(() => calculateSolarPackagePricing(invalidPricePackage, [{ ...validProduct, priceNgn: 0 }]), /Invalid catalogue price/);

  const missingProductPackage = { id: "missing-product", components: [{ productId: "missing", quantity: 1 }] };
  assert.throws(() => calculateSolarPackagePricing(missingProductPackage, []), /Unknown catalogue product/);
});
