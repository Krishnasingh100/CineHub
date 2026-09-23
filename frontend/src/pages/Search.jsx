import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MovieGrid } from "../components/MovieGrid";
import { EmptyState, SectionHeading } from "../components/Ui";
import { api } from "../lib/api";

export function Search() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [input, setInput] = useState(q);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setInput(q);
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    api
      .get(`/api/movies/search?q=${encodeURIComponent(q.trim())}`)
      .then(setResults)
      .catch(() => setResults({ results: [] }))
      .finally(() => setLoading(false));
  }, [q]);

  function onSubmit(e) {
    e.preventDefault();
    setParams(input.trim() ? { q: input.trim() } : {});
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <form onSubmit={onSubmit} className="mb-10 flex max-w-2xl gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search for a movie"
          className="min-w-0 flex-1 rounded-lg border bg-zinc-900 px-4 py-3 outline-none focus:border-amber-500"
        />
        <button className="rounded-lg bg-amber-400 px-5 font-bold text-black">Search</button>
      </form>
      {loading ? (
        <p className="text-zinc-400">Searching…</p>
      ) : results ? (
        <>
          <SectionHeading title={`Results for “${q}”`} />
          <MovieGrid movies={results.results} />
        </>
      ) : (
        <EmptyState title="Find your next watch" detail="Search by movie title to explore the CineHub catalogue." />
      )}
    </div>
  );
}
