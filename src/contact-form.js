function contactFieldError(field) {
  if (field.validity.valueMissing || (field.required && !field.value.trim())) return "This field is required.";
  if (field.validity.typeMismatch) return "Enter a valid email address.";
  if (field.validity.tooLong) return "This field is too long.";
  if (field.validity.rangeUnderflow || field.validity.stepMismatch || field.validity.badInput) {
    return "Enter a valid value.";
  }
  return "";
}

function updateContactFieldError(field) {
  const errorElement = document.querySelector(`#${field.id}-error`);
  const message = contactFieldError(field);
  field.setAttribute("aria-invalid", String(Boolean(message)));
  if (errorElement) errorElement.textContent = message;
  return !message;
}

function formFieldValue(form, name) {
  const field = form.elements.namedItem(name);
  return field && typeof field.value === "string" ? field.value.trim() : "";
}

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  const status = form.querySelector('[role="status"]');
  const submitButton = form.querySelector('button[type="submit"]');
  const fields = [...form.querySelectorAll("input, select, textarea")].filter((field) =>
    field.name !== "website" && field.willValidate
  );

  fields.forEach((field) => {
    const update = () => {
      if (field.getAttribute("aria-invalid") === "true") updateContactFieldError(field);
      if (status.classList.contains("is-error")) {
        status.textContent = "";
        status.classList.remove("is-error");
      }
    };
    field.addEventListener("input", update);
    field.addEventListener("change", update);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const valid = fields.map(updateContactFieldError).every(Boolean);
    status.classList.remove("is-error");
    if (!valid) {
      status.textContent = "Please correct the highlighted fields before continuing.";
      status.classList.add("is-error");
      form.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }

    const message = formFieldValue(form, "message");
    const additionalDetails = [...form.querySelectorAll("[data-message-label]")]
      .map((field) => [field.dataset.messageLabel, field.value.trim()])
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`);
    const payload = {
      page: form.dataset.contactPage,
      name: formFieldValue(form, "name"),
      email: formFieldValue(form, "email"),
      phone: formFieldValue(form, "phone"),
      company: formFieldValue(form, "company"),
      category: formFieldValue(form, "category"),
      product: formFieldValue(form, "product"),
      message: additionalDetails.length ? `${message}\n\n${additionalDetails.join("\n")}` : message,
      website: formFieldValue(form, "website")
    };

    submitButton.disabled = true;
    submitButton.setAttribute("aria-busy", "true");
    form.setAttribute("aria-busy", "true");
    status.textContent = "Sending your enquiry…";

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "same-origin"
      });
      let result = {};
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok || result.ok !== true) {
        status.textContent = typeof result.error === "string"
          ? result.error
          : "We couldn't send your enquiry right now. Please try again later.";
        status.classList.add("is-error");
        return;
      }

      status.textContent = "Your enquiry was accepted by the email provider for delivery. This does not guarantee that it reached your inbox.";
    } catch {
      status.textContent = "We couldn't connect to the enquiry service. Please try again later.";
      status.classList.add("is-error");
    } finally {
      submitButton.disabled = false;
      submitButton.removeAttribute("aria-busy");
      form.removeAttribute("aria-busy");
    }
  });
});
