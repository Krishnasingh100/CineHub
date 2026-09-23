import express from "express";
import { ObjectId } from "mongodb";
import { db } from "../config/db.js";
import { requireUser } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import tmdb from "../utils/movies.js";

const router = express.Router();

// GET /api/profile — counts + recent ratings with movie posters
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

export default router;
