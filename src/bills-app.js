const BILL_PAYMENT_OPERATIONS_ENABLED = false;

const serviceCatalog = {
  electricity: {
    id: "electricity",
    label: "Electricity",
    icon: "↯",
    title: "Electricity purchase",
    guestCheckout: true,
    helper: "Select an electricity provider from the configured catalogue and verify the meter before payment."
  },
  airtime: {
    id: "airtime",
    label: "Airtime",
    icon: "∿",
    title: "Airtime top-up",
    guestCheckout: true,
    helper: "Choose a network from the configured catalogue and enter the recipient and amount."
  },
  data: {
    id: "data",
    label: "Data",
    icon: "⌁",
    title: "Data purchase",
    guestCheckout: true,
    helper: "Choose a network and data plan returned by the configured provider."
  },
  bills: {
    id: "bills",
    label: "Pay Bills",
    icon: "▤",
    title: "TV and utility bills",
    guestCheckout: true,
    helper: "Choose a cable provider and package returned by the configured provider; verify the smartcard first."
  },
  "virtual-cards": {
    id: "virtual-cards",
    label: "Virtual Cards",
    icon: "▰",
    title: "Virtual Cards",
    guestCheckout: false,
    helper: "An account and the card provider's soft-KYC process will be required. Integration is pending."
  },
  "gift-cards": {
    id: "gift-cards",
    label: "Gift Cards",
    icon: "◇",
    title: "Gift Cards",
    guestCheckout: false,
    helper: "An account and the gift-card provider's soft-KYC process will be required. Integration is pending."
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
  servicePlans: null,
  plansFor: "",
  plansLoading: false,
  plansError: "",
  verifiedCustomer: null,
  verifiedFor: "",
  verificationError: "",
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
  return meter.length > 0 && meter.length <= 64;
}

function renderServiceList() {
  const list = document.querySelector("#service-list");
  const grid = document.querySelector("#service-grid");

  if (list) {
    list.innerHTML = "";
    Object.values(serviceCatalog).forEach((service) => {
      const item = document.createElement("li");
      item.innerHTML = `
        <button type="button" class="service-button ${state.activeService === service.id ? "is-active" : ""}" data-service="${service.id}" aria-pressed="${state.activeService === service.id}">
          <span class="service-icon" aria-hidden="true">${service.icon}</span>
          <span class="service-label">${service.label}</span>
          ${service.guestCheckout ? "" : '<span class="service-access-tag">Account required</span>'}
        </button>
      `;
      list.appendChild(item);
    });
  }

  if (grid) {
    grid.innerHTML = `
      <p class="eyebrow eyebrow-soft service-grid-heading">All services</p>
      <div class="service-grid-items">
        ${Object.values(serviceCatalog).map((service) => `
          <button type="button" class="service-tile ${state.activeService === service.id ? "is-active" : ""}" data-service="${service.id}" aria-pressed="${state.activeService === service.id}">
            <span class="service-tile-top">
              <span class="service-icon" aria-hidden="true">${service.icon}</span>
              <span class="service-tile-access">${service.guestCheckout ? "Guest checkout" : "Account required"}</span>
            </span>
            <strong>${escapeHtml(service.label)}</strong>
            <span class="service-tile-description">${escapeHtml(service.guestCheckout ? "Explore this Bills service" : "Provider integration pending")}</span>
          </button>
        `).join("")}
      </div>
    `;
  }

  document.querySelectorAll("[data-service]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeService = button.dataset.service;
      state.order = null;
      state.feeQuote = null;
      state.feeQuotePending = null;
      state.feeRequestId += 1;
      renderServiceList();
      renderServicePanel();
      renderCheckoutPanel();
      if (serviceCatalog[state.activeService].guestCheckout
        && !state.catalogue
        && !state.catalogueLoading
        && !state.catalogueError) {
        void loadServiceCatalogue();
      }
    });
  });
}

