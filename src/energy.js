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

function safeImageUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const imageUrl = new URL(value, document.baseURI);
    return ["http:", "https:"].includes(imageUrl.protocol) ? imageUrl.href : null;
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

function createEnergyProductCard(product) {
  const card = createElement("article", "energy-product-card");
  const visual = createElement("div", "energy-product-card__image");
  const imageUrl = safeImageUrl(product.image?.url);
  if (imageUrl && product.image?.alt) {
    const image = createElement("img");
    image.src = imageUrl;
    image.alt = product.image.alt;
    image.loading = "lazy";
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
  const description = createElement("p", "energy-product-card__description", product.description);
  body.append(brandLine, category, title);
  if (model) body.appendChild(model);
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
  const application = createElement("p", "energy-package-card__application", solarPackage.application);
  const title = createElement("h3", "energy-package-card__title", solarPackage.name);
  const badge = comparison
    ? createElement("p", "energy-package-card__badge", comparison.recommended ? "Preliminary rating comparison" : "Explore with Electrony")
    : null;
  const summary = createElement("ul", "energy-package-card__summary");
  summary.append(
    createElement("li", "", `Inverter: ${formatPackageWatts(solarPackage.inverterWatts)}; ${solarPackage.components[0].details}.`),
    createElement("li", "", `Solar array: ${solarPackage.panelCount} × ${solarPackage.panelWatts}W panels (${formatPackageWatts(solarPackage.panelCount * solarPackage.panelWatts)} rated total).`),
    createElement("li", "", solarPackage.batterySummary)
  );
  card.append(title, application);
  if (badge) card.appendChild(badge);
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
  disclosure.textContent = "View package specifications";
  const componentList = document.createElement("ul");
  solarPackage.components.forEach((component) => {
    componentList.appendChild(createElement("li", "", `${component.category} — ${component.model}: ${component.details}; quantity ${component.quantity}.`));
  });
  details.append(disclosure, componentList);
  card.appendChild(details);
  if (solarPackage.reviewNote) {
    card.appendChild(createElement("p", "energy-package-card__review", `Source detail to confirm: ${solarPackage.reviewNote}`));
  }
  const source = createElement("p", "energy-package-card__source", `Source: ${solarPackage.source.document}, page ${solarPackage.source.page}.`);
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
  card.append(source, footer);
  return card;
}

function formatPackageWatts(watts) {
  return `${new Intl.NumberFormat().format(watts)} W`;
}

function formatPackageEnergy(wattHours) {
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(wattHours / 1000)} kWh`;
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
  packageResultsEmpty.hidden = recommendedCandidates.length > 0;
  packageResultsEmpty.textContent = recommendedCandidates.length
    ? ""
    : "No package meets all comparable calculator ratings. The package source also lacks daily energy capacity and other design details, so request a tailored assessment.";
  packageResultsIntro.textContent = "Ordered by closest documented inverter, panel-array and (when supplied) battery ratings. These are preliminary comparisons, not confirmed system matches; phase, MPPT/string design, operating conditions and compatibility still require assessment.";
}

function requestSolarPackage(solarPackage, estimate = null) {
  categorySelect.value = "complete-systems";
  productInput.value = solarPackage.name;
  requirementsInput.value = [
    `Solar package enquiry: ${solarPackage.name}`,
    `Intended application in source: ${solarPackage.application}`,
    ...solarPackage.components.map((component) =>
      `${component.category}: ${component.model}; ${component.details}; quantity ${component.quantity}.`),
    solarPackage.reviewNote ? `Please confirm: ${solarPackage.reviewNote}` : "",
    `Source: ${solarPackage.source.document}, page ${solarPackage.source.page}.`,
    estimate ? window.ElectronyEnergyCalculationSummary : "",
    "Please confirm current price, availability, electrical compatibility and suitability for my application."
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
  document.querySelector("#energy-dialog-category").textContent = energyCategories[product.category] || "Energy equipment";
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
