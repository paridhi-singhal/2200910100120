const express = require("express");
const { loggingMiddleware } = require("../Logging_middleware/loggingMiddleware.js");
const shortUrlsRouter = require("./routes/shorturls.js");
const { loadEnv } = require("./config/env.js");

loadEnv();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(loggingMiddleware); 

// Routes
app.use("/", shortUrlsRouter);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Global error handler (catch all)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
