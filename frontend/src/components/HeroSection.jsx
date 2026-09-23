import { Link } from "react-router-dom";
import { backdropUrl } from "../lib/tmdbImg";

export function HeroSection({ movie }) {
  const backdrop = backdropUrl(movie.backdrop_path);
  return (
    <section className="relative min-h-[480px] overflow-hidden border-b border-zinc-800">
      {backdrop && (
        <img src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#090909] via-[#090909]/65 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-transparent to-transparent" />
      <div className="relative mx-auto flex min-h-[480px] max-w-7xl items-end px-4 pb-16 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[.18em] text-amber-400">Featured this week</p>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">{movie.title}</h1>
          <div className="mt-4 flex gap-4 text-sm text-zinc-300">
            <span>{movie.release_date?.slice(0, 4)}</span>
            <span className="text-amber-400">★ {movie.vote_average.toFixed(1)} TMDB</span>
          </div>
          <p className="mt-5 line-clamp-3 leading-7 text-zinc-300">{movie.overview}</p>
          <Link
            to={`/movies/${movie.id}`}
            className="mt-7 inline-block rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            Explore movie
          </Link>
        </div>
      </div>
    </section>
  );
}
