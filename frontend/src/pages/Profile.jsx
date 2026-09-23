import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SectionHeading } from "../components/Ui";
import { posterUrl } from "../lib/tmdbImg";
import { api } from "../lib/api";

export function Profile() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/api/profile")
      .then(setData)
      .catch(() => navigate("/login"));
  }, [navigate]);

  if (!data) return <div className="mx-auto max-w-4xl px-4 py-12"><p className="text-zinc-400">Loading profile…</p></div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <p className="text-sm font-medium uppercase tracking-widest text-amber-400">Profile</p>
      <h1 className="mt-2 text-4xl font-black">{data.user.name}</h1>
      <p className="mt-2 text-zinc-400">{data.user.email}</p>
      <div className="mt-8 grid grid-cols-3 gap-3">
        <div className="rounded-xl border bg-zinc-900 p-4"><b className="text-2xl">{data.stats.watchlistCount}</b><p className="text-sm text-zinc-500">Saved movies</p></div>
        <div className="rounded-xl border bg-zinc-900 p-4"><b className="text-2xl">{data.stats.ratingCount}</b><p className="text-sm text-zinc-500">Ratings</p></div>
        <div className="rounded-xl border bg-zinc-900 p-4"><b className="text-2xl">{data.stats.reviewCount}</b><p className="text-sm text-zinc-500">Reviews</p></div>
      </div>
      <section className="mt-12">
        <SectionHeading title="Recent ratings" />
        {data.recentRatings.length ? (
          <div className="space-y-3">
            {data.recentRatings.map(({ rating, movie }) => {
              const poster = movie ? posterUrl(movie.poster_path) : null;
              return (
                <Link
                  key={rating.movieId}
                  to={`/movies/${rating.movieId}`}
                  className="flex items-center gap-4 rounded-lg border bg-zinc-900 p-3 transition hover:border-amber-500"
                >
                  <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded bg-zinc-800">
                    {poster ? (
                      <img src={poster} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-center text-xs text-zinc-500">No poster</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-zinc-100">{movie?.title ?? `Movie #${rating.movieId}`}</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      {rating.updatedAt || rating.createdAt
                        ? `Rated ${new Date(rating.updatedAt || rating.createdAt).toLocaleDateString()}`
                        : "Rated recently"}
                    </p>
                  </div>
                  <span className="shrink-0 text-amber-400">★ {rating.value}/10</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-zinc-500">No ratings yet.</p>
        )}
      </section>
    </div>
  );
}
