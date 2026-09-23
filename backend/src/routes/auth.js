const express = require("express");
const bcrypt = require("bcryptjs");
const { db, ensureIndexes } = require("../config/db");
const { createSession, destroySession, getUserFromRequest } = require("../middleware/auth");
const { asyncHandler } = require("../utils/asyncHandler");

const router = express.Router();

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
      await createSession(res, result.insertedId);
      return res.status(201).json({ ok: true });
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
    await createSession(res, user._id);
    return res.json({ ok: true });
  })
);

router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    await destroySession(req, res);
    return res.json({ ok: true });
  })
);

router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const user = await getUserFromRequest(req);
    if (!user) return res.status(401).json({ error: "Authentication required." });
    return res.json({ user });
  })
);

module.exports = router;
