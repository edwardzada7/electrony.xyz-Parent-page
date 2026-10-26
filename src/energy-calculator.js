const applianceDefaults = Object.freeze([
  { type: "led-bulb", quantity: 1, hours: 5 }
]);

const applianceRows = document.querySelector("#energy-appliance-rows");
const applianceTemplate = document.querySelector("#energy-appliance-template");
const calculatorValidation = document.querySelector("#energy-calculator-validation");
const calculatorResults = document.querySelector("#energy-calculator-results");
const breakdownBody = document.querySelector("#energy-appliance-breakdown");
const recommendationProducts = document.querySelector("#energy-recommendation-products");
const recommendationFallback = document.querySelector("#energy-recommendation-fallback");
const calculatorRecommendedPackageGrid = document.querySelector("#energy-recommended-packages");
const calculatorExplorePackageGrid = document.querySelector("#energy-explore-packages");
const calculatorExplorePackageWrap = document.querySelector("#energy-packages-to-explore");
const calculatorPackageRecommendationEmpty = document.querySelector("#energy-package-recommendation-empty");
const catalogueProducts = window.ElectronyEnergyProducts;
const runEnergyEstimate = window.ElectronyEnergyCalculations.calculateEnergyEstimate;
const recommendEnergyCatalogItems = window.ElectronyEnergyCalculations.recommendEnergyProducts;
const calculatorAssumptions = {
  days: document.querySelector("#energy-month-days"),
  backupHours: document.querySelector("#energy-backup-hours"),
  designMargin: document.querySelector("#energy-design-margin"),
  batteryUsable: document.querySelector("#energy-battery-usable"),
  efficiency: document.querySelector("#energy-system-efficiency"),
  peakSunHours: document.querySelector("#energy-peak-sun-hours"),
  solarLosses: document.querySelector("#energy-solar-losses")
};
let nextApplianceId = 0;
let hasCalculated = false;

const resultElements = {
  load: document.querySelector("#energy-result-load"),
  daily: document.querySelector("#energy-result-daily"),
  dailyDetail: document.querySelector("#energy-result-daily-detail"),
  monthly: document.querySelector("#energy-result-monthly"),
  monthlyDetail: document.querySelector("#energy-result-monthly-detail"),
  backup: document.querySelector("#energy-result-backup"),
  backupDetail: document.querySelector("#energy-result-backup-detail"),
  inverter: document.querySelector("#energy-result-inverter"),
  inverterAssumption: document.querySelector("#energy-result-inverter-assumption"),
  battery: document.querySelector("#energy-result-battery"),
  batteryAssumption: document.querySelector("#energy-result-battery-assumption"),
  solar: document.querySelector("#energy-result-solar"),
  solarAssumption: document.querySelector("#energy-result-solar-assumption")
};

function formatEnergyNumber(value, maximumFractionDigits = 2) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits }).format(value);
}

function setInvalid(input, invalid) {
  input.setAttribute("aria-invalid", String(invalid));
}

function rowInput(row, selector, label, min, max, integer = false) {
  const input = row.querySelector(selector);
  const value = input.value.trim() ? input.valueAsNumber : Number.NaN;
  const invalid = !Number.isFinite(value)
    || value < min
    || value > max
    || (integer && !Number.isInteger(value))
    || !input.validity.valid;
  setInvalid(input, invalid);
  return {
    value,
    invalid,
    message: invalid ? `${label} must be ${integer ? "a whole number " : ""}from ${min} to ${max}.` : ""
  };
}

function assumptionInput(input, label) {
  if (input === calculatorAssumptions.backupHours && !input.value.trim()) {
    setInvalid(input, false);
    return { value: null, invalid: false, message: "" };
  }
  const minimum = Number(input.min);
  const maximum = Number(input.max);
  const integer = input.step === "1";
  const value = input.value.trim() ? input.valueAsNumber : Number.NaN;
  const invalid = !Number.isFinite(value)
    || value < minimum
    || value > maximum
    || (integer && !Number.isInteger(value))
    || !input.validity.valid;
  setInvalid(input, invalid);
  return {
    value,
    invalid,
    message: invalid ? `${label} must be ${integer ? "a whole number " : ""}from ${minimum} to ${maximum}.` : ""
  };
}

