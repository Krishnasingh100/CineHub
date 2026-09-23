const API = "https://api.themoviedb.org/3";

function key() {
  const value = process.env.TMDB_API_KEY;
  if (!value) throw new Error("TMDB_API_KEY is not configured");
  return value.trim();
}

async function request(path, params = {}) {
  const credential = key();
  const usesBearer = credential.startsWith("eyJ");
  const search = new URLSearchParams({ language: "en-US" });
  for (const [k, v] of Object.entries(params)) search.set(k, String(v));
  if (!usesBearer) search.set("api_key", credential);

  const res = await fetch(`${API}${path}?${search}`, {
    headers: usesBearer ? { Authorization: `Bearer ${credential}` } : undefined,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(`TMDB request failed (${res.status}): ${body?.status_message || "Unknown TMDB error"}`);
  }
  return res.json();
}

module.exports = {
  getTrending: (page = 1) => request("/trending/movie/week", { page }),
  getMovies: (category, page = 1) => request(`/movie/${category}`, { page }),
  getMovie: (id) => request(`/movie/${id}`, { append_to_response: "credits,videos,similar" }),
  searchMovies: (query, page = 1) =>
    request("/search/movie", { query, page, include_adult: "false" }),
  getGenres: () =>
    request("/genre/movie/list").then((x) => x.genres),
  getByGenre: (genre, page = 1) =>
    request("/discover/movie", { with_genres: genre, sort_by: "popularity.desc", page }),
  getProviders: (id) => request(`/movie/${id}/watch/providers`),
};
