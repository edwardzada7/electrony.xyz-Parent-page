# Electrony Technologies

## Local development

Run `npm run dev` and open `http://localhost:4173`.

Run `npm run check` to check the site scripts for syntax errors.

The Railway deployment is configured in [`railway.json`](./railway.json) to use Railpack and run the combined Node.js website and Bills API with `node bills-api/server.js`. Keep the Railway service root directory set to `/` and deploy it as a Railpack application, not a static site. It serves the site and API from one origin, listens on Railway's `PORT`, and exposes `/health`; in production the Bills frontend uses same-origin `/api/` routes. Local static development continues to use `http://localhost:4174`.

If the Railway service does not load the root `railway.json`, configure its start command as `node bills-api/server.js` and ensure the builder/deployment mode is Railpack rather than a static-site/Caddy deployment. If the website is also deployed to Vercel, retain a deployment-specific `billsApiBaseUrl` in `src/config.js` that points to the existing Railway service.

Production Bills API routes intentionally return `503` until durable Supabase persistence has been implemented against the actual table definitions. Payment session, verification, and webhook mutations return `503` in every mode until authoritative Monnify reference/amount/currency verification and a verified vending-provider contract are implemented. The website remains available while Bills operations are blocked.

## Configuration

Set confirmed company and product URLs in `src/config.js`. Product destinations are centralized there, and product content and categories are maintained in `src/products.js`. Product cards and calls to action use the configured HTTPS destinations for ElectronyOS, Hardware, Automobile, Energy, Electrony Bills, and iStylist.

Place the approved parent Electrony logo in `assets/brand/` when it is available. The current wordmark is text, not a redraw of the logo.

## Electrony Bills

The public Electrony Bills product page remains available at `/bills/` as the product introduction. The guest purchasing experience is available at `/bills/app/` and is implemented as a separate, mobile-first checkout flow with service-specific validation and payment review.

## Vercel deployments

The parent site and the Automobile, Energy, Hardware, and Bills projects use this repository root. Set the Vercel **Root Directory** to `./` (the repository root) for each project; setting it to a nested page folder omits files those pages reference. Use the **Other** framework preset and the following project-specific build settings:

| Vercel project | Build Command | Output Directory |
| --- | --- | --- |
| Parent Electrony.xyz site | `npm run build:vercel -- --site parent` | `dist` |
| Automobile | `npm run build:vercel -- --site automobile` | `dist` |
| Energy | `npm run build:vercel -- --site energy` | `dist` |
| Hardware | `npm run build:vercel -- --site hardware` | `dist` |
| Bills purchasing app | `npm run build:vercel -- --site bills` | `dist` |

Parent, Automobile, Energy, and Hardware builds copy the existing pages and shared runtime assets into `dist`, and select the requested page as the deployment's `/` entry point. Non-runtime Markdown documents, PDFs, hidden files, and `*.test.js` files are excluded. The Automobile brochure and the Energy source PDF are private source material and are not published. A new build does not remove files from an older deployment: after redeploying, verify that direct requests for both source-PDF paths return `404`. The Bills build instead uses `bills/app/index.html` as `/` and copies only the CSS, JavaScript, and brand images needed by that frontend. The parent site's Bills marketing page and app remain available at `/bills/` and `/bills/app/`.

The source canonical URLs for the two catalogues are `https://auto.electrony.xyz/` and `https://energy.electrony.xyz/`. These are the intended public URLs recorded in their HTML, not evidence that the Vercel projects or custom domains are configured or deployed; confirm the dashboard settings before launch. For Parent Electrony.xyz and the separate Bills Vercel project, configure `BILLS_API_BASE_URL` with the actual Railway API's HTTPS origin (no path, credentials, query, or fragment). The build injects it into `dist/src/config.js` for those two builds, which include the Bills app. Automobile, Energy, and Hardware builds use their same-origin `/api/contact` enquiry endpoint and do not require `BILLS_API_BASE_URL`. The Bills API remains a separate Railway service, and `bills-api/` must not be deployed as a static site.

The `buildCommand` is intentionally project-specific and is not fixed in `vercel.json`; configure the exact command above in each Vercel project's **Build & Development Settings**. Keep the Output Directory as `dist`. See [the Bills API deployment notes](./bills-api/README.md#vercel-frontend-and-railway-api) for CORS and Railway configuration. Vercel project Root Directory, framework, build command, environment variables, and custom domains are dashboard settings and must be checked or updated there.

Product status labels are maintained in `src/products.js`; product destinations are maintained in `src/config.js`.

## Electrony Automobile

