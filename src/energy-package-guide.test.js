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
const packageGuides = context.window.ElectronySolarPackageGuides;

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

test("adds guides only for the specified base Medium, Large and Industrial packages", () => {
  assert.deepEqual(
    Array.from(packageGuides, ({ packageId }) => packageId),
    [
      "basic-small-home-office",
      "medium-home-office",
      "premium-executive-corporate",
      "heavy-commercial-industrial"
    ]
  );
  assert.equal(packageGuides.find(({ packageId }) => packageId === "medium-home-office-option-2"), undefined);
  assert.equal(packageGuides.find(({ packageId }) => packageId === "medium-home-office-option-3"), undefined);
  packageGuides.forEach((packageGuide) => {
    assert.match(packageGuide.disclaimer, /Appliance wattages, solar generation and battery backup figures are estimates/);
    assert.match(packageGuide.disclaimer, /qualified solar professional/);
  });
});

test("new appliance tables total 3,990 W, 6,180 W and 39,300 W", () => {
  const expectedTotals = [
    ["medium-home-office", 3990],
    ["premium-executive-corporate", 6180],
    ["heavy-commercial-industrial", 39300]
  ];

  expectedTotals.forEach(([packageId, expectedTotal]) => {
    const packageGuide = packageGuides.find((candidate) => candidate.packageId === packageId);
    const arithmeticTotal = packageGuide.everyday.items.reduce(
      (total, item) => total + Number(item.total.replace(/[^\d]/g, "")),
      0
    );
    assert.equal(arithmeticTotal, expectedTotal, packageId);
    assert.equal(Number(packageGuide.everyday.total.replace(/[^\d]/g, "")), expectedTotal, packageId);
  });
});

test("retains supplied battery, backup and phase-specific guidance", () => {
  const medium = packageGuides.find(({ packageId }) => packageId === "medium-home-office");
  assert.ok(medium.specifications.some(({ value }) => value === "5.12 kWh"));
  assert.ok(medium.specifications.some(({ value }) => value === "5.0 kWh"));
  assert.match(medium.backup.estimates[0].backup, /7 hours/);
  assert.match(medium.backup.estimates[1].backup, /2.5–3 hours/);
  assert.match(medium.backup.note, /same stated usable battery energy as the Small Home package/);

  const large = packageGuides.find(({ packageId }) => packageId === "premium-executive-corporate");
  assert.ok(large.specifications.some(({ value }) => value.includes("Single-Phase Hybrid Inverter")));
  assert.ok(large.specifications.some(({ value }) => value.includes("Approximately 15.2 kWh")));
  assert.match(large.avoid.note, /Single-phase only/);
  assert.ok(large.avoid.items.some((item) => item.includes("Three-phase commercial machinery")));

  const industrial = packageGuides.find(({ packageId }) => packageId === "heavy-commercial-industrial");
  assert.ok(industrial.specifications.some(({ value }) => value.includes("48 kWh nominal")));
  assert.ok(industrial.specifications.some(({ value }) => value.includes("Approximately 45.6 kWh")));
  assert.match(industrial.maximumLoad.warning, /16.6 kW per phase/);
  assert.match(industrial.avoid.note, /not for running a 40 kW factory load throughout the night/);
  assert.match(industrial.disclaimer, /Three-phase load balancing and motor-starting requirements require professional assessment/);
});
