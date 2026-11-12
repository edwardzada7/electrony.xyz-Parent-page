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
const energyPricingSource = fs.readFileSync(path.join(__dirname, "energy-pricing.js"), "utf8");
const energyCatalogueSource = fs.readFileSync(path.join(__dirname, "energy-catalogue.js"), "utf8");
const energyPageSource = fs.readFileSync(path.join(projectRoot, "energy/index.html"), "utf8");
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
vm.runInNewContext(energyCatalogueSource, solarPackageContext);
vm.runInNewContext(energyPackageSource, solarPackageContext);
const solarPackages = solarPackageContext.window.ElectronySolarPackages;
const { filterEnergyProducts, getEnergyProductPage } = catalogueContext.window.ElectronyEnergyCatalogue;

test("Energy page scripts do not redeclare page-level lexical bindings", () => {
  const declarations = (source) => [...source.matchAll(/^(const|let|class|function)\s+([A-Za-z_$][\w$]*)/gm)]
    .map((match) => ({ kind: match[1], name: match[2] }));
  const pageScripts = [
    energyCatalogueSource,
    energyPackageSource,
    energyPricingSource,
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

test("package catalogue contains the six reconciled customer packages", () => {
  assert.equal(solarPackages.length, 6);
  assert.deepEqual(Array.from(solarPackages, (solarPackage) => solarPackage.name), [
    "Small Home Solar Package",
    "Medium Home Solar Package",
    "Medium Home Solar Package — Option 2",
    "Medium Home Solar Package — Option 3",
    "Large Home / Executive Solar Package",
    "Industrial / Company Solar Package"
  ]);
  solarPackages.forEach((solarPackage) => {
    assert.ok(solarPackage.components.length > 0);
    assert.equal(solarPackage.source.document, "POWER-SOLAR PL-1.pdf");
    assert.equal(solarPackage.compositionSource.document, "Solar_Power_Solution_Packages.pdf");
    assert.ok(solarPackage.solarArrayWatts > 0);
    assert.ok(solarPackage.batteryNominalWh > 0);
    assert.ok(solarPackage.compatibilityNotes);
    assert.ok(solarPackage.installationNotes);
    assert.equal("price" in solarPackage, false);
  });
  assert.equal(solarPackages[0].panelCount * solarPackages[0].panelWatts, solarPackages[0].solarArrayWatts);
  assert.equal(solarPackages[1].batteryNominalWh, 5120);
  assert.equal(solarPackages[1].components.some((component) => component.category === "Battery"), false);
});

test("maps each uploaded solar package image to its matching package", () => {
  const expectedImages = new Map([
    ["basic-small-home-office", "Small home Solar package.jpg"],
    ["medium-home-office", "medium home solar package.jpg"],
    ["premium-executive-corporate", "Large Home Solar package.jpg"],
    ["heavy-commercial-industrial", "Industrial solar package.jpg"]
  ]);
  const imagePackages = solarPackages.filter((solarPackage) => expectedImages.has(solarPackage.id));
  const filenames = imagePackages.map((solarPackage) => {
    assert.ok(solarPackage.image.alt);
    assert.ok(solarPackage.image.width > 0);
    assert.ok(solarPackage.image.height > 0);
    const imageUrl = new URL(solarPackage.image.url, "https://energy.example/energy/");
    assert.equal(imageUrl.pathname.startsWith("/energy/"), true);
    const filename = decodeURIComponent(path.basename(imageUrl.pathname));
    assert.equal(filename, expectedImages.get(solarPackage.id));
    assert.ok(fs.existsSync(path.join(projectRoot, "energy", filename)), `${filename} should exist`);
    return filename;
  });
  assert.equal(new Set(filenames).size, expectedImages.size);
  ["medium-home-office-option-2", "medium-home-office-option-3"].forEach((packageId) => {
    const option = solarPackages.find((solarPackage) => solarPackage.id === packageId);
    assert.equal(option.image.url, solarPackages.find(({ id }) => id === "medium-home-office").image.url);
  });
});

test("Energy page replaces the connected-landscape intro with one Solar Packages section", () => {
  assert.doesNotMatch(energyPageSource, /A connected(?: energy)? landscape/i);
  assert.doesNotMatch(energyPageSource, /Product image unavailable/i);
  assert.equal((energyPageSource.match(/<section\b[^>]*id="solar-packages"/g) || []).length, 1);
  assert.match(energyPageSource, /Six solar packages, aligned to the current product catalogue/);
});

test("calculator chooses the smallest package that meets inverter, solar and backup requirements", () => {
  const assumptions = {
    days: 30,
    backupHours: 2,
    designMargin: 25,
    batteryUsable: 80,
    efficiency: 90,
    peakSunHours: 5,
    solarLosses: 20
  };
  const recommendationFor = (watts, hours, backupHours) => {
    const estimate = calculateEnergyEstimate({
      appliances: [{ quantity: 1, watts, hours }],
      assumptions: { ...assumptions, backupHours }
    });
    const result = recommendSolarPackages(solarPackages, estimate);
    return { estimate, result };
  };
  const scenarios = [
    [1500, 1, 2, "basic-small-home-office"],
    [4000, 6, 0.5, "medium-home-office"],
    [6200, 30000 / 6200, 0.5, "premium-executive-corporate"],
    [40000, 5, 0.5, "heavy-commercial-industrial"]
  ];

  scenarios.forEach(([watts, hours, backupHours, expectedPackageId]) => {
    const { estimate, result } = recommendationFor(watts, hours, backupHours);
    assert.equal(result.recommended.length, 1);
    assert.equal(result.recommended[0].package.id, expectedPackageId);
    assert.equal(result.recommended[0].recommended, true);
    assert.equal(result.recommended[0].inverterMeets, true);
    assert.equal(result.recommended[0].solarMeets, true);
    assert.equal(result.recommended[0].batteryStatus, "meets");
    assert.ok(result.recommended[0].package.batteryNominalWh >= estimate.batteryNominalWh);
  });
});

test("calculator compares the two Future-H options by their catalogue inverter and battery ratings", () => {
  const result = recommendSolarPackages(solarPackages, {
    inverterW: 6000,
    solarW: 6000,
    batteryNominalWh: 5300
  });
  const comparisons = [...result.recommended, ...result.explore];
  const option2 = comparisons.find(({ package: solarPackage }) =>
    solarPackage.id === "medium-home-office-option-2");
  const option3 = comparisons.find(({ package: solarPackage }) =>
    solarPackage.id === "medium-home-office-option-3");

  assert.ok(option2);
  assert.ok(option3);
  assert.equal(option2.inverterMeets, true);
  assert.equal(option2.solarMeets, true);
  assert.equal(option2.batteryStatus, "meets");
  assert.equal(option2.recommended, true);
  assert.equal(option3.inverterMeets, true);
  assert.equal(option3.solarMeets, true);
  assert.equal(option3.batteryStatus, "below");
  assert.equal(option3.recommended, false);
});

test("calculator requests a custom assessment when all package inverter ratings are too small", () => {
  const estimate = calculateEnergyEstimate({
    appliances: [{ quantity: 1, watts: 50000, hours: 2 }],
    assumptions: {
      days: 30,
      backupHours: 0.5,
      designMargin: 25,
      batteryUsable: 80,
      efficiency: 90,
      peakSunHours: 5,
      solarLosses: 20
    }
  });
  const result = recommendSolarPackages(solarPackages, estimate);
  assert.equal(result.recommended.length, 0);
  assert.equal(result.explore.length, 6);
  assert.ok(result.explore.every(({ inverterMeets }) => !inverterMeets));
});

test("backup duration prevents a package with insufficient integrated storage from being recommended", () => {
  const estimate = calculateEnergyEstimate({
    appliances: [{ quantity: 1, watts: 4000, hours: 6 }],
    assumptions: {
      days: 30,
      backupHours: 2,
      designMargin: 25,
      batteryUsable: 80,
      efficiency: 90,
      peakSunHours: 5,
      solarLosses: 20
    }
  });
  const result = recommendSolarPackages(solarPackages, estimate);
  assert.equal(result.recommended.length, 1);
  assert.equal(result.recommended[0].package.id, "premium-executive-corporate");
  assert.equal(result.explore.find(({ package: solarPackage }) => solarPackage.id === "medium-home-office").batteryStatus, "below");
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
  assert.equal(catalogueProducts.length, 130);
  assert.equal(new Set(catalogueProducts.map(({ id }) => id)).size, catalogueProducts.length);
  catalogueProducts.forEach((product) => {
    assert.ok(product.image?.url, `${product.id} should retain its product or category image`);
    assert.ok(product.image?.alt, `${product.id} should have meaningful image alternative text`);
    const imageUrl = new URL(product.image.url, "https://energy.example/energy/");
    const imagePath = path.join(projectRoot, decodeURIComponent(imageUrl.pathname.slice(1)));
    assert.ok(fs.existsSync(imagePath), `${product.id} image should be present in public assets`);
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
  assert.equal(allPages.at(-1).products.length, catalogueProducts.length % 12);
  assert.equal(getEnergyProductPage(allProducts, 100, 12).page, allPages.length);
});
