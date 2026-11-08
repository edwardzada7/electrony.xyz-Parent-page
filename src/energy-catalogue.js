const sourceDocument = "POWER-SOLAR PL-1.pdf";
const sourceDataSheetNote = "Please ask your sales rep for date sheet";
const priceSourceDocument = "POWER-SOLAR PL-1.pdf";
const confirmedPrices = Object.freeze({
  "JINKO|525M-72HL4-TV": { amountNgn: 83000, display: "83,000", page: 1 },
  "JINKO|595N-72HL4-BD": { amountNgn: 112000, display: "112,000", page: 1 },
  "JINKO|620N-66HL4-BD": { amountNgn: 122500, display: "122,500", page: 1 },
  "JINKO|625N-66HL4-BD": { amountNgn: 124000, display: "124,000", page: 1 },
  "JINKO|630N-66HL4-BD": { amountNgn: 125500, display: "125,500", page: 1 },
  "JINKO|640N-66HL4-BD": { amountNgn: 127000, display: "127,000", page: 1 },
  "JINKO|650N-66QL6-BD": { amountNgn: 140000, display: "140,000", page: 1 },
  "JINKO|725N-66HL5-BD": { amountNgn: 155000, display: "155,000", page: 1 },
  "HISENSE|INV6KS-AA1": { amountNgn: 359000, display: "359,000", page: 1 },
  "HISENSE|BATHEL5-E-BB1": { amountNgn: 810000, display: "810,000", page: 1 },
  "HISENSE|KETRANS50KVA-11/04": { amountNgn: 2700000, display: "2,700,000", page: 1 },
  "HISENSE|KETRANS100KVA-11/04": { amountNgn: 3750000, display: "3,750,000", page: 1 },
  "HISENSE|KETRANS200KVA-11/04": { amountNgn: 5600000, display: "5,600,000", page: 1 },
  "HISENSE|KETRANS315KVA-11/04": { amountNgn: 7350000, display: "7,350,000", page: 1 },
  "HISENSE|KETRANS500KVA-11/04": { amountNgn: 9550000, display: "9,550,000", page: 1 },
  "HISENSE|KETRANS800KVA-11/04": { amountNgn: 15250000, display: "15,250,000", page: 1 },
  "HISENSE|KETRANS1000KVA-11/04": { amountNgn: 16450000, display: "16,450,000", page: 1 },
  "DEYE|6/6KOG03LP1": { amountNgn: 463000, display: "463,000", page: 1 },
  "DEYE|8K-SG06LP1-EU": { amountNgn: 1255000, display: "1,255,000.00", page: 1 },
  "DEYE|12K-SG05LP3-E": { amountNgn: 1859000, display: "1,859,000.00", page: 1 },
  "DEYE|16K-SG01LP1-E": { amountNgn: 2275000, display: "2,275,000.00", page: 1 },
  "DEYE|20K-SG05LP3-E": { amountNgn: 2775000, display: "2,775,000.00", page: 1 },
  "DEYE|12K-SG06LP1-E": { amountNgn: 1799000, display: "1,799,000.00", page: 1 },
  "DEYE|50K-SG01HP3-E": { amountNgn: 4750000, display: "4,750,000.00", page: 2 },
  "DEYE|80K-SG02HP3-E": { amountNgn: 6500000, display: "6,500,000.00", page: 2 },
  "DEYE|125K-SG02HP3": { amountNgn: 8750000, display: "8,750,000.00", page: 2 },
  "DEYE|100K-G": { amountNgn: 3225000, display: "3,225,000.00", page: 2 },
  "DEYE|136K-G": { amountNgn: 4599000, display: "4,599,000.00", page: 2 },
  "DEYE|BATSE-F16-C": { amountNgn: 2250000, display: "2,250,000.00", page: 2 },
  "DEYE|SE-F5-L": { amountNgn: 849000, display: "849,000.00", page: 2 },
  "DEYE|BOS-GM-5.1 HV": { amountNgn: 1015000, display: "1,015,000.00", page: 2 },
  "DEYE|BOS-G-PRO51": { amountNgn: 1026500, display: "1,026,500.00", page: 2 },
  "DEYE|GB-W-12": { amountNgn: 2020000, display: "2,020,000.00", page: 2 },
  "DEYE|BOS-B-PACK16": { amountNgn: 2325000, display: "2,325,000.00", page: 2 },
  "DEYE|PDU-GB-W-2": { amountNgn: 1402000, display: "1,402,000.00", page: 2 },
  "DEYE|ACC-GB-W-PARTS": { amountNgn: 392000, display: "392,000", page: 2 },
  "DEYE|PCS 125K-L01HP3": { amountNgn: 5195000, display: "5,195,000.00", page: 2 },
  "DEYE|MPPT 200KW": { amountNgn: 2250000, display: "2,250,000.00", page: 2 },
  "DEYE|CONTROL BOX HV BOS-B-PDU-2-A": { amountNgn: 1950000, display: "1,950,000.00", page: 2 },
  "DEYE|STS 500L": { amountNgn: 7227500, display: "7,227,500.00", page: 2 },
  "DEYE|CONTROL BOX HV BOS-G-PDU-PRO": { amountNgn: 1015000, display: "1,015,000.00", page: 2 },
  "DEYE|DEYERACK-3U-H": { amountNgn: 565000, display: "565,000.00", page: 2 },
  "PYLON-TECH|PYLONBATFB-L-16 ( 16 Kwh )": { amountNgn: 2325000, display: "2,325,000", page: 2 },
  "PYLON-TECH|UF5000 (5.12 Kwh)": { amountNgn: 999000, display: "999,000.00", page: 2 },
  "PYLON-TECH|KIT-USC": { amountNgn: 40000, display: "40,000.00", page: 2 },
  "HUAWEI|POWER CABINET": { amountNgn: 7500000, display: "7,500,000", page: 2 },
  "HUAWEI|BATTERY CABINET": { amountNgn: 4375000, display: "4,375,000", page: 2 },
  "HUAWEI|ESM-48200A1": { amountNgn: 3850000, display: "3,850,000", page: 2 },
  "HUAWEI|ESM-48100A7": { amountNgn: 1999000, display: "1,999,000", page: 2 },
  "HUAWEI|I23003": { amountNgn: 327000, display: "327,000", page: 2 },
  "HUAWEI|PVDU-8kW": { amountNgn: 448500, display: "448,500", page: 3 },
  "HUAWEI|S4875": { amountNgn: 285500, display: "285,500", page: 3 },
  "HUAWEI|HUWINV100KTL-M2": { amountNgn: 5350000, display: "5,350,000", page: 3 },
  "HUAWEI|HUWINV150K-MG0": { amountNgn: 7350000, display: "7,350,000", page: 3 },
  "HUAWEI|LUNA 2000-97KWH": { amountNgn: 56500000, display: "56,500,000", page: 3 },
  "HUAWEI|LUNA 2000-129KWH": { amountNgn: 63000000, display: "63,000,000", page: 3 },
  "HUAWEI|LUNA 2000-215KWH": { amountNgn: 76800000, display: "76,800,000", page: 3 },
  "HUAWEI|INSTALLATION TRAY": { amountNgn: 2150000, display: "2,150,000", page: 3 },
  "HUAWEI|ATS 63A": { amountNgn: 1040000, display: "1,040,000", page: 3 },
  "HUAWEI|ATS 100A": { amountNgn: 1525000, display: "1,525,000", page: 3 },
  "HUAWEI|LQUID LEVEL SENSOR": { amountNgn: 795000, display: "795,000", page: 3 },
  "HUAWEI|TOUCH SCREEN": { amountNgn: 440000, display: "440,000", page: 3 },
  "HUAWEI|MERC-1300WP": { amountNgn: 95000, display: "95,000", page: 3 },
  "HUAWEI|DTSU666-HW": { amountNgn: 160000, display: "160,000", page: 3 },
  "HUAWEI|HUWSMARTMODUL1000A01": { amountNgn: 800000, display: "800,000", page: 3 },
  "HUAWEI|SMART LOGGER 3000A01EU": { amountNgn: 619000, display: "619,000", page: 3 },
  "GROWATT|SIM 6000ES PLUS-H + BATTERY + BASE 6KW + 5.5 KWH": { amountNgn: 1492000, display: "1,492,000", page: 3 },
  "GROWATT|ABM 5.5-A1-H": { amountNgn: 899000, display: "899,000", page: 3 },
  "GROWATT|SIM 6000ES PLUS-H + BATTERY + BASE 6KW + 5.12 kwh": { amountNgn: 1453000, display: "1,453,000", page: 3 },
  "GROWATT|ABM 5-LS-B1-H": { amountNgn: 860000, display: "860,000", page: 3 },
  "GROWATT|HOPE5L-B1": { amountNgn: 855000, display: "855,000", page: 3 },
  "GROWATT|HOPE16LM-A1": { amountNgn: 2325000, display: "2,325,000", page: 3 },
  "GROWATT|SPF 6000ES": { amountNgn: 455000, display: "455,000", page: 3 },
  "GROWATT|SPH 3600TL-BL-UP": { amountNgn: 450000, display: "450,000", page: 3 },
  "GROWATT|SPH 5000TL-BL-UP": { amountNgn: 500000, display: "500,000", page: 3 },
  "GROWATT|WIT-100K-HU": { amountNgn: 11050000, display: "11,050,000.00", page: 3 },
  "GROWATT|ACE-209H-2H": { amountNgn: 37000000, display: "37,000,000.00", page: 3 },
  "GROWATT|SEM-XA-RM": { amountNgn: 1020000, display: "1,020,000.00", page: 3 },
  "GROWATT|CT 600/5A": { amountNgn: 320000, display: "320,000", page: 3 },
  "TSTY Transformer|400kva 400-400v": { amountNgn: 8500000, display: "8,500,000.00", page: 3 },
  "TSTY Transformer|600kva 400-400v": { amountNgn: 12050000, display: "12,050,000.00", page: 3 },
  "ANTAI|ANTAIRAILCG010-01": { amountNgn: 20500, display: "20,500", page: 4 },
  "ANTAI|ANTAIMIDGN003-05": { amountNgn: 1000, display: "1,000", page: 4 },
  "ANTAI|ANTAILUGTYN16-01": { amountNgn: 1000, display: "1,000", page: 4 },
  "ANTAI|ANTAILFEETTYN353-01": { amountNgn: 1300, display: "1,300", page: 4 },
  "ANTAI|ANTAIJOINERCG037": { amountNgn: 1200, display: "1,200", page: 4 },
  "ANTAI|ANTAIENDCG018-01": { amountNgn: 1000, display: "1,000", page: 4 },
  "SUNTREE|SUNACGUARD63A-230V": { amountNgn: 7500, display: "7,500.00", page: 4 },
  "SUNTREE|SUNACSURGE20KA-275V": { amountNgn: 6000, display: "6,000.00", page: 4 },
  "SUNTREE|SUNACSURGE20KA-385V": { amountNgn: 12000, display: "12,000.00", page: 4 },
  "SUNTREE|SUNBRKAC100AMPS-2P": { amountNgn: 7000, display: "7,000.00", page: 4 },
  "SUNTREE|SUNBRKAC100AMPS-4P": { amountNgn: 14000, display: "14,000.00", page: 4 },
  "SUNTREE|SUNBRKAC20AMPS-2P": { amountNgn: 2450, display: "2,450.00", page: 4 },
  "SUNTREE|SUNBRKAC25AMPS-2P": { amountNgn: 2450, display: "2,450.00", page: 4 },
  "SUNTREE|SUNBRKAC25AMPS-4P": { amountNgn: 4800, display: "4,800.00", page: 4 },
  "SUNTREE|SUNBRKAC32AMPS-2P": { amountNgn: 2700, display: "2,700.00", page: 4 },
  "SUNTREE|SUNBRKAC32AMPS-4P": { amountNgn: 4900, display: "4,900.00", page: 4 },
  "SUNTREE|SUNBRKAC40AMPS-2P": { amountNgn: 2900, display: "2,900.00", page: 4 },
  "SUNTREE|SUNBRKAC63AMPS-2P": { amountNgn: 3500, display: "3,500.00", page: 4 },
  "SUNTREE|SUNBRKAC63AMPS-4P": { amountNgn: 6300, display: "6,300.00", page: 4 },
  "SUNTREE|SUNBRKDC125A-2P": { amountNgn: 22500, display: "22,500.00", page: 4 },
  "SUNTREE|SUNBRKDC63A-2P": { amountNgn: 13000, display: "13,000.00", page: 4 },
  "SUNTREE|SUNDB4WAY": { amountNgn: 3300, display: "3,300.00", page: 4 },
  "SUNTREE|SUNDB6WAY": { amountNgn: 4500, display: "4,500.00", page: 4 },
  "SUNTREE|SUNDB12WAY": { amountNgn: 7000, display: "7,000.00", page: 4 },
  "SUNTREE|SUNDB18WAY": { amountNgn: 11000, display: "11,000.00", page: 4 },
  "SUNTREE|SUNDB18WAYIP65": { amountNgn: 21000, display: "21,000.00", page: 4 },
  "SUNTREE|SUNDB24WAY": { amountNgn: null, display: null, page: 4 },
  "SUNTREE|SUNDB24WAYIP65": { amountNgn: 32000, display: "32,000.00", page: 4 },
  "SUNTREE|SUNDCISO25A-1500V": { amountNgn: 20000, display: "20,000.00", page: 4 },
  "SUNTREE|SUNDCISO32A-1000V-4P": { amountNgn: 18000, display: "18,000.00", page: 4 },
  "SUNTREE|SUNACMCCB100A-4P": { amountNgn: 60000, display: "60,000.00", page: 4 },
  "SUNTREE|SUNACMCCB-SM8E-125M": { amountNgn: 165000, display: "165,000.00", page: 4 },
  "SUNTREE|SUNACMCCB160A-4P": { amountNgn: 89000, display: "89,000.00", page: 4 },
  "SUNTREE|SUNMCCB250A-2P": { amountNgn: 80000, display: "80,000.00", page: 4 },
  "SUNTREE|SUNACMCCB-SM8E-250M": { amountNgn: 195000, display: "195,000.00", page: 4 },
  "SUNTREE|SUNDCMCCB400A-2P": { amountNgn: 195000, display: "195,000.00", page: 4 },
  "SUNTREE|SUNDCMCCB400A-1500V": { amountNgn: 440000, display: "440,000.00", page: 4 },
  "SUNTREE|SUNACMCCB250A-4P": { amountNgn: 100000, display: "100,000.00", page: 4 },
  "SUNTREE|SUNDCSURGE20KA-1000V": { amountNgn: 20000, display: "20,000.00", page: 4 },
  "SUNTREE|SUNENCLOSURE20X25X15": { amountNgn: 28300, display: "28,300.00", page: 4 },
  "SUNTREE|SUNENCLOSURE25X35X15": { amountNgn: 30500, display: "30,500.00", page: 4 },
  "SUNTREE|SUNENCLOSURE40X60X20": { amountNgn: 57000, display: "57,000.00", page: 4 },
  "SUNTREE|SUNENCLOSURE50X70X20": { amountNgn: 73000, display: "73,000.00", page: 4 },
  "SUNTREE|SUNENCLOSURE60X80X25": { amountNgn: 104000, display: "104,000.00", page: 4 },
  "SUNTREE|SUNFUSEDC20A-1000V": { amountNgn: 3000, display: "3,000.00", page: 5 },
  "SUNTREE|SUNMC4-45A": { amountNgn: 1200, display: "1,200.00", page: 5 },
  "SUNTREE|SUNPVCABLE1C6MMRED": { amountNgn: 1500, display: "1,500.00", page: 5 },
  "SUNTREE|SUNPVCABLE1C6MMBLACK": { amountNgn: 1500, display: "1,500.00", page: 5 }
});
const priceAdjustmentId = "energy-price-adjustments-2026-11-phase-1";
const explicitPriceAdjustments = Object.freeze({
  "DEYE|6/6KOG03LP1": 50000,
  "DEYE|8K-SG06LP1-EU": 135000,
  "DEYE|12K-SG05LP3-E": 140000,
  "DEYE|16K-SG01LP1-E": 225000,
  "DEYE|20K-SG05LP3-E": 304000,
  "DEYE|12K-SG06LP1-E": 179000,
  "DEYE|50K-SG01HP3-E": 1000000,
  "DEYE|80K-SG02HP3-E": 650000,
  "DEYE|125K-SG02HP3": 875000,
  "DEYE|100K-G": 300000,
  "DEYE|136K-G": 450000,
  "DEYE|BATSE-F16-C": 250000,
  "DEYE|SE-F5-L": 100000,
  "DEYE|BOS-GM-5.1 HV": 150000,
  "DEYE|BOS-G-PRO51": 150000,
  "DEYE|GB-W-12": 200000,
  "DEYE|PDU-GB-W-2": 150000,
  "DEYE|ACC-GB-W-PARTS": 100000,
  "DEYE|BOS-B-PACK16": 220000,
  "DEYE|PCS 125K-L01HP3": 500000,
  "DEYE|MPPT 200KW": 250000,
  "DEYE|CONTROL BOX HV BOS-B-PDU-2-A": 250000,
  "DEYE|STS 500L": 750000,
  "DEYE|CONTROL BOX HV BOS-G-PDU-PRO": 100000,
  "DEYE|DEYERACK-3U-H": 100000,
  "PYLON-TECH|PYLONBATFB-L-16 ( 16 Kwh )": 200000,
  "PYLON-TECH|UF5000 (5.12 Kwh)": 100000,
  "HUAWEI|POWER CABINET": 1500000,
  "HUAWEI|BATTERY CABINET": 950000,
  "HUAWEI|ESM-48200A1": 500000,
  "HUAWEI|ESM-48100A7": 500000,
  "HUAWEI|I23003": 70000,
  "HUAWEI|PVDU-8kW": 90000,
  "HUAWEI|HUWINV100KTL-M2": 500000,
  "HUAWEI|HUWINV150K-MG0": 1000000,
  "HUAWEI|LUNA 2000-97KWH": 19000000,
  "HUAWEI|LUNA 2000-129KWH": 19000000,
  "HUAWEI|LUNA 2000-215KWH": 19000000,
  "HISENSE|INV6KS-AA1": 45000,
  "HISENSE|BATHEL5-E-BB1": 95500
});
const brandLogos = Object.freeze({
  JINKO: "../assets/catalogue/energy/brands/jinko.png",
  HUAWEI: "../assets/catalogue/energy/brands/huawei.png",
  GROWATT: "../assets/catalogue/energy/brands/growatt.png",
  DEYE: "../assets/catalogue/energy/brands/deye.png",
  "PYLON-TECH": "../assets/catalogue/energy/brands/pylontech.png",
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

function getPriceAdjustmentAmount(brand, details) {
  if (details.category === "solar-panels") return 19000;
  if (brand === "HISENSE") {
    if (details.category === "solar-inverters") return 45000;
    if (details.category === "batteries-storage") return 95500;
    if (details.category === "transformers") {
      return /(?:^|[^0-9])(?:800|1000)\s*KVA/i.test(details.model || "") ? 2000000 : 1000000;
    }
  }
  return explicitPriceAdjustments[`${brand}|${details.model || ""}`] || 0;
}

function formatAdjustedPrice(priceNgn, originalDisplay) {
  const decimalSuffix = typeof originalDisplay === "string" && originalDisplay.includes(".") ? ".00" : "";
  return `${priceNgn.toLocaleString("en-US")}${decimalSuffix}`;
}

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
  const confirmedPrice = confirmedPrices[`${brand}|${details.model || ""}`];
  const basePriceNgn = confirmedPrice?.amountNgn;
  const isValidBasePrice = Number.isSafeInteger(basePriceNgn)
    && basePriceNgn >= 0
    && typeof confirmedPrice?.display === "string";
  const adjustmentAmountNgn = getPriceAdjustmentAmount(brand, details);
  const calculatedPriceNgn = isValidBasePrice ? basePriceNgn + adjustmentAmountNgn : null;
  const priceNgn = Number.isSafeInteger(calculatedPriceNgn) ? calculatedPriceNgn : null;
  const priceAdjustment = adjustmentAmountNgn > 0 && isValidBasePrice && priceNgn !== null
    ? Object.freeze({
      id: `${priceAdjustmentId}:${slug}`,
      batchId: priceAdjustmentId,
      amountNgn: adjustmentAmountNgn,
      previousPriceNgn: basePriceNgn
    })
    : null;
  const priceDisplay = priceNgn === null
    ? null
    : adjustmentAmountNgn > 0
      ? formatAdjustedPrice(priceNgn, confirmedPrice.display)
      : confirmedPrice.display;
  const sourceNote = details.sourceNote || (brand === "HUAWEI" ? sourceDataSheetNote : null);
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
    basePriceNgn: isValidBasePrice ? basePriceNgn : null,
    priceNgn,
    priceDisplay,
    ...(priceAdjustment ? { priceAdjustment } : {}),
    priceSource: Object.freeze({
      document: priceSourceDocument,
      page: confirmedPrice?.page ?? details.page
    }),
    ...(details.warranty ? { warranty: details.warranty } : {}),
    source: Object.freeze({ document: sourceDocument, page: details.page }),
    ...(sourceNote ? { sourceNote } : {}),
    ...(details.sourceUrl ? { sourceUrl: details.sourceUrl } : {}),
    ...(details.reviewNote ? { reviewNote: details.reviewNote } : {}),
    ...(details.video ? { video: details.video } : {}),
    image: Object.freeze({
      url: image.url,
      alt: image.alt,
      ...(image.note ? { note: image.note } : {})
    })
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
    ["525M-72HL4-TV", "525W", "525W Solar Panel Half Cut BIFACIAL(27)"],
    ["595N-72HL4-BD", "595W", "595W Solar Panel Half Cut BIFACIAL (36)"],
    ["620N-66HL4-BD", "620W", "Solar Panel Half Cut BIFACIAL(36)"],
    ["625N-66HL4-BD", "625W", "Solar Panel Half Cut BIFACIAL(36)"],
    ["630N-66HL4-BD", "630W", "Solar Panel Half Cut BIFACIAL(36)"],
    ["640N-66HL4-BD", "640W", "Solar Panel Half Cut BIFACIAL(36)"],
    ["650N-66QL6-BD", "650W", "3.0 SOLAR PANEL BIFACIAL (36)"],
    ["725N-66HL5-BD", "725W", "Solar Panel Half Cut BIFACIAL(33)"]
  ].map(([model, rating, description], index) => makeProduct("JINKO", {
    name: "Solar panel",
    model,
    category: "solar-panels",
    description,
    specifications: [rating, ...(description.includes("Half Cut") ? ["Half cut"] : []), description.match(/BIFACIAL ?\(\d+\)/i)?.[0] || "Bifacial"],
    warranty: "25 Years Linear Warranty + 10 Years Product Warranty",
    image: index < 4
      ? {
        url: "../assets/catalogue/energy/products/jinko/image (2).webp",
        alt: "Jinko solar panel product photograph; wattage-specific model is not identified."
      }
      : {
        url: "../assets/catalogue/energy/products/jinko/images (3).jpeg",
        alt: "Jinko solar panels product photograph; wattage-specific model is not identified."
      },
    page: 1
  })),

  makeProduct("HUAWEI", {
    name: "Power Cabinet",
    model: "POWER CABINET",
    category: "energy-storage-components",
    description: "1*Power Cabinet (indoor, including 4*4kW Battery Charger, 1*36kVA Bypass module, 1*D.G. interface module, Integrated cable, installation auxiliary material package, and software etc)",
    image: {
      url: "/energy/power%20cabinet%20and%20battery%20cabinet%20huawei.jpeg",
      alt: "Huawei power cabinet and battery cabinet shown together."
    },
    warranty: "5 Years",
    page: 2
  }),
  makeProduct("HUAWEI", {
    name: "Battery Cabinet",
    model: "BATTERY CABINET",
    category: "energy-storage-components",
    description: "1*Battery Cabinet (indoor, including Integrated cable, installation auxiliary material package, and software etc)",
    image: {
      url: "/energy/power%20cabinet%20and%20battery%20cabinet%20huawei.jpeg",
      alt: "Huawei power cabinet and battery cabinet shown together."
    },
    warranty: "5 Years",
    page: 2
  }),
  makeProduct("HUAWEI", {
    name: "Lithium Battery (10 kWh)",
    model: "ESM-48200A1",
    category: "batteries-storage",
    description: "Energy Storage Module,ESM-48200A1, 48V, 200Ah, 442mm (W) * 560mm (D) * 218mm (H)",
    specifications: ["10 kWh", "48V", "200Ah", "442mm (W) * 560mm (D) * 218mm (H)"],
    image: {
      url: "/energy/Huawei%20battery.webp",
      alt: "Huawei lithium battery cabinet."
    },
    warranty: "5 Years",
    page: 2
  }),
  makeProduct("HUAWEI", {
    name: "Lithium Battery (5 kWh)",
    model: "ESM-48100A7",
    category: "batteries-storage",
    description: "Energy Storage Module,ESM-48100A7, 48V, 100Ah, 442mm (W) * 396mm (D) * 130mm (H)",
    specifications: ["5 kWh", "48V", "100Ah", "442mm (W) * 396mm (D) * 130mm (H)"],
    image: {
      url: "/energy/Huawei%20battery.webp",
      alt: "Huawei lithium battery cabinet."
    },
    warranty: "5 Years",
    page: 2
  }),
  makeProduct("HUAWEI", {
    name: "High Efficiency Inverter Module",
    model: "I23003",
    category: "solar-inverters",
    description: "Inverter Module, I23003, 1U, 3kVA/2.5kW, High Efficiency",
    specifications: ["1U", "3kVA/2.5kW"],
    image: {
      url: "/energy/HIGH%20EFFICIENCY%20INVERTER%20MODULE.jpeg",
      alt: "Huawei high-efficiency inverter module."
    },
    warranty: "5 Years",
    page: 2
  }),
  makeProduct("HUAWEI", {
    name: "PV Distribution Unit",
    model: "PVDU-8kW",
    category: "energy-storage-components",
    description: "PV Distribution Unit, PVDU, DC Input, 150A, Front Cabling, 1U, 8kW",
    specifications: ["DC Input", "150A", "1U", "8kW"],
    image: {
      url: "../assets/catalogue/energy/products/huawei/PVDU-8kW.jpg",
      alt: "Huawei PVDU-8kW PV distribution unit."
    },
    warranty: "5 Years",
    page: 3
  }),
  makeProduct("HUAWEI", {
    name: "High Efficiency Solar Module",
    model: "S4875",
    category: "solar-inverters",
    description: "Solar Module, S4875, 1U, 4kW, High Efficiency",
    specifications: ["1U", "4kW"],
    image: {
      url: "../assets/catalogue/energy/products/huawei/HIGH EFFICIECNY SOLAR Module.jpg",
      alt: "Huawei high-efficiency solar module."
    },
    warranty: "5 Years",
    page: 3
  }),
  makeProduct("HUAWEI", {
    name: "Smart PV Controller",
    model: "HUWINV100KTL-M2",
    category: "solar-inverters",
    description: "Smart PV Controller, 150 KW",
    specifications: ["150 KW"],
    image: {
      url: "/energy/HUWINV100KTL-M2.jpg",
      alt: "Huawei HUWINV100KTL-M2 smart PV controller."
    },
    warranty: "5 Years",
    reviewNote: "The source associates model HUWINV100KTL-M2 with a 150 KW description; retain both as printed and verify before advising.",
    page: 3
  }),
  makeProduct("HUAWEI", {
    name: "Smart PV Controller",
    model: "HUWINV150K-MG0",
    category: "solar-inverters",
    description: "Smart PV Controller, 100 KW",
    specifications: ["100 KW"],
    image: {
      url: "/energy/HUWINV100KTL-M2.jpg",
      alt: "Huawei HUWINV150K-MG0 smart PV controller; the requested HUWINV100KTL-M2 photograph is used."
    },
    warranty: "5 Years",
    reviewNote: "The source associates model HUWINV150K-MG0 with a 100 KW description; retain both as printed and verify before advising.",
    page: 3
  }),
  ...[
    ["LUNA 2000-97KWH", "97KWH", "BESS 97KWH (Door Mounted distributed air conditioners, battery packs, battery rack, smart rack controller, PCS, Abort button)"],
    ["LUNA 2000-129KWH", "129KWH", "BESS 129KWH (Door Mounted distributed air conditioners, battery packs, battery rack, smart rack controller, PCS, Abort button)"],
    ["LUNA 2000-215KWH", "215KWH", "BESS 215KWH (Door Mounted distributed air conditioners, battery packs, battery rack, smart rack controller, PCS, Abort button)"]
  ].map(([model, capacity, description]) => makeProduct("HUAWEI", {
    name: "LUNA 2000 energy storage system",
    model,
    category: "energy-storage-systems",
    description,
    specifications: [capacity],
    sourceUrl: "https://solar.huawei.com/en/professionals/all-products/LUNA2000-97-129-161-200kwh/specs",
    image: {
      url: "/energy/LUNA%202000-97KWH.png",
      alt: `Huawei ${model} battery energy storage system; the requested LUNA 2000-97KWH photograph is used.`
    },
    warranty: "5 Years",
    page: 3
  })),
  makeProduct("HUAWEI", {
    name: "LUNA BESS Battery Installation Tray",
    model: "INSTALLATION TRAY",
    category: "energy-storage-components",
    description: "LUNA BESS BATTERY INSTALLATION TRAY",
    image: {
      url: "../assets/catalogue/energy/products/huawei/INSTALLATION TRAY.webp",
      alt: "Installation tray for a Huawei LUNA battery energy storage system."
    },
    page: 3
  }),
  makeProduct("HUAWEI", {
    name: "Auto Transform Switch",
    model: "ATS 63A",
    category: "energy-storage-components",
    description: "Auto Transform Switch 63A Max, 220/380Vac, 3 Phase, SPD Class B",
    specifications: ["63A Max", "220/380Vac", "3 Phase", "SPD Class B"],
    warranty: "5 Years",
    page: 3
  }),
  makeProduct("HUAWEI", {
    name: "Auto Transform Switch",
    model: "ATS 100A",
    category: "energy-storage-components",
    description: "Auto Transform Switch 100A Max, 220/380Vac, 3 Phase",
    specifications: ["100A Max", "220/380Vac", "3 Phase"],
    warranty: "5 Years",
    page: 3
  }),
  makeProduct("HUAWEI", {
    name: "Liquid Level Sensor",
    model: "LQUID LEVEL SENSOR",
    category: "energy-storage-components",
    description: "Two Wire 4-20mA, Measuring Range 2m, Cable Length 25m, With Flange Plate",
    specifications: ["Two Wire 4-20mA", "Measuring Range 2m", "Cable Length 25m", "With Flange Plate"],
    image: {
      url: "../assets/catalogue/energy/products/huawei/LQUID LEVEL SENSOR.webp",
      alt: "Huawei liquid-level sensor probe with cable."
    },
    warranty: "5 Years",
    page: 3
  }),
  makeProduct("HUAWEI", {
    name: "Touch Screen",
    model: "TOUCH SCREEN",
    category: "energy-storage-components",
    description: "Power-S Touch Screen Installed on the Indoor Cabinet",
    warranty: "5 Years",
    page: 3
  }),
  makeProduct("HUAWEI", {
    name: "Smart Optimizer",
    model: "MERC-1300WP",
    category: "power-optimizers",
    description: "Smart Optimizer 1300W",
    specifications: ["1300W"],
    image: {
      url: "../assets/catalogue/energy/products/huawei/MERC-1300WP.jpg",
      alt: "Huawei MERC-1300WP smart power optimizer."
    },
    warranty: "5 Years",
    page: 3
  }),
  makeProduct("HUAWEI", {
    name: "Smart Power Meter",
    model: "DTSU666-HW",
    category: "power-meters",
    description: "SMART POWER METER DTSU666-HW",
    image: {
      url: "../assets/catalogue/energy/products/huawei/DTSU666-HW.jpg",
      alt: "Huawei DTSU666-HW smart power meter."
    },
    page: 3
  }),
  makeProduct("HUAWEI", {
    name: "Smart Module / Data Logger",
    model: "HUWSMARTMODUL1000A01",
    category: "monitoring-communications",
    description: "Smart Module/data logger 1000A",
    specifications: ["1000A"],
    image: {
      url: "../assets/catalogue/energy/products/huawei/HUWSMARTMODUL1000A01.webp",
      alt: "Huawei SmartModule for PV system monitoring."
    },
    page: 3
  }),
  makeProduct("HUAWEI", {
    name: "Smart Logger",
    model: "SMART LOGGER 3000A01EU",
    category: "monitoring-communications",
    description: "Dedicated to monitoring and managing a PV power generating system. It can connect up to 80 devices and centrally monitors information regarding connected solar modules and inverters.",
    specifications: ["Connects up to 80 devices"],
    warranty: "5 Years",
    page: 3
  }),

  makeProduct("HISENSE", {
    name: "Inverter",
    model: "INV6KS-AA1",
    category: "solar-inverters",
    description: "6 KW, 48V, 9000 W MPPT Input, Built-in 120A MPPT Solar Charger, Wide Solar Input Range 60-500V, Support Lithium & Lead-acid Battery, Wifi Monitoring & Management, Dual AC Output, Parallel Support Up-to 9 Inverters",
    specifications: ["6 KW", "48V", "9000 W MPPT Input", "120A MPPT Solar Charger", "60-500V solar input", "Parallel support up to 9 inverters"],
    image: {
      url: "/energy/Hisense%20inverter.webp",
      alt: "Hisense inverter product photo; exact model is not visible."
    },
    warranty: "2 Years",
    page: 1
  }),
  makeProduct("HISENSE", {
    name: "Low Voltage Battery",
    model: "BATHEL5-E-BB1",
    category: "batteries-storage",
    description: "5.12 LOW VOLTAGE KWH 51.2V 100AH, COMES WITH A FREE PARALLEL CABLE KIT HISBATCABLEKIT-5-LV",
    specifications: ["5.12 kWh", "51.2V", "100Ah"],
    image: {
      url: "/energy/Hisense%20battery.webp",
      alt: "Hisense 51.2V 100Ah battery product photo; model label is not visible.",
      note: "The image shows a 51.2V 100Ah battery and parallel cable kit; the exact model is not visible."
    },
    warranty: "5 Years",
    page: 1
  }),

  ...[
    ["KETRANS50KVA-11/04", "50KVA", "STEPDOWN/UP 50KVA11/0.4KV,50Hz ,3Phase,400kg"],
    ["KETRANS100KVA-11/04", "100KVA", "STEPDOWN/UP 100KVA11/0.4KV,50Hz ,3Phase,574kg"],
    ["KETRANS200KVA-11/04", "200KVA", "STEPDOWN/UP 200KVA11/0.4KV,50Hz ,3Phase,856kg"],
    ["KETRANS315KVA-11/04", "315KVA", "STEPDOWN/UP 315KVA11/0.4KV,50Hz ,3Phase,"],
    ["KETRANS500KVA-11/04", "500KVA", "STEPDOWN/UP 500KVA11/0.4KV,50Hz ,3Phase,"],
    ["KETRANS800KVA-11/04", "800KVA", "STEPDOWN/UP 800KVA11/0.4KV,50Hz ,3Phase,"],
    ["KETRANS1000KVA-11/04", "1000KVA", "STEPDOWN/UP 1000KVA11/0.4KV,50Hz ,3Phase,"]
  ].map(([model, rating, description]) => makeProduct("HISENSE", {
    name: "Transformer",
    model,
    category: "transformers",
    description,
    specifications: [rating, "11/0.4KV", "50Hz", "3Phase"],
    warranty: "2 Years",
    page: 1
  })),

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
    page: 3
  })),
  makeProduct("GROWATT", {
    name: "Lithium-ion Battery",
    model: "ABM 5.5-A1-H",
    category: "batteries-storage",
    description: "Rechargeable Lithium Ion Battery 5.5 Kwh, 51.2 Vdc 100Ah, 98% DOD, 43 Kg, Cycle life > 6,000, IP 20",
    specifications: ["5.5 Kwh", "51.2 Vdc", "100Ah", "98% DOD", "43 Kg", "Cycle life > 6,000", "IP 20"],
    sourceNote: sourceDataSheetNote,
    page: 3
  }),
  makeProduct("GROWATT", {
    name: "Lithium-ion Battery",
    model: "ABM 5-LS-B1-H",
    category: "batteries-storage",
    description: "Rechargeable Lithium Ion Battery 5.12 Kwh, 51.2 Vdc 100Ah, 93% DOD, 440*540*130.5 mm, 45 Kg, Single string quantity 12 units, Cycle life > 6,000, IP 20",
    specifications: ["5.12 Kwh", "51.2 Vdc", "100Ah", "93% DOD", "440*540*130.5 mm", "45 Kg", "Single string quantity 12 units", "Cycle life > 6,000", "IP 20"],
    sourceNote: sourceDataSheetNote,
    page: 3
  }),
  makeProduct("GROWATT", {
    name: "Lithium-ion Battery",
    model: "HOPE5L-B1",
    category: "batteries-storage",
    description: "Rechargeable Lithium Ion Battery 5.12 KWH, 51.2 V, DoD up to 98%, Dimension (W/D/H): 440*480*130.5mm, 43 ± 2Kg, Max.48 packs parallel, IP20 + free cable kit",
    specifications: ["5.12 KWH", "51.2 V", "DoD up to 98%", "440*480*130.5mm", "43 ± 2Kg", "Max.48 packs parallel", "IP20"],
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 3
  }),
  makeProduct("GROWATT", {
    name: "Lithium-ion Battery",
    model: "HOPE16LM-A1",
    category: "batteries-storage",
    description: "Rechargeable Lithium Ion Battery 16 kwh, 51.2V, Operating voltage: 40~58.4V, Cycle life: 6000 (0.5C, 95% DOD), IP 20, 48 pcs in parallel",
    specifications: ["16 kwh", "51.2V", "40~58.4V", "6000 cycles (0.5C, 95% DOD)", "IP 20", "48 pcs in parallel"],
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 3
  }),
  ...[
    ["SPF 6000ES", "HYBRID, 6KW, 48V, 2 MPPT, Work with or without Battery, Configurable grid or solar input priority, WIFI Dongle Included for Monitoring, Parallel Up to 6 Units, Two AC input terminals with integrated transfer switch, Maximum PV Array Powe 8000W, Maximum PV input voltage up to 500VDC,", ["6KW", "48V", "2 MPPT", "Parallel Up to 6 Units", "Maximum PV Array Powe 8000W", "Maximum PV input voltage up to 500VDC"], "2 Years"],
    ["SPH 3600TL-BL-UP", "Hybrid 3.6KW 2MPPT, Smart Load Management Via Dry Contact, UPS Function < 10MS Transition, 1.5 DC/AC RATIO, Single Phase, Max. recommended PV power 7500W, Grid Side Parallel, Free Shine Wifi-X", ["3.6KW", "2MPPT", "UPS Function < 10MS Transition", "1.5 DC/AC RATIO", "Single Phase", "Max. recommended PV power 7500W"], "5 Years"],
    ["SPH 5000TL-BL-UP", "Hybrid 5KW 2MPPT, Smart Load Management Via Dry Contact, UPS Function < 10MS Transition, 1.5 DC/AC RATIO, Single Phase, Max. recommended PV power 7500W, Grid Side Parallel, Free Shine Wifi-X", ["5KW", "2MPPT", "UPS Function < 10MS Transition", "1.5 DC/AC RATIO", "Single Phase", "Max. recommended PV power 7500W"], "5 Years"],
    ["WIT-100K-HU", "Smart Hybrid 100KW ESS Inverter, 156KW PV Input, 10 MPPT Trackers, Smart Air Cooling, IP66", ["100KW", "156KW PV Input", "10 MPPT Trackers", "Smart Air Cooling", "IP66"], "5 Years"]
  ].map(([model, description, specifications, warranty]) => makeProduct("GROWATT", {
    name: "Inverter",
    model,
    category: "solar-inverters",
    description,
    specifications,
    warranty,
    sourceNote: sourceDataSheetNote,
    page: 3
  })),
  makeProduct("GROWATT", {
    name: "Battery Energy Storage System",
    model: "ACE-209H-2H",
    category: "energy-storage-systems",
    description: "209.6 Kwh BESS, Parallel up to 13 Units, 280Ah, Easy Installation",
    specifications: ["209.6 Kwh", "Parallel up to 13 Units", "280Ah"],
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 3
  }),
  makeProduct("GROWATT", {
    name: "Smart Energy Meter",
    model: "SEM-XA-RM",
    category: "power-meters",
    description: "Online monitoring and export limitation for the whole system, Up to 48 units of inverters in monitoring, Support Ethernet, RS485 communication, ommunication",
    specifications: ["Monitoring and export limitation", "Up to 48 inverters", "Ethernet", "RS485 communication"],
    warranty: "1 Year",
    sourceNote: sourceDataSheetNote,
    page: 3
  }),
  makeProduct("GROWATT", {
    name: "Current Transformer",
    model: "CT 600/5A",
    category: "energy-storage-components",
    description: "CT 600A/5A",
    specifications: ["600A/5A"],
    warranty: "1 Year",
    sourceNote: sourceDataSheetNote,
    page: 3
  }),

  ...[
    ["6/6KOG03LP1", "LV OFF-GRID 1-PHASE 6.6KW,Compatible with 18A PV Modules,200% Peak Output,Up to 97.6% Conversion Efficiency,4ms On/Off-Grid Switching,Max. 16 Units in Parallel,IP65 Protection Rating", ["6.6KW", "1-PHASE", "18A PV Modules", "200% Peak Output", "Up to 97.6% Conversion Efficiency", "4ms On/Off-Grid Switching", "Max. 16 Units in Parallel", "IP65"]],
    ["8K-SG06LP1-EU", "8KW Single phase, 48V Low Voltage Battery Supported, Max. 16 pcs parallel for on-grid and off-grid operation; Support multiple batteries parallel, Max. charging/discharging current of 190A", ["8KW", "Single phase", "48V Low Voltage Battery Supported", "Max. 16 pcs parallel", "Max. charging/discharging current of 190A"]],
    ["12K-SG05LP3-E", "12 KW Hybrid Inverter, Three Phase, Low Voltage, 15600W Mppt, Works with both Lead-acid or Li-lon Batteries, Max. 10 pcs parallel for on-grid and off-grid operation, Support multiple batteries parallel, Max. charging/discharging current of 240A", ["12 KW", "Three Phase", "Low Voltage", "15600W Mppt", "Max. 10 pcs parallel", "Max. charging/discharging current of 240A"]],
    ["16K-SG01LP1-E", "16 KW Hybrid Inverter, single Phase, Low Voltage ,3 MPPT ,LV Battery Supported , IP65 ,AC couple to retrofit existing solar system , Max. charging/discharging current of 380A ,LV Battery Supported ,WIFI, RS485 CAN,max 16 pcs parallel for on-grid/off-grid operation, Support multiple batteries parallel", ["16 KW", "single Phase", "Low Voltage", "3 MPPT", "IP65", "Max. charging/discharging current of 380A", "WIFI", "RS485 CAN", "max 16 pcs parallel"]],
    ["20K-SG05LP3-E", "20 KW Hybrid, Inverter, Three Phase, Low Voltage, 26000w Dual MPPT", ["20 KW", "Three Phase", "Low Voltage", "26000w Dual MPPT"]],
    ["12K-SG06LP1-E", "12kW Hybrid Inverter ,Single Phase , 48V Low Voltage Battery Supported, Max. 16 pcs parallel for on-grid and off-grid operation; Support multiple batteries parallel , Max. charging/discharging current of 250A", ["12kW", "Single Phase", "48V Low Voltage Battery Supported", "Max. 16 pcs parallel", "Max. charging/discharging current of 250A"]],
    ["50K-SG01HP3-E", "50 Kw Hybrid Inverter, Three Phase, High Voltage, 65000W Mppt, Max. 10 pcs parallel for on-grid and off-grid operation; Support multiple batteries parallel, Max. charging/discharging current of 100A", ["50 Kw", "Three Phase", "High Voltage", "65000W Mppt", "Max. 10 pcs parallel", "Max. charging/discharging current of 100A"]],
    ["80K-SG02HP3-E", "80KW HV HYBRID 3-PHASE , 100% unbalanced output each phase, AC couple to retrofit existing solar system, Max. 10 pcs parallel for on-grid and off-grid operation; Support multiple batteries parallel, 128 Kw PV Inout", ["80KW", "3-PHASE", "100% unbalanced output each phase", "AC couple to retrofit existing solar system", "Max. 10 pcs parallel", "128 Kw PV Inout"]],
    ["125K-SG02HP3", "125kw HV HYBRID 3-PHASE ,100% unbalanced output ,Max. 10 pcs parallel for on-grid and off-grid ,Max. charging/discharging current of 200A,IP 65", ["125kw", "HV HYBRID 3-PHASE", "100% unbalanced output", "Max. 10 pcs parallel", "Max. charging/discharging current of 200A", "IP 65"]],
    ["100K-G", "HV STRING 3-PHASE 100KW, 150KW DC Input, Max. 6 MPP trackers, Max. efficiency up to 98.8%", ["3-Phase", "100KW", "150KW DC Input", "Max. 6 MPP trackers", "Max. efficiency up to 98.8%"]],
    ["136K-G", "HV STRING 3-PHASE 136KW, 204KW DC Input, 8 MPPT", ["3-Phase", "136KW", "204KW DC Input", "8 MPPT"]]
  ].map(([model, description, specifications]) => makeProduct("DEYE", {
    name: "Inverter",
    model,
    category: "solar-inverters",
    description,
    specifications,
    image: {
      url: "/energy/deye%20inverter.webp",
      alt: "Deye inverter product photograph; the exact model is not visible."
    },
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: ["6/6KOG03LP1", "8K-SG06LP1-EU", "12K-SG05LP3-E", "16K-SG01LP1-E", "20K-SG05LP3-E", "12K-SG06LP1-E"].includes(model) ? 1 : 2
  })),
  ...[
    ["BATSE-F16-C", "Rechargeable Lithium Ion Low Voltage Battery, 16 KWH , 48 V , parallel up to 32 units in parallel", ["16 KWH", "48 V", "Parallel up to 32 units"], "10 Years"],
    ["SE-F5-L", "Rechargeable Lithium Ion Low Voltage Battery, 5.12 Kwh", ["5.12 Kwh", "Low Voltage"], "5 Years"],
    ["BOS-GM-5.1 HV", "Rechargeable Lithium Ion High Voltage Battery, 5.12 Kwh 0.5C", ["5.12 Kwh", "High Voltage", "0.5C"], "10 Years"],
    ["BOS-G-PRO51", "Rechargeable Lithium Ion High Voltage Battery, 5.12 Kwh", ["5.12 Kwh", "High Voltage"], "10 Years"],
    ["GB-W-12", "Rechargeable Lithium Ion High Voltage Battery 12 KWH ,IP20 GB-W , 51.2Vdc , dod 90% ,Expandable up TP approximately 3 MWh ,Over 6,000 cycles", ["12 KWH", "IP20 GB-W", "51.2Vdc", "dod 90%", "Expandable up TP approximately 3 MWh", "Over 6,000 cycles"], "10 Years"],
    ["BOS-B-PACK16", "HV BATTERY PACK 16 kwh B-PRO", ["16 kwh", "High Voltage", "B-PRO"], "10 Years"]
  ].map(([model, description, specifications, warranty]) => makeProduct("DEYE", {
    name: "Battery",
    model,
    category: "batteries-storage",
    description,
    specifications,
    image: {
      url: "/energy/deye%20battery.webp",
      alt: "Deye battery product photograph; the exact model is not visible."
    },
    warranty,
    sourceNote: sourceDataSheetNote,
    page: 2
  })),
  ...[
    ["PDU-GB-W-2", "Battery Control Box", "GB-W HV CONTROL BOX+BASE", ["GB-W"]],
    ["ACC-GB-W-PARTS", "Battery Base", "GB-W BASE+RAIL+COVER", ["GB-W"]],
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
    ...(["CONTROL BOX HV BOS-B-PDU-2-A", "CONTROL BOX HV BOS-G-PDU-PRO"].includes(model) ? {
      image: {
        url: "../assets/catalogue/energy/products/deye/battery-control-box-family.webp",
        alt: "Deye high-voltage battery control-box family image; the exact model is not visible.",
        note: "Shared family-level image: the photo does not distinguish the BOS-B and BOS-G control-box models."
      }
    } : {}),
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 2
  })),

  makeProduct("PYLON-TECH", {
    name: "Lithium Battery",
    model: "PYLONBATFB-L-16 ( 16 Kwh )",
    category: "batteries-storage",
    description: "16KWH, 51.2V, LV, ELEGANT DESIGN, FLEXIBLE INSTALLATION, SMART MONITORING, APP & LED DISPLAY, WHEELS INCLUDED",
    specifications: ["16KWH", "51.2V", "LV", "ELEGANT DESIGN", "FLEXIBLE INSTALLATION", "SMART MONITORING", "APP & LED DISPLAY", "WHEELS INCLUDED"],
    image: {
      url: "/energy/Polytech%20battery.webp",
      alt: "Pylontech 16 kWh lithium battery."
    },
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 2
  }),
  makeProduct("PYLON-TECH", {
    name: "Lithium Battery",
    model: "UF5000 (5.12 Kwh)",
    category: "batteries-storage",
    description: "Rechargeable Lithium Ion Battery 5120 Wh 51.2Vdc 100Ah, 95% DOD, 442*452.6*161 mm, 42 kg, Single string quantity 20 units, Cycle life > 6,000",
    specifications: ["5.12 kWh", "51.2Vdc", "100Ah", "95% DOD", "442*452.6*161 mm", "42 kg", "Single string quantity 20 units", "Cycle life > 6,000"],
    image: {
      url: "/energy/Polytech%205.1kwh%20battery.webp",
      alt: "Pylontech UF5000 5.12 kWh lithium battery."
    },
    warranty: "5 Years",
    sourceNote: sourceDataSheetNote,
    page: 2
  }),
  makeProduct("PYLON-TECH", {
    name: "External Cable Kit",
    model: "KIT-USC",
    category: "energy-storage-components",
    description: "External Cable Kit-USC (Connect Battery to Inverter)",
    sourceNote: sourceDataSheetNote,
    page: 2
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
    page: 4
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
    page: category === "fuses" || category === "solar-connectors" || category === "solar-cables" ? 5 : 4
  }))
];

window.ElectronyEnergyProducts = Object.freeze(products);
window.ElectronyEnergyCategories = categoryLabels;
window.ElectronyEnergyFeaturedVideo = null;
window.ElectronyEnergyCatalogue = Object.freeze({
  filterEnergyProducts,
  getEnergyProductPage
});
