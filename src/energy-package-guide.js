window.ElectronySmallHomeSolarGuide = Object.freeze({
  packageId: "basic-small-home-office",
  trigger: "How many things can the Small Home Solar Package 3.5kVA carry?",
  specifications: [
    { label: "Continuous inverter limit", value: "3,600 W" },
    { label: "Solar array capacity", value: "4,200 W" },
    { label: "Lithium battery capacity", value: "5.12 kWh" },
    { label: "Usable battery energy", value: "5.0 kWh" }
  ],
  maximumLoad: {
    maximum: "Maximum continuous inverter load: 3,600 W.",
    recommended: "Recommended continuous operating range: 3,000 W–3,200 W, leaving headroom for motor startup surges."
  },
  backup: {
    energy: "Usable battery energy: 5.0 kWh (5,000 Wh).",
    estimates: [
      { load: "500 W — lights, fans, TV and fridge", backup: "9–10 hours" },
      { load: "1,500 W — adding an AC or pumping machine", backup: "Approximately 3 hours" }
    ],
    note: "Actual backup depends on appliance consumption, usage patterns, inverter losses, battery condition and other operating conditions."
  },
  daytimeSolar: {
    peak: "Estimated real-world peak output: approximately 3,300 W–3,600 W during strong midday sunshine.",
    period: "Indicative strongest generation period: 10:00 AM–4:00 PM.",
    charging: "Daytime solar generation can power appliances while simultaneously charging the battery when generation exceeds the connected load.",
    note: "Actual solar output varies with weather, shading, panel orientation, temperature and installation conditions. Estimated peak output is not guaranteed."
  },
  everyday: {
    title: "What can I run at the same time?",
    description: "This package can support a typical 2-to-3-bedroom apartment's essential appliances, with room for one additional heavier appliance when managed carefully.",
    wattageNote: "Appliance wattages are estimates, not guaranteed consumption.",
    items: [
      { appliance: "LED bulbs / security lights", quantity: "12", wattage: "10 W", total: "120 W" },
      { appliance: "Ceiling or standing fans", quantity: "4", wattage: "65 W", total: "260 W" },
      { appliance: "LED TV + decoder / soundbar", quantity: "2", wattage: "120 W", total: "240 W" },
      { appliance: "Wi-Fi router & CCTV system", quantity: "1", wattage: "50 W", total: "50 W" },
      { appliance: "Laptops & phone chargers", quantity: "4", wattage: "65 W", total: "260 W" },
      { appliance: "Medium fridge / freezer (running)", quantity: "1", wattage: "180 W", total: "180 W" },
      { appliance: "1.5 HP inverter split AC (optional)", quantity: "1", wattage: "1,200 W", total: "1,200 W" }
    ],
    total: "2,310 W",
    note: "The 2,310 W total is the arithmetic sum of the supplied estimated appliance loads, including the optional AC. Actual startup surges, particularly from refrigerators and motors, must also be considered."
  },
  heavyAppliances: {
    title: "Heavy appliances you can use individually",
    description: "Because the inverter has a 3,600 W continuous limit, use one high-draw appliance at a time alongside essential household loads. Daytime use is recommended where possible to reduce battery depletion.",
    items: [
      {
        name: "1 HP to 1.5 HP inverter AC",
        details: [
          "Estimated running consumption: 900 W–1,300 W.",
          "Avoid non-inverter ACs because of their potentially high compressor startup surges."
        ]
      },
      {
        name: "1 HP water pumping machine",
        details: [
          "Estimated running consumption: 750 W–1,100 W.",
          "Estimated startup surge: approximately 2,200 W.",
          "Turn off ACs before operating the pump."
        ]
      },
      {
        name: "Washing machine",
        details: [
          "Estimated consumption: 500 W–800 W on cold wash.",
          "Do not use its built-in water heater."
        ]
      },
      {
        name: "Microwave",
        details: [
          "Estimated consumption: 1,000 W–1,500 W.",
          "Suitable for short bursts of approximately 2–5 minutes, subject to the actual appliance rating and other connected loads."
        ]
      },
      {
        name: "Electric iron or electric kettle",
        details: [
          "Estimated consumption: 1,200 W–2,000 W.",
          "Use briefly, preferably during peak afternoon sunshine when solar generation is strong and the battery is adequately charged."
        ]
      }
    ],
    note: "These are indicative appliance examples, not a guarantee that every appliance can be operated alongside every other listed load. Check appliance nameplate ratings and startup requirements."
  },
  avoid: {
    title: "What should I avoid using with this package?",
    items: [
      "Two or more air conditioners running simultaneously.",
      "Water heaters, including bathroom Ariston/storage heaters.",
      "Electric cookers and ovens drawing approximately 2,500 W–4,000 W or more continuously.",
      "2 HP or larger deep-well submersible pumps, because their high inductive startup surge may trigger the inverter's overload protection."
    ],
    note: "These loads may exceed the inverter's safe operating capacity or leave insufficient startup headroom. An appliance is not necessarily safe just because its running wattage is below 3,600 W; startup surge and the combined load must also be considered."
  },
  disclaimer: "Appliance wattages, solar generation and battery backup figures are estimates. Actual performance depends on appliance ratings, startup surges, power factor, battery condition, weather, shading, installation design and usage patterns. A qualified solar professional should assess the actual loads, phase requirements and installation before purchase."
});

