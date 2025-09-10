const express = require("express");
const { generateShortcode } = require("../utils/shortcode.js");
const urlStore = require("../data/store.js");
const { Log } = require("../middleware/loggingMiddleware.js");

const router = express.Router();

// Create short URL
router.post("/shorturls", async (req, res) => {
  try {
    const { url, shortcode } = req.body;

    if (!url || typeof url !== "string") {
      await Log("backend", "error", "handler", "Missing or invalid URL");
      return res.status(400).json({ error: "Missing or invalid URL" });
    }

    let code = shortcode;
    if (!code) {
      code = generateShortcode();
    } else if (urlStore[code]) {
      await Log("backend", "error", "handler", "Shortcode already exists");
      return res.status(409).json({ error: "Shortcode already in use" });
    }

    urlStore[code] = { originalUrl: url, clicks: 0, createdAt: new Date() };

    res.status(201).json({
      shortLink: `${process.env.HOSTNAME}/${code}`,
      shortcode: code
    });
  } catch (err) {
    await Log("backend", "fatal", "handler", `Server crash: ${err.message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get stats
router.get("/shorturls/:shortcode", (req, res) => {
  const { shortcode } = req.params;
  const entry = urlStore[shortcode];

  if (!entry) {
    return res.status(404).json({ error: "Shortcode not found" });
  }

  res.json({
    shortcode,
    originalUrl: entry.originalUrl,
    clicks: entry.clicks,
    createdAt: entry.createdAt
  });
});

// Redirect
router.get("/:shortcode", (req, res) => {
  const { shortcode } = req.params;
  const entry = urlStore[shortcode];

  if (!entry) {
    return res.status(404).json({ error: "Shortcode not found" });
  }

  entry.clicks++;
  res.redirect(entry.originalUrl);
});

module.exports = router;
