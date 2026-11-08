const energyProducts = window.ElectronyEnergyProducts;
const energyCategories = window.ElectronyEnergyCategories;
const solarPackages = window.ElectronySolarPackages;
const energyCatalogue = window.ElectronyEnergyCatalogue;
if (!Array.isArray(energyProducts) || !energyProducts.length || !energyCategories) {
  throw new Error("Energy catalogue data did not load.");
}
if (!Array.isArray(solarPackages) || !energyCatalogue) {
  throw new Error("Solar package catalogue data did not load.");
}

const searchInput = document.querySelector("#energy-search");
const clearSearchButton = document.querySelector("#energy-clear-search");
const brandFilter = document.querySelector("#energy-brand-filter");
const categoryFilter = document.querySelector("#energy-category-filter");
const productGrid = document.querySelector("#energy-products");
const activeFilters = document.querySelector("#energy-active-filters");
const resetFiltersButton = document.querySelector("#energy-reset-filters");
const energyRecommendationProducts = document.querySelector("#energy-recommendation-products");
const catalogueEmpty = document.querySelector("#energy-catalogue-empty");
const catalogueStatus = document.querySelector("#energy-catalogue-status");
const pagination = document.querySelector("#energy-catalogue-pagination");
const previousPageButton = document.querySelector("#energy-page-previous");
const nextPageButton = document.querySelector("#energy-page-next");
const pageStatus = document.querySelector("#energy-page-status");
const categorySelect = document.querySelector("#energy-category");
const productInput = document.querySelector("#energy-product");
const requirementsInput = document.querySelector("#energy-requirements");
const customerTypeSelect = document.querySelector("#energy-customer-type");
const productDialog = document.querySelector("#energy-product-dialog");
const featuredVideo = document.querySelector("#energy-featured-video");
const packageCatalogue = document.querySelector("#energy-package-catalogue");
const packageResultsRecommendedGrid = document.querySelector("#energy-recommended-packages");
const packageResultsExploreGrid = document.querySelector("#energy-explore-packages");
const packageResultsExploreWrap = document.querySelector("#energy-packages-to-explore");
const packageResultsIntro = document.querySelector("#energy-package-recommendation-intro");
const packageResultsEmpty = document.querySelector("#energy-package-recommendation-empty");
const productPageSize = 12;
let selectedProduct = null;
let selectedProductCalculationSummary = "";
let currentProductPage = 1;
const energySceneObserver = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { rootMargin: "80px 0px" })
  : null;
const calculatorScene = document.querySelector(".energy-calculator--hero");
if (calculatorScene) {
  if (energySceneObserver) {
    energySceneObserver.observe(calculatorScene);
  } else {
    calculatorScene.classList.add("is-visible");
  }
}
const circuitSwitch = document.querySelector("#energy-circuit-switch");
if (calculatorScene && circuitSwitch) {
  circuitSwitch.addEventListener("click", () => {
    const isOn = circuitSwitch.getAttribute("aria-pressed") !== "true";
    circuitSwitch.setAttribute("aria-pressed", String(isOn));
    calculatorScene.classList.toggle("is-on", isOn);
  });
}

function safeImageUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const imageUrl = new URL(value, document.baseURI);
    if (imageUrl.origin !== window.location.origin
      || (!imageUrl.pathname.startsWith("/assets/") && !imageUrl.pathname.startsWith("/energy/"))
      || imageUrl.search
      || imageUrl.hash) {
      return null;
    }
    return imageUrl.href;
  } catch {
    return null;
  }
}

function getYouTubeVideoId(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  const candidate = value.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(candidate)) return candidate;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" || url.username || url.password) return "";
    const hostname = url.hostname.toLowerCase();
    let videoId = "";
    if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(hostname)) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") || "";
      } else if (/^\/(?:embed|shorts|live)\/[A-Za-z0-9_-]{11}$/.test(url.pathname)) {
        videoId = url.pathname.split("/").pop();
      }
    } else if (hostname === "youtu.be") {
      videoId = url.pathname.slice(1);
    } else if (hostname === "youtube-nocookie.com" && url.pathname.startsWith("/embed/")) {
      videoId = url.pathname.slice("/embed/".length);
    }
    return /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : "";
  } catch {
    return "";
  }
}

function createYouTubeFrame(videoValue, title) {
  const videoId = getYouTubeVideoId(videoValue);
  if (!videoId) return null;
  const frame = document.createElement("iframe");
  frame.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
  frame.title = title;
  frame.loading = "lazy";
  frame.referrerPolicy = "strict-origin-when-cross-origin";
  frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  frame.allowFullscreen = true;
  return frame;
}

function addFilterOptions() {
  const brands = [...new Set(energyProducts.map((product) => product.brand))]
    .sort((left, right) => left.localeCompare(right));
  brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandFilter.appendChild(option);
  });

  Object.entries(energyCategories)
    .filter(([category]) => energyProducts.some((product) => product.category === category))
    .sort(([, left], [, right]) => left.localeCompare(right))
    .forEach(([category, label]) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = label;
      categoryFilter.appendChild(option);
    });
}

function createElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function cataloguePriceLabel(product) {
  return product.priceNgn === null ? "Request current price" : `₦${product.priceDisplay}`;
}

