import "server-only";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { db } from "@/lib/db";

const COOKIE = "cinehub_session";
const SESSION_DAYS = 30;
export type SessionUser = { id: string; name: string; email: string };

export async function createSession(userId: ObjectId) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);
  const database = await db();
  await database.collection("sessions").insertOne({ userId, token, expiresAt, createdAt: new Date() });
  const store = await cookies();
  store.set(COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", expires: expiresAt, path: "/" });
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const database = await db();
  const session = await database.collection<{ userId: ObjectId; expiresAt: Date }>("sessions").findOne({ token, expiresAt: { $gt: new Date() } });
  if (!session) return null;
  const user = await database.collection<{ _id: ObjectId; name: string; email: string }>("users").findOne({ _id: session.userId });
  return user ? { id: user._id.toHexString(), name: user.name, email: user.email } : null;
}

export async function requireUser() { const user = await getCurrentUser(); if (!user) throw new Error("UNAUTHORIZED"); return user; }
export async function destroySession() { const store = await cookies(); const token = store.get(COOKIE)?.value; if (token) (await db()).collection("sessions").deleteOne({ token }); store.delete(COOKIE); }
