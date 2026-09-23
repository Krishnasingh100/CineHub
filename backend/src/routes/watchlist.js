import express from "express";
import { ObjectId } from "mongodb";
import { db, ensureIndexes } from "../config/db.js";
import { requireUser, getUserFromRequest } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import tmdb from "../utils/movies.js";

const router = express.Router();

function validMovieId(value) {
  return typeof value === "string" && /^(tt\d+|\d+)$/.test(value) ? value : null;
}

// GET /api/watchlist — full movie objects for the logged-in user
router.get(
  "/",
  requireUser,
  asyncHandler(async (req, res) => {
    const entries = await (await db())
      .collection("watchlist")
      .find({ userId: new ObjectId(req.user.id) })
      .sort({ createdAt: -1 })
      .toArray();
    const movies = (
      await Promise.all(entries.map((e) => tmdb.getMovie(String(e.movieId)).catch(() => null)))
    ).filter(Boolean);
    res.json({ results: movies });
  })
);

// GET /api/watchlist/ids — lightweight id list (optional for client badges)
router.get(
  "/ids",
  asyncHandler(async (req, res) => {
    const user = await getUserFromRequest(req);
    if (!user) return res.json({ ids: [] });
    const entries = await (await db())
      .collection("watchlist")
      .find({ userId: new ObjectId(user.id) })
      .project({ movieId: 1 })
      .toArray();
    res.json({ ids: entries.map((e) => e.movieId) });
  })
);

router.post(
  "/:movieId",
  requireUser,
  asyncHandler(async (req, res) => {
    const movieId = validMovieId(req.params.movieId);
    if (!movieId) return res.status(400).json({ error: "Invalid movie." });
    await ensureIndexes();
    const userId = new ObjectId(req.user.id);
    await (await db())
      .collection("watchlist")
      .updateOne(
        { userId, movieId },
        { $setOnInsert: { userId, movieId, createdAt: new Date() } },
        { upsert: true }
      );
    return res.json({ ok: true });
  })
);

router.delete(
  "/:movieId",
  requireUser,
  asyncHandler(async (req, res) => {
    const movieId = validMovieId(req.params.movieId);
    if (!movieId) return res.status(400).json({ error: "Invalid movie." });
    await (await db())
      .collection("watchlist")
      .deleteOne({ userId: new ObjectId(req.user.id), movieId });
    return res.json({ ok: true });
  })
);

export default router;
