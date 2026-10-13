const quoteForm = document.querySelector("#energy-quote-form");
const quoteFormStatus = document.querySelector("#energy-form-status");
const categorySelect = document.querySelector("#energy-category");
const customerTypeSelect = document.querySelector("#energy-customer-type");

function selectQuoteOptions(link) {
  if (link.dataset.quoteCategory) categorySelect.value = link.dataset.quoteCategory;
  if (link.dataset.enquiryType) customerTypeSelect.value = link.dataset.enquiryType;
}

document.querySelectorAll("[data-quote-category], [data-enquiry-type]").forEach((link) => {
  link.addEventListener("click", () => selectQuoteOptions(link));
});

function errorFor(field) {
  if (!field.value.trim()) return "This field is required.";
  if (field.validity.typeMismatch) return "Enter a valid email address.";
  return "";
}

function updateFieldError(field) {
  const error = document.querySelector(`#${field.id}-error`);
  if (!error) return field.checkValidity();

  const message = field.checkValidity() && field.value.trim() ? "" : errorFor(field);
  error.textContent = message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}

if (quoteForm && quoteFormStatus) {
  const requiredFields = [...quoteForm.querySelectorAll("[required]")];

  requiredFields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") updateFieldError(field);
      if ([...requiredFields].every((requiredField) =>
        requiredField.checkValidity() && requiredField.value.trim()
      )) {
        quoteFormStatus.textContent = "";
        quoteFormStatus.classList.remove("is-error");
      }
    });
    field.addEventListener("change", () => {
      if (field.getAttribute("aria-invalid") === "true") updateFieldError(field);
    });
  });

  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const isValid = requiredFields.map(updateFieldError).every(Boolean);
    quoteFormStatus.classList.remove("is-error");

    if (!isValid) {
      quoteFormStatus.textContent = "Please correct the highlighted fields before continuing.";
      quoteFormStatus.classList.add("is-error");
      quoteForm.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    quoteFormStatus.textContent = "Your enquiry has not been sent. A secure enquiry service is not configured; the details remain in this form.";
    quoteFormStatus.classList.add("is-error");
  });
}
