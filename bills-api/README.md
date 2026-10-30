# Electrony Bills API

The Bills app keeps payment creation and verification server-side in this isolated backend directory.

## Local development

```bash
npm run dev:api
```

The API process also serves the website files from the repository root. For a single-service Railway deployment, the root [`Dockerfile`](../Dockerfile) uses the official Node.js 22 Alpine image, installs the locked dependencies with `npm ci`, and starts `node bills-api/server.js`. The root [`railway.json`](../railway.json) selects that Dockerfile and configures `/health` as the healthcheck. Set the service root directory to `/` and deploy as an application, not a static site. It listens on Railway's `PORT` and routes `/api/...` and `/health` to the API while serving other public paths as website files. The frontend uses same-origin API paths outside local development. `npm run dev` remains the separate local Python website server.

Production Bills API routes remain fail-closed. Fee quote creation/lookup and order-status lookup use the Bills PostgreSQL persistence adapter and its active backend pool. The payment-session controller is wired to create orders and log payment attempts through the same adapter, but payment initialization remains blocked until its separate authorization and provider-verification requirements are met. Transactional writes roll back on failure. `/health` is served by the Node API process (Railway in the combined deployment) and performs a read-only `SELECT 1` through its backend PostgreSQL pool when `BILLS_RUNTIME_DATABASE_URL` is set. The Vercel deployment is a static frontend build and does not proxy `/health` to Railway; use the Railway service URL to check API readiness. Health reports connection separately from role, table, grant, and RLS-policy checks, and does not expose credentials, hostnames, SQL, or raw database errors. If a security query fails after connectivity succeeds, `/health` preserves the safe failure category and reports `checks.diagnosticFailure.stage` and `.code`; unverified diagnostic details are `null`, not empty arrays. The `MAINTAIN` privilege check is only evaluated on PostgreSQL 17 and later. Server logs classify connection failures as DNS, refused, timeout, TLS, authentication, missing database, or unknown and include only a token-shaped error code when available; they never log the raw error. A successful connection is not proof of policy semantics or business-operation authorization.

Expected endpoints:

- `GET /health`
- `POST /api/contact` — Hardware and Energy email enquiries (requires server-only Resend configuration)
- `GET /api/fees/quote?service=electricity|airtime|data|bills&amount=...&network=...&plan=...`
- `POST /api/payments/session`
- `POST /api/payments/verify`
- `GET /api/payments/status`
- `POST /api/payments/webhook`

The quote request accepts `service` and `amount`; `network` and `plan` are required for supported data bundles and plans. It returns `{ ok, quote, quoteToken }`; the quote includes `service`, `currency`, `serviceAmountMinor`, `platformFeeMinor`, `providerFeeMinor`, `providerFeeStatus`, and `totalBeforeProviderFeesMinor`. Electricity and airtime enforce their existing amount maxima, while data and TV bills enforce the configured plan prices. The quote contains Electrony's NGN 100 platform fee only; it does not invent a provider fee.

## Vercel frontend and Railway API

The frontend is a static site: browser JavaScript cannot read Railway/Vercel environment variables at runtime. Set the Vercel build environment variable `BILLS_API_BASE_URL` to the Railway API's HTTPS base URL (origin only, without an API path), then deploy or redeploy. The parent Vercel project runs `npm run build:vercel -- --site parent`; that build injects the public URL into the generated `dist/src/config.js`. Do not put credentials in this variable. Local development continues to use `http://localhost:4174`.

On Railway, set `BILLS_APP_URL` to the exact deployed Bills app URL, including `/bills/app/`; the API permits that origin and the local development origins. For any other Vercel/custom frontend domains, set `BILLS_ALLOWED_ORIGINS` to a comma-separated list of exact origins. CORS does not permit wildcard origins or credentials. Changes to `BILLS_API_BASE_URL` require a new Vercel deployment because it is compiled into the static frontend at build time.

The repository does not contain an actual Railway deployment URL or a Vercel project/domain configuration. Do not substitute a guessed URL; use the Railway service's assigned public HTTPS domain.

### Hardware and Energy contact enquiries

