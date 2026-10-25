const dongfengBrochure = "Dongfeng Range - Fouani Nigeria (no contacts).pdf";

const automobileVehicles = [
  {
    id: "nammi-box",
    brand: "NAMMI",
    name: "NAMMI BOX",
    category: "Urban Electric",
    vehicleType: "Fully electric hatchback",
    powertrain: "Fully electric (BEV)",
    powertrainKey: "bev",
    seats: "5",
    priceLabel: "Request current price",
    statusLabel: "Confirm availability",
    imageAlt: "NAMMI BOX fully electric hatchback in the Fouani Nigeria brochure",
    images: [
      "../assets/automobile/vehicles/nammi-box/01-exterior.jpg",
      "../assets/automobile/vehicles/nammi-box/02-cabin-detail.jpg",
      "../assets/automobile/vehicles/nammi-box/03-cabin-detail.jpg"
    ],
    videos: [{
      src: "../assets/automobile/vehicles/nammi-box/01-walkaround.mp4/VID-20261010-WA0038.mp4",
      title: "Vehicle walkaround"
    }],
    youtubeVideo: null,
    headlineSpecifications: ["70 kW electric motor", "31.4 kWh battery", "330 km electric range (CLTC)", "5 seats"],
    specificationGroups: [
      { title: "Performance & powertrain", items: ["70 kW electric motor", "Smooth, silent electric drive", "Quick, responsive pick-up in traffic"] },
      { title: "Battery & range", items: ["31.4 kWh battery", "330 km electric range (CLTC)"] },
      { title: "Comfort & cabin", items: ["12.8-inch central touchscreen", "5-inch digital instrument cluster", "1 front USB charging port*", "Premium fabric / leather seats*", "Wireless phone connectivity*", "Multi-function steering wheel", "Smart climate control", "Smart keyless entry", "Push-button start"] },
      { title: "Safety & technology", items: ["Rear parking camera", "Parking sensors", "ABS & Electronic Stability Control"] }
    ],
    source: { brochure: dongfengBrochure, publisher: "Fouani Nigeria Ltd", pdfPage: 4, modelPage: 1 },
    featured: false
  },
  {
    id: "nammi-06-vigo",
    brand: "NAMMI",
    name: "NAMMI 06 VIGO",
    category: "Urban Electric",
    vehicleType: "Fully electric crossover",
    powertrain: "Fully electric (BEV)",
    powertrainKey: "bev",
    seats: "5",
    priceLabel: "Request current price",
    statusLabel: "Confirm availability",
    imageAlt: "NAMMI 06 VIGO fully electric crossover in the Fouani Nigeria brochure",
    images: [
      "../assets/automobile/vehicles/nammi-06-vigo/01-exterior.jpg",
      "../assets/automobile/vehicles/nammi-06-vigo/02-cabin-detail.jpg",
      "../assets/automobile/vehicles/nammi-06-vigo/03-cabin-detail.jpg"
    ],
    videos: [],
    youtubeVideo: null,
    headlineSpecifications: ["135 kW (184 PS) motor", "51.9 kWh battery", "471 km electric range (CLTC)", "5 seats"],
    specificationGroups: [
      { title: "Performance & powertrain", items: ["135 kW (184 PS) electric motor", "Quiet, refined electric drive", "Excellent energy efficiency"] },
      { title: "Battery & range", items: ["51.9 kWh battery", "Up to 471 km electric range (CLTC)"] },
      { title: "Comfort & cabin", items: ["12.8-inch touchscreen multimedia", "8.8-inch digital instrument cluster", "Premium modern cabin", "Ergonomic, supportive seats", "Spacious rear seating", "USB charging ports", "Smart connectivity"] },
      { title: "Safety & technology", items: ["Six airbags", "Reverse camera", "Rear parking sensors", "Electronic Stability Control"] }
    ],
    source: { brochure: dongfengBrochure, publisher: "Fouani Nigeria Ltd", pdfPage: 5, modelPage: 2 },
    featured: false
  },
  {
    id: "mage-m57",
    brand: "Dongfeng",
    name: "MAGE M57",
    category: "Family & Mid-Size SUVs",
    vehicleType: "Turbo petrol SUV",
    powertrain: "Petrol",
    powertrainKey: "petrol",
    seats: "5",
    priceLabel: "Request current price",
    statusLabel: "Confirm availability",
    imageAlt: "Dongfeng MAGE M57 turbo petrol SUV in the Fouani Nigeria brochure",
    images: [
      "../assets/automobile/vehicles/mage-m57/01-exterior.jpg",
      "../assets/automobile/vehicles/mage-m57/02-cabin-detail.jpg"
    ],
    videos: [{
      src: "../assets/automobile/vehicles/mage-m57/01-walkaround.mp4/VID-20261010-WA0036.mp4",
      title: "Vehicle walkaround"
    }],
    youtubeVideo: null,
    featured: true,
    headlineSpecifications: ["1.5L turbo petrol, 204 hp", "7-speed DCT automatic", "5 seats"],
    specificationGroups: [
      { title: "Performance & powertrain", items: ["1.5L turbo petrol engine, 204 hp", "7-speed DCT automatic", "Strong fuel economy", "Smooth, confident acceleration", "Stable and composed on the highway"] },
      { title: "Comfort & cabin", items: ["13.2-inch central touchscreen", "10.25-inch digital instrument cluster", "Premium leather interior", "Panoramic sunroof*", "Dual-zone air conditioning*", "Ambient lighting*", "Generous boot"] },
      { title: "Safety & technology", items: ["360-degree camera", "Adaptive cruise control*", "Blind-spot monitoring*", "Parking assist", "Multiple airbags", "Electronic Stability Control"] }
    ],
    source: { brochure: dongfengBrochure, publisher: "Fouani Nigeria Ltd", pdfPage: 6, modelPage: 3 }
  },
  {
    id: "mage-s01-ev",
    brand: "Dongfeng",
    name: "MAGE S01 EV",
    category: "Family & Mid-Size SUVs",
    vehicleType: "Fully electric SUV",
    powertrain: "Fully electric (BEV)",
    powertrainKey: "bev",
    seats: "5",
    priceLabel: "Request current price",
    statusLabel: "Confirm availability",
    imageAlt: "Dongfeng MAGE S01 EV fully electric SUV in the Fouani Nigeria brochure",
    images: [
      "../assets/automobile/vehicles/mage-s01-ev/01-exterior.jpg",
      "../assets/automobile/vehicles/mage-s01-ev/02-cabin-detail.jpg"
    ],
    videos: [],
    youtubeVideo: null,
    headlineSpecifications: ["120 kW motor, 240 Nm", "50.8 kWh LFP battery", "403 km electric range (CLTC)", "5 seats"],
    specificationGroups: [
      { title: "Performance & powertrain", items: ["120 kW electric motor", "240 Nm torque", "Instant torque", "Silent, smooth driving", "Very low operating cost"] },
      { title: "Battery & range", items: ["50.8 kWh LFP battery", "403 km electric range (CLTC)"] },
      { title: "Comfort & cabin", items: ["10.4-inch central touchscreen", "10.25-inch digital instrument cluster", "2 USB ports: USB-A front, USB-C rear", "Wireless phone charging*", "Leather seats*", "Panoramic roof*"] },
      { title: "Safety & technology", items: ["Driver assistance systems", "Lane keeping assist*", "360-degree camera", "Collision warning*", "Electronic safety package*"] }
    ],
    source: { brochure: dongfengBrochure, publisher: "Fouani Nigeria Ltd", pdfPage: 7, modelPage: 4 }
  },
  {
    id: "huge-g59",
    brand: "Dongfeng",
    name: "HUGE G59",
    category: "Family & Mid-Size SUVs",
    vehicleType: "Mid-size petrol SUV",
    powertrain: "Petrol",
    powertrainKey: "petrol",
    seats: "5",
    priceLabel: "Request current price",
    statusLabel: "Confirm availability",
    imageAlt: "Dongfeng HUGE G59 mid-size petrol SUV in the Fouani Nigeria brochure",
    images: [
      "../assets/automobile/vehicles/huge-g59/01-exterior.jpg",
      "../assets/automobile/vehicles/huge-g59/02-cabin-detail.jpg"
    ],
    videos: [],
    youtubeVideo: null,
    headlineSpecifications: ["1.5L turbo, 201 hp / 305 Nm", "7-speed DCT automatic", "5 seats"],
    specificationGroups: [
      { title: "Performance & powertrain", items: ["1.5L turbo petrol engine, 201 hp / 305 Nm", "7-speed DCT automatic", "Smooth highway performance", "Strong fuel economy", "Comfort-tuned suspension"] },
      { title: "Dimensions & seating", items: ["About 4.72 m long", "Spacious second row", "5 seats"] },
      { title: "Comfort & cabin", items: ["Premium interior finish", "Large panoramic sunroof*", "Leather seats*", "Large infotainment display", "Premium sound system*"] },
      { title: "Safety & technology", items: ["Advanced safety systems", "360-degree parking camera", "Adaptive cruise control*", "Driver assistance systems", "Multiple airbags"] }
    ],
    source: { brochure: dongfengBrochure, publisher: "Fouani Nigeria Ltd", pdfPage: 8, modelPage: 5 }
  },
  {
    id: "epi-008",
    brand: "Dongfeng",
    name: "eπ 008",
    category: "Family & Mid-Size SUVs",
    vehicleType: "Six-seat extended-range SUV",
    powertrain: "Extended-range electric (EREV)",
    powertrainKey: "erev",
    seats: "6",
    priceLabel: "Request current price",
    statusLabel: "Confirm availability",
    imageAlt: "Dongfeng eπ 008 six-seat extended-range SUV in the Fouani Nigeria brochure",
    images: [
      "../assets/automobile/vehicles/epi-008/01-exterior.jpg",
      "../assets/automobile/vehicles/epi-008/02-cabin-detail.jpg"
    ],
    videos: [{
      src: "../assets/automobile/vehicles/epi-008/01 walkaround.mp4/VID-20261010-WA0035.mp4",
      title: "Vehicle walkaround"
    }],
    youtubeVideo: null,
    featured: true,
    hero: true,
    headlineSpecifications: ["200 kW (268 hp) rear motor", "34.3 kWh battery*", "202 km electric / up to 1,220 km total (CLTC)", "6 seats"],
    specificationGroups: [
      { title: "Performance & powertrain", items: ["200 kW (268 hp) rear electric motor", "1.5T petrol engine works only as a generator"] },
      { title: "Battery & range", items: ["34.3 kWh battery*", "202 km on battery alone (CLTC)", "Up to 1,220 km total range with range extender (CLTC)"] },
      { title: "Seating & comfort", items: ["Six-seat 2+2+2 layout", "15.6-inch 2.5K central touchscreen", "10.25-inch digital instrument cluster", "15.6-inch fold-down rear roof screen", "Heated, ventilated & massage front seats*", "20-speaker sound system*"] },
      { title: "Safety & technology", items: ["eπ PILOT driver assistance", "360-degree surround camera", "Intelligent parking assist", "Adaptive cruise with lane keeping", "Multiple airbags & active safety", "Over-the-air updates*"] }
    ],
    source: { brochure: dongfengBrochure, publisher: "Fouani Nigeria Ltd", pdfPage: 9, modelPage: 6 }
  },
  {
    id: "shine-c65",
    brand: "Dongfeng",
    name: "SHINE C65",
    category: "Sedans & Crossovers",
    vehicleType: "Petrol sedan",
    powertrain: "Petrol",
    powertrainKey: "petrol",
    seats: "5",
    priceLabel: "Request current price",
    statusLabel: "Confirm availability",
    imageAlt: "Dongfeng SHINE C65 petrol sedan in the Fouani Nigeria brochure",
    images: [
      "../assets/automobile/vehicles/shine-c65/01-exterior.jpg",
      "../assets/automobile/vehicles/shine-c65/02-cabin-detail.jpg"
    ],
    videos: [{
      src: "../assets/automobile/vehicles/shine-c65/01-walkaround.mp4/VID-20261010-WA0034.mp4",
      title: "Vehicle walkaround"
    }],
    youtubeVideo: null,
    headlineSpecifications: ["1.5L petrol, 123 hp / 158 Nm", "6-speed DCT automatic", "5 seats"],
    specificationGroups: [
      { title: "Performance & powertrain", items: ["1.5L petrol engine, 123 hp / 158 Nm", "6-speed DCT automatic", "Low fuel consumption", "Comfortable city driving"] },
      { title: "Comfort & cabin", items: ["Modern dashboard design", "Comfortable seating", "Smart infotainment system", "Spacious cabin", "Rear AC vents*", "Multi-function steering wheel"] },
      { title: "Safety & technology", items: ["Rear camera", "Parking sensors", "ABS braking system", "Electronic Stability Control", "Multiple airbags"] }
    ],
    source: { brochure: dongfengBrochure, publisher: "Fouani Nigeria Ltd", pdfPage: 10, modelPage: 7 }
  },
  {
    id: "shine-gs-c68",
    brand: "Dongfeng",
    name: "SHINE GS C68",
    category: "Sedans & Crossovers",
    vehicleType: "Petrol sport crossover",
    powertrain: "Petrol",
    powertrainKey: "petrol",
    seats: "5",
    priceLabel: "Request current price",
    statusLabel: "Confirm availability",
    imageAlt: "Dongfeng SHINE GS C68 petrol sport crossover in the Fouani Nigeria brochure",
    images: [
      "../assets/automobile/vehicles/shine-gs-c68/01-exterior.jpg",
      "../assets/automobile/vehicles/shine-gs-c68/02-cabin-detail.jpg",
      "../assets/automobile/vehicles/shine-gs-c68/03-cabin-detail.jpg"
    ],
    videos: [],
    youtubeVideo: null,
    headlineSpecifications: ["1.5L petrol engine, 117 hp", "Automatic gearbox", "5 seats"],
    specificationGroups: [
      { title: "Performance & powertrain", items: ["1.5L petrol engine, 117 hp", "Automatic gearbox", "Agile, precise handling", "Excellent fuel economy"] },
      { title: "Comfort & cabin", items: ["Sport-inspired interior", "Premium cabin materials", "Smart multimedia system", "Generous luggage capacity", "Comfortable rear seats", "Smart connectivity", "Ambient lighting*"] },
      { title: "Safety & technology", items: ["Driver assistance systems*", "Rear camera", "Stability control"] }
    ],
    source: { brochure: dongfengBrochure, publisher: "Fouani Nigeria Ltd", pdfPage: 11, modelPage: 8 }
  },
  {
    id: "voyah-dream",
    brand: "VOYAH",
    name: "VOYAH DREAM",
    category: "VOYAH Premium",
    vehicleType: "Plug-in hybrid luxury MPV",
    powertrain: "Plug-in hybrid (PHEV)",
    powertrainKey: "phev",
    seats: "7",
    priceLabel: "Request current price",
    statusLabel: "Confirm availability",
    imageAlt: "VOYAH DREAM plug-in hybrid luxury MPV in the Fouani Nigeria brochure",
    images: [
      "../assets/automobile/vehicles/voyah-dream/01-exterior.jpg",
      "../assets/automobile/vehicles/voyah-dream/02-cabin-detail.jpg",
      "../assets/automobile/vehicles/voyah-dream/03-cabin-detail.jpg"
    ],
    videos: [],
    youtubeVideo: null,
    headlineSpecifications: ["380 kW total power", "62.5 kWh battery", "350 km electric / up to 1,530 km total (CLTC)", "7 seats"],
    specificationGroups: [
      { title: "Performance & powertrain", items: ["1.5T plug-in hybrid, 380 kW total, 4WD", "Smooth, luxurious ride"] },
      { title: "Battery & range", items: ["62.5 kWh battery", "350 km on battery alone (CLTC)", "Up to 1,530 km total hybrid range (CLTC)"] },
      { title: "Seating & comfort", items: ["7 seats (2+2+3)", "15.6-inch central touchscreen", "17.3-inch rear ceiling entertainment screen", "29-inch AR head-up display", "Digital instrument cluster", "Zero-gravity second-row captain seats, 26-point massage", "13 L fridge"] },
      { title: "Safety & technology", items: ["Advanced driver assistance", "Adaptive cruise control", "360-degree camera", "Intelligent parking assist", "Advanced safety package"] }
    ],
    source: { brochure: dongfengBrochure, publisher: "Fouani Nigeria Ltd", pdfPage: 12, modelPage: 9 }
  },
  {
    id: "voyah-taishan",
    brand: "VOYAH",
    name: "VOYAH TAISHAN",
    category: "VOYAH Premium",
    vehicleType: "Plug-in hybrid luxury SUV",
    powertrain: "Plug-in hybrid (PHEV)",
    powertrainKey: "phev",
    seats: "6",
    priceLabel: "Request current price",
    statusLabel: "Confirm availability",
    imageAlt: "VOYAH TAISHAN plug-in hybrid luxury SUV in the Fouani Nigeria brochure",
    images: [
      "../assets/automobile/vehicles/voyah-taishan/01-exterior.jpg",
      "../assets/automobile/vehicles/voyah-taishan/02-cabin-detail.jpg",
      "../assets/automobile/vehicles/voyah-taishan/03-cabin-detail.jpg"
    ],
    videos: [],
    youtubeVideo: null,
    featured: true,
    headlineSpecifications: ["380 kW total power", "65 kWh CATL battery", "About 290 km electric / up to 1,430 km total (CLTC)", "6 seats"],
    specificationGroups: [
      { title: "Performance & powertrain", items: ["1.5T plug-in hybrid, 380 kW, 4WD", "0–100 km/h in 5.2 seconds"] },
      { title: "Battery & range", items: ["65 kWh CATL battery", "About 290 km on battery alone (CLTC)*", "Up to 1,430 km total hybrid range (CLTC)"] },
      { title: "Seating & comfort", items: ["Six seats", "10 screens in total", "16.1-inch central touchscreen", "21.4-inch rear ceiling screen", "55-inch AR head-up display", "3.5-inch armrest control screens", "Zero-gravity second-row seats, massage on 4 seats"] },
      { title: "Safety & technology", items: ["Huawei ADS advanced driver assistance", "Lidar-based sensing", "Adaptive suspension", "Intelligent parking assist", "High-level safety systems"] }
    ],
    source: { brochure: dongfengBrochure, publisher: "Fouani Nigeria Ltd", pdfPage: 13, modelPage: 10 }
  },
  {
    id: "voyah-free-plus",
    brand: "VOYAH",
    name: "VOYAH FREE+",
    category: "VOYAH Premium",
    vehicleType: "Range-extended electric SUV",
    powertrain: "Extended-range electric (EREV)",
    powertrainKey: "erev",
    seats: "5",
    priceLabel: "Request current price",
    statusLabel: "Confirm availability",
    imageAlt: "VOYAH FREE+ range-extended electric SUV in the Fouani Nigeria brochure",
    images: [
      "../assets/automobile/vehicles/voyah-free-plus/01-exterior.jpg",
      "../assets/automobile/vehicles/voyah-free-plus/02-cabin-detail.jpg"
    ],
    videos: [{
      src: "../assets/automobile/vehicles/voyah-free-plus/01-walkaround.mp4/VID-20261010-WA0041.mp4",
      title: "Vehicle walkaround"
    }],
    youtubeVideo: null,
    headlineSpecifications: ["215 kW electric motor", "43.2 kWh battery", "318 km electric / up to 1,458 km total (CLTC)", "5 seats"],
    specificationGroups: [
      { title: "Performance & powertrain", items: ["215 kW electric motor", "1.5L petrol engine works only as a generator"] },
      { title: "Battery & range", items: ["43.2 kWh battery", "318 km on battery alone (CLTC)", "Up to 1,458 km total with range extender (CLTC)"] },
      { title: "Comfort & cabin", items: ["15.6-inch 2K central touchscreen", "10.25-inch digital instrument cluster", "29-inch AR head-up display", "Rear passenger control screen", "Luxury leather seats", "Panoramic sunroof* · ambient lighting*"] },
      { title: "Safety & technology", items: ["Huawei ADS 4 advanced driver assistance", "Adaptive cruise control", "Intelligent parking assist", "Full safety suite"] }
    ],
    source: { brochure: dongfengBrochure, publisher: "Fouani Nigeria Ltd", pdfPage: 14, modelPage: 11 }
  },
  {
    id: "m-hero-ii-817",
    brand: "M-HERO",
    name: "M-HERO II 817",
    category: "M-HERO Off-Road",
    vehicleType: "Plug-in hybrid off-road SUV",
    powertrain: "Plug-in hybrid (PHEV)",
    powertrainKey: "phev",
    seats: "5",
    priceLabel: "Request current price",
    statusLabel: "Confirm availability",
    imageAlt: "M-HERO II 817 plug-in hybrid off-road SUV in the Fouani Nigeria brochure",
    images: ["../assets/automobile/vehicles/m-hero-ii-817/01-exterior.jpg"],
    videos: [{
      src: "../assets/automobile/vehicles/m-hero-ii-817/01-walkaround.mp4/VID-20261010-WA0040.mp4",
      title: "Vehicle walkaround"
    }],
    youtubeVideo: null,
    featured: true,
    headlineSpecifications: ["505 kW (687 hp), 848 Nm", "31.7 kWh battery", "140 km electric / up to 1,300 km total (CLTC)", "5 seats"],
    specificationGroups: [
      { title: "Performance & powertrain", items: ["1.5T plug-in hybrid + dual motors", "505 kW (687 hp) · 848 Nm", "0–100 km/h in 5.2 seconds", "6 kW power output for devices"] },
      { title: "Battery & range", items: ["31.7 kWh battery", "140 km on battery alone (CLTC)", "Up to 1,300 km total hybrid range (CLTC)"] },
      { title: "Off-road", items: ["Air suspension, 150 mm height adjust*", "Crab walk (20° rear-wheel steering)", "Tank turn, 3.5 m turning circle", "Intelligent electronic diff lock", "900 mm wading depth", "333 mm+ ground clearance", "9 driving & terrain modes"] },
      { title: "Comfort & cabin", items: ["15.6-inch central touchscreen", "10.25-inch digital cluster", "Head-up display · streaming mirror", "Rear passenger screen", "18-speaker Dynaudio sound", "Nappa leather; heated, ventilated, massage front seats", "Fridge · dual 50 W wireless chargers"] },
      { title: "Safety & technology", items: ["Huawei ADS 4 driver assistance", "27 sensors incl. lidar", "HarmonySpace 5 smart cockpit", "360-degree camera", "Off-road assistance systems", "Intelligent parking assist", "Over-the-air updates*"] }
    ],
    source: { brochure: dongfengBrochure, publisher: "Fouani Nigeria Ltd", pdfPage: 15, modelPage: 12 }
  },
  {
    id: "m-hero-i",
    brand: "M-HERO",
    name: "M-HERO I",
    category: "M-HERO Off-Road",
    vehicleType: "Extended-range off-road SUV",
    powertrain: "Extended-range electric (EREV)",
    powertrainKey: "erev",
    seats: "5",
    priceLabel: "Request current price",
    statusLabel: "Confirm availability",
    imageAlt: "M-HERO I extended-range off-road SUV in the Fouani Nigeria brochure",
    images: ["../assets/automobile/vehicles/m-hero-i/01-exterior.jpg"],
    videos: [{
      src: "../assets/automobile/vehicles/m-hero-i/01-walkaround.mp4/VID-20261010-WA0039.mp4",
      title: "Vehicle walkaround"
    }],
    youtubeVideo: null,
    headlineSpecifications: ["600 kW (816 PS), 1,050 Nm", "66 kWh battery", "200 km electric / up to 1,032 km total (CLTC)", "5 seats"],
    specificationGroups: [
      { title: "Performance & powertrain", items: ["Tri-motor electric AWD", "600 kW (816 PS) · 1,050 Nm", "1.5T range extender (145 kW), generator only"] },
      { title: "Battery & range", items: ["66 kWh battery", "200 km on battery alone (CLTC)", "Up to 1,032 km total range (CLTC)"] },
      { title: "Off-road", items: ["Crab walk", "Rear-wheel steering, 10.6°", "Air suspension, 150 mm height adjust", "Up to 335 mm ground clearance", "900 mm wading depth", "3 differential locks", "9 terrain types · 5 driving modes"] },
      { title: "Comfort & cabin", items: ["15.6-inch central touchscreen", "12.3-inch digital cluster", "12.3-inch passenger screen", "16-speaker premium sound (DIRAC)", "Nappa leather; heated, ventilated, massage seats front & rear", "16-way electric driver seat", "Front & rear sunroofs"] },
      { title: "Safety & technology", items: ["Advanced driver assistance", "Off-road terrain management (M-ATS)", "Intelligent parking assist", "360-degree camera", "Full premium safety package"] }
    ],
    source: { brochure: dongfengBrochure, publisher: "Fouani Nigeria Ltd", pdfPage: 16, modelPage: 13 }
  }
];

