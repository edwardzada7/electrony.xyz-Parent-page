"use strict";

function normalizeConfigValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function readEnv(name, fallback = "") {
  return normalizeConfigValue(process.env[name]) || fallback;
}

class NullProviderAdapter {
  isConfigured() {
    return false;
  }

  getMissingConfiguration() {
    return [];
  }

  async validateMeter() {
    return this.unavailable("Customer verification is unavailable because no authorized vending provider is configured.");
  }

  async validateCustomer() {
    return this.unavailable("Customer verification is unavailable because no authorized vending provider is configured.");
  }

  async purchaseElectricity() {
    return this.unavailable("Electricity vending is unavailable because no authorized provider is configured.");
  }

  async purchaseAirtime() {
    return this.unavailable("Airtime vending is unavailable because no authorized provider is configured.");
  }

  async purchaseData() {
    return this.unavailable("Data vending is unavailable because no authorized provider is configured.");
  }

  async purchaseBill() {
    return this.unavailable("Bill vending is unavailable because no authorized provider is configured.");
  }

  async fetchStatus() {
    return this.unavailable("Transaction status is unavailable because no authorized vending provider is configured.", "pending_reconciliation");
  }

  async reconcileTransaction() {
    return this.unavailable("Transaction reconciliation is unavailable because no authorized vending provider is configured.", "pending_reconciliation");
  }

  unavailable(message, status = "provider_unconfigured") {
    return { ok: false, status, message };
  }
}

function buildProviderAdapter() {
  return new NullProviderAdapter();
}

module.exports = {
  buildProviderAdapter,
  readEnv,
  normalizeConfigValue
};
