const energyProducts = window.ElectronyEnergyProducts;
const energyCategories = window.ElectronyEnergyCategories;
if (!Array.isArray(energyProducts) || !energyProducts.length || !energyCategories) {
  throw new Error("Energy catalogue data did not load.");
}

const searchInput = document.querySelector("#energy-search");
const clearSearchButton = document.querySelector("#energy-clear-search");
const brandFilter = document.querySelector("#energy-brand-filter");
const categoryFilter = document.querySelector("#energy-category-filter");
const productGrid = document.querySelector("#energy-products");
const catalogueEmpty = document.querySelector("#energy-catalogue-empty");
const catalogueStatus = document.querySelector("#energy-catalogue-status");
const categorySelect = document.querySelector("#energy-category");
const productInput = document.querySelector("#energy-product");
const requirementsInput = document.querySelector("#energy-requirements");
const customerTypeSelect = document.querySelector("#energy-customer-type");
const productDialog = document.querySelector("#energy-product-dialog");
const featuredVideo = document.querySelector("#energy-featured-video");
let selectedProduct = null;

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

function renderEnergyCatalogue() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const selectedBrand = brandFilter.value;
  const selectedCategory = categoryFilter.value;
  const filteredProducts = energyProducts.filter((product) => {
    const searchableText = [
      product.brand,
      product.model,
      product.name,
      energyCategories[product.category],
      product.description,
      ...product.specifications
    ].join(" ").toLocaleLowerCase();
    return (selectedBrand === "all" || product.brand === selectedBrand)
      && (selectedCategory === "all" || product.category === selectedCategory)
      && searchableText.includes(query);
  });

  productGrid.replaceChildren();
  catalogueEmpty.hidden = filteredProducts.length > 0;
  clearSearchButton.disabled = !searchInput.value;
  if (!filteredProducts.length) {
    document.querySelector("#energy-empty-label").textContent = query ? "No search matches" : "No matching products";
    document.querySelector("#energy-empty-title").textContent = "No products match these filters.";
    catalogueStatus.textContent = "No products match. Try another search, brand or category.";
    return;
  }

  filteredProducts.forEach((product) => productGrid.appendChild(createEnergyProductCard(product)));
  catalogueStatus.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"} shown.`;
}

function renderProductDetails(product) {
  selectedProduct = product;
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

function requestProduct(product) {
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

searchInput.addEventListener("input", renderEnergyCatalogue);
brandFilter.addEventListener("change", renderEnergyCatalogue);
categoryFilter.addEventListener("change", renderEnergyCatalogue);
clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  renderEnergyCatalogue();
  searchInput.focus();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-details], [data-request-product]");
  if (!button) return;
  const productId = button.dataset.productDetails || button.dataset.requestProduct;
  const product = energyProducts.find((item) => item.id === productId);
  if (!product) return;
  if (button.dataset.productDetails) {
    renderProductDetails(product);
    productDialog.showModal();
    return;
  }
  requestProduct(product);
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
  productDialog.close();
  requestProduct(selectedProduct);
});

addFilterOptions();
renderFeaturedVideo();
renderEnergyCatalogue();
