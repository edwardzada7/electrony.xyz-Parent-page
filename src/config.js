window.ElectronyConfig = Object.freeze({
  contactUrl: null,
  whatsappNumber: "",
  billsApiBaseUrl: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:4174"
    : "",
  productLinks: Object.freeze({
    electronyos: Object.freeze({ landingPageUrl: null, appUrl: null }),
    hardware: Object.freeze({ landingPageUrl: "/hardware/", appUrl: null }),
    automobile: Object.freeze({ landingPageUrl: "/automobile/", appUrl: null }),
    energy: Object.freeze({ landingPageUrl: "/energy/", appUrl: null }),
    bills: Object.freeze({ landingPageUrl: "/bills/", appUrl: "/bills/app/" }),
    stylist: Object.freeze({ landingPageUrl: null, appUrl: null })
  })
});