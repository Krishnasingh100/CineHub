import { Link } from "react-router-dom";
import { backdropUrl } from "../lib/tmdbImg";

export function HeroSection({ movie }) {
  const backdrop = backdropUrl(movie.backdrop_path);
  return (
    <section className="relative min-h-[380px] overflow-hidden border-b border-zinc-800 sm:min-h-[440px] lg:min-h-[480px]">
      {backdrop && (
        <img src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-55" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/65 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent" />
      <div className="relative mx-auto flex min-h-[380px] max-w-7xl items-end px-3 pb-10 pt-16 sm:min-h-[440px] sm:px-6 sm:pb-16 lg:min-h-[480px] lg:px-8">
        <div className="w-full max-w-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.18em] text-amber-400 sm:mb-3 sm:text-sm">Featured this week</p>
          <h1 className="fluid-hero font-black tracking-tight text-white">{movie.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:mt-4 sm:text-sm text-zinc-300">
            <span>{movie.release_date?.slice(0, 4)}</span>
            <span className="text-amber-400">★ {movie.vote_average.toFixed(1)} TMDB</span>
          </div>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-300 sm:mt-5 sm:line-clamp-3 sm:text-base sm:leading-7">{movie.overview}</p>
          <Link
            to={`/movies/${movie.id}`}
            className="mt-5 inline-block w-full rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-black transition hover:bg-zinc-200 min-[400px]:w-auto sm:mt-7"
          >
            Explore movie
          </Link>
        </div>
      </div>
    </section>
  );
}