function clearResults() {
  Object.values(resultElements).forEach((element) => {
    element.textContent = "—";
  });
  breakdownBody.replaceChildren();
  recommendationProducts.replaceChildren();
  calculatorRecommendedPackageGrid.replaceChildren();
  calculatorExplorePackageGrid.replaceChildren();
  calculatorExplorePackageWrap.hidden = true;
  calculatorPackageRecommendationEmpty.hidden = true;
  recommendationFallback.textContent = "";
  window.ElectronyEnergyCalculationSummary = "";
}

function createBreakdownCell(row, value, isHeading = false) {
  const cell = document.createElement(isHeading ? "th" : "td");
  if (isHeading) cell.scope = "row";
  cell.textContent = value;
  row.appendChild(cell);
}

function updateBreakdown(appliances) {
  breakdownBody.replaceChildren();
  if (!appliances.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent = "Add an appliance to see its energy breakdown.";
    row.appendChild(cell);
    breakdownBody.appendChild(row);
    return;
  }

  appliances.forEach((appliance) => {
    const row = document.createElement("tr");
    createBreakdownCell(row, appliance.name, true);
    createBreakdownCell(row, formatEnergyNumber(appliance.quantity, 0));
    createBreakdownCell(row, `${formatEnergyNumber(appliance.watts)} W`);
    createBreakdownCell(row, formatEnergyNumber(appliance.hours));
    createBreakdownCell(row, `${formatEnergyNumber(appliance.dailyWh)} Wh / ${formatEnergyNumber(appliance.dailyWh / 1000)} kWh`);
    breakdownBody.appendChild(row);
  });
}

function setCalculatorStatus(messages = [], success = false) {
  calculatorValidation.classList.toggle("is-success", success);
  calculatorValidation.textContent = messages.join(" ");
}

function createRecommendationCard({ product, capacity, label, reason }) {
  const card = document.createElement("article");
  card.className = "energy-recommendation-card";
  const brand = document.createElement("p");
  brand.className = "energy-recommendation-card__brand";
  brand.textContent = product.brand;
  const title = document.createElement("h4");
  title.textContent = product.model ? `${product.name} — ${product.model}` : product.name;
  const rating = document.createElement("p");
  rating.className = "energy-recommendation-card__rating";
  rating.textContent = `${label}: ${formatEnergyNumber(capacity / 1000)} ${label === "Listed nominal capacity" ? "kWh" : "kW"}`;
  const explanation = document.createElement("p");
  explanation.textContent = reason;
  const description = document.createElement("p");
  description.textContent = product.description;
  const actions = document.createElement("div");
  actions.className = "energy-recommendation-card__actions";
  const details = document.createElement("button");
  details.className = "energy-product-card__details";
  details.type = "button";
  details.dataset.productDetails = product.id;
  details.textContent = "View product";
  const quote = document.createElement("button");
  quote.className = "energy-product-card__enquire";
  quote.type = "button";
  quote.dataset.requestProduct = product.id;
  quote.textContent = "Request a quote";
  actions.append(details, quote);
  card.append(brand, title, rating, explanation, description, actions);
  return card;
}

