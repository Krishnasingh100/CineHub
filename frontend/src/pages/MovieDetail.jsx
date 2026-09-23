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

  return (
    <>
      <section className="relative overflow-hidden border-b border-zinc-800">
        {backdrop && <img src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />}
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[220px_1fr]">
          <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-zinc-800">
            {poster && <img src={poster} alt={movie.title} className="h-full w-full object-cover" />}
          </div>
          <div className="self-end">
            <p className="text-amber-400">{movie.release_date?.slice(0, 4)} · {movie.runtime ?? "—"} min</p>
            <h1 className="mt-2 text-4xl font-black sm:text-6xl">{movie.title}</h1>
            <p className="mt-3 text-zinc-400">{movie.genres.map((g) => g.name).join(" · ")}</p>
            <p className="mt-6 max-w-3xl leading-7 text-zinc-300">{movie.overview}</p>
            <p className="mt-5 text-amber-400">★ {movie.vote_average.toFixed(1)} TMDB</p>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-sm font-semibold text-zinc-200">Community Rating</p>
                {community ? (
                  <>
                    <p className="mt-1 text-2xl font-bold text-amber-400">{community.average.toFixed(1)} / 10</p>
                    <p className="text-sm text-zinc-400">Based on {community.count} {community.count === 1 ? "rating" : "ratings"}</p>
                  </>
                ) : (
                  <p className="mt-1 text-sm text-zinc-400">No community ratings yet.</p>
                )}
              </div>
              <MovieActions movieId={id} signedIn={signedIn} inWatchlist={inWatchlist} rating={rating} />
            </div>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-12">
          {trailer && (
            <section>
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
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {movie.credits.cast.slice(0, 10).map((p) => (
                <div key={p.id}>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-zinc-500">{p.character}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <SectionHeading title="Similar movies" />
            <MovieGrid movies={movie.similar.results.slice(0, 6)} />
          </section>
        </div>
        <aside>
          <SectionHeading title="Where to watch" />
          <WhereToWatch data={providers?.results?.IN} />
        </aside>
      </div>
    </>
  );
}
