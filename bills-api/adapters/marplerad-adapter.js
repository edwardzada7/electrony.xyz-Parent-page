"use strict";

function createMarpleradAdapter(readEnv) {
  return Object.freeze({
    provider: "marplerad",
    isConfigured() {
      return Boolean(
        readEnv("MARPLERAD_BASE_URL").trim()
        && readEnv("MARPLERAD_API_KEY").trim()
        && readEnv("MARPLERAD_API_SECRET").trim()
        && readEnv("MARPLERAD_WEBHOOK_SECRET").trim()
      );
    },
    async getCustomerStatus() {
      throw new Error("Marplerad integration is awaiting official documentation and authorized sandbox credentials.");
    },
    async createCustomer() {
      throw new Error("Marplerad integration is awaiting official documentation and authorized sandbox credentials.");
    },
    async createCard() {
      throw new Error("Marplerad integration is awaiting official documentation and authorized sandbox credentials.");
    },
    async getCard() {
      throw new Error("Marplerad integration is awaiting official documentation and authorized sandbox credentials.");
    },
    async listCardTransactions() {
      throw new Error("Marplerad integration is awaiting official documentation and authorized sandbox credentials.");
    },
    async processWebhook() {
      throw new Error("Marplerad integration is awaiting official documentation and authorized sandbox credentials.");
    }
  });
}

module.exports = { createMarpleradAdapter };
