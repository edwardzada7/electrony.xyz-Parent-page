const serviceCatalog = {
  electricity: {
    id: "electricity",
    label: "Electricity",
    icon: "↯",
    title: "Electricity purchase",
    helper: "Verified meter details and secure token vending.",
    amountLabel: "Amount",
    fields: [
      { id: "disco", type: "select", label: "Distribution company", options: [
        { value: "ikeja", label: "Ikeja Electric" },
        { value: "eko", label: "Eko Electricity" },
        { value: "abuja", label: "Abuja Disco" },
        { value: "phcn", label: "Port Harcourt Electricity" }
      ] },
      { id: "meterType", type: "select", label: "Meter type", options: [
        { value: "prepaid", label: "Prepaid" },
        { value: "postpaid", label: "Postpaid" }
      ] },
      { id: "meterNumber", type: "text", label: "Meter number" },
      { id: "phone", type: "tel", label: "Customer phone number" },
      { id: "amount", type: "number", label: "Amount (₦)" }
    ]
  },
  airtime: {
    id: "airtime",
    label: "Airtime",
    icon: "∿",
    title: "Airtime top-up",
    helper: "Select a network, enter the phone number and confirm the value.",
    amountLabel: "Top-up amount",
    fields: [
      { id: "network", type: "select", label: "Network", options: [
        { value: "mtn", label: "MTN" },
        { value: "airtel", label: "Airtel" },
        { value: "glo", label: "Glo" },
        { value: "9mobile", label: "9mobile" }
      ] },
      { id: "recipient", type: "tel", label: "Recipient phone number" },
      { id: "amount", type: "number", label: "Amount (₦)" }
    ]
  },
  data: {
    id: "data",
    label: "Data",
    icon: "⌁",
    title: "Data purchase",
    helper: "Choose a provider and data bundle before checkout.",
    amountLabel: "Bundle price",
    fields: [
      { id: "network", type: "select", label: "Network", options: [
        { value: "mtn", label: "MTN" },
        { value: "airtel", label: "Airtel" },
        { value: "glo", label: "Glo" },
        { value: "9mobile", label: "9mobile" }
      ] },
      { id: "recipient", type: "tel", label: "Phone number" },
      { id: "plan", type: "select", label: "Available plan", options: [
        { value: "", label: "Select a plan" }
      ] }
    ]
  },
  bills: {
    id: "bills",
    label: "Pay Bills",
    icon: "▤",
    title: "TV and utility bills",
    helper: "Pay supported subscriptions without creating an account.",
    amountLabel: "Package price",
    fields: [
      { id: "biller", type: "select", label: "Biller", options: [
        { value: "dstv", label: "DSTV" },
        { value: "gotv", label: "GoTV" },
        { value: "startimes", label: "Startimes" }
      ] },
      { id: "customerId", type: "text", label: "Smart card or decoder number" },
      { id: "plan", type: "select", label: "Package", options: [
        { value: "compact", label: "Compact — ₦9,000" },
        { value: "compact-plus", label: "Compact Plus — ₦15,000" },
        { value: "premium", label: "Premium — ₦19,000" }
      ] }
    ]
  },
  "virtual-cards": {
    id: "virtual-cards",
    label: "Virtual Cards",
    icon: "▣",
    title: "Virtual Cards",
    helper: "Explore provider-supported virtual-card options and eligibility.",
    digitalService: true
  },
  "gift-cards": {
    id: "gift-cards",
    label: "Gift Cards",
    icon: "◇",
    title: "Gift Cards",
    helper: "Explore gift cards and supported denominations from a configured provider.",
    digitalService: true
  }
};

const state = {
  activeService: Object.prototype.hasOwnProperty.call(serviceCatalog, new URLSearchParams(window.location.search).get("service"))
    ? new URLSearchParams(window.location.search).get("service")
    : "electricity",
  order: null,
  transactions: [],
  authToken: "",
  user: null,
  authMode: "login",
  feeQuote: null,
  feeRequestId: 0
};

const formatCurrency = (value) => new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0
}).format(Number(value || 0));

const formatMinorCurrency = (minor, currency = "NGN") => new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
}).format(Number(minor || 0) / 100);

const generateReference = () => {
  const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `ELECBILLS-${dateStamp}-${suffix}`;
};

