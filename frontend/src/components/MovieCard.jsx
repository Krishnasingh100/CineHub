import { Link } from "react-router-dom";
import { posterUrl } from "../lib/tmdbImg";

export function MovieCard({ movie }) {
  const poster = posterUrl(movie.poster_path);
  return (
    <Link to={`/movies/${movie.id}`} className="group block min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-900 shadow-lg">
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center px-4 text-center text-sm text-zinc-600">No poster</div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="truncate font-medium text-zinc-100 group-hover:text-amber-300">{movie.title}</h3>
        <div className="mt-1 flex items-center justify-between text-xs text-zinc-500">
          <span>{movie.release_date?.slice(0, 4) || "—"}</span>
          <span className="text-amber-400">★ {movie.vote_average?.toFixed(1) || "—"}</span>
        </div>
      </div>
    </Link>
  );
}
