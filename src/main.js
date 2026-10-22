const menuToggle = document.querySelector(".menu-toggle");
const primaryNavigation = document.querySelector(".primary-navigation");
const header = document.querySelector(".site-header");
const contactLinks = document.querySelectorAll(".contact-link");
const contactUrl = window.ElectronyConfig.contactUrl;
const productLinks = window.ElectronyConfig.productLinks;
const backToTopButton = document.querySelector(".back-to-top");
const primaryNavLinks = document.querySelectorAll(".navigation-list a");
const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setSafeLink(link, url) {
  const isDisabled = !url;
  link.classList.toggle("is-disabled", isDisabled);

  if (isDisabled) {
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("tabindex", "-1");
    link.removeAttribute("href");
    return;
  }

  link.href = url;
  link.removeAttribute("aria-disabled");
  link.removeAttribute("tabindex");
}

function setHeaderState() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function initHeroTypingEffect() {
  const heroTitle = document.getElementById("hero-title");
  const heroTyping = document.querySelector("[data-hero-typing]");
  if (!heroTitle || !heroTyping) return;

  const phrases = ["What's Next", "Smart Living", "Digital Commerce", "Clean Energy", "Electric Mobility", "Connected Communities", "Everyday Technology"];
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    heroTyping.textContent = phrases[0];
    heroTitle.setAttribute("aria-label", `Technology for ${phrases[0]}`);
    heroTyping.setAttribute("aria-hidden", "true");
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const tick = () => {
    const phrase = phrases[phraseIndex];

    if (!deleting) {
      charIndex += 1;
      heroTyping.textContent = phrase.slice(0, charIndex);

      if (charIndex === phrase.length) {
        deleting = true;
        window.setTimeout(tick, 1200);
        return;
      }
    } else {
      charIndex -= 1;
      heroTyping.textContent = phrase.slice(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        window.setTimeout(tick, 280);
        return;
      }
    }

    window.setTimeout(tick, deleting ? 35 : 90);
  };

  heroTitle.setAttribute("aria-label", `Technology for ${phrases[0]}`);
  heroTyping.textContent = phrases[0];
  window.setTimeout(tick, 500);
}

function activatePrimaryNav(currentId) {
  if (!primaryNavLinks.length) return;

  primaryNavLinks.forEach((link) => {
    const matches = link.getAttribute("href") === `#${currentId}` || link.dataset.section === currentId;
    link.classList.toggle("is-active", matches);

    if (matches) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function closeMenu() {
  if (!menuToggle || !primaryNavigation) return;
  menuToggle.setAttribute("aria-expanded", "false");
  primaryNavigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuToggle && primaryNavigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    primaryNavigation.classList.toggle("is-open", !isExpanded);
    document.body.classList.toggle("menu-open", !isExpanded);
  });

  primaryNavigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle && menuToggle.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuToggle.focus();
  }
});

contactLinks.forEach((link) => {
  setSafeLink(link, contactUrl);
});

document.querySelectorAll("[data-product-link]").forEach((link) => {
  const product = productLinks[link.dataset.productLink];
  setSafeLink(link, product.landingPageUrl);
});

if (window.matchMedia) {
  window.matchMedia("(min-width: 48.001rem)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

const mainSections = ["software", "hardware", "energy", "mobility", "company"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (mainSections.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry) {
        activatePrimaryNav(visibleEntry.target.id);
      }
    },
    {
      rootMargin: "-30% 0px -42% 0px",
      threshold: [0.2, 0.5]
    }
  );

  mainSections.forEach((section) => observer.observe(section));
} else if (mainSections.length) {
  activatePrimaryNav(mainSections[0].id);
}

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