The combined Railway API and the Vercel function at `/api/contact` use the same server-side Resend delivery module. Configure `CONTACT_EMAIL` to the confirmed recipient, `CONTACT_FROM_EMAIL` to a sender address/domain verified in Resend, and `RESEND_API_KEY` as a private server-side variable. For the Vercel function, define the variables in Vercel's project environment settings; for the Railway route, define them in the Railway service variables. Do not add them to the static frontend or `BILLS_API_BASE_URL`.

Requests are JSON-limited to 16 KiB, validated on the server, rate-limited per client, and include a hidden honeypot field. Missing delivery settings return `503`; a success response is sent only after Resend accepts the message. Provider acceptance does not guarantee inbox delivery. The destination must be supplied by the site owner; this repository does not choose one.

## Required environment configuration

This project is intentionally isolated from the parent Electrony site. Keep Bills credentials in a real `.env` file or a deployment secret manager and never commit secrets into source control.

Copy the sample variables from the repository root `.env.example` and update the values before running the Bills API.

The example Monnify values are for local sandbox development only. When `NODE_ENV=production`, the API does not default the payment, redirect, or webhook URLs to sandbox/localhost. Configure `MONNIFY_BASE_URL` as an HTTPS non-sandbox endpoint and set `BILLS_PAYMENT_REDIRECT_URL` and `BILLS_WEBHOOK_BASE_URL` to HTTPS URLs. The API reports missing or unsafe payment configuration as unavailable; it does not select sandbox implicitly in production.

Payment routes are blocked by default and remain blocked even if `PAYMENTS_BLOCKED=false`; a code-level contract-verification gate is intentionally false. The server contains transaction-query and webhook-processing code, but their complete Monnify contract and sandbox behavior have not been verified. Configuration alone does not make payments available.

### Electrony identity and provider migration

The migration [`migrations/20261030_electrony_identity_financial_services.sql`](./migrations/20261030_electrony_identity_financial_services.sql) adds customer/provider mapping tables and financial-service audit/ownership structures. It has not been applied automatically and must be reviewed and applied by the database owner.

Migration impact:
- Adds only new tables; it does not recreate or alter existing Bills tables.
- Uses the Supabase Auth UUID as the customer key and no longer creates Bills-local password accounts.
- Does not add `auth.uid()` policies because the Railway runtime role uses direct PostgreSQL authentication and may not receive Supabase JWT request context. Server-side ownership checks remain mandatory; Supabase RLS is a separate future migration to verify.
- Requires the database owner to verify extensions, runtime role grants, policy behavior, and all existing Bills migrations before production use.

Bills accepts verified Supabase Auth access tokens from the configured Electrony identity project for central registered routes. It also retains the legacy Bills JWT path temporarily for existing customers and their existing records. Guest utility routes do not require a token. Legacy `/api/auth/register` and `/api/auth/login` routes remain available only as transition compatibility endpoints and must not be used for new Electrony Accounts identity creation.

Marplerad and Teloadly adapters are intentionally provider-independent and fail closed. Official API contracts, sandbox credentials, webhook verification rules, and approved payment flows are still required before live operations.

### Monnify sandbox variables

- `MONNIFY_API_KEY`
- `MONNIFY_SECRET_KEY`
- `MONNIFY_CONTRACT_CODE`
- `MONNIFY_BASE_URL`

### Bills-specific configuration

- `PAYMENTS_BLOCKED`
- `ELECTRONY_BILLS_PORT`
- `BILLS_APP_URL`
- `BILLS_API_BASE_URL`
- `BILLS_PAYMENT_REDIRECT_URL`
- `BILLS_WEBHOOK_BASE_URL`
- `BILLS_DATABASE_URL`
- `BILLS_RUNTIME_DATABASE_URL` (Railway backend variable only; connect as `electrony_bills_runtime`; PostgreSQL TLS certificate verification is required; never include it in browser/frontend variables)
- `BILLS_VENDING_PROVIDER`
- `BILLS_PROVIDER_BASE_URL`
- `BILLS_PROVIDER_API_KEY`
- `BILLS_PROVIDER_SECRET_KEY`
- `BILLS_PROVIDER_WEBHOOK_SECRET`

