const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const appSource = fs.readFileSync(path.join(__dirname, "bills-app.js"), "utf8");

function createAppContext(search = "?service=virtual-cards") {
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
      return null;
    },
    createElement() {
      return { innerHTML: "" };
    },
    querySelectorAll() {
      return [];
    }
  };
  const window = {
    ElectronyConfig: { billsApiBaseUrl: "https://bills-api.example.test" },
    location: {
      href: `https://example.test/bills/app/${search}`,
      protocol: "https:",
      search
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
    serviceList
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
