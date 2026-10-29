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
| Electrony Account | `npm run build:vercel -- --site accounts` | `dist` |

Parent, Automobile, Energy, and Hardware builds copy the existing pages and shared runtime assets into `dist`, and select the requested page as the deployment's `/` entry point. Non-runtime Markdown documents, PDFs, hidden files, and `*.test.js` files are excluded. The Automobile brochure and the Energy source PDF are private source material and are not published. A new build does not remove files from an older deployment: after redeploying, verify that direct requests for both source-PDF paths return `404`. The Bills build instead uses `bills/app/index.html` as `/` and copies only the CSS, JavaScript, and brand images needed by that frontend. The parent site's Bills marketing page and app remain available at `/bills/` and `/bills/app/`.

The canonical origins recorded in the page metadata and configured product links are `https://electrony.xyz/`, `https://auto.electrony.xyz/`, `https://energy.electrony.xyz/`, `https://hardware.electrony.xyz/`, and `https://bills.electrony.xyz/`. They are the intended public URLs, not evidence that the Vercel projects or custom domains are configured or deployed; confirm the dashboard settings before launch. For Parent Electrony.xyz and the separate Bills Vercel project, configure `BILLS_API_BASE_URL` with the actual Railway API's HTTPS origin (no path, credentials, query, or fragment). The build injects it into `dist/src/config.js` for those two builds, which include the Bills app. Automobile, Energy, and Hardware builds use their same-origin `/api/contact` enquiry endpoint and do not require `BILLS_API_BASE_URL`. The Bills API remains a separate Railway service, and `bills-api/` must not be deployed as a static site.

Each static site build writes its own `robots.txt` and `sitemap.xml` for its configured canonical origin without `lastmod` values. The parent sitemap lists its home page and the Electrony Bills introduction at `/bills/`; the standalone Hardware, Automobile, Energy, and Bills builds list their actual root page. The parent copies of the Hardware page and Bills checkout app point to their respective standalone canonical URLs and are not listed as additional parent URLs. Hash-based vehicle details, catalogue filters, pagination states, and Energy product dialogs are not separate sitemap URLs.

The `buildCommand` is intentionally project-specific and is not fixed in `vercel.json`; configure the exact command above in each Vercel project's **Build & Development Settings**. Keep the Output Directory as `dist`. See [the Bills API deployment notes](./bills-api/README.md#vercel-frontend-and-railway-api) for CORS and Railway configuration. Vercel project Root Directory, framework, build command, environment variables, and custom domains are dashboard settings and must be checked or updated there.

Product status labels are maintained in `src/products.js`; product destinations are maintained in `src/config.js`.

## Electrony Account

The independent Electrony Account frontend is available in `accounts/` and is built with:

```text
npm run build:vercel -- --site accounts
```

The standalone Vercel deployment uses `dist` as its output directory and serves the sign-in page at `/` and the registered OAuth consent UI at `/oauth/consent/`. This is a browser-only frontend using Supabase Auth. No service-role key or other server secret belongs in this repository or in Vercel's browser build variables.

### Identity project configuration

Create or confirm a dedicated Electrony identity Supabase project; do not copy credentials from ElectronyOS, iStylist, or Bills. Configure these public build variables in the `accounts.electrony.xyz` Vercel project:

- `ELECTRONY_IDENTITY_SUPABASE_URL`: the identity project's HTTPS Supabase project URL.
- `ELECTRONY_IDENTITY_SUPABASE_PUBLISHABLE_KEY`: the identity project's public publishable key only.

Both variables are optional in the first UI-only build. If either real value is missing, the page deliberately displays configuration unavailable and does not attempt authentication. The build rejects placeholder publishable keys, missing pairs, non-HTTPS project origins, credential-bearing URLs, and strings that appear to be service-role or secret keys.

In the Supabase identity project dashboard:

