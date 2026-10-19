const CONTACT_BODY_LIMIT = 16 * 1024;
const CONTACT_RATE_WINDOW_MS = 15 * 60 * 1000;
const CONTACT_RATE_LIMIT = 5;
const CONTACT_RATE_LIMITS = new Map();

const CONTACT_CATEGORIES = Object.freeze({
  hardware: new Set([
    "consumer-electronics",
    "appliances",
    "electrical-power",
    "computers",
    "cars-mobility",
    "solar-energy",
    "other"
  ]),
  energy: new Set([
    "solar-panels",
    "solar-inverters",
    "batteries-storage",
    "complete-systems",
    "transformers",
    "electricity-meters",
    "cables-accessories",
    "custom-project"
  ])
});

class ContactEnquiryError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "ContactEnquiryError";
    this.statusCode = statusCode;
  }
}

function boundedText(value, field, maxLength, required = false) {
  if (typeof value !== "string") {
    if (!required && (value === undefined || value === null)) return "";
    throw new ContactEnquiryError(400, `Enter a valid ${field}.`);
  }

  const text = value.trim();
  if (required && !text) throw new ContactEnquiryError(400, `Enter a ${field}.`);
  if (text.length > maxLength) throw new ContactEnquiryError(400, `${field} must be ${maxLength} characters or fewer.`);
  return text;
}

function isValidEmail(value) {
  return value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}

function getSenderAddress(value) {
  if (typeof value !== "string" || /[\r\n]/.test(value)) return "";
  const match = value.match(/<([^<>]+)>$/);
  const address = (match ? match[1] : value).trim();
  return isValidEmail(address) ? address : "";
}

function validateContactEnquiry(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ContactEnquiryError(400, "Enter valid enquiry details.");
  }
  if (typeof value.website !== "string" && value.website !== undefined) {
    throw new ContactEnquiryError(400, "Unable to process this enquiry.");
  }
  if (value.website && value.website.trim()) {
    throw new ContactEnquiryError(400, "Unable to process this enquiry.");
  }

  const page = boundedText(value.page, "page", 20, true);
  if (!Object.hasOwn(CONTACT_CATEGORIES, page)) {
    throw new ContactEnquiryError(400, "Select a valid enquiry page.");
  }

  const name = boundedText(value.name, "full name", 100, true);
  const email = boundedText(value.email, "email address", 254, true);
  if (!isValidEmail(email)) throw new ContactEnquiryError(400, "Enter a valid email address.");

  const category = boundedText(value.category, "category", 60, true);
  if (!CONTACT_CATEGORIES[page].has(category)) {
    throw new ContactEnquiryError(400, "Select a valid product or project category.");
  }

  return {
    page,
    name,
    email,
    phone: boundedText(value.phone, "phone number", 50),
    company: boundedText(value.company, "company name", 120),
    category,
    product: boundedText(value.product, "product or solution of interest", 160, true),
    message: boundedText(value.message, "enquiry message", 5000, true)
  };
}

function allowContactRequest(clientKey, now = Date.now()) {
  const key = String(clientKey || "unknown").slice(0, 120);
  const previous = CONTACT_RATE_LIMITS.get(key);
  if (previous && previous.resetAt > now && previous.count >= CONTACT_RATE_LIMIT) return false;
  if (!previous || previous.resetAt <= now) {
    CONTACT_RATE_LIMITS.set(key, { count: 1, resetAt: now + CONTACT_RATE_WINDOW_MS });
  } else {
    previous.count += 1;
  }

  if (CONTACT_RATE_LIMITS.size > 1000) {
    for (const [storedKey, entry] of CONTACT_RATE_LIMITS) {
      if (entry.resetAt <= now) CONTACT_RATE_LIMITS.delete(storedKey);
    }
    while (CONTACT_RATE_LIMITS.size > 1000) {
      CONTACT_RATE_LIMITS.delete(CONTACT_RATE_LIMITS.keys().next().value);
    }
  }
  return true;
}

async function submitContactEnquiry(value, {
  clientKey = "unknown",
  env = process.env,
  fetchImpl = globalThis.fetch
} = {}) {
  if (!allowContactRequest(clientKey)) {
    throw new ContactEnquiryError(429, "Too many enquiries. Please try again later.");
  }

  const enquiry = validateContactEnquiry(value);
  const recipient = String(env.CONTACT_EMAIL || "").trim();
  const sender = String(env.CONTACT_FROM_EMAIL || "").trim();
  const apiKey = String(env.RESEND_API_KEY || "").trim();
  if (!isValidEmail(recipient)
    || !getSenderAddress(sender)
    || !apiKey
    || /replace_with|example\.com/i.test(`${recipient} ${sender} ${apiKey}`)) {
    throw new ContactEnquiryError(503, "Enquiry email is not configured. Please contact the site administrator.");
  }

  if (typeof fetchImpl !== "function") {
    throw new ContactEnquiryError(503, "The enquiry email service is unavailable. Please try again later.");
  }

  const title = enquiry.page === "hardware" ? "Hardware" : "Energy";
  const lines = [
    `New Electrony ${title} enquiry`,
    "",
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone || "Not provided"}`,
    `Company: ${enquiry.company || "Not provided"}`,
    `Category: ${enquiry.category}`,
    `Product or solution: ${enquiry.product}`,
    "",
    "Message:",
    enquiry.message
  ];
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetchImpl("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: enquiry.email,
        subject: `Electrony ${title} enquiry`,
        text: lines.join("\n")
      }),
      signal: controller.signal
    });
    let providerResult;
    try {
      providerResult = await response.json();
    } catch {
      providerResult = null;
    }
    if (!response.ok || !providerResult || typeof providerResult.id !== "string" || !providerResult.id) {
      throw new ContactEnquiryError(502, "We couldn't send your enquiry right now. Please try again later.");
    }
  } catch (error) {
    if (error instanceof ContactEnquiryError) throw error;
    throw new ContactEnquiryError(502, "We couldn't send your enquiry right now. Please try again later.");
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = {
  CONTACT_BODY_LIMIT,
  ContactEnquiryError,
  allowContactRequest,
  submitContactEnquiry,
  validateContactEnquiry
};