const getBillsApiBaseUrl = () => {
  const baseUrl = (window.ElectronyConfig && window.ElectronyConfig.billsApiBaseUrl) || "http://localhost:4174";
  return String(baseUrl).replace(/\/$/, "");
};

const fetchBillingApi = async (path, options = {}) => {
  const response = await fetch(`${getBillsApiBaseUrl()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(state.authToken ? { Authorization: `Bearer ${state.authToken}` } : {}),
      ...(options.headers || {})
    }
  });

  const rawText = await response.text();
  let payload = {};

  if (rawText) {
    try {
      payload = JSON.parse(rawText);
    } catch (error) {
      payload = { raw: rawText };
    }
  }

  if (!response.ok) {
    throw new Error(payload.error || payload.message || `Billing API request failed with status ${response.status}.`);
  }

  return payload;
};

const normalizePhone = (value) => String(value || "").replace(/\s+/g, "").trim();

function validatePhone(value) {
  const number = normalizePhone(value);
  return /^(\+234|234|0)[789][01]\d{8}$/.test(number);
}

function validateMeter(value) {
  const meter = String(value || "").trim();
  return meter.length >= 6 && meter.length <= 14 && /^\d+$/.test(meter);
}

function renderServiceList() {
  const list = document.querySelector("#service-list");
  if (!list) return;

  list.innerHTML = "";

  Object.values(serviceCatalog).forEach((service) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <button type="button" class="service-button ${state.activeService === service.id ? "is-active" : ""}" data-service="${service.id}">
        <span class="service-icon" aria-hidden="true">${service.icon}</span>
        <span class="service-label">${service.label}</span>
      </button>
    `;
    list.appendChild(item);
  });

  list.querySelectorAll(".service-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeService = button.dataset.service;
      state.order = null;
      state.feeQuote = null;
      renderServiceList();
      renderServicePanel();
      renderCheckoutPanel();
    });
  });
}

function getDataPlans(network) {
  const catalog = {
    mtn: [
      { value: "mtn-1gb", label: "MTN 1GB — 1 day — ₦130", price: 130 },
      { value: "mtn-5gb", label: "MTN 5GB — 7 days — ₦650", price: 650 },
      { value: "mtn-20gb", label: "MTN 20GB — 30 days — ₦2,800", price: 2800 }
    ],
    airtel: [
      { value: "airtel-1gb", label: "Airtel 1GB — 1 day — ₦150", price: 150 },
      { value: "airtel-10gb", label: "Airtel 10GB — 30 days — ₦1,650", price: 1650 }
    ],
    glo: [
      { value: "glo-1gb", label: "Glo 1GB — 1 day — ₦110", price: 110 },
      { value: "glo-10gb", label: "Glo 10GB — 30 days — ₦1,450", price: 1450 }
    ],
    "9mobile": [
      { value: "9m-2gb", label: "9mobile 2GB — 14 days — ₦630", price: 630 },
      { value: "9m-15gb", label: "9mobile 15GB — 30 days — ₦2,200", price: 2200 }
    ]
  };

  return catalog[network] || [];
}

function populatePlanOptions(service, network) {
  if (service !== "data") return;

  const select = document.querySelector("#plan");
  if (!select) return;

  const plans = getDataPlans(network);
  select.innerHTML = plans.length
    ? plans.map((plan) => `<option value="${plan.value}">${plan.label}</option>`).join("")
    : '<option value="">No data plans available for this network</option>';
}