const mediumHomeSolarGuide = {
  packageId: "medium-home-office",
  trigger: "How many things can the Medium Home Solar Package 6kW carry?",
  specifications: [
    { label: "Inverter", value: "6,000 W (6 kW) Growatt Future-H All-in-One Inverter" },
    { label: "Solar array", value: "6,200 W (10 × 620 W panels)" },
    { label: "Integrated lithium battery", value: "5.12 kWh" },
    { label: "Estimated usable battery energy", value: "5.0 kWh" }
  ],
  systemNote: "The Future-H All-in-One combines the inverter and battery; the battery is integrated and is not separate additional equipment.",
  maximumLoad: {
    maximum: "Inverter limit: 6,000 W.",
    recommended: "Recommended continuous operating range: 5,000 W–5,200 W to leave headroom for motor startup surges."
  },
  backup: {
    energy: "Usable energy: 5.0 kWh (5,000 Wh).",
    estimates: [
      { load: "700 W (lights, fans, TV, fridge and freezer)", backup: "Approximately 7 hours" },
      { load: "1,800 W (adding one inverter AC overnight)", backup: "Approximately 2.5–3 hours" }
    ],
    note: "This package has the same stated usable battery energy as the Small Home package despite its higher inverter and solar-array capacity. Customers should moderate overnight consumption accordingly."
  },
  daytimeSolar: {
    peak: "Estimated real-world peak output: approximately 4,800 W–5,200 W during strong midday sunshine.",
    period: "Indicative strongest generation period: 10:00 AM–4:00 PM.",
    charging: "The higher solar capacity provides more daytime power for appliances while recharging the battery when conditions permit."
  },
  everyday: {
    title: "What can I run at the same time?",
    tableHeading: "Estimated daytime appliance load breakdown",
    items: [
      { appliance: "LED bulbs / outdoor security lights", quantity: "18", wattage: "10 W", total: "180 W" },
      { appliance: "Ceiling or standing fans", quantity: "6", wattage: "65 W", total: "390 W" },
      { appliance: "LED TVs + sound system / decoders", quantity: "3", wattage: "120 W", total: "360 W" },
      { appliance: "Wi-Fi router, CCTV & home office PCs", quantity: "3", wattage: "100 W", total: "300 W" },
      { appliance: "Medium fridge + chest freezer (running)", quantity: "2", wattage: "180 W", total: "360 W" },
      { appliance: "1.5 HP inverter split ACs (daytime)", quantity: "2", wattage: "1,200 W", total: "2,400 W" }
    ],
    total: "3,990 W",
    buffer: "Approximately 2,010 W remaining below the 6,000 W inverter limit.",
    note: "This is an illustrative daytime combination. Actual startup loads must be considered."
  },
  heavyAppliances: {
    title: "What other heavy appliances can I use?",
    items: [
      {
        name: "1.5 HP inverter ACs",
        details: ["Up to two simultaneously during sunny hours. Reduce to one AC or fans at night to preserve the 5.12 kWh battery."]
      },
      {
        name: "Water pumping machine (1 HP–1.5 HP)",
        details: ["Estimated running consumption: 750 W–1,200 W alongside normal household loads."]
      },
      {
        name: "Washing machine (cold wash), microwave, electric kettle or iron",
        details: ["Estimated consumption: 1,000 W–2,000 W. These can be used alongside one AC during peak afternoon sunshine, subject to the combined load."]
      }
    ]
  },
  avoid: {
    title: "What should I avoid using with this package?",
    items: [
      "Three or more air conditioners running simultaneously.",
      "Heavy overnight AC usage. Running two ACs at night may deplete the 5.12 kWh battery in approximately two hours, depending on actual consumption.",
      "Central electric water heaters and electric cookers drawing approximately 3,000 W–5,000 W or more continuously."
    ],
    note: "The inverter's 6,000 W rating is a maximum limit, not a recommended everyday operating target."
  },
  disclaimer: window.ElectronySmallHomeSolarGuide.disclaimer
};

