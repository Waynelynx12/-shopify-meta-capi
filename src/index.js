require("dotenv").config();
const express = require("express");
const app = express();

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString("utf8");
    },
  })
);

const capiRoutes = require("./src/routes");
app.use("/api", capiRoutes);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "online",
    service: "Shopify Meta CAPI Integration",
    pixel_id: process.env.META_PIXEL_ID,
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Meta CAPI server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