function createEnergyProductCard(product) {
  const card = createElement("article", "energy-product-card");
  const visual = createElement("div", "energy-product-card__image");
  const imageUrl = safeImageUrl(product.image?.url);
  if (imageUrl && product.image?.alt) {
    const image = createElement("img");
    image.src = imageUrl;
    image.alt = product.image.alt;
    image.width = 1200;
    image.height = 900;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      image.remove();
      visual.appendChild(createElement("span", "energy-product-card__fallback", "ILLUSTRATIVE CATEGORY ARTWORK"));
    }, { once: true });
    visual.appendChild(image);
  } else {
    visual.appendChild(createElement("span", "energy-product-card__fallback", "ILLUSTRATIVE CATEGORY ARTWORK"));
  }

  const body = createElement("div", "energy-product-card__body");
  const brandLine = createElement("div", "energy-product-card__brand");
  const brandLogoUrl = safeImageUrl(product.brandLogo);
  if (brandLogoUrl) {
    const logo = createElement("img");
    logo.src = brandLogoUrl;
    logo.alt = `${product.brand} logo`;
    logo.loading = "lazy";
    logo.addEventListener("error", () => logo.remove(), { once: true });
    brandLine.appendChild(logo);
  }
  brandLine.appendChild(createElement("span", "", product.brand));

  const category = createElement("p", "energy-product-card__category", energyCategories[product.category] || "Energy equipment");
  const title = createElement("h3", "energy-product-card__title", product.name);
  const model = product.model
    ? createElement("p", "energy-product-card__model", product.model)
    : null;
  const price = createElement("p", "energy-product-card__price", cataloguePriceLabel(product));
  price.setAttribute("aria-label", product.priceNgn === null
    ? "Request current price"
    : `Catalogue price ${cataloguePriceLabel(product)}`);
  const description = createElement("p", "energy-product-card__description", product.description);
  body.append(brandLine, category, title);
  if (model) body.appendChild(model);
  body.appendChild(price);
  if (description.textContent) body.appendChild(description);

  if (product.specifications.length) {
    const specifications = createElement("ul", "energy-product-card__specifications");
    product.specifications.slice(0, 3).forEach((specification) => {
      specifications.appendChild(createElement("li", "", specification));
    });
    body.appendChild(specifications);
  }
  if (product.warranty) {
    body.appendChild(createElement("p", "energy-product-card__warranty", `Warranty: ${product.warranty}`));
  }

  const footer = createElement("div", "energy-product-card__footer");
  const detailButton = createElement("button", "energy-product-card__details", "Product details");
  detailButton.type = "button";
  detailButton.dataset.productDetails = product.id;
  const quoteButton = createElement("button", "energy-product-card__enquire", "Request a quote");
  quoteButton.type = "button";
  quoteButton.dataset.requestProduct = product.id;
  footer.append(detailButton, quoteButton);
  card.append(visual, body, footer);
  return card;
}

function updateActiveFilters() {
  const filters = [];
  if (searchInput.value.trim()) filters.push(`Search: ${searchInput.value.trim()}`);
  if (brandFilter.value !== "all") filters.push(`Brand: ${brandFilter.value}`);
  if (categoryFilter.value !== "all") filters.push(`Category: ${energyCategories[categoryFilter.value]}`);
  activeFilters.replaceChildren();
  filters.forEach((filter) => activeFilters.appendChild(createElement("span", "energy-active-filter", filter)));
  activeFilters.hidden = !filters.length;
  resetFiltersButton.disabled = !filters.length;
}

function renderEnergyCatalogue() {
  const filters = {
    query: searchInput.value,
    brand: brandFilter.value,
    category: categoryFilter.value
  };
  const filteredProducts = energyCatalogue.filterEnergyProducts(energyProducts, filters, energyCategories);
  const page = energyCatalogue.getEnergyProductPage(filteredProducts, currentProductPage, productPageSize);
  currentProductPage = page.page;

  productGrid.replaceChildren();
  catalogueEmpty.hidden = filteredProducts.length > 0;
  clearSearchButton.disabled = !searchInput.value.trim();
  updateActiveFilters();
  pagination.hidden = filteredProducts.length === 0 || page.pageCount <= 1;
  previousPageButton.disabled = page.page <= 1;
  nextPageButton.disabled = page.page >= page.pageCount;
  pageStatus.textContent = `Page ${page.page} of ${page.pageCount}`;
  if (!filteredProducts.length) {
    document.querySelector("#energy-empty-label").textContent = searchInput.value.trim() ? "No search matches" : "No matching products";
    document.querySelector("#energy-empty-title").textContent = "No products match these filters.";
    catalogueStatus.textContent = `Showing 0 of ${energyProducts.length} products. Try another search, brand or category.`;
    return;
  }

  page.products.forEach((product) => productGrid.appendChild(createEnergyProductCard(product)));
  catalogueStatus.textContent = `Showing ${page.startIndex + 1}–${page.endIndex} of ${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}.`;
}

