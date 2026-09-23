import { MongoClient } from "mongodb";

let clientPromise;
function getClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");
  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function db() {
  const client = await getClient();
  return client.db();
}

let indexesReady;
export function ensureIndexes() {
  if (!indexesReady) {
    indexesReady = (async () => {
      const database = await db();
      await Promise.all([
        database.collection("users").createIndex({ email: 1 }, { unique: true }),
        database.collection("ratings").createIndex({ userId: 1, movieId: 1 }, { unique: true }),
        database.collection("reviews").createIndex({ movieId: 1, createdAt: -1 }),
        database.collection("reviews").createIndex({ userId: 1 }),
        database.collection("watchlist").createIndex({ userId: 1, movieId: 1 }, { unique: true }),
      ]);
    })();
  }
  return indexesReady.catch((err) => {
    indexesReady = undefined;
    throw err;
  });
}
