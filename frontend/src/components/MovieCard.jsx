import { Link } from "react-router-dom";
import { posterUrl } from "../lib/tmdbImg";

export function MovieCard({ movie }) {
  const poster = posterUrl(movie.poster_path);
  return (
    <Link to={`/movies/${movie.id}`} className="group block min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-zinc-900 shadow-lg sm:rounded-lg">
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center px-3 text-center text-xs text-zinc-600 sm:px-4 sm:text-sm">No poster</div>
        )}
      </div>
      <div className="mt-2 sm:mt-3">
        <h3 className="truncate text-[13px] font-medium text-zinc-100 group-hover:text-amber-300 sm:text-[15px]">{movie.title}</h3>
        <div className="mt-0.5 flex items-center justify-between gap-2 text-[11px] text-zinc-500 sm:mt-1 sm:text-xs">
          <span className="shrink-0">{movie.release_date?.slice(0, 4) || "—"}</span>
          <span className="truncate text-amber-400">★ {movie.vote_average?.toFixed(1) || "—"}</span>
        </div>
      </div>
    </Link>
  );
}