function createPackageCard(solarPackage, comparison = null) {
  const card = createElement("article", "energy-package-card");
  const pricing = window.ElectronyEnergyPricing.calculateSolarPackagePricing(solarPackage, energyProducts);
  const application = createElement("p", "energy-package-card__application", solarPackage.application);
  const title = createElement("h3", "energy-package-card__title", solarPackage.name);
  const capacity = createElement("p", "energy-package-card__capacity", `System capacity: ${solarPackage.capacity}`);
  const badge = comparison
    ? createElement("p", "energy-package-card__badge", comparison.recommended ? "Preliminary rating comparison" : "Explore with Electrony")
    : null;
  const summary = createElement("ul", "energy-package-card__summary");
  summary.append(
    createElement("li", "", `Inverter: ${formatPackageWatts(solarPackage.inverterWatts)}; ${solarPackage.components[0].details}.`),
    createElement("li", "", `Solar array: ${solarPackage.panelCount} × ${solarPackage.panelWatts}W panels (${formatPackageWatts(solarPackage.panelCount * solarPackage.panelWatts)} rated total).`),
    createElement("li", "", solarPackage.batterySummary)
  );
  card.append(title, capacity, application);
  if (badge) card.appendChild(badge);
  card.appendChild(createPackageScene(solarPackage.id));
  card.appendChild(summary);
  if (comparison) {
    const comparisonList = createElement("ul", "energy-package-card__comparison");
    comparisonList.append(
      createElement("li", "", comparison.inverterMeets
        ? `${formatPackageWatts(solarPackage.inverterWatts)} listed inverter rating meets or exceeds the ${formatPackageWatts(comparison.estimate.inverterW)} calculator estimate.`
        : `${formatPackageWatts(solarPackage.inverterWatts)} listed inverter rating is below the ${formatPackageWatts(comparison.estimate.inverterW)} calculator estimate.`),
      createElement("li", "", comparison.solarMeets
        ? `${formatPackageWatts(comparison.solarArrayW)} listed panel-array rating meets or exceeds the ${formatPackageWatts(comparison.estimate.solarW)} calculator estimate.`
        : `${formatPackageWatts(comparison.solarArrayW)} listed panel-array rating is below the ${formatPackageWatts(comparison.estimate.solarW)} calculator estimate.`)
    );
    if (comparison.batteryStatus !== "not-required") {
      comparisonList.appendChild(createElement("li", "", comparison.batteryStatus === "meets"
        ? `${formatPackageEnergy(solarPackage.batteryNominalWh)} stated nominal battery capacity meets or exceeds the ${formatPackageEnergy(comparison.estimate.batteryNominalWh)} calculator estimate.`
        : comparison.batteryStatus === "below"
          ? `${formatPackageEnergy(solarPackage.batteryNominalWh)} stated nominal battery capacity is below the ${formatPackageEnergy(comparison.estimate.batteryNominalWh)} calculator estimate.`
          : `Battery capacity cannot be compared with the ${formatPackageEnergy(comparison.estimate.batteryNominalWh)} calculator estimate because the package source is ambiguous.`));
    }
    comparisonList.appendChild(createElement("li", "", "The source does not state daily energy capacity in kWh/day, so daily consumption cannot be compared."));
    card.appendChild(comparisonList);
  }

  const details = document.createElement("details");
  details.className = "energy-package-card__details";
  const disclosure = document.createElement("summary");
  disclosure.textContent = "View itemized components and pricing";
  const componentList = createElement("ul", "energy-package-pricing__lines");
  pricing.lines.forEach((line) => {
    const componentLine = createElement("li", "energy-package-pricing__line");
    const componentHeading = createElement("strong", "energy-package-pricing__category", line.component.category);
    const productName = createElement("span", "energy-package-pricing__product", `${line.manufacturer} — ${line.model}`);
    const componentDetails = createElement("span", "energy-package-pricing__description", line.component.details);
    const amounts = createElement("dl", "energy-package-pricing__amounts");
    [
      ["Quantity", `${line.component.quantity} ${line.component.unit}${line.component.quantity === 1 ? "" : "s"}`],
      ["Unit price", line.unitPriceNgn === null ? "Request current price" : cataloguePriceLabel(line.product)],
      ["Line total", line.lineTotalNgn === null ? "Request current price" : formatNaira(line.lineTotalNgn)]
    ].forEach(([label, amount]) => {
      const entry = createElement("div");
      entry.append(createElement("dt", "", label), createElement("dd", "", amount));
      amounts.appendChild(entry);
    });
    componentLine.append(componentHeading, productName, componentDetails, amounts);
    componentList.appendChild(componentLine);
  });
  const pricingSummary = createElement("div", "energy-package-pricing__summary");
  pricingSummary.append(
    createElement("strong", "", pricing.complete ? "Package component total" : "Partial component subtotal · confirmed prices only"),
    createElement("span", "", pricing.complete && pricing.totalNgn !== null
      ? formatNaira(pricing.totalNgn)
      : pricing.subtotalNgn === null ? "Full total unavailable" : formatNaira(pricing.subtotalNgn)),
    createElement("p", "", pricing.complete
      ? "All listed component prices are confirmed in the product price list."
      : `Full package component total unavailable: ${pricing.unpricedLines.length} required ${pricing.unpricedLines.length === 1 ? "line has" : "lines have"} no confirmed price.`),
    createElement("p", "", "Component pricing only; installation, transportation, labour, taxes, engineering and other fees not explicitly priced are excluded.")
  );
  details.append(disclosure, componentList, pricingSummary);
  card.appendChild(details);
  if (solarPackage.reviewNote) {
    card.appendChild(createElement("p", "energy-package-card__review", `Source detail to confirm: ${solarPackage.reviewNote}`));
  }
  if (solarPackage.pricingNote) {
    card.appendChild(createElement("p", "energy-package-card__review", solarPackage.pricingNote));
  }
  card.appendChild(createElement("p", "energy-package-card__suitability",
    "Package suitability is not guaranteed. Final system design requires load assessment and site evaluation, including battery/inverter compatibility, PV string sizing and project-specific circuit protection."));
  const source = createElement("p", "energy-package-card__source", `Source: ${solarPackage.source.document}, page ${solarPackage.source.page}.`);
  const priceSource = createElement("p", "energy-package-card__source", "Individual product catalogue prices: POWER-SOLAR PL-1.pdf (5 November 2026). Confirm current prices before an order is accepted; no stock or availability is implied.");
  const footer = createElement("div", "energy-package-card__footer");
  const quote = document.createElement("a");
  quote.className = "button energy-button energy-button--primary";
  quote.href = "#quote";
  quote.textContent = "Request a Quote";
  quote.addEventListener("click", (event) => {
    event.preventDefault();
    requestSolarPackage(solarPackage, comparison?.estimate || null);
  });
  footer.appendChild(quote);
  card.append(source, priceSource, footer);
  card.insertBefore(pricingSummary.cloneNode(true), details);
  return card;
}

