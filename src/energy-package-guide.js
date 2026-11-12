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
  }
});