function renderServicePanel() {
  const panel = document.querySelector("#service-panel");
  if (!panel) return;

  const service = serviceCatalog[state.activeService];
  if (!service.guestCheckout) {
    panel.innerHTML = `
      <div class="service-panel-header">
        <div>
          <p class="eyebrow eyebrow-soft">Account-required service</p>
          <h3>${escapeHtml(service.title)}</h3>
        </div>
        <span class="service-tag">Integration pending</span>
      </div>
      <p class="service-helper">${escapeHtml(service.helper)}</p>
      <div class="integration-pending" role="status" aria-live="polite">
        <strong>Not available yet</strong>
        <p>A Bills account API exists, but customer sign-in is not connected to this page. Registration, login and provider soft-KYC are not available here.</p>
        <p>No products, pricing, payment, issuance or delivery are available until this service's provider integration is implemented and verified.</p>
      </div>
    `;
    return;
  }

  const category = state.catalogue?.categories?.[service.id];
  const billers = Array.isArray(category?.billers) ? category.billers : [];
  const available = category?.available === true && billers.length > 0;
  const statusMessage = state.catalogueLoading
    ? "Loading the configured provider catalogue…"
    : state.catalogueError
      ? `Catalogue unavailable: ${state.catalogueError}`
      : category?.available === true && billers.length === 0
        ? "The configured provider currently lists no products for this service."
        : category?.message || "No verified provider is configured for this service.";
  const selectedProvider = state.selectedBillers[service.id] || billers[0]?.code || "";
  const providerSelect = available ? `
    <label class="field">
      <span>${service.id === "electricity" ? "Electricity DisCo" : service.id === "bills" ? "Cable TV provider" : "Network"}</span>
      <select id="biller-code" name="provider" required>
        <option value="">Select a provider</option>
        ${billers.map((biller) => `
          <option value="${escapeHtml(biller.code)}">${escapeHtml(biller.name)}</option>
        `).join("")}
      </select>
    </label>
  ` : "";
  const serviceFields = available ? renderGuestServiceFields(service.id, selectedProvider) : "";

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
      <form id="purchase-form" novalidate>
        ${providerSelect}
        ${serviceFields}
        <button type="button" class="secondary-button" id="verify-customer-button">Verify customer details</button>
        <div id="verified-customer" class="catalog-state" role="status" aria-live="polite">${renderVerifiedCustomer()}</div>
        <div id="fee-preview" class="catalog-state">Checkout remains unavailable until a verified vending provider and payment configuration are in place.</div>
        <button type="submit" class="primary-button" disabled>Continue to payment</button>
      </form>
    ` : ""}
    <button class="secondary-button" type="button" id="catalogue-retry" ${state.catalogueLoading ? "disabled" : ""}>${state.catalogueLoading ? "Loading…" : "Retry catalogue"}</button>
  `;

  const billerSelect = panel.querySelector("#biller-code");
  if (billerSelect) {
    billerSelect.value = selectedProvider;
    billerSelect.addEventListener("change", () => {
      state.selectedBillers[service.id] = billerSelect.value;
      state.servicePlans = null;
      state.verifiedCustomer = null;
      state.verificationError = "";
      renderServicePanel();
    });
  }
  const purchaseForm = panel.querySelector("#purchase-form");
  purchaseForm?.querySelector('[name="plan"]')?.addEventListener("change", () => {
    const plan = purchaseForm.querySelector('[name="plan"]')?.selectedOptions?.[0];
    const amountInput = purchaseForm.querySelector('[name="amount"]');
    if (!amountInput || !plan) return;
    if (plan.dataset.fixedPrice === "true") {
      amountInput.value = plan.dataset.amount || "";
      amountInput.readOnly = true;
    } else {
      amountInput.value = "";
      amountInput.readOnly = false;
    }
    state.verifiedCustomer = null;
    state.verifiedFor = "";
    state.verificationError = "";
    const verified = panel.querySelector("#verified-customer");
    if (verified) verified.textContent = "Verify your customer details before continuing.";
  });
  panel.querySelector("#purchase-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    void handlePurchaseSubmission();
  });
  panel.querySelector("#purchase-form")?.addEventListener("input", (event) => {
    if (!["meterNumber", "customerId", "provider", "recipient", "plan"].includes(event.target?.name)) return;
    const form = panel.querySelector("#purchase-form");
    const values = form ? readPurchaseFormValues(form) : {};
    const currentVerification = verificationRequestKey(service.id, values);
    if (state.verifiedFor && state.verifiedFor !== currentVerification) {
      state.verifiedCustomer = null;
      state.verifiedFor = "";
      state.verificationError = "";
      const verified = panel.querySelector("#verified-customer");
      if (verified) verified.textContent = "Verify your customer details before continuing.";
    }
  });
  panel.querySelector("#verify-customer-button")?.addEventListener("click", () => {
    void verifyBillCustomer(service.id);
  });
  panel.querySelector("#catalogue-retry")?.addEventListener("click", () => {
    void loadServiceCatalogue(true);
  });
  if (service.id
    && selectedProvider
    && state.plansFor !== `${service.id}:${selectedProvider}`
    && !state.plansLoading) {
    void loadServicePlans(service.id, selectedProvider);
  }
}

