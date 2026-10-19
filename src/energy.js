const energyCategories = Object.freeze({
  "solar-panels": "Solar panels",
  "solar-inverters": "Solar inverters",
  "batteries-storage": "Batteries and energy storage",
  "complete-systems": "Complete solar power systems",
  transformers: "Transformers",
  "electricity-meters": "Electricity meters",
  "cables-accessories": "Cables and electrical accessories"
});

const energyProducts = window.ElectronyEnergyProducts || [];
const searchInput = document.querySelector("#energy-search");
const clearSearchButton = document.querySelector("#energy-clear-search");
const productGrid = document.querySelector("#energy-products");
const catalogueEmpty = document.querySelector("#energy-catalogue-empty");
const catalogueStatus = document.querySelector("#energy-catalogue-status");
const categoryFilters = document.querySelectorAll("[data-energy-filter]");
const categorySelect = document.querySelector("#energy-category");
const productInput = document.querySelector("#energy-product");
const customerTypeSelect = document.querySelector("#energy-customer-type");
let selectedCategory = "all";

function safeImageUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const imageUrl = new URL(value, document.baseURI);
    return ["http:", "https:"].includes(imageUrl.protocol) ? imageUrl.href : null;
  } catch {
    return null;
  }
}

function createEnergyProductCard(product) {
  const card = document.createElement("article");
  card.className = "energy-product-card";

  const visual = document.createElement("div");
  visual.className = "energy-product-card__image";
  const imageUrl = product.image && safeImageUrl(product.image.url);
  if (imageUrl && product.image.alt) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = product.image.alt;
    image.loading = "lazy";
    image.addEventListener("error", () => {
      image.remove();
      const fallback = document.createElement("span");
      fallback.className = "energy-product-card__fallback";
      fallback.textContent = "ILLUSTRATIVE PRODUCT IMAGE";
      visual.appendChild(fallback);
    }, { once: true });
    visual.appendChild(image);
  } else {
    visual.setAttribute("aria-hidden", "true");
    const fallback = document.createElement("span");
    fallback.className = "energy-product-card__fallback";
    fallback.textContent = "ILLUSTRATIVE PRODUCT IMAGE";
    visual.appendChild(fallback);
  }

  const body = document.createElement("div");
  body.className = "energy-product-card__body";
  const label = document.createElement("p");
  label.className = "energy-product-card__category";
  label.textContent = energyCategories[product.category] || "Energy solutions";
  body.appendChild(label);

  const title = document.createElement("h3");
  title.className = "energy-product-card__title";
  title.textContent = product.name;
  body.appendChild(title);

  const description = document.createElement("p");
  description.className = "energy-product-card__description";
  description.textContent = product.description;
  body.appendChild(description);

  const note = document.createElement("p");
  note.className = "energy-product-card__note";
  note.textContent = "Illustrative enquiry category — not a confirmed product listing.";
  body.appendChild(note);

  const footer = document.createElement("div");
  footer.className = "energy-product-card__footer";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "energy-product-card__enquire";
  button.dataset.requestProduct = product.name;
  button.dataset.requestCategory = product.category;
  button.textContent = "Request a Quote";
  footer.appendChild(button);

  card.append(visual, body, footer);
  return card;
}

function renderEnergyCatalogue() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const filteredProducts = energyProducts.filter((product) =>
    (selectedCategory === "all" || product.category === selectedCategory)
    && `${product.name} ${product.description} ${energyCategories[product.category]}`.toLocaleLowerCase().includes(query)
  );
  categoryFilters.forEach((control) => {
    const isSelected = control.dataset.energyFilter === selectedCategory;
    control.classList.toggle("is-selected", isSelected);
    control.setAttribute("aria-pressed", String(isSelected));
  });
  productGrid.replaceChildren();
  catalogueEmpty.hidden = true;
  catalogueStatus.textContent = "";
  clearSearchButton.disabled = !searchInput.value;

  if (!filteredProducts.length) {
    catalogueEmpty.hidden = false;
    catalogueStatus.textContent = "No energy products match your search and category.";
    return;
  }

  filteredProducts.forEach((product) => productGrid.appendChild(createEnergyProductCard(product)));
  catalogueStatus.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"} shown.`;
}

function selectQuoteOptions(link) {
  const category = link.dataset.quoteCategory || (link.dataset.enquiryType ? "custom-project" : "");
  if (category) categorySelect.value = category;
  if (link.dataset.productName) productInput.value = link.dataset.productName;
  else if (link.dataset.enquiryType && !productInput.value) productInput.value = "Custom energy or project enquiry";
  if (link.dataset.enquiryType) customerTypeSelect.value = link.dataset.enquiryType;
  productInput.dispatchEvent(new Event("input", { bubbles: true }));
}

document.querySelectorAll("[data-quote-category], [data-enquiry-type]").forEach((link) => {
  link.addEventListener("click", () => selectQuoteOptions(link));
});

categoryFilters.forEach((control) => {
  control.addEventListener("click", () => {
    selectedCategory = control.dataset.energyFilter;
    renderEnergyCatalogue();
  });
});

searchInput.addEventListener("input", renderEnergyCatalogue);
clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  renderEnergyCatalogue();
  searchInput.focus();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-request-product]");
  if (!button) return;
  categorySelect.value = button.dataset.requestCategory;
  productInput.value = button.dataset.requestProduct;
  productInput.dispatchEvent(new Event("input", { bubbles: true }));
  document.querySelector("#quote").scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start"
  });
  productInput.focus({ preventScroll: true });
});

renderEnergyCatalogue();
