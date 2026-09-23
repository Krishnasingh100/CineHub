const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { db } = require("../config/db");

const TOKEN_DAYS = 30;

function secret() {
  const value = process.env.JWT_SECRET;
  if (!value) throw new Error("JWT_SECRET is not configured");
  return value;
}

// Login/signup return this token. The client stores it (localStorage)
// and sends it back as: Authorization: Bearer <token>
function signToken(userId) {
  return jwt.sign({ sub: String(userId) }, secret(), { expiresIn: `${TOKEN_DAYS}d` });
}

function tokenFromRequest(req) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme === "Bearer" && token) return token;
  return null;
}

async function userFromToken(token) {
  let payload;
  try {
    payload = jwt.verify(token, secret());
  } catch {
    return null;
  }
  if (!payload?.sub || !ObjectId.isValid(payload.sub)) return null;
  const user = await (await db())
    .collection("users")
    .findOne({ _id: new ObjectId(payload.sub) });
  if (!user) return null;
  return { id: user._id.toHexString(), name: user.name, email: user.email };
}

async function getUserFromRequest(req) {
  const token = tokenFromRequest(req);
  if (!token) return null;
  return userFromToken(token).catch(() => null);
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

module.exports = { signToken, getUserFromRequest, requireUser };
