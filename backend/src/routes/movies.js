const express = require("express");
const { ObjectId } = require("mongodb");
const { db, ensureIndexes } = require("../config/db");
const { requireUser } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const tmdb = require("../utils/tmdb");

const router = express.Router();
const CATEGORIES = new Set(["popular", "now_playing", "upcoming", "top_rated"]);

function validPage(value) {
  const page = Number(value ?? "1");
  return Number.isSafeInteger(page) && page >= 1 ? page : null;
}

// GET /api/movies/home — one call for the React home page (5 sections in parallel server-side)
router.get(
  "/home",
  asyncHandler(async (req, res) => {
    const [trending, popular, latest, upcoming, rated] = await Promise.all([
      tmdb.getTrending().catch(() => null),
      tmdb.getMovies("popular").catch(() => null),
      tmdb.getMovies("now_playing").catch(() => null),
      tmdb.getMovies("upcoming").catch(() => null),
      tmdb.getMovies("top_rated").catch(() => null),
    ]);
    res.json({ trending, popular, latest, upcoming, rated });
  })
);

// GET /api/movies/trending?page=1
router.get(
  "/trending",
  asyncHandler(async (req, res) => {
    const page = validPage(req.query.page);
    if (!page) return res.status(400).json({ error: "Invalid page." });
    try {
      res.json(await tmdb.getTrending(page));
    } catch {
      res.status(502).json({ error: "Unable to load movies." });
    }
  })
);

// GET /api/movies/category/:name?page=1  (popular | now_playing | upcoming | top_rated)
router.get(
  "/category/:name",
  asyncHandler(async (req, res) => {
    const { name } = req.params;
    const page = validPage(req.query.page);
    if (!CATEGORIES.has(name) || !page) return res.status(400).json({ error: "Invalid request." });
    try {
      res.json(await tmdb.getMovies(name, page));
    } catch {
      res.status(502).json({ error: "Unable to load movies." });
    }
  })
);

// GET /api/movies/search?q=...&page=1
router.get(
  "/search",
  asyncHandler(async (req, res) => {
    const q = String(req.query.q || "").trim();
    const page = validPage(req.query.page);
    if (!q || !page) return res.status(400).json({ error: "Search query is required." });
    try {
      res.json(await tmdb.searchMovies(q, page));
    } catch {
      res.status(502).json({ error: "Unable to search movies." });
    }
  })
);

// GET /api/movies/genres
router.get(
  "/genres",
  asyncHandler(async (req, res) => {
    try {
      res.json({ genres: await tmdb.getGenres() });
    } catch {
      res.status(502).json({ error: "Unable to load genres." });
    }
  })
);

// GET /api/movies/genres/:id?page=1
router.get(
  "/genres/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const page = validPage(req.query.page);
    if (!/^\d+$/.test(id) || !page) return res.status(400).json({ error: "Invalid request." });
    try {
      const [results, genres] = await Promise.all([tmdb.getByGenre(id, page), tmdb.getGenres()]);
      const name = genres.find((g) => g.id === Number(id))?.name || "Genre";
      res.json({ ...results, genreName: name });
    } catch {
      res.status(502).json({ error: "Unable to load movies." });
    }
  })
);

// GET /api/movies/:id — detail + providers + user state + community rating
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!/^\d+$/.test(id)) return res.status(400).json({ error: "Invalid movie." });
    const movieId = Number(id);
    let movie;
    try {
      movie = await tmdb.getMovie(id);
    } catch {
      return res.status(404).json({ error: "Movie not found." });
    }
    const { getUserFromRequest } = require("../middleware/auth");
    const user = await getUserFromRequest(req).catch(() => null);
    const database = await db();
    const [providers, state, community] = await Promise.all([
      tmdb.getProviders(id).catch(() => null),
      user
        ? Promise.all([
            database.collection("watchlist").findOne({ userId: new ObjectId(user.id), movieId }),
            database.collection("ratings").findOne({ userId: new ObjectId(user.id), movieId }),
          ])
        : Promise.resolve([null, null]),
      database
        .collection("ratings")
        .aggregate([{ $match: { movieId } }, { $group: { _id: null, average: { $avg: "$value" }, count: { $sum: 1 } } }])
        .toArray(),
    ]);
    const [watchlistItem, userRating] = state;
    res.json({
      movie,
      providers,
      signedIn: Boolean(user),
      inWatchlist: Boolean(watchlistItem),
      rating: userRating?.value,
      community: community[0] || null,
    });
  })
);

// PUT /api/movies/:id/rating — { value: 1..10 }
router.put(
  "/:id/rating",
  requireUser,
  asyncHandler(async (req, res) => {
    const movieId = Number(req.params.id);
    const value = req.body?.value;
    if (!Number.isSafeInteger(movieId) || typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 10) {
      return res.status(400).json({ error: "Rating must be an integer from 1 to 10." });
    }
    await ensureIndexes();
    const userId = new ObjectId(req.user.id);
    await (await db()).collection("ratings").updateOne(
      { userId, movieId },
      { $set: { value, updatedAt: new Date() }, $setOnInsert: { userId, movieId, createdAt: new Date() } },
      { upsert: true }
    );
    return res.json({ ok: true });
  })
);

module.exports = router;
