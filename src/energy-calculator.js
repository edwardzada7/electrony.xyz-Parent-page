const applianceDefaults = Object.freeze([
  { type: "led-bulb", quantity: 8, hours: 5 },
  { type: "fan", quantity: 2, hours: 8 },
  { type: "television", quantity: 1, hours: 5 },
  { type: "refrigerator", quantity: 1, hours: 24 }
]);

const applianceRows = document.querySelector("#energy-appliance-rows");
const applianceTemplate = document.querySelector("#energy-appliance-template");
const calculatorValidation = document.querySelector("#energy-calculator-validation");
const breakdownBody = document.querySelector("#energy-appliance-breakdown");
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

function calculateEnergy() {
  const errors = [];
  const appliances = [];
  [...applianceRows.querySelectorAll(".energy-calculator__appliance-row")].forEach((row) => {
    const nameInput = row.querySelector("[data-appliance-name]");
    const watts = rowInput(row, "[data-appliance-watts]", "Watts per appliance", 0, 100000);
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

  const assumptions = {};
  const assumptionLabels = {
    days: "Monthly estimate days",
    backupHours: "Backup period",
    designMargin: "Inverter design margin",
    batteryUsable: "Usable battery capacity",
    efficiency: "Inverter / system efficiency",
    peakSunHours: "Peak-sun-hours assumption",
    solarLosses: "Solar system losses"
  };
  Object.entries(calculatorAssumptions).forEach(([key, input]) => {
    const result = assumptionInput(input, assumptionLabels[key]);
    assumptions[key] = result.value;
    if (result.invalid) errors.push(result.message);
  });

  if (errors.length) {
    clearResults();
    setCalculatorStatus([...new Set(errors)].slice(0, 4).concat(errors.length > 4 ? ["Correct the highlighted values to update estimates."] : []));
    updateBreakdown([]);
    return null;
  }

  const connectedLoadW = appliances.reduce((total, appliance) => total + appliance.loadW, 0);
  const dailyWh = appliances.reduce((total, appliance) => total + appliance.dailyWh, 0);
  const monthlyWh = dailyWh * assumptions.days;
  const backupWh = connectedLoadW * assumptions.backupHours;
  const inverterW = connectedLoadW * (1 + assumptions.designMargin / 100);
  const batteryWh = backupWh / (assumptions.batteryUsable / 100) / (assumptions.efficiency / 100);
  const solarW = dailyWh / assumptions.peakSunHours / (1 - assumptions.solarLosses / 100);
  const numericResults = [connectedLoadW, dailyWh, monthlyWh, backupWh, inverterW, batteryWh, solarW];
  if (numericResults.some((value) => !Number.isFinite(value))) {
    clearResults();
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
    batteryWh,
    solarW
  };
  resultElements.load.textContent = `${formatEnergyNumber(connectedLoadW)} W`;
  resultElements.daily.textContent = `${formatEnergyNumber(dailyWh)} Wh`;
  resultElements.dailyDetail.textContent = `${formatEnergyNumber(dailyWh / 1000)} kWh per day`;
  resultElements.monthly.textContent = `${formatEnergyNumber(monthlyWh / 1000)} kWh`;
  resultElements.monthlyDetail.textContent = `${formatEnergyNumber(monthlyWh)} Wh over ${formatEnergyNumber(assumptions.days, 0)} days`;
  resultElements.backup.textContent = `${formatEnergyNumber(backupWh)} Wh`;
  resultElements.backupDetail.textContent = `${formatEnergyNumber(backupWh / 1000)} kWh over ${formatEnergyNumber(assumptions.backupHours)} h at full connected load`;
  resultElements.inverter.textContent = `${formatEnergyNumber(inverterW)} W (${formatEnergyNumber(inverterW / 1000)} kW)`;
  resultElements.inverterAssumption.textContent = `${formatEnergyNumber(connectedLoadW)} W connected load × (1 + ${formatEnergyNumber(assumptions.designMargin)}% margin). Starting surges are not included.`;
  resultElements.battery.textContent = `${formatEnergyNumber(batteryWh / 1000)} kWh`;
  resultElements.batteryAssumption.textContent = `${formatEnergyNumber(backupWh / 1000)} kWh backup energy ÷ (${formatEnergyNumber(assumptions.batteryUsable)}% usable × ${formatEnergyNumber(assumptions.efficiency)}% efficiency).`;
  resultElements.solar.textContent = `${formatEnergyNumber(solarW)} W (${formatEnergyNumber(solarW / 1000)} kW)`;
  resultElements.solarAssumption.textContent = `${formatEnergyNumber(dailyWh)} Wh/day ÷ (${formatEnergyNumber(assumptions.peakSunHours)} assumed h/day × ${formatEnergyNumber(100 - assumptions.solarLosses)}% system yield).`;
  updateBreakdown(appliances);
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
  calculateEnergy();
  return row;
}

function resetCalculator() {
  applianceRows.replaceChildren();
  calculatorAssumptions.days.value = "30";
  calculatorAssumptions.backupHours.value = "8";
  calculatorAssumptions.designMargin.value = "25";
  calculatorAssumptions.batteryUsable.value = "80";
  calculatorAssumptions.efficiency.value = "90";
  calculatorAssumptions.peakSunHours.value = "5";
  calculatorAssumptions.solarLosses.value = "20";
  applianceDefaults.forEach((appliance) => addAppliance(appliance));
  calculateEnergy();
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
    `Backup period: ${formatEnergyNumber(assumptions.backupHours)} h; estimated energy at full connected load: ${formatEnergyNumber(calculation.backupWh)} Wh (${formatEnergyNumber(calculation.backupWh / 1000)} kWh)`,
    "",
    `Preliminary inverter capacity: ${formatEnergyNumber(calculation.inverterW)} W; connected load plus ${formatEnergyNumber(assumptions.designMargin)}% design margin.`,
    `Preliminary battery nominal capacity: ${formatEnergyNumber(calculation.batteryWh / 1000)} kWh; based on ${formatEnergyNumber(assumptions.batteryUsable)}% usable capacity and ${formatEnergyNumber(assumptions.efficiency)}% inverter / system efficiency.`,
    `Preliminary solar array capacity: ${formatEnergyNumber(calculation.solarW)} W; based on ${formatEnergyNumber(assumptions.peakSunHours)} assumed peak-sun-hours/day and ${formatEnergyNumber(assumptions.solarLosses)}% system losses.`,
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

applianceRows.addEventListener("input", calculateEnergy);
applianceRows.addEventListener("change", (event) => {
  if (event.target.matches("[data-appliance-type]")) {
    const row = event.target.closest(".energy-calculator__appliance-row");
    const option = event.target.selectedOptions[0];
    row.querySelector("[data-appliance-name]").value = option.dataset.name;
    row.querySelector("[data-appliance-watts]").value = option.dataset.watts;
  }
  calculateEnergy();
});
applianceRows.addEventListener("click", (event) => {
  const removeButton = event.target.closest(".energy-calculator__remove");
  if (!removeButton) return;
  removeButton.closest(".energy-calculator__appliance-row").remove();
  calculateEnergy();
});
Object.values(calculatorAssumptions).forEach((input) => {
  input.addEventListener("input", calculateEnergy);
  input.addEventListener("change", calculateEnergy);
});
document.querySelector("#energy-appliance-add").addEventListener("click", () => {
  const row = addAppliance();
  row.querySelector("[data-appliance-name]").focus();
});
document.querySelector("#energy-calculator-reset").addEventListener("click", resetCalculator);

document.querySelector("#energy-results-enquiry").addEventListener("click", () => {
  const calculation = calculateEnergy();
  if (!calculation) {
    const invalidInput = applianceRows.querySelector('[aria-invalid="true"]')
      || Object.values(calculatorAssumptions).find((input) => input.getAttribute("aria-invalid") === "true");
    invalidInput?.focus();
    return;
  }

  const form = document.querySelector("#energy-quote-form");
  const category = form.querySelector("#energy-category");
  const product = form.querySelector("#energy-product");
  const message = form.querySelector("#energy-requirements");
  category.value = "complete-systems";
  product.value = "Solar and backup power solution (calculator estimate)";
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
