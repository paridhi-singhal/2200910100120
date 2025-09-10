const dotenv = require("dotenv");

function loadEnv() {
  dotenv.config();

  if (!process.env.HOSTNAME) {
    process.env.HOSTNAME = `http://localhost:${process.env.PORT || 3000}`;
  }
}

module.exports = { loadEnv };
