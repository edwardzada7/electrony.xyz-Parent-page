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

The Hardware catalogue is available at `/hardware/`. Its local catalogue entries and illustrations are enquiry prompts, not confirmed inventory; the page does not invent model numbers, prices, stock or technical specifications. Product enquiries are sent through `POST /api/contact`.

A future verified catalogue integration can still provide `window.ElectronyHardwareCatalogue` before `src/hardware.js` runs. Its `load({ signal })` method must return a promise for `{ products: [...] }`. Each provider product must have a stable Electrony `id`, provider-owned `providerProductId`, `name`, and a top-level `category` (`consumer-electronics`, `appliances`, `electrical-power`, `computers`, `cars-mobility`, or `solar-energy`). Optional fields are `variantId`, `brand`, `model`, `sku`, `description`, `image: { url, alt }`, authoritative `price: { amount, currency }`, authoritative `availability`, `specifications: [{ name, value }]`, and `detailUrl`. Provider identifiers remain the mapping to the commerce system's source of truth; prices and availability are never inferred by this page. Do not expose secret credentials in the browser. Cart and checkout are intentionally not implemented.

## Electrony Energy

The Energy catalogue is available at `/energy/`. Its locally maintained categories and illustrations are enquiry prompts, not verified product listings. Customers can request an individual item, complete solar installation or customised project; specifications and availability must be confirmed.

## Contact enquiry delivery

Hardware and Energy forms submit to a server-side Resend integration. The same endpoint is available as a Vercel function at `/api/contact` and as a route in the combined Railway website/API service. Local API development can serve both the pages and route with `npm run dev:api` at `http://localhost:4174`; the static Python server (`npm run dev`) does not provide API routes.

Configure these server-only environment variables in the deployment that will deliver enquiries:

- `CONTACT_EMAIL` — the recipient mailbox; set this to the confirmed destination address.
- `RESEND_API_KEY` — a private Resend API key.
- `CONTACT_FROM_EMAIL` — a sender address or display-name address on a domain verified with Resend.

Set them in Vercel for the Vercel serverless endpoint, and in Railway if using its `/api/contact` route. Never add these values to `src/config.js`, browser JavaScript, or public build-time variables. Missing or invalid configuration returns an explicit `503` error; the form only reports success when Resend returns an accepted message identifier. Provider acceptance is not proof of inbox delivery. The repository does not define a recipient mailbox or a production Railway service URL.

The Vercel build also retains the existing requirement for `BILLS_API_BASE_URL` to identify the Railway Bills API. The contact endpoint itself is same-origin and does not rely on Railway being available when the site is deployed to Vercel. The form performs client-side validation and clearly reports that submissions are not sent.