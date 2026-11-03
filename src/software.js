(() => {
const softwareProductOrder = new Map(["electronyos", "istylist", "bills"].map((id, index) => [id, index]));
const softwareProducts = window.ElectronyProducts
  .filter((product) => product.category === "Software")
  .sort((first, second) => (softwareProductOrder.get(first.id) ?? Infinity) - (softwareProductOrder.get(second.id) ?? Infinity));
const chipContainer = document.querySelector("#motherboard-chips");
const showcaseContainer = document.querySelector("#software-products");
const productName = document.querySelector("#product-name");
const productDescription = document.querySelector("#product-description");
const productStatus = document.querySelector("#product-status");
const productLinks = document.querySelector("#product-links");
const detailIndex = document.querySelector("#detail-index");

function createProductLink(label, url, primary = false, className = "detail-link") {
  const link = document.createElement("a");
  link.className = `${className}${primary ? " detail-link-primary" : ""}`;
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = label;

  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";
  link.append(arrow);
  return link;
}

function selectProduct(product, index) {
  const buttons = chipContainer.querySelectorAll("[data-product-id]");
  buttons.forEach((button) => {
    const selected = button.dataset.productId === product.id;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  const statusLabel = product.ecosystemStatus || (product.status === "live" ? "Live" : product.status);
  productName.textContent = product.name;
  productDescription.textContent = product.ecosystemDescription || product.description;
  productStatus.textContent = statusLabel;
  detailIndex.textContent = `${String(index + 1).padStart(2, "0")} / ${String(softwareProducts.length).padStart(2, "0")}`;
  document.querySelector("#product-detail").style.setProperty("--selected-accent", "var(--software-accent)");

  productLinks.replaceChildren();
  if (product.landingPageUrl) {
    productLinks.append(createProductLink(`Visit ${product.name}`, product.landingPageUrl, true));
  }
  if (product.appUrl && product.appUrl !== product.landingPageUrl) {
    productLinks.append(createProductLink(`Open ${product.name} application`, product.appUrl));
  }
}

function getProductStatus(product) {
  return product.ecosystemStatus || (product.status === "live" ? "Live" : product.status);
}

function createProductChip(product, index) {
  const button = document.createElement("button");
  button.className = "product-chip";
  button.type = "button";
  button.dataset.productId = product.id;
  const productSlots = ["1 / 1", "1 / 3", "3 / 2"];
  button.style.gridArea = productSlots[index] || `${4 + Math.floor((index - 3) / 3)} / ${((index - 3) % 3) + 1}`;
  button.style.setProperty("--chip-accent", "var(--software-accent)");
  button.setAttribute("aria-controls", "product-detail");
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-label", `${product.name}, ${getProductStatus(product)}. Show product details.`);

  const top = document.createElement("span");
  top.className = "chip-topline";
  const topLabel = document.createElement("span");
  topLabel.textContent = `PRODUCT / ${String(index + 1).padStart(2, "0")}`;
  const indicator = document.createElement("span");
  indicator.className = "chip-indicator";
  indicator.setAttribute("aria-hidden", "true");
  top.append(topLabel, indicator);

  const name = document.createElement("span");
  name.className = "chip-name";
  name.textContent = product.name;

  const description = document.createElement("span");
  description.className = "chip-description";
  description.textContent = product.ecosystemDescription || product.description;

  const bottom = document.createElement("span");
  bottom.className = "chip-bottomline";
  const status = document.createElement("span");
  status.className = `chip-status${product.status === "live" ? " is-live" : ""}`;
  status.textContent = getProductStatus(product);
  const prompt = document.createElement("span");
  prompt.className = "chip-select-prompt";
  prompt.setAttribute("aria-hidden", "true");
  prompt.textContent = "SELECT  ↗";
  bottom.append(status, prompt);

  button.append(top, name, description, bottom);
  button.addEventListener("click", () => selectProduct(product, index));
  return button;
}

function createShowcaseProduct(product, index) {
  const article = document.createElement("article");
  article.className = "showcase-product";
  article.style.setProperty("--product-accent", "var(--software-accent)");

  const topline = document.createElement("div");
  topline.className = "showcase-product-topline";
  const number = document.createElement("span");
  number.className = "showcase-product-number";
  number.textContent = `PROCESSOR / ${String(index + 1).padStart(2, "0")}`;
  const indicator = document.createElement("span");
  indicator.textContent = "ELECTRONY SOFTWARE";
  topline.append(number, indicator);

  const name = document.createElement("h3");
  name.textContent = product.name;
  const description = document.createElement("p");
  description.textContent = product.ecosystemDescription || product.description;

  const footer = document.createElement("div");
  footer.className = "showcase-product-footer";
  const status = document.createElement("span");
  status.className = "showcase-product-status";
  status.textContent = getProductStatus(product);
  footer.append(status);

  article.append(topline, name, description, footer);
  if (product.landingPageUrl) {
    article.append(createProductLink(`Visit ${product.name}`, product.landingPageUrl, false, "showcase-product-link"));
  }
  if (product.appUrl && product.appUrl !== product.landingPageUrl) {
    article.append(createProductLink(`Open ${product.name} application`, product.appUrl, false, "showcase-product-link"));
  }

  return article;
}

if (!chipContainer || !showcaseContainer || !productName || !productDescription || !productStatus || !productLinks || !detailIndex) {
  throw new Error("The software page is missing required product interface elements.");
}

softwareProducts.forEach((product, index) => {
  chipContainer.append(createProductChip(product, index));
  showcaseContainer.append(createShowcaseProduct(product, index));
});

if (softwareProducts.length > 0) {
  selectProduct(softwareProducts[0], 0);
}
})();
