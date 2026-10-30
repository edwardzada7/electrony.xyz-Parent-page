"use strict";

function createTeloadlyAdapter(readEnv) {
  return Object.freeze({
    provider: "teloadly",
    isConfigured() {
      return Boolean(
        readEnv("TELOADLY_BASE_URL").trim()
        && readEnv("TELOADLY_API_KEY").trim()
        && readEnv("TELOADLY_API_SECRET").trim()
        && readEnv("TELOADLY_WEBHOOK_SECRET").trim()
      );
    },
    async authenticate() {
      throw new Error("Teloadly integration is awaiting official documentation and authorized sandbox credentials.");
    },
    async getCatalogue() {
      throw new Error("Teloadly integration is awaiting official documentation and authorized sandbox credentials.");
    },
    async getDenominations() {
      throw new Error("Teloadly integration is awaiting official documentation and authorized sandbox credentials.");
    },
    async createOrder() {
      throw new Error("Teloadly integration is awaiting official documentation and authorized sandbox credentials.");
    },
    async getOrderStatus() {
      throw new Error("Teloadly integration is awaiting official documentation and authorized sandbox credentials.");
    },
    async processWebhook() {
      throw new Error("Teloadly integration is awaiting official documentation and authorized sandbox credentials.");
    }
  });
}

module.exports = { createTeloadlyAdapter };
