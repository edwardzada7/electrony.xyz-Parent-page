const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

class MockElement {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.dataset = {};
    this.attributes = {};
    this.listeners = {};
    this.className = "";
    this.textContent = "";
    this.style = {
      setProperty: (name, value) => {
        this.style[name] = value;
      }
    };
  }

  get classList() {
    return {
      toggle: (token, force) => {
        const classes = new Set(this.className.split(/\s+/).filter(Boolean));
        if (force) classes.add(token);
        else classes.delete(token);
        this.className = [...classes].join(" ");
      }
    };
  }

  append(...elements) {
    this.children.push(...elements);
  }

  replaceChildren(...elements) {
    this.children = elements;
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  addEventListener(name, listener) {
    this.listeners[name] = listener;
  }

  querySelectorAll(selector) {
    return selector === "[data-product-id]" ? this.children.filter((child) => child.dataset.productId) : [];
  }

  click() {
    this.listeners.click();
  }
}

function initializeSoftwarePage() {
  const elements = new Map([
    ["#motherboard-chips", new MockElement("div")],
    ["#product-name", new MockElement("h3")],
    ["#product-description", new MockElement("p")],
    ["#product-status", new MockElement("span")],
    ["#product-links", new MockElement("div")],
    ["#detail-index", new MockElement("span")],
    ["#product-detail", new MockElement("section")]
  ]);
  const window = {};
  const document = {
    querySelector: (selector) => elements.get(selector),
    createElement: (tagName) => new MockElement(tagName)
  };
  const context = { window, document };
  const sourceRoot = path.resolve(__dirname, "..");

  for (const file of ["src/config.js", "src/products.js", "src/software.js"]) {
    vm.runInNewContext(fs.readFileSync(path.join(sourceRoot, file), "utf8"), context, { filename: file });
  }

  return { elements, products: window.ElectronyProducts };
}

test("software product chips select accurate details and configured destinations", () => {
  const { elements, products } = initializeSoftwarePage();
  const chips = elements.get("#motherboard-chips").children;
  const detailLinks = elements.get("#product-links");

  assert.deepEqual(chips.map((chip) => chip.dataset.productId), ["electronyos", "istylist", "bills"]);
  assert.equal(chips[0].attributes["aria-pressed"], "true");
  assert.equal(elements.get("#product-name").textContent, "ElectronyOS");
  assert.equal(elements.get("#product-description").textContent, "Smart Estate Management Software.");
  assert.deepEqual(detailLinks.children.map((link) => link.href), [
    "https://os.electrony.xyz",
    "https://app.electrony.xyz"
  ]);

  chips[1].click();
  assert.equal(elements.get("#product-name").textContent, "iStylist");
  assert.equal(elements.get("#product-description").textContent, "Beauty Services Marketplace.");
  assert.equal(elements.get("#product-status").textContent, "Live");
  assert.deepEqual(detailLinks.children.map((link) => link.href), [
    "https://istylist.online",
    "https://app.istylist.online"
  ]);
  assert.equal(chips[1].attributes["aria-pressed"], "true");
  assert.equal(chips[0].attributes["aria-pressed"], "false");

  chips[2].click();
  assert.equal(elements.get("#product-name").textContent, "Electrony Bills");
  assert.equal(elements.get("#product-status").textContent, "In development / integration stage");
  assert.deepEqual(detailLinks.children.map((link) => link.href), ["https://bills.electrony.xyz"]);
  assert.equal(detailLinks.children[0].target, "_blank");
  assert.equal(detailLinks.children[0].rel, "noopener noreferrer");
  assert.equal(products.filter((product) => product.category === "Software").length, 3);
});
