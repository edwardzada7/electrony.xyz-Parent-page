window.ElectronyConfig = Object.freeze({
  contactUrl: null,
  whatsappNumber: "",
  billsApiBaseUrl: "http://localhost:4174",
  productLinks: Object.freeze({
    electronyos: Object.freeze({ landingPageUrl: null, appUrl: null }),
    automobile: Object.freeze({ landingPageUrl: "/automobile/", appUrl: null }),
    bills: Object.freeze({ landingPageUrl: "/bills/", appUrl: "/bills/app/" }),
    stylist: Object.freeze({ landingPageUrl: null, appUrl: null })
  })
});