const returnToTopButton = document.querySelector(".back-to-top[data-return-to-top]");

if (returnToTopButton) {
  const overlapsInteractiveControl = () => {
    const buttonBounds = returnToTopButton.getBoundingClientRect();

    return [...document.querySelectorAll("a[href], button, input, select, textarea")].some((element) => {
      if (element === returnToTopButton || element.disabled || element.hidden || !element.getClientRects().length) return false;
      const style = window.getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden") return false;
      const controlBounds = element.getBoundingClientRect();
      return controlBounds.left < buttonBounds.right
        && controlBounds.right > buttonBounds.left
        && controlBounds.top < buttonBounds.bottom
        && controlBounds.bottom > buttonBounds.top;
    });
  };

  const updateVisibility = () => {
    const isVisible = window.scrollY > 520 && !overlapsInteractiveControl();
    returnToTopButton.classList.toggle("is-visible", isVisible);
    if (!isVisible && document.activeElement === returnToTopButton) returnToTopButton.blur();
  };

  updateVisibility();
  window.addEventListener("scroll", updateVisibility, { passive: true });
  window.addEventListener("resize", updateVisibility, { passive: true });
  returnToTopButton.addEventListener("click", () => {
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });
}
