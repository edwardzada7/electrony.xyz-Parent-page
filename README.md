# Electrony Technologies

## Local development

Run `npm run dev` and open `http://localhost:4173`.

Run `npm run check` to check the site scripts for syntax errors.

The Railway deployment is configured in [`railway.json`](./railway.json) to use Railpack and run the combined Node.js website and Bills API with `node bills-api/server.js`. Keep the Railway service root directory set to `/` and deploy it as a Railpack application, not a static site. It serves the site and API from one origin, listens on Railway's `PORT`, and exposes `/health`; in production the Bills frontend uses same-origin `/api/` routes. Local static development continues to use `http://localhost:4174`.

If the Railway service does not load the root `railway.json`, configure its start command as `node bills-api/server.js` and ensure the builder/deployment mode is Railpack rather than a static-site/Caddy deployment. If the website is also deployed to Vercel, retain a deployment-specific `billsApiBaseUrl` in `src/config.js` that points to the existing Railway service.

Production Bills API routes intentionally return `503` until durable Supabase persistence has been implemented against the actual table definitions. Payment session, verification, and webhook mutations return `503` in every mode until authoritative Monnify reference/amount/currency verification and a verified vending-provider contract are implemented. The website remains available while Bills operations are blocked.

## Configuration

Set confirmed company and product URLs in `src/config.js`. Product content and categories are centralized in `src/products.js`.

Place the approved parent Electrony logo in `assets/brand/` when it is available. The current wordmark is text, not a redraw of the logo.

## Electrony Bills

The public Electrony Bills product page remains available at `/bills/` as the product introduction. The guest purchasing experience is available at `/bills/app/` and is implemented as a separate, mobile-first checkout flow with service-specific validation and payment review.

The static Vercel build requires `BILLS_API_BASE_URL` to be set to the deployed Railway API's HTTPS base URL and redeployed. See [the Bills API deployment notes](./bills-api/README.md#vercel-frontend-and-railway-api) for CORS and Railway configuration.

The `COMING SOON` status and internal landing-page link are maintained in `src/products.js` and `src/config.js`.

## Electrony Automobile

The public Electrony Automobile page is available at `/automobile/`. It presents a curated selection of vehicles, powertrain categories and selected brands for a marketing-only catalogue experience. The internal landing-page link is maintained in `src/config.js` and the product record in `src/products.js`.

## Electrony Hardware

The Hardware storefront is available at `/hardware/`. Until a commerce provider is selected and connected, the catalogue shows an explicit setup state and does not display sample products, prices or availability.

A future catalogue integration can provide `window.ElectronyHardwareCatalogue` before `src/hardware.js` runs. Its `load({ signal })` method must return a promise for `{ products: [...] }`. Each product must have a stable Electrony `id`, provider-owned `providerProductId`, `name`, and a top-level `category` (`consumer-electronics`, `appliances`, `electrical-power`, `cars-mobility`, or `solar-energy`). Optional fields are `variantId`, `brand`, `model`, `sku`, `image: { url, alt }`, authoritative `price: { amount, currency }`, authoritative `availability`, `specifications: [{ name, value }]`, and `detailUrl`. Provider identifiers remain the mapping to the commerce system's source of truth; prices and availability are never inferred by this page. Do not expose secret credentials in the browser. Cart and checkout are intentionally not implemented.

The quote form validates and retains the entered fields in the current page, but there is no configured enquiry submission backend. A valid submission reports that it was not sent; connect a secure server-side enquiry endpoint before accepting requests. Contact links remain unset until verified destinations are configured in `src/config.js`. The Energy page is available at `/energy/`, but its catalogue and quote submission are not connected yet.

## Electrony Energy

The Energy solutions page is available at `/energy/`. It introduces energy equipment categories and project enquiries without presenting unverified products, pricing or availability. The catalogue is not connected, and quote submissions remain unavailable until a verified catalogue provider and secure enquiry backend are configured. The form performs client-side validation and clearly reports that submissions are not sent.