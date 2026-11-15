# Monnify support contract handover

## Status and boundaries

This is a contract-gathering checklist, not an enabled integration. Collections checkout, payment verification, webhook processing, and vending remain disabled. Do not infer request/response fields, authentication, signatures, status meanings, retry rules, or endpoints from examples or similarly named Monnify products.

Collections payment and Bills Payment vending are separate provider capabilities. A successful collection does not establish that the Bills Payment operational balance is funded.

## Contracts to obtain

| Operation | Existing internal seam | Exact information still required from Monnify |
| --- | --- | --- |
| Collections checkout initialization | `createMonnifyReservation(transaction)` in `server.js` is a fail-closed stub. Implement the provider call behind a server-side Collections adapter; return only normalized checkout URL and provider transaction reference to the controller. | Sandbox URL and method; authentication and contract-code placement; required request fields and amount/currency semantics; merchant-reference uniqueness/idempotency behavior; exact success/error response fields; redirect and expiry behavior; how to safely resolve timeouts or duplicate requests. |
| Authoritative payment verification | `verifyMonnifyPayment(reference, attempt)` in `server.js` is a fail-closed stub. Normalize an authoritative result for the stored attempt; never trust a browser return. | Verification operation URL/method/auth; lookup reference to send; response fields that bind merchant and provider references, amount, currency, and contract; complete status set and terminal meanings; eventual-consistency/retry behavior; examples for success, failure, pending, reversed/refunded, and mismatches. |
| Webhook authentication and event handling | `handleWebhook` in `server.js` rejects all events. The persistence adapter can record, deduplicate, claim, and complete webhook events. | Delivery headers and signature/authentication scheme; raw-body/canonicalization rules, key rotation and timestamp/replay rules; stable event ID, event names and payload fields; retry/acknowledgment requirements; which events require independent transaction verification and how to handle unknown or contradictory events. |
| Bills Payment validation | `buildProviderAdapter()` exposes `validateCustomer({ productCode, customerId })`; current code calls the documented VAS validation operation and preserves `requireValidationRef` and any returned validation reference. | Confirm required fields and identifier formats for each product type; validation-reference lifetime, one-time/reuse rules and exact error/success fields; authoritative customer details safe to display; provider-fee and validation-to-vend binding rules. |
| Airtime and data vending | `vend({ productCode, customerId, amount, reference, emailAddress, phoneNumber, validation })`; catalogue/product lookup is category-qualified. | Supported network/product codes and test identifiers; fixed versus open amount and units; required recipient/contact fields; provider charges; any validation reference requirements; exact vend response/status meanings, finality, provider transaction reference, and safe retry/requery rules. |
| Electricity vending | Same `vend` interface after catalogue selection and meter validation. | Supported DisCos, prepaid/postpaid products and test meters; exact meter/customer identifier and amount rules; token or receipt fields; provider charges; validation-reference requirements; vend status/finality, transaction reference, and retry/requery behavior. |
| Cable TV vending | Same `vend` interface after catalogue selection and smartcard validation. | Supported operators/packages and test smartcards; package/amount and account identifier rules; provider charges; validation-reference requirements; response/status meanings, transaction reference, and retry/requery behavior. |
| Pending transaction requery | VAS `requery(reference)` exists for vending. No Collections payment requery adapter is implemented. | Separately for Collections and VAS: operation URL/method/auth, lookup reference, all returned states and their meanings, whether “not found” is conclusive, visibility delay, polling limits/backoff, and whether requery is read-only. Define when an uncertain operation may be retried versus held for review. |
| Settlement and reconciliation | Order, payment-attempt and provider references can be persisted; there is no settlement/reconciliation workflow. | Settlement cycle and timing; fees/deductions and amount calculation; reports/API, fields and stable join references; payment-versus-vend reconciliation procedure; operational VAS balance/funding visibility and low-balance behavior; mismatch, reversal, refund, and manual-review process. Confirm whether any applicable operational-balance API exists. |

### Already implemented for the VAS catalogue

The existing Bills adapter and tests cover sandbox authentication, category/biller/product retrieval, category-qualified product lookup, customer validation, vend request construction, preservation of validation references, and a VAS requery call. The repository documents these VAS paths and the workflow guide's `categoryCode`, `billerCode`, `vendAmount`, and `vendReference` fields. Existing tests exercise fixture responses; they do not prove live support behavior or establish a production status mapping. Confirm any discrepancies with support before changing the implementation. Unknown category codes remain unavailable rather than being guessed.

## Persistence and duplicate-operation assessment

The PostgreSQL adapter already supports atomic quote consumption/order creation; transactionally created payment attempts keyed by merchant reference; guarded payment and fulfilment state transitions; unique payment/provider references; idempotent webhook event recording and single-claim processing; and an atomic claim that only lets one worker move an authoritatively paid order from `not_started` to `processing` for vending.

Those are useful primitives, not a complete no-duplicate lifecycle guarantee:

- Payment attempts are currently persisted after the external checkout initialization. There is no durable pre-call initialization claim, so competing/restarted requests cannot be proven to make at most one external initialization unless the official Collections idempotency contract and a persistence claim/recovery flow are implemented.
- The atomic vend claim prevents a second claim, but there is no durable vending-attempt record/workflow for dispatch, response, timeout requery, and recovery. A claimed order can remain `processing`; the adapter alone does not orchestrate safe recovery.
- No live Monnify or deployed-PostgreSQL operation was performed in this handover. The opt-in PostgreSQL integration test was skipped because its explicit sandbox confirmations and database configuration were not supplied.

Do not add provider-status mappings or persistence schema based on assumptions. First map verified provider states to existing transitions; add a narrowly scoped persistence change only if the official contract and failure/recovery cases prove the current schema and primitives insufficient. Do not alter database security policies, grants, production configuration, or data for this work.

## Sandbox and enablement guard

`BILLS_SANDBOX_MODE` is read at process startup; sandbox access additionally requires the exact sandbox environment/base URL and credentials. Production Monnify configuration is rejected. `MONNIFY_PAYMENT_CONTRACT_VERIFIED` is hard-coded false; independently, `PAYMENTS_BLOCKED` must be set to `false` before payment routes could proceed. The payment-session, verify, and webhook handlers are gated; the VAS `vend` method is not wired to a public vending operation. Do not change these gates or enable checkout/vending as part of receiving or reviewing support documentation.

## Files expected to change after specifications arrive

- Collections adapter implementation: add `bills-api/adapters/monnify-collections-adapter.js`; wire the existing fail-closed stubs and verified orchestration in `bills-api/server.js`.
- Collections and webhook contract tests: add adapter tests and update `bills-api/server.test.js`. Keep cases for unknown/mismatched/pending states and uncertain external outcomes.
- Bills Payment contract deltas: change `bills-api/provider-adapter.js` and `bills-api/provider-adapter.test.js` only where support specifications differ from the current VAS implementation; update `bills-api/server.js` only for required orchestration changes.
- Duplicate prevention/recovery gap: update `bills-api/postgres-persistence.js`, `bills-api/postgres-persistence.test.js`, and `bills-api/postgres-persistence.integration.test.js` if an atomic pre-call collection claim or durable vending-attempt/reconciliation workflow is needed. A schema/migration change is conditional, not presumed.
- Frontend and configuration: update `src/bills-app.js` and `src/bills-app.test.js` only if the verified redirect/return contract changes the existing generic flow; update `.env.example` only for newly confirmed server-side settings. Update `bills-api/README.md` with the verified contract after implementation.

No implementation, environment, database, or security-policy changes are made by this handover.
