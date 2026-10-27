const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const projectRoot = path.resolve(__dirname, "..");
const calculatorSource = fs.readFileSync(path.join(__dirname, "energy-calculations.js"), "utf8");
const energySource = fs.readFileSync(path.join(__dirname, "energy.js"), "utf8");
const energyCalculatorSource = fs.readFileSync(path.join(__dirname, "energy-calculator.js"), "utf8");
const energyCalculationsSource = fs.readFileSync(path.join(__dirname, "energy-calculations.js"), "utf8");
const energyPackageSource = fs.readFileSync(path.join(__dirname, "energy-packages.js"), "utf8");
const energyCatalogueSource = fs.readFileSync(path.join(__dirname, "energy-catalogue.js"), "utf8");
const calculatorContext = { window: {} };
vm.runInNewContext(calculatorSource, calculatorContext);
const {
  calculateEnergyEstimate,
  recommendSolarPackages
} = calculatorContext.window.ElectronyEnergyCalculations;
const catalogueContext = { window: {} };
vm.runInNewContext(energyCatalogueSource, catalogueContext);
const catalogueProducts = catalogueContext.window.ElectronyEnergyProducts;
const { recommendEnergyProducts } = calculatorContext.window.ElectronyEnergyCalculations;
const solarPackageContext = { window: {} };
vm.runInNewContext(energyPackageSource, solarPackageContext);
const solarPackages = solarPackageContext.window.ElectronySolarPackages;
const { filterEnergyProducts, getEnergyProductPage } = catalogueContext.window.ElectronyEnergyCatalogue;

test("Energy page scripts do not redeclare page-level lexical bindings", () => {
  const declarations = (source) => [...source.matchAll(/^(const|let|class|function)\s+([A-Za-z_$][\w$]*)/gm)]
    .map((match) => ({ kind: match[1], name: match[2] }));
  const pageScripts = [
    energyCatalogueSource,
    energyPackageSource,
    energySource,
    energyCalculationsSource,
    energyCalculatorSource
  ];
  const allDeclarations = pageScripts.flatMap(declarations);
  const conflicts = allDeclarations.filter((declaration, index) => allDeclarations.some((prior, priorIndex) =>
    priorIndex < index && prior.name === declaration.name
      && (declaration.kind !== "function" || prior.kind !== "function")))
    .map(({ name }) => name);
  assert.deepEqual(conflicts, []);
});

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

test("calculates the requested two-appliance example", () => {
  const result = calculateEnergyEstimate({
    appliances: [
      { quantity: 2, watts: 100, hours: 5 },
      { quantity: 1, watts: 200, hours: 3 }
    ],
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

  assert.equal(result.connectedLoadW, 400);
  assert.equal(result.dailyWh, 1600);
  assert.equal(result.monthlyWh / 1000, 48);
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

test("package catalogue contains only the four source-backed packages and flags the ambiguous battery", () => {
  assert.equal(solarPackages.length, 4);
  assert.deepEqual(Array.from(solarPackages, (solarPackage) => solarPackage.name), [
    "Basic / Small Home & Office (3.6 kW System)",
    "Medium Home / Medium Office (6 kW System)",
    "Premium Executive Home / Corporate Office (8 kW – 10 kW System)",
    "Heavy Commercial / Industrial Setup (50 kW System)"
  ]);
  solarPackages.forEach((solarPackage) => {
    assert.ok(solarPackage.components.length > 0);
    assert.equal(solarPackage.source.document, "Solar_Power_Solution_Packages.pdf");
    assert.equal("price" in solarPackage, false);
  });
  assert.match(solarPackages[0].reviewNote, /5\.12kWh\/5\.5kWh/);
  assert.equal(solarPackages[0].batteryNominalWh, null);
});

test("package comparisons use only corresponding inverter, array and battery ratings", () => {
  const withBackup = recommendSolarPackages(solarPackages, {
    inverterW: 7000,
    solarW: 8000,
    batteryNominalWh: 10000
  });
  assert.deepEqual(Array.from(withBackup.recommended, ({ package: solarPackage }) => solarPackage.id), [
    "premium-executive-corporate",
    "heavy-commercial-industrial"
  ]);
  assert.ok(withBackup.explore.some(({ package: solarPackage, batteryStatus }) =>
    solarPackage.id === "basic-small-home-office" && batteryStatus === "undocumented"));
  assert.equal("dailyEnergyWh" in solarPackages[0], false);

  const withoutBackup = recommendSolarPackages(solarPackages, {
    inverterW: 5000,
    solarW: 5000,
    batteryNominalWh: null
  });
  assert.ok(withoutBackup.recommended.some(({ package: solarPackage }) => solarPackage.id === "medium-home-office"));
});

test("catalogue search, brand and category filters combine and find products beyond the first page", () => {
  const product = catalogueProducts[catalogueProducts.length - 1];
  const result = Array.from(filterEnergyProducts(catalogueProducts, {
    query: product.model,
    brand: product.brand,
    category: product.category
  }, catalogueContext.window.ElectronyEnergyCategories));
  assert.deepEqual(result.map(({ id }) => id), [product.id]);
  assert.deepEqual(Array.from(filterEnergyProducts(catalogueProducts, {
    query: product.model,
    brand: "not-a-real-brand",
    category: "all"
  }, catalogueContext.window.ElectronyEnergyCategories)), []);
});

test("catalogue pagination makes all original products available exactly once", () => {
  assert.equal(catalogueProducts.length, 123);
  assert.equal(new Set(catalogueProducts.map(({ id }) => id)).size, 123);
  catalogueProducts.forEach((product) => {
    assert.ok(product.image?.url, `${product.id} should retain its product or category image`);
    assert.ok(product.image?.alt, `${product.id} should have meaningful image alternative text`);
    assert.ok(fs.existsSync(path.resolve(projectRoot, "energy", product.image.url)), `${product.id} image should be present in public assets`);
  });

  const allProducts = Array.from(filterEnergyProducts(catalogueProducts, {
    query: "",
    brand: "all",
    category: "all"
  }, catalogueContext.window.ElectronyEnergyCategories));
  const allPages = [];
  for (let pageNumber = 1; pageNumber <= Math.ceil(allProducts.length / 12); pageNumber += 1) {
    allPages.push(getEnergyProductPage(allProducts, pageNumber, 12));
  }
  const pagedProducts = allPages.flatMap(({ products }) => Array.from(products));
  assert.equal(pagedProducts.length, catalogueProducts.length);
  assert.equal(new Set(pagedProducts.map(({ id }) => id)).size, catalogueProducts.length);
  assert.equal(allPages[0].products.length, 12);
  assert.equal(allPages.at(-1).products.length, 3);
  assert.equal(getEnergyProductPage(allProducts, 100, 12).page, allPages.length);
});
