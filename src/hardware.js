const hardwareCategories = Object.freeze({
  "consumer-electronics": "Consumer electronics",
  appliances: "Home and kitchen appliances",
  "electrical-power": "Electrical equipment and accessories",
  computers: "Computers and related technology",
  "cars-mobility": "Cars and electric vehicles",
  "solar-energy": "Solar and energy equipment"
});

const searchInput = document.querySelector("#hardware-search");
const clearSearchButton = document.querySelector("#clear-search");
const brandFilter = document.querySelector("#hardware-brand-filter");
const productGrid = document.querySelector("#hardware-products");
const catalogueEmpty = document.querySelector("#catalogue-empty");
const catalogueStatus = document.querySelector("#catalogue-status");
const catalogueStateLabel = document.querySelector("#catalogue-state-label");
const catalogueStateTitle = document.querySelector("#catalogue-state-title");
const catalogueStateCopy = document.querySelector("#catalogue-state-copy");
const categoryFilters = document.querySelectorAll("[data-filter-category]");
const activeFilters = document.querySelector("#hardware-active-filters");
const resetFiltersButton = document.querySelector("#hardware-reset-filters");
const pagination = document.querySelector("#hardware-pagination");
const previousPageButton = document.querySelector("#hardware-page-previous");
const nextPageButton = document.querySelector("#hardware-page-next");
const pageStatus = document.querySelector("#hardware-page-status");
const quoteForm = document.querySelector("#hardware-quote-form");
const productInput = document.querySelector("#quote-product");
const quoteCategory = document.querySelector("#quote-category");
const quoteModel = document.querySelector("#quote-model");
const quoteContext = document.querySelector("#quote-context");

let catalogueProducts = [];
let catalogueState = "ready";
let selectedCategory = "all";
let selectedBrand = "all";
let currentPage = 1;
const pageSize = 12;

function setCatalogueMessage(label, title, copy) {
  catalogueStateLabel.textContent = label;
  catalogueStateTitle.textContent = title;
  catalogueStateCopy.textContent = copy;
}

function matchesProductCategory(product, category) {
  return category === "all" || product.category === category;
}

function matchesProductSearch(product, query) {
  if (!query) return true;
  const searchable = [
    product.name,
    product.description,
    product.model,
    product.id,
    product.sku,
    product.brand || "manufacturer not specified",
    product.sourceCategory,
    hardwareCategories[product.category]
  ].filter(Boolean).join(" ").toLocaleLowerCase();
  return searchable.includes(query);
}

function updateBrandOptions() {
  const brands = [...new Set(catalogueProducts.map((product) => product.brand || "unknown"))]
    .sort((left, right) => left.localeCompare(right));
  const allBrandsOption = document.createElement("option");
  allBrandsOption.value = "all";
  allBrandsOption.textContent = "All brands";
  brandFilter.replaceChildren(allBrandsOption);
  brands.forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand === "unknown" ? "Manufacturer not specified" : brand;
    brandFilter.appendChild(option);
  });
  if (!brands.includes(selectedBrand)) selectedBrand = "all";
  brandFilter.value = selectedBrand;
}

function renderActiveFilters(query) {
  const filters = [];
  if (query) filters.push(`Search: ${query}`);
  if (selectedCategory !== "all") filters.push(`Category: ${hardwareCategories[selectedCategory]}`);
  if (selectedBrand !== "all") {
    filters.push(`Brand: ${selectedBrand === "unknown" ? "Manufacturer not specified" : selectedBrand}`);
  }
  activeFilters.replaceChildren();
  filters.forEach((filter) => appendText(activeFilters, "span", "hardware-active-filter", filter));
  activeFilters.hidden = filters.length === 0;
  resetFiltersButton.hidden = filters.length === 0;
}

function renderPagination(resultCount) {
  const pageCount = Math.ceil(resultCount / pageSize);
  pagination.hidden = pageCount < 2;
  previousPageButton.disabled = currentPage <= 1;
  nextPageButton.disabled = currentPage >= pageCount;
  pageStatus.textContent = `Page ${currentPage} of ${pageCount}`;
}

function safeHttpUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value, document.baseURI);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch (error) {
    if (error instanceof TypeError) return null;
    throw error;
  }
}

function appendText(parent, tagName, className, value) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = value;
  parent.appendChild(element);
  return element;
}

function getProductPriceLabel(product) {
  if (typeof product.price?.display === "string" && product.price.display.trim()) {
    return product.price.display;
  }
  if (product.price && Number.isFinite(product.price.amount)) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: product.price.currency
      }).format(product.price.amount);
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      return `${product.price.currency} ${product.price.amount}`;
    }
  }
  return "Request current price";
}

