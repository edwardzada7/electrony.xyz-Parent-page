const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const projectRoot = path.resolve(__dirname, "..");
const adjustmentId = "energy-price-adjustments-2026-11-phase-1";
const additionalAmounts = new Map([
  ...[
    "525M-72HL4-TV",
    "595N-72HL4-BD",
    "620N-66HL4-BD",
    "625N-66HL4-BD",
    "630N-66HL4-BD",
    "640N-66HL4-BD",
    "650N-66QL6-BD",
    "725N-66HL5-BD"
  ].map((model) => [`JINKO|${model}`, 19000]),
  ["HISENSE|INV6KS-AA1", 45000],
  ["HISENSE|BATHEL5-E-BB1", 95500],
  ...[
    ["6/6KOG03LP1", 50000],
    ["8K-SG06LP1-EU", 135000],
    ["12K-SG05LP3-E", 140000],
    ["16K-SG01LP1-E", 225000],
    ["20K-SG05LP3-E", 304000],
    ["12K-SG06LP1-E", 179000],
    ["50K-SG01HP3-E", 1000000],
    ["80K-SG02HP3-E", 650000],
    ["125K-SG02HP3", 875000],
    ["100K-G", 300000],
    ["136K-G", 450000]
  ].map(([model, amount]) => [`DEYE|${model}`, amount]),
  ...[
    ["BATSE-F16-C", 250000],
    ["SE-F5-L", 100000],
    ["BOS-GM-5.1 HV", 150000],
    ["BOS-G-PRO51", 150000],
    ["GB-W-12", 200000],
    ["PDU-GB-W-2", 150000],
    ["ACC-GB-W-PARTS", 100000],
    ["BOS-B-PACK16", 220000],
    ["PCS 125K-L01HP3", 500000],
    ["MPPT 200KW", 250000],
    ["CONTROL BOX HV BOS-B-PDU-2-A", 250000],
    ["STS 500L", 750000],
    ["CONTROL BOX HV BOS-G-PDU-PRO", 100000],
    ["DEYERACK-3U-H", 100000]
  ].map(([model, amount]) => [`DEYE|${model}`, amount]),
  ["PYLON-TECH|PYLONBATFB-L-16 ( 16 Kwh )", 200000],
  ["PYLON-TECH|UF5000 (5.12 Kwh)", 100000],
  ...[
    ["POWER CABINET", 1500000],
    ["BATTERY CABINET", 950000],
    ["ESM-48200A1", 500000],
    ["ESM-48100A7", 500000],
    ["I23003", 70000],
    ["PVDU-8kW", 90000],
    ["HUWINV100KTL-M2", 500000],
    ["HUWINV150K-MG0", 1000000],
    ["LUNA 2000-97KWH", 19000000],
    ["LUNA 2000-129KWH", 19000000],
    ["LUNA 2000-215KWH", 19000000]
  ].map(([model, amount]) => [`HUAWEI|${model}`, amount])
]);

function loadCatalogue() {
  const window = {};
  const source = fs.readFileSync(path.join(projectRoot, "src/energy-catalogue.js"), "utf8");
  vm.runInNewContext(source, { window }, { filename: "energy-catalogue.js" });
  return window.ElectronyEnergyProducts;
}

function productMap(products) {
  return new Map(products.map((product) => [`${product.brand}|${product.model}`, product]));
}

function assertImage(product, filename) {
  assert.equal(product.image.url, `/energy/${encodeURIComponent(filename).replaceAll("%2F", "/")}`);
  assert.ok(product.image.alt);
  const assetUrl = new URL(product.image.url, "https://energy.example/");
  const assetPath = path.join(projectRoot, decodeURIComponent(assetUrl.pathname.slice(1)));
  assert.ok(fs.statSync(assetPath).isFile());
  assert.ok(fs.statSync(assetPath).size > 0);
}

