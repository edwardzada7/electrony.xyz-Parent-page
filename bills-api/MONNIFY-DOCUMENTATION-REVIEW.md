# Monnify documentation review and integration contract

## Executive result

**Official-contract verification is blocked.** On 2026-11-18, the documentation landing page and each of the five Monnify pages cited by this repository returned HTTP 403. The response was a Cloudflare access-denied page. The wallet-balance page cited by the README also returned HTTP 403. Therefore this review does not claim that any Monnify API details below were verified against official documentation.

The repository already records some Bills Payment paths and request/response assumptions. Those are reported as **implementation observations**, not as official API contract. Unit tests use mocked responses and do not provide evidence of Monnify behavior. No fields, enum meanings, retry rules, or status mappings should be enabled on this evidence.

No application, database, deployment, or environment configuration was changed. Payment and vending remain disabled. No financial request was made.

## Source access and evidence

The following exact URLs were requested through the documentation fetcher; each returned HTTP 403. A `curl -IL` check of the landing page also returned HTTP 403 from Cloudflare. No page body containing documentation was available to inspect.

| Page title as referred to by this repository (not independently verified as the page title) | Exact official URL | Result |
| --- | --- | --- |
| Monnify developer documentation landing page | <https://developers.monnify.com/> | HTTP 403; documentation not accessible |
| Bills Payment workflow guide | <https://developers.monnify.com/docs/bills-payment/process-a-bill> | HTTP 403; documentation not accessible |
| Settlement and merchant payable | <https://developers.monnify.com/docs/bills-payment/settlement-process> | HTTP 403; documentation not accessible |
| Collection transaction verification | <https://developers.monnify.com/docs/collections/manage-payments/verify-transactions> | HTTP 403; documentation not accessible |
| Checkout API | <https://developers.monnify.com/docs/collections/one-time-payments/checkout-api> | HTTP 403; documentation not accessible |
| Webhooks | <https://developers.monnify.com/docs/webhooks> | HTTP 403; documentation not accessible |
| Wallet balance API (readme reference; not evidence of a Bills operational balance API) | <https://developers.monnify.com/docs/wallets/wallet-balance> | HTTP 403; documentation not accessible |

The actual official page titles, content, code samples, and any linked authentication, validation, vending, requery, settlement-report, or balance pages could not be read. In particular, this review cannot confirm that the repository's page labels accurately match official page titles or that a cited page covers the operation attributed to it.

## Contract extraction: official facts unavailable

The operation records below intentionally say **not verified** where the official sources could not be inspected. Endpoint strings shown under “repository observation” are present in the existing adapter or README only. They are not represented as a documented Monnify contract.

