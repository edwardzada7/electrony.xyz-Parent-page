# Electrony Bills API

The Bills app keeps payment creation and verification server-side in this isolated backend directory.

## Local development

```bash
npm run dev:api
```

<<<<<<< HEAD
Run the API from the repository root. For Railway, configure the service root directory as `/` (the repository root) and the start command as `npm run start:api`. The server listens on Railway's `PORT` and binds to `0.0.0.0`.
=======
The API process also serves the website files from the repository root. For a single-service Railway deployment, set the existing service's start command to `npm start`; it listens on Railway's `PORT` and routes `/api/...` and `/health` to the API while serving other public paths as website files. The frontend uses same-origin API paths outside local development. `npm run dev` remains the separate local Python website server.

The repository does not include Railway or Vercel deployment configuration. Production Bills API routes currently return `503` until a server-side database adapter has been implemented against the actual Supabase schema. In production, the API does not use the local JSON store; `/health` reports database status without exposing customer data or credentials. Payment session, verification, and webhook mutation routes are disabled in all modes until authoritative Monnify verification checks the merchant reference, amount, currency, and payment status and vending uses a verified provider contract.
>>>>>>> 6d2b7d71e988704f91aaeb15c9effd4fd2839db4

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

<<<<<<< HEAD
Transaction, account, and webhook-idempotency records use JSON files. On Railway, attach a persistent volume and set `BILLS_DATABASE_URL` to a JSON file path on that volume (for example `/data/transactions.json`, with `/data` mounted as the volume path). This is not a production database or horizontally safe datastore: it does not provide transactional uniqueness/locking. Health reports this limitation. Before accepting real customer payments, deploy a durable database with transactional uniqueness/locking, configure and verify bill fulfilment and provider fee quotes, and select/configure the card and gift-card providers and their actual KYC/payment/fulfilment APIs.
=======
Transaction, account, and webhook-idempotency records use JSON files beside the configured `BILLS_DATABASE_URL` file. By default, they are stored under `~/.electrony-bills/`; the previous `bills-api/data/` files are legacy migration sources. This is persistent local-file storage, not a production database or horizontally safe datastore. Before accepting real customer payments, deploy a durable database with transactional uniqueness/locking, configure and verify bill fulfilment and provider fee quotes, and select/configure the card and gift-card providers and their actual KYC/payment/fulfilment APIs.

The current vending adapter has no provider-fee quote operation, so payment-session creation remains unavailable even when its basic credentials are present. The payment adapter must also be updated against the selected provider's documented settlement response before production to compare the confirmed amount, currency, and reference with the stored transaction; those provider-specific fields cannot safely be inferred from the current generic adapter. A paid Monnify verification or signed webhook starts fulfillment at most once per local transaction record; JSON-file writes do not provide cross-process locking or crash-safe provider idempotency. Treat deployment for real payments as blocked until the provider quote/fulfillment/settlement contract and durable transactional storage are implemented and verified.
>>>>>>> 6d2b7d71e988704f91aaeb15c9effd4fd2839db4

## Payment flow

The backend now:

1. Supports existing guest bill checkout requests and associates signed-in transactions with the account identified by a verified server-side token.
2. Stores eligible transaction references and separate service, Electrony fee, provider-fee, payment, and fulfilment fields in local JSON files.
3. Uses server-controlled NGN minor-unit fee rules and rejects payment initialization unless the quote and provider-fee disclosure are complete.
4. Keeps Monnify credentials and webhook verification server-side.
5. Verifies webhook signatures. Monnify verification must confirm authoritative payment status, amount, currency, and reference before any bill is fulfilled; webhook signature alone is not payment verification.
6. Uses the existing provider adapter abstraction for configured electricity, airtime, data, and bill delivery.

If a provider or required configuration is missing, the backend fails safely with an explicit error instead of inventing products, rates, or fulfillment. The current code does not have an implemented authoritative Monnify amount/currency/reference verification contract, a provider-fee quote operation, or durable transactional idempotency. Do not test a real or sandbox bill purchase or treat a callback as fulfillment until those blockers are resolved against the official provider contracts.
