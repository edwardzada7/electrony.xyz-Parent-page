const packageCatalogueDocument = "POWER-SOLAR PL-1.pdf";
const packageCompositionDocument = "Solar_Power_Solution_Packages.pdf";

function packageComponent(category, productId, quantity, details, unit = "unit") {
  return { category, productId, quantity, details, unit };
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
    packageComponent(
      category,
      productId,
      quantityPerSet * setCount,
      `${details}; ${setCount} documented 8-panel mounting ${setCount === 1 ? "set" : "sets"}.`,
      category.endsWith("rail") ? "rail" : "unit"
    ));
}

const packageCatalogueData = [
  {
    id: "basic-small-home-office",
    name: "Small Home Solar Package",
    capacity: "3.6 kW inverter",
    application: "Smaller homes with lighting, fans, television, refrigeration and other modest essential loads.",
    loadCategory: "Small home",
    inverterWatts: 3600,
    panelCount: 8,
    panelWatts: 525,
    solarArrayWatts: 4200,
    batteryNominalWh: 5120,
    batterySummary: "5.12 kWh, 51.2 V Growatt HOPE5L-B1 lithium battery (separate battery).",
    compatibilityNotes: "The package guide lists the 3.6 kW Growatt SPH inverter with Growatt 48 V batteries but does not confirm HOPE5L-B1 compatibility with this exact inverter. Confirm the battery BMS protocol and approved pairing before supply.",
    installationNotes: "The panel count and mounting set follow the guide's 8-panel Antai mounting-set quantity. Confirm roof structure, string voltage/current, protection ratings, and installation design on site.",
    components: [
      packageComponent("Inverter", "growatt-sph-3600tl-bl-up", 1, "Growatt SPH 3600TL-BL-UP; 3.6 kW hybrid, 2 MPPT, single phase."),
      packageComponent("Battery", "growatt-hope5l-b1", 1, "Growatt HOPE5L-B1; 5.12 kWh, 51.2 V lithium-ion battery."),
      packageComponent("Solar panels", "jinko-525m-72hl4-tv", 8, "Jinko 525M-72HL4-TV; 525 W bifacial half-cut.", "panel"),
      ...antaiMountingKit(1),
      packageComponent("Protection", "suntree-sunacguard63a-230v", 1, "Suntree 63 A, 2-pole AC voltage guard."),
      packageComponent("Protection", "suntree-sunbrkac32amps-2p", 1, "Suntree 32 A, 2-pole AC breaker."),
      packageComponent("Distribution", "suntree-sundb6way", 1, "Suntree 6-way IP40 distribution box.")
    ],
    source: { document: packageCatalogueDocument, page: 1 },
    compositionSource: { document: packageCompositionDocument, page: 1 }
  },
  {
    id: "medium-home-office",
    name: "Medium Home Solar Package",
    capacity: "6 kW inverter",
    application: "Medium household or home-office loads with multiple appliances and a moderate backup requirement.",
    loadCategory: "Medium home / home office",
    inverterWatts: 6000,
    panelCount: 10,
    panelWatts: 620,
    solarArrayWatts: 6200,
    batteryNominalWh: 5120,
    batterySummary: "5.12 kWh battery is integrated in the Growatt Future-H Solution 2; no separate battery is charged.",
    compatibilityNotes: "The listed Future-H Solution 2 is a combined 6 kW inverter, battery and base system. Its integrated 5.12 kWh battery is counted once. Confirm PV string design, load phase and the complete system's suitability before installation.",
    installationNotes: "Ten panels and two Antai mounting sets follow the existing package guide. Confirm module/string voltage and current against the Future-H system limits and verify roof structure and site conditions.",
    components: [
      packageComponent("Integrated inverter and battery", "growatt-sim-6000es-plus-h-battery-base-6kw-5-12-kwh", 1, "Growatt Future-H All-in-One Solution 2: SIM 6000ES PLUS-H inverter, integrated 5.12 kWh battery and 6 kW base."),
      packageComponent("Solar panels", "jinko-620n-66hl4-bd", 10, "Jinko 620N-66HL4-BD; 620 W bifacial half-cut.", "panel"),
      ...antaiMountingKit(2),
      packageComponent("Protection", "suntree-sunacsurge20ka-275v", 1, "Suntree 10–20 kA, 275 VAC, 2-pole AC surge protector."),
      packageComponent("Protection", "suntree-sundciso32a-1000v-4p", 1, "Suntree 32 A, 1000 V, 4-pole DC isolator."),
      packageComponent("Distribution", "suntree-sundb12way", 1, "Suntree 12-way IP40 distribution box.")
    ],
    source: { document: packageCatalogueDocument, page: 3 },
    compositionSource: { document: packageCompositionDocument, page: 1 }
  },
  {
    id: "premium-executive-corporate",
    name: "Large Home / Executive Solar Package",
    capacity: "8 kW inverter",
    application: "Larger homes and executive or corporate offices with higher connected loads and extended storage needs.",
    loadCategory: "Large home / executive",
    inverterWatts: 8000,
    panelCount: 12,
    panelWatts: 725,
    solarArrayWatts: 8700,
    batteryNominalWh: 16000,
    batterySummary: "16 kWh, 48 V Deye BATSE-F16-C low-voltage lithium battery (separate battery).",
    compatibilityNotes: "The Deye 8K-SG06LP1-EU supports 48 V low-voltage batteries and BATSE-F16-C is listed as 16 kWh / 48 V. The PDF does not confirm the inverter/battery BMS pairing; verify the approved compatibility list before supply. The listed Deye inverter is single-phase.",
    installationNotes: "Twelve Jinko modules and two Antai mounting sets follow the package guide's panel and mounting quantities, updated to a currently listed 725 W panel. Verify the inverter's permitted PV input, string voltage/current, protective-device coordination, roof design and phase requirements.",
    components: [
      packageComponent("Inverter", "deye-8k-sg06lp1-eu", 1, "Deye 8K-SG06LP1-EU; 8 kW, single phase, 48 V low-voltage battery support."),
      packageComponent("Battery", "deye-batse-f16-c", 1, "Deye BATSE-F16-C; 16 kWh, 48 V low-voltage lithium battery."),
      packageComponent("Solar panels", "jinko-725n-66hl5-bd", 12, "Jinko 725N-66HL5-BD; 725 W bifacial half-cut.", "panel"),
      ...antaiMountingKit(2),
      packageComponent("Protection", "suntree-sunbrkac63amps-2p", 1, "Suntree 63 A, 2-pole AC breaker."),
      packageComponent("Protection", "suntree-sunacguard63a-230v", 1, "Suntree 63 A, 2-pole AC voltage guard."),
      packageComponent("Protection", "suntree-sundcsurge20ka-1000v", 1, "Suntree 20 kA, 1000 V, 2-pole DC surge protector."),
      packageComponent("Distribution", "suntree-sundb12way", 1, "Suntree 12-way IP40 distribution box.")
    ],
    source: { document: packageCatalogueDocument, page: 1 },
    compositionSource: { document: packageCompositionDocument, page: 2 }
  },
  {
    id: "heavy-commercial-industrial",
    name: "Industrial / Company Solar Package",
    capacity: "50 kW three-phase inverter",
    application: "Commercial and industrial sites requiring a three-phase, high-voltage battery system.",
    loadCategory: "Industrial / company",
    inverterWatts: 50000,
    panelCount: 70,
    panelWatts: 725,
    solarArrayWatts: 50750,
    batteryNominalWh: 48000,
    batterySummary: "48 kWh nominal high-voltage storage: three Deye BOS-B-PACK16 16 kWh battery packs, with the matching Deye control box and rack.",
    compatibilityNotes: "The Deye 50K-SG01HP3-E is a 50 kW three-phase high-voltage hybrid inverter; the package guide pairs it with three BOS-B-PACK16 high-voltage packs, one BOS-B-PRO control box and the 13-layer Deye rack. Confirm the exact high-voltage battery stack, control-box and inverter compatibility before supply.",
    installationNotes: "Seventy 725 W modules total 50.75 kWp. Nine 8-panel Antai mounting sets cover up to 72 panels. PV string/MPPT layout, high-voltage battery commissioning, 250 A protection coordination, structural works and site engineering require qualified design.",
    components: [
      packageComponent("Inverter", "deye-50k-sg01hp3-e", 1, "Deye 50K-SG01HP3-E; 50 kW, three-phase, high-voltage hybrid inverter."),
      packageComponent("Battery", "deye-bos-b-pack16", 3, "Deye BOS-B-PACK16; 16 kWh high-voltage B-PRO battery pack.", "battery pack"),
      packageComponent("Battery control", "deye-control-box-hv-bos-b-pdu-2-a", 1, "Deye BOS-B-PRO16KWH control box with accessories."),
      packageComponent("Battery rack", "deye-deyerack-3u-h", 1, "Deye 13-layer high-voltage battery rack."),
      packageComponent("Solar panels", "jinko-725n-66hl5-bd", 70, "Jinko 725N-66HL5-BD; 725 W bifacial half-cut.", "panel"),
      ...antaiMountingKit(9),
      packageComponent("Protection / MCCB", "suntree-sunacmccb250a-4p", 1, "Suntree 250 A, 4-pole AC MCCB.")
    ],
    source: { document: packageCatalogueDocument, page: 2 },
    compositionSource: { document: packageCompositionDocument, page: 2 }
  }
];

window.ElectronySolarPackages = Object.freeze(packageCatalogueData.map((solarPackage) => Object.freeze({
  ...solarPackage,
  components: Object.freeze(solarPackage.components.map((component) => Object.freeze(component))),
  source: Object.freeze(solarPackage.source),
  compositionSource: Object.freeze(solarPackage.compositionSource)
})));
