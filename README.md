# Electrony Technologies

## Local development

Run `npm run dev` and open `http://localhost:4173`.

Run `npm run check` to check the site scripts for syntax errors.

## Configuration

Set confirmed company and product URLs in `src/config.js`. Product content and categories are centralized in `src/products.js`.

Place the approved parent Electrony logo in `assets/brand/` when it is available. The current wordmark is text, not a redraw of the logo.

## Electrony Bills

The public Electrony Bills product page remains available at `/bills/` as the product introduction. The guest purchasing experience is available at `/bills/app/` and is implemented as a separate, mobile-first checkout flow with service-specific validation and payment review.

The `COMING SOON` status and internal landing-page link are maintained in `src/products.js` and `src/config.js`.

## Electrony Automobile

The public Electrony Automobile page is available at `/automobile/`. It presents a curated selection of vehicles, powertrain categories and selected brands for a marketing-only catalogue experience. The internal landing-page link is maintained in `src/config.js` and the product record in `src/products.js`.