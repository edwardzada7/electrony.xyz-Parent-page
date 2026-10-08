const crypto = require("crypto");

function normalizeConfigValue(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function readEnv(name, fallback = "") {
  const value = normalizeConfigValue(process.env[name]);
  return value || fallback;
}

function createHeaders(body, secretKey) {
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(body)
    .digest("hex");

  return {
    "Content-Type": "application/json",
    "x-signature": signature
  };
}

class NullProviderAdapter {
  constructor(config) {
    this.config = config;
  }

  isConfigured() {
    return false;
  }

  getMissingConfiguration() {
    return Object.entries(this.config)
      .filter(([, value]) => !value)
      .map(([key]) => key);
  }

  async validateMeter() {
    return {
      ok: false,
      status: "provider_unconfigured",
      message: "No vending provider has been configured. Add BILLS_PROVIDER_* or BILLS_VENDING_PROVIDER values to enable real service delivery."
    };
  }

  async validateCustomer() {
    return {
      ok: false,
      status: "provider_unconfigured",
      message: "No vending provider has been configured. Add BILLS_PROVIDER_* or BILLS_VENDING_PROVIDER values to enable real service delivery."
    };
  }

  async purchaseElectricity() {
    return {
      ok: false,
      status: "vending_failed",
      message: "No vending provider has been configured. Add BILLS_PROVIDER_* or BILLS_VENDING_PROVIDER values to enable actual electricity vending."
    };
  }

  async purchaseAirtime() {
    return {
      ok: false,
      status: "vending_failed",
      message: "No vending provider has been configured. Add BILLS_PROVIDER_* or BILLS_VENDING_PROVIDER values to enable actual airtime vending."
    };
  }

  async purchaseData() {
    return {
      ok: false,
      status: "vending_failed",
      message: "No vending provider has been configured. Add BILLS_PROVIDER_* or BILLS_VENDING_PROVIDER values to enable actual data vending."
    };
  }

  async purchaseBill() {
    return {
      ok: false,
      status: "vending_failed",
      message: "No vending provider has been configured. Add BILLS_PROVIDER_* or BILLS_VENDING_PROVIDER values to enable actual bill vending."
    };
  }

  async fetchStatus() {
    return {
      ok: false,
      status: "pending_reconciliation",
      message: "Provider status checks are unavailable until the vending provider is configured."
    };
  }

  async reconcileTransaction() {
    return {
      ok: false,
      status: "pending_reconciliation",
      message: "Provider reconciliation is pending until the vending provider is configured."
    };
  }
}

class ProviderAdapter {
  constructor(config) {
    this.config = config;
  }

  isConfigured() {
    const required = [
      "baseUrl",
      "apiKey",
      "secretKey"
    ];

    return required.every((field) => Boolean(this.config[field]));
  }

  getMissingConfiguration() {
    return Object.entries(this.config)
      .filter(([, value]) => !value)
      .map(([key]) => key);
  }

  async request(path, options = {}) {
    const url = new URL(path, this.config.baseUrl.endsWith("/") ? this.config.baseUrl : `${this.config.baseUrl}/`);

    const response = await fetch(url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.config.apiKey}`,
        ...(options.headers || {})
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const text = await response.text();
    let payload = {};
    try {
      payload = text ? JSON.parse(text) : {};
    } catch (error) {
      payload = { raw: text };
    }

    if (!response.ok) {
      throw new Error(payload?.message || payload?.error || `Provider request failed with status ${response.status}.`);
    }

    return payload;
  }

  async validateMeter(details) {
    return this.request("/meter-validation", {
      method: "POST",
      body: {
        provider: this.config.name || "vtu",
        ...details
      }
    });
  }

  async validateCustomer(details) {
    return this.request("/customer-validation", {
      method: "POST",
      body: {
        provider: this.config.name || "vtu",
        ...details
      }
    });
  }

  async purchaseElectricity(details) {
    return this.request("/electricity/vend", {
      method: "POST",
      body: {
        provider: this.config.name || "vtu",
        ...details
      }
    });
  }

  async purchaseAirtime(details) {
    return this.request("/airtime/vend", {
      method: "POST",
      body: {
        provider: this.config.name || "vtu",
        ...details
      }
    });
  }

  async purchaseData(details) {
    return this.request("/data/vend", {
      method: "POST",
      body: {
        provider: this.config.name || "vtu",
        ...details
      }
    });
  }

  async purchaseBill(details) {
    return this.request("/bill/vend", {
      method: "POST",
      body: {
        provider: this.config.name || "vtu",
        ...details
      }
    });
  }

  async fetchStatus(reference) {
    return this.request(`/transactions/${encodeURIComponent(reference)}`);
  }

  async reconcileTransaction(reference) {
    return this.request(`/transactions/${encodeURIComponent(reference)}/reconcile`);
  }
}

function buildProviderAdapter() {
  const config = {
    name: readEnv("BILLS_VENDING_PROVIDER") || readEnv("BILLS_PROVIDER_NAME") || "",
    baseUrl: readEnv("BILLS_PROVIDER_BASE_URL") || readEnv("VTU_PROVIDER_BASE_URL") || "",
    apiKey: readEnv("BILLS_PROVIDER_API_KEY") || readEnv("VTU_API_KEY") || "",
    secretKey: readEnv("BILLS_PROVIDER_SECRET_KEY") || readEnv("VTU_SECRET_KEY") || "",
    webhookSecret: readEnv("BILLS_PROVIDER_WEBHOOK_SECRET") || readEnv("VTU_WEBHOOK_SECRET") || "",
    timeoutMs: Number(readEnv("BILLS_PROVIDER_TIMEOUT_MS") || 20000)
  };

  if (!config.baseUrl && !config.apiKey && !config.secretKey) {
    return new NullProviderAdapter(config);
  }

  if (config.baseUrl && config.apiKey && config.secretKey) {
    return new ProviderAdapter(config);
  }

  return new NullProviderAdapter(config);
}

module.exports = {
  createHeaders,
  buildProviderAdapter,
  readEnv,
  normalizeConfigValue
};
