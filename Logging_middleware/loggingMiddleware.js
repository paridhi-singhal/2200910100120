// src/middleware/loggingMiddleware.js
const axios = require("axios");
const { EVAL_API_KEY } = require("../Backend_test_submission/config/env");

async function loggingMiddleware(req, res, next) {
  const logEntry = {
    service: "url-shortener",
    method: req.method,
    endpoint: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent") || "unknown",
    timestamp: new Date().toISOString()
  };

  try {
    await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      logEntry,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${EVAL_API_KEY}`
        }
      }
    );
  } catch (err) {
    console.error("Logging service error:", err.response?.status || err.message);
  }

  next();
}

// 🔹 Manual log function for use in routes
async function Log(stack, level, package, message) {
  const logEntry = {
    stack,
    level,
    package,
    message,
    timestamp: new Date().toISOString()
  };

  try {
    await axios.post(
      "http://20.244.56.144/evaluation-service/logs",
      logEntry,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${EVAL_API_KEY}`
        }
      }
    );
  } catch (err) {
    console.error("Manual log error:", err.response?.status || err.message);
  }
}

module.exports = { loggingMiddleware, Log };
