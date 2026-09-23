require("dotenv").config();
const { createApp } = require("./app");
const { ensureIndexes } = require("./config/db");

const PORT = Number(process.env.PORT || 5000);
const app = createApp();

async function start() {
  try {
    if (process.env.MONGODB_URI) {
      await ensureIndexes();
      console.log("MongoDB indexes ready");
    } else {
      console.warn("MONGODB_URI missing — API will fail until it is set.");
    }
  } catch (err) {
    console.error("Failed to prepare MongoDB indexes:", err.message);
  }
  app.listen(PORT, () => console.log(`CineHub API listening on :${PORT}`));
}

start();
