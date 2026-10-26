const packageSource = "Solar_Power_Solution_Packages.pdf";

const packageCatalogueData = [
  {
    id: "basic-small-home-office",
    name: "Basic / Small Home & Office (3.6 kW System)",
    application: "Ideal for basic residential loads (fans, TV, fridge, lighting, laptops, and 1HP inverter AC).",
    inverterWatts: 3600,
    panelCount: 6,
    panelWatts: 585,
    batteryNominalWh: null,
    batterySummary: "1 lithium-ion battery, 48V; the source lists 5.12kWh/5.5kWh and two model names.",
    reviewNote: "The source pairs Growatt ABM5.5-A1-H / HOPE5L-B1 with 5.12kWh/5.5kWh. Confirm which battery model and capacity apply.",
    components: [
      { category: "Inverter", model: "Growatt SPH3600TL-BL-UP", details: "Hybrid 3.6kW, 2MPPT, single phase", quantity: "1" },
      { category: "Battery", model: "Growatt ABM5.5-A1-H / HOPE5L-B1", details: "5.12kWh/5.5kWh lithium-ion, 48V", quantity: "1" },
      { category: "Solar panels", model: "Jinko 585N-72HL4-BD", details: "585W bifacial half-cut", quantity: "6" },
      { category: "Mounting", model: "Antai PV Roof Mounting Set", details: "Rail kit for 8 solar panels", quantity: "1" },
      { category: "Protections", model: "Suntree AC Guard / AC Breaker", details: "AC voltage guard 63A + AC breaker 32A", quantity: "1 set" },
      { category: "Distribution", model: "Suntree SUNDB6WAY", details: "6-way DB plastic enclosure", quantity: "1" }
    ],
    source: { document: packageSource, page: 1 }
  },
  {
    id: "medium-home-office",
    name: "Medium Home / Medium Office (6 kW System)",
    application: "Ideal for standard households or medium offices (multiple refrigerators, freezers, 1.5HP–2HP inverter ACs, office PCs).",
    inverterWatts: 6000,
    panelCount: 10,
    panelWatts: 620,
    batteryNominalWh: 5500,
    batterySummary: "1 Growatt ABM5.5-A1-H, 5.5kWh, 48V lithium battery.",
    components: [
      { category: "Inverter", model: "Growatt SIM6000ESPLUS-H + BASE", details: "Integrated 6kW inverter system", quantity: "1" },
      { category: "Battery", model: "Growatt ABM5.5-A1-H", details: "5.5kWh, 48V lithium battery", quantity: "1" },
      { category: "Solar panels", model: "Jinko 620N-66HL4-BD", details: "620W bifacial half-cut", quantity: "10" },
      { category: "Mounting", model: "Antai PV Roof Mounting Set", details: "Rail kit for solar panels", quantity: "2" },
      { category: "Protections", model: "Suntree AC/DC Protection Kit", details: "AC surge 20KA + DC isolator 32A", quantity: "1 set" },
      { category: "Distribution", model: "Suntree SUNDB12WAY", details: "12-way DB enclosure box", quantity: "1" }
    ],
    source: { document: packageSource, page: 1 }
  },
  {
    id: "premium-executive-corporate",
    name: "Premium Executive Home / Corporate Office (8 kW – 10 kW System)",
    application: "Designed for high-demand residential usage (multiple air conditioners, water pumps) or medium enterprise offices.",
    inverterWatts: 8000,
    panelCount: 12,
    panelWatts: 720,
    batteryNominalWh: 16000,
    batterySummary: "1 Deye BATSE-F16-C, 16kWh low-voltage lithium battery (48V).",
    components: [
      { category: "Inverter", model: "Deye 8K-SG04LP3-EU", details: "8kW, 3-phase, low-voltage hybrid inverter", quantity: "1" },
      { category: "Battery", model: "Deye BATSE-F16-C", details: "16kWh low-voltage lithium battery (48V)", quantity: "1" },
      { category: "Solar panels", model: "Jinko 720N-66HL5-BD", details: "720W bifacial half-cut", quantity: "12" },
      { category: "Mounting", model: "Antai Mounting Kit + Accessories", details: "Rail sets + mid/end clamps", quantity: "2" },
      { category: "Accessories", model: "Huawei ATS63A", details: "Auto transfer switch 63A, 3-phase", quantity: "1" },
      { category: "Protections", model: "Suntree MCCB & AC Guard", details: "MCCB AC 100A + DC surge protector", quantity: "1 set" }
    ],
    source: { document: packageSource, page: 2 }
  },
  {
    id: "heavy-commercial-industrial",
    name: "Heavy Commercial / Industrial Setup (50 kW System)",
    application: "Designed for factories, commercial complexes, large corporate headquarters, or mini-grids.",
    inverterWatts: 50000,
    panelCount: 70,
    panelWatts: 725,
    batteryNominalWh: 48000,
    batterySummary: "3 Deye BOS-B-PACK16 high-voltage battery packs, 16kWh each (48kWh total as listed capacity).",
    components: [
      { category: "Inverter", model: "Deye 50K-SG01HP3-E", details: "50kW, 3-phase, high-voltage hybrid inverter", quantity: "1" },
      { category: "Battery", model: "Deye BOS-B-PACK16", details: "HV battery pack 16kWh B-PRO", quantity: "3" },
      { category: "Battery control", model: "Deye Control Box HV", details: "BOS-B-PRO16KWH control box-ACC", quantity: "1" },
      { category: "Battery rack", model: "Deye DEYERACK-3U-H", details: "13-layer rack for HV battery", quantity: "1" },
      { category: "Solar panels", model: "Jinko 725N-66HL5-BD", details: "725W bifacial half-cut", quantity: "70" },
      { category: "Mounting", model: "Antai PV Mounting Sets", details: "Rail kits (8 panels each)", quantity: "9" },
      { category: "Protection / MCCB", model: "Suntree MCCB AC250A4P", details: "High-amperage circuit breaker", quantity: "1" }
    ],
    source: { document: packageSource, page: 2 }
  }
];

window.ElectronySolarPackages = Object.freeze(packageCatalogueData.map((solarPackage) => Object.freeze({
  ...solarPackage,
  components: Object.freeze(solarPackage.components.map((component) => Object.freeze(component))),
  source: Object.freeze(solarPackage.source)
})));
