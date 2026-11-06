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
  assert.equal(productImages.length, 25);
  for (const product of productImages) {
    assert.ok(product.image.alt);
    assert.ok(fs.existsSync(resolvePageAsset("energy", product.image.url)), product.image.url);
  }
  for (const product of products) {
    assert.ok(fs.existsSync(resolvePageAsset("energy", product.image.url)), product.image.url);
  }

  const uploadedImages = ["jinko", "huawei", "growatt", "hisense", "deye"].flatMap((brand) => {
    const directory = path.join(projectRoot, "assets/catalogue/energy/products", brand);
    return fs.readdirSync(directory)
      .filter((filename) => /\.(?:jpe?g|png|webp|gif)$/i.test(filename))
      .map((filename) => `${brand}/${filename}`);
  });
  assert.equal(uploadedImages.length, 21);
  const mappedImagePaths = new Set(productImages.map((product) => {
    const url = new URL(product.image.url, "https://catalogue.example/energy/");
    return decodeURIComponent(url.pathname.split("/products/")[1]);
  }));
  assert.equal(mappedImagePaths.size, 19);
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

  const productByModel = new Map(products.map((product) => [product.model, product]));
  const hisenseBattery = productByModel.get("BATHEL5-E-BB1");
  assert.equal(hisenseBattery.image.url, "../assets/catalogue/energy/products/hisense/lifepo4-51-2v-100ah-battery-family.jpg");
  assert.match(hisenseBattery.image.note, /exact model is not identifiable/i);

  const growattInverter = productByModel.get("SPF 3000TL-HVM-24");
  assert.equal(growattInverter.image.url, "../assets/catalogue/energy/products/growatt/spf-off-grid-inverter-family.jpg");
  assert.match(growattInverter.image.note, /does not confirm the SPF model/i);

  const deyeControlBoxes = [
    productByModel.get("CONTROL BOX HV BOS-B-PDU-2-A"),
    productByModel.get("CONTROL BOX HV BOS-G-PDU-PRO")
  ];
  assert.ok(deyeControlBoxes.every((product) =>
    product.image.url === "../assets/catalogue/energy/products/deye/battery-control-box-family.webp"));
  assert.ok(deyeControlBoxes.every((product) => /Shared family-level image/.test(product.image.note)));

  const mapping = fs.readFileSync(path.join(projectRoot, "energy/product-image-mapping.md"), "utf8");
  const mappingRows = mapping.split("\n").filter((line) => /^\| `/.test(line));
  assert.equal(mappingRows.length, 34);
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

test("ROX uploads retain verified model attribution and keep other media shared", () => {
  const catalogue = loadCatalogueScript("automobile-catalogue.js").ElectronyAutomobileData;
  assert.equal(catalogue.vehicles.length, 17);
  const pickups = catalogue.vehicles.filter((vehicle) => vehicle.category === "Pickup");
  assert.equal(pickups.length, 4);
  assert.ok(pickups.every((vehicle) => vehicle.priceLabel === "Price on Request"));

  const rox01 = catalogue.legacyShowcaseVehicles.find((vehicle) => vehicle.id === "rox-01");
  const adamas = catalogue.legacyShowcaseVehicles.find((vehicle) => vehicle.id === "rox-adamas");
  const roxMedia = catalogue.roxMotorSharedMedia;
  assert.ok(rox01);
  assert.ok(adamas);
  assert.deepEqual(Array.from(rox01.images), ["../assets/automobile/vehicles/rox-01.jpg"]);
  assert.equal(rox01.videos.length, 0);
  assert.equal(adamas.images.length, 0);
  assert.equal(adamas.videos.length, 0);
  assert.equal(roxMedia.images.length, 5);
  assert.equal(roxMedia.videos.length, 3);
  assert.equal(roxMedia.sharedBrandMedia, true);
  const z9 = pickups.find((vehicle) => vehicle.id === "dongfeng-z9");
  assert.ok(z9);
  assert.equal(z9.videos.length, 2);
  for (const assetUrl of [
    ...rox01.images,
    adamas.cardImage,
    ...roxMedia.images,
    ...roxMedia.videos.map((video) => video.src),
    ...z9.videos.map((video) => video.src)
  ]) {
    assert.ok(fs.existsSync(resolvePageAsset("automobile", assetUrl)), assetUrl);
  }
});
