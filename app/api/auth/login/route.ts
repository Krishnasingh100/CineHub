import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { ObjectId } from "mongodb";
export async function POST(request: Request) { const body = await request.json().catch(() => null) as { email?: string; password?: string } | null; const email = body?.email?.trim().toLowerCase(); if (!email || !body?.password) return Response.json({ error: "Email and password are required." }, { status: 400 }); const user = await (await db()).collection<{ _id: ObjectId; passwordHash: string }>("users").findOne({ email }); if (!user || !await bcrypt.compare(body.password, user.passwordHash)) return Response.json({ error: "Invalid email or password." }, { status: 401 }); await createSession(user._id); return Response.json({ ok: true }); }
