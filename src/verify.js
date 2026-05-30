const crypto = require("crypto");

function verifyShopifyWebhook(req) {
  const hmac = req.headers["x-shopify-hmac-sha256"];
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  const body = req.rawBody;

  if (!hmac || !secret || !body) return false;

  const hash = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");

  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(hmac)
  );
}

module.exports = { verifyShopifyWebhook };
