window.ElectronyConfig = Object.freeze({
  contactUrl: null,
  whatsappNumber: "2347068613487",
  // Local static development uses the local API; the Vercel build replaces this with BILLS_API_BASE_URL.
  billsApiBaseUrl: "http://localhost:4174",
  // Public identity configuration for accounts.electrony.xyz. Values are injected at build time.
  identityProjectUrl: null,
  identityPublishableKey: null,
  productLinks: Object.freeze({
    electronyos: Object.freeze({ landingPageUrl: "https://os.electrony.xyz", appUrl: null }),
    hardware: Object.freeze({ landingPageUrl: "https://hardware.electrony.xyz", appUrl: null }),
    automobile: Object.freeze({ landingPageUrl: "https://auto.electrony.xyz", appUrl: null }),
    energy: Object.freeze({ landingPageUrl: "https://energy.electrony.xyz", appUrl: null }),
    bills: Object.freeze({ landingPageUrl: "https://bills.electrony.xyz", appUrl: "https://bills.electrony.xyz" }),
    stylist: Object.freeze({ landingPageUrl: "https://istylist.online", appUrl: null })
  })
});