async function loadServiceCatalogue(forceRefresh = false) {
  if (!serviceCatalog[state.activeService]?.guestCheckout) return;

  state.catalogueLoading = true;
  state.catalogueError = "";
  state.catalogue = null;
  renderServicePanel();

  try {
    const result = await fetchBillingApi(`/api/services/catalog${forceRefresh ? "?refresh=true" : ""}`, {
      signal: AbortSignal.timeout(12000)
    });
    if (!result || typeof result.categories !== "object" || result.categories === null) {
      throw new Error("Billing API returned an invalid catalogue.");
    }
    Object.values(serviceCatalog).filter((service) => service.guestCheckout).forEach((service) => {
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

function getPlanRows(payload) {
  const value = payload?.plans ?? payload?.data ?? payload;
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const rows = Object.values(value).find(Array.isArray);
    return rows || [];
  }
  return [];
}

function getPlanVariationCode(plan) {
  if (typeof plan?.code === "string") return plan.code;
  return typeof plan?.variation_code === "string" ? plan.variation_code : "";
}

function getPlanPrice(plan) {
  const value = plan?.price;
  const amount = typeof value === "number" ? value : Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
}

function getProductPriceType(product) {
  return String(product?.priceType || "").toUpperCase();
}

function isFixedPriceProduct(product) {
  return getProductPriceType(product) === "FIXED";
}

function getProductBound(product, key) {
  const value = product?.[key];
  if (value === null || value === undefined || value === "") return null;
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function getPlanLabel(plan) {
  const metadata = plan?.metadata && typeof plan.metadata === "object" ? plan.metadata : {};
  const parts = [
    plan?.name,
    metadata.volume ? `${metadata.volume}${metadata.volumeUnit || ""}` : "",
    metadata.duration ? `${metadata.duration}${metadata.durationUnit ? ` ${metadata.durationUnit}` : ""}` : "",
    getPlanPrice(plan) ? formatCurrency(getPlanPrice(plan)) : ""
  ].filter((value) => typeof value === "string" || typeof value === "number");
  return parts.length ? parts.join(" · ") : getPlanVariationCode(plan);
}

function renderGuestServiceFields(serviceId, provider) {
  const products = state.plansFor === `${serviceId}:${provider}` ? getPlanRows(state.servicePlans) : [];
  const planLabel = serviceId === "electricity"
    ? "Electricity product"
    : serviceId === "airtime"
      ? "Airtime product or denomination"
      : serviceId === "data"
        ? "Data bundle"
        : "TV package";
  const planField = `
    <label class="field"><span>${planLabel}</span><select name="plan" required>
      <option value="">${state.plansLoading ? "Loading Monnify products…" : state.plansError || "Select a product returned by Monnify"}</option>
      ${products.filter((product) => getPlanVariationCode(product)).map((product) => {
        const fixedPrice = isFixedPriceProduct(product) && getPlanPrice(product) > 0;
        const minAmount = getProductBound(product, "minAmount");
        const maxAmount = getProductBound(product, "maxAmount");
        return `
          <option value="${escapeHtml(getPlanVariationCode(product))}"
            ${fixedPrice ? `data-amount="${getPlanPrice(product)}"` : ""}
            ${minAmount ? `data-min-amount="${minAmount}"` : ""}
            ${maxAmount ? `data-max-amount="${maxAmount}"` : ""}
            data-fixed-price="${fixedPrice}"
            data-price-type="${escapeHtml(getProductPriceType(product))}">
            ${escapeHtml(getPlanLabel(product))}
          </option>
        `;
      }).join("")}
    </select></label>
  `;
  if (serviceId === "electricity") {
    return `
      <label class="field"><span>Meter number</span><input name="meterNumber" inputmode="numeric" autocomplete="off" required></label>
      ${planField}
      <label class="field"><span>Amount (NGN)</span><input name="amount" inputmode="decimal" type="number" min="0.01" step="0.01" required></label>
    `;
  }
  if (serviceId === "airtime") {
    return `
      <label class="field"><span>Recipient phone number</span><input name="recipient" inputmode="tel" autocomplete="tel" required></label>
      ${planField}
      <label class="field"><span>Amount (NGN, when required by the product)</span><input name="amount" inputmode="decimal" type="number" min="0.01" step="0.01" required></label>
    `;
  }
  if (serviceId === "data") {
    return `
      <label class="field"><span>Recipient phone number</span><input name="recipient" inputmode="tel" autocomplete="tel" required></label>
      ${planField}
      <label class="field"><span>Amount (NGN, when required by the product)</span><input name="amount" inputmode="decimal" type="number" min="0.01" step="0.01" required></label>
    `;
  }
  if (serviceId === "bills") {
    return `
      <label class="field"><span>Smartcard or decoder number</span><input name="customerId" inputmode="numeric" autocomplete="off" required></label>
      ${planField}
      <label class="field"><span>Amount (NGN, when required by the product)</span><input name="amount" inputmode="decimal" type="number" min="0.01" step="0.01" required></label>
    `;
  }
  return "";
}

function renderVerifiedCustomer() {
  if (state.verificationError) return escapeHtml(state.verificationError);
  const details = state.verifiedCustomer;
  if (!details) return "Verify your customer details before continuing.";
  const fields = [["Customer", details.customer_name]]
    .filter(([, value]) => typeof value === "string" && value.trim());
  return fields.map(([label, value]) => `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`).join("")
  || "Monnify validated the customer; it did not return customer details.";
}

function readPurchaseFormValues(form) {
  const values = Object.fromEntries(new FormData(form).entries());
  const planSelect = form.querySelector('[name="plan"]');
  if (planSelect?.selectedOptions?.[0]?.dataset?.amount) {
    values.amount = planSelect.selectedOptions[0].dataset.amount;
  }
  return values;
}

function getSelectedProduct(serviceId, provider, productCode) {
  if (!productCode || state.plansFor !== `${serviceId}:${provider}`) return null;
  return getPlanRows(state.servicePlans)
    .find((product) => getPlanVariationCode(product) === productCode) || null;
}

function validateSelectedProductAmount(product, amount) {
  if (!product || !Number.isFinite(amount) || amount <= 0) return false;
  const priceType = getProductPriceType(product);
  if (priceType === "FIXED") return getPlanPrice(product) > 0 && amount === getPlanPrice(product);
  if (priceType !== "OPEN") return false;
  const minimum = getProductBound(product, "minAmount");
  const maximum = getProductBound(product, "maxAmount");
  return (minimum === null || amount >= minimum) && (maximum === null || amount <= maximum);
}

function verificationRequestKey(serviceId, values) {
  return JSON.stringify({
    service: serviceId,
    provider: values.provider || "",
    meterNumber: values.meterNumber || "",
    customerId: values.customerId || "",
    recipient: values.recipient || "",
    productCode: values.plan || ""
  });
}

async function loadServicePlans(serviceId, provider) {
  if (!provider || !serviceCatalog[serviceId]?.guestCheckout) return;
  const requestId = `${serviceId}:${provider}`;
  state.plansFor = requestId;
  state.plansLoading = true;
  state.plansError = "";
  state.servicePlans = null;
  renderServicePanel();
  try {
    const query = new URLSearchParams({
      service: serviceId,
      provider
    });
    const result = await fetchBillingApi(`/api/services/plans?${query}`);
    state.servicePlans = result.plans;
    if (!getPlanRows(result.plans).some((product) => getPlanVariationCode(product))) {
      state.plansError = "Monnify currently lists no products for this provider.";
    }
  } catch (error) {
    state.plansError = `Plans unavailable: ${error.message}`;
  } finally {
    if (state.plansFor === requestId) {
      state.plansLoading = false;
      renderServicePanel();
    }
  }
}

async function verifyBillCustomer(serviceId) {
  const form = document.querySelector("#purchase-form");
  if (!form) return;
  const values = readPurchaseFormValues(form);
  const customerId = serviceId === "electricity"
    ? values.meterNumber
    : ["airtime", "data"].includes(serviceId)
      ? values.recipient
      : values.customerId;
  if (!values.provider || !values.plan || !customerId) {
    state.verificationError = "Choose a provider and product and enter the customer identifier before validation.";
    const resultElement = document.querySelector("#verified-customer");
    if (resultElement) resultElement.textContent = state.verificationError;
    return;
  }
  const request = {
    service: serviceId,
    provider: values.provider,
    productCode: values.plan,
    customerId
  };
  state.verifiedCustomer = null;
  state.verifiedFor = "";
  state.verificationError = "Verifying with the configured provider…";
  const resultElement = document.querySelector("#verified-customer");
  if (resultElement) resultElement.textContent = state.verificationError;
  try {
    const result = await fetchBillingApi("/api/services/verify", {
      method: "POST",
      body: JSON.stringify(request)
    });
    state.verifiedCustomer = result.verification;
    state.verifiedFor = result.verification
      ? JSON.stringify({
        service: serviceId,
        provider: values.provider,
        meterNumber: values.meterNumber || "",
        customerId: values.customerId || "",
        recipient: values.recipient || "",
        productCode: values.plan || ""
      })
      : "";
    state.verificationError = result.verification ? "" : "The provider did not return verified customer details.";
  } catch (error) {
    state.verificationError = `Verification failed: ${error.message}`;
  }
  if (resultElement) resultElement.innerHTML = renderVerifiedCustomer();
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
        network: values.network || values.provider || "",
        plan: values.plan || ""
      });
      return `/api/fees/quote?${query}`;
    }

    function feeQuoteRequestKey(serviceId, amount, values) {
      return JSON.stringify({
        service: serviceId,
        amount: String(amount),
        network: serviceId === "data" ? values.network || values.provider || "" : "",
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
      if (!serviceCatalog[serviceId]?.guestCheckout) {
        throw new Error("Account-required services do not support guest fee quotes.");
      }

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
      const values = readPurchaseFormValues(form);
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

  if (!serviceCatalog[state.order.serviceId]?.guestCheckout) {
    state.order = null;
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
  if (serviceId === "electricity" || serviceId === "airtime" || serviceId === "data" || serviceId === "bills") {
    return Number(values.amount || 0);
  }

  return 0;
}

function createSummaryFromForm(serviceId, values) {
  const service = serviceCatalog[serviceId];
  const lines = [];

  if (serviceId === "electricity") {
    lines.push({ label: "DisCo", value: values.provider || "—" });
    lines.push({ label: "Product", value: document.querySelector('#purchase-form [name="plan"]')?.selectedOptions?.[0]?.textContent || values.plan || "—" });
    lines.push({ label: "Meter", value: values.meterNumber || "—" });
  }

  if (serviceId === "airtime") {
    lines.push({ label: "Network", value: values.provider || "—" });
    lines.push({ label: "Receiver", value: values.recipient || "—" });
  }

  if (serviceId === "data") {
    lines.push({ label: "Network", value: values.provider || "—" });
    lines.push({ label: "Receiver", value: values.recipient || "—" });
    lines.push({ label: "Plan", value: document.querySelector('#purchase-form [name="plan"]')?.selectedOptions?.[0]?.textContent || values.plan || "—" });
  }

  if (serviceId === "bills") {
    lines.push({ label: "Provider", value: values.provider || "—" });
    lines.push({ label: "Customer ID", value: values.customerId || "—" });
    lines.push({ label: "Package", value: document.querySelector('#purchase-form [name="plan"]')?.selectedOptions?.[0]?.textContent || values.plan || "—" });
  }

  return lines;
}

async function handlePurchaseSubmission() {
  const service = serviceCatalog[state.activeService];
  if (!service?.guestCheckout) {
    renderServicePanel();
    return;
  }

  const form = document.querySelector("#purchase-form");
  if (!form) return;

  const values = readPurchaseFormValues(form);
  const selectedProduct = getSelectedProduct(state.activeService, values.provider, values.plan);
  if (!selectedProduct || !validateSelectedProductAmount(selectedProduct, Number(values.amount))) {
    renderInlineMessage("Select a current Monnify product and use its supplied price or amount limits.", "error");
    return;
  }
  if (state.activeService === "electricity" && !validateMeter(values.meterNumber)) {
    renderInlineMessage("Enter a meter number and validate it with Monnify before continuing.", "error");
    return;
  }
  if (["airtime", "data"].includes(state.activeService) && !validatePhone(values.recipient)) {
    renderInlineMessage("Enter a valid Nigerian mobile number for the recipient.", "error");
    return;
  }
  if (state.activeService === "bills" && !values.customerId?.trim()) {
    renderInlineMessage("Enter a smart card or decoder number.", "error");
    return;
  }
  if (state.verifiedFor !== verificationRequestKey(state.activeService, values) || !state.verifiedCustomer) {
    renderInlineMessage("Validate these customer details with Monnify before continuing.", "error");
    return;
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
  const currentValues = currentForm ? readPurchaseFormValues(currentForm) : {};
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
      disco: state.activeService === "electricity" ? values.provider || "" : "",
      network: ["data", "airtime"].includes(state.activeService) ? values.provider || "" : "",
      recipient: values.recipient || "",
      customerId: values.customerId || "",
      biller: state.activeService === "bills" ? values.provider || "" : "",
      plan: values.plan || "",
      productCode: values.plan || "",
      validationReference: state.verifiedCustomer.validation_reference || "",
      requireValidationRef: state.verifiedCustomer.require_validation_ref === true
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
  if (!serviceCatalog[state.order.serviceId]?.guestCheckout) {
    state.order = null;
    renderCheckoutPanel();
    renderServicePanel();
    return;
  }

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
  if (!serviceCatalog[state.activeService]?.guestCheckout) return;

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
  const paymentConfirmed = response.verified === true
    || paymentStatus === "paid"
    || status === "paid";

  if (paymentConfirmed) {
    if (["fulfilled", "successful", "success"].includes(fulfillmentStatus)) {
      const providerReference = typeof response.providerReference === "string" && response.providerReference
        ? ` Service reference: ${response.providerReference}.`
        : "";
      displayTransactionResult("Successful.", `Payment confirmed. Reference: ${reference}.${providerReference}`, "success");
      return;
    }

    if (["failed", "vending_failed"].includes(fulfillmentStatus) || status === "vending_failed") {
      displayTransactionResult(
        "Payment confirmed; service delivery failed.",
        `Reference: ${reference}. The payment was received, but delivery was not confirmed. Please contact support; do not pay again.`,
        "error"
      );
      return;
    }

    if (fulfillmentStatus === "not_started" || status === "awaiting_operational_funds") {
      displayTransactionResult(
        "Vending awaiting operational funds.",
        `Reference: ${reference}. Payment is confirmed, but operational funding has not been verified and vending has not started. Do not pay again.`,
        "pending"
      );
      return;
    }

    if (["review_required", "pending_reconciliation"].includes(fulfillmentStatus)) {
      displayTransactionResult(
        "Requires support or reconciliation.",
        `Reference: ${reference}. Payment is confirmed, but the service outcome needs review. Do not pay again.`,
        "pending"
      );
      return;
    }

    displayTransactionResult(
      fulfillmentStatus === "processing" || fulfillmentStatus === "pending"
        ? "Processing service."
        : "Payment confirmed.",
      `Reference: ${reference}. The service outcome has not yet been confirmed.`,
      "pending"
    );
    return;
  }

  if (["payment_failed", "failed", "cancelled", "canceled"].includes(status)
    || ["payment_failed", "failed", "cancelled"].includes(paymentStatus)) {
    displayTransactionResult("Payment failed.", `Reference: ${reference}. The backend did not confirm a successful payment.`, "error");
    return;
  }

  if (["awaiting_payment", "payment_pending", "initiated", "created", "pending"].includes(status)
    || ["payment_pending", "initiated", "pending", "not_started"].includes(paymentStatus)) {
    displayTransactionResult("Awaiting payment.", `Reference: ${reference}. Complete payment in Monnify or check again shortly.`, "pending");
    return;
  }

  displayTransactionResult("Pending confirmation.", `Reference: ${reference}. The backend has not confirmed payment or service delivery.`, "pending");
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

function getTransactionHistoryStatus(transaction) {
  const paymentStatus = String(transaction.paymentStatus || "").toLowerCase();
  const fulfilmentStatus = String(transaction.fulfilmentStatus || "").toLowerCase();
  if (paymentStatus === "paid" && fulfilmentStatus === "fulfilled") return "Successful";
  if (paymentStatus === "paid" && fulfilmentStatus === "failed") {
    return "Payment confirmed; service delivery failed. Contact support; do not pay again.";
  }
  if (paymentStatus === "paid" && fulfilmentStatus === "not_started") {
    return "Vending awaiting operational funds. Funding is not verified; do not pay again.";
  }
  if (paymentStatus === "paid" && ["pending", "processing", "review_required"].includes(fulfilmentStatus)) {
    return "Payment confirmed; service is pending or being reconciled.";
  }
  if (["pending", "initiated"].includes(paymentStatus)) return "Awaiting payment confirmation.";
  if (["failed", "cancelled"].includes(paymentStatus)) return "Payment failed or was cancelled.";
  if (paymentStatus === "refunded") return "Refund confirmed.";
  return "Status pending confirmation.";
}

function renderCustomerTransactionHistory(panel, list, transactions) {
  if (!panel || !list) return;
  list.replaceChildren();
  const serviceLabels = Object.fromEntries(
    Object.values(serviceCatalog).map((service) => [service.id, service.label])
  );
  transactions.forEach((transaction) => {
    const item = document.createElement("li");
    item.className = "customer-history-item";
    const title = document.createElement("strong");
    title.textContent = serviceLabels[transaction.service] || "Bills transaction";
    const reference = document.createElement("span");
    reference.textContent = `Reference: ${transaction.reference}`;
    const status = document.createElement("span");
    status.textContent = getTransactionHistoryStatus(transaction);
    const amount = document.createElement("span");
    amount.textContent = Number.isSafeInteger(transaction.amountMinor)
      ? formatMinorCurrency(transaction.amountMinor, transaction.currency)
      : "Amount unavailable";
    item.append(title, reference, status, amount);
    list.appendChild(item);
  });
  panel.hidden = transactions.length === 0;
}

async function initializeIdentitySignIn() {
  const button = document.querySelector("#accounts-sign-in-button");
  if (!button) return;
  const authStatus = document.querySelector("#accounts-auth-status");
  const historyStatus = document.querySelector("#customer-history-status");
  const historyPanel = document.querySelector("#customer-history-panel");
  const historyList = document.querySelector("#customer-history-list");
  const authResult = new URLSearchParams(window.location.search).get("auth");
  let csrfToken = "";
  const authMessages = {
    required: "Sign in with Electrony Accounts for account features. Guest checkout remains available.",
    consent_required: "Review and approve the Electrony Bills access request in Electrony Accounts.",
    verification_required: "Your Electrony Account email is not verified. Verify your email, then sign in again. Guest checkout remains available.",
    success: "Signed in with Electrony Accounts.",
    expired: "Your Electrony Accounts session expired. Sign in again.",
    cancelled: "Sign-in was cancelled. Guest checkout remains available.",
    failed: "We couldn't verify your sign-in. Please try again; guest checkout remains available.",
    unavailable: "Sign-in is temporarily unavailable. Please try again later. Guest checkout remains available."
  };
  const showAuthStatus = (message) => {
    if (!authStatus) return;
    authStatus.textContent = message;
    authStatus.hidden = !message;
  };
  const getSignInUrl = () => {
    const apiUrl = new URL(getBillsApiBaseUrl());
    const returnUrl = new URL(window.location.href);
    returnUrl.hash = "";
    const signInUrl = new URL(`${apiUrl.href.replace(/\/+$/, "")}/api/auth/oauth/start`);
    signInUrl.searchParams.set("return_to", returnUrl.href);
    return signInUrl.href;
  };
  showAuthStatus(authMessages[authResult] || "");
  try {
    button.href = getSignInUrl();
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      if (!state.user) {
        showAuthStatus("Redirecting to Electrony Accounts. Complete sign-in there; return to Bills when authentication is complete.");
        window.location.assign(button.href);
        return;
      }
      try {
        const logoutResponse = await fetch(`${getBillsApiBaseUrl()}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken
          },
          body: "{}"
        });
        const logoutPayload = await logoutResponse.json().catch(() => null);
        if (!logoutResponse.ok || !logoutPayload?.signedOut) {
          throw new Error(logoutPayload?.error || "Sign-out could not be completed.");
        }
        state.user = null;
        button.textContent = "Sign in with Electrony Accounts";
        button.href = getSignInUrl();
        showAuthStatus(logoutPayload.providerRevoked
          ? "You have signed out of Electrony Accounts."
          : "Signed out on this device. The central account session may still be active.");
        if (historyStatus) historyStatus.hidden = true;
        if (historyPanel) historyPanel.hidden = true;
        if (historyList) historyList.replaceChildren();
        state.transactions = [];
      } catch {
        showAuthStatus("Sign-out could not be confirmed. Please try again.");
      }
    });
  } catch {
    showAuthStatus(authMessages.failed);
    return;
  }

  try {
    const response = await fetch(`${getBillsApiBaseUrl()}/api/auth/me`, { credentials: "include" });
    const payload = await response.json().catch(() => null);
    if (response.ok && payload?.ok) {
      state.user = payload.user;
      if (authResult === "success") showAuthStatus(authMessages.success);
      button.textContent = "Sign out of Electrony Accounts";
      button.href = "#";
      csrfToken = String(payload.csrfToken || "");
      if (historyStatus) {
        historyStatus.textContent = "Loading registered transaction history…";
        historyStatus.hidden = false;
      }
      if (historyPanel) historyPanel.hidden = false;
      try {
        const history = await fetchBillingApi("/api/customer/transactions");
        if (!Array.isArray(history.transactions)) throw new Error("Invalid transaction history response.");
        state.transactions = history.transactions.filter((transaction) => (
          transaction
          && typeof transaction.reference === "string"
          && typeof transaction.service === "string"
          && typeof transaction.paymentStatus === "string"
          && typeof transaction.fulfilmentStatus === "string"
        ));
        if (historyStatus) {
          historyStatus.textContent = state.transactions.length
            ? `${state.transactions.length} registered transaction${state.transactions.length === 1 ? "" : "s"}`
            : "No registered transactions yet";
          historyStatus.hidden = false;
        }
        renderCustomerTransactionHistory(historyPanel, historyList, state.transactions);
      } catch {
        state.transactions = [];
        if (historyStatus) {
          historyStatus.textContent = "Transaction history unavailable. Please try again later.";
          historyStatus.hidden = false;
        }
        if (historyPanel) historyPanel.hidden = true;
      }
    } else {
      state.user = null;
      if (historyStatus) historyStatus.hidden = true;
      if (historyPanel) historyPanel.hidden = true;
      if (authResult === "success") showAuthStatus(authMessages.expired);
    }
  } catch {
    state.user = null;
    if (historyStatus) historyStatus.hidden = true;
    if (historyPanel) historyPanel.hidden = true;
    if (authResult === "success") showAuthStatus(authMessages.expired);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderServiceList();
  if (serviceCatalog[state.activeService].guestCheckout) {
    void loadServiceCatalogue();
  }
  renderCheckoutPanel();
  verifyReturnedPayment();
  void initializeIdentitySignIn();
});
