const sourceDocument = "POWER-SOLAR PL.pdf";
const sourceDataSheetNote = "Please ask your sales rep for date sheet";
const brandLogos = Object.freeze({
  JINKO: "../assets/catalogue/energy/brands/jinko.png",
  HUAWEI: "../assets/catalogue/energy/brands/huawei.png",
  GROWATT: "../assets/catalogue/energy/brands/growatt.png",
  DEYE: "../assets/catalogue/energy/brands/deye.png",
  PYLONTECH: "../assets/catalogue/energy/brands/pylontech.png",
  ANTAI: "../assets/catalogue/energy/brands/antai.png",
  SUNTREE: "../assets/catalogue/energy/brands/suntree.png"
});

const categoryLabels = Object.freeze({
  "solar-panels": "Solar panels",
  "solar-inverters": "Inverters and power modules",
  "batteries-storage": "Batteries",
  "energy-storage-systems": "Energy storage systems",
  "complete-systems": "Integrated systems",
  "energy-storage-components": "Energy storage components",
  "monitoring-communications": "Monitoring and communications",
  "power-meters": "Power meters",
  "power-optimizers": "Power optimizers",
  transformers: "Transformers",
  "mounting-accessories": "PV mounting",
  "ac-guards": "AC guards and surge protection",
  breakers: "AC and DC breakers",
  "distribution-boxes": "Distribution boxes",
  "dc-isolators": "DC isolators",
  mccbs: "MCCBs",
  "dc-surge-protection": "DC surge protection",
  enclosures: "Enclosure boxes",
  fuses: "Fuses and fuse holders",
  "solar-connectors": "MC4 solar connectors",
  "solar-cables": "Solar cables"
});

const enquiryCategories = Object.freeze({
  "solar-panels": "solar-panels",
  "solar-inverters": "solar-inverters",
  "batteries-storage": "batteries-storage",
  "energy-storage-systems": "batteries-storage",
  "complete-systems": "complete-systems",
  "energy-storage-components": "batteries-storage",
  "monitoring-communications": "cables-accessories",
  "power-meters": "electricity-meters",
  "power-optimizers": "solar-inverters",
  transformers: "transformers",
  "mounting-accessories": "cables-accessories",
  "ac-guards": "cables-accessories",
  breakers: "cables-accessories",
  "distribution-boxes": "cables-accessories",
  "dc-isolators": "cables-accessories",
  mccbs: "cables-accessories",
  "dc-surge-protection": "cables-accessories",
  enclosures: "cables-accessories",
  fuses: "cables-accessories",
  "solar-connectors": "cables-accessories",
  "solar-cables": "cables-accessories"
});

const categoryImages = Object.freeze({
  "solar-panels": ["energy-panels.svg", "Illustrative solar panel category artwork; not a product photograph."],
  "solar-inverters": ["energy-inverter.svg", "Illustrative inverter category artwork; not a product photograph."],
  "batteries-storage": ["energy-battery.svg", "Illustrative battery category artwork; not a product photograph."],
  "energy-storage-systems": ["energy-battery.svg", "Illustrative energy storage category artwork; not a product photograph."],
  "complete-systems": ["energy-system.svg", "Illustrative solar system category artwork; not a product photograph."],
  "energy-storage-components": ["energy-battery.svg", "Illustrative storage component category artwork; not a product photograph."],
  "monitoring-communications": ["energy-meter.svg", "Illustrative monitoring equipment category artwork; not a product photograph."],
  "power-meters": ["energy-meter.svg", "Illustrative power meter category artwork; not a product photograph."],
  "power-optimizers": ["energy-inverter.svg", "Illustrative optimizer category artwork; not a product photograph."],
  transformers: ["energy-transformer.svg", "Illustrative transformer category artwork; not a product photograph."],
  "mounting-accessories": ["energy-system.svg", "Illustrative solar mounting category artwork; not a product photograph."],
  "solar-cables": ["energy-cables.svg", "Illustrative electrical cable category artwork; not a product photograph."]
});

function makeProduct(brand, details) {
  const categoryImage = categoryImages[details.category] || [
    "energy-cables.svg",
    "Illustrative electrical equipment category artwork; not a product photograph."
  ];
  const image = details.image || {
    url: `../assets/catalogue/${categoryImage[0]}`,
    alt: categoryImage[1]
  };
  const slug = `${brand}-${details.model || details.name}`.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return Object.freeze({
    id: slug,
    brand,
    brandLogo: brandLogos[brand] || "",
    name: details.name,
    model: details.model || "",
    category: details.category,
    enquiryCategory: enquiryCategories[details.category],
    description: details.description || "",
    specifications: Object.freeze(details.specifications || []),
    ...(details.warranty ? { warranty: details.warranty } : {}),
    source: Object.freeze({ document: sourceDocument, page: details.page }),
    ...(details.sourceNote ? { sourceNote: details.sourceNote } : {}),
    ...(details.reviewNote ? { reviewNote: details.reviewNote } : {}),
    ...(details.video ? { video: details.video } : {}),
    image: Object.freeze({ url: image.url, alt: image.alt })
  });
}

function filterEnergyProducts(products, filters, categories) {
  const query = filters.query.trim().toLocaleLowerCase();
  return products.filter((product) => {
    const searchableText = [
      product.brand,
      product.model,
      product.name,
      categories[product.category],
      product.description,
      ...product.specifications
    ].join(" ").toLocaleLowerCase();
    return (filters.brand === "all" || product.brand === filters.brand)
      && (filters.category === "all" || product.category === filters.category)
      && searchableText.includes(query);
  });
}

