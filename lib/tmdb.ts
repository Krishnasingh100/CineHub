import "server-only";

const API = "https://api.themoviedb.org/3";
const IMAGE = "https://image.tmdb.org/t/p";

export type TmdbMovie = { id: number; title: string; overview: string; poster_path: string | null; backdrop_path: string | null; release_date: string; vote_average: number; vote_count: number; genre_ids?: number[] };
export type TmdbPerson = { id: number; name: string; character: string; profile_path: string | null };
export type TmdbMovieDetail = TmdbMovie & { runtime: number | null; genres: { id: number; name: string }[]; credits: { cast: TmdbPerson[] }; videos: { results: { key: string; site: string; type: string; official: boolean }[] }; similar: { results: TmdbMovie[] } };
type Results<T> = { results: T[]; page: number; total_pages: number };

function key() {
  const value = process.env.TMDB_API_KEY;
  if (!value) throw new Error("TMDB_API_KEY is not configured");
  return value;
}

async function request<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const credential = key().trim();
  const usesBearerToken = credential.startsWith("eyJ");
  const search = new URLSearchParams({ language: "en-US", ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) });

  if (!usesBearerToken) search.set("api_key", credential);

  const response = await fetch(`${API}${path}?${search}`, {
    headers: usesBearerToken ? { Authorization: `Bearer ${credential}` } : undefined,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { status_message?: string } | null;
    throw new Error(`TMDB request failed (${response.status}): ${body?.status_message ?? "Unknown TMDB error"}`);
  }

  return response.json() as Promise<T>;
}

export const imageUrl = (path: string | null, size = "w500") => path ? `${IMAGE}/${size}${path}` : null;
export const posterUrl = (path: string | null) => imageUrl(path, "w500");
export const backdropUrl = (path: string | null) => imageUrl(path, "original");
export const getTrending = () => request<Results<TmdbMovie>>("/trending/movie/week").then((x) => x.results);
export const getMovies = (category: "popular" | "now_playing" | "upcoming" | "top_rated", page = 1) => request<Results<TmdbMovie>>(`/movie/${category}`, { page });
export const getMovie = (id: string) => request<TmdbMovieDetail>(`/movie/${id}`, { append_to_response: "credits,videos,similar" });
export const searchMovies = (query: string, page = 1) => request<Results<TmdbMovie>>("/search/movie", { query, page, include_adult: "false" });
export const getGenres = () => request<{ genres: { id: number; name: string }[] }>("/genre/movie/list").then((x) => x.genres);
export const getByGenre = (genre: string, page = 1) => request<Results<TmdbMovie>>("/discover/movie", { with_genres: genre, sort_by: "popularity.desc", page });
export const getProviders = (id: string) => request<{ results: Record<string, { flatrate?: Provider[]; rent?: Provider[]; buy?: Provider[]; link?: string }> }>(`/movie/${id}/watch/providers`);
export type Provider = { provider_id: number; provider_name: string; logo_path: string | null };