const largeHomeSolarGuide = {
  packageId: "premium-executive-corporate",
  trigger: "How many things can the Large Home Solar Package 8kW carry?",
  specifications: [
    { label: "Inverter", value: "8,000 W (8 kW) Deye Single-Phase Hybrid Inverter" },
    { label: "Solar array", value: "8,700 W (12 × 725 W panels)" },
    { label: "Battery", value: "16 kWh Deye Low-Voltage Lithium Battery" },
    { label: "Estimated usable battery energy", value: "Approximately 15.2 kWh" }
  ],
  maximumLoad: {
    maximum: "Inverter limit: 8,000 W.",
    recommended: "Recommended continuous operating range: 6,800 W–7,000 W."
  },
  backup: {
    energy: "Usable energy: approximately 15.2 kWh (15,200 Wh).",
    estimates: [
      { load: "1,200 W (full-house lights, fans, fridges, TVs and CCTV)", backup: "Approximately 12–13 hours" },
      { load: "2,500 W (adding one or two inverter ACs overnight)", backup: "Approximately 6 hours" }
    ]
  },
  daytimeSolar: {
    peak: "Estimated real-world peak output: approximately 6,800 W–7,300 W during strong midday sunshine.",
    charging: "The system can support substantial daytime loads while recharging the 16 kWh battery bank when solar generation permits."
  },
  everyday: {
    title: "What can I run at the same time?",
    tableHeading: "Estimated appliance load breakdown",
    items: [
      { appliance: "Full house / office LED & security lights", quantity: "30", wattage: "10 W", total: "300 W" },
      { appliance: "Ceiling / standing fans", quantity: "8", wattage: "65 W", total: "520 W" },
      { appliance: "Smart TVs + home theater / conference screens", quantity: "4", wattage: "150 W", total: "600 W" },
      { appliance: "Executive workstations, printers & server/CCTV", quantity: "6", wattage: "120 W", total: "720 W" },
      { appliance: "Double-door fridge + large deep freezer", quantity: "2", wattage: "220 W", total: "440 W" },
      { appliance: "1.5 HP inverter split ACs (running together)", quantity: "3", wattage: "1,200 W", total: "3,600 W" }
    ],
    total: "6,180 W",
    buffer: "Approximately 1,820 W remaining below the 8,000 W inverter limit."
  },
  heavyAppliances: {
    title: "What other heavy appliances can I use?",
    items: [
      {
        name: "1.5 HP inverter ACs",
        details: ["Up to three simultaneously during the day.", "One to two inverter ACs overnight, subject to the total household load and desired backup duration."]
      },
      {
        name: "Submersible / surface water pump (1.5 HP–2 HP)",
        details: ["Estimated running consumption: 1,100 W–1,500 W."]
      },
      {
        name: "Microwave, washing machine, electric kettle, toaster and pressing iron",
        details: ["Can be used alongside ACs and refrigeration, provided the combined running and startup loads remain within the inverter's operating limits."]
      }
    ]
  },
  avoid: {
    title: "What should I avoid using with this package?",
    items: [
      "Four or more air conditioners running simultaneously together with kitchen heating appliances.",
      "Full electric range cookers.",
      "Instantaneous tankless water heaters drawing approximately 6,000 W–9,000 W or more.",
      "Three-phase commercial machinery, because this package uses a single-phase inverter."
    ],
    note: "Single-phase only: this package is not a three-phase commercial or industrial solution."
  },
  disclaimer: window.ElectronySmallHomeSolarGuide.disclaimer
};