The public Electrony Automobile page is available at `/automobile/`. Its 17 source-documented vehicle records (13 original models and four Dongfeng pickups) are maintained in [`src/automobile-catalogue.js`](./src/automobile-catalogue.js), separately from the page renderer. Brochure specifications and availability are presented for enquiry, not as confirmation of stock, ownership, authorized-dealer status or manufacturer partnership. Source PDFs are local reference material and are excluded from public builds. The internal landing-page link is maintained in `src/config.js` and the product record in `src/products.js`.

## Electrony Hardware

The Hardware catalogue is available at `/hardware/`. Its local catalogue entries and illustrations are enquiry prompts, not confirmed inventory; the page does not invent model numbers, prices, stock or technical specifications. Product enquiries are sent through `POST /api/contact`.

A future verified catalogue integration can still provide `window.ElectronyHardwareCatalogue` before `src/hardware.js` runs. Its `load({ signal })` method must return a promise for `{ products: [...] }`. Each provider product must have a stable Electrony `id`, provider-owned `providerProductId`, `name`, and a top-level `category` (`consumer-electronics`, `appliances`, `electrical-power`, `computers`, `cars-mobility`, or `solar-energy`). Optional fields are `variantId`, `brand`, `model`, `sku`, `description`, `image: { url, alt }`, authoritative `price: { amount, currency }`, authoritative `availability`, `specifications: [{ name, value }]`, and `detailUrl`. Provider identifiers remain the mapping to the commerce system's source of truth; prices and availability are never inferred by this page. Do not expose secret credentials in the browser. Cart and checkout are intentionally not implemented.

## Electrony Energy

The Energy catalogue is available at `/energy/`. Its product data is maintained separately from the page renderer in [`src/energy-catalogue.js`](./src/energy-catalogue.js). Each record includes its brand, product category, model where supplied, source-supported description/specifications, source page, and warranty only when stated. The public records contain no price field. The five-page source PDF is kept locally at `.sources/energy/POWER-SOLAR PL.pdf`; `.sources/` is ignored by Git and Vercel builds do not copy it, so the source price column is not published.

No secure Energy catalogue CMS or upload workflow exists. Until an authenticated administration system with server-side file validation and persistent storage is implemented, an authorized developer should add or update catalogue records and media through a reviewed repository change. Use descriptive filenames in `assets/catalogue/energy/`, retain original aspect ratios, use only approved matching product photographs, and keep the current clearly labelled category illustrations when an exact product image is unavailable. Do not add a public upload endpoint. The logos under `assets/catalogue/energy/brands/` were extracted from the supplied catalogue and are used only as brand marks.

Product videos are optional. To add one, set the product's `video` property in `src/energy-catalogue.js` to a verified 11-character YouTube video ID or HTTPS URL on `youtube.com`, `youtu.be`, or `youtube-nocookie.com`; no video is configured by default. A featured video can be configured with `window.ElectronyEnergyFeaturedVideo = { title: "…", video: "…" }` in that data file. The renderer validates each value and omits invalid or missing videos. Do not label a video as official without evidence.

Customers can request a quote for an individual catalogue item, complete installation or customised project. Product enquiries include the selected brand, model, source description, available specifications, warranty and page reference. The catalogue and calculator are not a system design or technical recommendation; suitability, electrical protection, compatibility and availability must be confirmed for each project.

## Contact enquiry delivery

Automobile, Hardware and Energy forms submit to a server-side Resend integration. The same endpoint is available as a Vercel function at `/api/contact` and as a route in the combined Railway website/API service. Local API development can serve the pages and route with `npm run dev:api` at `http://localhost:4174`; the static Python server (`npm run dev`) does not provide API routes.

Configure these server-only environment variables in the deployment that will deliver enquiries:

- `CONTACT_EMAIL` — the recipient mailbox; set this to the confirmed destination address.
- `RESEND_API_KEY` — a private Resend API key.
- `CONTACT_FROM_EMAIL` — a sender address or display-name address on a domain verified with Resend.

Set them in Vercel for the Vercel serverless endpoint, and in Railway if using its `/api/contact` route. Never add these values to `src/config.js`, browser JavaScript, or public build-time variables. Missing or invalid configuration returns an explicit `503` error; the form only reports success when Resend returns an accepted message identifier. Provider acceptance is not proof of inbox delivery. The repository does not define a recipient mailbox or a production Railway service URL.

The contact endpoint itself is same-origin and does not rely on Railway being available when a catalogue site is deployed to Vercel. The browser validates enquiries and reports API acceptance or failure; provider acceptance is not proof of inbox delivery. Confirm the recipient mailbox, Resend key and verified sender in the target deployment before relying on form submissions.