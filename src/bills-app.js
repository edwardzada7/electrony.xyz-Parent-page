const BILL_PAYMENT_OPERATIONS_ENABLED = false;

const serviceCatalog = {
  electricity: {
    id: "electricity",
    label: "Electricity",
    icon: "↯",
    title: "Electricity purchase",
    helper: "Electricity products will appear when the Monnify Bills catalogue is verified."
  },
  airtime: {
    id: "airtime",
    label: "Airtime",
    icon: "∿",
    title: "Airtime top-up",
    helper: "Airtime networks will appear when the Monnify Bills catalogue is verified."
  },
  data: {
    id: "data",
    label: "Data",
    icon: "⌁",
    title: "Data purchase",
    helper: "Data providers and plans will appear when the Monnify Bills catalogue is verified."
  },
  bills: {
    id: "bills",
    label: "Pay Bills",
    icon: "▤",
    title: "TV and utility bills",
    helper: "Supported billers and products will appear when the Monnify Bills catalogue is verified."
  }
};

const state = {
  activeService: Object.prototype.hasOwnProperty.call(serviceCatalog, new URLSearchParams(window.location.search).get("service"))
    ? new URLSearchParams(window.location.search).get("service")
    : "electricity",
  order: null,
  catalogue: null,
  catalogueError: "",
  catalogueLoading: false,
  selectedBillers: {},
  transactions: [],
  authToken: "",
  user: null,
  authMode: "login",
  feeQuote: null,
  feeQuotePending: null,
  feeRequestId: 0
};

try {
  const legacyGuestSecretPrefix = "electrony-bills-guest-order:";
  for (let index = window.sessionStorage.length - 1; index >= 0; index -= 1) {
    const key = window.sessionStorage.key(index);
    if (key?.startsWith(legacyGuestSecretPrefix)) {
      window.sessionStorage.removeItem(key);
    }
  }
} catch {
  console.error("Bills could not clear a legacy guest authorization from browser storage.");
}

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
  const configuredUrl = window.ElectronyConfig?.billsApiBaseUrl;
  if (typeof configuredUrl !== "string" || !configuredUrl.trim()) {
    throw new Error("The Bills API URL is not configured.");
  }

  let apiUrl;
  try {
    apiUrl = new URL(configuredUrl.trim(), window.location.href);
  } catch (error) {
    throw new Error("The configured Bills API URL is invalid.");
  }

  if (apiUrl.protocol !== "http:" && apiUrl.protocol !== "https:") {
    throw new Error("The configured Bills API URL must use HTTP or HTTPS.");
  }
  if (window.location.protocol === "https:" && apiUrl.protocol !== "https:") {
    throw new Error("The Bills API must use HTTPS on this secure page.");
  }

  return apiUrl.href.replace(/\/+$/, "");
};

const fetchBillingApi = async (path, options = {}) => {
  const baseUrl = getBillsApiBaseUrl();
  const response = await fetch(`${baseUrl}/${String(path).replace(/^\/+/, "")}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(state.authToken ? { Authorization: `Bearer ${state.authToken}` } : {}),
      ...(options.headers || {})
    }
  });

  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    throw new Error(`Billing API returned invalid JSON (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    const error = new Error(payload.error || payload.message || `Billing API request failed with status ${response.status}.`);
    error.apiResponse = payload;
    throw error;
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
      state.feeQuotePending = null;
      state.feeRequestId += 1;
      renderServiceList();
      renderServicePanel();
      renderCheckoutPanel();
    });
  });
}

