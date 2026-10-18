# Electrony Bills API

The Bills app keeps payment creation and verification server-side in this isolated backend directory.

## Local development

```bash
npm run dev:api
```

The API process also serves the website files from the repository root. For a single-service Railway deployment, set the existing service's start command to `npm start`; it listens on Railway's `PORT` and routes `/api/...` and `/health` to the API while serving other public paths as website files. The frontend uses same-origin API paths outside local development. `npm run dev` remains the separate local Python website server.

Production Bills API routes currently return `503`. `/health` performs a read-only `SELECT 1` through the backend PostgreSQL pool when `BILLS_POSTGRES_URL` is set, then reports connection status separately from the limited role/table/RLS security checks. It does not expose credentials, hostnames, SQL, or raw database errors. A successful connection is not proof of CRUD authorization or persistent Bills storage: no business-table reads or writes are enabled, and production does not fall back to local JSON.

Expected endpoints:

- `GET /health`
- `GET /api/fees/quote?service=electricity|airtime|data|bills&amount=...&network=...&plan=...`
- `POST /api/payments/session`
- `POST /api/payments/verify`
- `GET /api/payments/status`
- `POST /api/payments/webhook`

The quote request accepts `service` and `amount`; `network` and `plan` are required for supported data bundles and plans. It returns `{ ok, quote, quoteToken }`; the quote includes `service`, `currency`, `serviceAmountMinor`, `platformFeeMinor`, `providerFeeMinor`, `providerFeeStatus`, and `totalBeforeProviderFeesMinor`. Electricity and airtime enforce their existing amount maxima, while data and TV bills enforce the configured plan prices. The quote contains Electrony's NGN 100 platform fee only; it does not invent a provider fee.

## Vercel frontend and Railway API

The frontend is a static site: browser JavaScript cannot read Railway/Vercel environment variables at runtime. Set the Vercel build environment variable `BILLS_API_BASE_URL` to the Railway API's HTTPS base URL (origin only, without an API path), then deploy or redeploy. `vercel.json` runs `npm run build:vercel`; that build injects the public URL into the generated `dist/src/config.js`. Do not put credentials in this variable. Local development continues to use `http://localhost:4174`.

On Railway, set `BILLS_APP_URL` to the exact deployed Bills app URL, including `/bills/app/`; the API permits that origin and the local development origins. For any other Vercel/custom frontend domains, set `BILLS_ALLOWED_ORIGINS` to a comma-separated list of exact origins. CORS does not permit wildcard origins or credentials. Changes to `BILLS_API_BASE_URL` require a new Vercel deployment because it is compiled into the static frontend at build time.

The repository does not contain an actual Railway deployment URL or a Vercel project/domain configuration. Do not substitute a guessed URL; use the Railway service's assigned public HTTPS domain.

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
- `BILLS_POSTGRES_URL` (Railway backend variable only; PostgreSQL TLS certificate verification is required; never include it in browser/frontend variables)
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

`BILLS_POSTGRES_URL` is read only by the Node.js backend and is configured in Railway's backend service variables. Do not expose it through `BILLS_API_BASE_URL`, Vercel build variables, `src/config.js`, or any browser code. The connection pool enforces certificate-verified TLS, has bounded connection/query timeouts, and is closed on graceful process shutdown. Readiness distinguishes `not_configured`, `configured_unverified` (before a check), `unavailable`, `connection_verified`, and `security_failed`. A `securityFailure` is a non-secret class such as `dedicated_role_required`, `rls_disabled`, `role_owns_table`, or `server_role_policy_missing`.

The six existing tables already exist; this phase performs no migrations or DDL. The current schema has RLS enabled and no policies, so the configured role cannot pass the existing RLS-policy check. No role has been confirmed against Railway from this development environment. Even if `/health` reports `connection_verified` and `controls_verified`, these checks do not prove that the role has the required table grants or that a particular CRUD operation is authorized.

No PostgreSQL business-table repository operations are implemented: fee-quote persistence/consumption, order creation or reads, payment-attempt writes, atomic webhook idempotency, product-catalogue reads, and platform-settings reads are all disabled. There is consequently no PostgreSQL transaction/DML path and no automatic JSON import. Preserve guest `customer_id` as nullable; do not equate the local JSON account identifier with a database customer identity without a verified relationship.

Before production CRUD can be enabled, configure a dedicated server-only database role that is neither a superuser, `BYPASSRLS` role, nor owner of these tables; grant only the specific table privileges needed; and establish narrowly scoped RLS policies for that backend role that enforce the intended customer/data boundaries. Do not disable RLS, add `public`/anonymous access, or use a service-role credential in frontend code. Validate grants, policies, identity mapping, field/status mapping, and each transaction path against the actual schema before enabling any repository method. Existing production API routes remain blocked in the meantime.

The current vending adapter has no provider-fee quote operation, so payment-session creation remains unavailable even when its basic credentials are present. The payment adapter must also be updated against the selected provider's documented settlement response to compare the confirmed amount, currency, and reference with the stored transaction; those provider-specific fields cannot safely be inferred from the current generic adapter. Payment-session creation, verification, and webhook mutations return `503` in all modes; neither a verification response nor a signed webhook can mark an order paid or start fulfillment. Treat deployment for real payments as blocked until the provider quote/fulfillment/settlement contract and durable transactional storage are implemented and verified.

## Payment flow

The backend currently:

1. Retains guest bill checkout validation and account association using a verified server-side token, but payment operations are disabled in every mode.
2. Uses local JSON files for development account and transaction records; production API routes remain blocked until durable database persistence is implemented.
3. Uses server-controlled NGN minor-unit fee rules and rejects payment initialization unless the quote and provider-fee disclosure are complete.
4. Keeps Monnify credentials and webhook signature verification server-side.
5. Requires authoritative Monnify status, amount, currency, and reference verification before any payment can be confirmed; webhook signatures alone are not payment verification.
6. Retains the provider adapter abstraction, but does not enable bill delivery without a verified vending-provider contract.

If a provider or required configuration is missing, the backend fails safely with an explicit error instead of inventing products, rates, or fulfillment. The current code does not have an implemented authoritative Monnify amount/currency/reference verification contract, a provider-fee quote operation, or durable transactional idempotency. Do not test a real or sandbox bill purchase or treat a callback as fulfillment until those blockers are resolved against the official provider contracts.