function renderRecommendations(result) {
  recommendationProducts.replaceChildren();
  const recommendationMessages = [];
  const {
    inverters: inverterMatches,
    batteries: batteryMatches,
    panels: panelMatches
  } = recommendEnergyCatalogItems(catalogueProducts, result);

  if (inverterMatches.length) {
    inverterMatches.forEach((entry) => recommendationProducts.appendChild(createRecommendationCard({
      ...entry,
      label: "Listed inverter rating",
      reason: `Its listed rating is at least the ${formatEnergyNumber(result.inverterW)} W estimate and no more than twice that value. Starting surge, phase and system compatibility are not established.`
    })));
  } else {
    recommendationMessages.push("No inverter entry has a readable stated rating from the estimate up to twice its size; ask Electrony to review the requirement.");
  }

  if (result.batteryNominalWh === null) {
    recommendationMessages.push("Battery sizing was skipped because no backup duration was entered.");
  } else if (batteryMatches.length) {
    batteryMatches.forEach((entry) => recommendationProducts.appendChild(createRecommendationCard({
      ...entry,
      label: "Listed nominal capacity",
      reason: `Its stated nominal capacity is at least the ${formatEnergyNumber(result.batteryNominalWh / 1000)} kWh estimate and no more than twice that value. Voltage, usable fraction and compatibility need confirmation.`
    })));
  } else {
    recommendationMessages.push("No battery entry has a readable stated capacity from the estimate up to twice its size; request a system consultation rather than assuming a match.");
  }

  if (result.solarW === 0) {
    recommendationMessages.push("Solar-array matching needs a daily energy estimate above zero.");
  } else if (panelMatches.length) {
    const panel = panelMatches[0];
    recommendationProducts.appendChild(createRecommendationCard({
      ...panel,
      label: "Listed panel rating",
      reason: `${formatEnergyNumber(panel.quantity, 0)} panels at this listed rating total ${formatEnergyNumber(panel.arrayCapacity)} W, up to 25% above the ${formatEnergyNumber(result.solarW)} W array estimate. String design and equipment compatibility are not established.`
    }));
  } else {
    recommendationMessages.push("No solar-panel entry with a readable stated wattage could be matched to this array estimate.");
  }
  recommendationFallback.textContent = recommendationMessages.join(" ");
}

