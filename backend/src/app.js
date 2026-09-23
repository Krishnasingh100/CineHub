const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const watchlistRoutes = require("./routes/watchlist");
const profileRoutes = require("./routes/profile");
const { errorHandler, notFound } = require("./middleware/error");

function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").split(",").map((s) => s.trim()).filter(Boolean);
  app.use(
    cors({
      origin: clientUrl.length === 1 ? clientUrl[0] : clientUrl,
      credentials: true,
    })
  );

  // Basic abuse protection for auth endpoints
  const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false });
  app.use("/api/auth", authLimiter);

  app.get("/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));
  app.get("/api/health", (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

  app.use("/api/auth", authRoutes);
  app.use("/api/movies", movieRoutes);
  app.use("/api/watchlist", watchlistRoutes);
  app.use("/api/profile", profileRoutes);

  app.use("/api", notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
