const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const context = { window: {} };
vm.runInNewContext(
  fs.readFileSync(path.join(__dirname, "energy-package-guide.js"), "utf8"),
  context,
  { filename: "energy-package-guide.js" }
);
const guide = context.window.ElectronySmallHomeSolarGuide;

test("provides the specified small-home guide and technical ratings", () => {
  assert.equal(guide.packageId, "basic-small-home-office");
  assert.equal(guide.trigger, "How many things can the Small Home Solar Package 3.5kVA carry?");
  assert.deepEqual(
    Array.from(guide.specifications, ({ label, value }) => [label, value]),
    [
      ["Continuous inverter limit", "3,600 W"],
      ["Solar array capacity", "4,200 W"],
      ["Lithium battery capacity", "5.12 kWh"],
      ["Usable battery energy", "5.0 kWh"]
    ]
  );
  assert.equal(guide.maximumLoad.maximum, "Maximum continuous inverter load: 3,600 W.");
  assert.equal(guide.backup.energy, "Usable battery energy: 5.0 kWh (5,000 Wh).");
  assert.equal(guide.backup.estimates[0].backup, "9–10 hours");
  assert.equal(guide.backup.estimates[1].backup, "Approximately 3 hours");
});

test("sample appliance loads add to the stated 2,310 W total", () => {
  const arithmeticTotal = guide.everyday.items.reduce(
    (total, item) => total + Number(item.total.replace(/[^\d]/g, "")),
    0
  );
  assert.equal(arithmeticTotal, 2310);
  assert.equal(guide.everyday.total, "2,310 W");
  assert.match(guide.everyday.note, /including the optional AC/);
  assert.match(guide.everyday.note, /startup surges/);
});

test("includes individual heavy-load guidance and distinct avoid warnings", () => {
  assert.equal(guide.heavyAppliances.items.length, 5);
  assert.ok(guide.heavyAppliances.items.some((item) => item.name === "1 HP water pumping machine"));
  assert.ok(guide.heavyAppliances.items.some((item) => item.name === "Electric iron or electric kettle"));
  assert.ok(guide.avoid.items.some((item) => item.includes("Water heaters")));
  assert.ok(guide.avoid.items.some((item) => item.includes("2 HP or larger")));
  assert.match(guide.avoid.note, /startup surge and the combined load/);
});
