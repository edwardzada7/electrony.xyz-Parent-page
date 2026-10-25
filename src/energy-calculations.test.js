const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const calculatorSource = fs.readFileSync(path.join(__dirname, "energy-calculations.js"), "utf8");
const calculatorContext = { window: {} };
vm.runInNewContext(calculatorSource, calculatorContext);
const { calculateEnergyEstimate } = calculatorContext.window.ElectronyEnergyCalculations;
const catalogueContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, "energy-catalogue.js"), "utf8"), catalogueContext);
const catalogueProducts = catalogueContext.window.ElectronyEnergyProducts;
const { recommendEnergyProducts } = calculatorContext.window.ElectronyEnergyCalculations;

test("calculates multiple appliance loads and rounds system capacity upward", () => {
  const result = calculateEnergyEstimate({
    appliances: [
      { quantity: 2, watts: 60, hours: 8 },
      { quantity: 1, watts: 100, hours: 4 }
    ],
    assumptions: {
      days: 30,
      backupHours: 5,
      designMargin: 25,
      batteryUsable: 80,
      efficiency: 90,
      peakSunHours: 5,
      solarLosses: 20
    }
  });

  assert.equal(result.connectedLoadW, 220);
  assert.equal(result.dailyWh, 1360);
  assert.equal(result.monthlyWh, 40800);
  assert.equal(result.backupWh, 1100);
  assert.equal(result.inverterW, 500);
  assert.equal(result.batteryUsableWh, 1100 / 0.9);
  assert.equal(result.batteryNominalWh, 2000);
  assert.equal(result.solarW, 400);
});

test("skips battery sizing when backup duration is not supplied", () => {
  const result = calculateEnergyEstimate({
    appliances: [{ quantity: 1, watts: 100, hours: 2 }],
    assumptions: {
      days: 30,
      backupHours: null,
      designMargin: 25,
      batteryUsable: 80,
      efficiency: 90,
      peakSunHours: 5,
      solarLosses: 20
    }
  });

  assert.equal(result.backupWh, null);
  assert.equal(result.batteryUsableWh, null);
  assert.equal(result.batteryNominalWh, null);
  assert.equal(result.dailyWh, 200);
  assert.equal(result.monthlyWh, 6000);
});

test("recommendations reference rated catalogue products within explicit capacity limits", () => {
  const recommendations = recommendEnergyProducts(catalogueProducts, {
    inverterW: 5000,
    batteryNominalWh: 5000,
    solarW: 5000
  });
  const catalogueIds = new Set(catalogueProducts.map((product) => product.id));

  assert.ok(recommendations.inverters.length > 0);
  assert.ok(recommendations.batteries.length > 0);
  assert.ok(recommendations.panels.length > 0);
  recommendations.inverters.forEach(({ product, capacity }) => {
    assert.ok(catalogueIds.has(product.id));
    assert.equal(product.category, "solar-inverters");
    assert.match(`${product.name} ${product.description}`, /\binverter\b/i);
    assert.ok(capacity >= 5000 && capacity <= 10000);
  });
  recommendations.batteries.forEach(({ product, capacity }) => {
    assert.ok(catalogueIds.has(product.id));
    assert.equal(product.category, "batteries-storage");
    assert.ok(capacity >= 5000 && capacity <= 10000);
  });
  recommendations.panels.forEach(({ product, capacity, quantity, arrayCapacity }) => {
    assert.ok(catalogueIds.has(product.id));
    assert.equal(product.category, "solar-panels");
    assert.ok(arrayCapacity >= 5000 && arrayCapacity <= 6250);
    assert.equal(quantity * capacity, arrayCapacity);
  });
});

test("does not fabricate catalogue matches when no supported rating is available", () => {
  const recommendations = recommendEnergyProducts(catalogueProducts, {
    inverterW: 1000000,
    batteryNominalWh: null,
    solarW: 100
  });

  assert.equal(recommendations.inverters.length, 0);
  assert.equal(recommendations.batteries.length, 0);
  assert.equal(recommendations.panels.length, 0);
});