function renderServicePanel() {
  const panel = document.querySelector("#service-panel");
  if (!panel) return;

  const service = serviceCatalog[state.activeService];
  if (service.digitalService) {
    renderDigitalServicePanel(service);
    return;
  }
  const isDataService = state.activeService === "data";
  const amountField = service.fields.filter((field) => field.id === "amount").length ? "amount" : "plan";

  const fieldMarkup = service.fields.map((field) => {
    if (field.type === "select") {
      const options = field.options.map((option) => `<option value="${option.value}">${option.label}</option>`).join("");
      return `
        <label class="field">
          <span>${field.label}</span>
          <select id="${field.id}" name="${field.id}" ${field.id === "plan" && isDataService ? "data-plan-select" : ""}>
            ${options}
          </select>
        </label>
      `;
    }

    return `
      <label class="field">
        <span>${field.label}</span>
        <input id="${field.id}" name="${field.id}" type="${field.type}" placeholder="${field.label}" ${field.type === "number" ? "min=1" : ""}>
      </label>
    `;
  }).join("");

  panel.innerHTML = `
    <div class="service-panel-header">
      <div>
        <p class="eyebrow eyebrow-soft">Service</p>
        <h3>${service.title}</h3>
      </div>
      <span class="service-tag">${service.icon} ${service.label}</span>
    </div>
    <p class="service-helper">${service.helper}</p>
    <form id="purchase-form" novalidate>
      <div class="field-grid">
        ${fieldMarkup}
      </div>
      <div class="fee-preview" id="fee-preview" aria-live="polite">Enter an amount or select a service option to see the platform fee breakdown.</div>
      <div class="form-actions">
        <button class="primary-button" type="submit">Review order</button>
      </div>
    </form>
  `;

  if (state.activeService === "data") {
    const networkSelect = document.querySelector("#network");
    networkSelect.addEventListener("change", (event) => {
      populatePlanOptions("data", event.target.value);
    });
    populatePlanOptions("data", networkSelect.value || "mtn");
  }

  const form = panel.querySelector("#purchase-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    void handlePurchaseSubmission();
  });

  form.addEventListener("input", () => void refreshFeePreview());
  form.addEventListener("change", () => void refreshFeePreview());

  const focusTarget = panel.querySelector("#meterNumber, #recipient, #customerId, #biller, #network");
  if (focusTarget) focusTarget.focus();

  if (amountField === "plan" && state.activeService === "data") {
    const planSelect = document.querySelector("#plan");
    if (planSelect) {
      planSelect.addEventListener("change", () => {
        form.classList.add("has-plan");
      });
    }
  }
}

