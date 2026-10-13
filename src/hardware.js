const hardwareCategories = Object.freeze({
  "consumer-electronics": "Consumer electronics",
  appliances: "Home and commercial appliances",
  "electrical-power": "Electrical and power equipment",
  "cars-mobility": "Cars and mobility",
  "solar-energy": "Solar and energy products"
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
const quoteFormStatus = document.querySelector("#quote-form-status");

let catalogueProducts = [];
let catalogueState = "unavailable";
let selectedCategory = "all";

function setCatalogueMessage(state, title, copy, label = "Catalogue status") {
  catalogueState = state;
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

function formatProviderPrice(price) {
  if (!price || !Number.isFinite(price.amount) || typeof price.currency !== "string" || !/^[A-Z]{3}$/.test(price.currency)) {
    return null;
  }
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: price.currency }).format(price.amount);
  } catch (error) {
    if (error instanceof RangeError) return `${price.currency} ${price.amount}`;
    throw error;
  }
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "hardware-product-card";

  const visual = document.createElement("div");
  visual.className = "hardware-product-card__image";
  visual.setAttribute("aria-hidden", "true");
  const imageUrl = product.image && safeHttpUrl(product.image.url);
  if (imageUrl && product.image.alt) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = product.image.alt;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.remove();
      appendText(visual, "span", "hardware-product-card__fallback", "PRODUCT IMAGE");
    }, { once: true });
    visual.removeAttribute("aria-hidden");
    visual.appendChild(image);
  } else {
    appendText(visual, "span", "hardware-product-card__fallback", "PRODUCT IMAGE");
  }
  card.appendChild(visual);

  const body = document.createElement("div");
  body.className = "hardware-product-card__body";
  appendText(body, "p", "hardware-product-card__category", hardwareCategories[product.category]);
  appendText(body, "h3", "hardware-product-card__title", product.name);

  const brandModel = [product.brand, product.model].filter(Boolean).join(" · ");
  if (brandModel) appendText(body, "p", "hardware-product-card__meta", brandModel);
  if (product.sku) appendText(body, "p", "hardware-product-card__meta", `SKU: ${product.sku}`);

  const price = formatProviderPrice(product.price);
  if (price) appendText(body, "p", "hardware-product-card__price", price);
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
  card.appendChild(body);

  const detailUrl = safeHttpUrl(product.detailUrl);
  if (detailUrl) {
    const footer = document.createElement("div");
    footer.className = "hardware-product-card__footer";
    const link = document.createElement("a");
    link.href = detailUrl;
    link.textContent = "View product details";
    if (new URL(detailUrl).origin !== window.location.origin) {
      link.target = "_blank";
      link.rel = "noreferrer noopener";
    }
    footer.appendChild(link);
    card.appendChild(footer);
  }

  return card;
}

function renderCatalogue() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const filteredProducts = catalogueProducts.filter((product) =>
    matchesProductCategory(product, selectedCategory) && matchesProductSearch(product, query)
  );
  const hasCatalogueProducts = catalogueState === "ready" && catalogueProducts.length > 0;
  const availableCategories = new Set(catalogueProducts.map((product) => product.category));
  searchInput.disabled = !hasCatalogueProducts;
  document.querySelector("#discovery-help").hidden = hasCatalogueProducts;
  categoryFilters.forEach((control) => {
    const category = control.dataset.filterCategory;
    const isSupported = category === "all" || availableCategories.has(category);
    const isCategoryFilter = control.classList.contains("hardware-filter") && category !== "all";
    control.disabled = !hasCatalogueProducts || !isSupported;
    if (isCategoryFilter) control.hidden = hasCatalogueProducts && !isSupported;
    const isSelected = selectedCategory === category;
    if (control.classList.contains("hardware-filter")) {
      control.classList.toggle("is-selected", isSelected);
    }
    control.setAttribute("aria-pressed", String(isSelected));
  });
  productGrid.replaceChildren();
  catalogueEmpty.hidden = true;
  catalogueStatus.textContent = "";
  clearSearchButton.disabled = !hasCatalogueProducts || !searchInput.value;

  if (catalogueState === "loading") {
    catalogueStatus.textContent = "Loading product catalogue…";
    catalogueEmpty.hidden = false;
    setCatalogueMessage("loading", "Connecting to the product catalogue.", "Product information is being requested from the configured catalogue.", "Loading");
    return;
  }

  if (catalogueState === "error") {
    catalogueEmpty.hidden = false;
    catalogueStatus.textContent = "The product catalogue is temporarily unavailable.";
    return;
  }

  if (catalogueState === "unavailable") {
    catalogueEmpty.hidden = false;
    catalogueStatus.textContent = "No commerce catalogue is connected.";
    return;
  }

  if (!catalogueProducts.length) {
    catalogueEmpty.hidden = false;
    catalogueStatus.textContent = "The connected catalogue has no products to display.";
    setCatalogueMessage("empty", "No products are available in the connected catalogue.", "Ask about equipment supply or a product you are looking for.", "Catalogue empty");
    return;
  }

  if (!filteredProducts.length) {
    catalogueEmpty.hidden = false;
    catalogueStatus.textContent = "No products match your search and category.";
    setCatalogueMessage("filtered-empty", "No matching products.", "Try another search or category, or request a quote for the equipment you need.", "No results");
    return;
  }

  filteredProducts.forEach((product) => productGrid.appendChild(createProductCard(product)));
  catalogueStatus.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"} shown.`;
}