test("Energy price adjustments are computed once from confirmed base prices", () => {
  const products = loadCatalogue();
  const byModel = productMap(products);
  const adjustedProducts = products.filter((product) => product.priceAdjustment);

  assert.equal(products.length, 130);
  assert.equal(new Set(products.map((product) => product.id)).size, products.length);
  assert.equal(new Set(products.map((product) => `${product.brand}|${product.model}`)).size, products.length);
  assert.equal(additionalAmounts.size, 48);
  assert.equal(adjustedProducts.length, additionalAmounts.size);

  for (const [key, amountNgn] of additionalAmounts) {
    const product = byModel.get(key);
    assert.ok(product, `Missing catalogue product ${key}`);
    assert.ok(Number.isSafeInteger(product.priceAdjustment.previousPriceNgn));
    assert.equal(product.priceAdjustment.id, `${adjustmentId}:${product.id}`);
    assert.equal(product.priceAdjustment.batchId, adjustmentId);
    assert.equal(product.priceAdjustment.amountNgn, amountNgn);
    assert.equal(product.priceNgn, product.priceAdjustment.previousPriceNgn + amountNgn);
    assert.match(product.priceDisplay, /^\d{1,3}(?:,\d{3})*(?:\.00)?$/);
    assert.equal(Number(product.priceDisplay.replaceAll(",", "").replace(/\.00$/, "")), product.priceNgn);
    assert.ok(Object.isFrozen(product.priceAdjustment));
  }

  assert.equal(byModel.get("JINKO|525M-72HL4-TV").priceDisplay.endsWith(".00"), false);
  assert.equal(byModel.get("DEYE|8K-SG06LP1-EU").priceDisplay.endsWith(".00"), true);
  assert.ok(products.filter((product) => product.category === "solar-panels")
    .every((product) => product.priceAdjustment?.amountNgn === 19000));
  assert.equal(products.filter((product) => product.brand === "HISENSE" && product.category === "transformers").length, 0);

  const repeatedLoad = productMap(loadCatalogue());
  for (const [key, product] of byModel) {
    const repeatedProduct = repeatedLoad.get(key);
    assert.equal(repeatedProduct.priceNgn, product.priceNgn, key);
    assert.equal(Boolean(repeatedProduct.priceAdjustment), Boolean(product.priceAdjustment), key);
    if (product.priceAdjustment) {
      assert.deepEqual(
        JSON.parse(JSON.stringify(repeatedProduct.priceAdjustment)),
        JSON.parse(JSON.stringify(product.priceAdjustment)),
        key
      );
    }
  }
});

test("Phase 1 image assignments use the requested local assets only", () => {
  const products = loadCatalogue();
  const byModel = productMap(products);
  const deyeInverterModels = [
    "6/6KOG03LP1",
    "8K-SG06LP1-EU",
    "12K-SG05LP3-E",
    "16K-SG01LP1-E",
    "20K-SG05LP3-E",
    "12K-SG06LP1-E",
    "50K-SG01HP3-E",
    "80K-SG02HP3-E",
    "125K-SG02HP3",
    "100K-G",
    "136K-G"
  ];
  const deyeBatteryModels = [
    "BATSE-F16-C",
    "SE-F5-L",
    "BOS-GM-5.1 HV",
    "BOS-G-PRO51",
    "GB-W-12",
    "BOS-B-PACK16"
  ];
  const deyeOtherModels = [
    "PDU-GB-W-2",
    "ACC-GB-W-PARTS",
    "PCS 125K-L01HP3",
    "MPPT 200KW",
    "CONTROL BOX HV BOS-B-PDU-2-A",
    "STS 500L",
    "CONTROL BOX HV BOS-G-PDU-PRO",
    "DEYERACK-3U-H"
  ];

  deyeInverterModels.forEach((model) => assertImage(byModel.get(`DEYE|${model}`), "deye inverter.webp"));
  deyeBatteryModels.forEach((model) => assertImage(byModel.get(`DEYE|${model}`), "deye battery.webp"));
  deyeOtherModels.forEach((model) => {
    assert.notEqual(byModel.get(`DEYE|${model}`).image.url, "/energy/deye%20battery.webp");
  });

  assertImage(byModel.get("PYLON-TECH|PYLONBATFB-L-16 ( 16 Kwh )"), "Polytech battery.webp");
  assertImage(byModel.get("PYLON-TECH|UF5000 (5.12 Kwh)"), "Polytech 5.1kwh battery.webp");
  assertImage(byModel.get("HUAWEI|POWER CABINET"), "power cabinet and battery cabinet huawei.jpeg");
  assertImage(byModel.get("HUAWEI|BATTERY CABINET"), "power cabinet and battery cabinet huawei.jpeg");
  assertImage(byModel.get("HUAWEI|ESM-48200A1"), "Huawei battery.webp");
  assertImage(byModel.get("HUAWEI|ESM-48100A7"), "Huawei battery.webp");
  assertImage(byModel.get("HUAWEI|I23003"), "HIGH EFFICIENCY INVERTER MODULE.jpeg");
  assertImage(byModel.get("HUAWEI|HUWINV100KTL-M2"), "HUWINV100KTL-M2.jpg");
  assertImage(byModel.get("HUAWEI|HUWINV150K-MG0"), "HUWINV100KTL-M2.jpg");
  [
    "LUNA 2000-97KWH",
    "LUNA 2000-129KWH",
    "LUNA 2000-215KWH"
  ].forEach((model) => assertImage(byModel.get(`HUAWEI|${model}`), "LUNA 2000-97KWH.png"));

  assert.equal(byModel.get("HUAWEI|PVDU-8kW").image.url, "../assets/catalogue/energy/products/huawei/PVDU-8kW.jpg");
  assert.equal(byModel.get("HISENSE|INV6KS-AA1").image.url, "../assets/catalogue/energy-inverter.svg");
});