function getProductWarrantyEntries(product) {
  if (Array.isArray(product.warranty)) {
    return product.warranty.map((entry) => typeof entry === "string" ? entry : entry?.text).filter(Boolean);
  }
  return typeof product.warranty === "string" && product.warranty.trim() ? [product.warranty] : [];
}

function appendProductDetails(body, product) {
  const details = document.createElement("details");
  details.className = "hardware-product-details";
  appendText(details, "summary", "", "View product details");
  const content = document.createElement("div");
  content.className = "hardware-product-details__content";

  if (product.description) {
    appendText(content, "p", "hardware-product-card__description", product.description);
  } else {
    appendText(content, "p", "hardware-product-card__meta", "The source list does not provide a product description.");
  }

  const specifications = Array.isArray(product.specifications) && product.specifications.length
    ? product.specifications
    : (product.description || "").split(/[,;]+/).map((value) => value.trim()).filter(Boolean);
  if (specifications.length) {
    const list = document.createElement("ul");
    list.className = "hardware-product-card__specs";
    specifications.forEach((specification) => {
      appendText(list, "li", "", typeof specification === "string"
        ? specification
        : `${specification.name}: ${specification.value}`);
    });
    content.appendChild(list);
  }

  const warrantyEntries = getProductWarrantyEntries(product);
  if (warrantyEntries.length) {
    appendText(content, "h4", "hardware-product-details__heading", "Warranty in source");
    warrantyEntries.forEach((warranty) => appendText(content, "p", "hardware-product-card__meta", warranty));
    if (product.warrantyStatus === "needs-confirmation") {
      appendText(content, "p", "hardware-product-card__note", "The supplier list contains different warranty terms; confirm coverage before ordering.");
    }
  }

  const sources = [product.source, ...(Array.isArray(product.sources) ? product.sources : [])]
    .filter((source, index, entries) => source?.document
      && entries.findIndex((entry) => entry?.document === source.document && entry.page === source.page) === index);
  if (sources.length) {
    appendText(content, "h4", "hardware-product-details__heading", "Source");
    sources.forEach((source) => {
      appendText(content, "p", "hardware-product-card__meta", `${source.document} · page ${source.page}`);
    });
  }

  if (product.priceStatus === "conflict" && Array.isArray(product.priceObservations)) {
    appendText(content, "p", "hardware-product-card__note", "Supplier documents list different prices. No price is published; request the current price.");
    product.priceObservations.forEach((observation) => {
      appendText(content, "p", "hardware-product-card__meta", `${observation.document} · page ${observation.page}: ₦${observation.rawAmount}`);
    });
  }

  appendText(content, "p", "hardware-product-card__meta",
    "Catalogue prices must be confirmed before an order is accepted. Availability and delivery are not confirmed by this listing.");
  details.appendChild(content);
  body.appendChild(details);
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "hardware-product-card";
  card.id = `hardware-product-${product.id}`;

  const visual = document.createElement("div");
  visual.className = "hardware-product-card__image";
  const imageUrl = product.image && safeHttpUrl(product.image.url);
  if (imageUrl && product.image.alt) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = product.image.alt;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.remove();
      appendText(visual, "span", "hardware-product-card__fallback", "Illustrative category artwork — not a product photo");
    }, { once: true });
    visual.appendChild(image);
  } else {
    appendText(visual, "span", "hardware-product-card__fallback", "Illustrative category artwork — not a product photo");
  }
  appendText(visual, "span", "hardware-product-card__image-note", "Illustrative image · not a product photo");

  const body = document.createElement("div");
  body.className = "hardware-product-card__body";
  appendText(body, "p", "hardware-product-card__category", hardwareCategories[product.category] || "Hardware");
  appendText(body, "h3", "hardware-product-card__title", product.name);
  if (product.description) appendText(body, "p", "hardware-product-card__description", product.description);

  const brandModel = [
    product.brand || "Manufacturer not specified",
    product.model ? `Model: ${product.model}` : ""
  ].filter(Boolean).join(" · ");
  appendText(body, "p", "hardware-product-card__meta", brandModel);
  if (product.sku && product.sku !== product.model) appendText(body, "p", "hardware-product-card__meta", `Item code: ${product.sku}`);
  const warrantyEntries = getProductWarrantyEntries(product);
  if (warrantyEntries.length) appendText(body, "p", "hardware-product-card__meta", `Warranty: ${warrantyEntries[0]}`);
  if (product.warrantyStatus === "needs-confirmation") {
    appendText(body, "p", "hardware-product-card__note", "Warranty terms differ in the source list; confirm coverage.");
  }
  if (product.source?.document && Number.isInteger(product.source.page)) {
    appendText(body, "p", "hardware-product-card__meta", `Source: ${product.source.document} · page ${product.source.page}`);
  }
  appendText(body, "p", "hardware-product-card__price", getProductPriceLabel(product));
  if (product.priceStatus === "conflict") {
    appendText(body, "p", "hardware-product-card__note", "Source prices conflict; request the current price.");
  }
  if (Array.isArray(product.specifications) && product.specifications.length) {
    const specifications = document.createElement("ul");
    specifications.className = "hardware-product-card__specs";
    product.specifications.slice(0, 3).forEach((specification) => {
      appendText(specifications, "li", "", `${specification.name}: ${specification.value}`);
    });
    body.appendChild(specifications);
  }
  if (product.illustrative) {
    appendText(body, "p", "hardware-product-card__note", "Illustrative enquiry category — not confirmed inventory.");
  }
  appendProductDetails(body, product);
  card.appendChild(visual);
  card.appendChild(body);

  const footer = document.createElement("div");
  footer.className = "hardware-product-card__footer";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "hardware-product-card__enquire";
  button.dataset.requestProduct = product.id;
  button.dataset.requestCategory = product.category;
  button.textContent = "Enquire about this product";
  footer.appendChild(button);
  card.appendChild(footer);
  return card;
}

