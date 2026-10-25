const automobileInventory = [
  { id: "nammi-box", brand: "NAMMI", name: "NAMMI BOX", images: ["../assets/automobile/vehicles/nammi-01.jpg"], videos: [{ src: "../assets/automobile/vehicles/nammi-box/01-walkaround.mp4/VID-20261010-WA0038.mp4", title: "Vehicle Walkaround" }], fallbackImage: "", featured: false, powertrain: "EV", powertrainKey: "ev", status: "enquire", statusLabel: "On enquiry", descriptor: "", specifications: ["70 kW motor", "31.4 kWh battery", "330 km CLTC"] },
  { id: "nammi-06-vigo", brand: "NAMMI", name: "NAMMI 06 VIGO", images: [], videos: [], fallbackImage: "", featured: false, powertrain: "EV", powertrainKey: "ev", status: "enquire", statusLabel: "On enquiry", descriptor: "", specifications: ["135 kW motor", "51.9 kWh battery", "471 km CLTC"] },
  { id: "mage-m57", brand: "Dongfeng", name: "MAGE M57", images: ["../assets/automobile/vehicles/dongfeng-mage-m57.jpg"], videos: [{ src: "../assets/automobile/vehicles/mage-m57/01-walkaround.mp4/VID-20261010-WA0036.mp4", title: "Vehicle Walkaround" }], fallbackImage: "../assets/automobile/vehicles/dongfeng-mage-m57.svg", featured: true, powertrain: "Petrol", powertrainKey: "petrol", status: "enquire", statusLabel: "On enquiry", descriptor: "A selected petrol model from the current Dongfeng range.", specifications: ["1.5L turbo petrol", "204 hp"] },
  { id: "mage-s01-ev", brand: "Dongfeng", name: "MAGE S01 EV", images: [], videos: [], fallbackImage: "", featured: false, powertrain: "EV", powertrainKey: "ev", status: "enquire", statusLabel: "On enquiry", descriptor: "", specifications: ["120 kW motor", "50.8 kWh battery", "403 km CLTC"] },
  { id: "huge-g59", brand: "Dongfeng", name: "HUGE G59", images: [], videos: [], fallbackImage: "", featured: false, powertrain: "Petrol", powertrainKey: "petrol", status: "enquire", statusLabel: "On enquiry", descriptor: "", specifications: ["1.5L turbo petrol", "201 hp", "305 Nm"] },
  { id: "epi-008", brand: "Dongfeng", name: "eπ 008", images: ["../assets/automobile/vehicles/dongfeng-ep-e008.jpg"], videos: [{ src: "../assets/automobile/vehicles/epi-008/01 walkaround.mp4/VID-20261010-WA0035.mp4", title: "Vehicle Walkaround" }], fallbackImage: "../assets/automobile/vehicles/dongfeng-ep-e008.svg", featured: true, hero: true, powertrain: "REV", powertrainKey: "rev", status: "enquire", statusLabel: "On enquiry", descriptor: "A selected model from the current Dongfeng range.", specifications: ["200 kW motor", "34.3 kWh battery", "202 km electric range (CLTC)"] },
  { id: "shine-c65", brand: "Dongfeng", name: "SHINE C65", images: [], videos: [{ src: "../assets/automobile/vehicles/shine-c65/01-walkaround.mp4/VID-20261010-WA0034.mp4", title: "Vehicle Walkaround" }], fallbackImage: "", featured: false, powertrain: "Petrol", powertrainKey: "petrol", status: "enquire", statusLabel: "On enquiry", descriptor: "", specifications: ["1.5L petrol", "123 hp", "158 Nm"] },
  { id: "shine-gs-c68", brand: "Dongfeng", name: "SHINE GS C68", images: [], videos: [], fallbackImage: "", featured: false, powertrain: "Petrol", powertrainKey: "petrol", status: "enquire", statusLabel: "On enquiry", descriptor: "", specifications: ["1.5L petrol", "117 hp", "Automatic gearbox"] },
  { id: "voyah-dream", brand: "VOYAH", name: "VOYAH DREAM", images: [], videos: [], fallbackImage: "", featured: false, powertrain: "Hybrid / PHEV", powertrainKey: "hybrid", status: "enquire", statusLabel: "On enquiry", descriptor: "", specifications: ["1.5T plug-in hybrid", "62.5 kWh battery", "350 km electric range (CLTC)"] },
  { id: "voyah-taishan", brand: "VOYAH", name: "VOYAH TAISHAN", images: ["../assets/automobile/vehicles/voyah-taishan.jpg"], videos: [], fallbackImage: "../assets/automobile/vehicles/voyah-taishan.svg", featured: true, powertrain: "Hybrid / PHEV", powertrainKey: "hybrid", status: "enquire", statusLabel: "On enquiry", descriptor: "A selected hybrid / PHEV model from the current VOYAH range.", specifications: ["1.5T plug-in hybrid", "65 kWh battery", "About 290 km electric range (CLTC)"] },
  { id: "voyah-free-plus", brand: "VOYAH", name: "VOYAH FREE+", images: [], videos: [{ src: "../assets/automobile/vehicles/voyah-free-plus/01-walkaround.mp4/VID-20261010-WA0041.mp4", title: "Vehicle Walkaround" }], fallbackImage: "", featured: false, powertrain: "REV", powertrainKey: "rev", status: "enquire", statusLabel: "On enquiry", descriptor: "", specifications: ["215 kW motor", "43.2 kWh battery", "318 km electric range (CLTC)"] },
  { id: "m-hero-ii-817", brand: "M-HERO", name: "M-HERO II 817", images: ["../assets/automobile/vehicles/m-hero-817.jpg"], videos: [{ src: "../assets/automobile/vehicles/m-hero-ii-817/01-walkaround.mp4/VID-20261010-WA0040.mp4", title: "Vehicle Walkaround" }], fallbackImage: "../assets/automobile/vehicles/m-hero-817.svg", featured: true, powertrain: "Hybrid / PHEV", powertrainKey: "hybrid", status: "enquire", statusLabel: "On enquiry", descriptor: "A selected hybrid / PHEV model from the current M-HERO range.", specifications: ["505 kW plug-in hybrid", "31.7 kWh battery", "140 km electric range (CLTC)"] },
  { id: "m-hero-i", brand: "M-HERO", name: "M-HERO I", images: ["../assets/automobile/vehicles/m-hero-917.jpg"], videos: [{ src: "../assets/automobile/vehicles/m-hero-i/01-walkaround.mp4/VID-20261010-WA0039.mp4", title: "Vehicle Walkaround" }], fallbackImage: "../assets/automobile/vehicles/m-hero-917.svg", featured: false, powertrain: "REV", powertrainKey: "rev", status: "enquire", statusLabel: "On enquiry", descriptor: "", specifications: ["600 kW electric motors", "66 kWh battery", "200 km electric range (CLTC)"] },
  { id: "rox-01", brand: "ROX Motor", name: "ROX 01 SUV", images: ["../assets/automobile/vehicles/rox-01.jpg"], videos: [], fallbackImage: "../assets/automobile/vehicles/rox-01.svg", featured: false, powertrain: "EV", powertrainKey: "ev", status: "enquire", statusLabel: "Confirm availability", descriptor: "Vehicle details and current availability are confirmed on enquiry." },
  { id: "voyah-free", brand: "VOYAH", name: "VOYAH FREE", images: ["../assets/automobile/vehicles/voyah-free.jpg"], videos: [], fallbackImage: "../assets/automobile/vehicles/voyah-free.svg", featured: false, powertrain: "EV", powertrainKey: "ev", status: "enquire", statusLabel: "Confirm availability", descriptor: "Vehicle details and current availability are confirmed on enquiry." }
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

function whatsappNumber() {
  const number = String(window.ElectronyConfig?.whatsappNumber || "").replace(/\D/g, "");
  return /^\d{8,15}$/.test(number) ? number : "";
}

function vehicleEnquiryUrl(vehicle) {
  const number = whatsappNumber();
  if (!number) return "#contact";
  const message = `Hello Electrony, I would like to enquire about ${vehicle.brand} — ${vehicle.name}. Please confirm current availability and share the details.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function imageMarkup(vehicle, className, priority = false) {
  const src = vehicleImage(vehicle);
  if (!src) return `<div class="${className} automobile-image-placeholder" role="img" aria-label="${escapeHtml(vehicleAlt(vehicle))}"></div>`;
  const isPhoto = vehicle.images.length > 0;
  const dataPath = isPhoto ? ` data-photo-path="${escapeHtml(src)}"` : "";
  return `<img class="${className}" src="${escapeHtml(src)}" alt="${escapeHtml(vehicleAlt(vehicle))}"${dataPath} loading="${priority ? "eager" : "lazy"}" decoding="async">`;
}

function createStatusMarkup(vehicle) {
  const status = vehicle.status || "enquire";
  const label = status === "enquire" ? "Confirm availability" : vehicle.statusLabel;
  return `<span class="automobile-status status-${escapeHtml(status)}">${escapeHtml(label || "Enquire for details")}</span>`;
}

function createFeaturedVehicleMarkup(vehicle) {
  const hasMedia = vehicle.images.length > 0 || vehicle.fallbackImage || vehicle.videos.length > 0;
  const galleryButton = hasMedia
    ? `<button class="automobile-gallery-trigger" type="button" data-gallery-open="${escapeHtml(vehicle.id)}" aria-label="Open media gallery for ${escapeHtml(vehicle.name)}">View ${vehicle.videos.length ? "media" : "photos"} <span aria-hidden="true">↗</span></button>`
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
  const hasMedia = vehicle.images.length > 0 || vehicle.fallbackImage || vehicle.videos.length > 0;
  const galleryButton = hasMedia
    ? `<button class="automobile-gallery-trigger" type="button" data-gallery-open="${escapeHtml(vehicle.id)}" aria-label="Open media gallery for ${escapeHtml(vehicle.name)}">View ${vehicle.videos.length ? "media" : "photos"} <span aria-hidden="true">↗</span></button>`
    : "";
  const details = vehicle.powertrain
    ? `<div class="automobile-vehicle-card__details"><span>${escapeHtml(vehicle.powertrain)}</span>${createStatusMarkup(vehicle)}</div>`
    : `<div class="automobile-vehicle-card__details">${createStatusMarkup(vehicle)}</div>`;
  return `
    <article class="automobile-vehicle-card" data-vehicle-id="${escapeHtml(vehicle.id)}" data-brand="${normalizeBrandName(vehicle.brand)}" data-powertrain="${escapeHtml(vehicle.powertrainKey)}">
      <div class="automobile-vehicle-card__image">${imageMarkup(vehicle, "")}<span class="automobile-vehicle-card__index">${String(automobileInventory.indexOf(vehicle) + 1).padStart(2, "0")}</span></div>
      <div class="automobile-vehicle-card__body">
        <div><p class="automobile-card-label">${escapeHtml(vehicle.brand)}</p><h3>${escapeHtml(vehicle.name)}</h3>${vehicle.descriptor ? `<p class="automobile-vehicle-card__description">${escapeHtml(vehicle.descriptor)}</p>` : ""}</div>
        ${vehicle.specifications?.length ? `<p class="automobile-vehicle-card__specs">${vehicle.specifications.map(escapeHtml).join(" · ")}</p>` : ""}
        ${details}
        ${galleryButton}
        <a href="${escapeHtml(vehicleEnquiryUrl(vehicle))}" class="automobile-vehicle-card__cta"${whatsappNumber() ? ' target="_blank" rel="noopener noreferrer"' : ""} aria-label="Enquire about ${escapeHtml(vehicle.name)}${whatsappNumber() ? " via WhatsApp" : ""}">Enquire about this vehicle <span aria-hidden="true">↗</span></a>
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

function renderVideoShowcase() {
  const container = document.querySelector("#automobile-video-showcase");
  if (!container) return;
  const vehicles = automobileInventory.filter((vehicle) => vehicle.videos.length);
  container.replaceChildren();
  vehicles.forEach((vehicle) => {
    vehicle.videos.forEach((video, index) => {
      const article = document.createElement("article");
      article.className = "automobile-media-card";

      const heading = document.createElement("div");
      heading.className = "automobile-media-card__heading";
      const brand = document.createElement("p");
      brand.className = "automobile-card-label";
      brand.textContent = vehicle.brand;
      const title = document.createElement("h3");
      title.textContent = vehicle.name;
      heading.append(brand, title);

      const player = document.createElement("video");
      player.controls = true;
      player.preload = "none";
      player.playsInline = true;
      player.setAttribute("aria-label", `${vehicle.name}: ${video.title || `Vehicle walkaround ${index + 1}`}`);
      if (vehicle.images.length) player.poster = vehicle.images[0];
      const source = document.createElement("source");
      source.src = video.src;
      source.type = "video/mp4";
      player.appendChild(source);

      const status = document.createElement("p");
      status.className = "automobile-media-card__status";
      status.setAttribute("role", "status");
      status.hidden = true;
      status.textContent = "This video is currently unavailable. Please enquire about the vehicle.";
      player.addEventListener("error", () => {
        status.hidden = false;
      });
      player.addEventListener("loadeddata", () => {
        status.hidden = true;
      });

      const enquiry = document.createElement("a");
      enquiry.className = "automobile-media-card__enquire";
      enquiry.href = vehicleEnquiryUrl(vehicle);
      enquiry.textContent = `Enquire about ${vehicle.name}`;
      enquiry.setAttribute("aria-label", `Enquire about ${vehicle.name}`);
      if (whatsappNumber()) {
        enquiry.target = "_blank";
        enquiry.rel = "noopener noreferrer";
      }
      article.append(heading, player, status, enquiry);
      container.appendChild(article);
    });
  });
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
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      document.querySelector("#vehicle-inventory")?.scrollIntoView({ behavior, block: "start" });
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
  if (!element) return;
  const concepts = ["Electric", "Hybrid", "Extended Range", "Petrol", "Performance", "Luxury", "Off-Road"];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let timer;
  let wordIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  const showStaticConcept = () => {
    window.clearTimeout(timer);
    element.textContent = concepts[wordIndex];
  };
  const tick = () => {
    const word = concepts[wordIndex];
    characterIndex += deleting ? -1 : 1;
    element.textContent = word.slice(0, characterIndex);
    if (!deleting && characterIndex === word.length) {
      deleting = true;
      timer = window.setTimeout(tick, 1100);
      return;
    }
    if (deleting && characterIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % concepts.length;
      timer = window.setTimeout(tick, 250);
      return;
    }
    timer = window.setTimeout(tick, deleting ? 42 : 82);
  };

  if (reducedMotion.matches) {
    showStaticConcept();
    reducedMotion.addEventListener?.("change", (event) => {
      if (event.matches) showStaticConcept();
      else timer = window.setTimeout(tick, 500);
    });
    return;
  }

  timer = window.setTimeout(tick, 500);
  reducedMotion.addEventListener?.("change", (event) => {
    window.clearTimeout(timer);
    if (event.matches) showStaticConcept();
    else {
      deleting = false;
      characterIndex = 0;
      timer = window.setTimeout(tick, 500);
    }
  });
}

function renderGallery() {
  const dialog = document.querySelector("#automobile-gallery");
  const stage = document.querySelector("#automobile-gallery-stage");
  const image = document.querySelector("#automobile-gallery-image");
  const thumbnails = document.querySelector("#automobile-gallery-thumbnails");
  const previous = document.querySelector("#automobile-gallery-previous");
  const next = document.querySelector("#automobile-gallery-next");
  const counter = document.querySelector("#automobile-gallery-counter");
  const openImage = document.querySelector("#automobile-gallery-open-image");
  const lightboxPrevious = document.querySelector("#automobile-lightbox-previous");
  const lightboxNext = document.querySelector("#automobile-lightbox-next");
  const videos = document.querySelector("#automobile-gallery-videos");
  const videoList = document.querySelector("[data-gallery-video-list]");
  const vehicle = galleryState.vehicle;
  if (!dialog || !image || !thumbnails || !vehicle) return;

  const photos = vehicle.images;
  const fallback = photos.length ? "" : vehicle.fallbackImage;
  const source = photos[galleryState.index] || fallback;
  if (stage) stage.hidden = !source;
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

  if (videos && videoList) {
    videos.hidden = vehicle.videos.length === 0;
    videoList.innerHTML = vehicle.videos.map((video, index) => {
      const title = video.title || `${vehicle.name} video ${index + 1}`;
      const poster = vehicle.images[0] ? ` poster="${escapeHtml(vehicle.images[0])}"` : "";
      return `
        <article class="automobile-gallery__video">
          <h4>${escapeHtml(title)}</h4>
          <video controls preload="none" aria-label="${escapeHtml(`${vehicle.name}: ${title}`)}"${poster}>
            <source src="${escapeHtml(video.src)}" type="video/mp4">
          </video>
          <p class="automobile-gallery__video-error" role="status" hidden>Video unavailable. Please try again later or enquire about this vehicle.</p>
        </article>`;
    }).join("");
    videoList.querySelectorAll("video").forEach((video) => {
      const error = video.parentElement.querySelector(".automobile-gallery__video-error");
      video.addEventListener("error", () => {
        error.hidden = false;
      });
      video.addEventListener("loadeddata", () => {
        error.hidden = true;
      });
    });
  }

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
  if (!vehicle || !dialog || (!vehicle.images.length && !vehicle.fallbackImage && !vehicle.videos.length)) return;
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

  gallery.addEventListener("close", () => {
    gallery.querySelectorAll("video").forEach((video) => video.pause());
  });

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
  const mobileMenuViewport = window.matchMedia("(max-width: 64rem)");
  const sections = ["home", "vehicles", "brands", "powertrain", "rox", "contact"].map((id) => document.getElementById(id)).filter(Boolean);

  const closeMenu = (restoreFocus = false) => {
    if (!toggle || !navigation) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("is-open");
    document.body.classList.remove("automobile-menu-open");
    if (mobileMenuViewport.matches) navigation.setAttribute("aria-hidden", "true");
    else navigation.removeAttribute("aria-hidden");
    if (restoreFocus) toggle.focus();
  };

  const openMenu = () => {
    if (!toggle || !navigation) return;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close navigation menu");
    navigation.classList.add("is-open");
    document.body.classList.add("automobile-menu-open");
    navigation.setAttribute("aria-hidden", "false");
    navigation.querySelector("a")?.focus({ preventScroll: true });
  };

  closeMenu();
  toggle?.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    expanded ? closeMenu() : openMenu();
  });

  links.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
    }
  });
  document.addEventListener("click", (event) => {
    if (toggle?.getAttribute("aria-expanded") === "true"
      && !navigation.contains(event.target)
      && !toggle.contains(event.target)) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (!mobileMenuViewport.matches) {
      closeMenu();
      navigation?.removeAttribute("aria-hidden");
    } else if (toggle?.getAttribute("aria-expanded") !== "true") {
      navigation?.setAttribute("aria-hidden", "true");
    }
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

function initializeReturnToTop() {
  const button = document.querySelector("[data-return-to-top]");
  if (!button) return;
  button.addEventListener("click", () => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    window.scrollTo({ top: 0, behavior });
  });
}

function initializeVehicleLinks() {
  document.querySelectorAll("[data-vehicle-link]").forEach((link) => {
    link.addEventListener("click", () => {
      const vehicleId = link.dataset.vehicleLink;
      const card = document.querySelector(`[data-vehicle-id="${vehicleId}"]`);
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      card?.scrollIntoView({ behavior, block: "center" });
    });
  });
}

function initializeVehicleEnquiries() {
  document.querySelectorAll("[data-vehicle-enquiry]").forEach((link) => {
    const vehicle = automobileInventory.find((item) => item.id === link.dataset.vehicleEnquiry);
    if (vehicle) {
      link.href = vehicleEnquiryUrl(vehicle);
      if (whatsappNumber()) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    }
  });

  const generalLink = document.querySelector("[data-whatsapp-general]");
  const number = whatsappNumber();
  if (!generalLink || !number) return;
  const message = "Hello Electrony, I would like to enquire about the Electrony Automobile vehicle selection.";
  generalLink.href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  generalLink.target = "_blank";
  generalLink.rel = "noopener noreferrer";
  generalLink.hidden = false;
}

renderFeaturedVehicles();
renderPowertrainCards();
renderVideoShowcase();
renderVehicleInventory();
renderHeroImage();
renderPromotionalImages();
attachFilters();
initializeGallery();
initializeNavigation();
initializeReturnToTop();
initializeVehicleLinks();
initializeVehicleEnquiries();
initializeConceptTyping();
