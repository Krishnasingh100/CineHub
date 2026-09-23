// Movie catalogue adapter backed by OMDB (http://www.omdbapi.com).
// Same exports the routes expect, TMDB-shaped objects out.
// OMDB free tier = 1000 req/day, so detail responses are cached in memory for 1 hour.
const OMDB = "https://www.omdbapi.com/";

const CACHE_TTL = 60 * 60 * 1000;
const cache = new Map();

function key() {
  const value = process.env.OMDB_API_KEY;
  if (!value) throw new Error("OMDB_API_KEY is not configured");
  return value.trim();
}

function cached(name, fn) {
  return async (...args) => {
    const cacheKey = `${name}:${args.join("|")}`;
    const hit = cache.get(cacheKey);
    if (hit && Date.now() - hit.time < CACHE_TTL) return hit.data;
    const data = await fn(...args);
    cache.set(cacheKey, { time: Date.now(), data });
    return data;
  };
}

async function omdb(params) {
  const search = new URLSearchParams({ apikey: key(), ...params });
  const res = await fetch(`${OMDB}?${search}`);
  if (!res.ok) throw new Error(`OMDB request failed (${res.status})`);
  const body = await res.json();
  if (body.Response !== "True") throw new Error(body.Error || "OMDB error");
  return body;
}

const poster = (p) => (p && p !== "N/A" ? p : null);

function mapBrief(item) {
  return {
    id: item.imdbID,
    title: item.Title,
    overview: "",
    poster_path: poster(item.Poster),
    backdrop_path: null,
    release_date: item.Year || "",
    vote_average: 0,
    vote_count: 0,
    genre_ids: [],
  };
}

function parseRuntime(runtime) {
  const m = /(\d+)\s*min/i.exec(runtime || "");
  return m ? Number(m[1]) : null;
}

function mapDetail(d) {
  const rating = parseFloat(d.imdbRating);
  const votes = parseInt(String(d.imdbVotes || "").replace(/,/g, ""), 10);
  const cast = (d.Actors && d.Actors !== "N/A" ? d.Actors.split(", ") : []).map((name, i) => ({
    id: i,
    name,
    character: "",
    profile_path: null,
  }));
  return {
    id: d.imdbID,
    title: d.Title,
    overview: d.Plot && d.Plot !== "N/A" ? d.Plot : "",
    poster_path: poster(d.Poster),
    backdrop_path: null,
    release_date: d.Released && d.Released !== "N/A" ? d.Released : d.Year || "",
    vote_average: Number.isFinite(rating) ? rating : 0,
    vote_count: Number.isFinite(votes) ? votes : 0,
    genre_ids: [],
    runtime: parseRuntime(d.Runtime),
    genres: (d.Genre && d.Genre !== "N/A" ? d.Genre.split(", ") : []).map((name) => ({ id: name, name })),
    credits: { cast },
    videos: { results: [] }, // OMDB has no trailers
    similar: { results: [] },
  };
}

// Curated IMDb IDs per home section (OMDB has no trending/popular endpoints).
const LISTS = {
  trending: ["tt15239678", "tt15398776", "tt6263850", "tt22022452", "tt7286456", "tt1877830", "tt1745960", "tt1630029", "tt10872600", "tt10366206", "tt1517268", "tt6791350"],
  popular: ["tt4154796", "tt4154756", "tt0468569", "tt1375666", "tt0816692", "tt0499549", "tt0120338", "tt0371746", "tt1825683", "tt1431045", "tt0111161", "tt0068646"],
  now_playing: ["tt15239678", "tt15398776", "tt1517268", "tt22022452", "tt6263850", "tt6710474", "tt6751668", "tt1877830", "tt1745960", "tt10872600"],
  upcoming: ["tt15239678", "tt6263850", "tt22022452", "tt15398776", "tt1517268", "tt6791350", "tt10366206", "tt1630029", "tt7286456", "tt1877830"],
  top_rated: ["tt0111161", "tt0068646", "tt0468569", "tt0110912", "tt0109830", "tt0137523", "tt1375666", "tt0133093", "tt0172495", "tt2582802", "tt6751668", "tt0816692"],
};

const CATEGORY_MAP = { popular: "popular", now_playing: "now_playing", upcoming: "upcoming", top_rated: "top_rated" };

async function fetchList(ids) {
  const movies = (
    await Promise.all(ids.map((id) => getMovie(id).catch(() => null)))
  ).filter(Boolean);
  return { results: movies, page: 1, total_pages: 1 };
}

export const getTrending = cached("trending", () => fetchList(LISTS.trending));

export async function getMovies(category, page = 1) {
  void page;
  const list = LISTS[CATEGORY_MAP[category] || "popular"];
  return cached(`cat:${category}`, () => fetchList(list))();
}

export const getMovie = cached("movie", async (id) => {
  if (!/^tt\d+$/.test(id)) throw new Error("Unknown movie.");
  return mapDetail(await omdb({ i: id, plot: "full" }));
});

export async function searchMovies(query, page = 1) {
  const body = await omdb({ s: query, type: "movie", page: String(page) });
  const total = parseInt(body.totalResults || "0", 10) || 0;
  return {
    results: (body.Search || []).map(mapBrief),
    page,
    total_pages: Math.max(1, Math.ceil(total / 10)),
  };
}

const GENRES = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"];

export async function getGenres() {
  return GENRES.map((name) => ({ id: name.toLowerCase(), name }));
}

export async function getByGenre(genre, page = 1) {
  const body = await omdb({ s: genre, type: "movie", page: String(page) });
  const total = parseInt(body.totalResults || "0", 10) || 0;
  return {
    results: (body.Search || []).map(mapBrief),
    page,
    total_pages: Math.max(1, Math.ceil(total / 10)),
  };
}

export async function getProviders() {
  return null; // OMDB has no watch-provider data
}

export default { getTrending, getMovies, getMovie, searchMovies, getGenres, getByGenre, getProviders };