1. Enable Email provider and choose email confirmation/password settings that match the deployed redirect URLs.
2. Keep Google and LinkedIn social providers disabled. The account UI intentionally does not show either provider button.
3. Under Authentication > URL Configuration, set **Site URL** to `https://accounts.electrony.xyz/`.
4. Add these exact HTTPS redirect URLs before testing:
   - `https://accounts.electrony.xyz/` for sign-up confirmation and ordinary sign-in callback processing.
   - `https://accounts.electrony.xyz/?view=update-password` for password recovery.
   - `https://accounts.electrony.xyz/oauth/consent/` only when the Supabase OAuth Server has an active, registered authorization request.
5. Enable **Confirm email** for sign-up if production registration should require email verification. Keep the Confirm signup and Reset password email templates pointed at `{{ .ConfirmationURL }}` so Supabase performs its documented verification/recovery redirect.
6. Use PKCE-compatible code links. Confirmation links and recovery links redirect to the two URLs above and the browser client exchanges the returned `code` with `exchangeCodeForSession()`.
7. Configure custom SMTP and sender identity only if the Supabase default mail service or sender domain is not approved for production.
8. Add exact DNS records and HTTPS custom-domain configuration in Vercel for `accounts.electrony.xyz`. Do not add HTTP production redirects or broad wildcard redirect URLs.

Official Supabase configuration references:

