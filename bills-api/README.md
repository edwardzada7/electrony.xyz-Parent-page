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

### Monnify sandbox variables

- `MONNIFY_API_KEY`
- `MONNIFY_SECRET_KEY`
- `MONNIFY_CONTRACT_CODE`
- `MONNIFY_BASE_URL`
- `MONNIFY_WEBHOOK_SECRET`

### Bills-specific configuration

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

The existing vending adapter does not currently provide a documented provider-fee quote. In that state the API displays the Electrony fee, marks the provider fee as unquoted, and refuses to initialize payment. It also refuses to initialize a bill payment if no vending provider is configured. This prevents collecting payment where fulfilment or full fee disclosure cannot be confirmed.

## Accounts and services not yet configured

Account registration and login are provided by the Bills API. Purchases in the Virtual Cards and Gift Cards sections require a signed-in account at the backend, but their catalogues currently return `provider_unconfigured`; their purchase endpoints do not create transactions. The API has no configured card or gift-card provider, so it cannot verify provider KYC/eligibility, offer provider products, or issue cards/gift cards. Monnify is used only for existing supported bill-payment processing, not assumed to provide these products.

Local development continues to use JSON files beside the configured `BILLS_DATABASE_URL` file. By default, they are stored under `~/.electrony-bills/`; the previous `bills-api/data/` files remain legacy migration sources. `BILLS_DATABASE_URL` is a file path, not a database URL, and its local JSON and legacy migration behavior are unchanged.

`BILLS_RUNTIME_DATABASE_URL` is read only by the Node.js backend and must be configured in the Railway Bills API service variables. Use the PostgreSQL connection URL supplied by Supabase for the selected connection method and the existing Bills database; do not invent or substitute a hostname, port, or project reference. The URL must authenticate directly as `electrony_bills_runtime`; percent-encode special characters in its username and password. Never expose it through `BILLS_API_BASE_URL`, Vercel build variables, `src/config.js`, or browser code. The connection pool requires certificate-verified TLS, strips URL SSL overrides, and applies 5-second connection, query, and statement timeouts; it is closed on graceful process shutdown. Readiness reports connection, runtime-role, privilege, and RLS checks separately. `/health` is a process-health endpoint and always reports `ready: false` until all business and integration gates are implemented and verified; HTTP 200 does not mean the API is ready. The backend does not read `BILLS_POSTGRES_URL` and never falls back to it.

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

The database role, grants, and policy expressions must be verified against the live database; the health findings supplied so far do not establish the exact excess ACL entry, resolve the platform-settings table-name mismatch, or prove customer authorization. Do not run `postgres-role-setup.sql` again. After reviewing the deployed `/health` `checks.privilegeDiagnostics`, an administrator may use [`postgres-role-permissions-remediation.sql`](./postgres-role-permissions-remediation.sql) to reset only direct grants on the six fixed Bills tables and their owned sequences to the operations used by the repository. The script verifies table ownership, RLS, and the dedicated role's lack of memberships, and aborts unless it finds an excess direct grant in the scope it changes. It does not change owners, RLS, public or inherited grants, other schemas, application functions, or unrelated objects. Review its SQL and the diagnostic findings before executing it. Any remaining `PUBLIC` or inherited grants, `public` schema `CREATE`, sensitive function exposure, or public-role access require a separate object-specific review; do not broaden the script or revoke privileges blindly. After redeployment, inspect the safe readiness/diagnostic fields at the Railway health endpoint. `connected: true` means only that TLS and authentication succeeded. PostgreSQL business persistence remains unwired to public transaction routes; payments and vending remain disabled until every authorization, payment, fee, provider, and idempotency gate is implemented and verified.

The current vending adapter has no provider-fee quote operation, so payment-session creation remains unavailable even when its basic credentials are present. The payment adapter must also be updated against the selected provider's documented settlement response to compare the confirmed amount, currency, and reference with the stored transaction; those provider-specific fields cannot safely be inferred from the current generic adapter. Payment-session creation, verification, and webhook mutations return `503` in all modes; neither a verification response nor a signed webhook can mark an order paid or start fulfillment. Treat deployment for real payments as blocked until the provider quote/fulfillment/settlement contract and durable transactional storage are implemented and verified.

## Payment flow

The backend currently:

1. Retains guest bill checkout validation and account association using a verified server-side token, but payment operations are disabled in every mode.
2. Uses local JSON files for development account and transaction records; no transaction route uses the new PostgreSQL repository yet, and production API routes remain blocked pending database authorization and the provider safety contracts.
3. Uses server-controlled NGN minor-unit fee rules and rejects payment initialization unless the quote and provider-fee disclosure are complete.
4. Keeps Monnify credentials and webhook signature verification server-side; webhook signature verification alone does not enable event mutations.
5. Requires authoritative Monnify status, amount, currency, and reference verification before any payment can be confirmed; webhook signatures alone are not payment verification.
6. Retains the provider adapter abstraction, but does not enable bill delivery without a verified vending-provider contract.

If a provider or required configuration is missing, the backend fails safely with an explicit error instead of inventing products, rates, or fulfillment. The current code does not have an implemented authoritative Monnify amount/currency/reference verification contract, a provider-fee quote operation, or durable transactional idempotency. Do not test a real or sandbox bill purchase or treat a callback as fulfillment until those blockers are resolved against the official provider contracts.
