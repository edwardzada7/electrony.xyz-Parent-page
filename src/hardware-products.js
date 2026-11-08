const sourceDocuments = [
  {
    "document": "Hisense-1.pdf",
    "pdfDate": "2026-11-07",
    "version": "1.7",
    "pages": 4,
    "manufacturer": "Hisense",
    "role": "Revised product and price list",
    "warranty": "2 years warranty on all products."
  },
  {
    "document": "LG-1.pdf",
    "pdfDate": "2026-11-07",
    "version": "1.7",
    "pages": 4,
    "manufacturer": "LG",
    "role": "Revised product and price list",
    "warranty": "2 years warranty on all products."
  },
  {
    "document": "MAXI-1.pdf",
    "pdfDate": "2026-11-06",
    "version": "1.7",
    "pages": 4,
    "manufacturer": "MAXI",
    "role": "Revised product and price list",
    "warranty": "1 year warranty on all products."
  },
  {
    "document": "PROMO LIST-1.pdf",
    "pdfDate": "2026-11-06",
    "version": "1.7",
    "pages": 1,
    "role": "Dealer promotion list; excluded from catalogue prices and offers",
    "validityDate": null,
    "published": false,
    "note": "No validity date is supplied, so none of its offers are presented as current."
  },
  {
    "document": "Hisense.pdf",
    "pdfDate": "2026-09-19",
    "version": "1.7",
    "pages": 4,
    "manufacturer": "Hisense",
    "role": "Legacy source for existing models absent from the revised list"
  },
  {
    "document": "LG.pdf",
    "pdfDate": "2026-09-21",
    "version": "1.7",
    "pages": 4,
    "manufacturer": "LG",
    "role": "Legacy source for existing models absent from the revised list"
  },
  {
    "document": "MAXI.pdf",
    "pdfDate": "2026-09-16",
    "version": "1.7",
    "pages": 4,
    "manufacturer": "MAXI",
    "role": "Legacy source for existing models absent from the revised list"
  },
  {
    "document": "PROMO LIST.pdf",
    "pdfDate": "2026-09-19",
    "version": "1.7",
    "pages": 1,
    "role": "Legacy promotion sheet; not used for catalogue prices"
  }
];