function renderDigitalServicePanel(service) {
  const panel = document.querySelector("#service-panel");
      const endpoint = service.id === "virtual-cards"
        ? "/api/services/virtual-cards/catalog"
        : "/api/services/gift-cards/catalog";
      const authControls = state.user
        ? `<p class="account-status">Signed in as <strong>${escapeHtml(state.user.email)}</strong>.</p>
           <button type="button" class="secondary-button" id="sign-out-button">Sign out</button>`
        : `<div class="account-panel">
            <p class="eyebrow eyebrow-soft">Account required to purchase</p>
            <div class="account-mode-actions">
              <button type="button" class="secondary-button" data-auth-mode="login">Sign in</button>
              <button type="button" class="secondary-button" data-auth-mode="register">Create account</button>
            </div>
            <form id="account-form" class="account-form">
              ${state.authMode === "register" ? '<label class="field"><span>Name</span><input name="name" autocomplete="name" required maxlength="100"></label>' : ""}
              <label class="field"><span>Email</span><input name="email" type="email" autocomplete="email" required></label>
              <label class="field"><span>Password</span><input name="password" type="password" autocomplete="${state.authMode === "register" ? "new-password" : "current-password"}" minlength="12" maxlength="128" required></label>
              <p class="subtle-copy">Use at least 12 characters. Your password is sent only to the Bills API over HTTPS in production and is never stored in this browser.</p>
              <button class="primary-button" type="submit">${state.authMode === "register" ? "Create account" : "Sign in"}</button>
              <p class="inline-message hidden" id="account-message" role="status"></p>
            </form>
          </div>`;

      panel.innerHTML = `
        <div class="service-panel-header">
          <div><p class="eyebrow eyebrow-soft">Explore service</p><h3>${service.title}</h3></div>
          <span class="service-tag">${service.icon} ${service.label}</span>
        </div>
        <p class="service-helper">${service.helper}</p>
        <div class="service-fee-note">${service.id === "virtual-cards"
          ? "Virtual-card products are intended to be USD-denominated. No fixed ₦100 bill fee or currency conversion applies. Provider products and fees are not configured."
          : "Electrony platform fee: ₦0. Gift-card products, prices, denominations, currencies, and any provider charges are not available until a provider is configured."}</div>
        <div class="catalog-state" id="catalog-state" role="status">Checking configured provider catalogue…</div>
        ${service.id === "virtual-cards" ? '<div class="eligibility-state" id="eligibility-state"></div>' : ""}
        ${authControls}
      `;

      panel.querySelectorAll("[data-auth-mode]").forEach((button) => {
        button.addEventListener("click", () => {
          state.authMode = button.dataset.authMode;
          renderServicePanel();
        });
      });
      panel.querySelector("#sign-out-button")?.addEventListener("click", () => {
        state.authToken = "";
        state.user = null;
        const status = document.querySelector(".status-pill");
        if (status) status.textContent = "Guest checkout";
        renderServicePanel();
      });
      panel.querySelector("#account-form")?.addEventListener("submit", (event) => {
        event.preventDefault();
        void submitAccountForm(event.currentTarget);
      });

      fetchBillingApi(endpoint).then((result) => {
        if (state.activeService !== service.id) return;
        const status = panel.querySelector("#catalog-state");
        if (status) status.textContent = result.message || "Catalogue unavailable.";
      }).catch((error) => {
        const status = panel.querySelector("#catalog-state");
        if (status) status.textContent = `Catalogue status unavailable: ${error.message}`;
      });

      if (service.id === "virtual-cards" && state.user) {
        fetchBillingApi("/api/services/virtual-cards/eligibility").then((result) => {
          const eligibility = panel.querySelector("#eligibility-state");
          if (eligibility) eligibility.textContent = result.status
            ? `Verification status: ${result.status}.`
            : "Verification status unavailable.";
        }).catch((error) => {
          const eligibility = panel.querySelector("#eligibility-state");
          if (eligibility) eligibility.textContent = error.message;
        });
      }
    }

    async function submitAccountForm(form) {
      const payload = Object.fromEntries(new FormData(form).entries());
      const message = form.querySelector("#account-message");
      const endpoint = state.authMode === "register" ? "/api/auth/register" : "/api/auth/login";
      try {
        const result = await fetchBillingApi(endpoint, {
          method: "POST",
          body: JSON.stringify(payload)
        });
        state.authToken = result.token;
        state.user = result.user;
        state.authMode = "login";
        const status = document.querySelector(".status-pill");
        if (status) status.textContent = result.user.email;
        renderServicePanel();
      } catch (error) {
        message.textContent = error.message;
        message.classList.remove("hidden");
        message.classList.add("inline-message-error");
      }
    }

    function escapeHtml(value) {
      return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      })[character]);
    }

    function feeQuoteUrl(serviceId, amount, values) {
      const query = new URLSearchParams({
        service: serviceId,
        amount: String(amount),
        network: values.network || "",
        plan: values.plan || ""
      });
      return `/api/fees/quote?${query}`;
    }

    async function refreshFeePreview() {
      const form = document.querySelector("#purchase-form");
      const preview = document.querySelector("#fee-preview");
      if (!form || !preview) return;
      const values = Object.fromEntries(new FormData(form).entries());
      const amount = resolveOrderAmount(state.activeService, values);
      if (!amount || !Number.isFinite(amount) || amount <= 0) {
        state.feeQuote = null;
        preview.textContent = "Enter an amount or select a service option to see the platform fee breakdown.";
        return;
      }

      const requestId = ++state.feeRequestId;
      preview.textContent = "Refreshing the server fee quote…";
      try {
        const result = await fetchBillingApi(feeQuoteUrl(state.activeService, amount, values));
        if (requestId !== state.feeRequestId) return;
        state.feeQuote = result;
        const quote = result.quote;
        preview.innerHTML = `
          <div><span>Service amount</span><strong>${formatMinorCurrency(quote.serviceAmountMinor, quote.currency)}</strong></div>
          <div><span>Electrony platform fee</span><strong>${formatMinorCurrency(quote.platformFeeMinor, quote.currency)}</strong></div>
          <div><span>Provider fee</span><strong>Not quoted</strong></div>
          <div class="fee-preview-total"><span>Total before any provider fee</span><strong>${formatMinorCurrency(quote.totalBeforeProviderFeesMinor, quote.currency)}</strong></div>
          <p>Payment is unavailable until the configured provider can disclose any applicable provider charge.</p>
        `;
      } catch (error) {
        if (requestId !== state.feeRequestId) return;
        state.feeQuote = null;
        preview.textContent = `Fee quote unavailable: ${error.message}`;
      }
}