function validateCatalogueProduct(product) {
  if (!product ||
    typeof product !== "object" ||
    typeof product.id !== "string" ||
    !product.id.trim() ||
    typeof product.providerProductId !== "string" ||
    !product.providerProductId.trim() ||
    typeof product.name !== "string" ||
    !product.name.trim() ||
    !Object.hasOwn(hardwareCategories, product.category)) return false;

  const optionalTextFields = ["variantId", "brand", "model", "sku", "availability", "detailUrl"];
  if (optionalTextFields.some((field) => product[field] !== undefined && typeof product[field] !== "string")) return false;
  if (product.image !== undefined && (
    !product.image ||
    typeof product.image !== "object" ||
    typeof product.image.url !== "string" ||
    typeof product.image.alt !== "string"
  )) return false;
  if (product.price !== undefined && (
    !product.price ||
    typeof product.price !== "object" ||
    !Number.isFinite(product.price.amount) ||
    product.price.amount < 0 ||
    typeof product.price.currency !== "string" ||
    !/^[A-Z]{3}$/.test(product.price.currency)
  )) return false;
  if (product.specifications !== undefined && (
    !Array.isArray(product.specifications) ||
    !product.specifications.every((specification) =>
      specification &&
      typeof specification.name === "string" &&
      typeof specification.value === "string"
    )
  )) return false;
  return true;
}

async function loadCatalogue() {
  const adapter = window.ElectronyHardwareCatalogue;
  if (!adapter || typeof adapter.load !== "function") {
    setCatalogueMessage("unavailable", "Our product catalogue is being connected.", "Contact us for product enquiries and supply requests. Product listings, pricing and availability will be shown only when supplied by a connected catalogue.", "Catalogue setup");
    renderCatalogue();
    return;
  }

  setCatalogueMessage("loading", "Connecting to the product catalogue.", "Product information is being requested from the configured catalogue.", "Loading");
  renderCatalogue();

  try {
    const controller = new AbortController();
    const result = await adapter.load({ signal: controller.signal });
    if (!result || !Array.isArray(result.products) || !result.products.every(validateCatalogueProduct)) {
      throw new Error("The catalogue adapter returned an invalid product list.");
    }
    catalogueProducts = result.products;
    setCatalogueMessage("ready", "", "", "");
    renderCatalogue();
  } catch (error) {
    console.error("Electrony Hardware catalogue could not be loaded.", error);
    setCatalogueMessage("error", "We could not load the product catalogue.", "Please try again later or request a quote for product information.", "Catalogue unavailable");
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

if (quoteForm) {
  const fields = [...quoteForm.querySelectorAll("input[required]")];

  function errorFor(field) {
    if (field.validity.valueMissing) return "This field is required.";
    if (field.validity.typeMismatch) return "Enter a valid email address.";
    if (field.validity.rangeUnderflow || field.validity.stepMismatch) return "Enter a whole number of at least 1.";
    return "";
  }

  function updateFieldError(field) {
    const error = document.querySelector(`#${field.id}-error`);
    if (!error) return field.checkValidity();
    const message = field.checkValidity() ? "" : errorFor(field);
    error.textContent = message;
    field.setAttribute("aria-invalid", String(Boolean(message)));
    return !message;
  }

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") updateFieldError(field);
      if (
        quoteFormStatus.textContent.startsWith("Please correct") &&
        fields.every((requiredField) => requiredField.checkValidity())
      ) {
        quoteFormStatus.textContent = "";
        quoteFormStatus.classList.remove("is-error");
      }
    });
  });

  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = fields.map(updateFieldError).every(Boolean);
    quoteFormStatus.classList.remove("is-error");

    if (!isValid) {
      quoteFormStatus.textContent = "Please correct the highlighted fields before continuing.";
      quoteFormStatus.classList.add("is-error");
      quoteForm.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    quoteFormStatus.textContent = "Your request has not been sent. The enquiry service is not configured, and the details remain in this form.";
    quoteFormStatus.classList.add("is-error");
  });
}

updateEnergyDestination();
renderCatalogue();
void loadCatalogue();