function calculateEnergy() {
  const errors = [];
  const appliances = [];
  [...applianceRows.querySelectorAll(".energy-calculator__appliance-row")].forEach((row) => {
    const nameInput = row.querySelector("[data-appliance-name]");
    const watts = rowInput(row, "[data-appliance-watts]", "Watts per appliance", 1, 100000);
    const quantity = rowInput(row, "[data-appliance-quantity]", "Quantity", 1, 10000, true);
    const hours = rowInput(row, "[data-appliance-hours]", "Hours per day", 0, 24);
    const name = nameInput.value.trim();
    const nameInvalid = !name;
    setInvalid(nameInput, nameInvalid);
    row.querySelector(".energy-calculator__remove").setAttribute(
      "aria-label",
      name ? `Remove ${name}` : "Remove this appliance"
    );
    if (nameInvalid) errors.push("Appliance names cannot be blank.");
    [watts, quantity, hours].forEach((result) => {
      if (result.invalid) errors.push(result.message);
    });
    if (watts.invalid || quantity.invalid || hours.invalid || nameInvalid) return;
    const dailyWh = quantity.value * watts.value * hours.value;
    if (!Number.isFinite(dailyWh)) {
      errors.push("One or more appliance energy values are too large.");
      return;
    }
    appliances.push({
      name,
      watts: watts.value,
      quantity: quantity.value,
      hours: hours.value,
      loadW: watts.value * quantity.value,
      dailyWh
    });
  });
  if (!appliances.length && !errors.length) {
    errors.push("Add at least one appliance before calculating your power needs.");
  }

  const assumptions = {};
  const assumptionLabels = {
    days: "Monthly estimate days",
    backupHours: "Backup period",
    designMargin: "Inverter design margin",
    batteryUsable: "Usable battery capacity",
    efficiency: "Inverter / system efficiency",
    peakSunHours: "Peak-sun-hours assumption",
    solarLosses: "Solar system derating"
  };
  Object.entries(calculatorAssumptions).forEach(([key, input]) => {
    const result = assumptionInput(input, assumptionLabels[key]);
    assumptions[key] = result.value;
    if (result.invalid) errors.push(result.message);
  });

  if (errors.length) {
    clearResults();
    calculatorResults.hidden = true;
    setCalculatorStatus([...new Set(errors)].slice(0, 4).concat(errors.length > 4 ? ["Correct the highlighted values to update estimates."] : []));
    updateBreakdown([]);
    return null;
  }

  const estimate = runEnergyEstimate({ appliances, assumptions });
  const {
    connectedLoadW,
    dailyWh,
    monthlyWh,
    backupWh,
    inverterW,
    batteryUsableWh,
    batteryNominalWh,
    solarW
  } = estimate;
  const numericResults = [connectedLoadW, dailyWh, monthlyWh, inverterW, solarW, batteryUsableWh, batteryNominalWh].filter((value) => value !== null);
  if (numericResults.some((value) => !Number.isFinite(value))) {
    clearResults();
    calculatorResults.hidden = true;
    setCalculatorStatus(["Values are too large to calculate safely. Reduce one or more inputs."]);
    updateBreakdown([]);
    return null;
  }

  const result = {
    appliances,
    assumptions,
    connectedLoadW,
    dailyWh,
    monthlyWh,
    backupWh,
    inverterW,
    batteryUsableWh,
    batteryNominalWh,
    solarW
  };
  resultElements.load.textContent = `${formatEnergyNumber(connectedLoadW)} W (${formatEnergyNumber(connectedLoadW / 1000)} kW)`;
  resultElements.daily.textContent = `${formatEnergyNumber(dailyWh, 0)} Wh`;
  resultElements.dailyDetail.textContent = `${formatEnergyNumber(dailyWh / 1000)} kWh per day`;
  resultElements.monthly.textContent = `${formatEnergyNumber(monthlyWh / 1000)} kWh`;
  resultElements.monthlyDetail.textContent = `${formatEnergyNumber(monthlyWh)} Wh over ${formatEnergyNumber(assumptions.days, 0)} days`;
  resultElements.backup.textContent = backupWh === null ? "Not estimated" : `${formatEnergyNumber(backupWh, 0)} Wh`;
  resultElements.backupDetail.textContent = backupWh === null
    ? "Enter a backup duration to estimate battery requirements."
    : `${formatEnergyNumber(backupWh / 1000)} kWh over ${formatEnergyNumber(assumptions.backupHours)} h at full connected load`;
  resultElements.inverter.textContent = `${formatEnergyNumber(inverterW)} W (${formatEnergyNumber(inverterW / 1000)} kW)`;
  resultElements.inverterAssumption.textContent = `${formatEnergyNumber(connectedLoadW)} W × (1 + ${formatEnergyNumber(assumptions.designMargin)}% margin), rounded up to the next 500 W. Starting surges are excluded.`;
  resultElements.battery.textContent = batteryNominalWh === null
    ? "Enter a backup duration"
    : `${formatEnergyNumber(batteryNominalWh / 1000)} kWh nominal`;
  resultElements.batteryAssumption.textContent = batteryUsableWh === null
    ? "No battery size is calculated until you enter backup hours."
    : `${formatEnergyNumber(batteryUsableWh / 1000)} kWh usable energy ÷ ${formatEnergyNumber(assumptions.batteryUsable)}% usable fraction; includes ${formatEnergyNumber(assumptions.efficiency)}% inverter efficiency. Nominal size rounded up to 0.5 kWh.`;
  resultElements.solar.textContent = `${formatEnergyNumber(solarW)} W (${formatEnergyNumber(solarW / 1000)} kW)`;
  resultElements.solarAssumption.textContent = `${formatEnergyNumber(dailyWh)} Wh/day ÷ (${formatEnergyNumber(assumptions.peakSunHours)} peak-sun-hours × ${formatEnergyNumber(100 - assumptions.solarLosses)}% system yield), rounded up to 100 W.`;
  updateBreakdown(appliances);
  renderRecommendations(result);
  renderSolarPackageRecommendations(result);
  window.ElectronyEnergyCalculationSummary = createEnquirySummary(result);
  calculatorResults.hidden = false;
  setCalculatorStatus();
  return result;
}

