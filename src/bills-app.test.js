const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const appSource = fs.readFileSync(path.join(__dirname, "bills-app.js"), "utf8");

function createAppContext(search = "?service=virtual-cards", fetchHandler = null, withIdentity = false, pageUrl = null) {
  const requests = [];
  const servicePanel = {
    innerHTML: "",
    querySelector() {
      return null;
    }
  };
  const serviceList = {
    innerHTML: "",
    items: [],
    appendChild(item) {
      this.items.push(item);
    }
  };
  const serviceGrid = { innerHTML: "" };
  const accountsButton = {
    href: "https://accounts.electrony.xyz/",
    textContent: "Sign in with Electrony Accounts",
    listeners: [],
    addEventListener(event, listener) {
      this.listeners.push({ event, listener });
    }
  };
  const authStatus = { hidden: true, textContent: "" };
  const assignments = [];
  const historyStatus = { hidden: true, textContent: "" };
  const checkoutPanel = {
    innerHTML: "",
    classList: {
      add() {},
      remove() {}
    }
  };
  const document = {
    listeners: {},
    addEventListener(event, listener) {
      this.listeners[event] = listener;
    },
    querySelector(selector) {
      if (selector === "#service-list") return serviceList;
      if (selector === "#service-panel") return servicePanel;
      if (selector === "#service-grid") return serviceGrid;
      if (selector === "#checkout-panel") return checkoutPanel;
      if (withIdentity && selector === "#accounts-sign-in-button") return accountsButton;
      if (withIdentity && selector === "#accounts-auth-status") return authStatus;
      if (withIdentity && selector === "#customer-history-status") return historyStatus;
      return null;
    },
    createElement() {
      return { innerHTML: "" };
    },
    querySelectorAll() {
      return [];
    }
  };
  const currentUrl = new URL(pageUrl || `https://example.test/bills/app/${search}`);
  const window = {
    ElectronyConfig: { billsApiBaseUrl: "https://bills-api.example.test" },
    location: {
      href: currentUrl.href,
      protocol: "https:",
      search: currentUrl.search,
      pathname: currentUrl.pathname,
      assign(url) {
        assignments.push(url);
      }
    },
    sessionStorage: {
      length: 0,
      key() {
        return null;
      },
      removeItem() {}
    }
  };
  const context = vm.createContext({
    AbortSignal,
    URL,
    URLSearchParams,
    console,
    document,
    fetch: (...args) => {
      requests.push(args);
      if (fetchHandler) return fetchHandler(...args);
      throw new Error("Unexpected Bills API request.");
    },
    window
  });

  vm.runInContext(appSource, context);
  return {
    context,
    requests,
    ready: document.listeners.DOMContentLoaded,
    servicePanel,
    serviceGrid,
    serviceList,
    accountsButton,
    authStatus,
    historyStatus,
    assignments
  };
}

test("the six Bills services are split between guest checkout and account-required services", () => {
  const { context, serviceGrid, serviceList } = createAppContext();

  assert.deepEqual(
    JSON.parse(vm.runInContext("JSON.stringify(Object.values(serviceCatalog).map(({ id, guestCheckout }) => ({ id, guestCheckout })))", context)),
    [
      { id: "electricity", guestCheckout: true },
      { id: "airtime", guestCheckout: true },
      { id: "data", guestCheckout: true },
      { id: "bills", guestCheckout: true },
      { id: "virtual-cards", guestCheckout: false },
      { id: "gift-cards", guestCheckout: false }
    ]
  );

  context.renderServiceList();
  for (const label of ["Electricity", "Airtime", "Data", "Pay Bills", "Virtual Cards", "Gift Cards"]) {
    assert.match(serviceGrid.innerHTML, new RegExp(label));
  }
  assert.equal(serviceList.items.length, 6);
  assert.match(serviceList.items[4].innerHTML, /Virtual Cards/);
  assert.match(serviceList.items[4].innerHTML, /Account required/);
  assert.match(serviceList.items[5].innerHTML, /Gift Cards/);
  assert.match(serviceList.items[5].innerHTML, /Account required/);
  assert.equal((serviceGrid.innerHTML.match(/Guest checkout/g) || []).length, 4);
  assert.equal((serviceGrid.innerHTML.match(/Account required/g) || []).length, 2);
});

test("account-required services stay pending and cannot enter guest quote, payment, or return-verification paths", async () => {
  const { context, requests, ready, servicePanel } = createAppContext("?service=virtual-cards&payment=success&reference=ELECBILLS-20261024-ABC123");

  ready();
  context.renderServicePanel();
  assert.match(servicePanel.innerHTML, /Account-required service/);
  assert.match(servicePanel.innerHTML, /Integration pending/);
  assert.match(servicePanel.innerHTML, /sign-in is not connected/);
  assert.doesNotMatch(servicePanel.innerHTML, /purchase-form|catalogue-retry/);

  await context.handlePurchaseSubmission();
  await assert.rejects(context.requestFeeQuote("virtual-cards", 10, {}), /do not support guest fee quotes/);
  await context.verifyReturnedPayment();
  vm.runInContext("state.order = { serviceId: 'virtual-cards' }", context);
  await context.completePurchase();

  assert.equal(requests.length, 0);
  assert.equal(vm.runInContext("state.order", context), null);
});

