import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export function Genres() {
  const [genres, setGenres] = useState(null);

  useEffect(() => {
    api.get("/api/movies/genres").then((d) => setGenres(d.genres)).catch(() => setGenres([]));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-3 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-medium uppercase tracking-widest text-amber-400 sm:text-sm">Browse</p>
      <h1 className="mt-2 text-2xl font-black sm:text-4xl">Genres</h1>
      <div className="mt-6 grid grid-cols-1 gap-2 min-[400px]:grid-cols-2 min-[400px]:gap-3 sm:mt-9 sm:grid-cols-3 lg:grid-cols-4">
        {(genres || []).map((genre) => (
          <Link
            key={genre.id}
            to={`/genres/${genre.id}`}
            className="rounded-xl border bg-zinc-900 p-4 text-sm font-semibold hover:border-amber-500 hover:text-amber-300 sm:p-5 sm:text-base"
          >
            {genre.name}
            <span className="float-right text-zinc-600">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