function addAppliance({ type = "led-bulb", quantity = 1, hours = 1 } = {}) {
  const row = applianceTemplate.content.firstElementChild.cloneNode(true);
  const id = `energy-appliance-${nextApplianceId++}`;
  const typeSelect = row.querySelector("[data-appliance-type]");
  const selectedOption = [...typeSelect.options].find((option) => option.value === type) || typeSelect.options[0];
  typeSelect.value = selectedOption.value;
  const nameInput = row.querySelector("[data-appliance-name]");
  const wattsInput = row.querySelector("[data-appliance-watts]");
  const quantityInput = row.querySelector("[data-appliance-quantity]");
  const hoursInput = row.querySelector("[data-appliance-hours]");
  nameInput.value = selectedOption.dataset.name;
  wattsInput.value = selectedOption.dataset.watts;
  quantityInput.value = quantity;
  hoursInput.value = hours;

  [
    [typeSelect, "type"],
    [nameInput, "name"],
    [wattsInput, "watts"],
    [quantityInput, "quantity"],
    [hoursInput, "hours"]
  ].forEach(([input, suffix]) => {
    const inputId = `${id}-${suffix}`;
    input.id = inputId;
    input.closest(".energy-calculator__field").querySelector("label").htmlFor = inputId;
  });
  applianceRows.appendChild(row);
  if (hasCalculated) calculateEnergy();
  return row;
}

function resetCalculator() {
  hasCalculated = false;
  applianceRows.replaceChildren();
  calculatorAssumptions.days.value = "30";
  calculatorAssumptions.backupHours.value = "";
  calculatorAssumptions.designMargin.value = "25";
  calculatorAssumptions.batteryUsable.value = "80";
  calculatorAssumptions.efficiency.value = "90";
  calculatorAssumptions.peakSunHours.value = "5";
  calculatorAssumptions.solarLosses.value = "20";
  Object.values(calculatorAssumptions).forEach((input) => setInvalid(input, false));
  applianceDefaults.forEach((appliance) => addAppliance(appliance));
  clearResults();
  calculatorResults.hidden = true;
  setCalculatorStatus();
}

function createEnquirySummary(calculation) {
  const applianceLines = calculation.appliances.map((appliance) =>
    `- ${appliance.name}: ${formatEnergyNumber(appliance.quantity, 0)} × ${formatEnergyNumber(appliance.watts)} W × ${formatEnergyNumber(appliance.hours)} h/day = ${formatEnergyNumber(appliance.dailyWh)} Wh/day`
  );
  const compactApplianceLines = calculation.appliances.map((appliance) =>
    `- ${appliance.name}: ${formatEnergyNumber(appliance.quantity, 0)} × ${formatEnergyNumber(appliance.watts)} W, ${formatEnergyNumber(appliance.hours)} h/day`
  );
  const assumptions = calculation.assumptions;
  const buildSummary = (lines, omitted = 0) => [
    "Energy Calculator results (preliminary estimates)",
    "",
    "Appliances:",
    ...(lines.length ? lines : ["- No appliances added"]),
    ...(omitted ? [`- ${omitted} additional appliance row(s) omitted to fit the enquiry form limit.`] : []),
    "",
    `Connected load: ${formatEnergyNumber(calculation.connectedLoadW)} W`,
    `Daily consumption: ${formatEnergyNumber(calculation.dailyWh)} Wh (${formatEnergyNumber(calculation.dailyWh / 1000)} kWh)`,
    `Monthly consumption: ${formatEnergyNumber(calculation.monthlyWh)} Wh (${formatEnergyNumber(calculation.monthlyWh / 1000)} kWh over ${formatEnergyNumber(assumptions.days, 0)} days)`,
    ...(assumptions.backupHours === null
      ? ["Backup period: not supplied; battery sizing was not calculated."]
      : [`Backup period: ${formatEnergyNumber(assumptions.backupHours)} h; energy at full connected load: ${formatEnergyNumber(calculation.backupWh)} Wh (${formatEnergyNumber(calculation.backupWh / 1000)} kWh)`]),
    "",
    `Preliminary inverter capacity: ${formatEnergyNumber(calculation.inverterW)} W; connected load plus ${formatEnergyNumber(assumptions.designMargin)}% design margin, rounded up to 500 W.`,
    ...(calculation.batteryNominalWh === null
      ? []
      : [
        `Estimated usable battery energy: ${formatEnergyNumber(calculation.batteryUsableWh / 1000)} kWh.`,
        `Preliminary battery nominal capacity: ${formatEnergyNumber(calculation.batteryNominalWh / 1000)} kWh; based on ${formatEnergyNumber(assumptions.batteryUsable)}% usable fraction and ${formatEnergyNumber(assumptions.efficiency)}% inverter efficiency.`
      ]),
    `Preliminary solar array capacity: ${formatEnergyNumber(calculation.solarW)} W; based on ${formatEnergyNumber(assumptions.peakSunHours)} assumed peak-sun-hours/day and ${formatEnergyNumber(assumptions.solarLosses)}% system derating.`,
    "",
    "These are planning estimates, not an engineering design. Starting surges, battery specifications, location, shading, orientation, weather and seasonal conditions affect final system selection."
  ].join("\n");

  const summaryLimit = 4000;
  const fullSummary = buildSummary(applianceLines);
  if (fullSummary.length <= summaryLimit) return fullSummary;

  const compactSummary = buildSummary(compactApplianceLines);
  if (compactSummary.length <= summaryLimit) return compactSummary;

  let includedLines = [];
  for (const line of compactApplianceLines) {
    const candidateLines = [...includedLines, line];
    const omitted = compactApplianceLines.length - candidateLines.length;
    if (buildSummary(candidateLines, omitted).length > summaryLimit) break;
    includedLines = candidateLines;
  }
  return buildSummary(includedLines, compactApplianceLines.length - includedLines.length);
}

