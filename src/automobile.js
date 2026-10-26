const automobileInventory = window.ElectronyAutomobileData.vehicles;
const legacyAutomobileShowcaseVehicles = window.ElectronyAutomobileData.legacyShowcaseVehicles;
const featuredAutomobileVideos = window.ElectronyAutomobileData.featuredVideos;
const parseAutomobileYouTubeVideoId = window.ElectronyAutomobileData.getYouTubeVideoId;
const allAutomobileVehicles = [...automobileInventory, ...legacyAutomobileShowcaseVehicles];

const powertrainCategories = [
  { number: "01", label: "Petrol", key: "petrol", description: "Petrol-powered models from sedans to family SUVs." },
  { number: "02", label: "Plug-in hybrid (PHEV)", key: "phev", description: "Plug-in hybrid vehicles with electric and petrol power." },
  { number: "03", label: "Fully electric (BEV)", key: "bev", description: "Battery-electric vehicles with no petrol engine." },
  { number: "04", label: "Extended-range electric (EREV)", key: "erev", description: "Electric-drive vehicles with an onboard petrol range extender." }
];

const activeState = { filter: "all", brand: "all", category: "all", search: "" };
const galleryState = { vehicle: null, index: 0, touchStartX: null };

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  })[character]);
}

function normalizeBrandName(value) {
  return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function vehicleAlt(vehicle, index = 0) {
  if (vehicle.imageAlt && index === 0) return vehicle.imageAlt;
  if (!vehicle.source) return `${vehicle.brand} ${vehicle.name} image in the Electrony Automobile selection`;
  return `${vehicle.name} interior detail from the Fouani Nigeria brochure`;
}

function vehicleImage(vehicle) {
  return vehicle.images[0] || vehicle.fallbackImage;
}

function findVehicleById(vehicleId) {
  return allAutomobileVehicles.find((vehicle) => vehicle.id === vehicleId);
}

function getAutomobileWhatsAppNumber() {
  const number = String(window.ElectronyConfig?.whatsappNumber || "").replace(/\D/g, "");
  return /^\d{8,15}$/.test(number) ? number : "";
}

function vehicleEnquiryUrl(vehicle) {
  const number = getAutomobileWhatsAppNumber();
  if (!number) return "#contact";
  const details = vehicle.headlineSpecifications?.length
    ? `\nBrochure specifications: ${vehicle.headlineSpecifications.join("; ")}`
    : "";
  const productUrl = new URL(window.location.href);
  productUrl.hash = `vehicle/${vehicle.id}`;
  const message = `Hello Electrony, I would like to enquire about ${vehicle.brand} — ${vehicle.name}. Please confirm current price and availability.${details}\nProduct page: ${productUrl.href}`;
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
  return `<span class="automobile-status status-enquire">${escapeHtml(vehicle.statusLabel || "Confirm availability")}</span>`;
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
        <div><p class="automobile-featured-card__power">${escapeHtml(vehicle.powertrain)}</p><p>${vehicle.headlineSpecifications.slice(0, 3).map(escapeHtml).join(" · ")}</p></div>
        <div class="automobile-featured-card__footer">${createStatusMarkup(vehicle)}${galleryButton}<a href="#vehicle/${escapeHtml(vehicle.id)}">View details <span aria-hidden="true">→</span></a></div>
      </div>
    </article>`;
}

function createVehicleMarkup(vehicle) {
  const hasMedia = vehicle.images.length > 0 || vehicle.fallbackImage || vehicle.videos.length > 0;
  const galleryButton = hasMedia
    ? `<button class="automobile-gallery-trigger" type="button" data-gallery-open="${escapeHtml(vehicle.id)}" aria-label="Open media gallery for ${escapeHtml(vehicle.name)}">View ${vehicle.videos.length ? "media" : "photos"} <span aria-hidden="true">↗</span></button>`
    : "";
  return `
    <article class="automobile-vehicle-card" data-vehicle-id="${escapeHtml(vehicle.id)}" data-brand="${normalizeBrandName(vehicle.brand)}" data-powertrain="${escapeHtml(vehicle.powertrainKey)}">
      <div class="automobile-vehicle-card__image">${imageMarkup(vehicle, "")}<span class="automobile-vehicle-card__index">${String(automobileInventory.indexOf(vehicle) + 1).padStart(2, "0")}</span></div>
      <div class="automobile-vehicle-card__body">
        <div><p class="automobile-card-label">${escapeHtml(vehicle.brand)} · ${escapeHtml(vehicle.category)}</p><h3>${escapeHtml(vehicle.name)}</h3><p class="automobile-vehicle-card__description">${escapeHtml(vehicle.vehicleType)}</p></div>
        <p class="automobile-vehicle-card__power">${escapeHtml(vehicle.powertrain)}</p>
        <p class="automobile-vehicle-card__specs">${vehicle.headlineSpecifications.map(escapeHtml).join(" · ")}</p>
        <div class="automobile-vehicle-card__details"><span>${escapeHtml(vehicle.priceLabel)}</span>${createStatusMarkup(vehicle)}</div>
        ${galleryButton}
        <a href="#vehicle/${escapeHtml(vehicle.id)}" class="automobile-vehicle-card__cta" aria-label="View ${escapeHtml(vehicle.brand)} ${escapeHtml(vehicle.name)} details and enquire">View details &amp; enquire <span aria-hidden="true">↗</span></a>
      </div>
    </article>`;
}

function bindVehicleImages(root) {
  root.querySelectorAll("img[data-photo-path]").forEach((image) => {
    image.onerror = () => {
      const vehicle = findVehicleById(image.closest("[data-vehicle-id]")?.dataset.vehicleId || image.dataset.vehicleId || image.dataset.vehicleImage)
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

function configuredYouTubeVideo(video, fallbackTitle) {
  const source = typeof video === "string" ? video : video?.url || video?.id || video?.video;
  const id = parseAutomobileYouTubeVideoId(source);
  if (!id) return null;
  const title = typeof video === "object" && typeof video.title === "string" && video.title.trim()
    ? video.title.trim()
    : fallbackTitle;
  return { id, title };
}

function youtubeFrameMarkup(video) {
  return `
    <div class="automobile-youtube-frame">
      <iframe
        src="https://www.youtube-nocookie.com/embed/${escapeHtml(video.id)}"
        title="${escapeHtml(video.title)}"
        loading="lazy"
        referrerpolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen></iframe>
    </div>`;
}

function appendYouTubeVideoCard(container, { brand, model, video, vehicle }) {
  const configured = configuredYouTubeVideo(video, `${model} video`);
  if (!configured) return false;

  const article = document.createElement("article");
  article.className = "automobile-media-card";
  const heading = document.createElement("div");
  heading.className = "automobile-media-card__heading";
  const brandLabel = document.createElement("p");
  brandLabel.className = "automobile-card-label";
  brandLabel.textContent = brand;
  const title = document.createElement("h3");
  title.textContent = model;
  heading.append(brandLabel, title);
  article.append(heading);
  article.insertAdjacentHTML("beforeend", youtubeFrameMarkup(configured));

  if (vehicle) {
    const enquiry = document.createElement("a");
    enquiry.className = "automobile-media-card__enquire";
    enquiry.href = vehicleEnquiryUrl(vehicle);
    enquiry.textContent = `Enquire about ${vehicle.name}`;
    if (getAutomobileWhatsAppNumber()) {
      enquiry.target = "_blank";
      enquiry.rel = "noopener noreferrer";
    }
    article.append(enquiry);
  }
  container.append(article);
  return true;
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
      if (getAutomobileWhatsAppNumber()) {
        enquiry.target = "_blank";
        enquiry.rel = "noopener noreferrer";
      }
      article.append(heading, player, status, enquiry);
      container.appendChild(article);
    });

    const youtubeVideo = configuredYouTubeVideo(vehicle.youtubeVideo, `${vehicle.name} video`);
    if (youtubeVideo) {
      appendYouTubeVideoCard(container, {
        brand: vehicle.brand,
        model: vehicle.name,
        video: vehicle.youtubeVideo,
        vehicle
      });
    }
  });

  featuredAutomobileVideos.forEach((video) => {
    if (!video || typeof video !== "object" || typeof video.title !== "string" || !video.title.trim()) return;
    const vehicle = automobileInventory.find((item) => item.id === video.vehicleId);
    appendYouTubeVideoCard(container, {
      brand: vehicle?.brand || "Electrony Automobile",
      model: video.title.trim(),
      video,
      vehicle
    });
  });
}

function getVisibleVehicles() {
  return automobileInventory.filter((vehicle) => {
    const matchesFilter = activeState.filter === "all" || vehicle.powertrainKey === activeState.filter;
    const matchesBrand = activeState.brand === "all" || normalizeBrandName(vehicle.brand) === activeState.brand;
    const matchesCategory = activeState.category === "all" || vehicle.category === activeState.category;
    const searchableText = [
      vehicle.brand,
      vehicle.name,
      vehicle.category,
      vehicle.vehicleType,
      vehicle.powertrain,
      ...vehicle.headlineSpecifications,
      ...vehicle.specificationGroups.flatMap((group) => group.items)
    ].join(" ").toLocaleLowerCase();
    const matchesSearch = !activeState.search || searchableText.includes(activeState.search);
    return matchesFilter && matchesBrand && matchesCategory && matchesSearch;
  });
}

function renderVehicleInventory() {
  const container = document.querySelector("#vehicle-cards");
  if (!container) return;
  const vehicles = getVisibleVehicles();
  container.innerHTML = vehicles.length
    ? vehicles.map(createVehicleMarkup).join("")
    : `<div class="automobile-empty-state"><p>No vehicles found</p><span>Try another search or filter combination.</span></div>`;
  const resultCount = document.querySelector("#automobile-result-count");
  if (resultCount) resultCount.textContent = `Showing ${vehicles.length} of ${automobileInventory.length} vehicles`;
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

  document.querySelector("#vehicle-search")?.addEventListener("input", (event) => {
    activeState.search = event.currentTarget.value.trim().toLocaleLowerCase();
    renderVehicleInventory();
  });
  document.querySelector("#vehicle-category")?.addEventListener("change", (event) => {
    activeState.category = event.currentTarget.value || "all";
    renderVehicleInventory();
  });
}

function renderHeroImage() {
  const image = document.querySelector(".automobile-hero__image img");
  if (!image) return;
  const vehicle = automobileInventory.find((item) => item.hero && item.images.length)
    || automobileInventory.find((item) => item.images.length);
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
    const vehicle = findVehicleById(image.dataset.vehicleImage);
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
  if (element.dataset.typingInitialized === "true") return;
  element.dataset.typingInitialized = "true";
  const concepts = ["Electric", "Hybrid", "Extended Range", "Petrol", "Performance", "Luxury", "Off-Road"];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let timer = null;
  let wordIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  const schedule = (delay) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(tick, delay);
  };
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
      schedule(1100);
      return;
    }
    if (deleting && characterIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % concepts.length;
      schedule(250);
      return;
    }
    schedule(deleting ? 42 : 82);
  };

  if (reducedMotion.matches) {
    showStaticConcept();
    reducedMotion.addEventListener?.("change", (event) => {
      if (event.matches) showStaticConcept();
      else schedule(500);
    });
    return;
  }

  schedule(500);
  reducedMotion.addEventListener?.("change", (event) => {
    window.clearTimeout(timer);
    if (event.matches) showStaticConcept();
    else {
      deleting = false;
      characterIndex = 0;
      schedule(500);
    }
  });
}

function renderVehicleDetail(vehicle) {
  const content = document.querySelector("#vehicle-detail-content");
  const detailSection = document.querySelector("#vehicle-detail-view");
  if (!content || !detailSection) return;
  detailSection.hidden = false;

  const gallery = vehicle.images.map((image, index) => `
    <button class="automobile-detail-gallery__item" type="button" data-gallery-open="${escapeHtml(vehicle.id)}" data-gallery-index="${index}" aria-label="Open ${escapeHtml(vehicle.name)} image ${index + 1} of ${vehicle.images.length}">
      <img src="${escapeHtml(image)}" data-photo-path="${escapeHtml(image)}" alt="${escapeHtml(vehicleAlt(vehicle, index))}" loading="lazy" decoding="async">
    </button>`).join("");
  const specificationGroups = vehicle.specificationGroups.map((group) => `
    <section class="automobile-detail-specification-group" aria-labelledby="specification-${escapeHtml(vehicle.id)}-${normalizeBrandName(group.title)}">
      <h3 id="specification-${escapeHtml(vehicle.id)}-${normalizeBrandName(group.title)}">${escapeHtml(group.title)}</h3>
      <ul>${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>`).join("");
  const youtubeVideo = configuredYouTubeVideo(vehicle.youtubeVideo, `${vehicle.name} video`);
  let videoMarkup;
  if (youtubeVideo) {
    videoMarkup = youtubeFrameMarkup(youtubeVideo);
  } else if (vehicle.videos.length) {
    const video = vehicle.videos[0];
    videoMarkup = `
      <video class="automobile-detail-local-video" controls playsinline preload="none" aria-label="${escapeHtml(`${vehicle.name}: ${video.title || "Vehicle walkaround"}`)}"${vehicle.images[0] ? ` poster="${escapeHtml(vehicle.images[0])}"` : ""}>
        <source src="${escapeHtml(video.src)}" type="video/mp4">
        Video playback is not supported by this browser.
      </video>
      <p class="automobile-detail-video-fallback automobile-detail-video-error" role="status" hidden>Video unavailable. Please enquire about this vehicle.</p>`;
  } else {
    videoMarkup = `<p class="automobile-detail-video-fallback">No verified vehicle video is currently configured.</p>`;
  }
  const sourceUrl = new URL(window.location.href);
  sourceUrl.hash = `vehicle/${vehicle.id}`;
  const sourceModel = vehicle.brand === "Dongfeng" ? `${vehicle.brand} ${vehicle.name}` : vehicle.name;

  content.innerHTML = `
    <a class="automobile-detail-back" href="#vehicle-inventory">← Back to the catalogue</a>
    <header class="automobile-detail-heading">
      <p class="automobile-kicker automobile-kicker--dark"><span></span>${escapeHtml(vehicle.brand)} · ${escapeHtml(vehicle.category)}</p>
      <h1 id="automobile-detail-title" tabindex="-1">${escapeHtml(vehicle.name)}</h1>
      <p class="automobile-detail-heading__type">${escapeHtml(vehicle.vehicleType)} · ${escapeHtml(vehicle.powertrain)}</p>
      <div class="automobile-detail-heading__status"><span>${escapeHtml(vehicle.priceLabel)}</span>${createStatusMarkup(vehicle)}</div>
    </header>
    <div class="automobile-detail-gallery" aria-label="${escapeHtml(vehicle.name)} image gallery">${gallery}</div>
    <section class="automobile-detail-highlights" aria-labelledby="automobile-detail-highlights-title">
      <h2 id="automobile-detail-highlights-title">Headline specifications</h2>
      <ul>${vehicle.headlineSpecifications.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
    <div class="automobile-detail-specifications">${specificationGroups}</div>
    <section class="automobile-detail-video" aria-labelledby="automobile-detail-video-title">
      <h2 id="automobile-detail-video-title">Vehicle video</h2>
      ${videoMarkup}
    </section>
    <aside class="automobile-detail-caveats">
      <h2>Source and qualifications</h2>
      <p>Source: <cite>${escapeHtml(vehicle.source.brochure)}</cite>, identified in the brochure as supplied by ${escapeHtml(vehicle.source.publisher)} (PDF page ${vehicle.source.pdfPage}; model page ${vehicle.source.modelPage} of 13).</p>
      <p>Equipment marked with an asterisk may vary by trim and market. Specifications may change. CLTC is a test-cycle figure and may differ from real-world range.</p>
      <p>Electrony Automobile presents this information for enquiry; this listing does not claim vehicle ownership, confirmed stock, authorized-dealer status or a manufacturer partnership.</p>
    </aside>
    <p class="automobile-detail-price-note">${escapeHtml(vehicle.priceLabel)} · ${escapeHtml(vehicle.statusLabel)}</p>`;

  const detailVideo = content.querySelector(".automobile-detail-local-video");
  const videoError = content.querySelector(".automobile-detail-video-error");
  detailVideo?.addEventListener("error", () => {
    if (videoError) videoError.hidden = false;
  });
  detailVideo?.addEventListener("loadeddata", () => {
    if (videoError) videoError.hidden = true;
  });

  const form = document.querySelector("#automobile-vehicle-enquiry");
  if (form) {
    form.querySelector("#automobile-enquiry-product").value = sourceModel;
    form.querySelector("#automobile-enquiry-url").value = sourceUrl.href;
    form.querySelector("#automobile-enquiry-specifications").value = vehicle.headlineSpecifications.join("; ");
  }
  renderVehicleDetailGalleryErrors(vehicle);

  const configuredDescription = `${vehicle.name} ${vehicle.vehicleType.toLowerCase()}. ${vehicle.headlineSpecifications.slice(0, 3).join(", ")}. Request current price and confirm availability.`;
  document.title = `${vehicle.name} | Electrony Automobile`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", configuredDescription);
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", configuredDescription);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", document.title);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", configuredDescription);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", sourceUrl.href);
  document.querySelector('link[rel="canonical"]')?.setAttribute("href", sourceUrl.href);
}

function renderVehicleDetailGalleryErrors(vehicle) {
  document.querySelectorAll(".automobile-detail-gallery__item img").forEach((image) => {
    image.addEventListener("error", () => {
      image.closest(".automobile-detail-gallery__item")?.remove();
      vehicle.images = vehicle.images.filter((photo) => photo !== image.dataset.photoPath);
      renderFeaturedVehicles();
      renderVehicleInventory();
    }, { once: true });
  });
}

function renderVehicleRoute() {
  const detailSection = document.querySelector("#vehicle-detail-view");
  const detailId = window.location.hash.match(/^#vehicle\/([a-z0-9-]+)$/)?.[1] || "";
  const vehicle = automobileInventory.find((item) => item.id === detailId);
  const showDetail = Boolean(detailId);

  document.querySelectorAll("#main > section:not(#vehicle-detail-view)").forEach((section) => {
    section.hidden = showDetail;
  });
  if (detailSection) detailSection.hidden = !showDetail;
  document.body.classList.toggle("automobile-detail-active", showDetail);

  if (!showDetail) {
    const canonical = document.querySelector('link[rel="canonical"]');
    document.title = "Electrony Automobile | Source-documented vehicle catalogue";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Explore 13 source-documented NAMMI, Dongfeng, VOYAH and M-HERO vehicles. Compare powertrains, brochure specifications and request current details.");
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", "Explore 13 source-documented NAMMI, Dongfeng, VOYAH and M-HERO vehicles. Compare powertrains, brochure specifications and request current details.");
    document.querySelector('meta[name="twitter:title"]')?.setAttribute("content", document.title);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute("content", "Explore 13 source-documented NAMMI, Dongfeng, VOYAH and M-HERO vehicles. Compare powertrains, brochure specifications and request current details.");
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", "https://auto.electrony.xyz/");
    canonical?.setAttribute("href", "https://auto.electrony.xyz/");
    return;
  }

  if (vehicle) {
    renderVehicleDetail(vehicle);
  } else if (detailSection) {
    document.querySelector("#vehicle-detail-content").innerHTML = `
      <div class="automobile-empty-state">
        <h1 id="automobile-detail-title">Vehicle not found</h1>
        <p>This vehicle link may be outdated.</p>
        <a class="automobile-button automobile-button--red" href="#vehicle-inventory">Return to the catalogue</a>
      </div>`;
  }
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
  image.alt = vehicleAlt(vehicle, galleryState.index);
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
      <img src="${escapeHtml(photo)}" alt="${escapeHtml(vehicleAlt(vehicle, index))}" loading="lazy" decoding="async" data-gallery-thumbnail>
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
    const youtubeVideo = configuredYouTubeVideo(vehicle.youtubeVideo, `${vehicle.name} video`);
    videos.hidden = vehicle.videos.length === 0 && !youtubeVideo;
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
    }).join("") + (youtubeVideo ? `
      <article class="automobile-gallery__video">
        <h4>${escapeHtml(youtubeVideo.title)}</h4>
        ${youtubeFrameMarkup(youtubeVideo)}
      </article>` : "");
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
  const vehicle = findVehicleById(vehicleId);
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
  if (toggle?.dataset.navigationInitialized === "true") return;
  if (toggle) toggle.dataset.navigationInitialized = "true";
  const links = document.querySelectorAll(".automobile-nav-link");
  const mobileMenuViewport = window.matchMedia("(max-width: 64rem)");
  const sections = ["home", "vehicles", "brands", "powertrain", "rox", "contact"].map((id) => document.getElementById(id)).filter(Boolean);

  const closeMenu = (restoreFocus = false) => {
    if (!toggle || !navigation) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation menu");
    const label = toggle.querySelector(":scope > span:first-child");
    if (label) label.textContent = "Menu";
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
    const label = toggle.querySelector(":scope > span:first-child");
    if (label) label.textContent = "Close";
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

  links.forEach((link) => link.addEventListener("click", () => closeMenu(true)));
  navigation?.querySelector(".automobile-enquire-link")?.addEventListener("click", () => closeMenu(true));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") {
      closeMenu(true);
      return;
    }

    if (event.key === "Tab" && toggle?.getAttribute("aria-expanded") === "true" && navigation) {
      const focusableItems = [
        toggle,
        ...navigation.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")
      ];
      const first = focusableItems[0];
      const last = focusableItems[focusableItems.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
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
    const vehicle = findVehicleById(link.dataset.vehicleEnquiry);
    if (vehicle) {
      link.href = vehicleEnquiryUrl(vehicle);
      if (getAutomobileWhatsAppNumber()) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    }
  });

  const generalLink = document.querySelector("[data-whatsapp-general]");
  const number = getAutomobileWhatsAppNumber();
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
window.addEventListener("hashchange", renderVehicleRoute);
renderVehicleRoute();