function getEnergyProductPage(products, page, pageSize) {
  const pageCount = Math.max(1, Math.ceil(products.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const startIndex = (currentPage - 1) * pageSize;
  return {
    page: currentPage,
    pageCount,
    startIndex,
    endIndex: Math.min(startIndex + pageSize, products.length),
    products: products.slice(startIndex, startIndex + pageSize)
  };
}

const products = [
  ...[
    ["585N-72HL4-BD", "585W", "Solar Panel Half Cut BIFACIAL(36)"],
    ["590N-72HL4-BD", "590W", "Solar Panel Half Cut BIFACIAL (36)"],
    ["620N-66HL4-BD", "620W", "Solar Panel Half Cut BIFACIAL(36)"],
    ["650N-66QL6-BD", "650W", "3.0 SOLAR PANEL BIFACIAL (36)"],
    ["720N-66HL5-BD", "720W", "Solar Panel Half Cut BIFACIAL(33)"],
    ["725N-66HL5-BD", "725W", "Solar Panel Half Cut BIFACIAL(33)"]
  ].map(([model, rating, description]) => makeProduct("JINKO", {
    name: "Solar panel",
    model,
    category: "solar-panels",
    description,
    specifications: [rating, ...(description.includes("Half Cut") ? ["Half cut"] : []), description.match(/BIFACIAL ?\(\d+\)/i)?.[0] || "Bifacial"],
    warranty: "25 Years Linear Warranty + 10 Years Product Warranty",
    page: 1
  })),

  makeProduct("HUAWEI", {
    name: "Power Cabinet",
    model: "POWER CABINET",
    category: "energy-storage-components",
    description: "1*Power Cabinet (indoor, including 4*4kW Battery Charger, 1*36kVA Bypass module, 1*D.G. interface module, Integrated cable, installation auxiliary material package, and software etc)",
    warranty: "5 Years",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "Battery Cabinet",
    model: "BATTERY CABINET",
    category: "energy-storage-components",
    description: "1*Battery Cabinet (indoor, including Integrated cable, installation auxiliary material package, and software etc)",
    warranty: "5 Years",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "Lithium Battery (10 kWh)",
    model: "ESM-48200A1",
    category: "batteries-storage",
    description: "Energy Storage Module, 48V, 200Ah, 442mm (W) * 560mm (D) * 218mm (H)",
    specifications: ["10 kWh", "48V", "200Ah", "442mm (W) * 560mm (D) * 218mm (H)"],
    warranty: "5 Years",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "Lithium Battery (5 kWh)",
    model: "ESM-48100A7",
    category: "batteries-storage",
    description: "Energy Storage Module, 48V, 100Ah, 442mm (W) * 396mm (D) * 130mm (H)",
    specifications: ["5 kWh", "48V", "100Ah", "442mm (W) * 396mm (D) * 130mm (H)"],
    warranty: "5 Years",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "High Efficiency Inverter Module",
    model: "I23003",
    category: "solar-inverters",
    description: "Inverter Module, 1U, 3kVA/2.5kW, High Efficiency",
    specifications: ["1U", "3kVA/2.5kW"],
    warranty: "5 Years",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "PV Distribution Unit",
    model: "PVDU-8kW",
    category: "energy-storage-components",
    description: "PV Distribution Unit, PVDU, DC Input, 150A, Front Cabling, 1U, 8kW",
    specifications: ["DC Input", "150A", "1U", "8kW"],
    warranty: "5 Years",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "High Efficiency Solar Module",
    model: "S4875",
    category: "solar-panels",
    description: "Solar Module, 1U, 4kW, High Efficiency",
    specifications: ["1U", "4kW"],
    warranty: "5 Years",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "Smart PV Controller",
    model: "HUWINV100KTL-M2",
    category: "solar-inverters",
    description: "Smart PV Controller, 150 KW",
    specifications: ["150 KW"],
    warranty: "5 Years",
    reviewNote: "The source associates model HUWINV100KTL-M2 with a 150 KW description; retain both as printed and verify before advising.",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "Smart PV Controller",
    model: "HUWINV150K-MG0",
    category: "solar-inverters",
    description: "Smart PV Controller, 100 KW",
    specifications: ["100 KW"],
    warranty: "5 Years",
    reviewNote: "The source associates model HUWINV150K-MG0 with a 100 KW description; retain both as printed and verify before advising.",
    page: 1
  }),
  ...[
    ["LUNA 2000-97KWH", "97KWH", "BESS 97KWH (Door Mounted distributed air conditioners, battery packs, battery rack, smart rack controller, PCS, Abort button)"],
    ["LUNA 2000-129KWH", "129KWH", "BESS 129KWH (Door Mounted distributed air conditioners, battery packs, battery rack, smart rack controller, PCS, Abort button)"],
    ["LUNA 2000-161KWH", "161KWH", "BESS 161KWH (Door Mounted distributed air conditioners, battery packs, battery rack, smart rack controller, PCS, Abort button)"],
    ["LUNA 2000-215KWH", "215KWH", "BESS 215KWH (Door Mounted distributed air conditioners, battery packs, battery rack, smart rack controller, PCS, Abort button)"]
  ].map(([model, capacity, description]) => makeProduct("HUAWEI", {
    name: "LUNA 2000 energy storage system",
    model,
    category: "energy-storage-systems",
    description,
    specifications: [capacity],
    warranty: "5 Years",
    page: 1
  })),
  makeProduct("HUAWEI", {
    name: "LUNA BESS Battery Installation Tray",
    model: "INSTALLATION TRAY",
    category: "energy-storage-components",
    description: "LUNA BESS BATTERY INSTALLATION TRAY",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "Auto Transform Switch",
    model: "ATS 63A",
    category: "energy-storage-components",
    description: "Auto Transform Switch 63A Max, 220/380Vac, 3 Phase, SPD Class B",
    specifications: ["63A Max", "220/380Vac", "3 Phase", "SPD Class B"],
    warranty: "5 Years",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "Auto Transform Switch",
    model: "ATS 100A",
    category: "energy-storage-components",
    description: "Auto Transform Switch 100A Max, 220/380Vac, 3 Phase",
    specifications: ["100A Max", "220/380Vac", "3 Phase"],
    warranty: "5 Years",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "Liquid Level Sensor",
    model: "LQUID LEVEL SENSOR",
    category: "energy-storage-components",
    description: "Two Wire 4-20mA, Measuring Range 2m, Cable Length 25m, With Flange Plate",
    specifications: ["Two Wire 4-20mA", "Measuring Range 2m", "Cable Length 25m", "With Flange Plate"],
    warranty: "5 Years",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "Touch Screen",
    model: "TOUCH SCREEN",
    category: "energy-storage-components",
    description: "Power-S Touch Screen Installed on the Indoor Cabinet",
    warranty: "5 Years",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "Smart Optimizer",
    model: "MERC-1300WP",
    category: "power-optimizers",
    description: "Smart Optimizer 1300W",
    specifications: ["1300W"],
    warranty: "5 Years",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "Smart Power Meter",
    model: "DTSU666-HW",
    category: "power-meters",
    description: "SMART POWER METER DTSU666-HW",
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "Smart Module / Data Logger",
    model: "HUWSMARTMODUL1000A01",
    category: "monitoring-communications",
    description: "Smart Module/data logger 1000A",
    specifications: ["1000A"],
    page: 1
  }),
  makeProduct("HUAWEI", {
    name: "Smart Logger",
    model: "SMART LOGGER 3000A01EU",
    category: "monitoring-communications",
    description: "Dedicated to monitoring and managing a PV power generating system. It can connect up to 80 devices and centrally monitors information regarding connected solar modules and inverters.",
    specifications: ["Connects up to 80 devices"],
    warranty: "5 Years",
    page: 1
  }),

  makeProduct("HISENSE", {
    name: "Inverter",
    model: "INV6KS-AA1",
    category: "solar-inverters",
    description: "6 KW, 48V, 9000 W MPPT Input, Built-in 120A MPPT Solar Charger, Wide Solar Input Range 60-500V, Support Lithium & Lead-acid Battery, Wifi Monitoring & Management, Dual AC Output, Parallel Support Up-to 9 Inverters",
    specifications: ["6 KW", "48V", "9000 W MPPT Input", "120A MPPT Solar Charger", "60-500V solar input", "Parallel support up to 9 inverters"],
    warranty: "2 Years",
    page: 1
  }),
  makeProduct("HISENSE", {
    name: "Low Voltage Battery",
    model: "BATHEL5-E-BB1",
    category: "batteries-storage",
    description: "5.12 LOW VOLTAGE KWH 51.2V 100AH",
    specifications: ["5.12 kWh", "51.2V", "100Ah"],
    warranty: "5 Years",
    page: 2
  }),

  ...[
    ["SIM 6000ES PLUS-H + BATTERY + BASE 6KW + 5.5 KWH", "Future-H all-in-one solution", "Integrated inverter and lithium battery system, Compact size & easy installation, Flexible expansion capacity up to 18kW/33kWh, Maximum PV input voltage up to 500VDC, Grid and Generator dual AC input with integrated transfer switch", ["6kW", "5.5 kWh", "Expansion up to 18kW/33kWh", "Maximum PV input up to 500VDC", "Grid and Generator dual AC input"]],
    ["SIM 6000ES PLUS-H + BATTERY + BASE 6KW + 5.12 kwh", "Future-H all-in-one solution 2", "Integrated inverter and lithium battery system, Compact size & easy installation, Flexible expansion capacity up to 18kW/30kWh, Maximum PV input voltage up to 500VDC, Grid and Generator dual AC input with integrated transfer switch", ["6kW", "5.12 kWh", "Expansion up to 18kW/30kWh", "Maximum PV input up to 500VDC", "Grid and Generator dual AC input"]]
  ].map(([model, name, description, specifications]) => makeProduct("GROWATT", {
    name,
    model,
    category: "complete-systems",
    description,
    specifications,
    warranty: "INVERTER 2 YEARS & BATTEY 5 YEARS",
    sourceNote: sourceDataSheetNote,
    reviewNote: "The source warranty cell spans the integrated system and battery rows.",
    page: 2
  })),
  makeProduct("GROWATT", {
    name: "Lithium-ion Battery",
    model: "ABM 5.5-A1-H",
    category: "batteries-storage",
    description: "Rechargeable Lithium Ion Battery 5.5 Kwh, 51.2 Vdc 100Ah, 98% DOD, 43 Kg, Cycle life > 6,000, IP 20",
    specifications: ["5.5 Kwh", "51.2 Vdc", "100Ah", "98% DOD", "43 Kg", "Cycle life > 6,000", "IP 20"],
    warranty: "INVERTER 2 YEARS & BATTEY 5 YEARS",
    sourceNote: sourceDataSheetNote,
    reviewNote: "The source warranty cell spans the integrated system and battery rows.",
    page: 2
  }),
  makeProduct("GROWATT", {
    name: "Lithium-ion Battery",
    model: "ABM 5-LS-B1-H",
    category: "batteries-storage",
    description: "Rechargeable Lithium Ion Battery 5.12 Kwh, 51.2 Vdc 100Ah, 93% DOD, 440*540*130.5 mm, 45 Kg, Single string quantity 12 units, Cycle life > 6,000, IP 20",
    specifications: ["5.12 Kwh", "51.2 Vdc", "100Ah", "93% DOD", "440*540*130.5 mm", "45 Kg", "Single string quantity 12 units", "Cycle life > 6,000", "IP 20"],
    warranty: "INVERTER 2 YEARS & BATTEY 5 YEARS",
    sourceNote: sourceDataSheetNote,
    reviewNote: "The source warranty cell spans the integrated system and battery rows.",
    page: 2
  }),
  makeProduct("GROWATT", {
    name: "Lithium-ion Battery",
    model: "HOPE5L-B1",
    category: "batteries-storage",
    description: "Rechargeable Lithium Ion Battery 5.12 KWH, 51.2 V, DoD up to 98%, Dimension (W/D/H): 440*480*130.5mm, 43 ± 2Kg, Max.48 packs parallel, IP20 + free cable kit",
    specifications: ["5.12 KWH", "51.2 V", "DoD up to 98%", "440*480*130.5mm", "43 ± 2Kg", "Max.48 packs parallel", "IP20"],
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 2
  }),
  ...[
    ["SPF 3000TL-HVM-24", "3KW, 24V, High Frequency, Integrated MPPT charge controller, Configurable grid or solar input priority, WIFI Dongle Included for Monitoring, Maximum PV Array Power 1500W", ["3KW", "24V", "Maximum PV Array Power 1500W"]],
    ["SPF 6000ES", "6KW, 48V, 2 MPPT, Work with or without Battery, Configurable grid or solar input priority, WIFI Dongle Included for Monitoring, Parallel Up to 6 Units, Two AC input terminals with integrated transfer switch, Maximum PV Array Power 8000W, Maximum PV input voltage up to 500VDC", ["6KW", "48V", "2 MPPT", "Parallel up to 6 units", "Maximum PV Array Power 8000W", "Maximum PV input voltage up to 500VDC"]],
    ["SPH 3600TL-BL-UP", "Hybrid 3.6KW 2MPPT, Smart Load Management Via Dry Contact, UPS Function < 10MS Transition, 1.5 DC/AC RATIO, Single Phase, Max. recommended PV power 7500W, Grid Side Parallel, Free Shine Wifi-X", ["3.6KW", "2MPPT", "UPS transition < 10MS", "Single Phase", "Max. recommended PV power 7500W"]],
    ["SPH 5000TL-BL-UP", "Hybrid 5KW 2MPPT, Smart Load Management Via Dry Contact, UPS Function < 10MS Transition, 1.5 DC/AC RATIO, Single Phase, Max. recommended PV power 7500W, Grid Side Parallel, Free Shine Wifi-X", ["5KW", "2MPPT", "UPS transition < 10MS", "Single Phase", "Max. recommended PV power 7500W"]],
    ["WIT-100K-HU", "Smart Hybrid 100KW ESS Inverter, 156KW PV Input, 10 MPPT Trackers, Smart Air Cooling, IP66", ["100KW", "156KW PV Input", "10 MPPT Trackers", "IP66"]]
  ].map(([model, description, specifications], index) => makeProduct("GROWATT", {
    name: "Inverter",
    model,
    category: "solar-inverters",
    description,
    specifications,
    warranty: index < 2 ? "2 Years" : "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 2
  })),
  makeProduct("GROWATT", {
    name: "Battery Energy Storage System",
    model: "ACE-209H-2H",
    category: "energy-storage-systems",
    description: "209.6 Kwh BESS, Parallel up to 13 Units, 280Ah, Easy Installation",
    specifications: ["209.6 Kwh", "Parallel up to 13 Units", "280Ah"],
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 2
  }),
  makeProduct("GROWATT", {
    name: "Smart Energy Meter",
    model: "SEM-XA-RM",
    category: "power-meters",
    description: "Online monitoring and export limitation for the whole system, Up to 48 units of inverters in monitoring, Support Ethernet, RS485 communication, ommunication",
    specifications: ["Monitoring and export limitation", "Up to 48 inverters", "Ethernet", "RS485 communication"],
    warranty: "1 Year",
    sourceNote: sourceDataSheetNote,
    page: 2
  }),
  makeProduct("GROWATT", {
    name: "Current Transformer",
    model: "CT 600/5A",
    category: "energy-storage-components",
    description: "CT 600A/5A",
    specifications: ["600A/5A"],
    warranty: "1 Year",
    sourceNote: sourceDataSheetNote,
    page: 2
  }),

  ...[
    ["6K-OG02LP1-EU", "6KW Single Phase, Single Phase Low voltage, 48V Low Voltage Battery Supported, Supports 16 pcs parallel (off-grid).", ["6KW", "Single Phase", "48V Low Voltage Battery", "Supports 16 pcs parallel (off-grid)"]],
    ["6/6KOG03LP1", "LV OFF-GRID 1-PHASE 6.6KW, Compatible with 18A PV Modules, 200% Peak Output, Up to 97.6% Conversion Efficiency, 4ms On/Off-Grid Switching, Max. 16 Units in Parallel, IP65 Protection Rating", ["6.6KW", "1-Phase", "Compatible with 18A PV Modules", "200% Peak Output", "Up to 97.6% Conversion Efficiency", "4ms switching", "Max. 16 Units in Parallel", "IP65"]],
    ["8K-SG04LP3-EU", "8 KW Hybrid Inverter, Three Phase, Low Voltage, 10400W Mppt, Works with both Lead-acid or Li-Ion Batteries, Max. 10 pcs parallel for on-grid and off-grid operation, Support multiple batteries parallel, Max. charging/discharging current of 240A", ["8 KW", "Three Phase", "Low Voltage", "10400W Mppt", "Max. 10 pcs parallel", "Max. charging/discharging current of 240A"]],
    ["8K-SG05LP1-EU", "8KW Single phase, 48V Low Voltage Battery Supported, Max. 16 pcs parallel for on-grid and off-grid operation; Support multiple batteries parallel, Max. charging/discharging current of 190A", ["8KW", "Single phase", "48V Low Voltage Battery", "Max. 16 pcs parallel", "Max. charging/discharging current of 190A"]],
    ["12K-SG05LP3-E", "12 KW Hybrid Inverter, Three Phase, Low Voltage, 15600W Mppt, Works with both Lead-acid or Li-Ion Batteries, Max. 10 pcs parallel for on-grid and off-grid operation, Support multiple batteries parallel, Max. charging/discharging current of 240A", ["12 KW", "Three Phase", "Low Voltage", "15600W Mppt", "Max. 10 pcs parallel", "Max. charging/discharging current of 240A"]],
    ["20K-SG05LP3-E", "20 KW Hybrid, Inverter, Three Phase, Low Voltage, 26000w Dual MPPT", ["20 KW", "Three Phase", "Low Voltage", "26000w Dual MPPT"]],
    ["50K-SG01HP3-E", "50 Kw Hybrid Inverter, Three Phase, High Voltage, 65000W Mppt, Max. 10 pcs parallel for on-grid and off-grid operation; Support multiple batteries parallel, Max. charging/discharging current of 100A", ["50 Kw", "Three Phase", "High Voltage", "65000W Mppt", "Max. 10 pcs parallel", "Max. charging/discharging current of 100A"]],
    ["80K-SG02HP3-E", "HV HYBRID 3-PHASE 80KW, 100% unbalanced output each phase, AC couple to retrofit existing solar system, Max. 10 pcs parallel for on-grid and off-grid operation; Support multiple batteries parallel, 128 Kw PV Inout", ["80KW", "3-Phase", "100% unbalanced output each phase", "AC couple", "Max. 10 pcs parallel", "128 Kw PV Inout"]],
    ["100K-G", "HV STRING 3-PHASE 100KW, 150KW DC Input, Max. 6 MPP trackers, Max. efficiency up to 98.8%", ["3-Phase", "100KW", "150KW DC Input", "Max. 6 MPP trackers", "Max. efficiency up to 98.8%"]],
    ["136K-G", "HV STRING 3-PHASE 136KW, 204KW DC Input, 8 MPPT", ["3-Phase", "136KW", "204KW DC Input", "8 MPPT"]]
  ].map(([model, description, specifications], index) => makeProduct("DEYE", {
    name: "Inverter",
    model,
    category: "solar-inverters",
    description,
    specifications,
    warranty: index === 8 ? "6 Years" : "5 Years",
    sourceNote: sourceDataSheetNote,
    page: index < 6 ? 2 : 3
  })),
  ...[
    ["BATSE-F16-C", "Rechargeable Lithium Ion Low Voltage Battery, 16 KWH, 48 V, parallel up to 32 units in parallel", ["16 KWH", "48 V", "Parallel up to 32 units"], "10 Years"],
    ["BOS-PACK-7.6KWH", "Rechargeable Lithium Ion High Voltage Battery, 7.6 Kwh", ["7.6 Kwh", "High Voltage"], "10 Years"],
    ["SE-F5-L", "Rechargeable Lithium Ion Low Voltage Battery, 5.12 Kwh", ["5.12 Kwh", "Low Voltage"], "5 Years"],
    ["BOS-GM-5.1 HV", "Rechargeable Lithium Ion High Voltage Battery, 5.12 Kwh 0.5C", ["5.12 Kwh", "High Voltage", "0.5C"], "10 Years"],
    ["BOS-G-PRO51", "Rechargeable Lithium Ion High Voltage Battery, 5.12 Kwh", ["5.12 Kwh", "High Voltage"], "10 Years"],
    ["BOS-B-PACK16", "HV BATTERY PACK 16 kwh B-PRO", ["16 kwh", "High Voltage", "B-PRO"], "10 Years"]
  ].map(([model, description, specifications, warranty]) => makeProduct("DEYE", {
    name: "Battery",
    model,
    category: "batteries-storage",
    description,
    specifications,
    warranty,
    sourceNote: sourceDataSheetNote,
    page: 3
  })),
  ...[
    ["PCS 125K-L01HP3", "Power Conversion System", "125 KW PCS, Max. Charging/Discharging Current (A) 220AH", ["125 KW", "Max. Charging/Discharging Current (A) 220AH"]],
    ["MPPT 200KW", "MPPT Charging Module", "200 kW MPPT charging module", ["200 kW"]],
    ["CONTROL BOX HV BOS-B-PDU-2-A", "Battery Control Box", "BOS-B-PRO16KWH CONTROL BOX+ACC", ["For BOS-B-PRO16KWH"]],
    ["STS 500L", "Static Transfer Switch", "500kW Static Transfer Switch", ["500kW"]],
    ["CONTROL BOX HV BOS-G-PDU-PRO", "High Voltage Battery Cluster Control Box", "BMU High Voltage Battery Cluster Control Box for BOS-G -PDU-PRO", ["For BOS-G -PDU-PRO"]],
    ["DEYERACK-3U-H", "High Voltage Battery Rack", "13 LAYER RACK HV BATTERY", ["13 layer rack", "High voltage battery"]]
  ].map(([model, name, description, specifications]) => makeProduct("DEYE", {
    name,
    model,
    category: "energy-storage-components",
    description,
    specifications,
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 3
  })),

  makeProduct("PYLONTECH", {
    name: "Lithium Battery",
    model: "PYLONBATFB-L-16",
    category: "batteries-storage",
    description: "16KWH, 51.2V, LV, ELEGANT DESIGN, FLEXIBLE INSTALLATION, SMART MONITORING, APP & LED DISPLAY, BUILT IN FIRE SUPPRESION MODULE, WHEELS INCLUDED",
    specifications: ["16 kWh", "51.2V", "LV", "Built in fire suppression module", "Wheels included"],
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 3
  }),
  makeProduct("PYLONTECH", {
    name: "Lithium Battery",
    model: "UF5000",
    category: "batteries-storage",
    description: "Rechargeable Lithium Ion Battery 5120 Wh 51.2Vdc 100Ah, 95% DOD, 442*452.6*161 mm, 42 kg, Single string quantity 20 units, Cycle life > 6,000, External Cable Kit Included",
    specifications: ["5.12 kWh", "51.2Vdc", "100Ah", "95% DOD", "442*452.6*161 mm", "42 kg", "Single string quantity 20 units", "Cycle life > 6,000"],
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 3
  }),
  makeProduct("PYLONTECH", {
    name: "High Voltage Lithium-Ion Phosphate Battery Storage System",
    model: "PYLONBAT-POWCUBE-M1C",
    category: "batteries-storage",
    description: "High Voltage Lithium-lon Phosphate Battery storage system, 4.74 KWH, 32VDC, 148 AH, Dimension(W*D*H,mm)330*628*150.5, 48KG, IP20",
    specifications: ["4.74 KWH", "32VDC", "148 AH", "330*628*150.5 mm", "48KG", "IP20"],
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 3
  }),
  makeProduct("PYLONTECH", {
    name: "High-voltage lithium battery module",
    model: "PYLON-SC1000-200L-C",
    category: "batteries-storage",
    description: "High-voltage lithium battery module from Pylontech, designed for scalable energy storage systems with high efficiency, long cycle life, and reliable performance.",
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    reviewNote: "The source places this module in the Battery rows; its source-stated type is retained.",
    page: 3
  }),
  makeProduct("PYLONTECH", {
    name: "Battery Rack",
    model: "PYLONRACK-RK2130-M1",
    category: "energy-storage-components",
    description: "Dedicated battery rack for Pylontech HV batteries, used to safely mount, organize, and support multiple battery modules in a structured installation.",
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 3
  }),
  makeProduct("PYLONTECH", {
    name: "Battery Cable Kit",
    model: "PYLONCABLEKIT-M1C",
    category: "energy-storage-components",
    description: "Original Pylontech cable kit including communication and power cables, required for proper connection between battery modules, rack, and inverter/BMS.",
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 3
  }),
  makeProduct("PYLONTECH", {
    name: "External Cable Kit",
    model: "KIT-USC",
    category: "energy-storage-components",
    description: "External Cable Kit-USC (Connect Battery to Inverter)",
    sourceNote: sourceDataSheetNote,
    page: 3
  }),

  makeProduct("TSTY Transformer", {
    name: "Oil-immersed isolation transformer",
    model: "400kva 400-400v",
    category: "transformers",
    description: "400 Kva Isolation transformer, Oil immersed, 1415*985*1096 mm, 3 phase",
    specifications: ["400 Kva", "Oil immersed", "1415*985*1096 mm", "3 phase"],
    warranty: "2 Years",
    sourceNote: sourceDataSheetNote,
    page: 3
  }),
  makeProduct("TSTY Transformer", {
    name: "Oil-immersed isolation transformer",
    model: "600kva 400-400v",
    category: "transformers",
    description: "650 Kva Isolation transformer, Oil immersed, 1535*1040*1170 mm, 3 phase",
    specifications: ["650 Kva (description)", "Oil immersed", "1535*1040*1170 mm", "3 phase"],
    warranty: "2 Years",
    sourceNote: sourceDataSheetNote,
    reviewNote: "The source model label says 600kva while its description says 650 Kva; both values are retained as printed.",
    page: 3
  }),

  makeProduct("ANTAI", {
    name: "PV Roof Mounting Set",
    model: "PV ROOF MOUNTING SET",
    category: "mounting-accessories",
    description: "Kit for 8 units of solar panels of frame size 30/35mm. Set includes 4 units rail 4.7 meters each, 2 rail joiner, 14 mid clamps, 8 end clamps, 16 L-foot, 2 grounding lugs.",
    specifications: ["For 8 solar panels", "Frame size 30/35mm", "4 rails, 4.7 meters each", "2 rail joiners", "14 mid clamps", "8 end clamps", "16 L-foot", "2 grounding lugs"],
    page: 3
  }),
  ...[
    ["ANTAIRAILCG010-01", "Rail", "ANTAI RAIL 4.7M", ["4.7M"]],
    ["ANTAIMIDGN003-05", "Mid Clamp", "ANTAI MID CLAMP 30/35MM", ["30/35MM"]],
    ["ANTAILUGTYN16-01", "Grounding Lug", "ANTAI GROUNDING LUG", []],
    ["ANTAILFEETTYN353-01", "L-Foot", "ANTAI L-FEET", []],
    ["ANTAIJOINERCG037", "Rail Joiner", "ANTAI RAIL JOINER", []],
    ["ANTAIENDCG018-01", "End Clamp", "ANTAI END CLAMP 30/35MM", ["30/35MM"]]
  ].map(([model, name, description, specifications]) => makeProduct("ANTAI", {
    name,
    model,
    category: "mounting-accessories",
    description,
    specifications,
    page: 4
  })),

  ...[
    ["ac-guards", "SUNACGUARD63A-230V", "AC Guard", "AC PROTECTOR VOLTAGE 63A 2P", ["63A", "2P"], "18 MONTHS"],
    ["ac-guards", "SUNACSURGE20KA-275V", "AC Surge Protector", "ACPROTECTOR 10~20KA-275VAC 2P", ["10~20KA", "275VAC", "2P"], "18 MONTHS"],
    ["ac-guards", "SUNACSURGE20KA-385V", "AC Surge Protector", "ACPROTECTOR 10~20KA-385VAC 4P", ["10~20KA", "385VAC", "4P"], "18 MONTHS"],
    ["breakers", "SUNBRKAC100AMPS-2P", "AC Breaker", "AC BREAKER 100 AMPS - 2 POLES", ["100 AMPS", "2 POLES"], "18 MONTHS"],
    ["breakers", "SUNBRKAC100AMPS-4P", "AC Breaker", "AC BREAKER 100 AMPS - 4 POLES", ["100 AMPS", "4 POLES"], "18 MONTHS"],
    ["breakers", "SUNBRKAC20AMPS-2P", "AC Breaker", "AC BREAKER 20 AMPS - 2 POLES", ["20 AMPS", "2 POLES"], "18 MONTHS"],
    ["breakers", "SUNBRKAC25AMPS-2P", "AC Breaker", "AC BREAKER 25 AMPS - 2 POLES", ["25 AMPS", "2 POLES"], "18 MONTHS"],
    ["breakers", "SUNBRKAC25AMPS-4P", "AC Breaker", "AC BREAKER 25 AMPS - 4 POLES", ["25 AMPS", "4 POLES"], "18 MONTHS"],
    ["breakers", "SUNBRKAC32AMPS-2P", "AC Breaker", "AC BREAKER 32 AMPS - 2 POLES", ["32 AMPS", "2 POLES"], "18 MONTHS"],
    ["breakers", "SUNBRKAC32AMPS-4P", "AC Breaker", "AC BREAKER 32 AMPS - 4 POLES", ["32 AMPS", "4 POLES"], "18 MONTHS"],
    ["breakers", "SUNBRKAC40AMPS-2P", "AC Breaker", "AC BREAKER 40 AMPS - 2 POLES", ["40 AMPS", "2 POLES"], "18 MONTHS"],
    ["breakers", "SUNBRKAC63AMPS-2P", "AC Breaker", "AC BREAKER 63 AMPS - 2 POLES", ["63 AMPS", "2 POLES"], "18 MONTHS"],
    ["breakers", "SUNBRKAC63AMPS-4P", "AC Breaker", "AC BREAKER 63 AMPS - 4POLES", ["63 AMPS", "4POLES"], "18 MONTHS"],
    ["breakers", "SUNBRKDC125A-2P", "DC Breaker", "DC BRK 125A- 2P 600VDC", ["125A", "2P", "600VDC"], "18 MONTHS"],
    ["breakers", "SUNBRKDC63A-2P", "DC Breaker", "DC BRK 63A- 2P 550VDC", ["63A", "2P", "550VDC"], "18 MONTHS"],
    ["distribution-boxes", "SUNDB4WAY", "Distribution Box", "4 WAY DB IP40 PLASTIC STSM", ["4 WAY", "IP40", "PLASTIC STSM"], "18 MONTHS"],
    ["distribution-boxes", "SUNDB6WAY", "Distribution Box", "6 WAY DB IP40 PLASTIC STSM", ["6 WAY", "IP40", "PLASTIC STSM"], "18 MONTHS"],
    ["distribution-boxes", "SUNDB12WAY", "Distribution Box", "12 WAY DB IP40 PLASTIC STSM", ["12 WAY", "IP40", "PLASTIC STSM"], "18 MONTHS"],
    ["distribution-boxes", "SUNDB18WAY", "Distribution Box", "18 WAY DB IP40 PLASTIC STSM", ["18 WAY", "IP40", "PLASTIC STSM"], "18 MONTHS"],
    ["distribution-boxes", "SUNDB18WAYIP65", "Distribution Box", "18 WAY DB IP65 PLASTIC PMHA", ["18 WAY", "IP65", "PLASTIC PMHA"], "18 MONTHS"],
    ["distribution-boxes", "SUNDB24WAY", "Distribution Box", "24 WAY DB IP40 PLASTIC STSM", ["24 WAY", "IP40", "PLASTIC STSM"], ""],
    ["distribution-boxes", "SUNDB24WAYIP65", "Distribution Box", "24 WAY DB IP65 PLASTIC PMHA", ["24 WAY", "IP65", "PLASTIC PMHA"], "18 MONTHS"],
    ["dc-isolators", "SUNDCISO25A-1500V", "DC Isolator", "ISOLATOR 1500V 25A DIN RAIL", ["1500V", "25A", "DIN RAIL"], "18 MONTHS"],
    ["dc-isolators", "SUNDCISO32A-1000V-4P", "DC Isolator", "ISOLATOR 1000V 32A 4P DIN RAIL", ["1000V", "32A", "4P", "DIN RAIL"], "18 MONTHS"],
    ["mccbs", "SUNACMCCB100A-4P", "AC MCCB", "MCCB AC 100A 4P", ["AC 100A", "4P"], "18 MONTHS"],
    ["mccbs", "SUNACMCCB-SM8E-125M", "AC MCCB", "MCCB AC 125A 4P", ["AC 125A", "4P"], "18 MONTHS"],
    ["mccbs", "SUNACMCCB160A-4P", "AC MCCB", "MCCB AC 160A 4P", ["AC 160A", "4P"], "18 MONTHS"],
    ["mccbs", "SUNMCCB250A-2P", "DC MCCB", "MCCB DC 250HPV 1500V 250A 2P", ["DC", "250HPV", "1500V", "250A", "2P"], "18 MONTHS"],
    ["mccbs", "SUNACMCCB-SM8E-250M", "AC MCCB", "MCCB AC 250A 4P", ["AC 250A", "4P"], "18 MONTHS"],
    ["mccbs", "SUNDCMCCB400A-2P", "DC MCCB", "MCCB DC 400HPV 1500V 400A 2P", ["DC", "400HPV", "1500V", "400A", "2P"], "18 MONTHS"],
    ["mccbs", "SUNDCMCCB400A-1500V", "DC MCCB", "MCCB DC 400HPV 1500V 400A 4P", ["DC", "400HPV", "1500V", "400A", "4P"], "18 MONTHS"],
    ["mccbs", "SUNACMCCB250A-4P", "AC MCCB", "MCCB AC 250A 4P", ["AC 250A", "4P"], "18 MONTHS"],
    ["dc-surge-protection", "SUNDCSURGE20KA-1000V", "DC Surge Protector", "DC SURGE 20KA-1000V 2P 20-40KA", ["20KA-1000V", "2P", "20-40KA"], "18 MONTHS"],
    ["enclosures", "SUNENCLOSURE20X25X15", "Enclosure Box", "BOX 20X25X15CM 1.2 THICKNESS", ["20X25X15CM", "1.2 THICKNESS"], "18 MONTHS"],
    ["enclosures", "SUNENCLOSURE25X35X15", "Enclosure Box", "BOX 25X35X15CM 1.2 THICKNESS", ["25X35X15CM", "1.2 THICKNESS"], "18 MONTHS"],
    ["enclosures", "SUNENCLOSURE40X60X20", "Enclosure Box", "BOX 40X60X20CM 1.2 THICKNESS", ["40X60X20CM", "1.2 THICKNESS"], "18 MONTHS"],
    ["enclosures", "SUNENCLOSURE50X70X20", "Enclosure Box", "BOX 50X70X20CM 1.2 THICKNESS", ["50X70X20CM", "1.2 THICKNESS"], "18 MONTHS"],
    ["enclosures", "SUNENCLOSURE60X80X25", "Enclosure Box", "BOX 60X80X25CM 1.2 THICKNESS", ["60X80X25CM", "1.2 THICKNESS"], "18 MONTHS"],
    ["fuses", "SUNFUSEDC20A-1000V", "DC Fuse and Holder", "20A-1000V FUSE LINK + HOLDER", ["20A", "1000V", "Fuse link + holder"], "18 MONTHS"],
    ["solar-connectors", "SUNMC4-45A", "MC4 Solar Connector", "SOLAR CONNECTOR 6MM2 45A 1500V", ["6MM2", "45A", "1500V"], "18 MONTHS"],
    ["solar-cables", "SUNPVCABLE1C6MMRED", "Red Solar Cable", "SUNPVCABLE1C6MMRED", ["Red", "6MM"], "18 MONTHS"],
    ["solar-cables", "SUNPVCABLE1C6MMBLACK", "Black Solar Cable", "SUNPVCABLE1C6MMBLACK", ["Black", "6MM"], "18 MONTHS"]
  ].map(([category, model, name, description, specifications, warranty]) => makeProduct("SUNTREE", {
    name,
    model,
    category,
    description,
    specifications,
    ...(warranty ? { warranty } : {}),
    page: category === "solar-connectors" || category === "solar-cables" ? 5 : 4
  }))
];

window.ElectronyEnergyProducts = Object.freeze(products);
window.ElectronyEnergyCategories = categoryLabels;
window.ElectronyEnergyFeaturedVideo = null;
window.ElectronyEnergyCatalogue = Object.freeze({
  filterEnergyProducts,
  getEnergyProductPage
});