function renderCheckoutPanel() {
  const panel = document.querySelector("#checkout-panel");
  if (!panel) return;

  if (!state.order) {
    panel.classList.add("hidden");
    panel.innerHTML = "";
    return;
  }

  panel.classList.remove("hidden");
  const { serviceId, summary, reference, amount, status, quote } = state.order;
  const service = serviceCatalog[serviceId];
  const paymentReady = quote.providerFeeStatus === "quoted";

  panel.innerHTML = `
    <div class="checkout-header">
      <div>
        <p class="eyebrow eyebrow-soft">Order review</p>
        <h3>${service.title}</h3>
      </div>
      <span class="status-badge ${status === "paid" ? "success" : paymentReady ? "pending" : "unavailable"}">${status === "paid" ? "Paid" : paymentReady ? "Awaiting payment" : "Provider quote required"}</span>
    </div>
    <div class="review-grid">
      ${summary.map((line) => `<div class="review-item"><span>${escapeHtml(line.label)}</span><strong>${escapeHtml(line.value)}</strong></div>`).join("")}
      <div class="review-item"><span>Service amount</span><strong>${formatMinorCurrency(quote.serviceAmountMinor, quote.currency)}</strong></div>
      <div class="review-item"><span>Electrony platform fee</span><strong>${formatMinorCurrency(quote.platformFeeMinor, quote.currency)}</strong></div>
      <div class="review-item"><span>Provider fee</span><strong>${quote.providerFeeMinor === null ? "Not quoted" : formatMinorCurrency(quote.providerFeeMinor, quote.currency)}</strong></div>
      <div class="review-item review-total"><span>Total before any unquoted provider fee</span><strong>${formatMinorCurrency(quote.totalBeforeProviderFeesMinor, quote.currency)}</strong></div>
    </div>
    ${paymentReady ? "" : '<p class="checkout-notice">Payment is unavailable until the configured service provider can disclose any applicable provider fee. No payment will be taken.</p>'}
    <div class="checkout-meta">
      <span>Reference</span>
      <strong>${escapeHtml(reference)}</strong>
    </div>
    <div class="checkout-actions">
      <button type="button" class="primary-button" id="pay-button" ${paymentReady ? "" : "disabled"}>Pay now</button>
      <button type="button" class="secondary-button" id="status-button">Check status</button>
    </div>
  `;

  document.querySelector("#pay-button").addEventListener("click", async () => {
    await completePurchase();
  });

  document.querySelector("#status-button").addEventListener("click", async () => {
    if (!state.order) return;

    try {
      const response = await fetchBillingApi(`/api/payments/status?reference=${encodeURIComponent(state.order.reference)}`);
      displayPaymentOutcome(response, response.reference || state.order.reference);
    } catch (error) {
      displayTransactionResult("Status check failed.", error.message, "error");
    }
  });
}

function parsePlanPrice(label) {
  const match = String(label || "").match(/₦\s?([\d,]+)/);
  if (!match) return 0;
  return Number(match[1].replace(/,/g, ""));
}

function resolveOrderAmount(serviceId, values) {
  if (serviceId === "electricity" || serviceId === "airtime") {
    return Number(values.amount || 0);
  }

  if (serviceId === "data") {
    const plan = getDataPlans(values.network || "mtn").find((option) => option.value === values.plan);
    return Number(plan?.price || 0);
  }

  if (serviceId === "bills") {
    const planOptions = [
      { value: "compact", label: "Compact — ₦9,000", price: 9000 },
      { value: "compact-plus", label: "Compact Plus — ₦15,000", price: 15000 },
      { value: "premium", label: "Premium — ₦19,000", price: 19000 }
    ];
    const plan = planOptions.find((option) => option.value === values.plan);
    return Number(plan?.price || parsePlanPrice(values.plan || "") || 0);
  }

  return 0;
}

function createSummaryFromForm(serviceId, values) {
  const service = serviceCatalog[serviceId];
  const lines = [];

  if (serviceId === "electricity") {
    lines.push({ label: "Company", value: values.disco?.toUpperCase() || "—" });
    lines.push({ label: "Type", value: values.meterType || "—" });
    lines.push({ label: "Meter", value: values.meterNumber || "—" });
    lines.push({ label: "Phone", value: values.phone || "—" });
  }

  if (serviceId === "airtime") {
    lines.push({ label: "Network", value: values.network || "—" });
    lines.push({ label: "Receiver", value: values.recipient || "—" });
  }

  if (serviceId === "data") {
    const plan = getDataPlans(values.network).find((option) => option.value === values.plan);
    lines.push({ label: "Network", value: values.network || "—" });
    lines.push({ label: "Receiver", value: values.recipient || "—" });
    lines.push({ label: "Plan", value: plan ? plan.label : values.plan || "Choose a plan" });
  }

  if (serviceId === "bills") {
    const packages = {
      compact: "Compact — ₦9,000",
      "compact-plus": "Compact Plus — ₦15,000",
      premium: "Premium — ₦19,000"
    };
    lines.push({ label: "Biller", value: values.biller || "—" });
    lines.push({ label: "Customer ID", value: values.customerId || "—" });
    lines.push({ label: "Package", value: packages[values.plan] || values.plan || "—" });
  }

  return lines;
}