function renderServicePanel() {
  const panel = document.querySelector("#service-panel");
  if (!panel) return;

  const service = serviceCatalog[state.activeService];
  const category = state.catalogue?.categories?.[service.id];
  const billers = Array.isArray(category?.billers) ? category.billers : [];
  const available = category?.available === true && billers.length > 0;
  const statusMessage = state.catalogueLoading
    ? "Loading the Monnify Bills catalogue…"
    : state.catalogueError
      ? `Catalogue unavailable: ${state.catalogueError}`
      : category?.available === true && billers.length === 0
        ? "No billers are currently listed for this service."
        : category?.message || "No verified biller catalogue is available. No billers are shown.";

  panel.innerHTML = `
    <div class="service-panel-header">
      <div>
        <p class="eyebrow eyebrow-soft">Service</p>
        <h3>${service.title}</h3>
      </div>
      <span class="service-tag">${service.icon} ${service.label}</span>
    </div>
    <p class="service-helper">${service.helper}</p>
    <div class="catalog-state" role="status" aria-live="polite">${escapeHtml(statusMessage)}</div>
    ${available ? `
      <label class="field">
        <span>Available billers</span>
        <select id="biller-code" name="billerCode">
          ${billers.map((biller) => `
            <option value="${escapeHtml(biller.code)}">${escapeHtml(biller.name)} (${escapeHtml(biller.code)})</option>
          `).join("")}
        </select>
      </label>
      <p class="checkout-notice">Biller selection is available for review only. Payments and vending remain disabled until their contracts are verified.</p>
    ` : ""}
    <button class="secondary-button" type="button" id="catalogue-retry" ${state.catalogueLoading ? "disabled" : ""}>${state.catalogueLoading ? "Loading…" : "Retry catalogue"}</button>
  `;

  const billerSelect = panel.querySelector("#biller-code");
  if (billerSelect) {
    billerSelect.value = state.selectedBillers[service.id] || billers[0].code;
    billerSelect.addEventListener("change", () => {
      state.selectedBillers[service.id] = billerSelect.value;
    });
  }
  panel.querySelector("#catalogue-retry")?.addEventListener("click", () => {
    void loadServiceCatalogue();
  });
}

