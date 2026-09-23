const express = require("express");
const { ObjectId } = require("mongodb");
const { db } = require("../config/db");
const { requireUser } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");
const tmdb = require("../utils/tmdb");

const router = express.Router();

// GET /api/profile — counts + recent ratings with movie posters (replaces Next.js profile page SSR)
router.get(
  "/",
  requireUser,
  asyncHandler(async (req, res) => {
    const database = await db();
    const userId = new ObjectId(req.user.id);
    const [ratings, reviewCount, watchlistCount, ratingCount] = await Promise.all([
      database.collection("ratings").find({ userId }).sort({ updatedAt: -1 }).limit(10).toArray(),
      database.collection("reviews").countDocuments({ userId }),
      database.collection("watchlist").countDocuments({ userId }),
      database.collection("ratings").countDocuments({ userId }),
    ]);
    const ratingMovies = await Promise.all(
      ratings.map(async (rating) => ({
        rating: { movieId: rating.movieId, value: rating.value, updatedAt: rating.updatedAt, createdAt: rating.createdAt },
        movie: await tmdb.getMovie(String(rating.movieId)).catch(() => null),
      }))
    );
    res.json({
      user: req.user,
      stats: { reviewCount, watchlistCount, ratingCount },
      recentRatings: ratingMovies,
    });
  })
);

module.exports = router;
