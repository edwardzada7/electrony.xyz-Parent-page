const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const projectRoot = path.resolve(__dirname, "..");

function loadCatalogueScript(filename) {
  const window = {};
  const source = fs.readFileSync(path.join(projectRoot, "src", filename), "utf8");
  vm.runInNewContext(source, { window }, { filename });
  return window;
}

function resolvePageAsset(pageDirectory, assetUrl) {
  const url = new URL(assetUrl, `https://catalogue.example/${pageDirectory}/`);
  return path.join(projectRoot, decodeURIComponent(url.pathname.slice(1)));
}

test("Energy product image mappings preserve all 123 catalogue records", () => {
  const products = loadCatalogueScript("energy-catalogue.js").ElectronyEnergyProducts;
  assert.equal(products.length, 123);
  assert.equal(new Set(products.map((product) => product.id)).size, 123);

  const productImages = products.filter((product) => product.image.url.includes("/products/"));
  assert.equal(productImages.length, 21);
  for (const product of productImages) {
    assert.ok(product.image.alt);
    assert.ok(fs.existsSync(resolvePageAsset("energy", product.image.url)), product.image.url);
  }
  for (const product of products) {
    assert.ok(fs.existsSync(resolvePageAsset("energy", product.image.url)), product.image.url);
  }

  const uploadedImages = ["jinko", "huawei"].flatMap((brand) => {
    const directory = path.join(projectRoot, "assets/catalogue/energy/products", brand);
    return fs.readdirSync(directory)
      .filter((filename) => /\.(?:jpe?g|png|webp|gif)$/i.test(filename))
      .map((filename) => `${brand}/${filename}`);
  });
  assert.equal(uploadedImages.length, 18);
  const mappedImagePaths = new Set(productImages.map((product) => {
    const url = new URL(product.image.url, "https://catalogue.example/energy/");
    return decodeURIComponent(url.pathname.split("/products/")[1]);
  }));
  assert.equal(mappedImagePaths.size, 16);
  assert.deepEqual(
    uploadedImages.filter((filename) => !mappedImagePaths.has(filename)).sort(),
    [
      "huawei/ATS 63A.jpg",
      "huawei/Huawei-Auto-Transfer-Switch-100A-Max-220380Vac-3-Phase.jpg"
    ].sort()
  );

  const jinko = products.filter((product) => product.brand === "JINKO");
  assert.equal(jinko.length, 6);
  assert.equal(new Set(jinko.slice(0, 3).map((product) => product.image.url)).size, 1);
  assert.equal(new Set(jinko.slice(3).map((product) => product.image.url)).size, 1);
  assert.notEqual(jinko[0].image.url, jinko[3].image.url);

  const unmatchedHuaweiImages = [
    "ATS 63A.jpg",
    "Huawei-Auto-Transfer-Switch-100A-Max-220380Vac-3-Phase.jpg"
  ];
  const huaweiDirectory = path.join(projectRoot, "assets/catalogue/energy/products/huawei");
  for (const filename of unmatchedHuaweiImages) {
    assert.ok(fs.existsSync(path.join(huaweiDirectory, filename)));
    assert.equal(productImages.some((product) => product.image.url.endsWith(filename)), false);
  }
});

test("Hardware source catalogue contains traceable products without source prices", () => {
  const window = loadCatalogueScript("hardware-products.js");
  const products = window.ElectronyHardwareSourceProducts;
  assert.equal(products.length, 396);
  assert.deepEqual(
    ["Hisense", "LG", "MAXI"].map((brand) => products.filter((product) => product.brand === brand).length),
    [145, 135, 116]
  );
  assert.equal(new Set(products.map((product) => product.id)).size, products.length);
  for (const product of products) {
    assert.ok(product.model);
    assert.ok(product.description);
    assert.ok(product.source.document);
    assert.ok(Number.isInteger(product.source.page));
    assert.ok(fs.existsSync(path.join(projectRoot, "hardware", product.source.document)));
    assert.equal(Object.hasOwn(product, "price"), false);
    assert.ok(fs.existsSync(resolvePageAsset("hardware", product.image.url)), product.image.url);
  }
  const productByModel = new Map(products.map((product) => [product.model, product]));
  assert.equal(productByModel.get("INV6KS-AA1").category, "solar-energy");
  assert.equal(productByModel.get("BATHEL5-E-BB1").category, "solar-energy");
  assert.equal(productByModel.get("LGTV43LR600").category, "consumer-electronics");
  assert.equal(productByModel.get("WM1I6022BKWF").category, "appliances");
  assert.equal(productByModel.get("HISMWO34MOBS10HG").category, "appliances");
  assert.equal(productByModel.get("REF331SLBB").category, "appliances");
  assert.equal(productByModel.get("MAXIUPS600DG").category, "electrical-power");
  assert.equal(productByModel.get("SPLIT1HPINV").category, "appliances");
  assert.equal(productByModel.get("MON27G3Q").category, "computers");
  assert.equal(productByModel.get("BRACKETUNIVERSAL").category, "consumer-electronics");
});

test("ROX uploads join its existing showcase without changing vehicle or pickup records", () => {
  const catalogue = loadCatalogueScript("automobile-catalogue.js").ElectronyAutomobileData;
  assert.equal(catalogue.vehicles.length, 17);
  const pickups = catalogue.vehicles.filter((vehicle) => vehicle.category === "Pickup");
  assert.equal(pickups.length, 4);
  assert.ok(pickups.every((vehicle) => vehicle.priceLabel === "Price on Request"));

  const rox = catalogue.legacyShowcaseVehicles.find((vehicle) => vehicle.id === "rox-01");
  assert.ok(rox);
  assert.equal(rox.images.length, 6);
  assert.equal(rox.videos.length, 3);
  assert.equal(rox.galleryTitle, "ROX Motor media");
  const z9 = pickups.find((vehicle) => vehicle.id === "dongfeng-z9");
  assert.ok(z9);
  assert.equal(z9.videos.length, 2);
  for (const assetUrl of [
    ...rox.images,
    ...rox.videos.map((video) => video.src),
    ...rox.videos.map((video) => video.poster),
    ...z9.videos.map((video) => video.src)
  ]) {
    assert.ok(fs.existsSync(resolvePageAsset("automobile", assetUrl)), assetUrl);
  }
});
