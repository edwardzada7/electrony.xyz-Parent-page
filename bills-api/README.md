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

## Payment flow

The backend now:

1. Accepts a guest purchase request from the Bills app.
2. Stores a local transaction record with an internal reference before any external redirect.
3. Calls the Monnify sandbox auth/init-transaction flow using server environment variables only.
4. Returns only the checkout URL and transaction reference to the browser.
5. Verifies payment status server-side before allowing any vending to proceed.
6. Validates a Monnify webhook signature and processes the webhook idempotently.
7. Uses a provider adapter abstraction for electricity, airtime, data and bill delivery.

If no vending provider is configured, the backend will fail safely with an explicit configuration error instead of inventing a fake provider response.
