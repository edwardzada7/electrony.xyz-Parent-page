"use strict";

const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const test = require("node:test");
const { createPostgresPersistence } = require("./postgres-persistence");

const hasAuthorizedSandboxDatabase = Boolean(
  process.env.BILLS_POSTGRES_INTEGRATION_TEST === "true"
  && process.env.BILLS_TEST_DATABASE_IS_SANDBOX === "true"
  && process.env.BILLS_RUNTIME_DATABASE_URL
);

function verification(reference, status, amountMinor, currency) {
  return {
    verified: true,
    reference,
    status,
    amountMinor,
    currency,
    verifiedAt: new Date().toISOString()
  };
}

test("deployed PostgreSQL persists an order, payment, webhook, and single vend claim", {
  skip: !hasAuthorizedSandboxDatabase
    ? "Set both sandbox-test confirmations and BILLS_RUNTIME_DATABASE_URL to run against the authorized sandbox database."
    : false
}, async () => {
  const persistence = createPostgresPersistence(
    process.env.BILLS_RUNTIME_DATABASE_URL,
    undefined,
    process.env
  );
  const testIdentifier = `electrony-postgres-integration-test-${crypto.randomUUID()}`;
  const quoteReference = `${testIdentifier}-quote`;
  const orderReference = `${testIdentifier}-order`;
  const merchantReference = `${testIdentifier}-merchant`;
  const providerReference = `${testIdentifier}-provider`;
  const webhookEventId = `${testIdentifier}-webhook`;
  const amountMinor = 15000;
  const platformFeeMinor = 10000;
  const totalAmountMinor = amountMinor + platformFeeMinor;
  const guestAuthorization = {};

  try {
    const readiness = await persistence.getReadiness();
    assert.equal(
      readiness.status,
      "connection_verified",
      "The configured runtime database must pass the live schema and security readiness checks."
    );
    assert.equal(readiness.securityStatus, "controls_verified");

    await persistence.createFeeQuote({
      quoteReference,
      serviceType: "airtime",
      providerCode: "integration-test-provider",
      productCode: "integration-test-product",
      customerReference: "integration-test-recipient",
      amountMinor,
      platformFeeMinor,
      providerFeeMinor: 0,
      currency: "NGN",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      metadata: { testIdentifier }
    });

    const createdOrder = await persistence.createOrderFromQuote({
      orderReference,
      quoteReference,
      metadata: { testIdentifier }
    });
    guestAuthorization.guestOrderSecret = createdOrder.guestOrderSecret;
    assert.equal(createdOrder.order_reference, orderReference);
    assert.equal(Number(createdOrder.total_amount_minor), totalAmountMinor);

    const retrievedOrder = await persistence.getOrderByReference(orderReference, guestAuthorization);
    assert.equal(retrievedOrder.payment_status, "pending");
    assert.equal(retrievedOrder.fulfilment_status, "not_started");

    const attempt = await persistence.createPaymentAttempt({
      orderReference,
      provider: "monnify",
      merchantReference,
      amountMinor: totalAmountMinor,
      currency: "NGN",
      metadata: { testIdentifier }
    });
    assert.equal(attempt.status, "initiated");

    await persistence.recordVerifiedPaymentAttemptStateChange({
      merchantReference,
      orderReference,
      status: "pending",
      verification: verification(merchantReference, "pending", totalAmountMinor, "NGN")
    });
    await persistence.recordVerifiedPaymentAttemptStateChange({
      merchantReference,
      orderReference,
      status: "failed",
      verification: verification(merchantReference, "failed", totalAmountMinor, "NGN")
    });
    await persistence.recordVerifiedPaymentAttemptStateChange({
      merchantReference,
      orderReference,
      status: "review_required",
      verification: verification(merchantReference, "review_required", totalAmountMinor, "NGN")
    });
    await persistence.recordVerifiedPaymentAttemptStateChange({
      merchantReference,
      orderReference,
      status: "successful",
      providerReference,
      verification: verification(merchantReference, "successful", totalAmountMinor, "NGN")
    });

    const savedAttempt = await persistence.getPaymentAttemptByMerchantReference(
      merchantReference,
      orderReference
    );
    assert.equal(savedAttempt.status, "successful");
    assert.equal(savedAttempt.provider_reference, providerReference);
    const paidOrder = await persistence.getOrderByPaymentReference(providerReference, guestAuthorization);
    assert.equal(paidOrder.payment_status, "paid");
    assert.equal(paidOrder.payment_reference, providerReference);

    const webhook = {
      provider: "monnify",
      providerEventId: webhookEventId,
      eventType: "sandbox-persistence-test",
      merchantReference,
      payload: { testIdentifier }
    };
    const firstEvent = await persistence.recordWebhookEvent(webhook);
    const repeatedEvent = await persistence.recordWebhookEvent(webhook);
    assert.equal(firstEvent.duplicate, false);
    assert.equal(repeatedEvent.duplicate, true);
    assert.equal(repeatedEvent.event.provider_event_id, webhookEventId);
    assert.ok(await persistence.claimWebhookEvent("monnify", webhookEventId));
    assert.equal(await persistence.claimWebhookEvent("monnify", webhookEventId), null);
    const completedEvent = await persistence.completeWebhookEvent({
      provider: "monnify",
      providerEventId: webhookEventId,
      status: "processed"
    });
    assert.equal(completedEvent.processing_status, "processed");

    const vendClaim = await persistence.claimVendOperation(orderReference);
    assert.equal(vendClaim.payment_status, "paid");
    assert.equal(vendClaim.fulfilment_status, "processing");
    await assert.rejects(
      persistence.claimVendOperation(orderReference),
      { code: "state_conflict" }
    );

    const finalOrder = await persistence.getOrderByReferenceForInternalUse(orderReference);
    assert.equal(finalOrder.payment_status, "paid");
    assert.equal(finalOrder.payment_reference, providerReference);
    assert.equal(finalOrder.fulfilment_status, "processing");
    assert.deepEqual(finalOrder.metadata, { testIdentifier });
  } finally {
    await persistence.close();
  }
});
