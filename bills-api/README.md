# Electrony Bills API

The Bills app keeps payment creation and verification server-side in this isolated backend directory.

## Local development

```bash
npm run dev:api
```

Expected endpoints:

- `GET /health`
- `POST /api/payments/session`
- `POST /api/payments/verify`
- `GET /api/payments/status`
- `POST /api/payments/webhook`

## Required environment configuration

This project is intentionally isolated from the parent Electrony site. Keep Bills credentials in a real `.env` file or a deployment secret manager and never commit secrets into source control.

Copy the sample variables from the repository root `.env.example` and update the values before running the Bills API.

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

## Platform fees and transaction safety

The server-controlled fee table is in `platform-fees.js`. Electricity, airtime, data, and supported bills each have one NGN 100 fee per payment transaction; virtual cards have no fixed NGN fee and use USD product pricing; gift cards have a zero Electrony platform fee. Fee quotes use integer minor units and expire after five minutes. Payment initialization recalculates the quote server-side and rejects a missing, stale, or mismatched quote; client-supplied fees are never authoritative.

The existing vending adapter does not currently provide a documented provider-fee quote. In that state the API displays the Electrony fee, marks the provider fee as unquoted, and refuses to initialize payment. It also refuses to initialize a bill payment if no vending provider is configured. This prevents collecting payment where fulfilment or full fee disclosure cannot be confirmed.

## Accounts and services not yet configured

Account registration and login are provided by the Bills API. Purchases in the Virtual Cards and Gift Cards sections require a signed-in account at the backend, but their catalogues currently return `provider_unconfigured`; their purchase endpoints do not create transactions. The API has no configured card or gift-card provider, so it cannot verify provider KYC/eligibility, offer provider products, or issue cards/gift cards. Monnify is used only for existing supported bill-payment processing, not assumed to provide these products.

Transaction, account, and webhook-idempotency records use JSON files in `bills-api/data/`. This is persistent local-file storage, not a production database or horizontally safe datastore. Before accepting real customer payments, deploy a durable database with transactional uniqueness/locking, configure and verify bill fulfilment and provider fee quotes, and select/configure the card and gift-card providers and their actual KYC/payment/fulfilment APIs.

## Payment flow

The backend now:

1. Supports existing guest bill checkout requests and associates signed-in transactions with the account identified by a verified server-side token.
2. Stores eligible transaction references and separate service, Electrony fee, provider-fee, payment, and fulfilment fields in local JSON files.
3. Uses server-controlled NGN minor-unit fee rules and rejects payment initialization unless the quote and provider-fee disclosure are complete.
4. Keeps Monnify authentication, initialization, verification, and webhook secret server-side.
5. Verifies webhook signatures and prevents repeat fulfilment attempts for a transaction.
6. Uses the existing provider adapter abstraction for configured electricity, airtime, data, and bill delivery.

If a provider or required configuration is missing, the backend fails safely with an explicit error instead of inventing products, rates, or fulfillment.
