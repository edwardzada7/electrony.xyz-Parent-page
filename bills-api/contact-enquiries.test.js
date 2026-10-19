const test = require("node:test");
const assert = require("node:assert/strict");
const {
  ContactEnquiryError,
  allowContactRequest,
  submitContactEnquiry,
  validateContactEnquiry
} = require("./contact-enquiries");

const validEnquiry = {
  page: "hardware",
  name: "Casey Customer",
  email: "casey@example.org",
  phone: "",
  company: "",
  category: "computers",
  product: "Laptop enquiry",
  message: "Please share product information."
};

const configuredEnv = {
  CONTACT_EMAIL: "enquiries@example.org",
  CONTACT_FROM_EMAIL: "Electrony Enquiries <hello@verified.example.org>",
  RESEND_API_KEY: "re_test_key"
};

test("validates enquiry fields and category against the selected page", () => {
  assert.equal(validateContactEnquiry(validEnquiry).product, "Laptop enquiry");
  assert.throws(() => validateContactEnquiry({ ...validEnquiry, category: "electricity-meters" }), {
    name: "ContactEnquiryError",
    statusCode: 400
  });
  assert.throws(() => validateContactEnquiry({ ...validEnquiry, email: "not-an-email" }), {
    name: "ContactEnquiryError",
    statusCode: 400
  });
  assert.throws(() => validateContactEnquiry({ ...validEnquiry, website: "spam" }), {
    name: "ContactEnquiryError",
    statusCode: 400
  });
});

test("limits repeated contact requests and allows another request after the window", () => {
  const client = "contact-rate-limit-test";
  const start = 1_800_000_000_000;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    assert.equal(allowContactRequest(client, start), true);
  }
  assert.equal(allowContactRequest(client, start), false);
  assert.equal(allowContactRequest(client, start + 15 * 60 * 1000), true);
});

test("reports missing email settings without attempting provider delivery", async () => {
  let called = false;
  await assert.rejects(
    submitContactEnquiry(validEnquiry, {
      clientKey: "missing-config-test",
      env: {},
      fetchImpl: async () => {
        called = true;
      }
    }),
    (error) => error instanceof ContactEnquiryError
      && error.statusCode === 503
      && error.message.includes("not configured")
  );
  assert.equal(called, false);
});

test("sends a validated enquiry to Resend and accepts only a provider message id", async () => {
  let providerRequest;
  await submitContactEnquiry(validEnquiry, {
    clientKey: "provider-success-test",
    env: configuredEnv,
    fetchImpl: async (url, options) => {
      providerRequest = { url, options };
      return { ok: true, json: async () => ({ id: "email-accepted" }) };
    }
  });

  assert.equal(providerRequest.url, "https://api.resend.com/emails");
  assert.equal(providerRequest.options.headers.Authorization, "Bearer re_test_key");
  assert.equal(JSON.parse(providerRequest.options.body).to[0], "enquiries@example.org");
  assert.equal(JSON.parse(providerRequest.options.body).reply_to, validEnquiry.email);
});

test("returns a safe error when the provider refuses delivery", async () => {
  await assert.rejects(
    submitContactEnquiry(validEnquiry, {
      clientKey: "provider-failure-test",
      env: configuredEnv,
      fetchImpl: async () => ({ ok: false, json: async () => ({ message: "private provider detail" }) })
    }),
    (error) => error instanceof ContactEnquiryError
      && error.statusCode === 502
      && !error.message.includes("private provider detail")
  );
});
