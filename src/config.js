window.ElectronyConfig = Object.freeze({
  contactUrl: null,
  whatsappNumber: "",
<<<<<<< HEAD
  // Local static development uses the local API; the Vercel build replaces this with BILLS_API_BASE_URL.
  billsApiBaseUrl: "http://localhost:4174",
=======
  billsApiBaseUrl: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:4174"
    : "",
>>>>>>> 6d2b7d71e988704f91aaeb15c9effd4fd2839db4
  productLinks: Object.freeze({
    electronyos: Object.freeze({ landingPageUrl: null, appUrl: null }),
    hardware: Object.freeze({ landingPageUrl: "/hardware/", appUrl: null }),
    automobile: Object.freeze({ landingPageUrl: "/automobile/", appUrl: null }),
    energy: Object.freeze({ landingPageUrl: "/energy/", appUrl: null }),
    bills: Object.freeze({ landingPageUrl: "/bills/", appUrl: "/bills/app/" }),
    stylist: Object.freeze({ landingPageUrl: null, appUrl: null })
  })
});