function renderCatalogue() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const filteredProducts = catalogueProducts.filter((product) =>
    matchesProductCategory(product, selectedCategory)
    && (selectedBrand === "all"
      || (selectedBrand === "unknown" ? !product.brand : product.brand === selectedBrand))
    && matchesProductSearch(product, query)
  );
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  currentPage = Math.min(Math.max(1, currentPage), pageCount);
  const startIndex = (currentPage - 1) * pageSize;
  const pageProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
  const availableCategories = new Set(catalogueProducts.map((product) => product.category));
  document.querySelector("#discovery-help").hidden = catalogueProducts.length > 0;
  categoryFilters.forEach((control) => {
    const category = control.dataset.filterCategory;
    const isSupported = category === "all" || availableCategories.has(category);
    const isCategoryFilter = control.classList.contains("hardware-filter") && category !== "all";
    control.disabled = !isSupported;
    if (isCategoryFilter) control.hidden = catalogueProducts.length > 0 && !isSupported;
    const isSelected = selectedCategory === category;
    if (control.classList.contains("hardware-filter")) control.classList.toggle("is-selected", isSelected);
    control.setAttribute("aria-pressed", String(isSelected));
  });
  productGrid.replaceChildren();
  catalogueEmpty.hidden = true;
  catalogueStatus.textContent = "";
  clearSearchButton.disabled = !searchInput.value;
  renderActiveFilters(query);
  renderPagination(filteredProducts.length);

  if (catalogueState === "error") {
    catalogueEmpty.hidden = false;
    pagination.hidden = true;
    catalogueStatus.textContent = "The product catalogue is temporarily unavailable.";
    setCatalogueMessage("Catalogue unavailable", "We could not load product information.", "Please try again later or enquire about the equipment you need.");
    return;
  }

  if (!filteredProducts.length) {
    catalogueEmpty.hidden = false;
    pagination.hidden = true;
    catalogueStatus.textContent = catalogueProducts.length
      ? "No products match your search and category."
      : "There are no catalogue entries to display.";
    setCatalogueMessage(
      catalogueProducts.length ? "No results" : "Catalogue empty",
      catalogueProducts.length ? "No matching products." : "No product categories are available.",
      "Try another search or category, or request a quote for the equipment you need."
    );
    return;
  }

  pageProducts.forEach((product) => productGrid.appendChild(createProductCard(product)));
  const endIndex = Math.min(startIndex + pageSize, filteredProducts.length);
  catalogueStatus.textContent = `Showing ${startIndex + 1}–${endIndex} of ${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}.`;
}

function applyProductLink() {
  const productId = new URLSearchParams(window.location.search).get("product");
  if (!productId) return null;
  const product = catalogueProducts.find((item) => item.id === productId);
  if (!product) return null;

  selectedCategory = product.category;
  selectedBrand = product.brand || "unknown";
  searchInput.value = product.model || product.name;
  currentPage = 1;
  return product.id;
}

function openLinkedProduct(productId) {
  if (!productId) return;
  const card = document.getElementById(`hardware-product-${productId}`);
  if (!card) return;
  card.querySelector("details")?.setAttribute("open", "");
  card.scrollIntoView({ block: "start" });
}

