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

test("Energy product image mappings preserve all 130 catalogue records", () => {
  const products = loadCatalogueScript("energy-catalogue.js").ElectronyEnergyProducts;
  assert.equal(products.length, 130);
  assert.equal(new Set(products.map((product) => product.id)).size, 130);

  const productImages = products.filter((product) => product.image.url.includes("/products/"));
  assert.equal(productImages.length, 13);
  for (const product of productImages) {
    assert.ok(product.image.alt);
    assert.ok(fs.existsSync(resolvePageAsset("energy", product.image.url)), product.image.url);
  }
  for (const product of products) {
    assert.ok(fs.existsSync(resolvePageAsset("energy", product.image.url)), product.image.url);
    if (product.brandLogo) {
      assert.ok(fs.existsSync(resolvePageAsset("energy", product.brandLogo)), product.brandLogo);
    }
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
    return url.pathname.includes("/products/")
      ? decodeURIComponent(url.pathname.split("/products/")[1])
      : null;
  }).filter(Boolean));
  assert.equal(mappedImagePaths.size, 6);
  assert.deepEqual(
    uploadedImages.filter((filename) => !mappedImagePaths.has(filename)).sort(),
    [
      "growatt/spf-off-grid-inverter-family.jpg",
      "hisense/lifepo4-51-2v-100ah-battery-family.jpg",
      "huawei/ATS 63A.jpg",
      "huawei/BATTERY CABINET.jpeg",
      "huawei/DTSU666-HW.jpg",
      "huawei/HUWINV100KTL-M2.png",
      "huawei/HUWINV150K-MG0.jpg",
      "huawei/HUWSMARTMODUL1000A01.webp",
      "huawei/INSTALLATION TRAY.webp",
      "huawei/LITHIUM BATTERY.jpeg",
      "huawei/LQUID LEVEL SENSOR.webp",
      "huawei/LUNA 2000-215KWH.webp",
      "huawei/LUNA 2000-97KWH.webp",
      "huawei/MERC-1300WP.jpg",
      "huawei/POWER CABINET.jpeg",
    ].sort()
  );

  const jinko = products.filter((product) => product.brand === "JINKO");
  assert.equal(jinko.length, 8);
  assert.equal(new Set(jinko.slice(0, 4).map((product) => product.image.url)).size, 1);
  assert.equal(new Set(jinko.slice(4).map((product) => product.image.url)).size, 1);
  assert.notEqual(jinko[0].image.url, jinko[4].image.url);

  const unmatchedHuaweiImages = ["ATS 63A.jpg"];
  const huaweiDirectory = path.join(projectRoot, "assets/catalogue/energy/products/huawei");
  for (const filename of unmatchedHuaweiImages) {
    assert.ok(fs.existsSync(path.join(huaweiDirectory, filename)));
    assert.equal(productImages.some((product) => product.image.url.endsWith(filename)), false);
  }

  const productByModel = new Map(products.map((product) => [product.model, product]));
  const hisenseBattery = productByModel.get("BATHEL5-E-BB1");
  assert.equal(hisenseBattery.image.url, "/energy/Hisense%20battery.webp");
  assert.match(hisenseBattery.image.note, /exact model is not visible/i);
  assert.equal(productByModel.get("INV6KS-AA1").image.url, "/energy/Hisense%20inverter.webp");

  assert.equal(productByModel.get("SPF 3000TL-HVM-24"), undefined);
  assert.equal(productByModel.get("SPF 6000ES").image.url, "../assets/catalogue/energy-inverter.svg");

  const deyeControlBoxes = [
    productByModel.get("CONTROL BOX HV BOS-B-PDU-2-A"),
    productByModel.get("CONTROL BOX HV BOS-G-PDU-PRO")
  ];
  assert.ok(deyeControlBoxes.every((product) =>
    product.image.url === "../assets/catalogue/energy/products/deye/battery-control-box-family.webp"));
  assert.ok(deyeControlBoxes.every((product) => /Shared family-level image/.test(product.image.note)));

  const mapping = fs.readFileSync(path.join(projectRoot, "energy/product-image-mapping.md"), "utf8");
  const mappingRows = mapping.split("\n").filter((line) => /^\| `/.test(line));
  assert.equal(mappingRows.length, 36);
});

test("Hardware catalogue preserves revised source records, prices, and traceability", () => {
  const window = loadCatalogueScript("hardware-products.js");
  const products = window.ElectronyHardwareSourceProducts;
  const sourceDocuments = window.ElectronyHardwareSourceDocuments;
  assert.equal(products.length, 483);
  assert.deepEqual(
    ["Hisense", "LG", "MAXI", "MORA", null].map((brand) => products.filter((product) => product.brand === brand).length),
    [180, 151, 149, 1, 2]
  );
  assert.equal(new Set(products.map((product) => product.id)).size, products.length);
  const normalizeModel = (model) => model.toLocaleUpperCase().replace(/[^A-Z0-9]/g, "");
  const uniqueModels = products.map((product) => `${product.brand || "unknown"}:${normalizeModel(product.model)}`);
  assert.equal(new Set(uniqueModels).size, products.length);

  const revisedDocuments = new Set(["Hisense-1.pdf", "LG-1.pdf", "MAXI-1.pdf"]);
  const revisedProducts = products.filter((product) => revisedDocuments.has(product.source.document));
  assert.equal(revisedProducts.length, 405);
  assert.deepEqual(
    Array.from(sourceDocuments.filter((source) => revisedDocuments.has(source.document)), (source) => source.version),
    ["1.7", "1.7", "1.7"]
  );
  assert.equal(sourceDocuments.find((source) => source.document === "PROMO LIST-1.pdf").validityDate, null);
  assert.equal(sourceDocuments.find((source) => source.document === "PROMO LIST-1.pdf").published, false);

  for (const product of products) {
    assert.ok(product.model);
    assert.ok(product.source.document);
    assert.ok(Number.isInteger(product.source.page));
    assert.ok(fs.existsSync(path.join(projectRoot, "hardware", product.source.document)));
    assert.ok(["listed", "not-listed", "conflict"].includes(product.priceStatus));
    assert.ok(fs.existsSync(resolvePageAsset("hardware", product.image.url)), product.image.url);
    assert.match(product.image.alt, /illustrative/i);
    assert.match(product.image.alt, /not a product photograph/i);
    for (const source of [product.source, ...(product.sources || [])]) {
      assert.ok(fs.existsSync(path.join(projectRoot, "hardware", source.document)));
      assert.ok(Number.isInteger(source.page));
    }

    if (product.priceStatus === "listed") {
      assert.equal(product.price.currency, "NGN");
      assert.match(product.price.display, /^₦[\d,]+(?:\.\d{2})?$/);
      const source = product.priceSource || product.source;
      const observation = product.priceObservations.find((item) =>
        item.document === source.document && item.page === source.page
      );
      assert.ok(observation, `${product.model} price source is recorded`);
      assert.equal(product.price.display, `₦${observation.rawAmount}`);
      assert.equal(product.price.amount, observation.rawAmount.replace(/,/g, ""));
    } else {
      assert.equal(product.price, null);
    }
  }

  const universalBracket = products.filter((product) => normalizeModel(product.model) === "BRACKETUNIVERSAL");
  assert.equal(universalBracket.length, 1);
  assert.equal(universalBracket[0].brand, null);
  assert.equal(universalBracket[0].category, "consumer-electronics");
  assert.equal(universalBracket[0].priceStatus, "conflict");
  assert.deepEqual(
    Array.from(universalBracket[0].priceObservations, (observation) => observation.rawAmount).sort(),
    ["4,600", "6,500", "6,500"]
  );

  const unpricedModel = products.find((product) => product.model === "HISAF08AFBK1S4");
  assert.equal(unpricedModel.price, null);
  assert.equal(unpricedModel.priceStatus, "not-listed");
  assert.equal(products.filter((product) => normalizeModel(product.model) === "MAXIINSTALLATIONKITPLUSA").length, 1);
  assert.equal(products.filter((product) => normalizeModel(product.model) === "MAXIINSTALLATIONKITPLUSB").length, 1);
  assert.equal(products.filter((product) => product.warrantyStatus === "needs-confirmation").length, 1);

  const currentSourcePaths = [...revisedDocuments];
  assert.ok(currentSourcePaths.every((filename) => sourceDocuments.some((source) => source.document === filename)));

  const productByModel = new Map(products.map((product) => [product.model, product]));
  assert.equal(productByModel.get("INV6KS-AA1").category, "solar-energy");
  assert.equal(productByModel.get("BATHEL5-E-BB1").category, "solar-energy");
  assert.equal(productByModel.get("LGTV43LR600").category, "consumer-electronics");
  assert.equal(productByModel.get("WM1I6022BKWF").category, "appliances");
  assert.equal(productByModel.get("HISMWO34MOBS10HG").category, "appliances");
  assert.equal(productByModel.get("REF 331 SLBB").category, "appliances");
  assert.equal(productByModel.get("MAXIUPS600DG").category, "electrical-power");
  assert.equal(productByModel.get("SPLIT1HPINV").category, "appliances");
  assert.equal(productByModel.get("MON27G3Q").category, "computers");
  assert.equal(productByModel.get("BRACKET UNIVERSAL").category, "consumer-electronics");
  assert.equal(productByModel.get("WM0Z6DRP24").description, "2 in 1 ,Washer (13KG), Dryer (8KG), Direct Drive Motor, Smart,True Steam ,  Silver");
  assert.equal(
    productByModel.get("HISIRON1800GRT").description,
    "steam iron,1800W,water spray,ceramic soleplate,250ml water tank,stam level, water button,steam boost,360 power cord"
  );
  assert.match(productByModel.get("HISIRON28SIWES1").description, /2800W/);
  assert.equal(
    productByModel.get("MON34G6Q").description,
    "34'' Gaming monitor,1000R,200 Hz ,1ms,90% DCI-P3,FreeSync Premium ,Display HDR 400"
  );
  assert.match(productByModel.get("MON 34G6K-PRO").description, /3440x1440p WQHD/);
  assert.equal(productByModel.get("LGAUD301STAGE").category, "consumer-electronics");
  assert.match(productByModel.get("LGAUD301STAGE").description, /60W, 6\.5” woofer/);
  assert.doesNotMatch(productByModel.get("AUD 9RNC (Baba)").description, /60W, 6\.5” woofer/);
  assert.match(productByModel.get("MAXIHOODD002BL").description, /1 Wx2 pcs Led Lamp/);
  assert.doesNotMatch(productByModel.get("MAXIHOODD0029GR").description, /^1 Wx2 pcs Led Lamp/);
});

test("Hardware enquiry context keeps product details and accepted-only submission behavior", () => {
  const hardwareScript = fs.readFileSync(path.join(projectRoot, "src", "hardware.js"), "utf8");
  const contactScript = fs.readFileSync(path.join(projectRoot, "src", "contact-form.js"), "utf8");
  const hardwarePage = fs.readFileSync(path.join(projectRoot, "hardware", "index.html"), "utf8");
  assert.match(hardwareScript, /document\.createElement\("details"\)/);
  assert.match(hardwareScript, /new URLSearchParams\(window\.location\.search\)\.get\("product"\)/);
  assert.match(hardwareScript, /Catalogue URL: \$\{productUrl\.href\}/);
  assert.match(hardwareScript, /product\.description \? `Source-listed details:/);
  assert.match(hardwarePage, /id="quote-context"[^>]+data-message-label="Catalogue product details"/);
  assert.match(contactScript, /fetch\("\/api\/contact"/);
  assert.match(contactScript, /submitButton\.disabled = true/);
  assert.match(contactScript, /result\.ok !== true/);
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