async function handlePurchaseSubmission() {
  const service = serviceCatalog[state.activeService];
  const form = document.querySelector("#purchase-form");
  if (!form) return;

  const values = Object.fromEntries(new FormData(form).entries());

  if (state.activeService === "electricity") {
    if (!validateMeter(values.meterNumber)) {
      renderInlineMessage("Use a valid meter number before continuing.", "error");
      return;
    }
    if (!validatePhone(values.phone)) {
      renderInlineMessage("Enter a valid Nigerian mobile number for the account holder.", "error");
      return;
    }
    if (Number(values.amount) <= 0 || Number(values.amount) > 5000000) {
      renderInlineMessage("Enter a valid electricity amount between ₦1 and ₦5,000,000.", "error");
      return;
    }
  }

  if (state.activeService === "airtime") {
    if (!validatePhone(values.recipient)) {
      renderInlineMessage("Enter a valid Nigerian mobile number for the recipient.", "error");
      return;
    }
    if (Number(values.amount) <= 0 || Number(values.amount) > 500000) {
      renderInlineMessage("Enter a valid airtime amount between ₦1 and ₦500,000.", "error");
      return;
    }
  }

  if (state.activeService === "data") {
    if (!validatePhone(values.recipient)) {
      renderInlineMessage("Enter a valid phone number for the data bundle.", "error");
      return;
    }
    if (!values.plan || values.plan === "") {
      renderInlineMessage("Select a valid data bundle before continuing.", "error");
      return;
    }
  }

  if (state.activeService === "bills") {
    if (!values.customerId || values.customerId.trim().length < 4) {
      renderInlineMessage("Enter a valid smart card or decoder number.", "error");
      return;
    }
    if (!values.plan) {
      renderInlineMessage("Select a supported package before continuing.", "error");
      return;
    }
  }

  const amount = resolveOrderAmount(state.activeService, values);
  let feeQuote;
  try {
    feeQuote = await fetchBillingApi(feeQuoteUrl(state.activeService, amount, values));
  } catch (error) {
    renderInlineMessage(`Unable to confirm the latest fee breakdown: ${error.message}`, "error");
    return;
  }
  if (feeQuote.quote.providerFeeStatus !== "quoted") {
    renderInlineMessage("The provider has not supplied a complete fee quote. Review the breakdown, but checkout is not available.", "error");
  }

  state.order = {
    serviceId: state.activeService,
    reference: generateReference(),
    amount,
    status: "pending",
    quote: feeQuote.quote,
    quoteToken: feeQuote.quoteToken,
    summary: createSummaryFromForm(state.activeService, values),
    customer: {
      name: "Electrony Bills Customer",
      email: "guest@electrony.com",
      phone: values.phone || values.recipient || "",
      meterNumber: values.meterNumber || "",
      meterType: values.meterType || "prepaid",
      disco: values.disco || "",
      network: values.network || "",
      recipient: values.recipient || "",
      customerId: values.customerId || "",
      biller: values.biller || "",
      plan: values.plan || ""
    }
  };

  renderCheckoutPanel();
  renderInlineMessage("Order review ready. Confirm payment to complete the purchase.", "success");
}

function renderInlineMessage(message, type = "info") {
  const panel = document.querySelector("#service-panel");
  if (!panel) return;

  const existing = panel.querySelector(".inline-message");
  if (existing) existing.remove();

  const wrapper = document.createElement("p");
  wrapper.className = `inline-message inline-message-${type}`;
  wrapper.textContent = message;
  panel.querySelector("#purchase-form").appendChild(wrapper);
}

