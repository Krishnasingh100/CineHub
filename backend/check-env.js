// Checks backend/.env connections: MongoDB + OMDB. Prints OK/FAIL only (never secrets).
// Run: node check-env.js
import "dotenv/config";
import { MongoClient } from "mongodb";

const results = {};

try {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing in backend/.env");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  await client.connect();
  await client.db().command({ ping: 1 });
  results.mongodb = "OK — connected + ping";
  await client.close();
} catch (e) {
  results.mongodb = `FAIL — ${(e.code ? `${e.code} ` : "") + String(e.message).split("\n")[0]}`;
}

try {
  const omdbKey = process.env.OMDB_API_KEY;
  if (!omdbKey) throw new Error("OMDB_API_KEY missing in backend/.env");
  const res = await fetch(`https://www.omdbapi.com/?apikey=${omdbKey.trim()}&s=batman`);
  const body = await res.json();
  results.omdb = body.Response === "True"
    ? `OK — search works (${body.totalResults} results for "batman")`
    : `FAIL — ${body.Error || "unknown error"}`;
} catch (e) {
  results.omdb = `FAIL — ${String(e.message).split("\n")[0]}`;
}

console.log(JSON.stringify(results, null, 2));