applianceRows.addEventListener("input", () => {
  if (hasCalculated) calculateEnergy();
});
applianceRows.addEventListener("change", (event) => {
  if (event.target.matches("[data-appliance-type]")) {
    const row = event.target.closest(".energy-calculator__appliance-row");
    const option = event.target.selectedOptions[0];
    row.querySelector("[data-appliance-name]").value = option.dataset.name;
    row.querySelector("[data-appliance-watts]").value = option.dataset.watts;
  }
  if (hasCalculated) calculateEnergy();
});
applianceRows.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".energy-calculator__remove");
  if (!removeButton) return;
  removeButton.closest(".energy-calculator__appliance-row").remove();
  if (hasCalculated) calculateEnergy();
});
Object.values(calculatorAssumptions).forEach((input) => {
  input.addEventListener("input", () => {
    if (hasCalculated) calculateEnergy();
  });
  input.addEventListener("change", () => {
    if (hasCalculated) calculateEnergy();
  });
});
document.querySelector("#energy-appliance-add").addEventListener("click", () => {
  const row = addAppliance();
  row.querySelector("[data-appliance-name]").focus();
});
document.querySelector("#energy-calculator-reset").addEventListener("click", resetCalculator);
document.querySelector("#energy-calculate").addEventListener("click", () => {
  hasCalculated = true;
  calculateEnergy();
  if (!calculatorResults.hidden) {
    calculatorResults.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
  } else {
    const invalidInput = applianceRows.querySelector('[aria-invalid="true"]')
      || Object.values(calculatorAssumptions).find((input) => input.getAttribute("aria-invalid") === "true");
    (invalidInput || document.querySelector("#energy-appliance-add")).focus();
  }
});

document.querySelector("#energy-results-enquiry").addEventListener("click", () => {
  hasCalculated = true;
  const calculation = calculateEnergy();
  if (!calculation) {
    const invalidInput = applianceRows.querySelector('[aria-invalid="true"]')
      || Object.values(calculatorAssumptions).find((input) => input.getAttribute("aria-invalid") === "true");
    (invalidInput || document.querySelector("#energy-appliance-add")).focus();
    return;
  }

  const form = document.querySelector("#energy-quote-form");
  const category = form.querySelector("#energy-category");
  const product = form.querySelector("#energy-product");
  const message = form.querySelector("#energy-requirements");
  category.value = "complete-systems";
  product.value = "Energy solution (calculator estimate)";
  message.value = createEnquirySummary(calculation);
  [category, product, message].forEach((field) => {
    field.dispatchEvent(new Event(field instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }));
  });
  document.querySelector("#energy-form-status").textContent = "";
  document.querySelector("#quote").scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start"
  });
  form.querySelector("#energy-name").focus({ preventScroll: true });
  setCalculatorStatus(["Your results have been added to the Energy enquiry form. Review and submit it when ready."], true);
});

resetCalculator();
