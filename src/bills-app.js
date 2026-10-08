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
  }
};

const state = {
  activeService: "electricity",
  order: null,
  transactions: []
};

const formatCurrency = (value) => new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0
}).format(Number(value || 0));

const generateReference = () => {
  const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `ELECBILLS-${dateStamp}-${suffix}`;
};

const getBillsApiBaseUrl = () => {
  const baseUrl = (window.ElectronyConfig && window.ElectronyConfig.billsApiBaseUrl) || "http://localhost:4174";
  return String(baseUrl).replace(/\/$/, "");
};

const fetchBillingApi = async (path, options = {}) => {
  const response = await fetch(`${getBillsApiBaseUrl()}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
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
    handlePurchaseSubmission();
  });

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

function renderCheckoutPanel() {
  const panel = document.querySelector("#checkout-panel");
  if (!panel) return;

  if (!state.order) {
    panel.classList.add("hidden");
    panel.innerHTML = "";
    return;
  }

  panel.classList.remove("hidden");
  const { serviceId, summary, reference, amount, status } = state.order;
  const service = serviceCatalog[serviceId];

  panel.innerHTML = `
    <div class="checkout-header">
      <div>
        <p class="eyebrow eyebrow-soft">Order review</p>
        <h3>${service.title}</h3>
      </div>
      <span class="status-badge ${status === "paid" ? "success" : "pending"}">${status === "paid" ? "Paid" : "Awaiting payment"}</span>
    </div>
    <div class="review-grid">
      ${summary.map((line) => `<div class="review-item"><span>${line.label}</span><strong>${line.value}</strong></div>`).join("")}
      <div class="review-item review-total"><span>Amount</span><strong>${formatCurrency(amount)}</strong></div>
    </div>
    <div class="checkout-meta">
      <span>Reference</span>
      <strong>${reference}</strong>
    </div>
    <div class="checkout-actions">
      <button type="button" class="primary-button" id="pay-button">Pay now</button>
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
      const status = response.status || "unknown";
      const note = response.providerReference ? `Provider ref: ${response.providerReference}` : "No provider reference yet.";
      displayTransactionResult("Status checked successfully.", `${status.toUpperCase()} — ${note}`, status === "successful" ? "success" : "pending");
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

function handlePurchaseSubmission() {
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

  const reference = generateReference();
  const amount = resolveOrderAmount(state.activeService, values);

  state.order = {
    serviceId: state.activeService,
    reference,
    amount,
    status: "pending",
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
    const response = await fetchBillingApi(`/api/payments/status?reference=${encodeURIComponent(reference)}`);
    const resolvedStatus = String(response.status || "pending").toLowerCase();

    if (resolvedStatus === "paid" || resolvedStatus === "payment_success" || resolvedStatus === "success") {
      displayTransactionResult("Payment successful.", `Reference: ${reference}. Your service is being processed.`, "success");
      return;
    }

    if (resolvedStatus === "payment_pending" || resolvedStatus === "pending" || resolvedStatus === "processing") {
      displayTransactionResult("Payment received.", `Reference: ${reference}. Your service is still being processed.`, "pending");
      return;
    }

    displayTransactionResult("Payment could not be confirmed.", `Reference: ${reference}. Please review your payment or try again shortly.`, "error");
  } catch (error) {
    displayTransactionResult("Payment verification is pending.", `Reference: ${reference}. Please check status again shortly.`, "pending");
  }
}

function displayTransactionResult(message, details, status) {
  const panel = document.querySelector("#checkout-panel");
  if (!panel) return;

  const resultCard = document.createElement("div");
  resultCard.className = `result-card result-card-${status}`;
  resultCard.innerHTML = `
    <p class="result-label">Transaction result</p>
    <h4>${message}</h4>
    <p>${details}</p>
  `;

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