async function completePurchase() {
  if (!state.order) return;

  const payButton = document.querySelector("#pay-button");
  if (payButton) {
    payButton.disabled = true;
    payButton.textContent = "Processing...";
  }

  try {
    const response = await fetchBillingApi("/api/payments/session", {
      method: "POST",
      body: JSON.stringify({
        service: state.order.serviceId,
        reference: state.order.reference,
        amount: state.order.amount,
        totalAmount: state.order.quote.totalBeforeProviderFeesMinor / 100,
        quoteToken: state.order.quoteToken,
        ...state.order.customer
      })
    });

    if (!response || response.ok === false) {
      throw new Error(response?.error || "Unable to create the payment session.");
    }

    state.order.status = response.status || "payment_pending";
    renderCheckoutPanel();

    if (response.checkoutUrl) {
      displayTransactionResult("Redirecting to Monnify checkout.", "Secure payment session created. Redirecting to the payment provider.", "pending");
      window.location.href = response.checkoutUrl;
      return;
    }

    displayTransactionResult("Payment session created.", "Awaiting payment confirmation from the billing backend.", "pending");
  } catch (error) {
    displayTransactionResult("Payment setup failed.", error.message, "error");
  } finally {
    if (payButton) {
      payButton.disabled = false;
      payButton.textContent = "Pay now";
    }
  }
}

async function verifyReturnedPayment() {
  const params = new URLSearchParams(window.location.search);
  const paymentState = params.get("payment");
  const reference = params.get("reference") || params.get("transactionReference") || params.get("paymentReference") || params.get("monnifyReference");

  if (!paymentState && !reference) return;

  const statusMessage = reference
    ? `Verifying payment for ${reference}.`
    : "Your payment was received and is being verified.";

  displayTransactionResult("Payment received.", statusMessage, "pending");

  if (!reference) return;

  try {
    const response = await fetchBillingApi("/api/payments/verify", {
      method: "POST",
      body: JSON.stringify({ reference })
    });
    displayPaymentOutcome(response, response.reference || reference);
  } catch (error) {
    displayTransactionResult("Payment verification is pending.", `Reference: ${reference}. Please check status again shortly.`, "pending");
  }
}

function displayPaymentOutcome(response, reference) {
  const status = String(response.status || "").toLowerCase();
  const paymentStatus = String(response.paymentStatus || "").toLowerCase();
  const fulfillmentStatus = String(response.fulfillmentStatus || "").toLowerCase();

  if (status === "success" || fulfillmentStatus === "success") {
    displayTransactionResult("Payment successful.", `Reference: ${reference}. Your service was confirmed.`, "success");
    return;
  }

  if (paymentStatus === "payment_success" || status === "paid" || status === "payment_success") {
    const deliveryFailed = ["failed", "vending_failed"].includes(status)
      || ["failed", "vending_failed"].includes(fulfillmentStatus);
    displayTransactionResult(
      deliveryFailed ? "Payment confirmed; service delivery needs attention." : "Payment confirmed.",
      deliveryFailed
        ? `Reference: ${reference}. Your payment was received, but service delivery was not confirmed.`
        : `Reference: ${reference}. Your service is still being processed.`,
      deliveryFailed ? "error" : "pending"
    );
    return;
  }

  if (["payment_failed", "failed", "cancelled", "canceled"].includes(status)
    || paymentStatus === "payment_failed") {
    displayTransactionResult("Payment could not be confirmed.", `Reference: ${reference}. Please review your payment or try again.`, "error");
    return;
  }

  displayTransactionResult("Payment status is pending.", `Reference: ${reference}. Please check status again shortly.`, "pending");
}

function displayTransactionResult(message, details, status) {
  const panel = document.querySelector("#checkout-panel");
  if (!panel) return;

  panel.classList.remove("hidden");
  const resultCard = document.createElement("div");
  resultCard.className = `result-card result-card-${status}`;
  const label = document.createElement("p");
  label.className = "result-label";
  label.textContent = "Transaction result";
  const heading = document.createElement("h4");
  heading.textContent = message;
  const detail = document.createElement("p");
  detail.textContent = details;
  resultCard.append(label, heading, detail);

  const previous = panel.querySelector(".result-card");
  if (previous) previous.remove();
  panel.appendChild(resultCard);
}

document.addEventListener("DOMContentLoaded", () => {
  renderServiceList();
  renderServicePanel();
  renderCheckoutPanel();
  verifyReturnedPayment();
});