function validateCatalogueProduct(product) {
  if (!product
    || typeof product !== "object"
    || typeof product.id !== "string"
    || !product.id.trim()
    || typeof product.providerProductId !== "string"
    || !product.providerProductId.trim()
    || typeof product.name !== "string"
    || !product.name.trim()
    || !Object.hasOwn(hardwareCategories, product.category)) return false;

  const optionalTextFields = ["variantId", "brand", "model", "sku", "availability", "detailUrl", "description"];
  if (optionalTextFields.some((field) => product[field] !== undefined
    && product[field] !== null
    && typeof product[field] !== "string")) return false;
  if (product.image !== undefined && (
    !product.image
    || typeof product.image !== "object"
    || typeof product.image.url !== "string"
    || typeof product.image.alt !== "string"
  )) return false;
  if (product.price !== undefined && (
    !product.price
    || typeof product.price !== "object"
    || !(Number.isFinite(product.price.amount)
      || (typeof product.price.amount === "string" && /^\d+(?:\.\d+)?$/.test(product.price.amount)))
    || Number(product.price.amount) < 0
    || typeof product.price.currency !== "string"
    || !/^[A-Z]{3}$/.test(product.price.currency)
  )) return false;
  return product.specifications === undefined || (
    Array.isArray(product.specifications)
    && product.specifications.every((specification) =>
      specification
      && typeof specification.name === "string"
      && typeof specification.value === "string"
    )
  );
}

async function loadCatalogue() {
  const adapter = window.ElectronyHardwareCatalogue;
  if (!adapter || typeof adapter.load !== "function") {
    const sourceProducts = window.ElectronyHardwareSourceProducts || [];
    catalogueProducts = sourceProducts.length
      ? sourceProducts
      : (window.ElectronyHardwareProducts || []).map((product) => ({ ...product, illustrative: true }));
    updateBrandOptions();
    const linkedProductId = applyProductLink();
    setCatalogueMessage(
      "Source-documented product catalogue",
      "Start with a product category.",
      "Prices and product details are transcribed from the cited supplier PDFs. Confirm price, warranty and availability before ordering."
    );
    renderCatalogue();
    openLinkedProduct(linkedProductId);
    return;
  }

  try {
    const result = await adapter.load({ signal: new AbortController().signal });
    if (!result || !Array.isArray(result.products) || !result.products.every(validateCatalogueProduct)) {
      throw new Error("The catalogue adapter returned an invalid product list.");
    }
    catalogueProducts = result.products;
    updateBrandOptions();
    const linkedProductId = applyProductLink();
    renderCatalogue();
    openLinkedProduct(linkedProductId);
  } catch {
    catalogueState = "error";
    renderCatalogue();
  }
}

function updateEnergyDestination() {
  const energyLink = document.querySelector("[data-energy-link]");
  const energyUrl = window.ElectronyConfig.productLinks.energy.landingPageUrl;
  if (!energyUrl) return;
  const safeUrl = safeHttpUrl(energyUrl);
  if (!safeUrl) return;
  energyLink.href = safeUrl;
  energyLink.hidden = false;
}

categoryFilters.forEach((control) => {
  control.addEventListener("click", () => {
    selectedCategory = control.dataset.filterCategory;
    currentPage = 1;
    renderCatalogue();
    document.querySelector("#catalogue").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
  });
});

searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderCatalogue();
});
clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  currentPage = 1;
  renderCatalogue();
  searchInput.focus();
});
brandFilter.addEventListener("change", () => {
  selectedBrand = brandFilter.value || "all";
  currentPage = 1;
  renderCatalogue();
});
resetFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  selectedCategory = "all";
  selectedBrand = "all";
  currentPage = 1;
  brandFilter.value = "all";
  renderCatalogue();
  searchInput.focus();
});
previousPageButton.addEventListener("click", () => {
  currentPage -= 1;
  renderCatalogue();
});
nextPageButton.addEventListener("click", () => {
  currentPage += 1;
  renderCatalogue();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-request-product]");
  if (!button) return;
  const product = catalogueProducts.find((item) => item.id === button.dataset.requestProduct);
  if (!product) return;
  productInput.value = product.name;
  quoteCategory.value = button.dataset.requestCategory;
  quoteModel.value = [product.brand || "Manufacturer not specified in source", product.model]
    .filter(Boolean)
    .join(" · ");
  const productUrl = new URL(window.location.href);
  productUrl.searchParams.set("product", product.id);
  productUrl.hash = "catalogue";
  productUrl.hash = `hardware-product-${product.id}`;
  const context = [
    `Manufacturer: ${product.brand || "Not specified in the source catalogue"}`,
    `Model: ${product.model || "Not specified in the source catalogue"}`,
    `Displayed price: ${getProductPriceLabel(product)}`,
    `Catalogue URL: ${productUrl.href}`,
    product.description ? `Source-listed details: ${product.description}` : "",
    ...getProductWarrantyEntries(product).map((warranty) => `Source-listed warranty: ${warranty}`)
  ].filter(Boolean);
  quoteContext.value = context.join("\n");
  productInput.dispatchEvent(new Event("input", { bubbles: true }));
  quoteForm.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start"
  });
  productInput.focus({ preventScroll: true });
});

updateEnergyDestination();
renderCatalogue();
void loadCatalogue();
