const crypto = require("crypto");
const { ObjectId } = require("mongodb");
const { db } = require("../config/db");

const COOKIE = "cinehub_session";
const SESSION_DAYS = 30;

function cookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd, // Render + Vercel are HTTPS in prod
    sameSite: isProd ? "none" : "lax", // cross-site (Vercel -> Render) needs none
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

async function createSession(res, userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  const database = await db();
  await database.collection("sessions").insertOne({
    userId: new ObjectId(userId),
    token,
    expiresAt,
    createdAt: new Date(),
  });
  res.cookie(COOKIE, token, cookieOptions());
}

async function getUserFromRequest(req) {
  const token = req.cookies?.[COOKIE];
  if (!token) return null;
  const database = await db();
  const session = await database
    .collection("sessions")
    .findOne({ token, expiresAt: { $gt: new Date() } });
  if (!session) return null;
  const user = await database
    .collection("users")
    .findOne({ _id: session.userId });
  if (!user) return null;
  return { id: user._id.toHexString(), name: user.name, email: user.email };
}

function requireUser(req, res, next) {
  getUserFromRequest(req)
    .then((user) => {
      if (!user) return res.status(401).json({ error: "Authentication required." });
      req.user = user;
      next();
    })
    .catch(next);
}

async function destroySession(req, res) {
  const token = req.cookies?.[COOKIE];
  if (token) {
    try {
      const database = await db();
      await database.collection("sessions").deleteOne({ token });
    } catch {
      // ignore cleanup errors
    }
  }
  res.clearCookie(COOKIE, { ...cookieOptions(), maxAge: undefined });
}

module.exports = { COOKIE, createSession, getUserFromRequest, requireUser, destroySession };