if (backToTopButton) {
  const overlapsInteractiveControl = () => {
    const buttonBounds = backToTopButton.getBoundingClientRect();

    return [...document.querySelectorAll("a[href], button, input, select, textarea")].some((element) => {
      if (element === backToTopButton || element.disabled || element.hidden || !element.getClientRects().length) return false;
      const style = window.getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden") return false;
      const controlBounds = element.getBoundingClientRect();
      return controlBounds.left < buttonBounds.right
        && controlBounds.right > buttonBounds.left
        && controlBounds.top < buttonBounds.bottom
        && controlBounds.bottom > buttonBounds.top;
    });
  };

  const toggleBackToTop = () => {
    const isVisible = window.scrollY > 520 && !overlapsInteractiveControl();
    backToTopButton.classList.toggle("is-visible", isVisible);
    if (!isVisible && document.activeElement === backToTopButton) backToTopButton.blur();
  };

  toggleBackToTop();
  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  window.addEventListener("resize", toggleBackToTop, { passive: true });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
}

function getProductStatusText(product) {
  const status = String(product.status || "").toLowerCase();

  if (["conceptual", "prototype"].includes(status) || status.includes("soon")) return "PROTOTYPE";
  if (["live", "active"].includes(status)) return "LIVE";
  return status ? status.toUpperCase() : "LIVE";
}

function getProductCtaText(product) {
  if (product.ctaLabel) return product.ctaLabel;
  return "Explore";
}

function getProductVisualMarkup(product) {
  if (product.id === "electronyos") {
    return `
      <div class="product-visual product-visual-electronyos" aria-hidden="true">
        <span class="product-visual-node product-visual-node-one"></span>
        <span class="product-visual-node product-visual-node-two"></span>
        <span class="product-visual-node product-visual-node-three"></span>
        <span class="product-visual-node product-visual-node-four"></span>
        <span class="product-visual-building"></span>
        <span class="product-visual-rail"></span>
      </div>
    `;
  }

  if (product.id === "bills") {
    return `
      <div class="product-visual product-visual-bills" aria-hidden="true">
        <span class="product-bill-card product-bill-card-one"></span>
        <span class="product-bill-card product-bill-card-two"></span>
        <span class="product-bill-card product-bill-card-three"></span>
        <span class="product-bill-ring"></span>
      </div>
    `;
  }

  return `
    <div class="product-visual product-visual-istylist" aria-hidden="true">
      <span class="product-visual-orbit"></span>
      <span class="product-visual-orbit product-visual-orbit-small"></span>
      <span class="product-visual-node product-visual-node-istylist-one"></span>
      <span class="product-visual-node product-visual-node-istylist-two"></span>
      <span class="product-visual-node product-visual-node-istylist-three"></span>
    </div>
  `;
}

function renderSoftwareProducts() {
  const softwareList = document.querySelector("#software-products");
  if (!softwareList) return;

  const softwareProducts = window.ElectronyProducts.filter((product) => product.category === "Software");

  softwareProducts.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    if (product.featured) card.classList.add("is-featured");
    card.style.setProperty("--card-accent", product.accentColor || "var(--color-product-default)");

    const statusText = getProductStatusText(product);
    const actionUrl = product.appUrl || product.landingPageUrl;
    const ctaText = getProductCtaText(product);

    card.innerHTML = `
      <div class="product-card-header">
        <span class="badge">${product.eyebrow}</span>
        <span class="product-status">${statusText}</span>
      </div>
      ${getProductVisualMarkup(product)}
      <div class="product-card-body">
        <p class="product-category-label">${product.categoryLabel}</p>
        <h3>${product.heading}</h3>
        <p>${product.description}</p>
      </div>
      <div class="product-card-footer">
        <a class="text-link product-link" href="">${ctaText}</a>
      </div>
    `;

    const link = card.querySelector(".product-link");
    setSafeLink(link, actionUrl);

    if (!actionUrl) {
      link.textContent = ctaText;
      link.setAttribute("aria-disabled", "true");
    }

    softwareList.appendChild(card);
  });
}

function renderSpotlightLink() {
  const spotlightLink = document.querySelector("#electronyos-spotlight-link");
  if (!spotlightLink) return;

  const electronyos = productLinks.electronyos;
  setSafeLink(spotlightLink, electronyos.landingPageUrl || electronyos.appUrl || null);
}

initHeroTypingEffect();
renderSoftwareProducts();
renderSpotlightLink();