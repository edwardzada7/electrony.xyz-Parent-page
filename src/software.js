(() => {
const softwareProductOrder = new Map(["electronyos", "istylist", "bills"].map((id, index) => [id, index]));
const softwareProducts = window.ElectronyProducts
  .filter((product) => product.category === "Software")
  .sort((first, second) => (softwareProductOrder.get(first.id) ?? Infinity) - (softwareProductOrder.get(second.id) ?? Infinity));
const chipContainer = document.querySelector("#motherboard-chips");
const productName = document.querySelector("#product-name");
const productDescription = document.querySelector("#product-description");
const productStatus = document.querySelector("#product-status");
const productLinks = document.querySelector("#product-links");
const detailIndex = document.querySelector("#detail-index");

function createProductLink(label, url, primary = false) {
  const link = document.createElement("a");
  link.className = primary ? "detail-link detail-link-primary" : "detail-link";
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
  document.querySelector("#product-detail").style.setProperty("--selected-accent", product.accentColor || "var(--color-product-default)");

  productLinks.replaceChildren();
  if (product.landingPageUrl) {
    productLinks.append(createProductLink(`Visit ${product.name}`, product.landingPageUrl, true));
  }
  if (product.appUrl && product.appUrl !== product.landingPageUrl) {
    productLinks.append(createProductLink(`Open ${product.name} application`, product.appUrl));
  }
}

function createProductChip(product, index) {
  const button = document.createElement("button");
  button.className = "product-chip";
  button.type = "button";
  button.dataset.productId = product.id;
  const productSlots = ["1 / 1", "1 / 3", "3 / 2"];
  button.style.gridArea = productSlots[index] || `${4 + Math.floor((index - 3) / 3)} / ${((index - 3) % 3) + 1}`;
  button.style.setProperty("--chip-accent", product.accentColor || "var(--color-product-default)");
  button.setAttribute("aria-controls", "product-detail");
  button.setAttribute("aria-pressed", "false");
  button.setAttribute("aria-label", `${product.name}, ${product.ecosystemStatus || (product.status === "live" ? "Live" : product.status)}. Show product details.`);

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
  status.textContent = product.ecosystemStatus || (product.status === "live" ? "Live" : product.status);
  const prompt = document.createElement("span");
  prompt.className = "chip-select-prompt";
  prompt.setAttribute("aria-hidden", "true");
  prompt.textContent = "SELECT  ↗";
  bottom.append(status, prompt);

  button.append(top, name, description, bottom);
  button.addEventListener("click", () => selectProduct(product, index));
  return button;
}

if (chipContainer && softwareProducts.length > 0) {
  softwareProducts.forEach((product, index) => {
    chipContainer.append(createProductChip(product, index));
  });
  selectProduct(softwareProducts[0], 0);
}
})();
