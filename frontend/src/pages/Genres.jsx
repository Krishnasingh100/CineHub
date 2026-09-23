import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export function Genres() {
  const [genres, setGenres] = useState(null);

  useEffect(() => {
    api.get("/api/movies/genres").then((d) => setGenres(d.genres)).catch(() => setGenres([]));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Browse</p>
      <h1 className="mt-2 text-4xl font-black">Genres</h1>
      <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {(genres || []).map((genre) => (
          <Link
            key={genre.id}
            to={`/genres/${genre.id}`}
            className="rounded-xl border bg-zinc-900 p-5 font-semibold hover:border-amber-500 hover:text-amber-300"
          >
            {genre.name}
            <span className="float-right text-zinc-600">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