`BILLS_JWT_SECRET` must be a private random value of at least 32 characters. The API uses it to sign short-lived account tokens. Password hashes and user references are stored in the local JSON persistence directory; plaintext passwords and tokens are not persisted by the API.

`BILLS_PROVIDER_TIMEOUT_MS` bounds each vending-provider request. Valid values are 1–120000 milliseconds; invalid values use the 20000 millisecond default.

## Platform fees and transaction safety

The server-controlled fee table is in `platform-fees.js`. Electricity, airtime, data, and supported bills each have one NGN 100 fee per payment transaction; virtual cards have no fixed NGN fee and use USD product pricing; gift cards have a zero Electrony platform fee. Fee quotes use integer minor units and expire after five minutes. Payment initialization recalculates the quote server-side and rejects a missing, stale, or mismatched quote; client-supplied fees are never authoritative.

The Bills UI no longer supplies example discos, networks, data plans, cable billers, or package prices. It fetches the internal Electricity, Airtime, Data, and Pay Bills catalogue groups from `GET /api/services/catalog`; the backend currently returns empty biller and product arrays with an explicit unavailable status. The server-side `monnify-bills-adapter.js` exposes `listCategories`, `listBillersByCategory`, `listProductsByBiller`, `validateCustomer`, `vendBill`, and `requeryVendReference`; each operation returns unavailable and performs no provider request until activation and the contracts are verified. `categoryCode`, `billerCode`, `productCode`, `validationReference`, merchant `vendReference`, and Monnify `transactionReference` remain separate identifiers. Monnify's [Bills Payment guide](https://developers.monnify.com/docs/bills-payment/process-a-bill) describes this workflow:

| Operation | Verified from the official guide | Still unverified here |
| --- | --- | --- |
| Biller categories | GET Biller Categories; examples include Electricity and Cable TV. | Exact URL, response fields, pagination, activation, and sandbox support. |
| Billers/providers | GET List Billers; the guide names `categoryCode` as a filter. | Exact URL, request parameter format, response fields, pagination, activation, and sandbox support. |
| Products | GET Biller Products; the guide names `billerCode` as a filter. Products cover provider-specific options such as meter types and bundles. | Exact URL, response fields and prices/fees, pagination, activation, and sandbox support. |
| Customer validation | POST Validate Customer; requires `productCode` and `customerId`. `vendInstruction.requireValidationRef` determines whether the returned `validationReference` is required for vending. | Exact URL, full validation fields and response shape, provider-specific meter/customer requirements, and sandbox support. |
| Vend | POST Process Bill Payment; documented inputs include `productCode`, `customerId`, `vendAmount`, and unique merchant `vendReference`; send `validationReference` only when required. The guide names `transactionReference`, `vendReference`, and `vendStatus` in the response. | Exact URL, fee/debit and commission rules, provider reference semantics, idempotency, activation, and sandbox support. |
| Requery | GET Bills Payment Status for an uncertain/in-progress vend; it checks status without initiating a new vend. | Exact URL, request/response schema, retry limits, and reconciliation rules. |

The official Bills workflow guide says Bills requests use an access token generated from the API key and client secret. The collection quickstart documents Base64-encoded API-key/client-secret authentication and a sandbox base URL for collections, but neither the Bills endpoint details nor Bills sandbox availability are established by that collection material. The Bills adapter does not authenticate or send requests. The linked Bills API reference did not expose verifiable endpoint paths or complete schemas here, so exact Bills paths, full request/response fields, pagination, account activation, product fees, and Bills sandbox availability remain unresolved. No catalogue request is sent and no provider data is fabricated.

The UI uses backend-returned biller codes as identifiers, not labels, and presents loading, retry, empty, and unavailable states. At present, the backend returns no billers or products, and fee quotes and purchases remain unavailable. Confirm the Bills API reference and activation with Monnify before implementing requests or response normalization.

## Accounts and services not yet configured

The Bills app presents six distinct services: Electricity, Airtime, Data, Pay Bills, Virtual Cards, and Gift Cards. The first four retain the existing guest-service architecture. Virtual Cards and Gift Cards are marked account-required and remain unavailable while their separate provider integrations are pending. The app does not show provider products or pricing, start payments, issue cards, or deliver gift cards.

