const packageSource = "Solar_Power_Solution_Packages.pdf";

function packageComponent(category, productId, quantity, details, unit = "unit") {
  return { category, productId, quantity, details, unit };
}

function enquiryComponent(category, manufacturer, model, quantity, details, unit = "unit") {
  return { category, manufacturer, model, quantity, details, unit };
}

function antaiMountingKit(setCount) {
  const parts = [
    ["antai-antairailcg010-01", "Mounting · rail", 4, "4.7 m rail"],
    ["antai-antaijoinercg037", "Mounting · rail joiner", 2, "Rail joiner"],
    ["antai-antaimidgn003-05", "Mounting · mid clamp", 14, "30/35 mm mid clamp"],
    ["antai-antaiendcg018-01", "Mounting · end clamp", 8, "30/35 mm end clamp"],
    ["antai-antailfeettyn353-01", "Mounting · L-foot", 16, "L-foot"],
    ["antai-antailugtyn16-01", "Mounting · grounding lug", 2, "Grounding lug"]
  ];
  return parts.map(([productId, category, quantityPerSet, details]) =>
    packageComponent(category, productId, quantityPerSet * setCount, `${details}; ${setCount} documented 8-panel mounting ${setCount === 1 ? "set" : "sets"}.`));
}

const packageCatalogueData = [
  {
    id: "basic-small-home-office",
    name: "Basic / Small Home & Office (3.6 kW System)",
    capacity: "3.6 kW",
    application: "Ideal for basic residential loads (fans, TV, fridge, lighting, laptops, and 1HP inverter AC).",
    inverterWatts: 3600,
    panelCount: 6,
    panelWatts: 585,
    batteryNominalWh: null,
    batterySummary: "1 lithium-ion battery, 48V; the source lists 5.12kWh/5.5kWh and two model names.",
    reviewNote: "The source pairs Growatt ABM5.5-A1-H / HOPE5L-B1 with 5.12kWh/5.5kWh. Confirm which battery model and capacity apply.",
    components: [
      packageComponent("Inverter", "growatt-sph-3600tl-bl-up", 1, "Hybrid 3.6kW, 2MPPT, single phase"),
      enquiryComponent("Battery", "GROWATT", "ABM5.5-A1-H / HOPE5L-B1 (source lists both)", 1, "5.12kWh/5.5kWh lithium-ion, 48V; exact model and capacity are unresolved."),
      packageComponent("Solar panels", "jinko-585n-72hl4-bd", 6, "585W bifacial half-cut"),
      ...antaiMountingKit(1),
      packageComponent("Protection", "suntree-sunacguard63a-230v", 1, "AC voltage guard 63A"),
      enquiryComponent("Protection", "SUNTREE", "AC breaker 32A (pole/model not specified)", 1, "AC breaker 32A; package source does not identify the pole configuration."),
      packageComponent("Distribution", "suntree-sundb6way", 1, "6-way DB plastic enclosure")
    ],
    source: { document: packageSource, page: 1 }
  },
  {
    id: "medium-home-office",
    name: "Medium Home / Medium Office (6 kW System)",
    capacity: "6 kW",
    application: "Ideal for standard households or medium offices (multiple refrigerators, freezers, 1.5HP–2HP inverter ACs, office PCs).",
    inverterWatts: 6000,
    panelCount: 10,
    panelWatts: 620,
    batteryNominalWh: 5500,
    batterySummary: "1 Growatt ABM5.5-A1-H, 5.5kWh, 48V lithium battery.",
    pricingNote: "The updated catalogue price for SIM 6000ES PLUS-H is for a battery-inclusive bundle, not this package's separately listed inverter + base; it is not used to avoid a model mismatch and double counting.",
    components: [
      enquiryComponent("Inverter", "GROWATT", "SIM6000ESPLUS-H + BASE", 1, "Integrated 6kW inverter system; the package does not specify the battery-inclusive catalogue bundle."),
      packageComponent("Battery", "growatt-abm-5-5-a1-h", 1, "5.5kWh, 48V lithium battery"),
      packageComponent("Solar panels", "jinko-620n-66hl4-bd", 10, "620W bifacial half-cut"),
      ...antaiMountingKit(2),
      enquiryComponent("Protection", "SUNTREE", "AC surge protector 20kA (voltage/pole variant not specified)", 1, "AC surge protection, 20kA; exact voltage and pole variant are not specified."),
      enquiryComponent("Protection", "SUNTREE", "DC isolator 32A (voltage/pole variant not specified)", 1, "DC isolator 32A; exact voltage and pole variant are not specified."),
      packageComponent("Distribution", "suntree-sundb12way", 1, "12-way DB enclosure box")
    ],
    source: { document: packageSource, page: 1 }
  },
  {
    id: "premium-executive-corporate",
    name: "Premium Executive Home / Corporate Office (8 kW – 10 kW System)",
    capacity: "8–10 kW",
    application: "Designed for high-demand residential usage (multiple air conditioners, water pumps) or medium enterprise offices.",
    inverterWatts: 8000,
    panelCount: 12,
    panelWatts: 720,
    batteryNominalWh: 16000,
    batterySummary: "1 Deye BATSE-F16-C, 16kWh low-voltage lithium battery (48V).",
    components: [
      enquiryComponent("Inverter", "DEYE", "8K-SG04LP3-EU", 1, "8kW, 3-phase, low-voltage hybrid inverter; this exact model has no confirmed price in the updated list."),
      packageComponent("Battery", "deye-batse-f16-c", 1, "16kWh low-voltage lithium battery (48V)"),
      enquiryComponent("Solar panels", "JINKO", "720N-66HL5-BD", 12, "720W bifacial half-cut; this exact panel model has no confirmed price in the updated list."),
      enquiryComponent("Mounting", "ANTAI", "Mounting Kit + Accessories", 2, "Rail sets + mid/end clamps; exact kit composition/model is not specified."),
      packageComponent("Accessories", "huawei-ats-63a", 1, "Auto transfer switch 63A, 3-phase"),
      enquiryComponent("Protection", "SUNTREE", "AC MCCB 100A (pole/model not specified)", 1, "AC MCCB 100A; pole configuration is not specified."),
      enquiryComponent("Protection", "SUNTREE", "DC surge protector (rating/model not specified)", 1, "DC surge protector; voltage and model are not specified.")
    ],
    source: { document: packageSource, page: 2 }
  },
  {
    id: "heavy-commercial-industrial",
    name: "Heavy Commercial / Industrial Setup (50 kW System)",
    capacity: "50 kW",
    application: "Designed for factories, commercial complexes, large corporate headquarters, or mini-grids.",
    inverterWatts: 50000,
    panelCount: 70,
    panelWatts: 725,
    batteryNominalWh: 48000,
    batterySummary: "3 Deye BOS-B-PACK16 high-voltage battery packs, 16kWh each (48kWh total as listed capacity).",
    components: [
      packageComponent("Inverter", "deye-50k-sg01hp3-e", 1, "50kW, 3-phase, high-voltage hybrid inverter"),
      packageComponent("Battery", "deye-bos-b-pack16", 3, "HV battery pack 16kWh B-PRO"),
      packageComponent("Battery control", "deye-control-box-hv-bos-b-pdu-2-a", 1, "BOS-B-PRO16KWH control box-ACC"),
      packageComponent("Battery rack", "deye-deyerack-3u-h", 1, "13-layer rack for HV battery"),
      packageComponent("Solar panels", "jinko-725n-66hl5-bd", 70, "725W bifacial half-cut"),
      ...antaiMountingKit(9),
      packageComponent("Protection / MCCB", "suntree-sunacmccb250a-4p", 1, "AC MCCB 250A, 4-pole")
    ],
    source: { document: packageSource, page: 2 }
  }
];

window.ElectronySolarPackages = Object.freeze(packageCatalogueData.map((solarPackage) => Object.freeze({
  ...solarPackage,
  components: Object.freeze(solarPackage.components.map((component) => Object.freeze(component))),
  source: Object.freeze(solarPackage.source)
})));
