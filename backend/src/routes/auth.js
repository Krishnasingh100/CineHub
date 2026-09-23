import express from "express";
import bcrypt from "bcryptjs";
import { db, ensureIndexes } from "../config/db.js";
import { signToken, requireUser } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

function publicUser(user) {
  return { id: user._id.toHexString(), name: user.name, email: user.email };
}

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const name = req.body?.name?.trim();
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;
    if (!name || name.length > 60 || !email || !/^\S+@\S+\.\S+$/.test(email) || !password || password.length < 8) {
      return res.status(400).json({ error: "Enter a name, valid email, and password of at least 8 characters." });
    }
    try {
      await ensureIndexes();
      const result = await (await db()).collection("users").insertOne({
        name,
        email,
        passwordHash: await bcrypt.hash(password, 12),
        createdAt: new Date(),
      });
      const user = { _id: result.insertedId, name, email };
      return res.status(201).json({ ok: true, token: signToken(user._id), user: publicUser(user) });
    } catch (err) {
      if (err?.code === 11000) {
        return res.status(409).json({ error: "An account with that email already exists." });
      }
      throw err;
    }
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const email = req.body?.email?.trim().toLowerCase();
    const password = req.body?.password;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    const user = await (await db()).collection("users").findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    return res.json({ ok: true, token: signToken(user._id), user: publicUser(user) });
  })
);

// Logout is client-side (the app just deletes the stored token).
router.post("/logout", (req, res) => res.json({ ok: true }));

router.get(
  "/me",
  requireUser,
  asyncHandler(async (req, res) => res.json({ user: req.user }))
);

export default router;
