const express = require("express");
const router = express.Router();
const { verifyShopifyWebhook } = require("./verify");
const { trackPurchase } = require("./events");

router.post("/webhooks/orders-paid", async (req, res) => {
  try {
    const isValid = verifyShopifyWebhook(req);

    if (!isValid) {
      console.warn("Invalid webhook signature");
      return res.status(401).json({
        error: "Unauthorized: Invalid webhook signature",
      });
    }

    const order = req.body;
    console.log(`Processing CAPI event for order: #${order.order_number}`);

    await trackPurchase(order);

    res.status(200).json({
      success: true,
      message: `CAPI Purchase event sent for order #${order.order_number}`,
    });
  } catch (error) {
    console.error("CAPI route error:", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.post("/pageview", async (req, res) => {
  try {
    const { url, ip, userAgent } = req.body;
    await trackPageView({ url, ip, userAgent });
    res.status(200).json({
      success: true,
      message: "PageView event sent to Meta CAPI",
    });
  } catch (error) {
    console.error("PageView CAPI error:", error.message);
    res.status(500).json({
      error: "Internal server error",
    });
  }
});

module.exports = router;