The backend retains standalone Bills account registration and login compatibility routes (`POST /api/auth/register` and `POST /api/auth/login`) that issue short-lived signed tokens when `BILLS_JWT_SECRET` is configured. They are deliberately transitional and do not establish a shared Supabase identity. Existing Bills user IDs and transaction records are not deleted or merged. New central identity should use Electrony Accounts and a Supabase access token; any explicit legacy-to-Supabase account-linking flow must be reviewed separately and must not merge by email alone. Card-service catalogue responses remain unavailable, eligibility does not report a result without a provider, and authenticated purchase requests fail closed without creating a payment or contacting a provider. No card-specific provider adapter or request configuration is implemented. Credentials for any future card provider must be kept server-side.

Local development continues to use JSON files beside the configured `BILLS_DATABASE_URL` file. By default, they are stored under `~/.electrony-bills/`; the previous `bills-api/data/` files remain legacy migration sources. `BILLS_DATABASE_URL` is a file path, not a database URL, and its local JSON and legacy migration behavior are unchanged.

`BILLS_RUNTIME_DATABASE_URL` is read only by the Node.js backend and must be configured in the Railway Bills API service variables. Use the PostgreSQL connection URL supplied by Supabase for the selected connection method and the existing Bills database; do not invent or substitute a hostname, port, or project reference. The URL must authenticate directly as `electrony_bills_runtime`; percent-encode special characters in its username and password. Never expose it through `BILLS_API_BASE_URL`, Vercel build variables, `src/config.js`, or browser code. The connection pool requires certificate-verified TLS, strips URL SSL overrides, and applies 5-second connection, query, and statement timeouts; it is closed on graceful process shutdown. `/health` separately reports blockers for Bills API activation, verified API contract, catalogue access, authoritative collection payment verification, durable idempotency, database-backed order persistence, and vending/reconciliation. A database connection does not establish end-to-end Bills order persistence. Overall readiness remains false; environment variables alone do not make it ready. The backend does not read `BILLS_POSTGRES_URL` and never falls back to it.

### Supabase PostgreSQL TLS certificate on Railway

1. In the Supabase dashboard, open the project and go to **Project Settings → Database → SSL Configuration**. Download the **Supabase root CA certificate** using **Download certificate**. Use the CA/root certificate (currently named `prod-ca-2021.crt`), not a server or client certificate.
2. In Railway, open the Bills API service and go to **Variables**. Add `BILLS_POSTGRES_CA` and paste the complete downloaded PEM text as its value, including the `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----` lines. Preserve the PEM line breaks; do not add quotes, encode it as base64, or paste a file path into this variable.
3. In Railway, set `BILLS_RUNTIME_DATABASE_URL` to the Supabase connection URL for the existing Bills database, using the dedicated role's credentials. Keep it server-side only, then redeploy the Railway service. Remove any obsolete `BILLS_POSTGRES_URL` variable so there is no ambiguity about which credential the backend uses.

If the PEM is supplied as a file instead, mount the file into the Railway service and set `BILLS_POSTGRES_CA_FILE` to its absolute in-container path (for example, `/data/prod-ca-2021.crt`). Configure exactly one of `BILLS_POSTGRES_CA` or `BILLS_POSTGRES_CA_FILE`; setting neither, setting both, an unreadable file, or invalid PEM makes PostgreSQL persistence unavailable and logs a fixed configuration diagnostic without exposing the certificate, credentials, or connection URL. TLS certificate and hostname verification remain enabled. Update the configured CA when Supabase rotates its root certificate.

The six existing tables already exist; this integration performs no migrations or DDL. The repository implements parameterized fee-quote create/read/validity methods, atomic quote consumption plus order creation, order reads and guarded payment/fulfilment transitions, payment-attempt creation/read/verified-state recording, idempotent webhook recording and single-claim processing, active product reads, and server-side platform-setting reads. PostgreSQL repository calls are not connected to public API routes; production routes remain fail-closed, local JSON storage and its legacy migration fallback are unchanged, and failed database operations never fall back to JSON. Guest `customer_id` remains nullable; do not equate the local JSON account identifier with a database customer identity without a verified relationship.