function createPackageScene(packageId) {
  const sceneMarkup = packageSceneMarkup[packageId];
  if (!sceneMarkup) {
    throw new Error(`No solar package scene is configured for "${packageId}".`);
  }
  const scene = createElement("figure", `energy-package-scene energy-package-scene--${packageId}`);
  scene.setAttribute("aria-hidden", "true");
  scene.innerHTML = sceneMarkup;
  if (energySceneObserver) {
    energySceneObserver.observe(scene);
  } else {
    scene.classList.add("is-visible");
  }
  return scene;
}

const packageSceneMarkup = Object.freeze({
  "basic-small-home-office": `
    <svg class="energy-package-scene__art" viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <rect class="energy-package-scene__backdrop" width="640" height="220" rx="14"/>
      <circle class="energy-package-scene__sun" cx="105" cy="40" r="20"/>
      <circle class="energy-package-scene__sunlight" cx="105" cy="40" r="32"/>
      <path class="energy-package-scene__ground" d="M22 190H618"/>
      <g class="energy-package-scene__panel">
        <path d="m27 83 75-14 14 42-75 14z"/>
        <path class="energy-package-scene__panel-grid" d="m52 79 14 42m15-46 14 42M39 98l75-14m-68 34 75-14"/>
        <path class="energy-package-scene__panel-glint" d="m31 83 75-14"/>
      </g>
      <rect class="energy-package-scene__equipment" x="48" y="139" width="54" height="37" rx="5"/>
      <path class="energy-package-scene__equipment-detail" d="M61 151h28m-28 9h19"/>
      <path class="energy-package-scene__cable-shadow" d="M102 159C164 159 175 174 240 174s66-7 114-7"/>
      <path class="energy-package-scene__cable" d="M102 159C164 159 175 174 240 174s66-7 114-7"/>
      <path class="energy-package-scene__pulse" d="M102 159C164 159 175 174 240 174s66-7 114-7"/>
      <path class="energy-package-scene__building" d="m331 104 69-49 70 49v80H331z"/>
      <path class="energy-package-scene__roof" d="m319 107 81-59 81 59"/>
      <rect class="energy-package-scene__window energy-package-scene__window--one" x="348" y="117" width="25" height="23" rx="2"/>
      <rect class="energy-package-scene__window energy-package-scene__window--two" x="390" y="117" width="25" height="23" rx="2"/>
      <rect class="energy-package-scene__window energy-package-scene__window--three" x="432" y="117" width="25" height="23" rx="2"/>
      <path class="energy-package-scene__window-frame" d="M360 117v23m42-23v23m42-23v23"/>
      <path class="energy-package-scene__door" d="M386 151h29v33h-29z"/>
      <path class="energy-package-scene__cable-entry" d="M354 167h10"/>
      <g class="energy-package-scene__detail">
        <path d="M478 125h23v10h-23zM482 135v8m15-8v8"/>
        <path d="M487 82v20m-10-10h20m-17-7 14 14m0-14-14 14"/>
        <rect x="513" y="115" width="22" height="34" rx="3"/>
        <path d="M518 120h12m-12 5h12m-12 5h12"/>
        <rect x="546" y="123" width="33" height="21" rx="2"/>
        <path d="M555 149h15m-7-5v5"/>
      </g>
      <text class="energy-package-scene__label" x="28" y="207">SMALL HOME / OFFICE</text>
      <text class="energy-package-scene__label" x="494" y="207">EVERYDAY LOADS</text>
    </svg>`,
  "medium-home-office": `
    <svg class="energy-package-scene__art" viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <rect class="energy-package-scene__backdrop" width="640" height="220" rx="14"/>
      <circle class="energy-package-scene__sun" cx="105" cy="40" r="20"/>
      <circle class="energy-package-scene__sunlight" cx="105" cy="40" r="32"/>
      <path class="energy-package-scene__ground" d="M22 190H618"/>
      <g class="energy-package-scene__panel">
        <path d="m24 75 82-14 13 40-82 14z"/>
        <path class="energy-package-scene__panel-grid" d="m44 72 13 40m17-43 13 40m17-44 13 40M30 88l82-14m-70 35 82-14"/>
        <path class="energy-package-scene__panel-glint" d="m28 75 82-14"/>
      </g>
      <rect class="energy-package-scene__equipment" x="42" y="139" width="58" height="37" rx="5"/>
      <path class="energy-package-scene__equipment-detail" d="M55 151h31m-31 9h22"/>
      <path class="energy-package-scene__cable-shadow" d="M100 159C160 159 181 174 239 174s64-8 103-8"/>
      <path class="energy-package-scene__cable" d="M100 159C160 159 181 174 239 174s64-8 103-8"/>
      <path class="energy-package-scene__pulse" d="M100 159C160 159 181 174 239 174s64-8 103-8"/>
      <path class="energy-package-scene__building" d="m322 105 53-39 54 39v79H322z"/>
      <path class="energy-package-scene__roof" d="m312 108 63-47 64 47"/>
      <rect class="energy-package-scene__window energy-package-scene__window--one" x="337" y="116" width="25" height="25" rx="2"/>
      <rect class="energy-package-scene__window energy-package-scene__window--two" x="378" y="116" width="25" height="25" rx="2"/>
      <path class="energy-package-scene__window-frame" d="M349 116v25m41-25v25"/>
      <path class="energy-package-scene__door" d="M361 151h29v33h-29z"/>
      <path class="energy-package-scene__cable-entry" d="M339 166h10"/>
      <path class="energy-package-scene__building energy-package-scene__building--office" d="M449 94h130v90H449z"/>
      <path class="energy-package-scene__roof energy-package-scene__roof--office" d="M441 94h146"/>
      <rect class="energy-package-scene__window energy-package-scene__window--three" x="463" y="108" width="24" height="24" rx="2"/>
      <rect class="energy-package-scene__window energy-package-scene__window--four" x="500" y="108" width="24" height="24" rx="2"/>
      <rect class="energy-package-scene__window energy-package-scene__window--five" x="537" y="108" width="24" height="24" rx="2"/>
      <path class="energy-package-scene__window-frame" d="M475 108v24m37-24v24m37-24v24"/>
      <path class="energy-package-scene__door" d="M497 148h32v36h-32z"/>
      <g class="energy-package-scene__detail">
        <rect x="300" y="135" width="15" height="32" rx="2"/>
        <path d="M304 141h7m-7 5h7m-7 5h7m-7 5h7"/>
        <rect x="283" y="143" width="13" height="24" rx="2"/>
        <path d="M286 148h7m-7 5h7m-7 5h7"/>
        <path d="M537 77v12m-9-6h18m-15-6 12 12m0-12-12 12"/>
        <path d="M566 83h20v7h-20zM570 90v6m12-6v6"/>
      </g>
      <text class="energy-package-scene__label" x="28" y="207">STANDARD HOUSEHOLD</text>
      <text class="energy-package-scene__label" x="460" y="207">MEDIUM OFFICE</text>
    </svg>`,
  "premium-executive-corporate": `
    <svg class="energy-package-scene__art" viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <rect class="energy-package-scene__backdrop" width="640" height="220" rx="14"/>
      <circle class="energy-package-scene__sun" cx="103" cy="39" r="20"/>
      <circle class="energy-package-scene__sunlight" cx="103" cy="39" r="32"/>
      <path class="energy-package-scene__ground" d="M22 190H618"/>
      <g class="energy-package-scene__panel">
        <path d="m22 72 85-14 14 42-85 14z"/>
        <path class="energy-package-scene__panel-grid" d="m42 69 14 42m19-45 14 42m19-46 14 42M28 85l85-14m-72 35 85-14"/>
        <path class="energy-package-scene__panel-glint" d="m26 72 85-14"/>
      </g>
      <rect class="energy-package-scene__equipment" x="41" y="138" width="62" height="39" rx="5"/>
      <path class="energy-package-scene__equipment-detail" d="M55 150h34m-34 10h24"/>
      <rect class="energy-package-scene__battery" x="111" y="128" width="31" height="49" rx="4"/>
      <path class="energy-package-scene__battery-fill" d="M118 165h17v6h-17z"/>
      <path class="energy-package-scene__cable-shadow" d="M103 158C168 158 187 173 248 173s52-7 81-7"/>
      <path class="energy-package-scene__cable" d="M103 158C168 158 187 173 248 173s52-7 81-7"/>
      <path class="energy-package-scene__pulse" d="M103 158C168 158 187 173 248 173s52-7 81-7"/>
      <path class="energy-package-scene__building" d="M329 84h245v100H329z"/>
      <path class="energy-package-scene__roof energy-package-scene__roof--office" d="M321 84h261"/>
      <path class="energy-package-scene__building-detail" d="M329 149h245M411 84v100m82-100v100"/>
      <rect class="energy-package-scene__window energy-package-scene__window--one" x="347" y="101" width="42" height="35" rx="2"/>
      <rect class="energy-package-scene__window energy-package-scene__window--two" x="429" y="101" width="42" height="35" rx="2"/>
      <rect class="energy-package-scene__window energy-package-scene__window--three" x="511" y="101" width="42" height="35" rx="2"/>
      <rect class="energy-package-scene__window energy-package-scene__window--four" x="347" y="157" width="42" height="20" rx="2"/>
      <rect class="energy-package-scene__window energy-package-scene__window--five" x="429" y="157" width="42" height="20" rx="2"/>
      <rect class="energy-package-scene__window energy-package-scene__window--six" x="511" y="157" width="42" height="20" rx="2"/>
      <path class="energy-package-scene__cable-entry" d="M329 166h11"/>
      <g class="energy-package-scene__detail">
        <path d="M354 73v9m-8-4h16m-13-6 10 10m0-10-10 10M436 73v9m-8-4h16m-13-6 10 10m0-10-10 10M518 73v9m-8-4h16m-13-6 10 10m0-10-10 10"/>
        <path d="M267 161v-14h26v14m-31 3h36v6h-36z"/>
        <path d="M278 147v-8m-7 4h14m-11-7 8 8m0-8-8 8"/>
      </g>
      <text class="energy-package-scene__label" x="28" y="207">12-PANEL ARRAY</text>
      <text class="energy-package-scene__label" x="482" y="207">HOME / ENTERPRISE</text>
    </svg>`,
  "heavy-commercial-industrial": `
    <svg class="energy-package-scene__art" viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <rect class="energy-package-scene__backdrop" width="640" height="220" rx="14"/>
      <circle class="energy-package-scene__sun" cx="94" cy="38" r="20"/>
      <circle class="energy-package-scene__sunlight" cx="94" cy="38" r="32"/>
      <path class="energy-package-scene__ground" d="M22 190H618"/>
      <g class="energy-package-scene__panel">
        <path d="m20 69 91-14 13 40-91 14z"/>
        <path class="energy-package-scene__panel-grid" d="m36 66 13 40m17-43 13 40m17-43 13 40M25 81l91-14m-80 32 91-14"/>
        <path class="energy-package-scene__panel-glint" d="m24 69 91-14"/>
      </g>
      <rect class="energy-package-scene__equipment" x="37" y="135" width="57" height="42" rx="5"/>
      <path class="energy-package-scene__equipment-detail" d="M49 148h32m-32 10h25"/>
      <rect class="energy-package-scene__battery" x="101" y="126" width="22" height="51" rx="3"/>
      <rect class="energy-package-scene__battery" x="128" y="126" width="22" height="51" rx="3"/>
      <rect class="energy-package-scene__battery" x="155" y="126" width="22" height="51" rx="3"/>
      <path class="energy-package-scene__battery-fill" d="M106 164h12v7h-12zm27 0h12v7h-12zm27 0h12v7h-12z"/>
      <path class="energy-package-scene__cable-shadow" d="M94 157C170 157 191 174 260 174s49-8 84-8"/>
      <path class="energy-package-scene__cable" d="M94 157C170 157 191 174 260 174s49-8 84-8"/>
      <path class="energy-package-scene__pulse" d="M94 157C170 157 191 174 260 174s49-8 84-8"/>
      <path class="energy-package-scene__building" d="M344 116 378 86l32 30 33-30 33 30 34-30 42 30v68H344z"/>
      <path class="energy-package-scene__roof" d="m335 119 43-40 32 30 33-30 33 30 34-30 51 39"/>
      <rect class="energy-package-scene__window energy-package-scene__window--one" x="365" y="126" width="35" height="28" rx="2"/>
      <rect class="energy-package-scene__window energy-package-scene__window--two" x="421" y="126" width="35" height="28" rx="2"/>
      <rect class="energy-package-scene__window energy-package-scene__window--three" x="477" y="126" width="35" height="28" rx="2"/>
      <rect class="energy-package-scene__window energy-package-scene__window--four" x="533" y="126" width="35" height="28" rx="2"/>
      <path class="energy-package-scene__window-frame" d="M382 126v28m56-28v28m56-28v28m56-28v28"/>
      <path class="energy-package-scene__door" d="M470 157h35v27h-35z"/>
      <path class="energy-package-scene__cable-entry" d="M344 166h11"/>
      <g class="energy-package-scene__detail">
        <path d="M549 58v45h12V58z"/>
        <path d="M542 58h26m-26 7h26"/>
        <path d="M383 69h28m-21 0v9m14-9v9m-21-9 7-11 7 11 7-11 7 11"/>
      </g>
      <text class="energy-package-scene__label" x="25" y="207">70-PANEL ARRAY · BATTERY BANK</text>
      <text class="energy-package-scene__label" x="435" y="207">FACTORY / COMMERCIAL</text>
    </svg>`
});