const industrialSolarGuide = {
  packageId: "heavy-commercial-industrial",
  trigger: "How much equipment can the Industrial / Company Solar Package 50kW carry?",
  specifications: [
    { label: "Inverter", value: "50,000 W (50 kW) Deye Three-Phase High-Voltage Hybrid Inverter" },
    { label: "Solar array", value: "50,750 W (70 × 725 W panels)" },
    { label: "Battery storage", value: "48 kWh nominal high-voltage storage (3 × 16 kWh Deye BOS-B-PACK16 packs)" },
    { label: "Estimated usable battery energy", value: "Approximately 45.6 kWh" }
  ],
  maximumLoad: {
    maximum: "Total inverter limit: 50,000 W (50 kW) across three phases.",
    recommended: "Recommended total continuous load: below 40,000 W–42,000 W.",
    warning: "Approximate phase allocation: 16.6 kW per phase under balanced loading. Three-phase loads must be appropriately balanced and per-phase limits respected; the entire 50 kW is not freely available on one phase."
  },
  backup: {
    energy: "Usable battery energy: approximately 45.6 kWh (45,600 Wh).",
    estimates: [
      { load: "5,000 W overnight base load (security lighting, servers, cold rooms/freezers)", backup: "Approximately 9 hours" },
      { load: "15,000 W evening-shift load (office ACs, computers and lighting)", backup: "Approximately 3 hours" }
    ]
  },
  daytimeSolar: {
    peak: "Estimated real-world peak output: approximately 40,000 W–43,000 W during strong midday sunshine.",
    charging: "The array is intended to offset substantial daytime commercial or factory electricity consumption and reduce generator dependence where operating conditions permit."
  },
  everyday: {
    title: "What equipment can this industrial system support?",
    tableHeading: "Estimated commercial equipment load breakdown",
    equipmentLabel: "Equipment",
    items: [
      { appliance: "Commercial LED panels & perimeter floodlights", quantity: "100", wattage: "20 W", total: "2,000 W" },
      { appliance: "Office workstations, monitors & POS terminals", quantity: "30", wattage: "150 W", total: "4,500 W" },
      { appliance: "IT server rack, networking & CCTV security", quantity: "1", wattage: "1,500 W", total: "1,500 W" },
      { appliance: "2 HP commercial split / standing inverter ACs", quantity: "10", wattage: "1,600 W", total: "16,000 W" },
      { appliance: "Commercial display fridges / cold room compressors", quantity: "4", wattage: "1,200 W", total: "4,800 W" },
      { appliance: "Light industrial three-phase machinery / packaging", quantity: "1", wattage: "7,500 W", total: "7,500 W" },
      { appliance: "Industrial water booster pumps (2 HP)", quantity: "2", wattage: "1,500 W", total: "3,000 W" }
    ],
    total: "39,300 W",
    buffer: "Approximately 10,700 W remaining below the 50,000 W inverter limit.",
    note: "Actual industrial motor startup behaviour, power factor, phase balance and load characteristics must be assessed before installation."
  },
  heavyAppliances: {
    title: "What commercial and industrial equipment can it support?",
    items: [
      {
        name: "Three-phase motors and workshop equipment",
        details: [
          "Lathes.",
          "Milling machines.",
          "Commercial mixers.",
          "Bottling and packaging lines.",
          "Air compressors.",
          "Indicative combined running-load guidance: approximately 10–15 HP total, especially where Variable Frequency Drives (VFDs) or soft-starters are used."
        ]
      },
      {
        name: "Commercial HVAC and refrigeration",
        details: [
          "Approximately 10–15 inverter air conditioners (1.5 HP–2 HP), subject to actual combined load.",
          "Walk-in cold rooms.",
          "Supermarket chillers."
        ]
      },
      {
        name: "Medical and hospitality loads",
        details: [
          "Dental and diagnostic imaging equipment (non-MRI).",
          "Commercial kitchen appliances.",
          "Laundry extractors."
        ]
      }
    ],
    note: "These are application examples, not a guarantee of compatibility with every machine or installation."
  },
  avoid: {
    title: "What should I avoid using with this package?",
    items: [
      "Heavy industrial smelting equipment.",
      "Large welders.",
      "High-tonnage chillers exceeding 50 kW peak.",
      "Equipment with exceptionally high direct-on-line (DOL) motor startup spikes above approximately 75–100 kVA.",
      "24/7 heavy factory production without grid or generator support."
    ],
    note: "The 50.75 kW solar array is intended to support heavy daytime operations. The 48 kWh nominal battery bank is primarily sized for overnight essential/security loads or short grid outages, not for running a 40 kW factory load throughout the night."
  },
  disclaimer: `${window.ElectronySmallHomeSolarGuide.disclaimer} Three-phase load balancing and motor-starting requirements require professional assessment.`
};

window.ElectronySolarPackageGuides = Object.freeze([
  window.ElectronySmallHomeSolarGuide,
  mediumHomeSolarGuide,
  largeHomeSolarGuide,
  industrialSolarGuide
].map((guide) => Object.freeze(guide)));