Guest orders use a server-generated 32-byte random secret. The API stores only its SHA-256 hash (in the existing order `metadata` JSONB field for PostgreSQL-backed orders and as a hash field for local JSON orders), sets the plaintext only in a per-reference `HttpOnly; Secure; SameSite=None` cookie, and verifies it server-side with a constant-time comparison. The secret is not returned in JSON, URLs, logs, or browser-readable storage. Credentialed CORS is restricted to the configured exact origins. Status and verification requests rely on the browser automatically sending the cookie; a public order or payment reference alone is not authorization. Signed-in orders still require an exact authenticated-customer match, and a guest secret does not grant access to a signed-in customer's order. Existing guest records without a hash are intentionally inaccessible through reference-only lookups. Cross-site cookie support depends on browser privacy settings and the deployed frontend/API origins; this does not enable payment routes.

The production report names `electrony_platform_settings`, while the repository, readiness allowlist, setup SQL, and settings queries name `bill_platform_settings`. These are not treated as aliases: readiness validates the exact `public.bill_platform_settings` table and reports missing/ambiguous required tables as blocked and unverified rather than silently substituting the production name. Confirm the intended table identity and align the database or repository deliberately before treating required grants as verified.

- `electrony_products` and `bill_platform_settings`: `SELECT`
- `bill_fee_quotes`, `bill_orders`, `bill_payment_attempts`, and `bill_payment_webhook_events`: `SELECT`, `INSERT`, `UPDATE`

`/health` reports `requiredGrantsVerified`, `excessiveBillsTableGrants`, `unexpectedSchemaCreateGrants`, `privateTablePublicAccess`, `unexpectedSequenceAccess`, `sensitiveFunctionExposure`, and `diagnosticsUnverified` separately under `checks.privilegeDiagnostics`; it also reports required `public` schema `USAGE` as `publicSchemaUsageVerified`. Product and platform-settings tables require `SELECT`; transaction tables require `SELECT`, `INSERT`, and `UPDATE`. Sequence checks are limited to sequences owned by the six allowlisted Bills tables: the runtime role may use only sequences required by transaction inserts, and public-role exposure is reported for private transaction sequences. Schema checks distinguish `CREATE` on the Bills `public` schema from normal `USAGE`; platform-schema `USAGE` is not counted as a Bills excess. Function exposure findings require an exposed `SECURITY DEFINER` routine whose source references a private transaction table; ordinary extension `EXECUTE` grants are not flagged by existence alone. Direct and effective `PUBLIC`, `anon`, and `authenticated` access to private transaction tables and their sensitive sequences remains visible. A broad runtime policy or enabled RLS is not treated as proof of customer authorization; authorization semantics remain unverified until actual database policies and server-side access behavior are verified. Unavailable, malformed, missing, or ambiguous diagnostic results fail closed. The application performs no DDL or permission changes during readiness checks.

### Dedicated PostgreSQL runtime role

The API uses `BILLS_RUNTIME_DATABASE_URL` to authenticate directly as `electrony_bills_runtime`. Readiness rejects a missing or different login, role switching, memberships/inheritance, superuser, role/database creation, replication, `BYPASSRLS`, table ownership, excessive Bills table/sequence privileges, unexpected `CREATE` on `public`, exposed sensitive `SECURITY DEFINER` functions, and public-role access to private transaction data. It does not treat unrelated Supabase schema `USAGE` or ordinary extension function `EXECUTE` grants as Bills vulnerabilities. The readiness check cannot determine whether credentials are shared outside PostgreSQL; reserve this login exclusively for the API.

### Disposable PostgreSQL verification fixture

[`postgres-test-fixture.js`](./postgres-test-fixture.js) prepares and removes test data in a disposable PostgreSQL database. Set `BILLS_RUNTIME_DATABASE_URL` to a connection for `electrony_bills_runtime` and `BILLS_TEST_ADMIN_DATABASE_URL` to a separate database-owner/admin connection for that same database. The fixture verifies both database identities before changing anything. The runtime role cannot seed products, delete test records, or create triggers with its production grants, so the admin connection is only used by this test utility for those operations.

