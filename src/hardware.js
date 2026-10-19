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
const productGrid = document.querySelector("#hardware-products");
const catalogueEmpty = document.querySelector("#catalogue-empty");
const catalogueStatus = document.querySelector("#catalogue-status");
const catalogueStateLabel = document.querySelector("#catalogue-state-label");
const catalogueStateTitle = document.querySelector("#catalogue-state-title");
const catalogueStateCopy = document.querySelector("#catalogue-state-copy");
const categoryFilters = document.querySelectorAll("[data-filter-category]");
const quoteForm = document.querySelector("#hardware-quote-form");
const productInput = document.querySelector("#quote-product");
const quoteCategory = document.querySelector("#quote-category");

let catalogueProducts = [];
let catalogueState = "ready";
let selectedCategory = "all";

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
    product.sku,
    product.brand,
    hardwareCategories[product.category]
  ].filter(Boolean).join(" ").toLocaleLowerCase();
  return searchable.includes(query);
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

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "hardware-product-card";

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
      appendText(visual, "span", "hardware-product-card__fallback", "ILLUSTRATIVE PRODUCT IMAGE");
    }, { once: true });
    visual.appendChild(image);
  } else {
    visual.setAttribute("aria-hidden", "true");
    appendText(visual, "span", "hardware-product-card__fallback", "ILLUSTRATIVE PRODUCT IMAGE");
  }

  const body = document.createElement("div");
  body.className = "hardware-product-card__body";
  appendText(body, "p", "hardware-product-card__category", hardwareCategories[product.category] || "Hardware");
  appendText(body, "h3", "hardware-product-card__title", product.name);
  if (product.description) appendText(body, "p", "hardware-product-card__description", product.description);

  const brandModel = [product.brand, product.model].filter(Boolean).join(" · ");
  if (brandModel) appendText(body, "p", "hardware-product-card__meta", brandModel);
  if (product.sku) appendText(body, "p", "hardware-product-card__meta", `SKU: ${product.sku}`);
  if (product.price && Number.isFinite(product.price.amount)) {
    let formattedPrice;
    try {
      formattedPrice = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: product.price.currency
      }).format(product.price.amount);
    } catch (error) {
      if (!(error instanceof RangeError)) throw error;
      formattedPrice = `${product.price.currency} ${product.price.amount}`;
    }
    appendText(body, "p", "hardware-product-card__price", formattedPrice);
  }
  if (typeof product.availability === "string" && product.availability.trim()) {
    appendText(body, "p", "hardware-product-card__availability", product.availability);
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
  card.appendChild(visual);
  card.appendChild(body);

  const footer = document.createElement("div");
  footer.className = "hardware-product-card__footer";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "hardware-product-card__enquire";
  button.dataset.requestProduct = product.name;
  button.dataset.requestCategory = product.category;
  button.textContent = "Request a Quote";
  footer.appendChild(button);
  card.appendChild(footer);
  return card;
}

function renderCatalogue() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const filteredProducts = catalogueProducts.filter((product) =>
    matchesProductCategory(product, selectedCategory) && matchesProductSearch(product, query)
  );
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

  if (catalogueState === "error") {
    catalogueEmpty.hidden = false;
    catalogueStatus.textContent = "The product catalogue is temporarily unavailable.";
    setCatalogueMessage("Catalogue unavailable", "We could not load product information.", "Please try again later or enquire about the equipment you need.");
    return;
  }

  if (!filteredProducts.length) {
    catalogueEmpty.hidden = false;
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

  filteredProducts.forEach((product) => productGrid.appendChild(createProductCard(product)));
  catalogueStatus.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"} shown.`;
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
  if (optionalTextFields.some((field) => product[field] !== undefined && typeof product[field] !== "string")) return false;
  if (product.image !== undefined && (
    !product.image
    || typeof product.image !== "object"
    || typeof product.image.url !== "string"
    || typeof product.image.alt !== "string"
  )) return false;
  if (product.price !== undefined && (
    !product.price
    || typeof product.price !== "object"
    || !Number.isFinite(product.price.amount)
    || product.price.amount < 0
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
    catalogueProducts = (window.ElectronyHardwareProducts || []).map((product) => ({
      ...product,
      illustrative: true
    }));
    setCatalogueMessage(
      "Illustrative enquiry catalogue",
      "Start with a product category.",
      "These examples are enquiry prompts, not confirmed stock. Ask us to confirm product details and availability."
    );
    renderCatalogue();
    return;
  }

  try {
    const result = await adapter.load({ signal: new AbortController().signal });
    if (!result || !Array.isArray(result.products) || !result.products.every(validateCatalogueProduct)) {
      throw new Error("The catalogue adapter returned an invalid product list.");
    }
    catalogueProducts = result.products;
    renderCatalogue();
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
    renderCatalogue();
    document.querySelector("#catalogue").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start"
    });
  });
});

searchInput.addEventListener("input", renderCatalogue);
clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  renderCatalogue();
  searchInput.focus();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-request-product]");
  if (!button) return;
  productInput.value = button.dataset.requestProduct;
  quoteCategory.value = button.dataset.requestCategory;
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
