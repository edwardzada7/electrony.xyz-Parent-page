const automobileInventory = [
  { id: "dongfeng-ep-e008", brand: "Dongfeng", name: "Eπ E008", powertrain: "REV", powertrainKey: "rev", status: "enquire", statusLabel: "On enquiry", image: "../assets/automobile/vehicles/dongfeng-ep-e008.svg", featured: true, descriptor: "A selected model from the current Dongfeng range." },
  { id: "dongfeng-mage-m57", brand: "Dongfeng", name: "MAGE M57", powertrain: "Petrol", powertrainKey: "petrol", status: "enquire", statusLabel: "On enquiry", image: "../assets/automobile/vehicles/dongfeng-mage-m57.svg", featured: true, descriptor: "A selected petrol model from the current Dongfeng range." },
  { id: "mhero-917", brand: "M-HERO", name: "M-HERO 917", powertrain: "REV", powertrainKey: "rev", status: "enquire", statusLabel: "On enquiry", image: "../assets/automobile/vehicles/m-hero-917.svg", featured: true, descriptor: "A selected model from the current M-HERO range." },
  { id: "mhero-817", brand: "M-HERO", name: "M-HERO 817", powertrain: "Hybrid / PHEV", powertrainKey: "hybrid", status: "enquire", statusLabel: "On enquiry", image: "../assets/automobile/vehicles/m-hero-817.svg", featured: true, descriptor: "A selected hybrid / PHEV model from the current M-HERO range." },
  { id: "voyah-free", brand: "VOYAH", name: "VOYAH FREE", powertrain: "REV", powertrainKey: "rev", status: "enquire", statusLabel: "On enquiry", image: "../assets/automobile/vehicles/voyah-free.svg", featured: true, descriptor: "A selected model from the current VOYAH range." },
  { id: "voyah-taishan", brand: "VOYAH", name: "VOYAH TAISHAN", powertrain: "Hybrid / PHEV", powertrainKey: "hybrid", status: "enquire", statusLabel: "On enquiry", image: "../assets/automobile/vehicles/voyah-taishan.svg", featured: true, descriptor: "A selected hybrid / PHEV model from the current VOYAH range." },
  { id: "nammi-01", brand: "NAMMI", name: "NAMMI 01", powertrain: "EV", powertrainKey: "ev", status: "enquire", statusLabel: "On enquiry", image: "../assets/automobile/vehicles/nammi-01.svg", featured: false, descriptor: "A selected electric model from the current NAMMI range." },
  { id: "rox-01", brand: "ROX Motor", name: "ROX 01 SUV", powertrain: "EV", powertrainKey: "ev", status: "enquire", statusLabel: "On enquiry", image: "../assets/automobile/vehicles/rox-01.svg", featured: false, descriptor: "A selected SUV model presented through Electrony Automobile for enquiry." },
  { id: "dongfeng-pickup", brand: "Dongfeng", name: "Dongfeng Pickup", powertrain: "Pickup", powertrainKey: "pickup", status: "enquire", statusLabel: "On enquiry", image: "../assets/automobile/vehicles/dongfeng-pickup.svg", featured: false, descriptor: "A selected utility-focused pickup from the current Dongfeng range." }
];

const powertrainCategories = [
  { number: "01", label: "Petrol", key: "petrol", description: "Conventional combustion power for familiar everyday driving." },
  { number: "02", label: "Hybrid / PHEV", key: "hybrid", description: "Electric assistance with flexible long-distance capability." },
  { number: "03", label: "EV", key: "ev", description: "Fully electric mobility with quiet, efficient operation." },
  { number: "04", label: "REV", key: "rev", description: "Electric driving with range-extension technology for longer journeys." },
  { number: "05", label: "Pickup", key: "pickup", description: "Utility-focused mobility with practical loading capability." }
];

const activeState = { filter: "all", brand: "all" };

