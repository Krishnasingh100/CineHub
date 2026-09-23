import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MovieGrid } from "../components/MovieGrid";
import { SectionHeading, LoadingSkeleton } from "../components/Ui";
import { api } from "../lib/api";

const MAP = {
  latest: { api: "now_playing", title: "Latest releases" },
  upcoming: { api: "upcoming", title: "Upcoming movies" },
  "top-rated": { api: "top_rated", title: "Top rated movies" },
  popular: { api: "popular", title: "Popular movies" },
};

export function MovieCollection({ slug: slugProp }) {
  const { slug: slugParam } = useParams();
  const slug = slugProp || slugParam;
  const entry = MAP[slug] || MAP.popular;
  const [movies, setMovies] = useState(null);

  useEffect(() => {
    setMovies(null);
    api.get(`/api/movies/category/${entry.api}`).then((d) => setMovies(d.results)).catch(() => setMovies([]));
  }, [entry.api]);

  return (
    <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-12 lg:px-8">
      <SectionHeading title={entry.title} />
      {!movies ? <LoadingSkeleton count={12} /> : <MovieGrid movies={movies} />}
    </div>
  );
}
