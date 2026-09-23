import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieActions } from "../components/MovieActions";
import { MovieGrid } from "../components/MovieGrid";
import { SectionHeading, LoadingSkeleton } from "../components/Ui";
import { WhereToWatch } from "../components/WhereToWatch";
import { backdropUrl, posterUrl } from "../lib/tmdbImg";
import { api } from "../lib/api";

export function MovieDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setData(null);
    setMissing(false);
    api
      .get(`/api/movies/${id}`)
      .then(setData)
      .catch(() => setMissing(true));
  }, [id]);

  if (missing) {
    return <div className="mx-auto max-w-7xl px-4 py-24 text-center"><h1 className="text-2xl font-bold">Movie not found</h1></div>;
  }
  if (!data) {
    return <div className="mx-auto max-w-7xl px-4 py-14"><LoadingSkeleton count={6} /></div>;
  }

  const { movie, providers, signedIn, inWatchlist, rating, community } = data;
  const backdrop = backdropUrl(movie.backdrop_path);
  const poster = posterUrl(movie.poster_path);
  const trailer = movie.videos?.results?.find((v) => v.site === "YouTube" && v.type === "Trailer");
  const year = movie.release_date?.slice(0, 4);
  const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${movie.title}${year ? ` ${year}` : ""} official trailer`
  )}`;

  return (
    <>
      <section className="relative overflow-hidden border-b border-zinc-800">
        {backdrop && <img src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />}
        <div className="relative mx-auto grid max-w-7xl gap-6 px-3 py-8 sm:gap-8 sm:px-6 sm:py-12 md:grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr] lg:px-8">
          <div className="relative mx-auto aspect-[2/3] w-40 overflow-hidden rounded-xl bg-zinc-800 min-[400px]:w-48 sm:mx-0 sm:w-full xs:w-52 md:w-full">
            {poster && <img src={poster} alt={movie.title} className="h-full w-full object-cover" />}
          </div>
          <div className="min-w-0 self-end text-center min-[400px]:text-left sm:text-left">
            <p className="text-xs text-amber-400 sm:text-sm">{movie.release_date?.slice(0, 4)} · {movie.runtime ?? "—"} min</p>
            <h1 className="fluid-title mt-2 font-black break-words">{movie.title}</h1>
            <p className="mt-3 break-words text-xs text-zinc-400 sm:text-sm">{movie.genres.map((g) => g.name).join(" · ")}</p>
            <p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-zinc-300 min-[400px]:mx-0 sm:mx-0 sm:mt-6 sm:text-base sm:leading-7">{movie.overview}</p>
            <p className="mt-4 text-sm text-amber-400 sm:mt-5 sm:text-base">★ {movie.vote_average.toFixed(1)} TMDB</p>
            <div className="mt-5 flex flex-col items-center gap-4 min-[400px]:items-start space-y-0">
              <div className="w-full min-[400px]:w-auto">
                <p className="text-sm font-semibold text-zinc-200">Community Rating</p>
                {community ? (
                  <>
                    <p className="mt-1 text-xl font-bold text-amber-400 sm:text-2xl">{community.average.toFixed(1)} / 10</p>
                    <p className="text-xs text-zinc-400 sm:text-sm">Based on {community.count} {community.count === 1 ? "rating" : "ratings"}</p>
                  </>
                ) : (
                  <p className="mt-1 text-xs text-zinc-400 sm:text-sm">No community ratings yet.</p>
                )}
              </div>
              <MovieActions movieId={id} signedIn={signedIn} inWatchlist={inWatchlist} rating={rating} />
              <a
                href={trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block w-full rounded-full bg-red-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-red-500 min-[400px]:w-auto"
              >
                ▶ Watch trailer on YouTube
              </a>
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-8 px-3 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_360px] lg:gap-12 lg:px-8">
        <div className="min-w-0 space-y-8 sm:space-y-12">
          {trailer && (
            <section className="min-w-0">
              <SectionHeading title="Trailer" />
              <div className="aspect-video overflow-hidden rounded-xl border">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
                  title="Trailer"
                  allowFullScreen
                />
              </div>
            </section>
          )}
          <section>
            <SectionHeading title="Cast" />
            <div className="grid grid-cols-2 gap-3 min-[400px]:gap-4 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {movie.credits.cast.slice(0, 10).map((p) => (
                <div key={p.id} className="min-w-0">
                  <p className="truncate text-sm font-medium sm:text-[15px]">{p.name}</p>
                  <p className="truncate text-xs text-zinc-500 sm:text-sm">{p.character}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="min-w-0">
            <SectionHeading title="Similar movies" />
            <MovieGrid movies={movie.similar.results.slice(0, 6)} />
          </section>
        </div>
        <aside className="min-w-0">
          <SectionHeading title="Where to watch" />
          <WhereToWatch data={providers?.results?.IN} title={movie.title} year={year} imdbId={movie.id} />
        </aside>
      </div>
    </>
  );
}