- [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
- [Password-based and recovery authentication](https://supabase.com/docs/guides/auth/passwords)
- [Email templates and confirmation URLs](https://supabase.com/docs/guides/auth/auth-email-templates)
- [OAuth 2.1 Server](https://supabase.com/docs/guides/auth/oauth-server)

The account frontend loads the official Supabase browser client and uses PKCE, password registration/sign-in, confirmation/resend, recovery, password update, session sign-out, and `getUser()` session validation. Email/password authentication is the only visible provider. The frontend does not mint tokens, share cookies or storage across domains, or accept arbitrary post-login return URLs.

### OAuth 2.1 server setup

Only complete this section after the identity project dashboard exposes a working OAuth Server configuration and registered clients.

1. Open Authentication > OAuth Server, enable the feature if it is available on the project, and set Site URL to the accounts site.
2. Set Authorization Path to `/oauth/consent`.
3. Register each Electrony product client in the dashboard. Record only its public client configuration and exact callback/redirect URIs. Never fabricate a client.
4. Do not grant product-admin, vendor, wallet, finance, KYC, BNPL, or credit permissions merely by enabling authentication or by approving an OAuth request.
5. Keep custom OAuth token claims and Row Level Security in scope; no product dashboards or permissions are implemented in this phase.

The consent route extracts the single Supabase `authorization_id` query parameter, preserves it in session storage during sign-in only, calls `getAuthorizationDetails()`, and renders the registered client's name and returned scopes. `approveAuthorization()` and `denyAuthorization()` handle the user's decision. Supabase generates and redirects authorization codes/tokens through its own documented flow; this frontend does not implement a token issuer or token exchange. If `authorization_id` is missing, the page fails closed.

### Later Bills pilot

Bills remains independently authenticated and guest checkout is unchanged. A later pilot may use a registered Electrony OAuth client only after:

- A real Bills client and exact callback URI are registered in the identity project.
- The Bills callback is tested in a browser and returns to Bills by a Supabase-supported OAuth authorization-code/PKCE flow.
- The Bills application validates the account server-side and maps explicit product permissions separately.
- No Bills JSON account, JWT, database record, vending, payment, or guest-checkout migration is performed.

Do not claim cross-domain SSO until the dashboard client, redirect allowlist, account callback, and end-to-end browser flow all pass.

## Electrony Automobile

The public Electrony Automobile page is available at `/automobile/`. Its 17 source-documented vehicle records (13 original models and four Dongfeng pickups) are maintained in [`src/automobile-catalogue.js`](./src/automobile-catalogue.js), separately from the page renderer. Brochure specifications and availability are presented for enquiry, not as confirmation of stock, ownership, authorized-dealer status or manufacturer partnership. Source PDFs are local reference material and are excluded from public builds. The internal landing-page link is maintained in `src/config.js` and the product record in `src/products.js`.

The existing ROX 01 showcase includes a local photo and video gallery; its original showcase image and enquiry action are retained. The uploaded media is presented under the ROX Motor brand rather than attributed to a specific trim because the source leaflet is for ROX ADAMAS and the media filenames do not establish the exact model variant. The two MP4 files in the `dongfeng-z9` asset folder are registered with that existing Z9 entry.

## Electrony Hardware

The Hardware catalogue is available at `/hardware/`. It includes 396 product listings transcribed from the Hisense (145), LG (135) and MAXI (116) supplier catalogues in `hardware/`. Product rows retain their source document and page, model/item code, description, extracted specifications, and document-level warranty when stated. Category artwork is illustrative rather than product photography. Source price columns are not published as current selling prices, and the undated `PROMO LIST.pdf` is not used to publish bundle offers. The PDFs are excluded from public builds. Confirm current prices, warranty terms, specifications and availability on enquiry; product enquiries are sent through `POST /api/contact`.

A future verified catalogue integration can still provide `window.ElectronyHardwareCatalogue` before `src/hardware.js` runs. Its `load({ signal })` method must return a promise for `{ products: [...] }`. Each provider product must have a stable Electrony `id`, provider-owned `providerProductId`, `name`, and a top-level `category` (`consumer-electronics`, `appliances`, `electrical-power`, `computers`, `cars-mobility`, or `solar-energy`). Optional fields are `variantId`, `brand`, `model`, `sku`, `description`, `image: { url, alt }`, authoritative `price: { amount, currency }`, authoritative `availability`, `specifications: [{ name, value }]`, and `detailUrl`. Provider identifiers remain the mapping to the commerce system's source of truth; prices and availability are never inferred by this page. Do not expose secret credentials in the browser. Cart and checkout are intentionally not implemented.

## Electrony Energy

The Energy catalogue is available at `/energy/`. Its product data is maintained separately from the page renderer in [`src/energy-catalogue.js`](./src/energy-catalogue.js). Each record includes its brand, product category, model where supplied, source-supported description/specifications, source page, and warranty only when stated. The public records contain no price field. The five-page source PDF is kept locally at `.sources/energy/POWER-SOLAR PL.pdf`; `.sources/` is ignored by Git and Vercel builds do not copy it, so the source price column is not published.

No Energy catalogue CMS or upload workflow exists. Until an authenticated administration system with server-side file validation and persistent storage is implemented, add or update catalogue records and media through a reviewed repository change. Do not add a public upload endpoint.

### Adding genuine Energy product images

1. Put each approved, correctly identified product image in `assets/catalogue/energy/products/<brand>/`. Create the lowercase brand directory if needed. This directory is copied into the Energy public build under `/assets/catalogue/energy/products/`.
2. Prefer lowercase filenames with letters, numbers, and hyphens for new assets. Existing uploaded filenames are preserved as supplied, including spaces; reference their exact paths and verify those paths in the production build.
3. Match the image to the existing catalogue record by its `id`, brand, and exact model in `src/energy-catalogue.js`. The generated product ID is a lowercase brand-model slug; do not rename, duplicate, or reorder records to add an image.
4. Add the optional `image` object to that product's existing `makeProduct` details. For example, the real catalogue record `huawei-esm-48200a1` (`HUAWEI`, model `ESM-48200A1`) can use this field when a genuine image is available:

   ```js
   image: {
     url: "../assets/catalogue/energy/products/huawei/esm-48200a1.webp",
     alt: "Huawei ESM-48200A1 10 kWh lithium battery"
   }
   ```

   The path is relative to the Energy page, as with the existing catalogue image paths. Only add the field after placing an appropriately licensed image at that exact path. This example does not add or claim a product photograph.
5. WebP is recommended; the existing `<img>` renderer also supports browser-readable JPEG, PNG, and SVG assets, and the static build copies these formats without image conversion. The card reserves a 4:3 image area and sets 1200×900 intrinsic dimensions; prepare product images near 1200×900 pixels to avoid upscaling or cropping. There is no enforced file-size limit; aim for 300 KB or less per WebP to keep catalogue loading efficient.
6. Products without a product-specific image continue to use the existing category illustration. An absent or failed product image also falls back to the labelled category-artwork placeholder; do not use an unrelated product image.
7. Build the Energy site with `npm run build:vercel -- --site energy`, then serve `dist/` locally (for example, `python3 -m http.server 4173 --directory dist`) and inspect the product card at `http://localhost:4173/`. Confirm that the photograph matches the displayed brand/model, its alt text is meaningful, the fallback remains for other products, and the browser console shows no missing asset requests. The static build excludes source PDFs and Markdown files.

Product videos are optional. To add one, set the product's `video` property in `src/energy-catalogue.js` to a verified 11-character YouTube video ID or HTTPS URL on `youtube.com`, `youtu.be`, or `youtube-nocookie.com`; no video is configured by default. A featured video can be configured with `window.ElectronyEnergyFeaturedVideo = { title: "…", video: "…" }` in that data file. The renderer validates each value and omits invalid or missing videos. Do not label a video as official without evidence.

Customers can request a quote for an individual catalogue item, complete installation or customised project. Product enquiries include the selected brand, model, source description, available specifications, warranty and page reference. The catalogue and calculator are not a system design or technical recommendation; suitability, electrical protection, compatibility and availability must be confirmed for each project.

The current catalogue is client-rendered from one static page: product cards and a details dialog do not have individual public URLs. Consequently, the Energy sitemap lists only the genuine Energy page; the site does not generate hundreds of product URLs or product/offer structured data. Adding independently indexable product pages would require a future static-page generation or routing change.

## SEO and search-engine setup

The static pages have unique titles and descriptions, absolute canonical and social-sharing URLs, language and viewport declarations, existing brand favicons, social image alternatives, and JSON-LD only for the Organization, WebSite, and WebPage information actually supported by the pages. Vehicle hash routes retain the Automobile page as their canonical URL; product filters and dialogs are not treated as pages. Product schema and price/availability offers are not emitted.

After deploying the matching build to each production origin:

1. Verify the parent `electrony.xyz` property and each deployed subdomain property (`auto`, `energy`, and, if deployed, `hardware` and `bills`) in Google Search Console using the available DNS or URL-prefix verification method.
2. Submit that origin's `https://<domain>/sitemap.xml` in Search Console. Check the deployed `robots.txt`, sitemap URLs, page indexability, and canonical URLs with URL Inspection.
3. Monitor indexing reports, crawl errors, canonical selection, and structured-data reports. Validate JSON-LD with Google's Rich Results Test or Schema Markup Validator when useful; valid markup does not guarantee a rich result.
4. Add the same properties and sitemap URLs to Bing Webmaster Tools if Bing visibility is desired.

The repository does not submit or verify any property. Metadata and sitemaps help crawlers discover and interpret pages, but do not guarantee indexing, rankings, or search-result presentation.

## Contact enquiry delivery

Automobile, Hardware and Energy forms submit to a server-side Resend integration. The same endpoint is available as a Vercel function at `/api/contact` and as a route in the combined Railway website/API service. Local API development can serve the pages and route with `npm run dev:api` at `http://localhost:4174`; the static Python server (`npm run dev`) does not provide API routes.

Configure these server-only environment variables in the deployment that will deliver enquiries:

- `CONTACT_EMAIL` — the recipient mailbox; set this to the confirmed destination address.
- `RESEND_API_KEY` — a private Resend API key.
- `CONTACT_FROM_EMAIL` — a sender address or display-name address on a domain verified with Resend.

Set them in Vercel for the Vercel serverless endpoint, and in Railway if using its `/api/contact` route. Never add these values to `src/config.js`, browser JavaScript, or public build-time variables. Missing or invalid configuration returns an explicit `503` error; the form only reports success when Resend returns an accepted message identifier. Provider acceptance is not proof of inbox delivery. The repository does not define a recipient mailbox or a production Railway service URL.

The contact endpoint itself is same-origin and does not rely on Railway being available when a catalogue site is deployed to Vercel. The browser validates enquiries and reports API acceptance or failure; provider acceptance is not proof of inbox delivery. Confirm the recipient mailbox, Resend key and verified sender in the target deployment before relying on form submissions.