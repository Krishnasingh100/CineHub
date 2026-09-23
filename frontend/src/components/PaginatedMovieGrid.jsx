import { useState } from "react";
import { MovieGrid } from "./MovieGrid";

export function PaginatedMovieGrid({ initialMovies, initialPage, totalPages, endpoint }) {
  const [movies, setMovies] = useState(initialMovies);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const hasMore = page < totalPages;

  async function loadMore() {
    setLoading(true);
    setError("");
    try {
      const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const res = await fetch(`${base}${endpoint}?page=${page + 1}`, { credentials: "include" });
      if (!res.ok) throw new Error("Unable to load more movies.");
      const data = await res.json();
      setMovies((current) => [
        ...current,
        ...data.results.filter((m) => !current.some((x) => x.id === m.id)),
      ]);
      setPage(data.page);
    } catch (e) {
      setError(e.message || "Unable to load more movies.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <MovieGrid movies={movies} />
      {hasMore && (
        <div className="mt-10 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-lg border border-amber-400/70 px-5 py-3 font-semibold text-amber-300 transition hover:bg-amber-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </div>
      )}
    </>
  );
}