const legacyShowcaseVehicles = [
  {
    id: "rox-01",
    brand: "ROX Motor",
    name: "ROX 01 SUV",
    images: ["../assets/automobile/vehicles/rox-01.jpg"],
    fallbackImage: "../assets/automobile/vehicles/rox-01.svg"
  },
  {
    id: "voyah-free",
    brand: "VOYAH",
    name: "VOYAH FREE",
    images: ["../assets/automobile/vehicles/voyah-free.jpg"],
    fallbackImage: "../assets/automobile/vehicles/voyah-free.svg"
  }
];

function getYouTubeVideoId(value) {
  const idPattern = /^[A-Za-z0-9_-]{11}$/;
  if (typeof value !== "string") return "";
  const candidate = value.trim();
  if (idPattern.test(candidate)) return candidate;

  let url;
  try {
    url = new URL(candidate);
  } catch {
    return "";
  }
  if (url.protocol !== "https:" || url.username || url.password) return "";

  const host = url.hostname.toLowerCase();
  const allowedHosts = new Set(["youtu.be", "youtube.com", "www.youtube.com", "www.youtube-nocookie.com"]);
  if (!allowedHosts.has(host)) return "";

  let videoId = "";
  if (host === "youtu.be") {
    videoId = url.pathname.match(/^\/([A-Za-z0-9_-]{11})\/?$/)?.[1] || "";
  } else if (url.pathname === "/watch") {
    videoId = url.searchParams.get("v") || "";
  } else {
    videoId = url.pathname.match(/^\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})\/?$/)?.[1] || "";
  }
  return idPattern.test(videoId) ? videoId : "";
}

window.ElectronyAutomobileData = Object.freeze({
  vehicles: automobileVehicles,
  legacyShowcaseVehicles,
  featuredVideos: [],
  getYouTubeVideoId
});
