const {
  CONTACT_BODY_LIMIT,
  ContactEnquiryError,
  submitContactEnquiry
} = require("../bills-api/contact-enquiries");

function getClientKey(request) {
  const forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) return forwarded.split(",")[0].trim();
  return request.socket?.remoteAddress || "unknown";
}

module.exports = async function contact(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    response.status(405).json({ ok: false, error: "Use POST to submit an enquiry." });
    return;
  }

  const contentLength = Number(request.headers["content-length"] || 0);
  if (contentLength > CONTACT_BODY_LIMIT) {
    response.status(413).json({ ok: false, error: "The enquiry is too large. Shorten it and try again." });
    return;
  }

  let payload = request.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      response.status(400).json({ ok: false, error: "Enter valid enquiry details." });
      return;
    }
  }

  try {
    await submitContactEnquiry(payload, { clientKey: getClientKey(request) });
    response.status(200).json({
      ok: true,
      message: "Your enquiry was accepted by the email provider for delivery."
    });
  } catch (error) {
    if (error instanceof ContactEnquiryError) {
      response.status(error.statusCode).json({ ok: false, error: error.message });
      return;
    }
    response.status(500).json({ ok: false, error: "We couldn't process your enquiry right now. Please try again later." });
  }
};

module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: "16kb"
    }
  }
};