function normalizeBrandName(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function createStatusMarkup(vehicle) {
  const statusClass = `status-${vehicle.status}`;
  return `<span class="automobile-status ${statusClass}">${vehicle.statusLabel}</span>`;
}

function createFeaturedVehicleMarkup(vehicle) {
  return `
    <article class="automobile-featured-card">
      <div class="automobile-featured-card__visual">
        <img src="${vehicle.image}" alt="${vehicle.name} editorial showcase" loading="lazy" decoding="async" width="1200" height="900">
        <span class="automobile-featured-card__number">${String(automobileInventory.indexOf(vehicle) + 1).padStart(2, "0")}</span>
      </div>
      <div class="automobile-featured-card__body">
        <div><p class="automobile-card-label">${vehicle.brand}</p><h3>${vehicle.name}</h3></div>
        <div><p class="automobile-featured-card__power">${vehicle.powertrain}</p><p>${vehicle.descriptor}</p></div>
        <div class="automobile-featured-card__footer">${createStatusMarkup(vehicle)}<a href="#vehicle-inventory" data-vehicle-link="${vehicle.id}">Explore vehicle <span aria-hidden="true">→</span></a></div>
      </div>
    </article>`;
}

function createVehicleMarkup(vehicle) {
  return `
    <article class="automobile-vehicle-card" data-brand="${normalizeBrandName(vehicle.brand)}" data-powertrain="${vehicle.powertrainKey}">
      <div class="automobile-vehicle-card__image"><img src="${vehicle.image}" alt="${vehicle.name} editorial showcase" loading="lazy" decoding="async" width="1200" height="900"><span class="automobile-vehicle-card__index">${String(automobileInventory.indexOf(vehicle) + 1).padStart(2, "0")}</span></div>
      <div class="automobile-vehicle-card__body">
        <div><p class="automobile-card-label">${vehicle.brand}</p><h3>${vehicle.name}</h3></div>
        <div class="automobile-vehicle-card__details"><span>${vehicle.powertrain}</span>${createStatusMarkup(vehicle)}</div>
        <a href="#contact" class="automobile-vehicle-card__cta">Enquire <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
}

function renderFeaturedVehicles() {
  const container = document.querySelector("#featured-grid");
  if (!container) return;
  container.innerHTML = automobileInventory.filter((vehicle) => vehicle.featured).slice(0, 4).map(createFeaturedVehicleMarkup).join("");
}

function renderPowertrainCards() {
  const container = document.querySelector("#powertrain-cards");
  if (!container) return;
  container.innerHTML = powertrainCategories.map((category) => `
    <article class="automobile-power-card"><span>${category.number}</span><div><p>${category.label}</p><h3>${category.description}</h3></div></article>`).join("");
}

function getVisibleVehicles() {
  return automobileInventory.filter((vehicle) => {
    const matchesFilter = activeState.filter === "all" || vehicle.powertrainKey === activeState.filter;
    const matchesBrand = activeState.brand === "all" || normalizeBrandName(vehicle.brand) === activeState.brand;
    return matchesFilter && matchesBrand;
  });
}

function renderVehicleInventory() {
  const container = document.querySelector("#vehicle-cards");
  if (!container) return;
  const vehicles = getVisibleVehicles();
  container.innerHTML = vehicles.length ? vehicles.map(createVehicleMarkup).join("") : `<div class="automobile-empty-state"><p>No vehicles found</p><span>Try another powertrain or brand combination.</span></div>`;
}

function updateButtonState(selector, selectedButton) {
  document.querySelectorAll(selector).forEach((button) => {
    const isSelected = button === selectedButton;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function attachFilters() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeState.filter = button.dataset.filter || "all";
      updateButtonState("[data-filter]", button);
      renderVehicleInventory();
    });
  });

  document.querySelectorAll(".automobile-brand-button[data-brand]").forEach((button) => {
    button.addEventListener("click", () => {
      activeState.brand = button.dataset.brand || "all";
      updateButtonState(".automobile-brand-button[data-brand]", button);
      renderVehicleInventory();
      document.querySelector("#vehicle-inventory")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initializeNavigation() {
  const header = document.querySelector(".automobile-header");
  const toggle = document.querySelector(".automobile-menu-toggle");
  const navigation = document.querySelector(".automobile-navigation");
  const links = document.querySelectorAll(".automobile-nav-link");
  const sections = ["home", "vehicles", "brands", "powertrain", "rox", "contact"].map((id) => document.getElementById(id)).filter(Boolean);

  const closeMenu = () => {
    if (!toggle || !navigation) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("is-open");
    document.body.classList.remove("automobile-menu-open");
  };

  const openMenu = () => {
    if (!toggle || !navigation) return;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
    navigation.classList.add("is-open");
    document.body.classList.add("automobile-menu-open");
  };

  toggle?.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    expanded ? closeMenu() : openMenu();
  });

  links.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      closeMenu();
      toggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 64 * 16 && toggle?.getAttribute("aria-expanded") === "true") closeMenu();
  });

  const syncHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  const updateActiveLink = (id) => {
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) updateActiveLink(visible.target.id);
    }, { rootMargin: "-28% 0px -58% 0px", threshold: [0.15, 0.4] });
    sections.forEach((section) => observer.observe(section));
  }
}

function initializeVehicleLinks() {
  document.querySelectorAll("[data-vehicle-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const vehicleId = link.dataset.vehicleLink;
      const card = document.querySelector(`[data-vehicle-id="${vehicleId}"]`);
      card?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
}

renderFeaturedVehicles();
renderPowertrainCards();
renderVehicleInventory();
attachFilters();
initializeNavigation();
initializeVehicleLinks();
