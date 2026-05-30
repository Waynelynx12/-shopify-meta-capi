const { hashUserData } = require("./hash");
const { sendCAPIEvent } = require("./capi");

async function trackPurchase(order) {
  const customer = order.customer || {};
  const address = order.billing_address || {};

  const eventData = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: `order_${order.id}`,
    event_source_url: `https://${process.env.SHOPIFY_SHOP_NAME}.myshopify.com`,
    action_source: "website",
    user_data: hashUserData({
      email: customer.email,
      phone: customer.phone,
      first_name: customer.first_name,
      last_name: customer.last_name,
      city: address.city,
      province_code: address.province_code,
      zip: address.zip,
      country_code: address.country_code,
    }),
    custom_data: {
      currency: order.currency,
      value: order.total_price,
      order_id: String(order.id),
      content_type: "product",
      num_items: order.line_items?.length,
    },
  };

  await sendCAPIEvent(eventData);
}

async function trackPageView(data) {
  const eventData = {
    event_name: "PageView",
    event_time: Math.floor(Date.now() / 1000),
    event_id: `pageview_${Date.now()}`,
    event_source_url: data.url,
    action_source: "website",
    user_data: {
      client_ip_address: data.ip,
      client_user_agent: data.userAgent,
    },
  };

  await sendCAPIEvent(eventData);
}

module.exports = { trackPurchase, trackPageView };
