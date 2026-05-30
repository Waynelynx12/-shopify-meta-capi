const axios = require("axios");

const META_API_URL = `https://graph.facebook.com/v18.0/${process.env.META_PIXEL_ID}/events`;

async function sendCAPIEvent(eventData) {
  try {
    const response = await axios.post(META_API_URL, {
      data: [eventData],
      access_token: process.env.META_ACCESS_TOKEN,
    });

    console.log(`Meta CAPI event sent: ${eventData.event_name}`);
    console.log(`Events received: ${response.data.events_received}`);
    return response.data;
  } catch (error) {
    console.error("Meta CAPI error:", error.response?.data || error.message);
    await retryEvent(eventData);
  }
}

async function retryEvent(eventData, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    try {
      console.log(`Retrying CAPI event attempt ${i + 1}`);
      const response = await axios.post(META_API_URL, {
        data: [eventData],
        access_token: process.env.META_ACCESS_TOKEN,
      });
      console.log(`Retry successful on attempt ${i + 1}`);
      return response.data;
    } catch (error) {
      console.error(`Retry attempt ${i + 1} failed`);
    }
  }
  console.error("All retry attempts failed for CAPI event");
}

module.exports = { sendCAPIEvent };
