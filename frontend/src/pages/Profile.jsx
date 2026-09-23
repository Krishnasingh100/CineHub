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
    <div className="mx-auto max-w-4xl px-3 py-8 sm:px-6 sm:py-12">
      <p className="text-xs font-medium uppercase tracking-widest text-amber-400 sm:text-sm">Profile</p>
      <h1 className="mt-2 break-words text-2xl font-black sm:text-4xl">{data.user.name}</h1>
      <p className="mt-2 break-all text-sm text-zinc-400 sm:text-base">{data.user.email}</p>
      <div className="mt-6 grid grid-cols-1 gap-2 min-[400px]:grid-cols-3 min-[400px]:gap-3 sm:mt-8">
        <div className="rounded-xl border bg-zinc-900 p-3 sm:p-4"><b className="text-xl sm:text-2xl">{data.stats.watchlistCount}</b><p className="text-xs text-zinc-500 sm:text-sm">Saved movies</p></div>
        <div className="rounded-xl border bg-zinc-900 p-3 sm:p-4"><b className="text-xl sm:text-2xl">{data.stats.ratingCount}</b><p className="text-xs text-zinc-500 sm:text-sm">Ratings</p></div>
        <div className="rounded-xl border bg-zinc-900 p-3 sm:p-4"><b className="text-xl sm:text-2xl">{data.stats.reviewCount}</b><p className="text-xs text-zinc-500 sm:text-sm">Reviews</p></div>
      </div>
      <section className="mt-8 sm:mt-12">
        <SectionHeading title="Recent ratings" />
        {data.recentRatings.length ? (
          <div className="space-y-3">
            {data.recentRatings.map(({ rating, movie }) => {
              const poster = movie ? posterUrl(movie.poster_path) : null;
              return (
                <Link
                  key={rating.movieId}
                  to={`/movies/${rating.movieId}`}
                  className="flex items-center gap-3 rounded-lg border bg-zinc-900 p-2.5 transition hover:border-amber-500 sm:gap-4 sm:p-3"
                >
                  <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded bg-zinc-800 sm:h-20 sm:w-14">
                    {poster ? (
                      <img src={poster} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-center text-[10px] text-zinc-500 sm:text-xs">No poster</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-100 sm:text-base">{movie?.title ?? `Movie #${rating.movieId}`}</p>
                    <p className="mt-1 truncate text-xs text-zinc-500 sm:text-sm">
                      {rating.updatedAt || rating.createdAt
                        ? `Rated ${new Date(rating.updatedAt || rating.createdAt).toLocaleDateString()}`
                        : "Rated recently"}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-amber-400 sm:text-sm">★ {rating.value}/10</span>
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
