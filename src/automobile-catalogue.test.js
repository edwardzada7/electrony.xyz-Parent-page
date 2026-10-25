const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repositoryRoot = path.resolve(__dirname, "..");
const catalogueSource = fs.readFileSync(path.join(__dirname, "automobile-catalogue.js"), "utf8");
const browserContext = { window: {}, URL };
vm.runInNewContext(catalogueSource, browserContext, { filename: "automobile-catalogue.js" });

const { vehicles, legacyShowcaseVehicles, featuredVideos, getYouTubeVideoId } = browserContext.window.ElectronyAutomobileData;
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

test("contains each of the 13 brochure vehicles exactly once", () => {
  assert.equal(vehicles.length, 13);
  assert.deepEqual(Array.from(vehicles, (vehicle) => vehicle.name), expectedModels);
  assert.equal(new Set(vehicles.map((vehicle) => vehicle.id)).size, 13);
  for (const vehicle of vehicles) {
    assert.equal(vehicles.filter((candidate) => candidate.name === vehicle.name).length, 1);
  }
});

test("each brochure vehicle has sourced specs, source-page mapping and resolvable images", () => {
  for (const [index, vehicle] of vehicles.entries()) {
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