Run `node bills-api/postgres-test-fixture.js setup` before a standalone verification harness, then run `node bills-api/postgres-test-fixture.js cleanup` afterward, including after a failed harness run. A harness can instead import `withFixture` and run its verification callback through it; cleanup is then performed in `finally`. Use `fixture.productCode` in fee quotes and prefix all generated quote, order, payment, and webhook references with `fixture.referencePrefix` so cleanup can reliably find them. Test 3 should insert an order using `fixture.failureOrderReference` (or set `BILLS_TEST_FAILURE_ORDER_REFERENCE` to the reference expected by that harness); the fixture trigger raises an intentional database error for that exact reference only. Setup and cleanup are transactional, and cleanup drops the fixture trigger and function as well as its marked product and associated test records. Do not point either URL at a production database.

The database role, grants, and policy expressions must be reviewed against the live database; the health check verifies RLS enablement and role-scoped policy coverage without comparing PostgreSQL's normalized policy-expression text. Health status does not prove customer authorization. Do not run `postgres-role-setup.sql` again. After reviewing the deployed `/health` `checks.privilegeDiagnostics`, an administrator may use [`postgres-role-permissions-remediation.sql`](./postgres-role-permissions-remediation.sql) to reset only direct grants on the six fixed Bills tables and their owned sequences to the operations used by the repository. The script verifies table ownership, RLS, and the dedicated role's lack of memberships, and aborts unless it finds an excess direct grant in the scope it changes. It does not change owners, RLS, public or inherited grants, other schemas, application functions, or unrelated objects. Review its SQL and the diagnostic findings before executing it. Any remaining `PUBLIC` or inherited grants, `public` schema `CREATE`, sensitive function exposure, or public-role access require a separate object-specific review; do not broaden the script or revoke privileges blindly. After redeployment, inspect the safe readiness/diagnostic fields at the Railway health endpoint. `connected: true` means only that TLS and authentication succeeded. PostgreSQL operations are present in payment handlers that remain hard-blocked, but Bills order persistence is not verified end to end; payments and vending remain disabled until every authorization, payment, fee, provider, and idempotency gate is implemented and verified.

The current vending adapter has no provider-fee quote operation, so payment-session creation remains unavailable even when its basic credentials are present. The payment adapter must also be updated against the selected provider's documented settlement response to compare the confirmed amount, currency, and reference with the stored transaction; those provider-specific fields cannot safely be inferred from the current generic adapter. Payment-session creation, verification, and webhook mutations return `503` in all modes; neither a verification response nor a signed webhook can mark an order paid or start fulfillment. Treat deployment for real payments as blocked until the provider quote/fulfillment/settlement contract and durable transactional storage are implemented and verified.

## Payment flow

The backend currently:

1. Retains backend checkout validation and guest account-association code, but the Bills UI has no checkout form while catalogue options are unavailable. Payment operations are hard-disabled until the Monnify payment contract and every persistence/security safeguard are verified.
2. Keeps development account and transaction persistence behavior unchanged. PostgreSQL order/payment operations exist behind the hard-blocked payment routes, but readiness remains false until Bills order persistence is verified end to end; production API routes also remain blocked pending database authorization and provider safety contracts.
3. Rejects fee quotes while the Bills catalogue and product fees are unavailable; no service options or prices are substituted.
4. Keeps Monnify credentials server-side. Webhook processing remains disabled; the documented production signature and sandbox behavior have not been verified as a complete contract.
5. Contains server-side transaction-query and amount/currency/reference matching code, but the verification contract and end-to-end behavior are not verified; a redirect is not proof of payment.
6. Retains the provider adapter abstraction, but does not enable bill delivery without Monnify's validation, vend, fee, reference, and reconciliation contract.

`PAYMENTS_BLOCKED=false` cannot override the hard payment-contract block in the code. The payment reference is not yet guaranteed to be generated server-side, and the current checkout flow has not been verified to provide durable idempotency before external initialization. Do not test a real or sandbox checkout or vending operation, or treat a callback as fulfillment. Obtain the Monnify Bills API reference, confirm Bills Payment activation and sandbox availability for this merchant account, and obtain the applicable fee, validation-reference, webhook (including sandbox signature), vend-reference, and reconciliation rules before implementing or enabling those operations.