| Operation / documentation page | Method and endpoint | Authentication | Request fields | Response fields and statuses | Retry / idempotency | Unresolved contract |
| --- | --- | --- | --- | --- | --- | --- |
| Collections token generation; exact official page title and URL not present in the inspected repository references | Not verified | Not verified | Not verified | Not verified | Not verified | Obtain the exact official page URL, method, credentials, token response, expiry, refresh, and error behavior. Do not reuse the VAS authentication contract by assumption. |
| Hosted Collections checkout initialization; repository reference “Checkout API” | [Checkout API](https://developers.monnify.com/docs/collections/one-time-payments/checkout-api), inaccessible | Not verified | Not verified | Not verified | Not verified | Confirm required fields, amount/currency rules, contract-code placement, merchant transaction reference constraints, provider transaction reference, checkout URL, success/error response, redirect behavior, expiry, and how to resolve duplicate or timed-out calls. |
| Collections payment verification; repository reference “Collection transaction verification” | [Verify transactions](https://developers.monnify.com/docs/collections/manage-payments/verify-transactions), inaccessible | Not verified | Not verified | Not verified | Not verified | Confirm method, endpoint, lookup key, authoritative fields binding merchant/provider references, contract, amount and currency, all status values and meanings, visibility delay, “not found” finality, polling guidance, and reversal/refund outcomes. |
| Collections transaction requery, if distinct from verification | No exact official page URL or endpoint was available | Not verified | Not verified | Not verified | Not verified | Confirm whether verification is read-only and sufficient for recovery or whether a separate requery operation exists. Do not infer this from VAS requery. |
| Webhook delivery and authentication; repository reference “Webhooks” | [Webhooks](https://developers.monnify.com/docs/webhooks), inaccessible | Not verified | Not verified | Not verified | Not verified | Confirm exact event names and payloads, stable event identifier, signature header, algorithm, key material/rotation, timestamp and replay handling, exact raw-body/canonicalization requirement, sandbox versus production behavior, acknowledgments, duplicate delivery, retry schedule, and which events require independent verification. |
| VAS authentication; exact official page title and URL not present in the inspected repository references | Repository observes `POST /api/v1/auth/login`; not officially verified | Repository sends HTTP Basic using API key and secret | Repository sends no JSON body | Repository expects an envelope containing `requestSuccessful`, `responseCode`, and `responseBody.accessToken` plus optional `expiresIn` | Repository caches the token until a configured refresh margin; official expiry and retry semantics not verified | Confirm official authentication URL, method, fields, token type, expiry, credentials, and whether Collections and Bills Payment use the same credentials/token scope. |
| VAS categories and billers; repository reference “Bills Payment workflow guide” | Repository observes `GET /api/v1/vas/bills-payment/biller-categories` and `GET /api/v1/vas/bills-payment/billers?categoryCode=…`; not officially verified | Repository sends Bearer token | Repository sends `categoryCode` for biller listing; category request has no query in current code | Repository expects `responseBody.content`; category `code`/`name`, biller `code`/`name`, optional `nextPage` and category relationships are consumed | Repository follows `nextPage` for billers; catalogue cache is five minutes. Official pagination and cache semantics not verified | Confirm official methods, query names, pagination convention and terminal value, category/biller response shape, category codes for airtime, data, electricity and cable, and availability/activation errors. |
| VAS products; repository reference “Bills Payment workflow guide” | Repository observes `GET /api/v1/vas/bills-payment/biller-products?billerCode=…`; not officially verified | Repository sends Bearer token | Repository sends `billerCode`; category is used locally to qualify lookup | Repository consumes `responseBody.content`, product `code`/`name`, optional category, `minAmount`, `maxAmount`, `price`, `priceType` | Repository follows `nextPage` and caches products for five minutes. Official pagination, freshness, and product semantics not verified | Confirm required filters, exact field types/units, fixed/open amount meanings, limits, fees, product availability and category-to-product binding. |
| Customer validation; repository reference “Bills Payment workflow guide” | Repository observes `POST /api/v1/vas/bills-payment/validate-customer`; not officially verified | Repository sends Bearer token | Repository sends `{ productCode, customerId }` | Repository expects `responseBody.vendInstruction.requireValidationRef`; if true, requires `validationReference`; optionally retains `customerName`, `priceType`, `price`, and sanitized provider response | No validation-reference expiry, reuse, retry, or lifetime behavior is implemented or verified | Confirm required fields by service, identifier formats, success/failure states, returned display-safe fields, validation-reference lifetime/one-time rules, and binding to product, customer, amount, and vend. |
| Airtime and data vending; repository reference “Bills Payment workflow guide” | Repository observes `POST /api/v1/vas/bills-payment/vend`; not officially verified | Repository sends Bearer token | Repository sends `productCode`, `customerId`, `vendAmount`, `vendReference`; conditionally `validationReference`, `emailAddress`, `phoneNumber` | Repository requires a returned string `vendStatus` and `vendReference`; it returns other fields without a verified mapping | No automatic retry after uncertain POST; requery is attempted only by a caller, but no public vending workflow invokes it | Confirm airtime/data product and recipient rules, amount and unit semantics, optional fields, charges, accepted/final/pending statuses, provider transaction reference field, duplicate reference behavior, and whether a timeout may be retried. |
| Electricity vending; repository reference “Bills Payment workflow guide” | Same repository-observed vend operation above; no verified service-specific contract | Same repository-observed Bearer token; not verified | Same generic payload above; not verified | Exact prepaid/postpaid response, token/receipt fields and status meanings not verified | Not verified | Confirm supported DisCos/products and meter types, meter validation requirements, amount limits/units, token/receipt fields, validation-reference rules, transaction-reference semantics, and pending recovery. |
| Cable TV vending; repository reference “Bills Payment workflow guide” | Same repository-observed vend operation above; no verified service-specific contract | Same repository-observed Bearer token; not verified | Same generic payload above; not verified | Exact package/account response and status meanings not verified | Not verified | Confirm supported operators/packages, account identifier rules, package/amount behavior, validation-reference rules, and pending recovery. |
| VAS pending transaction requery; repository reference “Bills Payment workflow guide” | Repository observes `GET /api/v1/vas/bills-payment/requery?reference=…`; not officially verified | Repository sends Bearer token | Repository sends query parameter `reference` | Repository requires `responseBody.vendStatus`; other fields are passed through | Current adapter does not poll automatically; no official polling interval, backoff, terminal-state, not-found, or retry contract verified | Confirm lookup reference, all statuses and finality, visibility delay, polling limits/backoff, read-only behavior, and safe action after an inconclusive requery. |
| Settlement and merchant payable; repository reference “Settlement and merchant payable” | [Settlement process](https://developers.monnify.com/docs/bills-payment/settlement-process), inaccessible | Not verified | Not verified | Not verified | Not verified | Confirm settlement timing, settlement references, fees/deductions, reports/API and fields, reversals, reconciliation periods, and how a transaction joins to Collections and Bills Payment records. |
| Bills Payment operational balance/funding | No applicable official page or endpoint was verified; the repository also cites the inaccessible [Wallet balance API](https://developers.monnify.com/docs/wallets/wallet-balance) | Not verified | Not verified | Not verified | Not verified | Confirm whether a merchant Bills Payment operational balance exists, its funding and reserve requirements, whether it is separate from Collections settlement funds, available balance endpoint, low-balance thresholds/notifications, and funding failure behavior. A customer wallet-balance API must not be treated as an operational VAS balance API. |

### Webhook-signature contradiction status

No official webhook prose or code sample could be retrieved, so there is no evidence here of two contradictory signature descriptions to quote or choose between. The repository currently implements no signature algorithm and rejects webhook calls. If Monnify’s documentation, support response, or dashboard describes multiple signature methods or raw-body formats, preserve each wording and example and request written clarification before implementing verification; do not select one by assumption.

## Repository compatibility assessment

### Exact implementation seams

| Capability | Current seam and behavior |
| --- | --- |
| Collections initialization | `createMonnifyReservation()` in `server.js` is a fail-closed stub. `POST /api/payments/session` is the orchestration seam. No Collections adapter exists in `bills-api/adapters/`. |
| Payment verification | `verifyMonnifyPayment()` in `server.js` is a fail-closed stub; `POST /api/payments/verify` supplies a stored order reference and payment attempt. Browser input does not establish payment. |
| Webhooks | `handleWebhook()` in `server.js` returns 503. It does not read or authenticate an event body. |
| VAS auth, catalogue, validation, vend and requery | `buildProviderAdapter()` in `provider-adapter.js` contains the Monnify Bills adapter. `server.js` uses it for catalogue, plans, and validation; there is no public Monnify vend route/caller. |
| Other provider adapters | `adapters/marplerad-adapter.js` and `adapters/teloadly-adapter.js` are explicit fail-closed placeholders and do not implement Monnify. |
| Persistence | `postgres-persistence.js` provides order, payment-attempt, webhook-event, state-transition and one-time vend-claim primitives. It does not implement a provider call or a durable vending-attempt workflow. |

### Comparison by evidence category

**Already implemented safely in the repository (not verified as Monnify-compatible):**

- Server-side VAS credential handling; sandbox-only base URL checks; Bearer token use for VAS calls; no production URL fallback.
- Category/biller/product retrieval, category-qualified product lookup, catalogue caching, validation, a vend request builder, and a VAS requery method.
- Validation-reference preservation when the current validation response says it is required.
- Uncertain vend POST outcomes are not automatically repeated by the adapter.
- Collections initialization, verification, and webhooks fail closed. A hard-coded false contract-verification constant remains in place; setting `PAYMENTS_BLOCKED=false` alone cannot enable payment routes.
- Payment state persistence rejects a direct success transition without a matching verification object; order fulfilment requires paid state and provider confirmation.

**Implemented, but requires correction or a contract decision before use:**

- VAS request and response shapes, token handling, pagination, `responseCode === "0"` success envelope, validation reference handling, and all endpoint paths are repository assumptions until reconciled against an accessible official contract.
- `vendStatus` is accepted as any string. Tests deliberately include several mocked status strings, including nonstandard values; no status is mapped to successful, failed, or pending. Do not treat those fixtures as provider-supported status values.
- The payment verify controller currently passes a successful status to persistence after the verification seam returns. The seam is presently a throwing stub, but once implemented it must normalize only an authoritative provider result and must not report every non-error result as successful.
- The checkout controller calls the external reservation seam before recording a payment attempt. An initialization error currently moves a pending order to failed, although after a network timeout the provider may have created a checkout. That outcome must remain resolvable by the documented idempotency/query contract rather than being presumed absent.
- The payment controller exposes a stored checkout URL when an attempt exists. Its trust and expiry lifecycle must be tied to the verified checkout response and provider behavior.

**Missing implementation:**

- Collections adapter/token use, hosted checkout initialization, authoritative payment verification/requery, provider status mapping, and reference/amount/currency/contract matching.
- Webhook raw-body capture, signature verification, event parsing, event-to-order binding, processing, and acknowledgment response.
- A durable pre-call checkout initialization claim/recovery protocol, based on the provider’s exact idempotency behavior.
- A vending orchestration and durable vending-attempt record, including request fingerprint, dispatch state, provider response/reference, uncertainty, requery outcome, and recovery ownership.
- Automatic or operator-guided pending-payment/vend recovery, payment-to-vend reconciliation, settlement reconciliation, and explicit refund/manual-review workflow.
- Verified operational VAS balance/funding checks or low-balance handling.
- Officially validated mappings for airtime/data, electricity and cable product, validation, vend, and pending/requery behavior.

**Documentation insufficient to decide:**

- Whether Collections and VAS share an auth token, credentials, merchant reference namespace, retry policy, or environment.
- Whether a repeated checkout/vend reference is idempotent and what response a duplicate produces.
- Whether webhook events are signed using a raw-body HMAC, another serialization, or a different method; whether sandbox and production differ.
- Whether the VAS `reference` used for requery is the merchant `vendReference`, a provider reference, or another identifier.
- Which Collections and VAS statuses are final, reversible, or retryable; whether “not found” is conclusive.
- Whether Monnify exposes a merchant operational Bills Payment balance or low-balance notification, and how Collections settlement relates to the VAS funding source.

No operation can be classified as “implemented correctly according to official documentation” until the source pages are accessible and the relevant contract assertions have been compared.

## Payment and vending lifecycle against persistence

These are capabilities observed in the code, not guarantees of an end-to-end live flow.

| Lifecycle need | Current persistence behavior | Gap / required contract-aware design |
| --- | --- | --- |
| Durable checkout initialization claim | Order creation from a quote is transactionally serialized and consumes the quote. | No pre-call initialization claim exists. The external checkout call can occur before `bill_payment_attempts` is inserted. Add an atomic durable claim keyed by the merchant reference before the call, record an initialization state/outcome, and recover the same reference after crashes. Whether the provider accepts that reference idempotently must be confirmed first. |
| Duplicate checkout prevention | Payment-attempt insert is serialized by merchant-reference advisory lock and rejects a conflicting order/provider/amount/currency reuse. | This protects database inserts, not the pre-insert external request. Duplicate requests can reach the provider before the row exists. A unique database key cannot undo duplicate external sessions. |
| Authoritative payment verification | `recordVerifiedPaymentAttemptStateChange()` checks exact stored merchant reference, amount in minor units, currency, verification flag/status/timestamp and transitions attempt/order in one transaction. | The provider-facing verification adapter and normalized proof are absent. Bind provider transaction reference, merchant reference, amount, currency, contract/merchant identity and an allowed terminal success state; distinguish pending, failure, reversal/refund and mismatch. Never trust a browser return. |
| Webhook deduplication | `recordWebhookEvent()` inserts under `(provider, provider_event_id)` uniqueness; `claimWebhookEvent()` conditionally claims `received`/`failed` events; completion requires a claimed `processing` event. | Correct deduplication depends on a stable authenticated provider event ID that is not yet documented. A worker crash after claiming leaves `processing`; there is no lease or stale-claim recovery. Acknowledgment policy must follow documented provider retry behavior. |
| Atomic vending claim | `claimVendOperation()` makes one conditional transition from paid + `not_started` to `processing`. | It is one order-level claim, not a durable outbound transaction record. A crash can strand `processing`; no safe lease/reclaim/requery state machine or attempt identity exists. |
| Durable vending attempt | No separate vending-attempt table/workflow or dispatch record is implemented. | Record the intended operation and stable merchant reference before external dispatch; then persist dispatch, response, provider transaction reference, status, timestamps, uncertain outcome and requery observations. Do not repeat an ambiguous vend unless the official contract proves it safe. |
| Pending transaction recovery | The VAS adapter exposes `requery(reference)` only. No payment requery adapter or scheduled recovery worker is present. | Add a bounded, observable recovery process only after Monnify confirms reference semantics, status finality, polling delay/backoff, “not found” meaning and retry rules. Keep inconclusive outcomes pending/review-required. |
| Payment/vending reconciliation | Order, attempt, provider transaction reference and webhook event can be persisted; there is no reconciliation job/report flow. | Reconcile authoritative payment amount/reference against exactly one order, then exactly one vending attempt and provider outcome. Record mismatches and late success for operator review; do not silently vend or charge again. |
| Refund/manual review | State enums include `refunded` and `review_required`; transitions allow some review resolution. | No refund API/workflow or documented compensation policy exists. Preserve evidence and route mismatched, reversed, late, duplicate, or ambiguous transactions to manual review until Monnify confirms refund/chargeback responsibilities and operations. |
| Settlement and operating funds | No settlement import/reporting or operational balance check is implemented. | Establish settlement report identifiers, fees, timing, funding source and VAS balance separately. Do not assume a successful collection replenishes the Bills Payment operational balance. |

## Questions requiring Monnify confirmation

Request accessible, current documentation or written answers tied to the account’s sandbox and production products:

1. Provide the exact current page URLs and titles for Collections authentication, hosted checkout, transaction verification/requery, webhooks, Bills Payment authentication, catalogue, customer validation, vend, vend requery, settlement reporting, and operational balance/funding.
2. For every endpoint, confirm method, environment base URL, required headers/authentication, required and optional fields, field types/units, success and error response examples, and all status values with finality/reversibility meanings.
3. For Collections, confirm uniqueness scope and idempotency of the merchant reference, behavior on duplicate initialization, handling of a client timeout after provider acceptance, checkout expiry/redirect guarantees, and how to query an unknown initialization outcome.
4. For payment verification, confirm the authoritative identity and fields that must match the merchant transaction, provider reference, contract, amount and currency. Explain eventual consistency, pending/not-found semantics, reversals/refunds, and recommended query cadence.
5. For webhooks, confirm exact event names and payload schemas; a stable event identifier; signature header and verification algorithm; secret/key selection and rotation; timestamp/replay rules; exact raw-body or canonical serialization requirements; sandbox/production differences; required acknowledgment codes/body; duplicate behavior and retry schedule; and whether an independent verify call is mandatory for each event.
6. If any official webhook sample or documentation describes a signature algorithm or serialization differently from another section, identify which is authoritative for this account/environment and provide a test vector (raw body, headers, key, expected digest). Do not ask the implementation team to choose between conflicting descriptions.
7. For Bills Payment, confirm exact auth scope and endpoint paths; catalogue pagination; category/biller/product response fields; supported service categories; product amount limits, units, fees and availability; customer ID rules; validation-reference lifetime/reuse/binding; and response/error examples by service.
8. For airtime/data, electricity and cable TV separately, confirm required vend fields, duplicate-reference semantics, provider transaction-reference field, pending/failure/success statuses, deliverable fields such as electricity tokens, requery reference and status, and safe behavior after timeout or incomplete response.
9. Confirm whether VAS requery is read-only, what each “not found”/pending response means, when it becomes authoritative, and the recommended maximum polling/backoff window before manual review.
10. Explain Bills Payment funding: whether an operational balance exists, whether it is separate from Collections funds/settlement, the official balance endpoint and scope, low-balance notification options, prefunding/settlement timing, and how to correlate merchant settlements with Collections and VAS transactions.
11. Confirm transaction reconciliation and refund/manual-review responsibilities for paid-but-not-vended, vend-unknown, duplicate, reversed, disputed, or mismatched transactions.

## Recommended implementation sequence after documentation is accessible

1. Save or link the authoritative page versions and support answers; resolve terminology, endpoint, status, idempotency, and webhook-signature conflicts before coding.
2. Build a contract matrix with exact request/response fixtures and status mappings per product. Keep raw documented statuses separate from internal lifecycle states; reject unknown statuses into a safe pending/review state.
3. Add focused adapter tests for token handling, checkout, verification, webhook verification using official test vectors, VAS operations, timeout ambiguity, duplicates, pending/requery and mismatched reference/amount/currency. Do not use financial transactions until specifically authorized.
4. Design and test the minimal durable initialization claim, webhook stale-claim recovery, vending-attempt record/state machine, and reconciliation evidence needed to cover crashes at every provider-call boundary. Confirm migration/schema changes with the database owner; do not infer them from current schema alone.
5. Implement Collections behind a separate adapter and keep the existing VAS adapter intact except for contract-proven corrections. Keep the existing server orchestration seams and fail-closed behavior until adapter and persistence tests pass.
6. Implement webhook authentication before event processing; deduplicate by the confirmed event identity, independently verify payment as required, and acknowledge only according to the confirmed delivery contract.
7. Implement VAS vend orchestration only after verified payment and operational-funds readiness. Persist the attempt before dispatch, requery uncertain outcomes, and never blindly retry a potentially accepted vend.
8. Add settlement/balance and payment-to-vend reconciliation plus explicit manual-review/refund procedures. Test sandbox behavior with authorization and deployment gates unchanged until the owner approves enablement.
9. Run relevant unit and persistence tests, then obtain explicit approval before changing any payment/vending gate, deployment variable, schema, policy, or grant.

## Worktree preservation and validation

This review did not edit application code, tests, SQL/schema, Supabase policy/grant files, Railway variables, or environment configuration. It did not run SQL, use Monnify credentials, make sandbox/live transactions, install dependencies, commit, or push.

`git diff --check` passed after adding this document; the untracked document was also checked separately with `git diff --no-index --check`. The worktree already contained deletions of eight unrelated vehicle video assets before this review; those deletions are out of scope and were left unchanged.
