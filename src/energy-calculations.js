function roundUp(value, increment) {
  return Math.ceil(value / increment) * increment;
}

function calculateEnergyEstimate({ appliances, assumptions }) {
  const connectedLoadW = appliances.reduce((total, appliance) =>
    total + appliance.quantity * appliance.watts, 0);
  const dailyWh = appliances.reduce((total, appliance) =>
    total + appliance.quantity * appliance.watts * appliance.hours, 0);
  const monthlyWh = dailyWh * assumptions.days;
  const backupWh = assumptions.backupHours === null
    ? null
    : connectedLoadW * assumptions.backupHours;
  const inverterW = roundUp(
    connectedLoadW * (1 + assumptions.designMargin / 100),
    500
  );
  const batteryUsableWh = backupWh === null
    ? null
    : backupWh / (assumptions.efficiency / 100);
  const batteryNominalWh = batteryUsableWh === null
    ? null
    : roundUp(batteryUsableWh / (assumptions.batteryUsable / 100), 500);
  const solarW = roundUp(
    dailyWh / assumptions.peakSunHours / (1 - assumptions.solarLosses / 100),
    100
  );

  return {
    connectedLoadW,
    dailyWh,
    monthlyWh,
    backupWh,
    inverterW,
    batteryUsableWh,
    batteryNominalWh,
    solarW
  };
}

function declaredCapacity(product, unitPattern, scale) {
  for (const specification of product.specifications) {
    if (/\b(?:mppt|pv input|pv power|array power|input power)\b/i.test(specification)) continue;
    const match = specification.match(unitPattern);
    if (match) return Number(match[1]) * scale(match[2]);
  }
  return null;
}

function productsWithDeclaredCapacity(products, category, unitPattern, scale, minimum, maximum) {
  return products
    .filter((product) => product.category === category)
    .map((product) => ({
      product,
      capacity: declaredCapacity(product, unitPattern, scale)
    }))
    .filter((entry) => Number.isFinite(entry.capacity)
      && entry.capacity >= minimum
      && entry.capacity <= maximum)
    .sort((left, right) => left.capacity - right.capacity || left.product.brand.localeCompare(right.product.brand))
    .slice(0, 3);
}

function recommendEnergyProducts(products, estimate) {
  const inverters = productsWithDeclaredCapacity(
    products.filter((product) => /\binverter\b/i.test(`${product.name} ${product.description}`)),
    "solar-inverters",
    /(\d+(?:\.\d+)?)\s*(kW|W)\b/i,
    (unit) => unit.toLowerCase() === "kw" ? 1000 : 1,
    estimate.inverterW,
    estimate.inverterW * 2
  );
  const batteries = estimate.batteryNominalWh === null ? [] : productsWithDeclaredCapacity(
    products,
    "batteries-storage",
    /(\d+(?:\.\d+)?)\s*kWh\b/i,
    () => 1000,
    estimate.batteryNominalWh,
    estimate.batteryNominalWh * 2
  );
  const panels = estimate.solarW <= 0 ? [] : products
    .filter((product) => product.category === "solar-panels")
    .map((product) => {
      const capacity = declaredCapacity(product, /(\d{3,4})\s*W\b/i, () => 1);
      if (!Number.isFinite(capacity)) return null;
      const quantity = Math.ceil(estimate.solarW / capacity);
      const arrayCapacity = quantity * capacity;
      return { product, capacity, quantity, arrayCapacity };
    })
    .filter((entry) => entry && entry.arrayCapacity <= estimate.solarW * 1.25)
    .sort((left, right) => left.arrayCapacity - right.arrayCapacity || left.capacity - right.capacity)
    .slice(0, 1);

  return { inverters, batteries, panels };
}

function recommendSolarPackages(packages, estimate) {
  const comparisons = packages.map((solarPackage) => {
    const solarArrayW = solarPackage.panelCount * solarPackage.panelWatts;
    const inverterMeets = solarPackage.inverterWatts >= estimate.inverterW;
    const solarMeets = solarArrayW >= estimate.solarW;
    const batteryStatus = estimate.batteryNominalWh === null
      ? "not-required"
      : solarPackage.batteryNominalWh === null
        ? "undocumented"
        : solarPackage.batteryNominalWh >= estimate.batteryNominalWh
          ? "meets"
          : "below";
    return {
      package: solarPackage,
      solarArrayW,
      inverterMeets,
      solarMeets,
      batteryStatus,
      recommended: inverterMeets && solarMeets && ["not-required", "meets"].includes(batteryStatus)
    };
  });
  const compareFit = (left, right) => {
    const leftExcess = (left.package.inverterWatts - estimate.inverterW) / Math.max(estimate.inverterW, 1)
      + (left.solarArrayW - estimate.solarW) / Math.max(estimate.solarW, 1)
      + (estimate.batteryNominalWh === null || !left.package.batteryNominalWh
        ? 0
        : (left.package.batteryNominalWh - estimate.batteryNominalWh) / Math.max(estimate.batteryNominalWh, 1));
    const rightExcess = (right.package.inverterWatts - estimate.inverterW) / Math.max(estimate.inverterW, 1)
      + (right.solarArrayW - estimate.solarW) / Math.max(estimate.solarW, 1)
      + (estimate.batteryNominalWh === null || !right.package.batteryNominalWh
        ? 0
        : (right.package.batteryNominalWh - estimate.batteryNominalWh) / Math.max(estimate.batteryNominalWh, 1));
    return leftExcess - rightExcess || left.package.id.localeCompare(right.package.id);
  };
  const compareProximity = (left, right) => {
    const distance = (entry) => Math.abs(entry.package.inverterWatts - estimate.inverterW) / Math.max(estimate.inverterW, 1)
      + Math.abs(entry.solarArrayW - estimate.solarW) / Math.max(estimate.solarW, 1)
      + (estimate.batteryNominalWh === null || !entry.package.batteryNominalWh
        ? 0
        : Math.abs(entry.package.batteryNominalWh - estimate.batteryNominalWh) / Math.max(estimate.batteryNominalWh, 1));
    return distance(left) - distance(right) || left.package.id.localeCompare(right.package.id);
  };
  const recommended = comparisons.filter((entry) => entry.recommended).sort(compareFit);
  const explore = comparisons.filter((entry) => !entry.recommended).sort((left, right) => {
    const leftCovered = Number(left.inverterMeets) + Number(left.solarMeets) + Number(["not-required", "meets"].includes(left.batteryStatus));
    const rightCovered = Number(right.inverterMeets) + Number(right.solarMeets) + Number(["not-required", "meets"].includes(right.batteryStatus));
    return rightCovered - leftCovered || compareProximity(left, right);
  });
  return { recommended, explore };
}

window.ElectronyEnergyCalculations = Object.freeze({
  calculateEnergyEstimate,
  recommendEnergyProducts,
  recommendSolarPackages
});
