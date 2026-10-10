const automobileInventory = [
  { id: "nammi-box", brand: "NAMMI", name: "NAMMI BOX", images: ["../assets/automobile/vehicles/nammi-01.jpg"], fallbackImage: "", featured: false, powertrain: "", powertrainKey: "", status: "enquire", statusLabel: "On enquiry", descriptor: "" },
  { id: "nammi-06-vigo", brand: "NAMMI", name: "NAMMI 06 VIGO", images: [], fallbackImage: "", featured: false, powertrain: "", powertrainKey: "", status: "enquire", statusLabel: "On enquiry", descriptor: "" },
  { id: "mage-m57", brand: "Dongfeng", name: "MAGE M57", images: ["../assets/automobile/vehicles/dongfeng-mage-m57.jpg"], fallbackImage: "../assets/automobile/vehicles/dongfeng-mage-m57.svg", featured: true, powertrain: "Petrol", powertrainKey: "petrol", status: "enquire", statusLabel: "On enquiry", descriptor: "A selected petrol model from the current Dongfeng range." },
  { id: "mage-s01-ev", brand: "Dongfeng", name: "MAGE S01 EV", images: [], fallbackImage: "", featured: false, powertrain: "", powertrainKey: "", status: "enquire", statusLabel: "On enquiry", descriptor: "" },
  { id: "huge-g59", brand: "Dongfeng", name: "HUGE G59", images: [], fallbackImage: "", featured: false, powertrain: "", powertrainKey: "", status: "enquire", statusLabel: "On enquiry", descriptor: "" },
  { id: "epi-008", brand: "Dongfeng", name: "eπ 008", images: ["../assets/automobile/vehicles/dongfeng-ep-e008.jpg"], fallbackImage: "../assets/automobile/vehicles/dongfeng-ep-e008.svg", featured: true, hero: true, powertrain: "REV", powertrainKey: "rev", status: "enquire", statusLabel: "On enquiry", descriptor: "A selected model from the current Dongfeng range." },
  { id: "shine-c65", brand: "Dongfeng", name: "SHINE C65", images: [], fallbackImage: "", featured: false, powertrain: "", powertrainKey: "", status: "enquire", statusLabel: "On enquiry", descriptor: "" },
  { id: "shine-gs-c68", brand: "Dongfeng", name: "SHINE GS C68", images: [], fallbackImage: "", featured: false, powertrain: "", powertrainKey: "", status: "enquire", statusLabel: "On enquiry", descriptor: "" },
  { id: "voyah-dream", brand: "VOYAH", name: "VOYAH DREAM", images: [], fallbackImage: "", featured: false, powertrain: "", powertrainKey: "", status: "enquire", statusLabel: "On enquiry", descriptor: "" },
  { id: "voyah-taishan", brand: "VOYAH", name: "VOYAH TAISHAN", images: ["../assets/automobile/vehicles/voyah-taishan.jpg"], fallbackImage: "../assets/automobile/vehicles/voyah-taishan.svg", featured: true, powertrain: "Hybrid / PHEV", powertrainKey: "hybrid", status: "enquire", statusLabel: "On enquiry", descriptor: "A selected hybrid / PHEV model from the current VOYAH range." },
  { id: "voyah-free-plus", brand: "VOYAH", name: "VOYAH FREE+", images: [], fallbackImage: "", featured: false, powertrain: "", powertrainKey: "", status: "enquire", statusLabel: "On enquiry", descriptor: "" },
  { id: "m-hero-ii-817", brand: "M-HERO", name: "M-HERO II 817", images: ["../assets/automobile/vehicles/m-hero-817.jpg"], fallbackImage: "../assets/automobile/vehicles/m-hero-817.svg", featured: true, powertrain: "Hybrid / PHEV", powertrainKey: "hybrid", status: "enquire", statusLabel: "On enquiry", descriptor: "A selected hybrid / PHEV model from the current M-HERO range." },
  { id: "m-hero-i", brand: "M-HERO", name: "M-HERO I", images: ["../assets/automobile/vehicles/m-hero-917.jpg"], fallbackImage: "../assets/automobile/vehicles/m-hero-917.svg", featured: false, powertrain: "", powertrainKey: "", status: "enquire", statusLabel: "On enquiry", descriptor: "" },
  { id: "rox-01", brand: "ROX Motor", name: "ROX 01 SUV", images: ["../assets/automobile/vehicles/rox-01.jpg"], fallbackImage: "../assets/automobile/vehicles/rox-01.svg", featured: false, catalogue: false },
  { id: "voyah-free", brand: "VOYAH", name: "VOYAH FREE", images: ["../assets/automobile/vehicles/voyah-free.jpg"], fallbackImage: "../assets/automobile/vehicles/voyah-free.svg", featured: false, catalogue: false }
];

