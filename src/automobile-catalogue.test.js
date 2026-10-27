const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repositoryRoot = path.resolve(__dirname, "..");
const catalogueSource = fs.readFileSync(path.join(__dirname, "automobile-catalogue.js"), "utf8");
const automobileSource = fs.readFileSync(path.join(__dirname, "automobile.js"), "utf8");
const browserContext = { window: {}, URL };
vm.runInNewContext(catalogueSource, browserContext, { filename: "automobile-catalogue.js" });

const { vehicles, legacyShowcaseVehicles, featuredVideos, getYouTubeVideoId } = browserContext.window.ElectronyAutomobileData;
const originalVehicles = vehicles.filter((vehicle) => vehicle.category !== "Pickup");
const pickupVehicles = vehicles.filter((vehicle) => vehicle.category === "Pickup");
const expectedModels = [
  "NAMMI BOX",
  "NAMMI 06 VIGO",
  "MAGE M57",
  "MAGE S01 EV",
  "HUGE G59",
  "eπ 008",
  "SHINE C65",
  "SHINE GS C68",
  "VOYAH DREAM",
  "VOYAH TAISHAN",
  "VOYAH FREE+",
  "M-HERO II 817",
  "M-HERO I"
];

test("catalogue and renderer do not redeclare page-level lexical bindings", () => {
  const declarations = (source) => [...source.matchAll(/^(?:const|let|class|function)\s+([A-Za-z_$][\w$]*)/gm)]
    .map((match) => match[1]);
  const catalogueBindings = new Set(declarations(catalogueSource));
  const conflicts = declarations(automobileSource).filter((name) => catalogueBindings.has(name));
  assert.deepEqual(conflicts, []);
});

test("contains each of the 13 original brochure vehicles exactly once", () => {
  assert.equal(originalVehicles.length, 13);
  assert.deepEqual(Array.from(originalVehicles, (vehicle) => vehicle.name), expectedModels);
  assert.equal(new Set(vehicles.map((vehicle) => vehicle.id)).size, 17);
  for (const vehicle of originalVehicles) {
    assert.equal(originalVehicles.filter((candidate) => candidate.name === vehicle.name).length, 1);
  }
});

test("each original brochure vehicle retains its sourced specs, source pages and images", () => {
  for (const [index, vehicle] of originalVehicles.entries()) {
    assert.equal(vehicle.source.publisher, "Fouani Nigeria Ltd");
    assert.equal(vehicle.source.pdfPage, index + 4);
    assert.equal(vehicle.source.modelPage, index + 1);
    assert.ok(vehicle.vehicleType);
    assert.ok(vehicle.powertrain);
    assert.ok(vehicle.headlineSpecifications.length);
    assert.ok(vehicle.specificationGroups.length);
    assert.equal(vehicle.priceLabel, "Request current price");
    assert.equal(vehicle.statusLabel, "Confirm availability");
    assert.ok(vehicle.images.length);

    for (const image of vehicle.images) {
      const imagePath = path.resolve(repositoryRoot, "automobile", image);
      assert.ok(fs.existsSync(imagePath), `${vehicle.name} image missing: ${image}`);
    }
    for (const video of vehicle.videos) {
      assert.ok(video.title, `${vehicle.name} video is missing its title`);
      const videoPath = path.resolve(repositoryRoot, "automobile", video.src);
      assert.ok(fs.existsSync(videoPath), `${vehicle.name} video missing: ${video.src}`);
    }
  }
});

test("pickup models preserve brochure-specific variants, specs and images while requesting prices by enquiry", () => {
  assert.equal(pickupVehicles.length, 4);
  assert.deepEqual(Array.from(pickupVehicles, (vehicle) => vehicle.name), ["RICH 6T", "RICH 6", "RICH 7", "Z9"]);
  for (const [index, vehicle] of pickupVehicles.entries()) {
    assert.equal(vehicle.brand, "Dongfeng");
    assert.equal(vehicle.category, "Pickup");
    assert.equal(vehicle.source.brochure, "Dongfeng_Pickups_-_Fouani_Nigeria_(with_prices).pdf");
    assert.equal(vehicle.source.pdfPage, index + 4);
    assert.equal(vehicle.source.modelPage, index + 1);
    assert.equal(vehicle.source.modelPageCount, 4);
    assert.equal(vehicle.priceLabel, "Price on Request");
    assert.equal(vehicle.statusLabel, "Confirm current price and availability");
    assert.ok(vehicle.images.length);
    assert.ok(vehicle.headlineSpecifications.length);
    assert.ok(vehicle.specificationGroups.length);
    for (const image of vehicle.images) {
      const imagePath = path.resolve(repositoryRoot, "automobile", image);
      assert.ok(fs.existsSync(imagePath), `${vehicle.name} image missing: ${image}`);
    }
  }
  assert.ok(pickupVehicles[0].specificationGroups.some((group) => group.items.includes("2WD and 4WD versions*")));
  assert.ok(pickupVehicles[2].specificationGroups.some((group) => group.items.includes("360-degree camera on UPR trim")));
  assert.ok(pickupVehicles[3].specificationGroups.some((group) => group.items.includes("Commercial version")));
  assert.doesNotMatch(catalogueSource, /(?:29,400,000|30,240,000|35,700,000|47,250,000)/);
  assert.match(automobileSource, /requestPrice \? "Enquire for Price"/);
  assert.match(automobileSource, /href="#automobile-vehicle-enquiry">Enquire for Price/);
});

test("pickup navigation, filter option and requested Automobile copy are present", () => {
  const html = fs.readFileSync(path.join(repositoryRoot, "automobile", "index.html"), "utf8");
  assert.match(html, /href="#vehicle-inventory" data-category-link="Pickup">Pickup<\/a>/);
  assert.match(html, /<option value="Pickup">Pickup<\/option>/);
  assert.doesNotMatch(html, /data-brand="pickup"/);
  assert.ok(html.includes("Vehicle specifications and photographs are attributed to the Dongfeng range brochure. Equipment may vary by trim and market."));
  assert.ok(html.includes("<p>ROX Motor is presented as a selected brand and its model is shown as a current candidate for enquiry and purchase</p>"));
});

test("optional YouTube data is empty until verified media is supplied", () => {
  assert.equal(featuredVideos.length, 0);
  for (const vehicle of vehicles) assert.equal(vehicle.youtubeVideo, null);
  assert.equal(getYouTubeVideoId("dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(getYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(getYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(getYouTubeVideoId("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(getYouTubeVideoId("http://youtu.be/dQw4w9WgXcQ"), "");
  assert.equal(getYouTubeVideoId("https://youtube.com.evil.example/embed/dQw4w9WgXcQ"), "");
  assert.equal(getYouTubeVideoId("not-a-video!"), "");
  assert.equal(getYouTubeVideoId(undefined), "");
});

test("legacy ROX and VOYAH showcase entries remain separate from the brochure import", () => {
  assert.deepEqual(Array.from(legacyShowcaseVehicles, (vehicle) => vehicle.id), ["rox-01", "voyah-free"]);
  assert.ok(vehicles.every((vehicle) => !legacyShowcaseVehicles.some((legacy) => legacy.id === vehicle.id)));
  for (const vehicle of legacyShowcaseVehicles) {
    for (const image of [...vehicle.images, vehicle.fallbackImage].filter(Boolean)) {
      const imagePath = path.resolve(repositoryRoot, "automobile", image);
      assert.ok(fs.existsSync(imagePath), `${vehicle.name} image missing: ${image}`);
    }
  }
});