Official documentation consulted: [Bills Payment workflow](https://developers.monnify.com/docs/bills-payment/process-a-bill), [settlement and merchant payable](https://developers.monnify.com/docs/bills-payment/settlement-process), [collection transaction verification](https://developers.monnify.com/docs/collections/manage-payments/verify-transactions), [checkout API](https://developers.monnify.com/docs/collections/one-time-payments/checkout-api), and [webhooks](https://developers.monnify.com/docs/webhooks). The accessible documentation names the Bills operations but the linked API reference did not provide verifiable endpoint paths or full schemas in this integration environment.

## Electrony Accounts OAuth 2.1 integration

Supabase Auth is being used as an OAuth 2.1 authorization server according to the official authorization-code, PKCE, token, and consent documentation. The implementation is server-mediated for Bills and does not expose refresh tokens to JavaScript.

### Routes

- Accounts sign-in: `https://accounts.electrony.xyz/`
- Accounts consent: `https://accounts.electrony.xyz/oauth/consent/?authorization_id=<authorization_id>`
- Bills app: `https://bills.electrony.xyz/bills/app/`
- Bills OAuth initiation: `GET https://<deployed-bills-api>/api/auth/oauth/start`
- Bills OAuth callback: `GET https://<deployed-bills-api>/api/auth/oauth/callback`
- Current identity: `GET /api/auth/me`
- Refresh: `POST /api/auth/refresh`
- Logout: `POST /api/auth/logout`
- Customer history: `GET /api/customer/transactions`
- Legacy account compatibility: `POST /api/auth/register`, `POST /api/auth/login`

The callback URL registered in Supabase must exactly equal `BILLS_OAUTH_CALLBACK_URL`. For production this is the Railway API origin plus `/api/auth/oauth/callback`; it is not a Bills frontend page URL. Dynamic client registration is intentionally disabled.

### Dashboard and environment requirements

- Enable OAuth Server in the Supabase Identity project.
- Set the OAuth authorization path to `/oauth/consent`.
- Keep the Accounts URL Configuration Site URL set to `https://accounts.electrony.xyz`.
- Register Electrony Bills as a separate public OAuth client with the exact Railway callback URL.
- The Authorization Code flow, PKCE S256, and exact redirect URI validation are required.
- Use scopes `openid email profile`; the `nonce` is included in the authorization request.
- Configure `ELECTRONY_IDENTITY_SUPABASE_URL`, `ELECTRONY_IDENTITY_SUPABASE_PUBLISHABLE_KEY`, `ELECTRONY_IDENTITY_OAUTH_CLIENT_ID`, and `BILLS_OAUTH_CALLBACK_URL` in Railway.
- `ELECTRONY_IDENTITY_SUPABASE_PUBLISHABLE_KEY` is public; never configure or expose a service-role/secret key in Bills or its frontend.

The OAuth start endpoint signs and HttpOnly-stores a ten-minute verifier/state/nonce cookie. The callback verifies state, exchanges the authorization code with PKCE S256, and validates the access token through the configured Supabase Auth server. Access and refresh tokens are stored only as Secure, HttpOnly, SameSite=None cookies on the Railway API origin. State-changing logout and refresh operations require a CSRF token and exact allowed-origin/CORS checks.

### Identity and legacy compatibility

The verified Supabase UUID is the immutable registered-customer key. `customer_id` and transaction ownership are always derived from the server-verified session, never from browser JSON. Legacy `/api/auth/register` and `/api/auth/login` remain available but do not create Accounts identities. No automatic email merge is performed.

The migration provides an `electrony_customer_mappings` table. Linking is not yet enabled: `/api/auth/link` intentionally returns `501` rather than accepting an insecure email-only merge. A future verified linker must require a current verified Supabase session, prove possession of the legacy Bills account through legacy password authentication or an equivalent challenge, and record the UUID-to-legacy-customer mapping. Guest orders remain `customer_id = null` and are accessible only with their secret cookie; they are never automatically converted into registered ownership.

Registered transaction history is fail-closed. `/api/customer/transactions` returns `503` until a customer-owned query authorization and migration-backed mapping have been verified, and the frontend displays an unavailable state rather than fabricated records.