function formatPackageWatts(watts) {
  return `${new Intl.NumberFormat().format(watts)} W`;
}

function formatPackageEnergy(wattHours) {
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(wattHours / 1000)} kWh`;
}

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);
}

function renderSolarPackageCatalogue() {
  packageCatalogue.replaceChildren();
  solarPackages.forEach((solarPackage) => packageCatalogue.appendChild(createPackageCard(solarPackage)));
}

function renderSolarPackageRecommendations(estimate) {
  packageResultsRecommendedGrid.replaceChildren();
  packageResultsExploreGrid.replaceChildren();
  const { recommended, explore } = window.ElectronyEnergyCalculations
    .recommendSolarPackages(solarPackages, estimate);
  const recommendationCandidates = recommended.map((comparison) => ({ ...comparison, estimate }));
  const exploreCandidates = explore.map((comparison) => ({ ...comparison, estimate }));
  recommendationCandidates.forEach((comparison) => {
    packageResultsRecommendedGrid.appendChild(createPackageCard(comparison.package, comparison));
  });
  exploreCandidates.forEach((comparison) => {
    packageResultsExploreGrid.appendChild(createPackageCard(comparison.package, comparison));
  });
  packageResultsExploreWrap.hidden = exploreCandidates.length === 0;
  packageResultsEmpty.hidden = recommendationCandidates.length > 0;
  packageResultsEmpty.textContent = recommendationCandidates.length
    ? ""
    : "No package meets all comparable calculator ratings. The package source also lacks daily energy capacity and other design details, so request a tailored assessment.";
  packageResultsIntro.textContent = "Ordered by closest documented inverter, panel-array and (when supplied) battery ratings. These are preliminary comparisons, not confirmed system matches; phase, MPPT/string design, operating conditions and compatibility still require assessment.";
}

function requestSolarPackage(solarPackage, estimate = null) {
  const pricing = window.ElectronyEnergyPricing.calculateSolarPackagePricing(solarPackage, energyProducts);
  categorySelect.value = "complete-systems";
  productInput.value = solarPackage.name;
  requirementsInput.value = [
    `Solar package enquiry: ${solarPackage.name} — ${solarPackage.capacity}`,
    `Intended application in source: ${solarPackage.application}`,
    ...pricing.lines.map((line) =>
      `${line.component.category}: ${line.manufacturer} ${line.model}; ${line.component.details}; quantity ${line.component.quantity} ${line.component.unit}; unit price ${line.unitPriceNgn === null ? "Request current price" : cataloguePriceLabel(line.product)}; line total ${line.lineTotalNgn === null ? "Request current price" : formatNaira(line.lineTotalNgn)}.`),
    pricing.complete
      ? `Calculated package component total: ${formatNaira(pricing.totalNgn)}.`
      : `Full package component total unavailable because ${pricing.unpricedLines.length} required component ${pricing.unpricedLines.length === 1 ? "has" : "have"} no confirmed price.${pricing.subtotalNgn === null ? "" : ` Partial subtotal for confirmed-price components only: ${formatNaira(pricing.subtotalNgn)}.`}`,
    pricing.unpricedLines.length
      ? `Components requiring a quote: ${pricing.unpricedLines.map((line) => `${line.manufacturer} ${line.model} (${line.component.quantity} ${line.component.unit})`).join("; ")}.`
      : "",
    "Displayed component prices exclude installation, transportation, labour, taxes, engineering and other fees not explicitly priced in the catalogue.",
    solarPackage.reviewNote ? `Please confirm: ${solarPackage.reviewNote}` : "",
    solarPackage.pricingNote ? `Pricing note: ${solarPackage.pricingNote}` : "",
    `Source: ${solarPackage.source.document}, page ${solarPackage.source.page}.`,
    "Package suitability is not guaranteed. Please perform load assessment and site evaluation and confirm battery/inverter compatibility, PV string sizing and project-specific circuit protection.",
    estimate ? window.ElectronyEnergyCalculationSummary : "",
    "Please confirm current prices, availability, electrical compatibility and suitability for my application."
  ].filter(Boolean).join("\n");
  [categorySelect, productInput, requirementsInput].forEach((field) => {
    field.dispatchEvent(new Event(field instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }));
  });
  document.querySelector("#quote").scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start"
  });
  productInput.focus({ preventScroll: true });
}

function renderProductDetails(product, calculationSummary = "") {
  selectedProduct = product;
  selectedProductCalculationSummary = calculationSummary;
  document.querySelector("#energy-dialog-brand").textContent = product.brand;
  document.querySelector("#energy-dialog-title").textContent = product.model
    ? `${product.name} — ${product.model}`
    : product.name;
  const imageFigure = document.querySelector("#energy-dialog-image");
  const image = document.querySelector("#energy-dialog-image-photo");
  const imageNote = document.querySelector("#energy-dialog-image-note");
  const imageFallback = document.querySelector("#energy-dialog-image-fallback");
  const imageUrl = safeImageUrl(product.image?.url);
  image.onerror = null;
  image.removeAttribute("src");
  image.alt = "";
  image.hidden = true;
  imageFallback.hidden = true;
  imageNote.textContent = product.image?.note || "";
  imageNote.hidden = !product.image?.note;
  imageFigure.hidden = !imageUrl || !product.image?.alt;
  if (imageUrl && product.image?.alt) {
    image.alt = product.image.alt;
    image.onerror = () => {
      image.hidden = true;
      imageNote.hidden = true;
      imageFallback.hidden = false;
    };
    image.src = imageUrl;
    image.hidden = false;
  }
  document.querySelector("#energy-dialog-category").textContent = energyCategories[product.category] || "Energy equipment";
  document.querySelector("#energy-dialog-price").textContent = product.priceNgn === null
    ? "Request current price"
    : `Catalogue price: ${cataloguePriceLabel(product)} · Confirm before an order is accepted`;
  document.querySelector("#energy-dialog-description").textContent = product.description;
  const specificationList = document.querySelector("#energy-dialog-specs");
  const specificationsSection = document.querySelector("#energy-dialog-specs-section");
  specificationList.replaceChildren();
  product.specifications.forEach((specification) => {
    specificationList.appendChild(createElement("li", "", specification));
  });
  specificationsSection.hidden = !product.specifications.length;
  document.querySelector("#energy-dialog-warranty").textContent = product.warranty
    ? `Warranty stated in source: ${product.warranty}`
    : "Warranty was not stated in the supplied catalogue.";
  document.querySelector("#energy-dialog-source").textContent = [
    `Source: ${product.source.document}, page ${product.source.page}.`,
    product.sourceNote ? `Source note: ${product.sourceNote}.` : ""
  ].filter(Boolean).join(" ");

  const videoSection = document.querySelector("#energy-dialog-video");
  const videoFrame = document.querySelector("#energy-dialog-video-frame");
  videoFrame.replaceChildren();
  const frame = createYouTubeFrame(product.video, `Video about ${product.brand} ${product.model || product.name}`);
  videoSection.hidden = !frame;
  if (frame) videoFrame.appendChild(frame);
}

function requestProduct(product, calculationSummary = "") {
  categorySelect.value = product.enquiryCategory;
  productInput.value = `${product.brand} | ${product.model || product.name} | ${product.name}`;
  requirementsInput.value = [
    `Selected catalogue item: ${product.name}`,
    `Brand: ${product.brand}`,
    product.model ? `Model: ${product.model}` : "",
    `Category: ${energyCategories[product.category] || "Energy equipment"}`,
    product.description ? `Source description: ${product.description}` : "",
    product.specifications.length ? `Specifications: ${product.specifications.join("; ")}` : "",
    product.warranty ? `Source-stated warranty: ${product.warranty}` : "",
    `Catalogue price: ${cataloguePriceLabel(product)}`,
    `Source: ${product.source.document}, page ${product.source.page}.`,
    product.sourceNote ? `Source note: ${product.sourceNote}.` : "",
    calculationSummary ? `Energy calculator estimates:\n${calculationSummary}` : "",
    "Please confirm current availability, compatibility and suitability for my application."
  ].filter(Boolean).join("\n");
  [categorySelect, productInput, requirementsInput].forEach((field) => {
    field.dispatchEvent(new Event(field instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }));
  });
  document.querySelector("#quote").scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start"
  });
  productInput.focus({ preventScroll: true });
}

function selectQuoteOptions(link) {
  const category = link.dataset.quoteCategory || (link.dataset.enquiryType ? "custom-project" : "");
  if (category) categorySelect.value = category;
  if (link.dataset.productName) productInput.value = link.dataset.productName;
  else if (link.dataset.enquiryType && !productInput.value) productInput.value = "Custom energy or project enquiry";
  if (link.dataset.enquiryType) customerTypeSelect.value = link.dataset.enquiryType;
  productInput.dispatchEvent(new Event("input", { bubbles: true }));
  if (document.querySelector("#energy-recommendations").contains(link) && window.ElectronyEnergyCalculationSummary) {
    requirementsInput.value = window.ElectronyEnergyCalculationSummary;
    requirementsInput.dispatchEvent(new Event("input", { bubbles: true }));
  }
}

function renderFeaturedVideo() {
  const video = window.ElectronyEnergyFeaturedVideo;
  const frame = createYouTubeFrame(video?.video, video?.title || "Featured Electrony Energy video");
  if (!frame || typeof video.title !== "string" || !video.title.trim()) {
    featuredVideo.hidden = true;
    return;
  }
  document.querySelector("#energy-featured-video-title").textContent = video.title.trim();
  document.querySelector("#energy-featured-video-frame").replaceChildren(frame);
  featuredVideo.hidden = false;
}

document.querySelectorAll("[data-quote-category], [data-enquiry-type]").forEach((link) => {
  link.addEventListener("click", () => selectQuoteOptions(link));
});

brandFilter.addEventListener("change", () => {
  currentProductPage = 1;
  renderEnergyCatalogue();
});
categoryFilter.addEventListener("change", () => {
  currentProductPage = 1;
  renderEnergyCatalogue();
});
searchInput.addEventListener("input", () => {
  currentProductPage = 1;
  renderEnergyCatalogue();
});
clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  currentProductPage = 1;
  renderEnergyCatalogue();
  searchInput.focus();
});
resetFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  brandFilter.value = "all";
  categoryFilter.value = "all";
  currentProductPage = 1;
  renderEnergyCatalogue();
  searchInput.focus();
});
previousPageButton.addEventListener("click", () => {
  currentProductPage -= 1;
  renderEnergyCatalogue();
});
nextPageButton.addEventListener("click", () => {
  currentProductPage += 1;
  renderEnergyCatalogue();
});

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest("[data-product-details], [data-request-product]");
  if (!button || (!productGrid.contains(button) && !energyRecommendationProducts.contains(button))) return;
  const productId = button.dataset.productDetails || button.dataset.requestProduct;
  const product = energyProducts.find((item) => item.id === productId);
  if (!product) return;
  if (button.dataset.productDetails) {
    const calculationSummary = recommendationProducts.contains(button)
      ? window.ElectronyEnergyCalculationSummary || ""
      : "";
    renderProductDetails(product, calculationSummary);
    productDialog.showModal();
    return;
  }
  const calculationSummary = energyRecommendationProducts.contains(button)
    ? window.ElectronyEnergyCalculationSummary || ""
    : "";
  requestProduct(product, calculationSummary);
});

document.querySelector("#energy-dialog-close").addEventListener("click", () => productDialog.close());
productDialog.addEventListener("close", () => {
  document.querySelector("#energy-dialog-video-frame").replaceChildren();
  document.querySelector("#energy-dialog-video").hidden = true;
});
productDialog.addEventListener("click", (event) => {
  if (event.target === productDialog) productDialog.close();
});
document.querySelector("#energy-dialog-enquire").addEventListener("click", () => {
  if (!selectedProduct) return;
  const product = selectedProduct;
  const calculationSummary = selectedProductCalculationSummary;
  productDialog.close();
  requestProduct(product, calculationSummary);
});

addFilterOptions();
renderFeaturedVideo();
renderSolarPackageCatalogue();
renderEnergyCatalogue();