const sourceProducts = [
 {
  "id": "hisense-dh-5s102bb",
  "name": "DH 5S102BB",
  "brand": "Hisense",
  "model": "DH 5S102BB",
  "sku": null,
  "category": "appliances",
  "description": "Hisense Dryer DRYER,10KG,CONNECT LIFE,HEAT PUMP,ION REFRESH",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "630000",
   "display": "₦630,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "630,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-dryer-801",
  "name": "DRYER 801",
  "brand": "Hisense",
  "model": "DRYER 801",
  "sku": null,
  "category": "appliances",
  "description": "8KG , Silver Color",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "310000",
   "display": "₦310,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "310,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-fl-51fc",
  "name": "FL 51FC",
  "brand": "Hisense",
  "model": "FL 51FC",
  "sku": null,
  "category": "appliances",
  "description": "367L , BEVERAGE DISPLAY COOLER,R600 GAS",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "699000",
   "display": "₦699,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "699,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-fl-94cj",
  "name": "FL 94CJ",
  "brand": "Hisense",
  "model": "FL 94CJ",
  "sku": null,
  "category": "appliances",
  "description": "Hisense Chiller (Show Case) 91L , BEVERAGE DISPLAY COOLER,R600 GAS,BLACK COLOR,3 GLASS SHELF,LED LAMP,SILENT COMPRESSOR",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "230000",
   "display": "₦230,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "230,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-fl31fc",
  "name": "Chiller FL31FC",
  "brand": "Hisense",
  "model": "FL31FC",
  "sku": null,
  "category": "appliances",
  "description": "205L BEVERAGEDISPLAYCOOLERR600GAS",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "Chiller",
  "source": {
   "document": "Hisense.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-frz-fc-250-sh",
  "name": "FRZ FC 250 SH",
  "brand": "Hisense",
  "model": "FRZ FC 250 SH",
  "sku": null,
  "category": "appliances",
  "description": "189 L,Fast Freezer, Power Indicator Function, Black, R600 Gas, Glass Door",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "290000",
   "display": "₦290,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "290,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-frz-fc-270",
  "name": "FRZ FC 270",
  "brand": "Hisense",
  "model": "FRZ FC 270",
  "sku": null,
  "category": "appliances",
  "description": "198 L,Fast Freezer , Power Indicator Function ,Silver,R600 Gas",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "265000",
   "display": "₦265,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "265,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-frz-fc-320-sh",
  "name": "FRZ FC 320 SH",
  "brand": "Hisense",
  "model": "FRZ FC 320 SH",
  "sku": null,
  "category": "appliances",
  "description": "240 L,Fast Freezer, Power Indicator Function, Black, R600 Gas, Glass Door",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "310000",
   "display": "₦310,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "310,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-frz-fc-370sh",
  "name": "FRZ FC 370SH",
  "brand": "Hisense",
  "model": "FRZ FC 370SH",
  "sku": null,
  "category": "appliances",
  "description": "217 L,Fast Freezer, Power Indicator Function, Silver, R600 Gas,",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "345000",
   "display": "₦345,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "345,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-frz-fc-390-sh",
  "name": "FRZ FC 390 SH",
  "brand": "Hisense",
  "model": "FRZ FC 390 SH",
  "sku": null,
  "category": "appliances",
  "description": "297 L, Fast Freezer, Power Indicator Function, Silver, R600 Gas",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "365000",
   "display": "₦365,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "365,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-frz-fc-480-sh",
  "name": "FRZ FC 480 SH",
  "brand": "Hisense",
  "model": "FRZ FC 480 SH",
  "sku": null,
  "category": "appliances",
  "description": "372 L,Fast Freezer , Power Indicator Function ,Silver,R600 Gas Hisense Washing Machine",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "490000",
   "display": "₦490,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "490,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-frz-fc-55dd",
  "name": "FRZ FC 55DD",
  "brand": "Hisense",
  "model": "FRZ FC 55DD",
  "sku": null,
  "category": "appliances",
  "description": "420 L,Fast Freezer , Power Indicator Function ,Silver,R600 Gas.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "545000",
   "display": "₦545,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "545,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-frz-fc-66dd",
  "name": "FRZ FC 66DD",
  "brand": "Hisense",
  "model": "FRZ FC 66DD",
  "sku": null,
  "category": "appliances",
  "description": "500L,Fast Freezer , Power Indicator Function ,Silver,Double Door,R600 Gas.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "660000",
   "display": "₦660,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "660,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-frz189dr",
  "name": "ChestFreezer' FRZ189DR",
  "brand": "Hisense",
  "model": "FRZ189DR",
  "sku": null,
  "category": "appliances",
  "description": "190 L Standing Freezer,6 Shelves,Drawer,Door Basket ,Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "ChestFreezer'",
  "source": {
   "document": "Hisense.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-frzfc91dd",
  "name": "ChestFreezer' FRZFC91DD",
  "brand": "Hisense",
  "model": "FRZFC91DD",
  "sku": null,
  "category": "appliances",
  "description": "702 L ,Fast Freezer Power Indicator Function ,Silver,Double Door,R600 Gas.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "ChestFreezer'",
  "source": {
   "document": "Hisense.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-fs-2-0hp",
  "name": "FS 2.0HP",
  "brand": "Hisense",
  "model": "FS 2.0HP",
  "sku": null,
  "category": "appliances",
  "description": "10 Meters Air Flow, Supper Cooling , Gold Fin, Can Be Used Only With Split 1.5/2 HP Kit",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "625000",
   "display": "₦625,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "625,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-fs-2-0hp-inv",
  "name": "FS 2.0HP INV",
  "brand": "Hisense",
  "model": "FS 2.0HP INV",
  "sku": null,
  "category": "appliances",
  "description": "10 Meters Air Flow, Supper Cooling , Gold Fin,Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "799000",
   "display": "₦799,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "799,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-fs-3-0hp",
  "name": "FS 3.0HP",
  "brand": "Hisense",
  "model": "FS 3.0HP",
  "sku": null,
  "category": "appliances",
  "description": "10 Meters Air Flow, Supper Cooling , Gold Fin",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "845000",
   "display": "₦845,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "845,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-fs-3-0hp-inv",
  "name": "FS 3.0HP INV",
  "brand": "Hisense",
  "model": "FS 3.0HP INV",
  "sku": null,
  "category": "appliances",
  "description": "10 Meters Air Flow, Supper Cooling , Gold Fin,Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "980000",
   "display": "₦980,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "980,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-fs-3hphpinv-tw",
  "name": "FS 3HPHPINV-TW",
  "brand": "Hisense",
  "model": "FS 3HPHPINV-TW",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "1050000",
   "display": "₦1,050,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,050,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-fs-5-0hp",
  "name": "FS 5.0HP",
  "brand": "Hisense",
  "model": "FS 5.0HP",
  "sku": null,
  "category": "appliances",
  "description": "10 Meters Air Flow, Supper Cooling , Gold Fin",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "1499000",
   "display": "₦1,499,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,499,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-fs-5-5-hp-inv",
  "name": "FS 5.5 HP INV",
  "brand": "Hisense",
  "model": "FS 5.5 HP INV",
  "sku": null,
  "category": "appliances",
  "description": "Supper Cooling , Gold Fin, Inverter R410 Gas , White Color,1 Year Warranty ,",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   },
   {
    "text": "1 Year Warranty",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "product-row"
   }
  ],
  "warrantyStatus": "needs-confirmation",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "1690000",
   "display": "₦1,690,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,690,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-his-ceil-2-0hp",
  "name": "HIS CEIL 2.0HP",
  "brand": "Hisense",
  "model": "HIS CEIL 2.0HP",
  "sku": null,
  "category": "appliances",
  "description": "R410 Gas , 18,000 Btu ,Wireless Remote ,White Color ,LONG DISTANCE PIPING HIGH ELEVATION MAX 20 M",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "680000",
   "display": "₦680,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "680,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-his-ceil-2-5hp",
  "name": "HIS CEIL 2.5HP",
  "brand": "Hisense",
  "model": "HIS CEIL 2.5HP",
  "sku": null,
  "category": "appliances",
  "description": "R410 Gas , 24,225 Btu ,Wireless Remote ,White Color .Long Distance Piping High Elevation Max 20 M",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "840000",
   "display": "₦840,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "840,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-his-icm-2011",
  "name": "HIS ICM 2011",
  "brand": "Hisense",
  "model": "HIS ICM 2011",
  "sku": null,
  "category": "appliances",
  "description": "150,W,20 KG Of Ice Daily ,S&L Ice Cubes , Quick Delivery ,Water Level Indicator ,Silver Color ,12PCS/8MINS",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "142700",
   "display": "₦142,700"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "142,700",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-his-icm-9000",
  "name": "HIS ICM 9000",
  "brand": "Hisense",
  "model": "HIS ICM 9000",
  "sku": null,
  "category": "appliances",
  "description": "HIS ICEMAKER 45KG COMMERCIAL",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "415000",
   "display": "₦415,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "415,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-his-icm1263",
  "name": "HIS ICM1263",
  "brand": "Hisense",
  "model": "HIS ICM1263",
  "sku": null,
  "category": "appliances",
  "description": "120,W,12 KG Of Ice Daily ,S&L Ice Cubes , Quick Delivery ,White,Water Tank Capacity 1000 ml, 9pcs/7mins",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "94000",
   "display": "₦94,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "94,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hisaf04bk1s5",
  "name": "HISAF04BK1S5",
  "brand": "Hisense",
  "model": "HISAF04BK1S5",
  "sku": null,
  "category": "appliances",
  "description": "4.2BLACK,Touch Control  , One Drawer ,Colorful Touch, Metal Interior",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "49000",
   "display": "₦49,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "49,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hisaf05afbk1s3",
  "name": "AirFryer HISAF05AFBK1S3",
  "brand": "Hisense",
  "model": "HISAF05AFBK1S3",
  "sku": null,
  "category": "appliances",
  "description": "5LVISIBLEWINDOWCOLORFULDISPLAYMETALINTERIORFRYGRILLROASTORBAKE11AUTOCOOKINGMENU",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "AirFryer",
  "source": {
   "document": "Hisense.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-hisaf06bk1s3",
  "name": "HISAF06BK1S3",
  "brand": "Hisense",
  "model": "HISAF06BK1S3",
  "sku": null,
  "category": "appliances",
  "description": "6.3L,Touch Control With LCD Display Dual Baskets,220-240 V, 50-60 Hz,1700 W.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "69000",
   "display": "₦69,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "69,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hisaf06bk1s5",
  "name": "HISAF06BK1S5",
  "brand": "Hisense",
  "model": "HISAF06BK1S5",
  "sku": null,
  "category": "appliances",
  "description": "5.7,BLACK,Touch Control ,Viewing Window , One Drawer .",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "54000",
   "display": "₦54,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "54,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hisaf08afbk1s1",
  "name": "HISAF08AFBK1S1",
  "brand": "Hisense",
  "model": "HISAF08AFBK1S1",
  "sku": null,
  "category": "appliances",
  "description": "8L,BLACK COLOR,MANUAL CONTROL,FRYING BASKET,VACUUM FEET ,ELEGANT DESIGNE",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "74000",
   "display": "₦74,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "74,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hisaf08afbk1s4",
  "name": "HISAF08AFBK1S4",
  "brand": "Hisense",
  "model": "HISAF08AFBK1S4",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed"
 },
 {
  "id": "hisense-hisaf08bk2s2-h",
  "name": "HISAF08BK2S2-H",
  "brand": "Hisense",
  "model": "HISAF08BK2S2-H",
  "sku": null,
  "category": "appliances",
  "description": "8L,Touch Control With LCD Display Dual Baskets,220-240 V, 50-60 Hz.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "103000",
   "display": "₦103,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "103,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hisaf45tobk20s1",
  "name": "AirFryer HISAF45TOBK20S1",
  "brand": "Hisense",
  "model": "HISAF45TOBK20S1",
  "sku": null,
  "category": "appliances",
  "description": "45LBLACKCOLORDOUBLEDOORGLASSMAXOVENADJUSTED230C2000WWITHROTISSERIECONVECTION",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "AirFryer",
  "source": {
   "document": "Hisense.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-hisaf48toss20s3",
  "name": "HISAF48TOSS20S3",
  "brand": "Hisense",
  "model": "HISAF48TOSS20S3",
  "sku": null,
  "category": "appliances",
  "description": "48l,Toaster oven, XL Volume, baking tray ,wire rack, oven handle,inner light,",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "112000",
   "display": "₦112,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "112,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hisble15tbsss1",
  "name": "HISBLE15TBSSS1",
  "brand": "Hisense",
  "model": "HISBLE15TBSSS1",
  "sku": null,
  "category": "appliances",
  "description": "1.5 L, 3 Preset Programmes ,Control Knob With LED Display ,6 Points Blade,Vaccum Feet,1000 W",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "64000",
   "display": "₦64,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "64,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hisble15tbwes2",
  "name": "HISBLE15TBWES2",
  "brand": "Hisense",
  "model": "HISBLE15TBWES2",
  "sku": null,
  "category": "appliances",
  "description": "white ,1.5 L ,stainless steel blade,2 speed control.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "27000",
   "display": "₦27,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "27,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hiscecon18ux4sskl",
  "name": "HISCECON18UX4SSKL",
  "brand": "Hisense",
  "model": "HISCECON18UX4SSKL",
  "sku": null,
  "category": "appliances",
  "description": "2 HP  Ceilling Conceiled  , R410 Gas,White Color",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "960000",
   "display": "₦960,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "960,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hiscecon24ux4sinv",
  "name": "HISCECON24UX4SINV",
  "brand": "Hisense",
  "model": "HISCECON24UX4SINV",
  "sku": null,
  "category": "appliances",
  "description": "2.5 HP  Ceilling Conceiled ,Inverter , R410 Gas,White Color,Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "1215000",
   "display": "₦1,215,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,215,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hisceil18trersja2",
  "name": "HISCEIL18TRERSJA2",
  "brand": "Hisense",
  "model": "HISCEIL18TRERSJA2",
  "sku": null,
  "category": "appliances",
  "description": "R410 Gas , 18,000 Btu ,Wireless Remote ,White Color ,Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "990000",
   "display": "₦990,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "990,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hisceil24trersja2",
  "name": "HISCEIL24TRERSJA2",
  "brand": "Hisense",
  "model": "HISCEIL24TRERSJA2",
  "sku": null,
  "category": "appliances",
  "description": "R410 Gas , 24,225 Btu ,Wireless Remote ,White Color .inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "1175000",
   "display": "₦1,175,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,175,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hisfc340sh",
  "name": "ChestFreezer' HISFC340SH",
  "brand": "Hisense",
  "model": "HISFC340SH",
  "sku": null,
  "category": "appliances",
  "description": "250 L Fast Freezer, Power Indicator Function, Silver, R600 Gas",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "ChestFreezer'",
  "source": {
   "document": "Hisense.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-hisgrill181cg01",
  "name": "HISGRILL181CG01",
  "brand": "Hisense",
  "model": "HISGRILL181CG01",
  "sku": null,
  "category": "appliances",
  "description": "fusion mode technology, 10 speed intuitive knob control,12 auto switch present programmers,Multi purpose blade and dough attachement",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "79000",
   "display": "₦79,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "79,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-hisgrill701gcw",
  "name": "GRILL HISGRILL701GCW",
  "brand": "Hisense",
  "model": "HISGRILL701GCW",
  "sku": null,
  "category": "appliances",
  "description": "sandwich maker,compact size,cool touch handle,power light indicating the power status",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "GRILL",
  "source": {
   "document": "Hisense.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-hisiron1800grt",
  "name": "HISIRON1800GRT",
  "brand": "Hisense",
  "model": "HISIRON1800GRT",
  "sku": null,
  "category": "appliances",
  "description": "steam iron,1800W,water spray,ceramic soleplate,250ml water tank,stam level, water button,steam boost,360 power cord",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "19500",
   "display": "₦19,500"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "19,500",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-hisiron22sibes1",
  "name": "IRON HISIRON22SIBES1",
  "brand": "Hisense",
  "model": "HISIRON22SIBES1",
  "sku": null,
  "category": "appliances",
  "description": "steam iron,2200W ,water spray,ceramic soleplate,300ml water tank ,stam level , water button,steam boost ,360 power cord , self clean function,Antri drip system",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "IRON",
  "source": {
   "document": "Hisense.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-hisiron28siwes1",
  "name": "HISIRON28SIWES1",
  "brand": "Hisense",
  "model": "HISIRON28SIWES1",
  "sku": null,
  "category": "appliances",
  "description": "steam iron,2800W,water spray,ceramic soleplate,300ml water tank,stam level, water button,steam boost,Automatic safety shut -off, self clean function,Antri drip system",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "38000",
   "display": "₦38,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "38,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-hiskt15dwbk",
  "name": "HISKT15DWBK",
  "brand": "Hisense",
  "model": "HISKT15DWBK",
  "sku": null,
  "category": "appliances",
  "description": "1.5L, Black ,Double Wall ,Auto Shut OFF,Sitrix Technology,OverHeating Protection",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "21000",
   "display": "₦21,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "21,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-hiskt17dwd-hk",
  "name": "HISKT17DWD-HK",
  "brand": "Hisense",
  "model": "HISKT17DWD-HK",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "42000",
   "display": "₦42,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "42,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-hiskt17ksss2",
  "name": "HISKT17KSSS2",
  "brand": "Hisense",
  "model": "HISKT17KSSS2",
  "sku": null,
  "category": "appliances",
  "description": "1.7L,SILVER,,2200W,LIMESCALE FILTER,STRIX TECHNOLOGY,LID RELEASE BUTTON,STAINLESS STEEL",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "28000",
   "display": "₦28,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "28,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-hiskt17ksss3",
  "name": "HISKT17KSSS3",
  "brand": "Hisense",
  "model": "HISKT17KSSS3",
  "sku": null,
  "category": "appliances",
  "description": "1.7L,SILVER,,2200W,LIMESCALE FILTER,STRIX TECHNOLOGY,LID RELEASE BUTTON,STAINLESS STEEL,CONVENIENT DIGITAL CONTRAL",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "39000",
   "display": "₦39,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "39,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-hismwo20mobs14-h",
  "name": "HISMWO20MOBS14-H",
  "brand": "Hisense",
  "model": "HISMWO20MOBS14-H",
  "sku": null,
  "category": "appliances",
  "description": "20l, black color,manual, stylish comapct design,700w",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "66800",
   "display": "₦66,800"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "66,800",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hismwo20mobs15-h",
  "name": "HISMWO20MOBS15-H",
  "brand": "Hisense",
  "model": "HISMWO20MOBS15-H",
  "sku": null,
  "category": "appliances",
  "description": "20l, black color , digital,stylish compact design,700w",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "69800",
   "display": "₦69,800"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "69,800",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hismwo20mows10-h",
  "name": "HISMWO20MOWS10-H",
  "brand": "Hisense",
  "model": "HISMWO20MOWS10-H",
  "sku": null,
  "category": "appliances",
  "description": "20L, White Color, Manual",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "60000",
   "display": "₦60,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "60,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hismwo25mobs6g",
  "name": "HISMWO25MOBS6G",
  "brand": "Hisense",
  "model": "HISMWO25MOBS6G",
  "sku": null,
  "category": "appliances",
  "description": "25L,Black10 Power Level ,,25 Preset Cooking Menus.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "108000",
   "display": "₦108,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "108,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hismwo28mobsp1",
  "name": "HISMWO28MOBSP1",
  "brand": "Hisense",
  "model": "HISMWO28MOBSP1",
  "sku": null,
  "category": "appliances",
  "description": "28 L,BLACK,SPEED OVEN,ALL IN ONE COOKING,60% FASTER COOLING",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "375000",
   "display": "₦375,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "375,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hismwo34mobs10hg",
  "name": "HISMWO34MOBS10HG",
  "brand": "Hisense",
  "model": "HISMWO34MOBS10HG",
  "sku": null,
  "category": "appliances",
  "description": "34L,Black,Grill,LED Display ,INVERTER,Auto Cooking Menu,Quick And Convenient Cooking",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "135000",
   "display": "₦135,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "135,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hisref20rsdr",
  "name": "HISREF20RSDR",
  "brand": "Hisense",
  "model": "HISREF20RSDR",
  "sku": null,
  "category": "appliances",
  "description": "150L, Frost , Low Noise, Environment-Friendly Tech , Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "245000",
   "display": "₦245,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "245,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-hisst60b421",
  "name": "HISST60B421",
  "brand": "Hisense",
  "model": "HISST60B421",
  "sku": null,
  "category": "appliances",
  "description": "HIS Gas Cooker 60X60 4B BLACK,TOP GLASS, IGNITION, Oven Burner UP & DOWN,2 YEAR WARRANTY,IGNITION ,LIGHT",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   },
   {
    "text": "2 YEAR WARRANTY",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "product-row"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "225000",
   "display": "₦225,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "225,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-hisvac2202g4ahr",
  "name": "VACCUMCLEANER HISVAC2202G4AHR",
  "brand": "Hisense",
  "model": "HISVAC2202G4AHR",
  "sku": null,
  "category": "appliances",
  "description": "Vaccum Cleaner,2200 W ,DOUBLE FILTRATION ,COMFORTABLE CLEANING",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "VACCUMCLEANER",
  "source": {
   "document": "Hisense.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-hiswd97tb3si",
  "name": "WATER DISPENSER HISWD97TB3SI",
  "brand": "Hisense",
  "model": "HISWD97TB3SI",
  "sku": null,
  "category": "appliances",
  "description": "Top loading cabinet ,Anti-Dust mite water bottle holder,Hot ,normal and cold water, stainless steel water tank dust proof door",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "WATER DISPENSER",
  "source": {
   "document": "Hisense.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-hiswm3w1422ubwt",
  "name": "HISWM3W1422UBWT",
  "brand": "Hisense",
  "model": "HISWM3W1422UBWT",
  "sku": null,
  "category": "appliances",
  "description": "Top Load, 14KG, Smart Control, 8 Level Water Selection, Black Colour, 8 Level Water Selection",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "399000",
   "display": "₦399,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "399,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-hiswm5i2023dbwt",
  "name": "HISWM5I2023DBWT",
  "brand": "Hisense",
  "model": "HISWM5I2023DBWT",
  "sku": null,
  "category": "appliances",
  "description": "Top Load, 20KG, Smart Control, 8 Level Water Selection, Black Colour, 8 Level Water Selection",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "499000",
   "display": "₦499,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "499,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-mwo25mobs14-h",
  "name": "MWO25MOBS14-H",
  "brand": "Hisense",
  "model": "MWO25MOBS14-H",
  "sku": null,
  "category": "appliances",
  "description": "25L Solo Black",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "89000",
   "display": "₦89,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "89,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-mwo4211dsvg-hmmg",
  "name": "MWO4211DSVG-HMMG",
  "brand": "Hisense",
  "model": "MWO4211DSVG-HMMG",
  "sku": null,
  "category": "appliances",
  "description": "42L,LED Display,Black ,With Crispy Grill  Technology,10 MWO Power levels .",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "185000",
   "display": "₦185,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "185,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-pac-1-5hp",
  "name": "PAC 1.5HP",
  "brand": "Hisense",
  "model": "PAC 1.5HP",
  "sku": null,
  "category": "appliances",
  "description": "Portable AC,R410A,27 KG Net Weight,Size 480*380*890 mm .",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "350000",
   "display": "₦350,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "350,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-ref-045dr",
  "name": "REF 045DR",
  "brand": "Hisense",
  "model": "REF 045DR",
  "sku": null,
  "category": "appliances",
  "description": "Hisense Refregirator 44 L, Frost , Low Noise, Environment-Friendly Tech , Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "120000",
   "display": "₦120,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "120,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref-093dr",
  "name": "REF 093DR",
  "brand": "Hisense",
  "model": "REF 093DR",
  "sku": null,
  "category": "appliances",
  "description": "90 L, Frost , Low Noise, Environment-Friendly Tech , Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "152000",
   "display": "₦152,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "152,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref-121",
  "name": "REF 121",
  "brand": "Hisense",
  "model": "REF 121",
  "sku": null,
  "category": "appliances",
  "description": "121L, Frost , Low Noise, Environment-Friendly Tech , Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "170000",
   "display": "₦170,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "170,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref-205dr",
  "name": "REF 205DR",
  "brand": "Hisense",
  "model": "REF 205DR",
  "sku": null,
  "category": "appliances",
  "description": "205L, Frost , Low Noise, Environment-Friendly Tech , Dark Silver,R600 Gas.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "315000",
   "display": "₦315,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "315,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref-205drb",
  "name": "REF 205DRB",
  "brand": "Hisense",
  "model": "REF 205DRB",
  "sku": null,
  "category": "appliances",
  "description": "204L, Frost , Low Noise, Environment-Friendly Tech , Red,R600 Gas,Dispenser",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "320000",
   "display": "₦320,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "320,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref-240",
  "name": "REF 240",
  "brand": "Hisense",
  "model": "REF 240",
  "sku": null,
  "category": "appliances",
  "description": "240 L, Frost , Low Noise, Environment-Friendly Tech , Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "338000",
   "display": "₦338,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "338,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref-29dca",
  "name": "REF 29DCA",
  "brand": "Hisense",
  "model": "REF 29DCA",
  "sku": null,
  "category": "appliances",
  "description": "225 L,Frost  , Low Noise, Environment-Friendly Tech , Silver,R600 Gas .",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "375000",
   "display": "₦375,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "375,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref-35dcb-rd",
  "name": "REF 35DCB-RD",
  "brand": "Hisense",
  "model": "REF 35DCB-RD",
  "sku": null,
  "category": "appliances",
  "description": "264 L,Frost , Low Noise, Environment-Friendly Tech , Silver,R600 Gas ,Dispenser",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "395000",
   "display": "₦395,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "395,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref-54wc",
  "name": "REF 54WC",
  "brand": "Hisense",
  "model": "REF 54WC",
  "sku": null,
  "category": "appliances",
  "description": "392 L,No Frost , Low Noise, Environment-Friendly Tech , Silver,4 Doors ,R600 Gas ,",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "649000",
   "display": "₦649,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "649,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref-565-dri",
  "name": "REF 565 DRI",
  "brand": "Hisense",
  "model": "REF 565 DRI",
  "sku": null,
  "category": "appliances",
  "description": "535 L,No Frost  , Low Noise, Environment-Friendly Tech , Silver,R600 Gas,Water Dispenser",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "810000",
   "display": "₦810,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "810,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref-71-wsi-rc",
  "name": "REF 71 WSI-RC",
  "brand": "Hisense",
  "model": "REF 71 WSI-RC",
  "sku": null,
  "category": "appliances",
  "description": "529L,Frost Free , Low Noise, Environment-Friendly Tech , Gray Color ,R600 Gas ,2 DOORS,Water Dispenser",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "750000",
   "display": "₦750,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "750,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref-71ws-rc",
  "name": "REF 71WS-RC",
  "brand": "Hisense",
  "model": "REF 71WS-RC",
  "sku": null,
  "category": "appliances",
  "description": "529L,Frost Free , Low Noise, Environment-Friendly Tech , Gray Color ,R600 Gas ,2 DOORS,Water Dispenser",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "750000",
   "display": "₦750,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "750,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref-73wr",
  "name": "REF 73WR",
  "brand": "Hisense",
  "model": "REF 73WR",
  "sku": null,
  "category": "appliances",
  "description": "548 L,No Frost , Low Noise, Environment-Friendly Tech , Silver,R600 Gas , Water Dispenser",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "694300",
   "display": "₦694,300"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "694,300",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref-rs230rsd",
  "name": "REF RS230RSD",
  "brand": "Hisense",
  "model": "REF RS230RSD",
  "sku": null,
  "category": "appliances",
  "description": "176 L,Frost , Low Noise, Environment-Friendly Tech , Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "270000",
   "display": "₦270,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "270,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref120dr",
  "name": "REF120DR",
  "brand": "Hisense",
  "model": "REF120DR",
  "sku": null,
  "category": "appliances",
  "description": "87 L, Frost , Low Noise, Environment-Friendly Tech , Silver,R600 Gas.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "175000",
   "display": "₦175,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "175,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-ref172dr",
  "name": "SINGLEDOOR REF172DR",
  "brand": "Hisense",
  "model": "REF172DR",
  "sku": null,
  "category": "appliances",
  "description": "124 L Frost Low Noise, Environment-Friendly Tech Silver,R600 Gas.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SINGLEDOOR",
  "source": {
   "document": "Hisense.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-ref200dr",
  "name": "SINGLEDOOR REF200DR",
  "brand": "Hisense",
  "model": "REF200DR",
  "sku": null,
  "category": "appliances",
  "description": "154 L Frost Low Noise, Environment-Friendly Tech Silver,R600 Gas.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SINGLEDOOR",
  "source": {
   "document": "Hisense.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-ref370wr",
  "name": "BottomFreezer REF370WR",
  "brand": "Hisense",
  "model": "REF370WR",
  "sku": null,
  "category": "appliances",
  "description": "310 L ,Frost Low Noise, Environment-Friendly Tech Silver,R600 Gas",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "BottomFreezer",
  "source": {
   "document": "Hisense.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-ref66wr",
  "name": "SINGLEDOOR REF66WR",
  "brand": "Hisense",
  "model": "REF66WR",
  "sku": null,
  "category": "appliances",
  "description": "504 L ,No Frost Low Noise, Environment-Friendly Tech Silver,R600 Gas",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SINGLEDOOR",
  "source": {
   "document": "Hisense.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-ref68wcb",
  "name": "SideBySide REF68WCB",
  "brand": "Hisense",
  "model": "REF68WCB",
  "sku": null,
  "category": "appliances",
  "description": "522L ,No Frost 4DOORS ,Black Color ,R600 Gas ,Water Dispenser and Ice maker, Invertor Technology, Triple Cooling Syste",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SideBySide",
  "source": {
   "document": "Hisense.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-ref68wcs",
  "name": "SideBySide REF68WCS",
  "brand": "Hisense",
  "model": "REF68WCS",
  "sku": null,
  "category": "appliances",
  "description": "538 L ,Frost Free Low Noise, Environment-Friendly Tech Silver,Dispenser,R600 Gas ,4 DOORS",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SideBySide",
  "source": {
   "document": "Hisense.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-ref71bgl",
  "name": "SideBySide REF71BGL",
  "brand": "Hisense",
  "model": "REF71BGL",
  "sku": null,
  "category": "appliances",
  "description": "529L ,Frost Free Low Noise, Environment-Friendly Tech Black Glass ,R600 Gas ,2 DOORS ,STORAGE ON",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SideBySide",
  "source": {
   "document": "Hisense.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-spl-1-0hp-copper-tg",
  "name": "SPL 1.0HP Copper-TG",
  "brand": "Hisense",
  "model": "SPL 1.0HP Copper-TG",
  "sku": null,
  "category": "appliances",
  "description": "Hisense AC Copper Condenser, Super Cooling Gold Fin",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "269000",
   "display": "₦269,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "269,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-spl-1-5-hp-copper-inv-dk",
  "name": "SPL 1.5 HP Copper Inv-DK",
  "brand": "Hisense",
  "model": "SPL 1.5 HP Copper Inv-DK",
  "sku": null,
  "category": "appliances",
  "description": "Copper Condenser, Super Cooling Gold Fin ,R410 Gas ,Inverter , White",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "374000",
   "display": "₦374,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "374,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-spl-1-5hp-copper-tg",
  "name": "SPL 1.5HP Copper-TG",
  "brand": "Hisense",
  "model": "SPL 1.5HP Copper-TG",
  "sku": null,
  "category": "appliances",
  "description": "Copper Condenser, Super Cooling Gold Fin",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "315000",
   "display": "₦315,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "315,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-spl-1hp-copper-inv-dk",
  "name": "SPL 1HP Copper Inv-DK",
  "brand": "Hisense",
  "model": "SPL 1HP Copper Inv-DK",
  "sku": null,
  "category": "appliances",
  "description": "Copper Condenser, Super Cooling Gold Fin ,R410 Gas ,Inverter , White",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "355000",
   "display": "₦355,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "355,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-spl-2-hp-copper-tg",
  "name": "SPL 2 HP Copper-TG",
  "brand": "Hisense",
  "model": "SPL 2 HP Copper-TG",
  "sku": null,
  "category": "appliances",
  "description": "Copper Condenser, Super Cooling Gold Fin",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "449000",
   "display": "₦449,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "449,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-spl-20hcas",
  "name": "SPL 20HCAS",
  "brand": "Hisense",
  "model": "SPL 20HCAS",
  "sku": null,
  "category": "appliances",
  "description": "Copper Condenser, Super Cooling Gold Fin ,R410 Gas ,Inverter , Black",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "629000",
   "display": "₦629,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "629,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-spl-2hp-copper-inv-dk",
  "name": "SPL 2HP Copper Inv-DK",
  "brand": "Hisense",
  "model": "SPL 2HP Copper Inv-DK",
  "sku": null,
  "category": "appliances",
  "description": "Copper Condenser, Super Cooling Gold Fin ,R410 Gas ,Inverter , White",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "589000",
   "display": "₦589,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "589,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-spl10hcas",
  "name": "SPL10HCAS",
  "brand": "Hisense",
  "model": "SPL10HCAS",
  "sku": null,
  "category": "appliances",
  "description": "Copper Condenser, Super Cooling Gold Fin ,R410 Gas ,Inverter , Black",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "384000",
   "display": "₦384,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "384,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-spl15hcas",
  "name": "SPL15HCAS",
  "brand": "Hisense",
  "model": "SPL15HCAS",
  "sku": null,
  "category": "appliances",
  "description": "Copper Condenser, Super Cooling Gold Fin ,R410 Gas ,Inverter , Black",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "404000",
   "display": "₦404,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "404,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-wd-3s8043bt",
  "name": "WD 3S8043BT",
  "brand": "Hisense",
  "model": "WD 3S8043BT",
  "sku": null,
  "category": "appliances",
  "description": "FL, WASH 8 KG, DRYER 5 KG, Silver Color, Inverter Motor Smart Control, Rpm 1400Motor,CONNECT LIFE",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "525000",
   "display": "₦525,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "525,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-wf-5s1243bt",
  "name": "WF 5S1243BT",
  "brand": "Hisense",
  "model": "WF 5S1243BT",
  "sku": null,
  "category": "appliances",
  "description": "FL, 12 KG, Smart Control, Black, Energy Saving, Rpm 1200,Inverter,Connect Life , Steam",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "455000",
   "display": "₦455,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "455,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-wm-1043bt-wd3s",
  "name": "WM 1043BT-WD3S",
  "brand": "Hisense",
  "model": "WM 1043BT-WD3S",
  "sku": null,
  "category": "appliances",
  "description": "FL, WASH 10.5 KG, DRYER 6KG, Silver Color, Inverter Motor Smart Control, Rpm 1400Motor",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "550000",
   "display": "₦550,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "550,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-wm-1043bt-wf3s",
  "name": "WM 1043BT-WF3S",
  "brand": "Hisense",
  "model": "WM 1043BT-WF3S",
  "sku": null,
  "category": "appliances",
  "description": "FL, 10.5 KG, Smart control, Gray, Energy Saving, Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "440000",
   "display": "₦440,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "440,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-wm-5i1245bb-wd",
  "name": "WM 5I1245BB-WD",
  "brand": "Hisense",
  "model": "WM 5I1245BB-WD",
  "sku": null,
  "category": "appliances",
  "description": "FL, Wash 12 KG, Dryer 8 KG,Black Color, Smart Inverter Motor",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "690000",
   "display": "₦690,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "690,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-wm-7i1248bbr-wf",
  "name": "WM 7I1248BBR-WF",
  "brand": "Hisense",
  "model": "WM 7I1248BBR-WF",
  "sku": null,
  "category": "appliances",
  "description": "FL, 12 KG, Smart control, Black, Energy Saving, Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "724000",
   "display": "₦724,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "724,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-wm-wspa-503",
  "name": "WM WSPA 503",
  "brand": "Hisense",
  "model": "WM WSPA 503",
  "sku": null,
  "category": "appliances",
  "description": "5 KG , Twin Tub, Classical  Design, Lint Filter ,White Color.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "135000",
   "display": "₦135,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "135,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-wm-wsqb-753",
  "name": "WM WSQB 753",
  "brand": "Hisense",
  "model": "WM WSQB 753",
  "sku": null,
  "category": "appliances",
  "description": "7.5 KG , Twin Tub, Classical  Design, Lint Filter ,White Color.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "169000",
   "display": "₦169,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "169,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-wm-wsrb-113",
  "name": "WM WSRB 113",
  "brand": "Hisense",
  "model": "WM WSRB 113",
  "sku": null,
  "category": "appliances",
  "description": "11 KG , Twin Tub, Classical  Design, Lint Filter ,White Color.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "225000",
   "display": "₦225,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "225,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-wm1i6022bkwf",
  "name": "WM1I6022BKWF",
  "brand": "Hisense",
  "model": "WM1I6022BKWF",
  "sku": null,
  "category": "appliances",
  "description": "FL, 6 KG, Smart Control, Silver, Energy Saving, Rpm 1200,Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "284000",
   "display": "₦284,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "284,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-wm1i7022bkwf",
  "name": "WM1I7022BKWF",
  "brand": "Hisense",
  "model": "WM1I7022BKWF",
  "sku": null,
  "category": "appliances",
  "description": "FL, 7 KG, Smart Control, Silver, Energy Saving, Rpm 1200,Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "319000",
   "display": "₦319,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "319,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-wm1i8042bkwf",
  "name": "WM1I8042BKWF",
  "brand": "Hisense",
  "model": "WM1I8042BKWF",
  "sku": null,
  "category": "appliances",
  "description": "FL, 8 KG, Smart Control, Silver, Energy Saving, Rpm 1200,Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "354000",
   "display": "₦354,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "354,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-wm3k1123ubwt",
  "name": "WM3K1123UBWT",
  "brand": "Hisense",
  "model": "WM3K1123UBWT",
  "sku": null,
  "category": "appliances",
  "description": "Top Load, 11 KG, Smart Control, Titanium Gray Colour, 10 Level Water Selection,Bubble Clean",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "309000",
   "display": "₦309,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "309,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-wm3k9022ubwt",
  "name": "WM3K9022UBWT",
  "brand": "Hisense",
  "model": "WM3K9022UBWT",
  "sku": null,
  "category": "appliances",
  "description": "Top Load, 9 KG, Smart Control, Titanium Gray Colour, 10 Level Water Selection,Bubble Clean",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "247000",
   "display": "₦247,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "247,000",
    "document": "Hisense-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "hisense-mon-34g6k-pro",
  "name": "MON 34G6K-PRO",
  "brand": "Hisense",
  "model": "MON 34G6K-PRO",
  "sku": null,
  "category": "computers",
  "description": "34'' Panel type: VA/ELED, Resolution: 3440x1440p WQHD, Refresh rate: 165hz, Response time: 1ms MPRT, Aspect ratio: 21:9, Brightness: 400nits, Connectivity: HDMI x 2, DP x 1, Audio x 1",
  "image": {
   "url": "../assets/catalogue/hardware-computers.svg",
   "alt": "Illustrative computer technology category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "315000",
   "display": "₦315,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "315,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-mon24n3q",
  "name": "MON24N3Q",
  "brand": "Hisense",
  "model": "MON24N3Q",
  "sku": null,
  "category": "computers",
  "description": "24'' 1080p Picture Quality, Anti-Blue Light, 144Hz Refresh Rate, DCI-P3 90% Color, Sleek Professional Design",
  "image": {
   "url": "../assets/catalogue/hardware-computers.svg",
   "alt": "Illustrative computer technology category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "95000",
   "display": "₦95,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "95,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-mon24n3se",
  "name": "MON24N3SE",
  "brand": "Hisense",
  "model": "MON24N3SE",
  "sku": null,
  "category": "computers",
  "description": "Hisense Monitor 24\" 1080p TÜV Rheinland Low Blue Light + Hardware Low Blue Light 100 Hz 1 × HDMI, 1 × VGA",
  "image": {
   "url": "../assets/catalogue/hardware-computers.svg",
   "alt": "Illustrative computer technology category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "88000",
   "display": "₦88,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "88,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-mon27g3q",
  "name": "MON27G3Q",
  "brand": "Hisense",
  "model": "MON27G3Q",
  "sku": null,
  "category": "computers",
  "description": "27''LCD MONITOR, IPS, FHD,240HZ,90%DCI-P3",
  "image": {
   "url": "../assets/catalogue/hardware-computers.svg",
   "alt": "Illustrative computer technology category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "175000",
   "display": "₦175,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "175,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-mon27g6qpro",
  "name": "MONITOR MON27G6QPRO",
  "brand": "Hisense",
  "model": "MON27G6QPRO",
  "sku": null,
  "category": "computers",
  "description": "27'' Flat Screen, Backlight source IPS/ELED , Resolution QHD / 2560 x 1440 , Refresh rate 320 Hz, Hisense eye protection mode, Display port :1 HDMI 2 .0: 2 Audio: 1",
  "image": {
   "url": "../assets/catalogue/hardware-computers.svg",
   "alt": "Illustrative computer technology category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "MONITOR",
  "source": {
   "document": "Hisense.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-mon27n3q",
  "name": "MON27N3Q",
  "brand": "Hisense",
  "model": "MON27N3Q",
  "sku": null,
  "category": "computers",
  "description": "27'' 1080p Picture Quality, Anti-Blue Light, 144Hz Refresh Rate, DCI-P3 90% Color, Sleek Professional Design",
  "image": {
   "url": "../assets/catalogue/hardware-computers.svg",
   "alt": "Illustrative computer technology category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "121000",
   "display": "₦121,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "121,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-mon27n3qpro",
  "name": "HisenseMonitor MON27N3QPRO",
  "brand": "Hisense",
  "model": "MON27N3QPRO",
  "sku": null,
  "category": "computers",
  "description": "27'' Flat Screen, Resolution: FHD / 1920 x 1080 , 144Hz Refresh rate, Hisense eye protection mode, Display port 1 ,HDMI 1 , V",
  "image": {
   "url": "../assets/catalogue/hardware-computers.svg",
   "alt": "Illustrative computer technology category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "HisenseMonitor",
  "source": {
   "document": "Hisense.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-mon34g6q",
  "name": "MON34G6Q",
  "brand": "Hisense",
  "model": "MON34G6Q",
  "sku": null,
  "category": "computers",
  "description": "34'' Gaming monitor,1000R,200 Hz ,1ms,90% DCI-P3,FreeSync Premium ,Display HDR 400",
  "image": {
   "url": "../assets/catalogue/hardware-computers.svg",
   "alt": "Illustrative computer technology category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "299000",
   "display": "₦299,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "299,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-mon34g6qpro",
  "name": "MON34G6QPRO",
  "brand": "Hisense",
  "model": "MON34G6QPRO",
  "sku": null,
  "category": "computers",
  "description": "34'' Curved/1000R, Backlight source: VA/ELED, Resolution: WQHD / 3440 x 1440, Refresh rate: 240 Hz, Response time: 1 ms (MPRT),Hisense eye protection mode, Built in Speaker: 2*3W, HDMI x 2, DP x 1, Audio x 1",
  "image": {
   "url": "../assets/catalogue/hardware-computers.svg",
   "alt": "Illustrative computer technology category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "345000",
   "display": "₦345,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "345,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-aud-2107g",
  "name": "AUD  2107G",
  "brand": "Hisense",
  "model": "AUD  2107G",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Sound Bar, 2.1 Ch, HDMI, Bluetooth, Optical Input, AUX ,USB,300 Watts, Wall Bracket.",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "210600",
   "display": "₦210,600"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "210,600",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-aud-1000hs",
  "name": "AUD 1000HS",
  "brand": "Hisense",
  "model": "AUD 1000HS",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Sound Bar, 2.0Ch, HDMI, Bluetooth, Optical Input, AUX ,USB,120 Watts, Wall Bracket.",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "65000",
   "display": "₦65,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "65,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-aud-1800hs",
  "name": "AUD 1800HS",
  "brand": "Hisense",
  "model": "AUD 1800HS",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Sound Bar, 2.1 Ch, HDMI, Bluetooth, Optical Input, AUX ,USB,140 Watts, Wall Bracket.",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "79000",
   "display": "₦79,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "79,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-aud-2100-hs-fm",
  "name": "AUD 2100 HS-FM",
  "brand": "Hisense",
  "model": "AUD 2100 HS-FM",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Sound Bar, 2.1 Ch, HDMI, Bluetooth, Optical Input, AUX ,USB,240 Watts, Wall Bracket.RADIO FM",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "120000",
   "display": "₦120,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "120,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-aud-218",
  "name": "AUD 218",
  "brand": "Hisense",
  "model": "AUD 218",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Sound Bar, 2.0 Ch, HDMI, Bluetooth, Optical Input, AUX ,USB, 200Watts. Wall Mountable",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "155000",
   "display": "₦155,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "155,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-aud-300hp",
  "name": "AUD 300HP",
  "brand": "Hisense",
  "model": "AUD 300HP",
  "sku": null,
  "category": "consumer-electronics",
  "description": "All In One ,400 Max Audio Power ,Rich Bass,8Lights Mode ,Pair Play ,Karaoke Mode,Stereo Sound ,Crisp Highs",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "219000",
   "display": "₦219,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "219,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-aud-5100hs",
  "name": "AUD 5100HS",
  "brand": "Hisense",
  "model": "AUD 5100HS",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Sound Bar,5.1Ch,Wireless subwoofer, HDMI, Bluetooth, Optical Input, AUX ,USB,540 Watts",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "185000",
   "display": "₦185,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "185,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-aud-5140q-ax",
  "name": "AUD 5140Q-AX",
  "brand": "Hisense",
  "model": "AUD 5140Q-AX",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Sound Bar, 5.1.4Ch,Dolby atoms,6.5Wireless subwoofer,HDMI, Bluetooth, AUX ,USB, 600Watts",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "349000",
   "display": "₦349,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "349,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-aud-600hp",
  "name": "AUD 600HP",
  "brand": "Hisense",
  "model": "AUD 600HP",
  "sku": null,
  "category": "consumer-electronics",
  "description": "All In One ,500W Max Audio Power  ,Dynamic Light Show, Dual 10'' Subwoofer,Vocal Fader , Pair Play ,Karaoke Mode,",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "314000",
   "display": "₦314,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "314,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-aud-saturn",
  "name": "AUD SATURN",
  "brand": "Hisense",
  "model": "AUD SATURN",
  "sku": null,
  "category": "consumer-electronics",
  "description": "HT SATURN HOME THEATRE,700W,CINEMATIC SOUND,DOLBY ATMOS,5 LIGHTING EFFECTS,ROOM FITTING  TUNING,",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "495000",
   "display": "₦495,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "495,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-aud3100hs",
  "name": "SoundBar AUD3100HS",
  "brand": "Hisense",
  "model": "AUD3100HS",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Sound bar,3 .1 Ch HDMI Bluetooth Optical Input AUX ,USB ,480 Watts",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SoundBar",
  "source": {
   "document": "Hisense.pdf",
   "page": 4
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-aud3120q-ax",
  "name": "AUD3120Q-AX",
  "brand": "Hisense",
  "model": "AUD3120Q-AX",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Sound Bar, 3.1.4Ch,Dolby atoms,6.5Wireless subwoofer,HDMI, Bluetooth, AUX ,USB, 440Watts",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "249000",
   "display": "₦249,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "249,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-hisaud3100q-ax",
  "name": "HISAUD3100Q-AX",
  "brand": "Hisense",
  "model": "HISAUD3100Q-AX",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Sound Bar, 3.1.2Ch,Dolby atoms,6.5Wireless subwoofer,HDMI, Bluetooth, AUX ,USB, 500Watts",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "175000",
   "display": "₦175,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "175,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-hisaud5100q-ax",
  "name": "SoundBar HISAUD5100Q-AX",
  "brand": "Hisense",
  "model": "HISAUD5100Q-AX",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Sound Bar, 5 .1Ch ,Dolby atoms,6 .5Wireless subwoofer,HDMI Bluetooth ,7EQ MODES AUX ,USB 580Watts",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SoundBar",
  "source": {
   "document": "Hisense.pdf",
   "page": 4
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-hisaud700ha",
  "name": "HISAUD700HA",
  "brand": "Hisense",
  "model": "HISAUD700HA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Mini HIFI system,810w,karaoke,bluetooth,multi connection,",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "219000",
   "display": "₦219,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "219,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-histoa850bk",
  "name": "HISTOA850BK",
  "brand": "Hisense",
  "model": "HISTOA850BK",
  "sku": null,
  "category": "consumer-electronics",
  "description": "REHEAT OR DEFROST,WARMING RACK,7 HEATING LEVELS,REMOVABLE  CRUMB TRAY",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "25000.00",
   "display": "₦25,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "25,000.00",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-tv-100q7q",
  "name": "TV 100Q7Q",
  "brand": "Hisense",
  "model": "TV 100Q7Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "100' QLED 4K Smart TV With Quantum Dot Colour,120 high refrsh rate,3HDMI,2USB,Dolby Vision IQ Voice remote",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "2170000",
   "display": "₦2,170,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "2,170,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-100u7q",
  "name": "TV 100U7Q",
  "brand": "Hisense",
  "model": "TV 100U7Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "100\" ULED 4K SMART TV ,BT,4HDMI,2USB,LAN/WiFi.Satellite,",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "2500000",
   "display": "₦2,500,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "2,500,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-100ux",
  "name": "TV 100UX",
  "brand": "Hisense",
  "model": "TV 100UX",
  "sku": null,
  "category": "consumer-electronics",
  "description": "100'' ULED X , MINI LED ,HDR10+ ADAPTIVE,IMAX ENHANCED ,DOLBY VISION ATMOS,dtsx",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "7980000",
   "display": "₦7,980,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "7,980,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-116ux",
  "name": "TV 116UX",
  "brand": "Hisense",
  "model": "TV 116UX",
  "sku": null,
  "category": "consumer-electronics",
  "description": "110'' ULED X , MINI LED ,HDR10+ ADAPTIVE,IMAX ENHANCED ,DOLBY VISION ATMOS,dtsx",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "17000000",
   "display": "₦17,000,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "17,000,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-32a2q",
  "name": "TV 32A2Q",
  "brand": "Hisense",
  "model": "TV 32A2Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Hisense TV 32'' LED FHD TV,2 HDMI, 2 USB DIVX,1 AV  ,Black,Free Bracket",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "135000",
   "display": "₦135,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "135,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-32a4s",
  "name": "TV 32A4S",
  "brand": "Hisense",
  "model": "TV 32A4S",
  "sku": null,
  "category": "consumer-electronics",
  "description": "32\" LED FULL HD TV,2 HDMI, 2 USB DIVX,1 AV  ,Black, Smart , WI FI,Free Bracket",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "249000",
   "display": "₦249,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "249,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-40-a4s",
  "name": "TV 40 A4S",
  "brand": "Hisense",
  "model": "TV 40 A4S",
  "sku": null,
  "category": "consumer-electronics",
  "description": "40\" LED FULL HD TV,2 HDMI, 2 USB DIVX,1 AV  ,Black, Smart , WI FI.Free Bracket",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "295000",
   "display": "₦295,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "295,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-43a4s",
  "name": "TV 43A4S",
  "brand": "Hisense",
  "model": "TV 43A4S",
  "sku": null,
  "category": "consumer-electronics",
  "description": "43\" LED FULL HD TV,2 HDMI, 2 USB DIVX,1 AV  ,Black, Smart , WI FI,Free Bracket",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "333000",
   "display": "₦333,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "333,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-43a5200",
  "name": "TV 43A5200",
  "brand": "Hisense",
  "model": "TV 43A5200",
  "sku": null,
  "category": "consumer-electronics",
  "description": "43'' LED HD TV,2 HDMI, 2 USB DIVX,1 AV  ,Black,Free Bracket",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "245000",
   "display": "₦245,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "245,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-50-a4q",
  "name": "TV 50 A4Q",
  "brand": "Hisense",
  "model": "TV 50 A4Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "50\" LED FULL HD TV,2 HDMI, 2 USB DIVX,1 AV  ,Black, Smart , WI FI.Free Bracket",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "375000",
   "display": "₦375,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "375,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-50q6q",
  "name": "TV 50Q6Q",
  "brand": "Hisense",
  "model": "TV 50Q6Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "50' QLED 4K Smart TV With Quantum Dot Colour,Dolby Vision IQ,AI 4K UPSCALER,AI SMOOTH MOTION, Wall Bracket",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "485000",
   "display": "₦485,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "485,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-55a6q",
  "name": "TV 55A6Q",
  "brand": "Hisense",
  "model": "TV 55A6Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "55\" UHD 4K SMART TV, 3 HDMI, 2 USB, 1 AV, Free Wall Bracket,Dolby Vision HDR,BT,Game Mode Plus,Free Wall Bracket",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "535000",
   "display": "₦535,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "535,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-55q6q",
  "name": "TV 55Q6Q",
  "brand": "Hisense",
  "model": "TV 55Q6Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "55' QLED 4K Smart TV With Quantum Dot Colour,120 high refrsh rate,3HDMI,2USB,Dolby Vision IQ,Voice remote",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "565000",
   "display": "₦565,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "565,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-55u7s",
  "name": "TV 55U7S",
  "brand": "Hisense",
  "model": "TV 55U7S",
  "sku": null,
  "category": "consumer-electronics",
  "description": "55''ULED Mini LED,HI-QLED Mini LED ,Native 144Hz Game Mode Built In Subwoofer,UnibodySLIM,4HDMI,2USB",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "775000",
   "display": "₦775,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "775,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-58a6n",
  "name": "TV 58A6N",
  "brand": "Hisense",
  "model": "TV 58A6N",
  "sku": null,
  "category": "consumer-electronics",
  "description": "58\" UHD 4K SMART TV, 3 HDMI, 2 USB, 1 AV, Free Wall Bracket, WIFI, LAN,Free Wall Bracket",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "525000",
   "display": "₦525,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "525,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-65a6q",
  "name": "TV 65A6Q",
  "brand": "Hisense",
  "model": "TV 65A6Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "65\" UHD 4K SMART TV, 3 HDMI, 2 USB, 1 AV, Free Wall Bracket,Dolby Vision HDR,BT,Game Mode Plus,Free Wall Bracket",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "665000",
   "display": "₦665,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "665,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-65q6q",
  "name": "TV 65Q6Q",
  "brand": "Hisense",
  "model": "TV 65Q6Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "65' QLED 4K Smart TV With Quantum Dot Colour,120 high refrsh rate,3HDMI,2USB,Dolby Vision IQ,Voice remote",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "750000",
   "display": "₦750,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "750,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-65u7s",
  "name": "TV 65U7S",
  "brand": "Hisense",
  "model": "TV 65U7S",
  "sku": null,
  "category": "consumer-electronics",
  "description": "65''ULED Mini LED,HI-QLED Mini LED ,Native 144Hz Game Mode Built In Subwoofer,UnibodySLIM,4HDMI,2USB",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "1050000",
   "display": "₦1,050,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,050,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-70-a6q",
  "name": "TV 70 A6Q",
  "brand": "Hisense",
  "model": "TV 70 A6Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "70\" UHD 4K SMART TV, 3 HDMI, 2 USB, 1 AV, Free Wall Bracket, WIFI, LAN",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "895000",
   "display": "₦895,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "895,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-75-wm6fe",
  "name": "TV 75 WM6FE",
  "brand": "Hisense",
  "model": "TV 75 WM6FE",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Commercial Displays,Smooth Touch, Accurate As Analog,Collaborative Interaction,Intuitive Controls,4kUHD, Video Confecering,Touch Pen, Plug In Camera, Array Microphones, Automatic Sound Bar, HDMI, USB, HDMI",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "2900000",
   "display": "₦2,900,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "2,900,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-75q6q",
  "name": "TV 75Q6Q",
  "brand": "Hisense",
  "model": "TV 75Q6Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "75' QLED 4K Smart TV With Quantum Dot Colour,120 high refrsh rate,3HDMI,2USB,Dolby Vision IQ,Voice remote",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "975000",
   "display": "₦975,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "975,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-75q7q",
  "name": "TV 75Q7Q",
  "brand": "Hisense",
  "model": "TV 75Q7Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "75' QLED 4K Smart TV With Quantum Dot Colour,120 high refrsh rate,3HDMI,2USB,Dolby Vision IQ,Voice remote",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "1040000",
   "display": "₦1,040,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,040,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-75u7s",
  "name": "TV 75U7S",
  "brand": "Hisense",
  "model": "TV 75U7S",
  "sku": null,
  "category": "consumer-electronics",
  "description": "75''ULED Mini LED,HI-QLED Mini LED ,Native 144Hz Game Mode Built In Subwoofer,UnibodySLIM,4HDMI,2USB",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "1250000",
   "display": "₦1,250,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,250,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-85q6q",
  "name": "TV 85Q6Q",
  "brand": "Hisense",
  "model": "TV 85Q6Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "85' QLED 4K Smart TV With Quantum Dot Colour,120 high refrsh rate,3HDMI,2USB,Dolby Vision IQ Voice remote",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "1535000",
   "display": "₦1,535,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,535,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-86-we3fe",
  "name": "TV 86 WE3FE",
  "brand": "Hisense",
  "model": "TV 86 WE3FE",
  "sku": null,
  "category": "consumer-electronics",
  "description": "Commercial Displays,Smooth Touch, Accurate As Analog,Collaborative Interaction,Intuitive Controls,4kUHD, Video Confecering,Touch Pen, Plug In Camera, Array Microphones, Automatic Sound Bar, HDMI, USB, HDMI",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "descriptionSource": {
   "document": "Hisense.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "3800000",
   "display": "₦3,800,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "3,800,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv-stand-wh3309-lk",
  "name": "TV STAND WH3309-LK",
  "brand": "Hisense",
  "model": "TV STAND WH3309-LK",
  "sku": null,
  "category": "consumer-electronics",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "507800",
   "display": "₦507,800"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "507,800",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv120l9g",
  "name": "TV120L9G",
  "brand": "Hisense",
  "model": "TV120L9G",
  "sku": null,
  "category": "consumer-electronics",
  "description": "HIS TV 120 L9G LASER TV",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "4500000",
   "display": "₦4,500,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "4,500,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv32d2n",
  "name": "LED TV32D2N",
  "brand": "Hisense",
  "model": "TV32D2N",
  "sku": null,
  "category": "consumer-electronics",
  "description": "32'' LED HD TV ,3 HDMI 2 USB ,1 AV ,Black ,Free Bracket",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "LED",
  "source": {
   "document": "Hisense.pdf",
   "page": 4
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-tv50q5s",
  "name": "TV50Q5S",
  "brand": "Hisense",
  "model": "TV50Q5S",
  "sku": null,
  "category": "consumer-electronics",
  "description": "50,QLED TV,HI-QLED COLOUR,DTS VIRTUAL :X,SHARE TO TV,NOISE REDUCTION ,2HDMI, USB,FREE WALL BRACKET",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "405000",
   "display": "₦405,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "405,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv55s7q-canvas",
  "name": "TV55S7Q(CANVAS)",
  "brand": "Hisense",
  "model": "TV55S7Q(CANVAS)",
  "sku": null,
  "category": "consumer-electronics",
  "description": "55''Art Mode ,QLED,STYLEWAP FRAMES,Hi Matte Display ,Ultra Slim Wall Mount (Free Wall Bracket)",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "885000",
   "display": "₦885,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "885,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv55u6q",
  "name": "TV55U6Q",
  "brand": "Hisense",
  "model": "TV55U6Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "55''-ULED,LCD Mini-LED Pro+,mini led) 4K Smart TV With Quantum Dot Colour,144HZ Game Mode Pro,3HDMI,2USB,Dolby Vision IQ, Multi channel surround,",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "640000",
   "display": "₦640,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "640,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv65s7q-canvas",
  "name": "TV65S7Q(CANVAS)",
  "brand": "Hisense",
  "model": "TV65S7Q(CANVAS)",
  "sku": null,
  "category": "consumer-electronics",
  "description": "65''Art Mode ,QLED ,STYLEWAP FRAMES ,Hi Matte Display ,Ultra Slim Wall Mount (Free Wall Bracket)",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "descriptionSource": {
   "document": "Hisense.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "1099000",
   "display": "₦1,099,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,099,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv65u6q",
  "name": "QLED TV65U6Q",
  "brand": "Hisense",
  "model": "TV65U6Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "65''-ULED ,LCD Mini-LED Pro+,mini led) 4K Smart TV With Quantum Dot Colour,144HZ Game Mode Pro,3HDMI ,2USB ,Dolby Vision IQ Multi channel surround",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "QLED",
  "source": {
   "document": "Hisense.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-tv65ur8s",
  "name": "TV65UR8S",
  "brand": "Hisense",
  "model": "TV65UR8S",
  "sku": null,
  "category": "consumer-electronics",
  "description": "65'' RGB MiniLED ,Hi-View AI Engine RGB,Native 180 Hz, Game Mode , Anti Reflection & Glare Free",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "1635000",
   "display": "₦1,635,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,635,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tv75u8q",
  "name": "QLED TV75U8Q",
  "brand": "Hisense",
  "model": "TV75U8Q",
  "sku": null,
  "category": "consumer-electronics",
  "description": "75ULED VIDAAHIVIEWAI ENGINEBUILTINSUBWOOFER4HDMI2USBFREEWALLBRACKET",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "QLED",
  "source": {
   "document": "Hisense.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-tv85u7s",
  "name": "QLED TV85U7S",
  "brand": "Hisense",
  "model": "TV85U7S",
  "sku": null,
  "category": "consumer-electronics",
  "description": "85''ULED Mini LED ,HI-QLED Mini LED ,Native 144Hz Game Mode Built In Subwoofer,UnibodySLIM ,4HDMI ,2USB",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "QLED",
  "source": {
   "document": "Hisense.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "hisense-tv85ur8s",
  "name": "TV85UR8S",
  "brand": "Hisense",
  "model": "TV85UR8S",
  "sku": null,
  "category": "consumer-electronics",
  "description": "85'' RGB MiniLED ,Hi-View AI Engine RGB,Native 180 Hz, Game Mode , Anti Reflection & Glare Free",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "2470000",
   "display": "₦2,470,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "2,470,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tvlaserc2",
  "name": "TVLASERC2",
  "brand": "Hisense",
  "model": "TVLASERC2",
  "sku": null,
  "category": "consumer-electronics",
  "description": "HIS LASER PROJECTOR C2",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "1950000",
   "display": "₦1,950,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,950,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-tvlaserpx3",
  "name": "TVLASERPX3",
  "brand": "Hisense",
  "model": "TVLASERPX3",
  "sku": null,
  "category": "consumer-electronics",
  "description": "HIS LASER CINEMA LASER PX3",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "2750000",
   "display": "₦2,750,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "2,750,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "hisense-aud-110hp",
  "name": "AUD 110HP",
  "brand": "Hisense",
  "model": "AUD 110HP",
  "sku": null,
  "category": "solar-energy",
  "description": "Hisense Party Rocker Speaker,2.0 Ch,InBuilt Battery,300 W,Subwofer,Wireless Charge,Dual Wireless Microphone",
  "image": {
   "url": "../assets/catalogue/hardware-energy.svg",
   "alt": "Illustrative solar and energy category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "285000",
   "display": "₦285,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "285,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-bathel5-e-bb1",
  "name": "BATHEL5-E-BB1",
  "brand": "Hisense",
  "model": "BATHEL5-E-BB1",
  "sku": null,
  "category": "solar-energy",
  "description": "5.12 kwh LOW VOLTAGE  51.2V 100AH ,",
  "image": {
   "url": "../assets/catalogue/hardware-energy.svg",
   "alt": "Illustrative solar and energy category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "849000",
   "display": "₦849,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "849,000",
    "document": "Hisense-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "hisense-hisaudpartythunder",
  "name": "HISAUDPARTYTHUNDER",
  "brand": "Hisense",
  "model": "HISAUDPARTYTHUNDER",
  "sku": null,
  "category": "solar-energy",
  "description": "Ultimate Party Starter,2.0 Ch,InBuilt Battery,620 W,Subwofer,Wireless Charge.",
  "image": {
   "url": "../assets/catalogue/hardware-energy.svg",
   "alt": "Illustrative solar and energy category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "360000",
   "display": "₦360,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "360,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "hisense-inv6ks-aa1",
  "name": "INV6KS-AA1",
  "brand": "Hisense",
  "model": "INV6KS-AA1",
  "sku": null,
  "category": "solar-energy",
  "description": "6 KW inverter  , 48V ,9000 W MPPT Input , Built-in 120A MPPT Solar Charger , Wide Solar Input Range 60-500V , Support Lithium & Lead-acid Battery , Wifi Monitoring & Management , Dual AC Output , Parallel Support Up-to 9 Inverters",
  "image": {
   "url": "../assets/catalogue/hardware-energy.svg",
   "alt": "Illustrative solar and energy category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "Hisense-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "359000",
   "display": "₦359,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "359,000",
    "document": "Hisense-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-aud70tys",
  "name": " AUD70TYS",
  "brand": "LG",
  "model": "AUD70TYS",
  "sku": null,
  "category": "appliances",
  "description": "400 W ,3 .1 .1CH Sound Bar, cinematic sound with Dolby Atoms,BT ,Wireless",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-ceiling-cassette-2-5hp-inv",
  "name": "CEILING CASSETTE 2.5HP INV",
  "brand": "LG",
  "model": "CEILING CASSETTE 2.5HP INV",
  "sku": null,
  "category": "appliances",
  "description": "CASSETTE TYPE, SUPER SLIM DESIGN, OPTIMAL AIR DISTRIBUTION, AUTO RESTART, ANTI BACTERIA FILTER, ANTI CORROSION GOLFD FIN, LONG DISTANCE PIPING HIGH ELEVATION MAX 30 M FOR 2HP & 50 M FOR 2.5HP",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "1475000",
   "display": "₦1,475,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,475,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-ceiling-cassette-5-0hp-inv",
  "name": "CEILING CASSETTE 5.0HP INV",
  "brand": "LG",
  "model": "CEILING CASSETTE 5.0HP INV",
  "sku": null,
  "category": "appliances",
  "description": "AND ABOVE,R410 GAS,INVERTER TYPE",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "1950000",
   "display": "₦1,950,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,950,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-ceiling-conc-22gm1a4-abnq22gm1a4",
  "name": "CEILING CONC. 22GM1A4(ABNQ22GM1A4)",
  "brand": "LG",
  "model": "CEILING CONC. 22GM1A4(ABNQ22GM1A4)",
  "sku": null,
  "category": "appliances",
  "description": "2HP,OPTIMAL AIR DISTRIBUTION, AUTO RESTART, ANTI BACTERIA FILTER, ANTI CORROSION GOLFD FIN.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "1156600",
   "display": "₦1,156,600"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,156,600",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-ceiling-conc-30gm1a4-abnq30gm1a4",
  "name": "CEILING CONC. 30GM1A4(ABNQ30GM1A4)",
  "brand": "LG",
  "model": "CEILING CONC. 30GM1A4(ABNQ30GM1A4)",
  "sku": null,
  "category": "appliances",
  "description": "3HP,,OPTIMAL AIR DISTRIBUTION, AUTO RESTART, ANTI BACTERIA FILTER, ANTI CORROSION GOLFD FIN.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "1387800",
   "display": "₦1,387,800"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,387,800",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-ceiling-conc-48gm1a4-abnq50gm1a4",
  "name": "CEILING CONC. 48GM1A4(ABNQ50GM1A4)",
  "brand": "LG",
  "model": "CEILING CONC. 48GM1A4(ABNQ50GM1A4)",
  "sku": null,
  "category": "appliances",
  "description": "5 HP,,OPTIMAL AIR DISTRIBUTION, AUTO RESTART, ANTI BACTERIA FILTER, ANTI CORROSION GOLFD FIN.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "1900000",
   "display": "₦1,900,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,900,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-ceilingconc-22gm1a4-abnq",
  "name": "CEILINGCOUNCEILED CEILINGCONC 22GM1A4(ABNQ .",
  "brand": "LG",
  "model": "CEILINGCONC 22GM1A4(ABNQ .",
  "sku": null,
  "category": "appliances",
  "description": "2HPOPTIMALAIRDISTRIBUTION AUTORESTART ANTIBACTERIAFILTER ANTICORROSIONGOLFDFIN , , , , .",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "CEILINGCOUNCEILED",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-ceilingconc-30gm1a4-abnq",
  "name": "CEILINGCOUNCEILED CEILINGCONC 30GM1A4(ABNQ .",
  "brand": "LG",
  "model": "CEILINGCONC 30GM1A4(ABNQ .",
  "sku": null,
  "category": "appliances",
  "description": "3HP OPTIMALAIRDISTRIBUTION AUTORESTART ANTIBACTERIAFILTER ANTICORROSIONGOLFDFIN ,, , , , .",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "CEILINGCOUNCEILED",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-deh16gqwe0md",
  "name": "DEH16GQWE0MD",
  "brand": "LG",
  "model": "DEH16GQWE0MD",
  "sku": null,
  "category": "appliances",
  "description": "28L Inverter Smart Dehumidifier with Ionizer,Dual Inverter,Smart Efficiency,ThinQ™,30 safety features",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "384000",
   "display": "₦384,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "384,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-deh20gmwe1dd",
  "name": "DEH20GMWE1DD",
  "brand": "LG",
  "model": "DEH20GMWE1DD",
  "sku": null,
  "category": "appliances",
  "description": "34L PuriCare™ DUAL Inverter Dehumidifier,Dual Inverter Compressor™,Compact design,Hidden handle & hidden cord,LG ThinQ™",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "434000",
   "display": "₦434,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "434,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-dryer-80t2sp7rm-rh",
  "name": "Dryer 80T2SP7RM-RH",
  "brand": "LG",
  "model": "Dryer 80T2SP7RM-RH",
  "sku": null,
  "category": "appliances",
  "description": "LG Dryer Dryer, Silver, 8KG, LED display, Drum light, Low noise, Sensor dry",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "712200",
   "display": "₦712,200"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "712,200",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-dryer-90v9pv8n",
  "name": "Dryer 90V9PV8N",
  "brand": "LG",
  "model": "Dryer 90V9PV8N",
  "sku": null,
  "category": "appliances",
  "description": "Dryer, Silver , 9KG, LED display, Dual Inverter Heat Pump, Low noise,Eco Hybrid,Auto Cleaning Condense,Allergy Car,Dual Filter,ThinQ™",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "988000",
   "display": "₦988,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "988,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-frz-255bqcf",
  "name": "FRZ 255BQCF",
  "brand": "LG",
  "model": "FRZ 255BQCF",
  "sku": null,
  "category": "appliances",
  "description": "243L,SILVER,R600 GAS,,lock and key",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "289000",
   "display": "₦289,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "289,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-frz-305bqcf",
  "name": "FRZ 305BQCF",
  "brand": "LG",
  "model": "FRZ 305BQCF",
  "sku": null,
  "category": "appliances",
  "description": "291L,SILVER,R600 GAS,,lock and key",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "339000",
   "display": "₦339,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "339,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-frz-414",
  "name": "FRZ 414",
  "brand": "LG",
  "model": "FRZ 414",
  "sku": null,
  "category": "appliances",
  "description": "1Door,355 L,Silver,Linear Compressor ,R600 Gas, 7 Drawers Freezer.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "875000",
   "display": "₦875,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "875,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-frz205bqcf",
  "name": "FRZ205BQCF",
  "brand": "LG",
  "model": "FRZ205BQCF",
  "sku": null,
  "category": "appliances",
  "description": "194L,SILVER,R600 GAS,,lock and key",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "248000",
   "display": "₦248,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "248,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-frz405bqcf",
  "name": "CHESTFREEZER FRZ405BQCF",
  "brand": "LG",
  "model": "FRZ405BQCF",
  "sku": null,
  "category": "appliances",
  "description": "398L ,SILVER ,R600 GAS ,,lock and key",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "CHESTFREEZER",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-fs-10-hp-inverter",
  "name": "FS 10 HP INVERTER",
  "brand": "LG",
  "model": "FS 10 HP INVERTER",
  "sku": null,
  "category": "appliances",
  "description": "Standing AC, Auto Restart, Inverter, R410 Gas, No Kit",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "5900000",
   "display": "₦5,900,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "5,900,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-fs-2hp-inverter",
  "name": "FS 2HP INVERTER",
  "brand": "LG",
  "model": "FS 2HP INVERTER",
  "sku": null,
  "category": "appliances",
  "description": "Standing AC, Auto Restart, Inverter, R410 Gas, No Kit,Gencool Type Can Work On 2.5 KVA Generator",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "1095000",
   "display": "₦1,095,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,095,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-fs-3hp-inverter",
  "name": "FS 3HP INVERTER",
  "brand": "LG",
  "model": "FS 3HP INVERTER",
  "sku": null,
  "category": "appliances",
  "description": "Standing AC, Auto Restart, Inverter, R410 Gas, No Kit,Gencool Type Can Work On 3.5 KVA Generator",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "1290000",
   "display": "₦1,290,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,290,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-fs-5hp-inverter",
  "name": "FS 5HP INVERTER",
  "brand": "LG",
  "model": "FS 5HP INVERTER",
  "sku": null,
  "category": "appliances",
  "description": "Standing AC, Auto Restart, Inverter, R410 Gas, No Kit,Gencool Type Can Work On 6.0 KVA Generator",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "2450000",
   "display": "₦2,450,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "2,450,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-fs25q2yb0",
  "name": "FS25Q2YB0",
  "brand": "LG",
  "model": "FS25Q2YB0",
  "sku": null,
  "category": "appliances",
  "description": "2.5hpStanding AC, Minimalist air conditioner completed with digital circle,One-sided wind,(Automatic + Self) Cleaning Management,Digital Circle Design,Smart Care",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "3750000",
   "display": "₦3,750,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "3,750,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-gcfb041pqcf",
  "name": "SINGLEDOOR GCFB041PQCF",
  "brand": "LG",
  "model": "GCFB041PQCF",
  "sku": null,
  "category": "appliances",
  "description": "45L One door,ICE Key & lock Mech Control , , , .",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SINGLEDOOR",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-installation-kit-3hp-5hp",
  "name": "INSTALLATION  KIT 3HP&5HP",
  "brand": "LG",
  "model": "INSTALLATION  KIT 3HP&5HP",
  "sku": null,
  "category": "appliances",
  "description": "Original Installation kit for floor standing & SPL AC 3.0HP and 5.0HP, 5 M",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "46700",
   "display": "₦46,700"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "46,700",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-lg-dw-512dfb-fp",
  "name": "LGDISHWASHER LG DW 512DFB-FP",
  "brand": "LG",
  "model": "LG DW 512DFB-FP",
  "sku": null,
  "category": "appliances",
  "description": "LG QuadWash™ Dishwasher, 14 Place Setting, EasyRack™ Plus, Inverter Direct Drive A++ Energy Efficiency, , SmartThin,Linear Compressor(10 years Warranty)",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "LGDISHWASHER",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-lg-dw-532dfc-fp",
  "name": "LG DW 532DFC-FP",
  "brand": "LG",
  "model": "LG DW 532DFC-FP",
  "sku": null,
  "category": "appliances",
  "description": "LG QuadWash™ Dishwasher, 14 Place Setting, EasyRack™ Plus, Inverter Direct Drive , A++ Energy Efficiency, SmartThin,Linear Compressor(10 years Warranty)",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   },
   {
    "text": "10 years Warranty",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "product-row"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "795000",
   "display": "₦795,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "795,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-lg-ref-081-pqcf",
  "name": "LG REF 081 PQCF",
  "brand": "LG",
  "model": "LG REF 081 PQCF",
  "sku": null,
  "category": "appliances",
  "description": "89L, One door, Key & lock, Mech Control, SILVER,Evaporator & door,Temperature Control,Veg box Tray,Veg box drawer",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "154000",
   "display": "₦154,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "154,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-lgaud301stage",
  "name": "LGAUD301STAGE",
  "brand": "LG",
  "model": "LGAUD301STAGE",
  "sku": null,
  "category": "consumer-electronics",
  "description": "60W, 6.5” woofer and 2.5” midranges,AI,Bass boost,voice enahnce,12 hours non stop,Lighting designed to sync with your music.,karaoke optimized, professional stage design",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "275000",
   "display": "₦275,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "275,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-lgaud501stage",
  "name": "LGAUD501STAGE",
  "brand": "LG",
  "model": "LGAUD501STAGE",
  "sku": null,
  "category": "appliances",
  "description": "Xboom Signature Sound Tuned by will.i.am,220w ,4way Mounting,over one day playtime on a single charge,AI KARAOKE MASTER,BT",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "495000",
   "display": "₦495,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "495,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-lgfs2hpn2xa0",
  "name": "FLOORSTANDING(TWIN LGFS2HPN2XA0",
  "brand": "LG",
  "model": "LGFS2HPN2XA0",
  "sku": null,
  "category": "appliances",
  "description": "2hpStanding AC Auto cleaning management ,ultra fine filter,AI dry+,artificial intelligence smart care,LED display",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "FLOORSTANDING(TWIN",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-lgref182pqcf",
  "name": "LGREF182PQCF",
  "brand": "LG",
  "model": "LGREF182PQCF",
  "sku": null,
  "category": "appliances",
  "description": "Non frost ,silver,191L ,R600 Gas",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "327600",
   "display": "₦327,600"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "327,600",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-lgtv43lr600",
  "name": "LGTV43LR600",
  "brand": "LG",
  "model": "LGTV43LR600",
  "sku": null,
  "category": "consumer-electronics",
  "description": "43 LED,AV,3 HDMI,3USB,SMART,BUILT IN SATELLITE RECEIVER,WiFi,Free Bracket",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "335000",
   "display": "₦335,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "335,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-lgwm95s1tddt2",
  "name": "TOPLOADER LGWM95S1TDDT2",
  "brand": "LG",
  "model": "LGWM95S1TDDT2",
  "sku": null,
  "category": "appliances",
  "description": "Top loader 9 KG Full automatic,Silver Color, 36% Energy Saving,Smart Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "TOPLOADER",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-mwo-2032",
  "name": "MWO 2032",
  "brand": "LG",
  "model": "MWO 2032",
  "sku": null,
  "category": "appliances",
  "description": "20 Liters,,Less Power Consuption,1000 Watts Black, Glass Touch black LED Display,Lamp",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "113200",
   "display": "₦113,200"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "113,200",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-mwo-2595",
  "name": "MWO 2595",
  "brand": "LG",
  "model": "MWO 2595",
  "sku": null,
  "category": "appliances",
  "description": "25 Liters, Inverter,Less Power Consuption,1000 Watts Silver, Glass Touch,White LED Display,Lamp",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "156700",
   "display": "₦156,700"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "156,700",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-mwo-6535",
  "name": "MWO 6535",
  "brand": "LG",
  "model": "MWO 6535",
  "sku": null,
  "category": "appliances",
  "description": "25 Liters, Black, Smart Inverter, LED Lamp, Touch Control, Stable Turntable, Grill",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "175000",
   "display": "₦175,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "175,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-mwo-8265cis",
  "name": "MWO 8265CIS",
  "brand": "LG",
  "model": "MWO 8265CIS",
  "sku": null,
  "category": "appliances",
  "description": "42 Liters, Inverter,LED Lamp,Touch Control,Stable Turntable,Anti Bacterial ,Stainless Silver, Grill",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "215000",
   "display": "₦215,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "215,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-mwo-8265dis",
  "name": "MWO 8265DIS",
  "brand": "LG",
  "model": "MWO 8265DIS",
  "sku": null,
  "category": "appliances",
  "description": "42 Liters, Inverter,LED Lamp,Touch Control,Stable Turntable,Anti Bacterial ,Black, Grill",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "209000",
   "display": "₦209,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "209,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-mwo2535",
  "name": "INVERTER MWO2535",
  "brand": "LG",
  "model": "MWO2535",
  "sku": null,
  "category": "appliances",
  "description": "25 Liters, Inverter,Less Power Consuption,1000 Watts Black Glass Touch ,White LED Display,Lamp",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "INVERTER",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-mwo3032",
  "name": "NONINVERTER MWO3032",
  "brand": "LG",
  "model": "MWO3032",
  "sku": null,
  "category": "appliances",
  "description": "30 Liters,Less Power Consuption,1000 Watts Black Glass Touch ,White LED Display,Lamp",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "NONINVERTER",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-ref-202-sqbb",
  "name": "REF 202 SQBB",
  "brand": "LG",
  "model": "REF 202 SQBB",
  "sku": null,
  "category": "appliances",
  "description": "Non frost ,silver,205 L ,R600 Gas",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "385000",
   "display": "₦385,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "385,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-ref-212plgb-b",
  "name": "REF 212PLGB-B",
  "brand": "LG",
  "model": "REF 212PLGB-B",
  "sku": null,
  "category": "appliances",
  "description": "235L, Non Frost ,platinum silver, 10 years warranty on smart inverter comproser,R600 Gas,Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   },
   {
    "text": "10 years warranty on smart inverter comproser",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "product-row"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "459000",
   "display": "₦459,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "459,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-ref-22ffqpb",
  "name": "REF 22FFQPB",
  "brand": "LG",
  "model": "REF 22FFQPB",
  "sku": null,
  "category": "appliances",
  "description": "570 L, French Door, MoodUP® Refrigerators,Black Color , R600 Gas ,4Doors.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "1870000",
   "display": "₦1,870,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,870,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-ref-242-pqgb",
  "name": "REF 242 PQGB",
  "brand": "LG",
  "model": "REF 242 PQGB",
  "sku": null,
  "category": "appliances",
  "description": "263 L,Non Frost ,silver ,10 years warranty on linear comproser ,  R600, Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   },
   {
    "text": "10 years warranty on linear comproser ",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "product-row"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "480000",
   "display": "₦480,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "480,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-ref-252-slbb",
  "name": "REF 252 SLBB",
  "brand": "LG",
  "model": "REF 252 SLBB",
  "sku": null,
  "category": "appliances",
  "description": "260 L,Non Frost ,silver ,10 years warranty on linear comproser ,  R600, Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   },
   {
    "text": "10 years warranty on linear comproser ",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "product-row"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "470000",
   "display": "₦470,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "470,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-ref-257-cses-x",
  "name": "REF 257 CSES-X",
  "brand": "LG",
  "model": "REF 257 CSES-X",
  "sku": null,
  "category": "appliances",
  "description": "NOK-NOK ,DOOR IN DOOR, Platinum Silver 674 LTR, Automatic Ice Maker LED LAMP, Linear Compressor, R600 GAS, Water Dispenser",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "1991600",
   "display": "₦1,991,600"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,991,600",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-ref-257-klkw-l",
  "name": "SIDEBYSIDE REF 257 KLKW-L",
  "brand": "LG",
  "model": "REF 257 KLKW-L",
  "sku": null,
  "category": "appliances",
  "description": "674L2 DOORWATERDISPENSER&ICEMAKER SILVERLINEARCOMPRESSOR",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SIDEBYSIDE",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-ref-257fqkw-j-694l",
  "name": "SIDEBYSIDE REF 257FQKW-J 694L",
  "brand": "LG",
  "model": "REF 257FQKW-J 694L",
  "sku": null,
  "category": "appliances",
  "description": "684l ,Essence Matte Black ,Ice maker,Double door, Water dispenser,LINEAR COMPRESSOR",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SIDEBYSIDE",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-ref-331-slbb",
  "name": "REF 331 SLBB",
  "brand": "LG",
  "model": "REF 331 SLBB",
  "sku": null,
  "category": "appliances",
  "description": "One door, Silver color, linear Compressor , 199 L,Inverter R600 GAS",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "289000",
   "display": "₦289,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "289,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-ref-372plgb",
  "name": "REF 372PLGB",
  "brand": "LG",
  "model": "REF 372PLGB",
  "sku": null,
  "category": "appliances",
  "description": "375 L,Non Frost ,silver ,10 years warranty on linear comproser ,  R600, Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   },
   {
    "text": "10 years warranty on linear comproser ",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "product-row"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "675000",
   "display": "₦675,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "675,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-ref-392-plgb",
  "name": "REF 392 PLGB",
  "brand": "LG",
  "model": "REF 392 PLGB",
  "sku": null,
  "category": "appliances",
  "description": "395 L , vitamin plus,Silver,R600 Gas , Inverter,10 years warranty on linear compressor.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   },
   {
    "text": "10 years warranty on linear compressor",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "product-row"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "595000",
   "display": "₦595,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "595,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-ref-411-eldm",
  "name": "REF 411 ELDM",
  "brand": "LG",
  "model": "REF 411 ELDM",
  "sku": null,
  "category": "appliances",
  "description": "1Door,411 L,Silver,Linear Compressor,Water dispenser ,R600 Gas,Refrigerator.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "695000",
   "display": "₦695,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "695,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-ref-41fplamgcf",
  "name": "REF 41FPLAMGCF",
  "brand": "LG",
  "model": "REF 41FPLAMGCF",
  "sku": null,
  "category": "appliances",
  "description": "4 Doors REF, Silver , 434L ,LED Lamp&Display Board ,R600 Gas ,",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "689000",
   "display": "₦689,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "689,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-ref-502-hlcl-t",
  "name": "REF 502 HLCL T",
  "brand": "LG",
  "model": "REF 502 HLCL T",
  "sku": null,
  "category": "appliances",
  "description": "471 L , vitamin plus,Silver, deodorizer: , LED lamp inside,R600 Gas , Inverter,10 years warranty on linear compressor., Water Dispenser",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   },
   {
    "text": "10 years warranty on linear compressor",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "product-row"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "795000",
   "display": "₦795,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "795,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-ref24fdmmb-a",
  "name": "SIDEBYSIDE REF24FDMMB-A",
  "brand": "LG",
  "model": "REF24FDMMB-A",
  "sku": null,
  "category": "appliances",
  "description": "LG 617L French Door, MoodUP® Refrigerators, Objet Collection, 3 Star,Color Collection( ,Music Collection ( Bluetooth , Speaker) ,Door Cooling & Multi Air Flow,Hygiene Fresh ,Retractable Shelves",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SIDEBYSIDE",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-ref24ffcab-x",
  "name": "REF24FFCAB-X",
  "brand": "LG",
  "model": "REF24FFCAB-X",
  "sku": null,
  "category": "appliances",
  "description": "679 LG Black Glass InstaView, French Door Fridge, Essence Black Steel,Water Dispenser,",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "2190000",
   "display": "₦2,190,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "2,190,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-ref257kghw",
  "name": "SIDEBYSIDE REF257KGHW",
  "brand": "LG",
  "model": "REF257KGHW",
  "sku": null,
  "category": "appliances",
  "description": "703L ,BLACK MIRROR ,Linear Compressor ,R600 Gas",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SIDEBYSIDE",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-ref262pqgb",
  "name": "DOUBLEDOORTOP MOUNTFREEZER REF262PQGB",
  "brand": "LG",
  "model": "REF262PQGB",
  "sku": null,
  "category": "appliances",
  "description": "287L ,Non Frost ,silver ,10 years warranty on linear comproser , R600 , Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "DOUBLEDOORTOP MOUNTFREEZER",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-ref312pfjb",
  "name": "DOUBLEDOORTOP MOUNTFREEZER REF312PFJB",
  "brand": "LG",
  "model": "REF312PFJB",
  "sku": null,
  "category": "appliances",
  "description": "340 L ,Non Frost ,silver ,10 years warranty on linear comproser , R600 , Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "DOUBLEDOORTOP MOUNTFREEZER",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-ref322rlbn",
  "name": "DOUBLEDOORTOP MOUNTFREEZER REF322RLBN",
  "brand": "LG",
  "model": "REF322RLBN",
  "sku": null,
  "category": "appliances",
  "description": "308 L ,Non Frost ,silver ,10 years warranty on linear comproser , R600 , Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "DOUBLEDOORTOP MOUNTFREEZER",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-ref48fplamgcf",
  "name": "SIDEBYSIDE REF48FPLAMGCF",
  "brand": "LG",
  "model": "REF48FPLAMGCF",
  "sku": null,
  "category": "appliances",
  "description": "4 Doors REF Silver ,550 L ,LED Lamp&Display Board ,R600 Gas",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SIDEBYSIDE",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-reff452pfaq",
  "name": "DOUBLEDOORTOP MOUNTFREEZER REFF452PFAQ",
  "brand": "LG",
  "model": "REFF452PFAQ",
  "sku": null,
  "category": "appliances",
  "description": "491 L , vitamin plus,Silver,R600 Gas , Inverter,10 years warranty on linear compressor, Ice maker, water dispenser",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "DOUBLEDOORTOP MOUNTFREEZER",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-spl-1-5hpgencool-b",
  "name": "WALLMOUNTED(DUAL INVERTER) SPL 1 .5HPGENCOOL-B",
  "brand": "LG",
  "model": "SPL 1 .5HPGENCOOL-B",
  "sku": null,
  "category": "appliances",
  "description": "LVS HVS R410GAS CANWORKON09KVAGEN COPPERCONDENSER10YEARSWARRANTYON , , , . , , COMPRESSOR YOUCANUSEONLY1HPKITFORINSTALLATION",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "WALLMOUNTED(DUAL INVERTER)",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-spl-1-0hp-inv",
  "name": "SPL 1.0HP INV",
  "brand": "LG",
  "model": "SPL 1.0HP INV",
  "sku": null,
  "category": "appliances",
  "description": "DUAL INVERTER,MORE ENERGY SAVING,FASTER COOLING,QUIETER THAN A WHISPER,R410,COPPER",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "381000",
   "display": "₦381,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "381,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-spl-1-0hp-sta",
  "name": "SPL 1.0HP STA",
  "brand": "LG",
  "model": "SPL 1.0HP STA",
  "sku": null,
  "category": "appliances",
  "description": "Standard LVS, HVS, R410 GAS, COPPER CONDENSER, (ON/OFF)",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "255000",
   "display": "₦255,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "255,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-spl-1-0hpgencool-b",
  "name": "SPL 1.0HPGENCOOL-B",
  "brand": "LG",
  "model": "SPL 1.0HPGENCOOL-B",
  "sku": null,
  "category": "appliances",
  "description": "LVS, HVS, R410 GAS, CAN WORK ON 0.7 KVA GEN, COPPER CONDENSER,10 YEARS WARRANTY ON COMPRESSOR.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   },
   {
    "text": "10 YEARS WARRANTY",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "product-row"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "468000",
   "display": "₦468,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "468,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-spl-1-5-hp-gen-artcool-mirror",
  "name": "SPL 1.5 HP GEN ARTCOOL MIRROR",
  "brand": "LG",
  "model": "SPL 1.5 HP GEN ARTCOOL MIRROR",
  "sku": null,
  "category": "appliances",
  "description": "Black Mirror , Gencool ,Premium Design,Dual Inverter , Ionizer, WiFi,Can work on 09 Kva Gen",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "795000",
   "display": "₦795,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "795,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-spl-1-5hp-inv",
  "name": "SPL 1.5HP INV",
  "brand": "LG",
  "model": "SPL 1.5HP INV",
  "sku": null,
  "category": "appliances",
  "description": "DUAL INVERTER,MORE ENERGY SAVING,FASTER COOLING,QUIETER THAN A WHISPER,R410,COPPER",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "409000",
   "display": "₦409,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "409,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-spl-2-0-hp-gen-artcool-mirror",
  "name": "SPL 2.0 HP GEN ARTCOOL MIRROR",
  "brand": "LG",
  "model": "SPL 2.0 HP GEN ARTCOOL MIRROR",
  "sku": null,
  "category": "appliances",
  "description": "Black Mirror , Gencool ,Premium Design,Dual Inverter , Ionizer, WiFi,Can work on 1.5 Kva Gen",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "950000",
   "display": "₦950,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "950,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-spl-2-5hpgencool-b",
  "name": "SPL 2.5HPGENCOOL-B",
  "brand": "LG",
  "model": "SPL 2.5HPGENCOOL-B",
  "sku": null,
  "category": "appliances",
  "description": "LVS, HVS, R410 GAS, CAN WORK ON 1.8 KVA GEN, COPPER CONDENSER,10 YEARS WARRANTY ON COMPRESSOR",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   },
   {
    "text": "10 YEARS WARRANTY",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "product-row"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "895000",
   "display": "₦895,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "895,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-spl15hpgenartcoolmirr",
  "name": "WALLMOUNTED(ART BLACKMIRROR) SPL15HPGENARTCOOLMIRR .",
  "brand": "LG",
  "model": "SPL15HPGENARTCOOLMIRR .",
  "sku": null,
  "category": "appliances",
  "description": "Black Mirror , Gencool ,Premium Design,Dual Inverter , Ionizer, WiFi ,Can work on 09 Kva Gen",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "WALLMOUNTED(ART BLACKMIRROR)",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-spl15hpsta",
  "name": "StandardSPLIT SPL15HPSTA .",
  "brand": "LG",
  "model": "SPL15HPSTA .",
  "sku": null,
  "category": "appliances",
  "description": "Standard LVS HVS R410 GAS COPPER CONDENSER (ON/OFF)",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "StandardSPLIT",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-spl20hpgenartcoolmirr",
  "name": "WALLMOUNTED(ART BLACKMIRROR) SPL20HPGENARTCOOLMIRR .",
  "brand": "LG",
  "model": "SPL20HPGENARTCOOLMIRR .",
  "sku": null,
  "category": "appliances",
  "description": "Black Mirror , Gencool ,Premium Design,Dual Inverter , Ionizer, WiFi ,Can work on 1 .5 Kva Gen",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "WALLMOUNTED(ART BLACKMIRROR)",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-spl20hpsta",
  "name": "StandardSPLIT SPL20HPSTA .",
  "brand": "LG",
  "model": "SPL20HPSTA .",
  "sku": null,
  "category": "appliances",
  "description": "Standard LVS HVS R410 GAS COPPER CONDENSER (ON/OFF)",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "StandardSPLIT",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-wm-1310-rh-wt",
  "name": "WM 1310 RH-WT",
  "brand": "LG",
  "model": "WM 1310 RH-WT",
  "sku": null,
  "category": "appliances",
  "description": "Wash Tower ,Washer (13KG), Dryer (10 KG),A Single Unit,Turbo Wash 360,Dual Inverter Heat Pump ,Auto Cleaning Condenser,Simple Control With Voice  Assistant ,Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "2700000",
   "display": "₦2,700,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "2,700,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-wm-1401",
  "name": "WM 1401",
  "brand": "LG",
  "model": "WM 1401",
  "sku": null,
  "category": "appliances",
  "description": "Washer, Twin Top, 12 KG, twin Tub",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "349000",
   "display": "₦349,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "349,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-wm-1561",
  "name": "WM 1561",
  "brand": "LG",
  "model": "WM 1561",
  "sku": null,
  "category": "appliances",
  "description": "Washer, Top loader, 15 KG, twin Tub,Black",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "359000",
   "display": "₦359,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "359,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-wm-2y1typ6j",
  "name": "WM 2Y1TYP6J",
  "brand": "LG",
  "model": "WM 2Y1TYP6J",
  "sku": null,
  "category": "appliances",
  "description": "Front loader, 8 KG, Direct drive, 10 yrs warranty on Direct Drive motor, SILVER COLOUR",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "449000",
   "display": "₦449,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "449,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-wm-4v3ryp6je-f",
  "name": "DRYER WM 4V3RYP6JE-F",
  "brand": "LG",
  "model": "WM 4V3RYP6JE-F",
  "sku": null,
  "category": "appliances",
  "description": "Front loader, 10 .5KG , Direct drive, 10 yrs warranty on Direct Drive motor, 6 Montion ,SILVER COLOUR",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "DRYER",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-wm-4v5rgpyje",
  "name": "WM 4V5RGPYJE",
  "brand": "LG",
  "model": "WM 4V5RGPYJE",
  "sku": null,
  "category": "appliances",
  "description": "2 in 1 ,Washer (10.5KG), Dryer (7KG), Direct Drive Motor, Smart,True Steam , Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "650000",
   "display": "₦650,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "650,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-wm-961",
  "name": "WM 961",
  "brand": "LG",
  "model": "WM 961",
  "sku": null,
  "category": "appliances",
  "description": "Washer, 9 KG, Top loader, twin Tub,Light Gray",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "249000",
   "display": "₦249,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "249,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-wm0z6drp24",
  "name": "WM0Z6DRP24",
  "brand": "LG",
  "model": "WM0Z6DRP24",
  "sku": null,
  "category": "appliances",
  "description": "2 in 1 ,Washer (13KG), Dryer (8KG), Direct Drive Motor, Smart,True Steam ,  Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "999000",
   "display": "₦999,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "999,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-wm0z6drp249",
  "name": "WM0Z6DRP249",
  "brand": "LG",
  "model": "WM0Z6DRP249",
  "sku": null,
  "category": "appliances",
  "description": "2 in 1 ,Washer (13KG), Dryer (8KG), Direct Drive Motor, Smart,True Steam ,  Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "899000",
   "display": "₦899,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "899,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-wm0z8drp24",
  "name": "WM0Z8DRP24",
  "brand": "LG",
  "model": "WM0Z8DRP24",
  "sku": null,
  "category": "appliances",
  "description": "2 in 1 ,Washer (20KG), Dryer (10KG), Direct Drive Motor, Smart,True Steam ,Dark  Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "1175000",
   "display": "₦1,175,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,175,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-wm110r3agnc",
  "name": "DRYER WM110R3AGNC",
  "brand": "LG",
  "model": "WM110R3AGNC",
  "sku": null,
  "category": "appliances",
  "description": "Washer, Twin Top, 11KG twin Tub ,Black Gray",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "DRYER",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-wm11v8tehtxa",
  "name": "WM11V8TEHTXA",
  "brand": "LG",
  "model": "WM11V8TEHTXA",
  "sku": null,
  "category": "appliances",
  "description": "Top loader 11 KG, Full automatic,BlackColor, 36% Energy SavinG.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "475000",
   "display": "₦475,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "475,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-wm13v8tehhtx",
  "name": "WM13V8TEHHTX",
  "brand": "LG",
  "model": "WM13V8TEHHTX",
  "sku": null,
  "category": "appliances",
  "description": "Top loader 13 KG, Full automatic,BlackColor, 36% Energy SavinG.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "495000",
   "display": "₦495,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "495,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-wm19v1ndht2",
  "name": "WM19V1NDHT2",
  "brand": "LG",
  "model": "WM19V1NDHT2",
  "sku": null,
  "category": "appliances",
  "description": "Top Loader 19 Kg ,Direct Drive , Linear Comprosser,Turbo Drum, Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "609000",
   "display": "₦609,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "609,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-wm2v5fgpyje",
  "name": "DRYER WM2V5FGPYJE",
  "brand": "LG",
  "model": "WM2V5FGPYJE",
  "sku": null,
  "category": "appliances",
  "description": "2 in 1 ,Washer (9KG) Dryer (5KG) Direct Drive Motor, Smart ,True Steam Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "DRYER",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-wm2y1hyp6j",
  "name": "WM2Y1HYP6J",
  "brand": "LG",
  "model": "WM2Y1HYP6J",
  "sku": null,
  "category": "appliances",
  "description": "Front loader, 7KG, Direct drive, 10 yrs warranty on Direct Drive motor, SILVER COLOUR",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "395000",
   "display": "₦395,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "395,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-wm2y1vypyjp",
  "name": "DRYER WM2Y1VYPYJP",
  "brand": "LG",
  "model": "WM2Y1VYPYJP",
  "sku": null,
  "category": "appliances",
  "description": "Front loader, 9 KG , Direct drive, 10 yrs warranty on Direct Drive motor, SILVER COLOUR",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "DRYER",
  "source": {
   "document": "LG.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-wm4x5eyn26",
  "name": "WM4X5EYN26",
  "brand": "LG",
  "model": "WM4X5EYN26",
  "sku": null,
  "category": "appliances",
  "description": "Front loader, 11KG, Direct drive, 10 yrs warranty on Direct Drive motor, 6 Montion ,SILVER COLOUR",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "545000",
   "display": "₦545,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "545,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-wm85s1tddt2",
  "name": "WM85S1TDDT2",
  "brand": "LG",
  "model": "WM85S1TDDT2",
  "sku": null,
  "category": "appliances",
  "description": "Top loader  8KG, Full automatic,Silver Color, 36% Energy Saving,Smart Inverter",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "349000",
   "display": "₦349,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "349,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "lg-mon-24u411",
  "name": "MON 24U411",
  "brand": "LG",
  "model": "MON 24U411",
  "sku": null,
  "category": "computers",
  "description": "24\" FHD 144 Hz IPS, 1920 × 1080FHD, FreeSync 1ms MBR. 1 × HDMI, 1 × D-Sub (VGA),1 × Audio  HDR10 and up to 99% sRGB deliver rich",
  "image": {
   "url": "../assets/catalogue/hardware-computers.svg",
   "alt": "Illustrative computer technology category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "95000",
   "display": "₦95,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "95,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-mon-27g52",
  "name": "MON 27G52",
  "brand": "LG",
  "model": "MON 27G52",
  "sku": null,
  "category": "computers",
  "description": "27\" Gaming Monitor, LG UltraGear G5,HDR10 , 1920×1080 FHD Refresh Rate 200Hz DisplayPort: 1 × DisplayPort 1.4 HDMI: 2 × HDMI 2.0 Headphone Out: 1 × 3-pole headphone output",
  "image": {
   "url": "../assets/catalogue/hardware-computers.svg",
   "alt": "Illustrative computer technology category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "175000",
   "display": "₦175,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "175,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-mon-27u411",
  "name": "MON 27U411",
  "brand": "LG",
  "model": "MON 27U411",
  "sku": null,
  "category": "computers",
  "description": "27\" FHD 144 Hz IPS, 1920 × 1080 FHD, FreeSync 1ms MBR. 1 × HDMI, 1 × D-Sub (VGA),1 × Audio  HDR10 and up to 99% sRGB deliver rich",
  "image": {
   "url": "../assets/catalogue/hardware-computers.svg",
   "alt": "Illustrative computer technology category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "115000",
   "display": "₦115,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "115,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-mon-34g600",
  "name": "MON 34G600",
  "brand": "LG",
  "model": "MON 34G600",
  "sku": null,
  "category": "computers",
  "description": "34\" FHD Gaming Monitor, LG UltraGear, 3440 × 1440 (WQHD), 160 Hz, sRGB 99%, HDR10, AMD FreeSync Premium, NVIDIA G-SYNC Compatible, 2 × HDMI 2.0, 1 × DisplayPort 1.4, 1 × Headphone Out, HDCP 2.2 support Mobility - wireless, built-in battery, 5-wheels",
  "image": {
   "url": "../assets/catalogue/hardware-computers.svg",
   "alt": "Illustrative computer technology category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "350000",
   "display": "₦350,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "350,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-aud-11-mr",
  "name": "AUD 11 MR",
  "brand": "LG",
  "model": "AUD 11 MR",
  "sku": null,
  "category": "consumer-electronics",
  "description": "2300W, 4.2Ch, Bass Blast, Dual Subwoofer, BT, Smart DJ, HDMI 3 in & 1 out",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "760000",
   "display": "₦760,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "760,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-aud-30as",
  "name": "AUD 30AS",
  "brand": "LG",
  "model": "AUD 30AS",
  "sku": null,
  "category": "consumer-electronics",
  "description": "140W ,2.1CH Sound Bar,Dolby Atoms,BT,Wireless Subwoofer",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "129000",
   "display": "₦129,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "129,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-aud-43nck",
  "name": "AUD 43NCK",
  "brand": "LG",
  "model": "AUD 43NCK",
  "sku": null,
  "category": "consumer-electronics",
  "description": "300 W,Bass Blast,Bt,Xboom ,2SPEAKERS",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "160000",
   "display": "₦160,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "160,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-aud-44cj",
  "name": "AUD 44CJ",
  "brand": "LG",
  "model": "AUD 44CJ",
  "sku": null,
  "category": "consumer-electronics",
  "description": "480 W,CD,Auto DJ,Bluetooth,Xboom,WOOFER,2 SPEAKERS",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "189000",
   "display": "₦189,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "189,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-aud-45cj",
  "name": "AUD 45CJ",
  "brand": "LG",
  "model": "AUD 45CJ",
  "sku": null,
  "category": "consumer-electronics",
  "description": "720W,XBOOM DJ Sharing,Karaoke Star,Dual Usb,DJ LOOP,,WOOFER,3 SPEAKERS",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "226000",
   "display": "₦226,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "226,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-aud-5ash",
  "name": "AUD 5ASH",
  "brand": "LG",
  "model": "AUD 5ASH",
  "sku": null,
  "category": "consumer-electronics",
  "description": "600 W,4.1 CH,  Subwoofer , Bluetooth, Simplink,Black Color,Chromecast Built in.",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "270000",
   "display": "₦270,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "270,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-aud-5rnc-pikin",
  "name": "AUD 5RNC (Pikin)",
  "brand": "LG",
  "model": "AUD 5RNC (Pikin)",
  "sku": null,
  "category": "consumer-electronics",
  "description": "500W, All In One HiFi System, Xboom, Multi Bluetooth, DJ,Sparkle Lighting,Vocal Effects&Karaoke star.",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "235000",
   "display": "₦235,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "235,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-aud-60ts",
  "name": "AUD 60TS",
  "brand": "LG",
  "model": "AUD 60TS",
  "sku": null,
  "category": "consumer-electronics",
  "description": "340W ,3.1CH Sound Bar,Dolby Atoms,BT,Wireless Subwoofer",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "199000",
   "display": "₦199,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "199,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-aud-65cl",
  "name": "AUD 65CL",
  "brand": "LG",
  "model": "AUD 65CL",
  "sku": null,
  "category": "consumer-electronics",
  "description": "950W,XBOOM DJ Sharing,Karaoke Star,Dual Usb,DJ LOOP",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "240000",
   "display": "₦240,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "240,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-aud-675lhd",
  "name": "AUD 675LHD",
  "brand": "LG",
  "model": "AUD 675LHD",
  "sku": null,
  "category": "consumer-electronics",
  "description": "1000W, 4.2CH, Body Gaurd, 2 Speakers, Powerful Bass Blast, Bluetooth",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "239000",
   "display": "₦239,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "239,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-aud-687lhd",
  "name": "AUD 687LHD",
  "brand": "LG",
  "model": "AUD 687LHD",
  "sku": null,
  "category": "consumer-electronics",
  "description": "1250W, 4.2CH, 2 Speakers, Powerful Bass Blast, Bluetooth",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "289000",
   "display": "₦289,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "289,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-aud-7-mr",
  "name": "AUD 7 MR",
  "brand": "LG",
  "model": "AUD 7 MR",
  "sku": null,
  "category": "consumer-electronics",
  "description": "1000W,DUAL TOWER SPEAKER SYSTEM BASS BLAST&FOOTBALL MODE,PERSONALIZED DJ CONTROL,AI- TUNED SOUND",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "399000",
   "display": "₦399,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "399,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-aud-7rnc-mama",
  "name": "AUD 7RNC (Mama)",
  "brand": "LG",
  "model": "AUD 7RNC (Mama)",
  "sku": null,
  "category": "consumer-electronics",
  "description": "1000W, All In One HiFi System, Xboom, RMS,Multi Bluetooth, DJ,Sparkle Lighting,Vocal Effects&Karaoke star.",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "299000",
   "display": "₦299,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "299,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-aud-87cl",
  "name": "AUD 87CL",
  "brand": "LG",
  "model": "AUD 87CL",
  "sku": null,
  "category": "consumer-electronics",
  "description": "2350W,XBOOM ,Dual Usb,DJ Effect,2 SPEAKERS,Multi Color Lighting , Bass Blast.",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "375000",
   "display": "₦375,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "375,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-aud-9-mr",
  "name": "AUD 9 MR",
  "brand": "LG",
  "model": "AUD 9 MR",
  "sku": null,
  "category": "consumer-electronics",
  "description": "1250W,DUAL TOWER SPEAKER SYSTEM BASS BLAST&FOOTBALL MODE,PERSONALIZED DJ CONTROL,AI- TUNED SOUND",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "449000",
   "display": "₦449,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "449,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-aud-90tys",
  "name": "AUD 90TYS",
  "brand": "LG",
  "model": "AUD 90TYS",
  "sku": null,
  "category": "consumer-electronics",
  "description": "570W,5.1.3CH Sound Bar,Dolby Atoms, Wirless, Rear surrounded speaker included",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "650000",
   "display": "₦650,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "650,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-aud-98cl",
  "name": "AUD 98CL",
  "brand": "LG",
  "model": "AUD 98CL",
  "sku": null,
  "category": "consumer-electronics",
  "description": "3500W,XBOOM DJ Sharing,Karaoke Star,Dual Usb,DJ LOOP,USB,AUX,Multi Color Lighting,,WOOFER,2 SPEAKERS",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "750000",
   "display": "₦750,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "750,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-aud-99ck-wahala",
  "name": "AUD 99CK ( Wahala )",
  "brand": "LG",
  "model": "AUD 99CK ( Wahala )",
  "sku": null,
  "category": "consumer-electronics",
  "description": "5000W, XBOOM, Rear Light Show,S shiny Woofer, Vocal Effects & Karaoke star, woofer, 2 SPEAKERS",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "1180000",
   "display": "₦1,180,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,180,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-aud-9rnc-baba",
  "name": "AUD 9RNC (Baba)",
  "brand": "LG",
  "model": "AUD 9RNC (Baba)",
  "sku": null,
  "category": "consumer-electronics",
  "description": "1800 W, All In One HiFi System, Xboom,RMS,Multi Bluetooth, DJ,Sparkle Lighting,Vocal Effects&Karaoke star.",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "380000",
   "display": "₦380,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "380,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-aud-9s-sc",
  "name": "AUD 9S-SC",
  "brand": "LG",
  "model": "AUD 9S-SC",
  "sku": null,
  "category": "consumer-electronics",
  "description": "400 W, 3.1.3 Channel ,High R esolution  Audio With Dolby Atmos ,Triple Level Spatial Sound With Up-Firing Channels,Dual Type Bracket & Subwoofer Included",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "550000",
   "display": "₦550,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "550,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "lg-aud2tbk",
  "name": "PORTABLEBLUETOOTH SOUNDBAR AUD2TBK",
  "brand": "LG",
  "model": "AUD2TBK",
  "sku": null,
  "category": "consumer-electronics",
  "description": "5W With powerful bass,water proof & dust proof ,10h battery life,voice command",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "PORTABLEBLUETOOTH SOUNDBAR",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-aud40st",
  "name": "SoundBar AUD40ST",
  "brand": "LG",
  "model": "AUD40ST",
  "sku": null,
  "category": "consumer-electronics",
  "description": "300 W ,2 .1 CH Wireless Subwoofer Bluetooth ,Black Color,Al Sound Pro",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SoundBar",
  "source": {
   "document": "LG.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-aud65trs",
  "name": "SoundBar AUD65TRS",
  "brand": "LG",
  "model": "AUD65TRS",
  "sku": null,
  "category": "consumer-electronics",
  "description": "440W ,5 .1CH Sound Bar,Dolby Atoms, Wirless, Rear surrounded speaker included",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "SoundBar",
  "source": {
   "document": "LG.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-aud8txg",
  "name": "PORTABLEBLUETOOTH SOUNDBAR AUD8TXG",
  "brand": "LG",
  "model": "AUD8TXG",
  "sku": null,
  "category": "consumer-electronics",
  "description": "LG XBOOM GO ,Wireless Portable Speaker,60W With Power Bass, Water Proof & Dust Proof ,Colorful Mood Lighting ,UP To15HoursBatteryLife",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "PORTABLEBLUETOOTH SOUNDBAR",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-audbounce",
  "name": "PORTABLEBLUETOOTH SOUNDBAR AUDBOUNCE",
  "brand": "LG",
  "model": "AUDBOUNCE",
  "sku": null,
  "category": "consumer-electronics",
  "description": "2 .1CH battery 30H lithium battery,passed 7 durability test ,IP67 water and dust resistant ,AI analysis",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "PORTABLEBLUETOOTH SOUNDBAR",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-audgrab",
  "name": "PORTABLEBLUETOOTH SOUNDBAR AUDGRAB",
  "brand": "LG",
  "model": "AUDGRAB",
  "sku": null,
  "category": "consumer-electronics",
  "description": "2 .1CH battery 20H lithium battery,passed 7 durability test ,IP67 water and dust resistant ,AI analysis",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "PORTABLEBLUETOOTH SOUNDBAR",
  "source": {
   "document": "LG.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-tv-86-ua85006la",
  "name": "TV 86 UA85006LA",
  "brand": "LG",
  "model": "TV 86 UA85006LA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "86\"UHD, AI Processor 4k ,HDR10 Pro ,Smart, Satellite, AV, 3 HDMI, 2 USB,,Magic Remote",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "1450000",
   "display": "₦1,450,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,450,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv100qned86a6",
  "name": "TV100QNED86A6",
  "brand": "LG",
  "model": "TV100QNED86A6",
  "sku": null,
  "category": "consumer-electronics",
  "description": "100'' QNED AI THINK ,DYNAMIC QNED COLOR,a7 AI PROCESSOR 4K ,3HDMI, 2USB ,",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "3950000",
   "display": "₦3,950,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "3,950,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv43ua73006la",
  "name": "TV43UA73006LA",
  "brand": "LG",
  "model": "TV43UA73006LA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "43\"UHD, AI Processor 4K Smart, HDR 10 Pro ,WebOS , Satellite, AV, 3 HDMI, 1 USB,DTV,MAGIC REMOTE",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "355000",
   "display": "₦355,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "355,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv50nu850b6la",
  "name": "TV50NU850B6LA",
  "brand": "LG",
  "model": "TV50NU850B6LA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "50'' LG NANO 4K UHD AI,NANO DETAIL ENHANCER POWERED BY a7 ,HDR10 PRO , 3 HDMI",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "475000",
   "display": "₦475,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "475,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv50ua73006la",
  "name": "TV50UA73006LA",
  "brand": "LG",
  "model": "TV50UA73006LA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "50\"UHD, AI Processor 4K Smart, HDR 10 Pro ,WebOS , Satellite, AV, 3 HDMI, 1 USB,DTV,MAGIC REMOTE",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "445000",
   "display": "₦445,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "445,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv55c56la",
  "name": "QNED TV55C56LA",
  "brand": "LG",
  "model": "TV55C56LA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "55'' OLED AI THINQ ,4K ,Built In Satellite Receiver, SMART 3USB AV ,4 HDMI ,Magic Remote,DTV",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "QNED",
  "source": {
   "document": "LG.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-tv55c66la",
  "name": "TV55C66LA",
  "brand": "LG",
  "model": "TV55C66LA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "55'' OLED AI THINQ ,4K,Built In Satellite Receiver, SMART, 3USB, AV,4 HDMI,Magic Remote,DTV",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "1250000",
   "display": "₦1,250,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,250,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv55nano80t6a",
  "name": "LEDSMART UHD TV55NANO80T6A",
  "brand": "LG",
  "model": "TV55NANO80T6A",
  "sku": null,
  "category": "consumer-electronics",
  "description": "55\" NANO Smart 3 HDMI 2 USB Magic Remote, Satellite",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "LEDSMART UHD",
  "source": {
   "document": "LG.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-tv55qned72b6t",
  "name": "TV55QNED72B6T",
  "brand": "LG",
  "model": "TV55QNED72B6T",
  "sku": null,
  "category": "consumer-electronics",
  "description": "55'' QNED AI PROCESSOR 4 K  ,Dynamic  QNED C ,3HDMI,2 USB ,",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "649000",
   "display": "₦649,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "649,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv55ua73006la",
  "name": "TV55UA73006LA",
  "brand": "LG",
  "model": "TV55UA73006LA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "55\"UHD, AI Processor 4K Smart, HDR 10 Pro ,WebOS , Satellite, AV, 3 HDMI, 1 USB,DTV",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "528000",
   "display": "₦528,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "528,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv65c66",
  "name": "TV65C66",
  "brand": "LG",
  "model": "TV65C66",
  "sku": null,
  "category": "consumer-electronics",
  "description": "65'' OLED AI THINQ ,4K,Built In Satellite Receiver, SMART, 3USB, AV,4 HDMI,Magic Remote,DTV",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "2090000",
   "display": "₦2,090,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "2,090,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv65qned72b6t",
  "name": "QNED TV65QNED72B6T",
  "brand": "LG",
  "model": "TV65QNED72B6T",
  "sku": null,
  "category": "consumer-electronics",
  "description": "65'' QNED AI PROCESSOR 4 K ,Dynamic QNED C ,3HDMI ,2 USB",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "QNED",
  "source": {
   "document": "LG.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-tv65ua73006la",
  "name": "TV65UA73006LA",
  "brand": "LG",
  "model": "TV65UA73006LA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "65\"UHD, AI Think 4K Smart, Satellite, AV, 3 HDMI, 1 USB,DTV,MAGIC REMOTE",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "749000",
   "display": "₦749,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "749,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv75nano80t6a",
  "name": "NANO TV75NANO80T6A",
  "brand": "LG",
  "model": "TV75NANO80T6A",
  "sku": null,
  "category": "consumer-electronics",
  "description": "75\" NANO Smart 3 HDMI 2 USB Magic Remote, Satellite",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "NANO",
  "source": {
   "document": "LG.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-tv75nu850b6la",
  "name": "TV75NU850B6LA",
  "brand": "LG",
  "model": "TV75NU850B6LA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "75'' LG NANO 4K UHD AI,NANO DETAIL ENHANCER POWERED BY a7 ,HDR10 PRO , 3 HDMI",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "940000",
   "display": "₦940,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "940,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv75qned82a6a",
  "name": "QNED TV75QNED82A6A",
  "brand": "LG",
  "model": "TV75QNED82A6A",
  "sku": null,
  "category": "consumer-electronics",
  "description": "75'' QNED AI THINK ,DYNAMIC QNED COLOR ,a7 AI PROCESSOR 4K ,3HDMI ,2 USB",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "QNED",
  "source": {
   "document": "LG.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-tv77c56la",
  "name": "OLED TV77C56LA",
  "brand": "LG",
  "model": "TV77C56LA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "77\" OLED evo + Brightness Booster Max WebOs/Think AI , SMART , 4 HDMI ,3 USB , AV ,Free Wall Bracket ,No Base Stand",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "OLED",
  "source": {
   "document": "LG.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-tv77c66la",
  "name": "TV77C66LA",
  "brand": "LG",
  "model": "TV77C66LA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "77\" OLED evo + Brightness Booster Max WebOs/Think AI, SMART, 4 HDMI,3 USB, AV,Free Wall Bracket,No Base Stand",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "3600000",
   "display": "₦3,600,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "3,600,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv77g56la",
  "name": "OLED TV77G56LA",
  "brand": "LG",
  "model": "TV77G56LA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "77\" OLED evo + Brightness Booster Max WebOs/Think AI , SMART , 4 HDMI ,3 USB , AV ,Free Wall Bracket ,No Base Stand",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "OLED",
  "source": {
   "document": "LG.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-tv77g66lw",
  "name": "TV77G66LW",
  "brand": "LG",
  "model": "TV77G66LW",
  "sku": null,
  "category": "consumer-electronics",
  "description": "77\" 4K picture quality, AI upscaled visual, and surround sound from the alpha 11 AI Processor Gen2,True black levels in every pixel create stunning contrast, depth, and detail,00% Colour Fidelity for accurate lifelike colours. 100% Colour Volume for richer hues,Up to 1.5X brighter visuals vs. conventional OLED TVs from Brightness Booster Max,New AI button, voice controls, drag and drop functions on the AI Magic Remote",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "4050000",
   "display": "₦4,050,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "4,050,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv83b66la",
  "name": "TV83B66LA",
  "brand": "LG",
  "model": "TV83B66LA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "83\" OLED AI  + Brightness Booster Max WebOs/Think AI, SMART, 4 HDMI,2 USB, AV, perfect black and perfect color,ultra slim design,",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "5200000",
   "display": "₦5,200,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "5,200,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv83g66lw",
  "name": "TV83G66LW",
  "brand": "LG",
  "model": "TV83G66LW",
  "sku": null,
  "category": "consumer-electronics",
  "description": "83\" 4K picture quality, AI upscaled visual, and surround sound from the alpha 11 AI Processor Gen2,True black levels in every pixel create stunning contrast, depth, and detail,00% Colour Fidelity for accurate lifelike colours. 100% Colour Volume for richer hues,Up to 1.5X brighter visuals vs. conventional OLED TVs from Brightness Booster Max,New AI button, voice controls, drag and drop functions on the AI Magic Remote",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "5950000",
   "display": "₦5,950,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "5,950,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv85qned72b6t",
  "name": "TV85QNED72B6T",
  "brand": "LG",
  "model": "TV85QNED72B6T",
  "sku": null,
  "category": "consumer-electronics",
  "description": "85' Qmed AI THINK,DYNAMIC QNED COLOR,a7 AI PROCESSOR 4K ,3HDMI, 1USB",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "1790000",
   "display": "₦1,790,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "1,790,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv86nano80t6a",
  "name": "NANO TV86NANO80T6A",
  "brand": "LG",
  "model": "TV86NANO80T6A",
  "sku": null,
  "category": "consumer-electronics",
  "description": "86\" NANO Smart 3 HDMI 2 USB Magic Remote, Satellite",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "NANO",
  "source": {
   "document": "LG.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-tv97g66lw",
  "name": "TV97G66LW",
  "brand": "LG",
  "model": "TV97G66LW",
  "sku": null,
  "category": "consumer-electronics",
  "description": "97\" 4K picture quality, AI upscaled visual, and surround sound from the alpha 11 AI Processor Gen2,True black levels in every pixel create stunning contrast, depth, and detail,00% Colour Fidelity for accurate lifelike colours. 100% Colour Volume for richer hues,Up to 1.5X brighter visuals vs. conventional OLED TVs from Brightness Booster Max,New AI button, voice controls, drag and drop functions on the AI Magic Remote",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "27000000",
   "display": "₦27,000,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "27,000,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-tv98ut90006la",
  "name": "LEDSMART UHD TV98UT90006LA",
  "brand": "LG",
  "model": "TV98UT90006LA",
  "sku": null,
  "category": "consumer-electronics",
  "description": "98\"UHD AI Think 4K Smart Satellite, AV 3 HDMI 2 USB ,DTV ,Magic Remote",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "2 years warranty on all products.",
  "sourceCategory": "LEDSMART UHD",
  "source": {
   "document": "LG.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "lg-aud-72b",
  "name": "AUD 72B",
  "brand": "LG",
  "model": "AUD 72B",
  "sku": null,
  "category": "solar-energy",
  "description": "Mobility - wireless, built-in battery, 5-wheels Connectivity - NFC, mirroring, Apple AirPlay 2, Apple HomeKit",
  "image": {
   "url": "../assets/catalogue/hardware-energy.svg",
   "alt": "Illustrative solar and energy category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "65000",
   "display": "₦65,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "65,000",
    "document": "LG-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "lg-aud-mini",
  "name": "AUD MINI",
  "brand": "LG",
  "model": "AUD MINI",
  "sku": null,
  "category": "solar-energy",
  "description": "Ultra-portable speaker that delivers big on style,IP67 Dust and Water resistance for unstoppable adventures² , 10H life battery",
  "image": {
   "url": "../assets/catalogue/hardware-energy.svg",
   "alt": "Illustrative solar and energy category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "2 years warranty on all products.",
    "source": {
     "document": "LG-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "LG-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "48000",
   "display": "₦48,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "48,000",
    "document": "LG-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-1100pr",
  "name": "1100PR",
  "brand": "MAXI",
  "model": "1100PR",
  "sku": null,
  "category": "appliances",
  "description": "contact grill,Non-stick plates,cool toch handle",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "26000.00",
   "display": "₦26,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "26,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-af50c2tn",
  "name": "AF50C2TN",
  "brand": "MAXI",
  "model": "AF50C2TN",
  "sku": null,
  "category": "appliances",
  "description": "MAXI AIR FRYER, 5L,Auto Pause,Easy Cleaning,Black,1400-1600w",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "44000.00",
   "display": "₦44,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "44,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-af85wa2cn",
  "name": "AF85WA2CN",
  "brand": "MAXI",
  "model": "AF85WA2CN",
  "sku": null,
  "category": "appliances",
  "description": "MAXI AIR FRYER , Black,8.5L,DIGITAL LED DISPLAY,LESS OIL,REMOVABLE DRAWER,",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "79000.00",
   "display": "₦79,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "79,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-ap400-g-l1",
  "name": "AP400 G-L1",
  "brand": "MAXI",
  "model": "AP400 G-L1",
  "sku": null,
  "category": "appliances",
  "description": "AI MODE ,ENERGY EFFICIENT,H13 TRUE ION FUNCTION INDICATOR,FILTER RESET INDICATOR,35 W",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "109000",
   "display": "₦109,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "109,000",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan-40-25j",
  "name": "FAN 40-25J",
  "brand": "MAXI",
  "model": "FAN 40-25J",
  "sku": null,
  "category": "appliances",
  "description": "MAXI STANDING FAN 16'' , BLACK,5 BLADES,3SPEEDS SETTING,40W",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "28000.00",
   "display": "₦28,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "28,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan-50-12p",
  "name": "FAN 50-12P",
  "brand": "MAXI",
  "model": "FAN 50-12P",
  "sku": null,
  "category": "appliances",
  "description": "MAXI Stand FAN 20'' ,White,Rated Power: 65W,Oscillation Function,Adjustable Height,• 3 Speed Levels",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "39900.00",
   "display": "₦39,900.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "39,900.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan-50-12p-b",
  "name": "FAN 50-12P-B",
  "brand": "MAXI",
  "model": "FAN 50-12P-B",
  "sku": null,
  "category": "appliances",
  "description": "MAXI Stand FAN 20'' ,White,Rated Power: 65W,Oscillation Function,Adjustable Height,• 3 Speed Levels,BLACK",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "39900.00",
   "display": "₦39,900.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "39,900.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan10-16ar",
  "name": "FAN10-16AR",
  "brand": "MAXI",
  "model": "FAN10-16AR",
  "sku": null,
  "category": "appliances",
  "description": "MAXI TOWER FAN,White, Powerful Quite cooling,Internal Oscillation,Silent care,6 speed Levels,Remote Control,3 Wind Modes,12 H Timer ,Power Off Memory Function",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "76000.00",
   "display": "₦76,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "76,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan10-22jr",
  "name": "FAN10-22JR",
  "brand": "MAXI",
  "model": "FAN10-22JR",
  "sku": null,
  "category": "appliances",
  "description": "MAXI TOWER FAN,White, Powerful Quite cooling,7h timer,remote control,3 speed setting",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "50000.00",
   "display": "₦50,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "50,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan10-22jrb",
  "name": "FAN10-22JRb",
  "brand": "MAXI",
  "model": "FAN10-22JRb",
  "sku": null,
  "category": "appliances",
  "description": "MAXI TOWER FAN,Black, Powerful Quite cooling,7h timer,remote control,3 speed setting",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "50000.00",
   "display": "₦50,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "50,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan10-25mab",
  "name": "FAN10-25MAB",
  "brand": "MAXI",
  "model": "FAN10-25MAB",
  "sku": null,
  "category": "appliances",
  "description": "MAXI TOWER FAN,28 INCH ,Black, 3 Speed Setting",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "29000.00",
   "display": "₦29,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "29,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan150f-mdams",
  "name": "FAN150F-MDAMS",
  "brand": "MAXI",
  "model": "FAN150F-MDAMS",
  "sku": null,
  "category": "appliances",
  "description": "BLADELESS FAN , QUIET BREEZE ,ENERGY SAVING,3WIND MODES,7 H TIMER,HORIZONTAL OSCILLATION,6 SPEEDS SELECTION ,TURBO VENTILATION MODE",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "89000.00",
   "display": "₦89,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "89,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan150pd-ams",
  "name": "FAN150PD-AMS",
  "brand": "MAXI",
  "model": "FAN150PD-AMS",
  "sku": null,
  "category": "appliances",
  "description": "BLADELESS FAN , QUIET BREEZE ,10 SPEEDS,OSCILLATES,AIR QUALITY DISPLAY,12 HR TIMER ,REMOTE CONTROLLED",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "149000.00",
   "display": "₦149,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "149,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan30sm-kys",
  "name": "FAN30SM-KYS",
  "brand": "MAXI",
  "model": "FAN30SM-KYS",
  "sku": null,
  "category": "appliances",
  "description": "Industrial Stand Fan,30',Waterproof With Wheels",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "124000.00",
   "display": "₦124,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "124,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan45-12p",
  "name": "FAN45-12P",
  "brand": "MAXI",
  "model": "FAN45-12P",
  "sku": null,
  "category": "appliances",
  "description": "MAXI STAND FAN 18 INCH BLACK,,3 SPEED LEVELS",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "39500.00",
   "display": "₦39,500.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "39,500.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan45-25mrd",
  "name": "FAN45-25MRD",
  "brand": "MAXI",
  "model": "FAN45-25MRD",
  "sku": null,
  "category": "appliances",
  "description": "MAXI Stand FAN,RECHARGEABLE,18'' ,9 SPEEDS ,5 BLADES ,BLACK",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "69500.00",
   "display": "₦69,500.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "69,500.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan45ac-kyc",
  "name": "FAN45AC-KYC",
  "brand": "MAXI",
  "model": "FAN45AC-KYC",
  "sku": null,
  "category": "appliances",
  "description": "MAXI Rechargable Fan 18 inch,Black , Remote,12 Speeds Levels,",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "74000.00",
   "display": "₦74,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "74,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan650-kfs",
  "name": "FAN650-KFS",
  "brand": "MAXI",
  "model": "FAN650-KFS",
  "sku": null,
  "category": "appliances",
  "description": "MAXI 650MM Industrial Stand Fan,26'',Adjustable Height",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "83000.00",
   "display": "₦83,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "83,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan650-kfw",
  "name": "FAN650-KFW",
  "brand": "MAXI",
  "model": "FAN650-KFW",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "79000.00",
   "display": "₦79,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "79,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-fan750-kfs",
  "name": "FAN750-KFS",
  "brand": "MAXI",
  "model": "FAN750-KFS",
  "sku": null,
  "category": "appliances",
  "description": "MAXI 750MM Industrial Stand Fan,30'',,Adjustable Height",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "99000.00",
   "display": "₦99,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "99,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-max-60-90-5b-wood",
  "name": "MAX 60*90(5B) WOOD",
  "brand": "MAXI",
  "model": "MAX 60*90(5B) WOOD",
  "sku": null,
  "category": "appliances",
  "description": "60 CM * 90 CM, 5 Gas Burners, White Color, Glass, Stainless, Ignition bottom , OVEN BURNER UP & DOWN(1 knob control) Oven Lamp",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "389000.00",
   "display": "₦389,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "389,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-100-oc",
  "name": "MAXI 100 - OC",
  "brand": "MAXI",
  "model": "MAXI 100 - OC",
  "sku": null,
  "category": "appliances",
  "description": "1 Burner Gas, Table Top Gas , Metal LID Top C,white,black,inox,grey,Copper",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "17900.00",
   "display": "₦17,900.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "17,900.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-200-oc",
  "name": "TableTopGas Cooker MAXI 200 - OC",
  "brand": "MAXI",
  "model": "MAXI 200 - OC",
  "sku": null,
  "category": "appliances",
  "description": "2 Burner Gas, Table Top Gas Metal LID Top C ,white,black ,inox,grey,copper color.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "1 year warranty on all products.",
  "sourceCategory": "TableTopGas Cooker",
  "source": {
   "document": "MAXI.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "maxi-maxi-5050-31-inox",
  "name": "MAXI 5050 31 INOX",
  "brand": "MAXI",
  "model": "MAXI 5050 31 INOX",
  "sku": null,
  "category": "appliances",
  "description": "50 CM * 50 CM, 3 GAS BURNERS, 1 ELECTRICAL, INOX, GLASS, OVEN BURNER UP & DOWN(1 knob control).",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "169000.00",
   "display": "₦169,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "169,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-5050-4b-basic-black",
  "name": "MAXI 5050 4B BASIC BLACK",
  "brand": "MAXI",
  "model": "MAXI 5050 4B BASIC BLACK",
  "sku": null,
  "category": "appliances",
  "description": "50 CM * 50 CM, 4 GAS BURNERS, BLACK & GREY COLOUR,OVEN BURNER UP & DOWN(1 knob control), GLASS.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "139000.00",
   "display": "₦139,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "139,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-5050-4b-igl-inox",
  "name": "MAXI 5050 4B IGL INOX",
  "brand": "MAXI",
  "model": "MAXI 5050 4B IGL INOX",
  "sku": null,
  "category": "appliances",
  "description": "50 CM * 50 CM, 4 GAS BURNERS, SILVER COLOUR, GLASS,IGNITION,OVEN LAMP,OVEN BURNER UP & DOWN(1 knob control) , FOOD PLASTIC CONTAINER (3 set in 1)",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "177000.00",
   "display": "₦177,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "177,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-60-90-4-2-wood",
  "name": "MAXI 60*90 (4+2) WOOD",
  "brand": "MAXI",
  "model": "MAXI 60*90 (4+2) WOOD",
  "sku": null,
  "category": "appliances",
  "description": "60 CM * 90 CM, 4 GAS + 2 ELECTRICAL, GLASS, Ignition bottom ,  OVEN BURNER UP & DOWN(1 knob control) Oven Lamp",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "389000.00",
   "display": "₦389,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "389,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-60-90-4-2-inox",
  "name": "MAXI 60*90(4+2) INOX",
  "brand": "MAXI",
  "model": "MAXI 60*90(4+2) INOX",
  "sku": null,
  "category": "appliances",
  "description": "60 CM * 90 CM, 4 GAS + 2 ELECTRICAL, GLASS, Stainless, OVEN BURNER UP & DOWN(1 knob control) Ignition bottom , Oven  Lamp",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "389000.00",
   "display": "₦389,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "389,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-60-90-5b-inox",
  "name": "MAXI 60*90(5B) INOX",
  "brand": "MAXI",
  "model": "MAXI 60*90(5B) INOX",
  "sku": null,
  "category": "appliances",
  "description": "60 CM * 90 CM, 5 Burners, GLASS, Stainless, Ignition bottom , OVEN BURNER UP & DOWN(1 knob control) Oven Lamp",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "389000.00",
   "display": "₦389,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "389,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-6060-4b-basic-black-grey",
  "name": "MAXI 6060 4B BASIC BLACK GREY",
  "brand": "MAXI",
  "model": "MAXI 6060 4B BASIC BLACK GREY",
  "sku": null,
  "category": "appliances",
  "description": "4 GAS BURNERS, Black & Grey Color, Oven Burner UP & DOWN (1 Knob Control)",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "174000.00",
   "display": "₦174,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "174,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-6060-tr-31-igl-in",
  "name": "MAXI 6060 TR 31 IGL IN",
  "brand": "MAXI",
  "model": "MAXI 6060 TR 31 IGL IN",
  "sku": null,
  "category": "appliances",
  "description": "60CM*60 CM ,3 GAS(Euro pool gas system) & 1 ELECTRICAL(1500 W),Inox,Push knobs ignition : hobs & oven,Top grid and burner cover are Cast iron , Mechanical timer ,OVEN BURNER UP & DOWN(1 knob control)Oven lamp ,Double Italian designed burner + sparker .",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "272800.00",
   "display": "₦272,800.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "272,800.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-6060-3-1-wood",
  "name": "MAXI 6060(3+1) WOOD",
  "brand": "MAXI",
  "model": "MAXI 6060(3+1) WOOD",
  "sku": null,
  "category": "appliances",
  "description": "3 GAS & 1 ELECTRICAL, WOOD, GLASS, STAINLESS ,IGNITION  BUTTON,OVEN LIGHT, OVEN BURNER UP & DOWN(1 knob control)",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "189000.00",
   "display": "₦189,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "189,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-6090-4-2-black-gray",
  "name": "MAXI 6090 (4+2) Black Gray",
  "brand": "MAXI",
  "model": "MAXI 6090 (4+2) Black Gray",
  "sku": null,
  "category": "appliances",
  "description": "4 GAS & 2 ELECTRICAL, Black & Gray, GLASS, STAINLESS ,IGNITION  BUTTON, TIMER ,OVEN BURNER UP & DOWN(1 knob control)",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "375000.00",
   "display": "₦375,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "375,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-installation-kit-plus-a",
  "name": "MAXI INSTALLATION KIT PLUS-A",
  "brand": "MAXI",
  "model": "MAXI INSTALLATION KIT PLUS-A",
  "sku": null,
  "category": "appliances",
  "description": "USED WITH 1/1.5 HP INVERTER, 1 HP NON INVERTER , PLUG & WIRE",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "sources": [
   {
    "document": "Hisense-1.pdf",
    "page": 4
   },
   {
    "document": "LG-1.pdf",
    "page": 3
   }
  ],
  "price": {
   "currency": "NGN",
   "amount": "38500.00",
   "display": "₦38,500.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "38,500.00",
    "document": "MAXI-1.pdf",
    "page": 3
   },
   {
    "rawAmount": "38,500.00",
    "document": "Hisense-1.pdf",
    "page": 4
   },
   {
    "rawAmount": "38,500",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxi-installation-kit-plus-b",
  "name": "MAXI INSTALLATION KIT PLUS-B",
  "brand": "MAXI",
  "model": "MAXI INSTALLATION KIT PLUS-B",
  "sku": null,
  "category": "appliances",
  "description": "USED WITH 2 HP INVERTER, 1.5 HP NON INVERTER, PLUG & WIRE",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "sources": [
   {
    "document": "Hisense-1.pdf",
    "page": 4
   },
   {
    "document": "LG-1.pdf",
    "page": 3
   }
  ],
  "price": {
   "currency": "NGN",
   "amount": "42000.00",
   "display": "₦42,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "42,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   },
   {
    "rawAmount": "42,000.00",
    "document": "Hisense-1.pdf",
    "page": 4
   },
   {
    "rawAmount": "42,000",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxi-style-60-90-4-2-inox",
  "name": "MAXI STYLE 60*90 (4+2) INOX",
  "brand": "MAXI",
  "model": "MAXI STYLE 60*90 (4+2) INOX",
  "sku": null,
  "category": "appliances",
  "description": "60 CM * 90 CM, 4 GAS + 2 ELECTRICAL,INOX, (Euro pool gas system),Push knobs ignition : hobs & oven,Top grid and burner cover are Cast iron , OVEN BURNER UP & DOWN(1 knob control) ,  Mechanical timer ,Oven lamp ,Double Italian designed burner + sparker,Mirror Front Glass",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "450000.00",
   "display": "₦450,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "450,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-style-60-90-4-2-wood",
  "name": "MAXI STYLE 60*90 (4+2) WOOD",
  "brand": "MAXI",
  "model": "MAXI STYLE 60*90 (4+2) WOOD",
  "sku": null,
  "category": "appliances",
  "description": "60 CM * 90 CM, 4 GAS + 2 ELECTRICAL,WOODEN,(Euro pool gas system),Push knobs ignition : hobs & oven,Top grid and burner cover are Cast iron , OVEN BURNER UP & DOWN(1 knob control) Mechanical timer ,Oven lamp ,Double Italian designed burner + sparker.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "450000.00",
   "display": "₦450,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "450,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-style-60-90-5b-inox",
  "name": "MAXI STYLE 60*90 (5B) INOX",
  "brand": "MAXI",
  "model": "MAXI STYLE 60*90 (5B) INOX",
  "sku": null,
  "category": "appliances",
  "description": "60 CM * 90 CM, 5 Gas Burners,Inox,(Euro pool gas system),Push knobs ignition : hobs & oven,Top grid and burner cover are Cast iron , Mechanical timer ,Oven lamp ,  OVEN BURNER UP & DOWN(1 knob control) Double Italian designed burner + sparker,Mirror Front Glass",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "410000.00",
   "display": "₦410,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "410,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-style-60-90-5b-wood",
  "name": "MAXI STYLE 60*90 5B WOOD",
  "brand": "MAXI",
  "model": "MAXI STYLE 60*90 5B WOOD",
  "sku": null,
  "category": "appliances",
  "description": "60 CM * 90 CM,WOODEN,(Euro pool gas system),Push knobs ignition : hobs & oven,Top grid and burner cover are Cast iron , OVEN BURNER UP & DOWN(1 knob control) Mechanical timer ,Oven lamp ,Double Italian designed burner + sparker.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "410000.00",
   "display": "₦410,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "410,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi-wd-1675",
  "name": "MAXI WD 1675",
  "brand": "MAXI",
  "model": "MAXI WD 1675",
  "sku": null,
  "category": "appliances",
  "description": "MAXI WATER DISPENSER, WHITE COLOR , 2 FAUCETS(HOT,COLD),REFRIGERATOR",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "145000.00",
   "display": "₦145,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "145,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxi-wd1639s",
  "name": "MAXI WD1639S",
  "brand": "MAXI",
  "model": "MAXI WD1639S",
  "sku": null,
  "category": "appliances",
  "description": "Bottom loading, 3 Faucets (Hot, Neutral, Cold), double safety device for preventing over heat,High power stainless steel hot water tank,Space saving design, Dark Silver",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "165000.00",
   "display": "₦165,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "165,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxi-wd1663",
  "name": "MAXI WD1663",
  "brand": "MAXI",
  "model": "MAXI WD1663",
  "sku": null,
  "category": "appliances",
  "description": "MAXI Water Dispenser MAXI WATER DISPENSER, BLACK COLOR , 3 FAUCETS(HOT,COLD,NEUTRAL),CABINET",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "110000.00",
   "display": "₦110,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "110,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxi-wd1730s",
  "name": "MAXI WD1730S",
  "brand": "MAXI",
  "model": "MAXI WD1730S",
  "sku": null,
  "category": "appliances",
  "description": "MAXI WATER DISPENSER, BLACK COLOR , 3 FAUCETS(HOT,COLD,NEUTRAL)+ REFRIGERATOR",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "170000.00",
   "display": "₦170,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "170,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxi-wh-10-20ve",
  "name": "MAXI WH 10-20VE",
  "brand": "MAXI",
  "model": "MAXI WH 10-20VE",
  "sku": null,
  "category": "appliances",
  "description": "10 LTR, 2000 Watts, 230 V, 50/60 HZ, 105 Max Temp, Vertical Mounting, 324*324*315 mm",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "52000.00",
   "display": "₦52,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "52,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxi-wh-15-20ve",
  "name": "MAXI WH 15-20VE",
  "brand": "MAXI",
  "model": "MAXI WH 15-20VE",
  "sku": null,
  "category": "appliances",
  "description": "15 LTR, 2000 Watts, 230 V, 50/60 HZ, 105 Max Temp, Vertical Mounting, 368*368*340 mm",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "62000.00",
   "display": "₦62,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "62,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxi-wh-30-20ve",
  "name": "MAXI WH 30-20VE",
  "brand": "MAXI",
  "model": "MAXI WH 30-20VE",
  "sku": null,
  "category": "appliances",
  "description": "30 LTR, 2000 Watts, 230 V, 50/60 HZ, 105 Max Temp, Vertical Mounting, 368*368*340 mm",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "90000.00",
   "display": "₦90,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "90,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxi300",
  "name": "TableTopGas Cooker MAXI300",
  "brand": "MAXI",
  "model": "MAXI300",
  "sku": null,
  "category": "appliances",
  "description": "3 Burner Gas, Table Top Gas Metal LID Top C ,white,black ,inox,grey,copper color.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "1 year warranty on all products.",
  "sourceCategory": "TableTopGas Cooker",
  "source": {
   "document": "MAXI.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "maxi-maxi6060tr31iglwd",
  "name": "StandingGas Cooker 60cm X60cm StandingGas Cooker 60cm X60cm TR STYLE (Italian Designed MAXI6060TR31IGLWD",
  "brand": "MAXI",
  "model": "MAXI6060TR31IGLWD",
  "sku": null,
  "category": "appliances",
  "description": "60CM*60 CM ,3 GAS(Euro pool gas system) & 1 ELECTRICAL(1500 W) ,Wooden,Push knobs ignition : hobs & oven,Top grid and burner cover are Cast iron , Mechanical timer , OVEN BURNER UP & DOWN(1 knob control) ,Oven lamp ,Double Italian designed burner + sparker .",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "1 year warranty on all products.",
  "sourceCategory": "StandingGas Cooker 60cm X60cm StandingGas Cooker 60cm X60cm TR STYLE (Italian Designed",
  "source": {
   "document": "MAXI.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "maxi-maxi60x90fk961mss",
  "name": "MAXI60X90FK961MSS",
  "brand": "MAXI",
  "model": "MAXI60X90FK961MSS",
  "sku": null,
  "category": "appliances",
  "description": "Pure Grey Painted ,full Push Button Ignition ,Full FFD,Single Knob Controls ,Mechanic Timer,Gas Thermostat,Lamp ,Black Oven Cavity ,harmony Knobs,Harmony Handle 1 TRAY& 1 GRID",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "495000.00",
   "display": "₦495,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "495,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxi60x90fk962dss",
  "name": "MAXI60X90FK962DSS",
  "brand": "MAXI",
  "model": "MAXI60X90FK962DSS",
  "sku": null,
  "category": "appliances",
  "description": "Shine Line 90x60 ,Half Inox,5 Pool Gas Full Sabaf Burners 2 Are Sabaf Wok,multiple Cast Iron ,Thermometer,,glass Top Lid,double Gas Oven Door With O Frame Stainless,full Auto Ignition,full Ffd,single Knob Controls,digital Timer Ot-3000,gas Thermostat,double Turbofan,cooling Fan,turnspit,lamp,black Oven Cavity ,Mila A Knobs,vera Handle-1tray & 1 Grid Shine Line 90x60,Half Inox ,5 Pool Gas Burners 1 is Sabaf Work ,Cast  Iron, ,Thermometer,Glass Top ,Liddouble Gas Oven",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "595000.00",
   "display": "₦595,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "595,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxiac200-17jr",
  "name": "MAXIAC200-17JR",
  "brand": "MAXI",
  "model": "MAXIAC200-17JR",
  "sku": null,
  "category": "appliances",
  "description": "Humidifies and purifies the air , 3 speeds ,Remotee Control ,Wide Oscillation angle , 50 L removable Water Tank ,Cool And Effective  Airflow  In Your Home ,200w,12 H Programmable Timer",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "174000.00",
   "display": "₦174,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "174,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxiac400-20bc5",
  "name": "MAXIAC400-20BC5",
  "brand": "MAXI",
  "model": "MAXIAC400-20BC5",
  "sku": null,
  "category": "appliances",
  "description": "50 L AIR COOLER ,OUTDOOR,",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "159000.00",
   "display": "₦159,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "159,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxiaf120h2cy",
  "name": "MAXIAF120H2CY",
  "brand": "MAXI",
  "model": "MAXIAF120H2CY",
  "sku": null,
  "category": "appliances",
  "description": "MAXI AIR FRYER ,12 L,13 IN 1 FUNCTIONALITY,DETACHABLE,NON STICK COATING,SEE THRU WINDOWS.2000- 2300W",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "79000.00",
   "display": "₦79,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "79,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxiaf50ccy",
  "name": "MAXIAF50CCY",
  "brand": "MAXI",
  "model": "MAXIAF50CCY",
  "sku": null,
  "category": "appliances",
  "description": "MAXI AIR FRYER ,5 L,OPERATION UPGRADE WITH DIGITAL TOUCH CONTROL,MORE SAFER,BLACK",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "49000.00",
   "display": "₦49,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "49,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxiap200g-z41",
  "name": "MAXIAP200G-Z41",
  "brand": "MAXI",
  "model": "MAXIAP200G-Z41",
  "sku": null,
  "category": "appliances",
  "description": "Quit performance, true hepa filter removes 99.97% of particles for a healthy home, 3 modes",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "69000",
   "display": "₦69,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "69,000",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxible1010w",
  "name": "MAXIBLE1010W",
  "brand": "MAXI",
  "model": "MAXIBLE1010W",
  "sku": null,
  "category": "appliances",
  "description": "MAXI Blender 1010 Watt",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "38000.00",
   "display": "₦38,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "38,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxible2500bs",
  "name": "MAXIBLE2500BS",
  "brand": "MAXI",
  "model": "MAXIBLE2500BS",
  "sku": null,
  "category": "appliances",
  "description": "BLENDER NUTRIBOOM ,900W,INCLUDES  6 ACCESSORIES ,HIGH SUFFICIENCY EXTRACTOR  BLADES",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "45000.00",
   "display": "₦45,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "45,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxible6001w",
  "name": "MAXIBLE6001W",
  "brand": "MAXI",
  "model": "MAXIBLE6001W",
  "sku": null,
  "category": "appliances",
  "description": "MAXI Hand Blender 600 Watt",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "34000.00",
   "display": "₦34,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "34,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxible6013w1",
  "name": "MAXIBLE6013W1",
  "brand": "MAXI",
  "model": "MAXIBLE6013W1",
  "sku": null,
  "category": "appliances",
  "description": "MAXI Blender 601 Watt",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "26000.00",
   "display": "₦26,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "26,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxiburnerbe001",
  "name": "MAXIBURNERBE001",
  "brand": "MAXI",
  "model": "MAXIBURNERBE001",
  "sku": null,
  "category": "appliances",
  "description": "BE001-4 gas 60 cm BE Model, Stainless Steel Body Cast Iron Pan Supports, Flat Enamel Burner Caps Front Control, Remay Burners, FFD,UK Plug.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "168000.00",
   "display": "₦168,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "168,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxiburnerds201",
  "name": "MAXIBURNERDS201",
  "brand": "MAXI",
  "model": "MAXIBURNERDS201",
  "sku": null,
  "category": "appliances",
  "description": "DS201-4 gas 60 cm DS Compact Model, Stainless Steel Body Enamel Pan Supports, Flat Enamel Burner Caps Side Control, Remay Burners, FFD, UK Plug.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "146000.00",
   "display": "₦146,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "146,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxiburnerds202",
  "name": "MAXIBURNERDS202",
  "brand": "MAXI",
  "model": "MAXIBURNERDS202",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "146000.00",
   "display": "₦146,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "146,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxiburnered041",
  "name": "MAXIBURNERED041",
  "brand": "MAXI",
  "model": "MAXIBURNERED041",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "239000",
   "display": "₦239,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "239,000",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxiburnered045",
  "name": "MAXIBURNERED045",
  "brand": "MAXI",
  "model": "MAXIBURNERED045",
  "sku": null,
  "category": "appliances",
  "description": "ED045-5 gas 90 cm Edge Model, Black Glass Body Cast Iron Pan Supports, Flat Enamel Burner Caps Front Control, Remay Burners, FFD, UK Plug.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "309000.00",
   "display": "₦309,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "309,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxiburnered078w",
  "name": "MAXIBURNERED078W",
  "brand": "MAXI",
  "model": "MAXIBURNERED078W",
  "sku": null,
  "category": "appliances",
  "description": "ED078/W-4 gas 65 cm Edge Model, Grey Glass Body Cast Iron Pan Supports, Flat Enamel Burner Caps Front Control, Remay Burners, FFD, UK Plug.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "263000.00",
   "display": "₦263,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "263,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxick508j-s",
  "name": "MAXICK508J-S",
  "brand": "MAXI",
  "model": "MAXICK508J-S",
  "sku": null,
  "category": "appliances",
  "description": "Rice Cooker ,Even Heating,Auto Keep  Warm ,Anti Over Flow ,Non Stick Coating ,One Pot Meal, Multi use",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "33000.00",
   "display": "₦33,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "33,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxick6929wpb",
  "name": "MAXICK6929WPB",
  "brand": "MAXI",
  "model": "MAXICK6929WPB",
  "sku": null,
  "category": "appliances",
  "description": "Electric Pressure Cooker ,70KPA+1000W  Large Heating Powe,10 Preset Menus With one Touch Start , 6L ,9 Safety Protection",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "59000.00",
   "display": "₦59,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "59,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxicm1002b2",
  "name": "MAXICM1002B2",
  "brand": "MAXI",
  "model": "MAXICM1002B2",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "320000.00",
   "display": "₦320,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "320,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxicm1202a2e",
  "name": "MAXICM1202A2E",
  "brand": "MAXI",
  "model": "MAXICM1202A2E",
  "sku": null,
  "category": "appliances",
  "description": "1.25 L Water Tank ,Boil Dry Protection ,Automatic Turn-off,Delay Start Function ,Aroma Function",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "47000.00",
   "display": "₦47,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "47,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxidh12den7",
  "name": "MAXIDH12DEN7",
  "brand": "MAXI",
  "model": "MAXIDH12DEN7",
  "sku": null,
  "category": "appliances",
  "description": "MAXI Dehumidifier 12L",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "114000.00",
   "display": "₦114,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "114,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxidh30den7",
  "name": "MAXIDH30DEN7",
  "brand": "MAXI",
  "model": "MAXIDH30DEN7",
  "sku": null,
  "category": "appliances",
  "description": "MAXI Dehumidifier 30L",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "179000.00",
   "display": "₦179,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "179,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxidw5201m",
  "name": "MAXIDW5201M",
  "brand": "MAXI",
  "model": "MAXIDW5201M",
  "sku": null,
  "category": "appliances",
  "description": "MAXI DISH WASHER ,SILVER",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "289000.00",
   "display": "₦289,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "289,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxifan56fc",
  "name": "MAXIFAN56FC",
  "brand": "MAXI",
  "model": "MAXIFAN56FC",
  "sku": null,
  "category": "appliances",
  "description": "MAXI CEILING FAN, 5 speed choices,wider sweeping blades,energy saving and long lasting motor",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "34000.00",
   "display": "₦34,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "34,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxihomebuffetfen-ca",
  "name": "MAXIHOMEBUFFETFEN/CA",
  "brand": "MAXI",
  "model": "MAXIHOMEBUFFETFEN/CA",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "265000.00",
   "display": "₦265,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "265,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxihomebuffetfen-fr",
  "name": "MAXIHOMEBUFFETFEN/FR",
  "brand": "MAXI",
  "model": "MAXIHOMEBUFFETFEN/FR",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "265000.00",
   "display": "₦265,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "265,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxihomebuffetoff-na",
  "name": "MAXIHOMEBUFFETOFF/NA",
  "brand": "MAXI",
  "model": "MAXIHOMEBUFFETOFF/NA",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "265000.00",
   "display": "₦265,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "265,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxihomecrisluminaca",
  "name": "MAXIHOMECRISLUMINACA",
  "brand": "MAXI",
  "model": "MAXIHOMECRISLUMINACA",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "380000.00",
   "display": "₦380,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "380,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxihomecrisluminafr",
  "name": "MAXIHOMECRISLUMINAFR",
  "brand": "MAXI",
  "model": "MAXIHOMECRISLUMINAFR",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "380000.00",
   "display": "₦380,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "380,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxihomecrismadrifen",
  "name": "MAXIHOMECRISMADRIFEN",
  "brand": "MAXI",
  "model": "MAXIHOMECRISMADRIFEN",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "145000.00",
   "display": "₦145,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "145,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxihoodd001bl",
  "name": "MAXIHOODD001BL",
  "brand": "MAXI",
  "model": "MAXIHOODD001BL",
  "sku": null,
  "category": "appliances",
  "description": "Angled Curved Black  Single Glass, 60 cm BLACK GLASS, Push Button 1x K25 100 W, Copper Wire Winding Motor Double Vented System Air Outlet, 3 Layer Aluminium  Filter, 1 Wx2 pcs Led Lamp, 220 V/ 50 Hz, UK Plug.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "135000.00",
   "display": "₦135,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "135,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxihoodd0029gr",
  "name": "MAXIHOODD0029GR",
  "brand": "MAXI",
  "model": "MAXIHOODD0029GR",
  "sku": null,
  "category": "appliances",
  "description": "T TYPE HOOD, 90cm-Black Glass Touch Button, 1x K33 115 W, Copper Wire Winding Motor",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "185000",
   "display": "₦185,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "185,000",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxihoodd002bl",
  "name": "MAXIHOODD002BL",
  "brand": "MAXI",
  "model": "MAXIHOODD002BL",
  "sku": null,
  "category": "appliances",
  "description": "Angled Curved Black  Double Glass with Up-Down Inox Sheet, 60 cm BLACK GLASS Touch Button, 1x K33 115 W, Copper Wire Winding Motor, Double Vented System Air Outlet, 3 Layer Aluminium  Filter, 1 Wx2 pcs Led Lamp, 220 V/ 50 Hz, UK Plug.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "165000.00",
   "display": "₦165,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "165,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxihoodd003x",
  "name": "MAXIHOODD003X",
  "brand": "MAXI",
  "model": "MAXIHOODD003X",
  "sku": null,
  "category": "appliances",
  "description": "Pyramid Hood INOX, 60 cm Push Button,1x K25 100 W, Copper Wire Winding Motor Double Vented System Air Outlet, 3 Layer Aliminium  Filter 1 Wx2 pcs Led Lamp, 220 V/ 50 Hz, UK Plug.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "125000.00",
   "display": "₦125,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "125,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxihoodd004x",
  "name": "MAXIHOODD004X",
  "brand": "MAXI",
  "model": "MAXIHOODD004X",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "148000",
   "display": "₦148,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "148,000",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxihoodd011bl",
  "name": "MAXIHOODD011BL",
  "brand": "MAXI",
  "model": "MAXIHOODD011BL",
  "sku": null,
  "category": "appliances",
  "description": "Touch Button, 1x K33 115 W, Copper Wire Winding Motor Double Vented System Air Outlet, 5 Layer Aluminium  Filter 1 Wx2 pcs Led Lamp, 220-240V/ 50-60Hz, UK Plug.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "188000.00",
   "display": "₦188,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "188,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxiiron2432aed",
  "name": "MAXIIRON2432AED",
  "brand": "MAXI",
  "model": "MAXIIRON2432AED",
  "sku": null,
  "category": "appliances",
  "description": "NON STICK COATING IRON,DRY IRON,1100W-1300W,BLACK",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "12000",
   "display": "₦12,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "12,000",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxiiron2473es",
  "name": "MAXIIRON2473ES",
  "brand": "MAXI",
  "model": "MAXIIRON2473ES",
  "sku": null,
  "category": "appliances",
  "description": "SPRAY FUNCTION IRON , NON STICK STEAM IRON ,WHITE AND GREEN,1650-1960W",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "15000.00",
   "display": "₦15,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "15,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxiiron2496es",
  "name": "MAXIIRON2496ES",
  "brand": "MAXI",
  "model": "MAXIIRON2496ES",
  "sku": null,
  "category": "appliances",
  "description": "SPRAY FUNCTION IRON ,CERAMIC STEAM IRON ,BLUE,2290-2720W",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "24500.00",
   "display": "₦24,500.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "24,500.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxiiron2515es",
  "name": "MAXIIRON2515ES",
  "brand": "MAXI",
  "model": "MAXIIRON2515ES",
  "sku": null,
  "category": "appliances",
  "description": "SPRAY FUNCTION IRON , NON STICK STEAM IRON ,WHITE AND BLUE,1830-2180 W",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "17000",
   "display": "₦17,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "17,000",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxijuicer2802je",
  "name": "MAXIJUICER2802JE",
  "brand": "MAXI",
  "model": "MAXIJUICER2802JE",
  "sku": null,
  "category": "appliances",
  "description": "JUICE EXTRACTOR,0.5L LARGE CAPACITY,COMPACT SIZE,2 LEVEL SPEED,400W",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "39500.00",
   "display": "₦39,500.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "39,500.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxikt1501wsek",
  "name": "MAXIKT1501WSEK",
  "brand": "MAXI",
  "model": "MAXIKT1501WSEK",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "39200.00",
   "display": "₦39,200.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "39,200.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxikt17g03a2",
  "name": "MAXIKT17G03A2",
  "brand": "MAXI",
  "model": "MAXIKT17G03A2",
  "sku": null,
  "category": "appliances",
  "description": "MAXI Home Appliances Electrtic Kettle,Glass,1.7L,360 rotating base,water level readings,Auto-Stop function.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "19900.00",
   "display": "₦19,900.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "19,900.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxikt17g03a2-maxikt17m301",
  "name": "KETTLE MAXIKT17G03A2 MAXIKT17M301",
  "brand": "MAXI",
  "model": "MAXIKT17G03A2 MAXIKT17M301",
  "sku": null,
  "category": "appliances",
  "description": "Electrtic Kettle,Glass,1 .7L ,360 rotating base,water level readings,Auto-Stop function.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "1 year warranty on all products.",
  "sourceCategory": "KETTLE",
  "source": {
   "document": "MAXI.pdf",
   "page": 3
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "maxi-maxikt17m301",
  "name": "MAXIKT17M301",
  "brand": "MAXI",
  "model": "MAXIKT17M301",
  "sku": null,
  "category": "appliances",
  "description": "MAXI Kettle 1.5L Black 2000W",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "23000.00",
   "display": "₦23,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "23,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maximixer0293a",
  "name": "MAXIMIXER0293A",
  "brand": "MAXI",
  "model": "MAXIMIXER0293A",
  "sku": null,
  "category": "appliances",
  "description": "MAXI Kitchen Mixer 400 Watt",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "39900.00",
   "display": "₦39,900.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "39,900.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maximixer11jc",
  "name": "MAXIMIXER11JC",
  "brand": "MAXI",
  "model": "MAXIMIXER11JC",
  "sku": null,
  "category": "appliances",
  "description": "MAXI hand mixer, 4 real-sharp blades,strong motor,detachable blade for easy cleaning,",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "24000.00",
   "display": "₦24,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "24,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maximixer6001km",
  "name": "MAXIMIXER6001KM",
  "brand": "MAXI",
  "model": "MAXIMIXER6001KM",
  "sku": null,
  "category": "appliances",
  "description": "MAXI Kitchen Mixer 600 Watt,CAPACITY 4 L,50-60Hz",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "75000.00",
   "display": "₦75,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "75,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maximwo202lw",
  "name": "MAXIMWO202LW",
  "brand": "MAXI",
  "model": "MAXIMWO202LW",
  "sku": null,
  "category": "appliances",
  "description": "MAXI MWO 20L 700W BLACK MANUAL",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "49000.00",
   "display": "₦49,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "49,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maximwo202lyd",
  "name": "MAXIMWO202LYD",
  "brand": "MAXI",
  "model": "MAXIMWO202LYD",
  "sku": null,
  "category": "appliances",
  "description": "20 L , BLACK , DIGITAL CONTROL,DEFROST,TIMER/CLOCK,AUTO COOK",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "57000.00",
   "display": "₦57,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "57,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maximwo207p3b",
  "name": "MWO MAXIMWO207P3B",
  "brand": "MAXI",
  "model": "MAXIMWO207P3B",
  "sku": null,
  "category": "appliances",
  "description": "20L BLACK DIGITALCONTROLDEFROSTTIMER/CLOCKAUTOCOOK",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "1 year warranty on all products.",
  "sourceCategory": "MWO",
  "source": {
   "document": "MAXI.pdf",
   "page": 2
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "maxi-maximwo302km-d",
  "name": "MAXIMWO302KM-D",
  "brand": "MAXI",
  "model": "MAXIMWO302KM-D",
  "sku": null,
  "category": "appliances",
  "description": "30 L , BLACK , DIGITAL CONTROL,DEFROST,TIMER/CLOCK,AUTO COOK",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "85000.00",
   "display": "₦85,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "85,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxiovenqbp7ssd",
  "name": "MAXIOVENQBP7SSD",
  "brand": "MAXI",
  "model": "MAXIOVENQBP7SSD",
  "sku": null,
  "category": "appliances",
  "description": "QB Prime Model ,Stainless Steel Panel -Black Glass Oven Door, 60 cm Electrical Built in Oven, 0+7 Functions, Cooling Fan, Double Glass with low-e inner glass, White Led Display, Pop-up Aria B Onyx Black Light Chrome Coated Knobs- Aria Anodized Magic Silver Handle, 6-level Wire Side Racks, Rottiesserie Kit (Highline), 1 pc of Standart Oven Tray-1 pc. of Baseline Wire Grid, Type G Plug Strafor+Shrink Packaking.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "309000.00",
   "display": "₦309,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "309,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxiovenqx97bld",
  "name": "MAXIOVENQX97BLD",
  "brand": "MAXI",
  "model": "MAXIOVENQX97BLD",
  "sku": null,
  "category": "appliances",
  "description": "INBUILT  OVEN, BURNER,HOOD",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "419000",
   "display": "₦419,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "419,000",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxiovenqx97ssd",
  "name": "MAXIOVENQX97SSD",
  "brand": "MAXI",
  "model": "MAXIOVENQX97SSD",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "427000",
   "display": "₦427,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "427,000",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxiovenqx9gr",
  "name": "MAXIOVENQX9GR",
  "brand": "MAXI",
  "model": "MAXIOVENQX9GR",
  "sku": null,
  "category": "appliances",
  "description": "QX Elegance Model ,Pure Gray Glass Panel -Pure Gray Glass Oven Door, 60 cm Electrical Built in Oven, 0+9 Functions,Cooling Fan, Double Glass with low-e inner glass, White Led Display, Pop-up Tulip Platinum Gray Knobs- Vera Anodized Titanium Gray Handle, 6-level Wire Side Racks, Rottiesserie Kit (Highline), 1 pc of Standart Oven Tray-1 pc. of Highline Wire Grid, 1 pc. of Deep Tray, FryArt, Without Plug, Strafor+Shrink Packaking.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "385000.00",
   "display": "₦385,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "385,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxipac10hpcrn7",
  "name": "MAXIPAC10HPCRN7",
  "brand": "MAXI",
  "model": "MAXIPAC10HPCRN7",
  "sku": null,
  "category": "appliances",
  "description": "1HP,TIMER BUTTON,MOBILE TYPE AIR CONDITIONER,LED DISPLAY,KEEP ROOM TEMPERATURE COOL,1100W MAXI Dehumidifier",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "219000.00",
   "display": "₦219,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "219,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxipac15hpcrn7",
  "name": "PORTABLEAC MAXIPAC15HPCRN7",
  "brand": "MAXI",
  "model": "MAXIPAC15HPCRN7",
  "sku": null,
  "category": "appliances",
  "description": "15HPTIMERBUTTONMOBILETYPEAIRCONDITIONERLEDDISPLAYKEEPROOMTEMPERATURECOOL1600W .",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "1 year warranty on all products.",
  "sourceCategory": "PORTABLEAC",
  "source": {
   "document": "MAXI.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "maxi-maxist50mg4g011",
  "name": "MAXIST50MG4G011",
  "brand": "MAXI",
  "model": "MAXIST50MG4G011",
  "sku": null,
  "category": "appliances",
  "description": "50 CM * 50 CM, 4 GAS BURNERS, BLACK  COLOUR,, GLASS.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "125000.00",
   "display": "₦125,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "125,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxist60mg4g088",
  "name": "StandingGas Cooker 60cm X60cm StandingGas Cooker 60cm X60cm TR STYLE (Italian Designed MAXIST60MG4G088",
  "brand": "MAXI",
  "model": "MAXIST60MG4G088",
  "sku": null,
  "category": "appliances",
  "description": "60 CM * 60 CM 4 GAS GLASS Stainless, OVEN BURNER UP & DOWN(1 knob control) Ignition bottom",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "1 year warranty on all products.",
  "sourceCategory": "StandingGas Cooker 60cm X60cm StandingGas Cooker 60cm X60cm TR STYLE (Italian Designed",
  "source": {
   "document": "MAXI.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "maxi-maxist90mg6y029",
  "name": "MAXIST90MG6Y029",
  "brand": "MAXI",
  "model": "MAXIST90MG6Y029",
  "sku": null,
  "category": "appliances",
  "description": "60 CM * 90 CM, 4 GAS + 2 ELECTRICAL, GLASS, Stainless, OVEN BURNER UP & DOWN(1 knob control) Ignition bottom",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 1
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 1
  },
  "price": {
   "currency": "NGN",
   "amount": "330000.00",
   "display": "₦330,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "330,000.00",
    "document": "MAXI-1.pdf",
    "page": 1
   }
  ]
 },
 {
  "id": "maxi-maxitoa2l17w2",
  "name": "MAXITOA2L17W2",
  "brand": "MAXI",
  "model": "MAXITOA2L17W2",
  "sku": null,
  "category": "appliances",
  "description": "Defrost /Reheat/Cancel , 2 Slice,6 settings browning control ,Removable Crumb Tray ,Cord Storage Anti-slip Feet",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "34000.00",
   "display": "₦34,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "34,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxitvstandatalaiaci",
  "name": "MAXITVSTANDATALAIACI",
  "brand": "MAXI",
  "model": "MAXITVSTANDATALAIACI",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "195000.00",
   "display": "₦195,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "195,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxitvstandatlantafr",
  "name": "MAXITVSTANDATLANTAFR",
  "brand": "MAXI",
  "model": "MAXITVSTANDATLANTAFR",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "265000.00",
   "display": "₦265,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "265,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxitvstandbrilharef",
  "name": "MAXITVSTANDBRILHAREF",
  "brand": "MAXI",
  "model": "MAXITVSTANDBRILHAREF",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "410000.00",
   "display": "₦410,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "410,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxitvstandbrilhareo",
  "name": "MAXITVSTANDBRILHAREO",
  "brand": "MAXI",
  "model": "MAXITVSTANDBRILHAREO",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "410000.00",
   "display": "₦410,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "410,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxitvstanddallascar",
  "name": "MAXITVSTANDDALLASCAR",
  "brand": "MAXI",
  "model": "MAXITVSTANDDALLASCAR",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "265000.00",
   "display": "₦265,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "265,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxitvstandjuquehy",
  "name": "MAXITVSTANDJUQUEHY",
  "brand": "MAXI",
  "model": "MAXITVSTANDJUQUEHY",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "225000.00",
   "display": "₦225,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "225,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxitvstandpaladio14",
  "name": "MAXITVSTANDPALADIO14",
  "brand": "MAXI",
  "model": "MAXITVSTANDPALADIO14",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "72000.00",
   "display": "₦72,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "72,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxitvstandyorkled",
  "name": "MAXITVSTANDYORKLED",
  "brand": "MAXI",
  "model": "MAXITVSTANDYORKLED",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "210000.00",
   "display": "₦210,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "210,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxitvstanlazulipret",
  "name": "MAXITVSTANLAZULIPRET",
  "brand": "MAXI",
  "model": "MAXITVSTANLAZULIPRET",
  "sku": null,
  "category": "appliances",
  "description": "",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "79000.00",
   "display": "₦79,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "79,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxiups12kdg",
  "name": "MAXIUPS12KDG",
  "brand": "MAXI",
  "model": "MAXIUPS12KDG",
  "sku": null,
  "category": "appliances",
  "description": "1.2KVA LED Version",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "71000.00",
   "display": "₦71,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "71,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxivc6227ylc",
  "name": "MAXIVC6227YLC",
  "brand": "MAXI",
  "model": "MAXIVC6227YLC",
  "sku": null,
  "category": "appliances",
  "description": "Bagless cyclone vacuum cleaner (1.5m flexible hose, 2.5L dust capacity, 4.5m power cord, air flow control handle, cervice nozzle) 50/60Hz",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "62000.00",
   "display": "₦62,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "62,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxivc6302dyl",
  "name": "MAXIVC6302DYL",
  "brand": "MAXI",
  "model": "MAXIVC6302DYL",
  "sku": null,
  "category": "appliances",
  "description": "HANDHELD CORDLESS VACUUM CLEANER, MOTORIZED POWER FLOOR BRUSH",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "84000.00",
   "display": "₦84,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "84,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxivc6342ylw",
  "name": "MAXIVC6342YLW",
  "brand": "MAXI",
  "model": "MAXIVC6342YLW",
  "sku": null,
  "category": "appliances",
  "description": "Wet and dry vacuum cleaner (1.5m flexible hose, 18Ltank capacity, 4m porwer cord, blower) 50/60Hz",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "39000.00",
   "display": "₦39,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "39,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxivp2155",
  "name": "MAXIVP2155",
  "brand": "MAXI",
  "model": "MAXIVP2155",
  "sku": null,
  "category": "appliances",
  "description": "SURGE VOLTAGE PROTECTOR,AIR CONDITIONER PROTECTOR (1HP-1.5HP)13 AMPS",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "5500",
   "display": "₦5,500"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "5,500",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxivp2166d",
  "name": "MAXIVP2166D",
  "brand": "MAXI",
  "model": "MAXIVP2166D",
  "sku": null,
  "category": "appliances",
  "description": "SURGE VOLTAGE PROTECTOR,AIR CONDITIONER PROTECTOR (1HP-1.5HP)13 AMPS",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "7500",
   "display": "₦7,500"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "7,500",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxivp30avs",
  "name": "MAXIVP30AVS",
  "brand": "MAXI",
  "model": "MAXIVP30AVS",
  "sku": null,
  "category": "appliances",
  "description": "APPLIANCE GUARD,230V,30AMPS,PROTECTS AGAINST HIGH AND LOW VOLTAGE",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "13000",
   "display": "₦13,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "13,000",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxiwd1242s",
  "name": "MAXIWD1242S",
  "brand": "MAXI",
  "model": "MAXIWD1242S",
  "sku": null,
  "category": "appliances",
  "description": "MAXI WATER DISPENSER, BLACK COLOR , 3 FAUCETS(HOT,COLD,NEUTRAL)",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "95000.00",
   "display": "₦95,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "95,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxiwd2382s-b",
  "name": "MAXIWD2382S-B",
  "brand": "MAXI",
  "model": "MAXIWD2382S-B",
  "sku": null,
  "category": "appliances",
  "description": "MAXI WATER DISPENSER, BLACK COLOR , 3 FAUCETS(HOT,COLD,NEUTRAL)CABINET",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "140000.00",
   "display": "₦140,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "140,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-mc4025b2",
  "name": "MC4025B2",
  "brand": "MAXI",
  "model": "MC4025B2",
  "sku": null,
  "category": "appliances",
  "description": "Grill,Black,2000W,Easy Cleaning,Knob Control,",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "44000.00",
   "display": "₦44,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "44,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-mj-fp60d1",
  "name": "MJ-FP60D1",
  "brand": "MAXI",
  "model": "MJ-FP60D1",
  "sku": null,
  "category": "appliances",
  "description": "FOOD PROCESSOR,WHITE,Rated Power: 800W,1.5L,Durable All-Copper-Wire Motor,Speed Adjust with Knob Control",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "65000.00",
   "display": "₦65,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "65,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-mk-17s30a2",
  "name": "MK-17S30A2",
  "brand": "MAXI",
  "model": "MK-17S30A2",
  "sku": null,
  "category": "appliances",
  "description": "Electric Kettle,Silver, 1.7L,Fast Boiling System,Easy-To-Use 360° Rotatable Base,Rated Power: 1850-2200W",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "22400.00",
   "display": "₦22,400.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "22,400.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-mk-17s36a",
  "name": "MK-17S36A",
  "brand": "MAXI",
  "model": "MK-17S36A",
  "sku": null,
  "category": "appliances",
  "description": "Electric Kettle,Stainless Steel, 1.7L,Fast Boiling System,Easy-To-Use 360° Rotatable Base,Rated Power: 1500W",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "16500.00",
   "display": "₦16,500.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "16,500.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-mt-rp2l22",
  "name": "MT-RP2L22",
  "brand": "MAXI",
  "model": "MT-RP2L22",
  "sku": null,
  "category": "appliances",
  "description": "TOASTER,WHITE,Rated Power: 800 - 950W,Rated Power: 800 - 950W,2 Slice 2 Slot,7° for Browning Control",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "24000.00",
   "display": "₦24,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "24,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-spli15hpinv",
  "name": "SPLIT SPLI15HPINV .",
  "brand": "MAXI",
  "model": "SPLI15HPINV .",
  "sku": null,
  "category": "appliances",
  "description": "Maxi Split 1 .5 HP inverter ,220-240V ,rated Power 1800 W ,50Hz,885*280*358 mm",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "1 year warranty on all products.",
  "sourceCategory": "SPLIT",
  "source": {
   "document": "MAXI.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "maxi-split1hpinv",
  "name": "SPLIT SPLIT1HPINV",
  "brand": "MAXI",
  "model": "SPLIT1HPINV",
  "sku": null,
  "category": "appliances",
  "description": "Maxi Split 1HP inverter ,220-240V ,rated Power 1800 W ,50Hz,885*280*358 mm",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "1 year warranty on all products.",
  "sourceCategory": "SPLIT",
  "source": {
   "document": "MAXI.pdf",
   "page": 1
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "maxi-maxitvstandrubi160",
  "name": "TVSTAND MAXITVSTANDRUBI160",
  "brand": "MAXI",
  "model": "MAXITVSTANDRUBI160",
  "sku": null,
  "category": "consumer-electronics",
  "description": "RUBITVSTAND (L:160CMH:655D:375)OFFWHITE/CINAMOMO , , . , .",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": "1 year warranty on all products.",
  "sourceCategory": "TVSTAND",
  "source": {
   "document": "MAXI.pdf",
   "page": 4
  },
  "price": null,
  "priceStatus": "not-listed",
  "warrantyStatus": "source-listed"
 },
 {
  "id": "maxi-maxiext1k3-ps",
  "name": "MAXIEXT1K3-PS",
  "brand": "MAXI",
  "model": "MAXIEXT1K3-PS",
  "sku": null,
  "category": "electrical-power",
  "description": "MAXI EXTENSION CORD 3 OUTLET(70 PCS PER CARTON)",
  "image": {
   "url": "../assets/catalogue/hardware-electrical.svg",
   "alt": "Illustrative electrical equipment category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "6500",
   "display": "₦6,500"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "6,500",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxiext1k5-ps",
  "name": "MAXIEXT1K5-PS",
  "brand": "MAXI",
  "model": "MAXIEXT1K5-PS",
  "sku": null,
  "category": "electrical-power",
  "description": "MAXI EXTENSION CORD 5 OUTLET(60 PCS PER CARTON)",
  "image": {
   "url": "../assets/catalogue/hardware-electrical.svg",
   "alt": "Illustrative electrical equipment category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "7500",
   "display": "₦7,500"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "7,500",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxiext4k3u3glpu",
  "name": "MAXIEXT4K3U3GLPU",
  "brand": "MAXI",
  "model": "MAXIEXT4K3U3GLPU",
  "sku": null,
  "category": "electrical-power",
  "description": "MAXI EXTENSION  3 SOCKET,USB CHARGER ( 24 PCS PER CARTON)",
  "image": {
   "url": "../assets/catalogue/hardware-electrical.svg",
   "alt": "Illustrative electrical equipment category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "12000",
   "display": "₦12,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "12,000",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxiext4k4-ps",
  "name": "MAXIEXT4K4-PS",
  "brand": "MAXI",
  "model": "MAXIEXT4K4-PS",
  "sku": null,
  "category": "electrical-power",
  "description": "MAXI EXTENSION  4 OUTLET SWITCH(30 PCS PER CARTON)",
  "image": {
   "url": "../assets/catalogue/hardware-electrical.svg",
   "alt": "Illustrative electrical equipment category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "9000",
   "display": "₦9,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "9,000",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxiext5k4u3glpu",
  "name": "MAXIEXT5K4U3GLPU",
  "brand": "MAXI",
  "model": "MAXIEXT5K4U3GLPU",
  "sku": null,
  "category": "electrical-power",
  "description": "MAXI EXTENSION  4 SOCKET,USB CHARGER (24 PCS PER CARTON)",
  "image": {
   "url": "../assets/catalogue/hardware-electrical.svg",
   "alt": "Illustrative electrical equipment category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "15000",
   "display": "₦15,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "15,000",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxiext5k5-ps",
  "name": "MAXIEXT5K5-PS",
  "brand": "MAXI",
  "model": "MAXIEXT5K5-PS",
  "sku": null,
  "category": "electrical-power",
  "description": "MAXI EXTENSION  5 OUTLET SWITCH(24 PCS PER CARTON)",
  "image": {
   "url": "../assets/catalogue/hardware-electrical.svg",
   "alt": "Illustrative electrical equipment category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "10000",
   "display": "₦10,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "10,000",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxigen-ek20",
  "name": "MAXIGEN EK20",
  "brand": "MAXI",
  "model": "MAXIGEN EK20",
  "sku": null,
  "category": "electrical-power",
  "description": "Generator,2kw / 2.5 kva, Gasoline, oil alret, 100% copper,Key Starter15L Fuel Tank,Elegant.",
  "image": {
   "url": "../assets/catalogue/hardware-electrical.svg",
   "alt": "Illustrative electrical equipment category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "290000.00",
   "display": "₦290,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "290,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxigen-em10",
  "name": "MAXIGEN EM10",
  "brand": "MAXI",
  "model": "MAXIGEN EM10",
  "sku": null,
  "category": "electrical-power",
  "description": "Generator,1kw / 1.25 kva, Gasoline, oil alret, 100% copper, Manual ,Elegant Design,6 L Fuel Tank",
  "image": {
   "url": "../assets/catalogue/hardware-electrical.svg",
   "alt": "Illustrative electrical equipment category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 2
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 2
  },
  "price": {
   "currency": "NGN",
   "amount": "189000.00",
   "display": "₦189,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "189,000.00",
    "document": "MAXI-1.pdf",
    "page": 2
   }
  ]
 },
 {
  "id": "maxi-maxiups2kdg",
  "name": "MAXIUPS2KDG",
  "brand": "MAXI",
  "model": "MAXIUPS2KDG",
  "sku": null,
  "category": "electrical-power",
  "description": "UPS 2KVA LED Version",
  "image": {
   "url": "../assets/catalogue/hardware-electrical.svg",
   "alt": "Illustrative electrical equipment category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "103000.00",
   "display": "₦103,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "103,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxiups3kdg",
  "name": "MAXIUPS3KDG",
  "brand": "MAXI",
  "model": "MAXIUPS3KDG",
  "sku": null,
  "category": "electrical-power",
  "description": "UPS 3KVA LED Version",
  "image": {
   "url": "../assets/catalogue/hardware-electrical.svg",
   "alt": "Illustrative electrical equipment category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 4
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "189000.00",
   "display": "₦189,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "189,000.00",
    "document": "MAXI-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "maxi-maxiups600dg",
  "name": "MAXIUPS600DG",
  "brand": "MAXI",
  "model": "MAXIUPS600DG",
  "sku": null,
  "category": "electrical-power",
  "description": "UPS 600VA LED Version",
  "image": {
   "url": "../assets/catalogue/hardware-electrical.svg",
   "alt": "Illustrative electrical equipment category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "34000.00",
   "display": "₦34,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "34,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "maxi-maxiups800dg",
  "name": "MAXIUPS800DG",
  "brand": "MAXI",
  "model": "MAXIUPS800DG",
  "sku": null,
  "category": "electrical-power",
  "description": "UPS 800VA LED Version",
  "image": {
   "url": "../assets/catalogue/hardware-electrical.svg",
   "alt": "Illustrative electrical equipment category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": [
   {
    "text": "1 year warranty on all products.",
    "source": {
     "document": "MAXI-1.pdf",
     "page": 3
    },
    "scope": "manufacturer-list"
   }
  ],
  "warrantyStatus": "source-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 3
  },
  "price": {
   "currency": "NGN",
   "amount": "42000.00",
   "display": "₦42,000.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "42,000.00",
    "document": "MAXI-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "mora-tv-43d3n",
  "name": "TV 43D3N",
  "brand": "MORA",
  "model": "TV 43D3N",
  "sku": null,
  "category": "consumer-electronics",
  "description": "43'' LED HD TV,3 HDMI, 2 USB,1 AV  ,Black,Free Bracket",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": null,
  "warrantyStatus": "not-listed",
  "source": {
   "document": "Hisense-1.pdf",
   "page": 4
  },
  "price": {
   "currency": "NGN",
   "amount": "160000",
   "display": "₦160,000"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "160,000",
    "document": "Hisense-1.pdf",
    "page": 4
   }
  ]
 },
 {
  "id": "accessory-acbracket",
  "name": "ACBRACKET",
  "brand": null,
  "manufacturerStatus": "not-specified-in-source",
  "model": "ACBRACKET",
  "sku": null,
  "category": "appliances",
  "description": "AC BRACKET, OUTDOOR UNIT.",
  "image": {
   "url": "../assets/catalogue/hardware-appliances.svg",
   "alt": "Illustrative appliances category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": null,
  "warrantyStatus": "not-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "sources": [
   {
    "document": "LG-1.pdf",
    "page": 3
   }
  ],
  "price": {
   "currency": "NGN",
   "amount": "7200.00",
   "display": "₦7,200.00"
  },
  "priceStatus": "listed",
  "priceObservations": [
   {
    "rawAmount": "7,200.00",
    "document": "MAXI-1.pdf",
    "page": 4
   },
   {
    "rawAmount": "7,200",
    "document": "LG-1.pdf",
    "page": 3
   }
  ]
 },
 {
  "id": "accessory-bracket-universal",
  "name": "BRACKET UNIVERSAL",
  "brand": null,
  "manufacturerStatus": "not-specified-in-source",
  "model": "BRACKET UNIVERSAL",
  "sku": null,
  "category": "consumer-electronics",
  "description": "For 32\" TV",
  "image": {
   "url": "../assets/catalogue/hardware-electronics.svg",
   "alt": "Illustrative consumer electronics category artwork; not a product photograph.",
   "kind": "category-placeholder"
  },
  "warranty": null,
  "warrantyStatus": "not-listed",
  "source": {
   "document": "MAXI-1.pdf",
   "page": 4
  },
  "sources": [
   {
    "document": "Hisense-1.pdf",
    "page": 4
   },
   {
    "document": "LG-1.pdf",
    "page": 3
   }
  ],
  "price": null,
  "priceStatus": "conflict",
  "priceObservations": [
   {
    "rawAmount": "4,600",
    "document": "MAXI-1.pdf",
    "page": 4
   },
   {
    "rawAmount": "6,500",
    "document": "Hisense-1.pdf",
    "page": 4
   },
   {
    "rawAmount": "6,500",
    "document": "LG-1.pdf",
    "page": 3
   }
  ],
  "priceConflict": {
   "message": "Supplier documents list different amounts for this model; no price is published.",
   "observations": [
    {
     "rawAmount": "4,600",
     "document": "MAXI-1.pdf",
     "page": 4
    },
    {
     "rawAmount": "6,500",
     "document": "Hisense-1.pdf",
     "page": 4
    },
    {
     "rawAmount": "6,500",
     "document": "LG-1.pdf",
     "page": 3
    }
   ]
  }
 }
];

window.ElectronyHardwareSourceDocuments = Object.freeze(sourceDocuments.map((source) => Object.freeze(source)));
window.ElectronyHardwareSourceProducts = Object.freeze(sourceProducts.map((product) => Object.freeze(product)));