async function loadServiceCatalogue() {
  state.catalogueLoading = true;
  state.catalogueError = "";
  state.catalogue = null;
  renderServicePanel();

  try {
    const result = await fetchBillingApi("/api/services/catalog", {
      signal: AbortSignal.timeout(12000)
    });
    if (!result || typeof result.categories !== "object" || result.categories === null) {
      throw new Error("Billing API returned an invalid catalogue.");
    }
    Object.values(serviceCatalog).forEach((service) => {
      const category = result.categories[service.id];
      if (!category
        || !Array.isArray(category.billers)
        || !Array.isArray(category.products)
        || category.billers.some((biller) => typeof biller?.code !== "string"
          || !biller.code
          || typeof biller.name !== "string"
          || !biller.name)) {
        throw new Error("Billing API returned an invalid biller catalogue.");
      }
    });
    state.catalogue = result;
  } catch (error) {
    state.catalogueError = error.name === "TimeoutError"
      ? "The Bills catalogue request timed out."
      : error.message;
  } finally {
    state.catalogueLoading = false;
    renderServicePanel();
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

    function feeQuoteRequestKey(serviceId, amount, values) {
      return JSON.stringify({
        service: serviceId,
        amount: String(amount),
        network: serviceId === "data" ? values.network || "" : "",
        plan: serviceId === "data" || serviceId === "bills" ? values.plan || "" : ""
      });
    }

    function validateFeeQuoteResponse(result, serviceId, amount) {
      const quote = result?.quote;
      const expectedAmountMinor = Math.round(amount * 100);
      if (result?.ok !== true
        || typeof result.quoteToken !== "string"
        || !result.quoteToken
        || !quote
        || quote.service !== serviceId
        || quote.currency !== "NGN"
        || quote.serviceAmountMinor !== expectedAmountMinor
        || !Number.isSafeInteger(quote.platformFeeMinor)
        || quote.platformFeeMinor < 0
        || quote.totalBeforeProviderFeesMinor !== quote.serviceAmountMinor + quote.platformFeeMinor
        || !["not_quoted", "quoted"].includes(quote.providerFeeStatus)
        || (quote.providerFeeStatus === "quoted"
          && (!Number.isSafeInteger(quote.providerFeeMinor) || quote.providerFeeMinor < 0))) {
        throw new Error("Billing API returned an invalid fee quote.");
      }
      return result;
    }

    async function requestFeeQuote(serviceId, amount, values) {
      const requestKey = feeQuoteRequestKey(serviceId, amount, values);
      const quoteIsFresh = state.feeQuote?.requestKey === requestKey
        && Date.now() - state.feeQuote.fetchedAt < 4 * 60 * 1000;
      if (quoteIsFresh) return state.feeQuote;
      if (state.feeQuotePending?.requestKey === requestKey) {
        return state.feeQuotePending.promise;
      }

      const requestId = ++state.feeRequestId;
      const request = fetchBillingApi(feeQuoteUrl(serviceId, amount, values))
        .then((result) => validateFeeQuoteResponse(result, serviceId, amount))
        .then((result) => {
          if (requestId === state.feeRequestId) {
            state.feeQuote = {
              ...result,
              requestKey,
              fetchedAt: Date.now()
            };
          }
          return result;
        })
        .catch((error) => {
          if (requestId === state.feeRequestId) state.feeQuote = null;
          throw error;
        })
        .finally(() => {
          if (state.feeQuotePending?.requestKey === requestKey) {
            state.feeQuotePending = null;
          }
        });

      state.feeQuote = null;
      state.feeQuotePending = { requestKey, promise: request };
      return request;
    }

    async function refreshFeePreview() {
      const form = document.querySelector("#purchase-form");
      const preview = document.querySelector("#fee-preview");
      if (!form || !preview) return;
      const values = Object.fromEntries(new FormData(form).entries());
      const amount = resolveOrderAmount(state.activeService, values);
      if (!amount || !Number.isFinite(amount) || amount <= 0) {
        state.feeRequestId += 1;
        state.feeQuote = null;
        state.feeQuotePending = null;
        preview.textContent = "Enter an amount or select a service option to see the platform fee breakdown.";
        return;
      }

      const requestKey = feeQuoteRequestKey(state.activeService, amount, values);
      if (state.feeQuote?.requestKey === requestKey) return;
      preview.textContent = "Refreshing the server fee quote…";
      try {
        const result = await requestFeeQuote(state.activeService, amount, values);
        if (requestKey !== feeQuoteRequestKey(state.activeService, amount, values)) return;
        const quote = result.quote;
        preview.innerHTML = `
          <div><span>Service amount</span><strong>${formatMinorCurrency(quote.serviceAmountMinor, quote.currency)}</strong></div>
          <div><span>Electrony platform fee</span><strong>${formatMinorCurrency(quote.platformFeeMinor, quote.currency)}</strong></div>
          <div><span>Provider fee</span><strong>Not quoted</strong></div>
          <div class="fee-preview-total"><span>Total before any provider fee</span><strong>${formatMinorCurrency(quote.totalBeforeProviderFeesMinor, quote.currency)}</strong></div>
          <p>Payment is unavailable until the configured provider can disclose any applicable provider charge.</p>
        `;
      } catch (error) {
        if (requestKey !== feeQuoteRequestKey(state.activeService, amount, values)) return;
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
  const paymentReady = BILL_PAYMENT_OPERATIONS_ENABLED && quote.providerFeeStatus === "quoted";

  panel.innerHTML = `
    <div class="checkout-header">
      <div>
        <p class="eyebrow eyebrow-soft">Order review</p>
        <h3>${service.title}</h3>
      </div>
      <span class="status-badge ${status === "paid" ? "success" : paymentReady ? "pending" : "unavailable"}">${status === "paid" ? "Paid" : paymentReady ? "Awaiting payment" : BILL_PAYMENT_OPERATIONS_ENABLED ? "Provider quote required" : "Payments disabled"}</span>
    </div>
    <div class="review-grid">
      ${summary.map((line) => `<div class="review-item"><span>${escapeHtml(line.label)}</span><strong>${escapeHtml(line.value)}</strong></div>`).join("")}
      <div class="review-item"><span>Service amount</span><strong>${formatMinorCurrency(quote.serviceAmountMinor, quote.currency)}</strong></div>
      <div class="review-item"><span>Electrony platform fee</span><strong>${formatMinorCurrency(quote.platformFeeMinor, quote.currency)}</strong></div>
      <div class="review-item"><span>Provider fee</span><strong>${quote.providerFeeMinor === null ? "Not quoted" : formatMinorCurrency(quote.providerFeeMinor, quote.currency)}</strong></div>
      <div class="review-item review-total"><span>Total before any unquoted provider fee</span><strong>${formatMinorCurrency(quote.totalBeforeProviderFeesMinor, quote.currency)}</strong></div>
    </div>
    ${paymentReady ? "" : `<p class="checkout-notice">${BILL_PAYMENT_OPERATIONS_ENABLED ? "Payment is unavailable until the configured service provider can disclose any applicable provider fee. No payment will be taken." : "Payment remains disabled until database authorization, payment verification, and provider readiness are verified. No payment will be taken."}</p>`}
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

function resolveOrderAmount(serviceId, values) {
  if (serviceId === "electricity" || serviceId === "airtime") {
    return Number(values.amount || 0);
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
    lines.push({ label: "Network", value: values.network || "—" });
    lines.push({ label: "Receiver", value: values.recipient || "—" });
    lines.push({ label: "Plan", value: values.plan || "—" });
  }

  if (serviceId === "bills") {
    lines.push({ label: "Biller", value: values.biller || "—" });
    lines.push({ label: "Customer ID", value: values.customerId || "—" });
    lines.push({ label: "Package", value: values.plan || "—" });
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
  const serviceId = state.activeService;
  const requestKey = feeQuoteRequestKey(serviceId, amount, values);
  let feeQuote;
  try {
    feeQuote = await requestFeeQuote(serviceId, amount, values);
  } catch (error) {
    renderInlineMessage(`Unable to confirm the latest fee breakdown: ${error.message}`, "error");
    return;
  }
  const currentForm = document.querySelector("#purchase-form");
  const currentValues = currentForm ? Object.fromEntries(new FormData(currentForm).entries()) : {};
  if (state.activeService !== serviceId
    || requestKey !== feeQuoteRequestKey(state.activeService, resolveOrderAmount(state.activeService, currentValues), currentValues)) {
    renderInlineMessage("The order details changed while the fee quote was loading. Review the updated breakdown before continuing.", "error");
    return;
  }
  state.order = {
    serviceId,
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
      meterType: values.meterType || "",
      disco: values.disco || "",
      network: values.network || "",
      recipient: values.recipient || "",
      customerId: values.customerId || "",
      biller: values.biller || "",
      plan: values.plan || ""
    }
  };

  renderCheckoutPanel();
  const paymentReady = BILL_PAYMENT_OPERATIONS_ENABLED && feeQuote.quote.providerFeeStatus === "quoted";
  renderInlineMessage(
    paymentReady
      ? "Order review ready. Confirm payment to continue."
      : BILL_PAYMENT_OPERATIONS_ENABLED
        ? "Order review is available, but payment is blocked until the provider supplies a complete fee quote."
        : "Order review is available, but payment remains disabled until database authorization, payment verification, and provider readiness are verified.",
    paymentReady ? "success" : "error"
  );
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
  if (!BILL_PAYMENT_OPERATIONS_ENABLED) {
    displayTransactionResult("Payment unavailable.", "Payment remains disabled until database authorization, payment verification, and provider readiness are verified.", "error");
    return;
  }
  if (state.order.quote.providerFeeStatus !== "quoted") {
    displayTransactionResult("Payment unavailable.", "The vending provider has not supplied a verified fee quote. No payment was created.", "error");
    return;
  }

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

  if (!reference) {
    displayTransactionResult("Payment not verified.", "No transaction reference was returned. The billing backend cannot confirm payment, and no bill was fulfilled.", "error");
    return;
  }

  try {
    displayTransactionResult("Verifying payment.", `Checking reference ${reference} with the billing backend.`, "pending");
    const response = await fetchBillingApi("/api/payments/verify", {
      method: "POST",
      body: JSON.stringify({ reference })
    });
    displayPaymentOutcome(response, response.reference || reference);
  } catch (error) {
    displayTransactionResult("Payment not verified.", `Reference: ${reference}. The backend did not confirm payment, so no bill is considered fulfilled. ${error.message}`, "error");
  }
}

function displayPaymentOutcome(response, reference) {
  const status = String(response.status || "").toLowerCase();
  const paymentStatus = String(response.paymentStatus || "").toLowerCase();
  const fulfillmentStatus = String(response.fulfillmentStatus || "").toLowerCase();

  if (response.verified === true && paymentStatus === "payment_success") {
    if (fulfillmentStatus === "success") {
      displayTransactionResult("Payment confirmed.", `Reference: ${reference}. Your service was confirmed.`, "success");
      return;
    }

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

  if (response.verified === true
    && (["payment_failed", "failed", "cancelled", "canceled"].includes(status)
      || paymentStatus === "payment_failed")) {
    displayTransactionResult("Payment could not be confirmed.", `Reference: ${reference}. Please review your payment or try again.`, "error");
    return;
  }

  displayTransactionResult("Payment status is not verified.", `Reference: ${reference}. Please check again shortly. No bill is considered fulfilled until the backend confirms payment.`, "pending");
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
  const description = document.createElement("p");
  description.textContent = details;
  resultCard.append(label, heading, description);

  const previous = panel.querySelector(".result-card");
  if (previous) previous.remove();
  panel.appendChild(resultCard);
}

document.addEventListener("DOMContentLoaded", () => {
  renderServiceList();
  void loadServiceCatalogue();
  renderCheckoutPanel();
  verifyReturnedPayment();
});
