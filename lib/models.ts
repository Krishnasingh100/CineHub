import "server-only";
import { db } from "@/lib/db";

let indexesReady: Promise<void> | undefined;
export function ensureIndexes() {
  if (!indexesReady) indexesReady = (async () => {
    const database = await db();
    await Promise.all([
      database.collection("users").createIndex({ email: 1 }, { unique: true }),
      database.collection("sessions").createIndex({ token: 1 }, { unique: true }),
      database.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      database.collection("ratings").createIndex({ userId: 1, movieId: 1 }, { unique: true }),
      database.collection("reviews").createIndex({ movieId: 1, createdAt: -1 }),
      database.collection("reviews").createIndex({ userId: 1 }),
      database.collection("watchlist").createIndex({ userId: 1, movieId: 1 }, { unique: true }),
    ]);
  })();
  return indexesReady;
}
