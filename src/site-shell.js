const whatsappGreeting = "Hello Electrony.xyz, I would like to make an enquiry.";
const whatsappNumber = String(window.ElectronyConfig?.whatsappNumber || "").replace(/\D/g, "");
function initializeBrandLogos() {
  document.querySelectorAll("[data-brand-logo]").forEach((image) => {
    const fallback = image.closest("a")?.querySelector("[data-brand-fallback]");
    const showLogo = () => {
      image.hidden = false;
      if (fallback) fallback.hidden = true;
    };
    const showFallback = () => {
      image.hidden = true;
      if (fallback) fallback.hidden = false;
    };

    image.addEventListener("load", showLogo, { once: true });
    image.addEventListener("error", showFallback, { once: true });

    if (image.complete) {
      if (image.naturalWidth > 0) showLogo();
      else showFallback();
    } else {
      image.hidden = false;
    }
  });
}

function initializeWhatsAppButton() {
  if (document.querySelector(".whatsapp-float-button")) return;

  const button = document.createElement("a");
  button.className = "whatsapp-float-button";
  button.setAttribute("aria-label", "Chat with us on WhatsApp");
  button.dataset.tooltip = "Chat with us on WhatsApp";
  button.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappGreeting)}`;
  button.target = "_blank";
  button.rel = "noopener noreferrer";

  button.innerHTML = `
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M16.14 4.5c-6.4 0-11.59 4.85-11.59 10.82 0 2.04.56 3.97 1.58 5.69L5.1 27.5l6.48-2.04a11.14 11.14 0 0 0 4.56 1.01c6.4 0 11.6-4.85 11.6-10.82S22.54 4.5 16.14 4.5Zm0 18.62c-1.53 0-3.02-.4-4.34-1.16l-.31-.18-3.81 1.2 1.19-3.57-.2-.33a8.18 8.18 0 0 1-1.18-4.34c0-4.5 3.62-8.15 8.06-8.15s8.07 3.65 8.07 8.15c0 4.5-3.62 8.15-8.07 8.15Zm4.53-6.19c-.25-.13-1.44-.71-1.66-.79-.22-.08-.38-.13-.54.13-.16.25-.62.79-.76.95-.14.16-.28.18-.53.06-.25-.13-1.05-.39-2-1.25-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.39.11-.51.11-.11.25-.28.38-.42.13-.14.17-.24.25-.4.08-.17.04-.31-.02-.43-.06-.13-.54-1.31-.74-1.8-.19-.47-.39-.41-.54-.42h-.46c-.16 0-.42.06-.64.31-.22.25-.85.83-.85 2.04s.87 2.37.99 2.53c.12.17 1.71 2.63 4.15 3.68.58.25 1.04.4 1.4.51.58.18 1.12.15 1.53.09.47-.07 1.44-.59 1.65-1.16.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.47-.29Z"></path>
    </svg>
  `;
  document.body.appendChild(button);
}

initializeBrandLogos();
initializeWhatsAppButton();
