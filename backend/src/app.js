import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";
import watchlistRoutes from "./routes/watchlist.js";
import profileRoutes from "./routes/profile.js";
import { errorHandler, notFound } from "./middleware/error.js";

export function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(express.json({ limit: "100kb" }));

  const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").split(",").map((s) => s.trim()).filter(Boolean);
  // No cookies used — the client sends Authorization: Bearer <token>, so no credentials flag needed.
  app.use(
    cors({
      origin: clientUrl.length === 1 ? clientUrl[0] : clientUrl,
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