test("gift-card entry routes remain account-required and do not invoke the Bills API", () => {
  const { context, requests, servicePanel } = createAppContext("?service=gift-cards");

  context.renderServicePanel();

  assert.match(servicePanel.innerHTML, /Gift Cards/);
  assert.match(servicePanel.innerHTML, /soft-KYC process/);
  assert.match(servicePanel.innerHTML, /Not available yet/);
  assert.equal(requests.length, 0);
});

test("guest services retain their existing catalogue request", () => {
  const { requests, ready } = createAppContext("?service=electricity");

  ready();

  assert.equal(requests.length, 1);
  assert.match(requests[0][0], /\/api\/services\/catalog$/);
});

test("guest service catalogue renders unavailable without provider-supplied products", async () => {
  const { context, requests, servicePanel } = createAppContext("?service=electricity", async () => ({
    ok: true,
    json: async () => ({
      ok: true,
      categories: {
        electricity: { available: false, billers: [], products: [], message: "No verified provider is configured." },
        airtime: { available: false, billers: [], products: [], message: "No verified provider is configured." },
        data: { available: false, billers: [], products: [], message: "No verified provider is configured." },
        bills: { available: false, billers: [], products: [], message: "No verified provider is configured." }
      }
    })
  }));

  await context.loadServiceCatalogue();
  context.renderServicePanel();

  assert.equal(requests.length, 1);
  assert.match(servicePanel.innerHTML, /No verified provider is configured/);
  assert.doesNotMatch(servicePanel.innerHTML, /purchase-form|biller-code|Continue to payment/);
  assert.doesNotMatch(appSource, /Sogo|SOGO_/i);
});

test("OAuth sign-in preserves the Bills page and displays cancellation without blocking guests", async () => {
  const { context, accountsButton, authStatus } = createAppContext(
    "?service=data&auth=cancelled",
    async () => ({ ok: false, json: async () => ({ ok: false }) }),
    true,
    "https://bills.electrony.xyz/?service=data&auth=cancelled"
  );

  await context.initializeIdentitySignIn();

  const signInUrl = new URL(accountsButton.href);
  const returnTo = new URL(signInUrl.searchParams.get("return_to"));
  assert.equal(signInUrl.pathname, "/api/auth/oauth/start");
  assert.equal(returnTo.origin, "https://bills.electrony.xyz");
  assert.equal(returnTo.pathname, "/");
  assert.equal(returnTo.searchParams.get("service"), "data");
  assert.equal(authStatus.hidden, false);
  assert.match(authStatus.textContent, /Sign-in was cancelled/);
  assert.match(authStatus.textContent, /Guest checkout remains available/);
});

test("OAuth sign-in reports temporary unavailability and announces redirecting", async () => {
  const { context, accountsButton, authStatus, assignments } = createAppContext(
    "?auth=unavailable",
    async () => ({ ok: false, json: async () => ({ ok: false }) }),
    true
  );

  await context.initializeIdentitySignIn();
  assert.match(authStatus.textContent, /temporarily unavailable/);
  assert.match(authStatus.textContent, /Guest checkout remains available/);

  await accountsButton.listeners[0].listener({ preventDefault() {} });
  assert.match(authStatus.textContent, /Redirecting to Electrony Accounts/);
  assert.equal(assignments[0], accountsButton.href);
});

test("verified Bills session can sign out and reports when provider revocation is unavailable", async () => {
  const requests = [];
  const { context, accountsButton, authStatus } = createAppContext("", async (url) => {
    requests.push(url);
    if (url.endsWith("/api/auth/me")) {
      return { ok: true, json: async () => ({ ok: true, user: { id: "verified-user" }, csrfToken: "csrf" }) };
    }
    if (url.endsWith("/api/customer/transactions")) {
      return { ok: true, json: async () => ({ ok: true, transactions: [] }) };
    }
    if (url.endsWith("/api/auth/logout")) {
      return { ok: true, json: async () => ({ ok: true, signedOut: true, providerRevoked: false }) };
    }
    throw new Error(`Unexpected Bills API request: ${url}`);
  }, true);

  await context.initializeIdentitySignIn();
  assert.equal(accountsButton.textContent, "Sign out of Electrony Accounts");
  const clickHandler = accountsButton.listeners.at(-1).listener;
  await clickHandler({ preventDefault() {} });

  assert.equal(accountsButton.textContent, "Sign in with Electrony Accounts");
  assert.match(authStatus.textContent, /Signed out on this device/);
  await clickHandler({ preventDefault() {} });
  assert.equal(requests.length, 3);
});
