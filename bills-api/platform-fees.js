const PLATFORM_FEE_RULES = Object.freeze({
  electricity: Object.freeze({ currency: "NGN", fixedFeeMinor: 10000 }),
  airtime: Object.freeze({ currency: "NGN", fixedFeeMinor: 10000 }),
  data: Object.freeze({ currency: "NGN", fixedFeeMinor: 10000 }),
  bills: Object.freeze({ currency: "NGN", fixedFeeMinor: 10000 })
});

function parseMoneyToMinor(value) {
  const normalized = String(value ?? "").trim();
  const match = normalized.match(/^(0|[1-9]\d*)(?:\.(\d{1,2}))?$/);
  if (!match) {
    throw new Error("Amount must be a non-negative amount with at most two decimal places.");
  }

  const whole = Number(match[1]);
  const fraction = Number((match[2] || "").padEnd(2, "0"));
  const minor = whole * 100 + fraction;
  if (!Number.isSafeInteger(minor)) {
    throw new Error("Amount is too large.");
  }
  return minor;
}

function createPlatformFeeQuote(service, amountMinor) {
  const rule = PLATFORM_FEE_RULES[service];
  if (!rule) {
    throw new Error("Unsupported service type.");
  }
  if (!Number.isSafeInteger(amountMinor) || amountMinor <= 0) {
    throw new Error("Amount must be a positive amount in the service currency.");
  }
  return Object.freeze({
    service,
    currency: rule.currency,
    serviceAmountMinor: amountMinor,
    platformFeeMinor: rule.fixedFeeMinor,
    providerFeeMinor: null,
    providerFeeStatus: "not_quoted",
    totalBeforeProviderFeesMinor: amountMinor + rule.fixedFeeMinor
  });
}

module.exports = {
  PLATFORM_FEE_RULES,
  createPlatformFeeQuote,
  parseMoneyToMinor
};