const powertrainCategories = [
  { number: "01", label: "Petrol", key: "petrol", description: "Conventional combustion power for familiar everyday driving." },
  { number: "02", label: "Hybrid / PHEV", key: "hybrid", description: "Electric assistance with flexible long-distance capability." },
  { number: "03", label: "EV", key: "ev", description: "Fully electric mobility with quiet, efficient operation." },
  { number: "04", label: "REV", key: "rev", description: "Electric driving with range-extension technology for longer journeys." },
  { number: "05", label: "Pickup", key: "pickup", description: "Utility-focused mobility with practical loading capability." }
];

const activeState = { filter: "all", brand: "all" };
const galleryState = { vehicle: null, index: 0, touchStartX: null };

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  })[character]);
}

function normalizeBrandName(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function vehicleAlt(vehicle) {
  return `Electrony Automobile — ${vehicle.name}`;
}

function vehicleImage(vehicle) {
  return vehicle.images[0] || vehicle.fallbackImage;
}

function imageMarkup(vehicle, className, priority = false) {
  const src = vehicleImage(vehicle);
  if (!src) return `<div class="${className} automobile-image-placeholder" role="img" aria-label="${escapeHtml(vehicleAlt(vehicle))}"></div>`;
  const isPhoto = vehicle.images.length > 0;
  const dataPath = isPhoto ? ` data-photo-path="${escapeHtml(src)}"` : "";
  return `<img class="${className}" src="${escapeHtml(src)}" alt="${escapeHtml(vehicleAlt(vehicle))}"${dataPath} loading="${priority ? "eager" : "lazy"}" decoding="async">`;
}

function createStatusMarkup(vehicle) {
  return `<span class="automobile-status status-${escapeHtml(vehicle.status)}">${escapeHtml(vehicle.statusLabel)}</span>`;
}

function createFeaturedVehicleMarkup(vehicle) {
  const galleryButton = vehicle.images.length > 0
    ? `<button class="automobile-gallery-trigger" type="button" data-gallery-open="${escapeHtml(vehicle.id)}" aria-label="Open image gallery for ${escapeHtml(vehicle.name)}">View photos <span aria-hidden="true">↗</span></button>`
    : "";
  return `
    <article class="automobile-featured-card" data-vehicle-id="${escapeHtml(vehicle.id)}">
      <div class="automobile-featured-card__visual">
        ${imageMarkup(vehicle, "automobile-featured-card__image")}
        <span class="automobile-featured-card__number">${String(automobileInventory.indexOf(vehicle) + 1).padStart(2, "0")}</span>
      </div>
      <div class="automobile-featured-card__body">
        <div><p class="automobile-card-label">${escapeHtml(vehicle.brand)}</p><h3>${escapeHtml(vehicle.name)}</h3></div>
        ${vehicle.descriptor || vehicle.powertrain ? `<div>${vehicle.powertrain ? `<p class="automobile-featured-card__power">${escapeHtml(vehicle.powertrain)}</p>` : ""}<p>${escapeHtml(vehicle.descriptor || "")}</p></div>` : ""}
        <div class="automobile-featured-card__footer">${createStatusMarkup(vehicle)}${galleryButton}<a href="#vehicle-inventory" data-vehicle-link="${escapeHtml(vehicle.id)}">Explore vehicle <span aria-hidden="true">→</span></a></div>
      </div>
    </article>`;
}

function createVehicleMarkup(vehicle) {
  const galleryButton = vehicle.images.length > 0
    ? `<button class="automobile-gallery-trigger" type="button" data-gallery-open="${escapeHtml(vehicle.id)}" aria-label="Open image gallery for ${escapeHtml(vehicle.name)}">View photos <span aria-hidden="true">↗</span></button>`
    : "";
  const details = vehicle.powertrain
    ? `<div class="automobile-vehicle-card__details"><span>${escapeHtml(vehicle.powertrain)}</span>${createStatusMarkup(vehicle)}</div>`
    : `<div class="automobile-vehicle-card__details">${createStatusMarkup(vehicle)}</div>`;
  return `
    <article class="automobile-vehicle-card" data-vehicle-id="${escapeHtml(vehicle.id)}" data-brand="${normalizeBrandName(vehicle.brand)}" data-powertrain="${escapeHtml(vehicle.powertrainKey)}">
      <div class="automobile-vehicle-card__image">${imageMarkup(vehicle, "")}<span class="automobile-vehicle-card__index">${String(automobileInventory.indexOf(vehicle) + 1).padStart(2, "0")}</span></div>
      <div class="automobile-vehicle-card__body">
        <div><p class="automobile-card-label">${escapeHtml(vehicle.brand)}</p><h3>${escapeHtml(vehicle.name)}</h3></div>
        ${details}
        ${galleryButton}
        <a href="#contact" class="automobile-vehicle-card__cta">Enquire <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
}

function bindVehicleImages(root) {
  root.querySelectorAll("img[data-photo-path]").forEach((image) => {
    image.onerror = () => {
      const vehicle = automobileInventory.find((item) => item.id === (image.closest("[data-vehicle-id]")?.dataset.vehicleId || image.dataset.vehicleId || image.dataset.vehicleImage))
        || galleryState.vehicle;
      if (!vehicle) {
        image.remove();
        return;
      }
      const path = image.dataset.photoPath;
      vehicle.images = vehicle.images.filter((item) => item !== path);
      renderFeaturedVehicles();
      renderVehicleInventory();
      renderHeroImage();
      renderPromotionalImages();
      if (galleryState.vehicle === vehicle) renderGallery();
    };
  });
}

function renderFeaturedVehicles() {
  const container = document.querySelector("#featured-grid");
  if (!container) return;
  container.innerHTML = automobileInventory.filter((vehicle) => vehicle.featured).slice(0, 4).map(createFeaturedVehicleMarkup).join("");
  bindVehicleImages(container);
}

function renderPowertrainCards() {
  const container = document.querySelector("#powertrain-cards");
  if (!container) return;
  container.innerHTML = powertrainCategories.map((category) => `
    <article class="automobile-power-card"><span>${category.number}</span><div><p>${category.label}</p><h3>${category.description}</h3></div></article>`).join("");
}

function getVisibleVehicles() {
  return automobileInventory.filter((vehicle) => vehicle.catalogue !== false).filter((vehicle) => {
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
  bindVehicleImages(container);
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

function renderHeroImage() {
  const image = document.querySelector(".automobile-hero__image img");
  if (!image) return;
  const vehicle = automobileInventory.find((item) => item.hero && item.images.length)
    || automobileInventory.find((item) => item.catalogue !== false && item.images.length)
    || automobileInventory.find((item) => item.catalogue !== false && item.fallbackImage);
  if (!vehicle) return;
  image.src = vehicleImage(vehicle);
  image.alt = "";
  image.dataset.vehicleId = vehicle.id;
  image.loading = "eager";
  image.fetchPriority = "high";
  image.decoding = "async";
  image.dataset.photoPath = vehicle.images[0] || "";
  image.onerror = () => {
    const failedPhoto = image.dataset.photoPath;
    if (failedPhoto) {
      vehicle.images = vehicle.images.filter((photo) => photo !== failedPhoto);
      renderFeaturedVehicles();
      renderVehicleInventory();
      renderPromotionalImages();
      renderHeroImage();
      return;
    }
    image.onerror = null;
    image.removeAttribute("src");
  };
}

function renderPromotionalImages() {
  document.querySelectorAll("[data-vehicle-image]").forEach((image) => {
    const vehicle = automobileInventory.find((item) => item.id === image.dataset.vehicleImage);
    if (!vehicle) return;
    const source = vehicleImage(vehicle);
    image.src = source;
    image.alt = vehicleAlt(vehicle);
    image.loading = "lazy";
    image.decoding = "async";
    if (vehicle.images.length) image.dataset.photoPath = vehicle.images[0];
    else image.removeAttribute("data-photo-path");
    bindVehicleImages(image.parentElement);
  });
}

function initializeConceptTyping() {
  const element = document.querySelector("[data-automobile-concept]");
  if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const concepts = ["Electric", "Hybrid", "Extended Range", "Petrol", "Performance", "Luxury", "Off-Road"];
  let wordIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  const tick = () => {
    const word = concepts[wordIndex];
    characterIndex += deleting ? -1 : 1;
    element.textContent = word.slice(0, characterIndex);
    if (!deleting && characterIndex === word.length) {
      deleting = true;
      window.setTimeout(tick, 1100);
      return;
    }
    if (deleting && characterIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % concepts.length;
      window.setTimeout(tick, 250);
      return;
    }
    window.setTimeout(tick, deleting ? 42 : 82);
  };
  window.setTimeout(tick, 500);
}

function renderGallery() {
  const dialog = document.querySelector("#automobile-gallery");
  const image = document.querySelector("#automobile-gallery-image");
  const thumbnails = document.querySelector("#automobile-gallery-thumbnails");
  const previous = document.querySelector("#automobile-gallery-previous");
  const next = document.querySelector("#automobile-gallery-next");
  const counter = document.querySelector("#automobile-gallery-counter");
  const openImage = document.querySelector("#automobile-gallery-open-image");
  const lightboxPrevious = document.querySelector("#automobile-lightbox-previous");
  const lightboxNext = document.querySelector("#automobile-lightbox-next");
  const vehicle = galleryState.vehicle;
  if (!dialog || !image || !thumbnails || !vehicle) return;

  const photos = vehicle.images;
  const fallback = photos.length ? "" : vehicle.fallbackImage;
  const source = photos[galleryState.index] || fallback;
  const multiple = photos.length > 1;
  image.classList.add("is-changing");
  image.alt = vehicleAlt(vehicle);
  image.dataset.photoPath = photos[galleryState.index] || "";
  if (source) image.src = source;
  else image.removeAttribute("src");
  image.onload = () => window.requestAnimationFrame(() => image.classList.remove("is-changing"));
  image.hidden = !source;
  dialog.querySelector("[data-gallery-title]").textContent = vehicle.name;
  previous.hidden = !multiple;
  next.hidden = !multiple;
  if (lightboxPrevious) lightboxPrevious.hidden = !multiple;
  if (lightboxNext) lightboxNext.hidden = !multiple;
  counter.hidden = photos.length === 0;
  counter.textContent = photos.length ? `${galleryState.index + 1} / ${photos.length}` : "";
  openImage.disabled = !source;
  thumbnails.hidden = !multiple;
  thumbnails.innerHTML = multiple ? photos.map((photo, index) => `
    <button class="automobile-gallery__thumbnail${index === galleryState.index ? " is-active" : ""}" type="button" data-gallery-index="${index}" aria-label="Show image ${index + 1} of ${photos.length}" aria-pressed="${index === galleryState.index}">
      <img src="${escapeHtml(photo)}" alt="${escapeHtml(vehicleAlt(vehicle))}" loading="lazy" decoding="async" data-gallery-thumbnail>
    </button>`).join("") : "";
  thumbnails.querySelectorAll("[data-gallery-thumbnail]").forEach((thumbnail) => {
    thumbnail.addEventListener("error", () => {
      const index = Number(thumbnail.closest("[data-gallery-index]")?.dataset.galleryIndex);
      if (Number.isInteger(index)) vehicle.images.splice(index, 1);
      galleryState.index = Math.max(0, Math.min(galleryState.index, vehicle.images.length - 1));
      renderFeaturedVehicles();
      renderVehicleInventory();
      renderGallery();
    }, { once: true });
  });

  if (source) {
    image.onerror = () => {
      const failedPath = image.dataset.photoPath;
      if (!failedPath) {
        image.onerror = null;
        image.hidden = true;
        openImage.disabled = true;
        return;
      }
      vehicle.images = vehicle.images.filter((photo) => photo !== failedPath);
      galleryState.index = Math.max(0, Math.min(galleryState.index, vehicle.images.length - 1));
      renderFeaturedVehicles();
      renderVehicleInventory();
      renderGallery();
    };
  } else {
    image.onerror = null;
  }
}

function openGallery(vehicleId) {
  const vehicle = automobileInventory.find((item) => item.id === vehicleId);
  const dialog = document.querySelector("#automobile-gallery");
  if (!vehicle || !dialog || (!vehicle.images.length && !vehicle.fallbackImage)) return;
  galleryState.vehicle = vehicle;
  galleryState.index = 0;
  renderGallery();
  dialog.showModal();
}

function moveGallery(step) {
  if (!galleryState.vehicle || galleryState.vehicle.images.length < 2) return;
  const count = galleryState.vehicle.images.length;
  galleryState.index = (galleryState.index + step + count) % count;
  renderGallery();
  const lightboxImage = document.querySelector("#automobile-lightbox-image");
  if (lightboxImage?.closest("dialog")?.open) lightboxImage.src = galleryState.vehicle.images[galleryState.index];
}

function initializeGallery() {
  const gallery = document.querySelector("#automobile-gallery");
  const lightbox = document.querySelector("#automobile-lightbox");
  if (!gallery || !lightbox) return;

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-gallery-open]");
    if (trigger) openGallery(trigger.dataset.galleryOpen);
    if (event.target.closest("#automobile-gallery-previous")) moveGallery(-1);
    if (event.target.closest("#automobile-gallery-next")) moveGallery(1);
    if (event.target.closest("#automobile-lightbox-previous")) moveGallery(-1);
    if (event.target.closest("#automobile-lightbox-next")) moveGallery(1);
    const thumbnail = event.target.closest("[data-gallery-index]");
    if (thumbnail && galleryState.vehicle) {
      galleryState.index = Number(thumbnail.dataset.galleryIndex);
      renderGallery();
    }
    if (event.target.closest("#automobile-gallery-open-image") && galleryState.vehicle) {
      const image = document.querySelector("#automobile-lightbox-image");
      image.src = galleryState.vehicle.images[galleryState.index] || galleryState.vehicle.fallbackImage;
      image.alt = vehicleAlt(galleryState.vehicle);
      lightbox.showModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && gallery.open) moveGallery(-1);
    if (event.key === "ArrowRight" && gallery.open) moveGallery(1);
  });

  const imageStage = document.querySelector("#automobile-gallery-stage");
  imageStage?.addEventListener("touchstart", (event) => {
    galleryState.touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  imageStage?.addEventListener("touchend", (event) => {
    if (galleryState.touchStartX === null) return;
    const distance = event.changedTouches[0].clientX - galleryState.touchStartX;
    galleryState.touchStartX = null;
    if (Math.abs(distance) > 45) moveGallery(distance > 0 ? -1 : 1);
  }, { passive: true });

  lightbox.addEventListener("close", () => {
    if (gallery.open) document.querySelector("#automobile-gallery-open-image")?.focus();
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
renderHeroImage();
renderPromotionalImages();
attachFilters();
initializeGallery();
initializeNavigation();
initializeVehicleLinks();
initializeConceptTyping();
