window.ElectronyConfig = Object.freeze({
  contactUrl: null,
  whatsappNumber: "",
  // Local static development uses the local API; the Vercel build replaces this with BILLS_API_BASE_URL.
  billsApiBaseUrl: "http://localhost:4174",
  productLinks: Object.freeze({
    electronyos: Object.freeze({ landingPageUrl: null, appUrl: null }),
    hardware: Object.freeze({ landingPageUrl: "/hardware/", appUrl: null }),
    automobile: Object.freeze({ landingPageUrl: "/automobile/", appUrl: null }),
    energy: Object.freeze({ landingPageUrl: "/energy/", appUrl: null }),
    bills: Object.freeze({ landingPageUrl: "/bills/", appUrl: "/bills/app/" }),
    stylist: Object.freeze({ landingPageUrl: null, appUrl: null })
  })
});