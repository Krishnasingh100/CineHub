import { useEffect, useState } from "react";
import { HeroSection } from "../components/HeroSection";
import { MovieGrid } from "../components/MovieGrid";
import { SectionHeading, LoadingSkeleton } from "../components/Ui";
import { api } from "../lib/api";

export function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/movies/home")
      .then(setData)
      .catch(() => setError("CineHub could not reach the movie catalogue. Check your connection and refresh."));
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">Movie data is temporarily unavailable</h1>
        <p className="mx-auto mt-3 max-w-md text-zinc-400">{error}</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <LoadingSkeleton count={12} />
      </div>
    );
  }

  const sections = [
    { title: "Trending now", movies: data.trending?.results ?? [], href: "/trending" },
    { title: "Popular movies", movies: data.popular?.results ?? [], href: "/movies/popular" },
    { title: "Latest releases", movies: data.latest?.results ?? [], href: "/movies/latest" },
    { title: "Coming soon", movies: data.upcoming?.results ?? [], href: "/movies/upcoming" },
    { title: "Top rated", movies: data.rated?.results ?? [], href: "/movies/top-rated" },
  ].filter((s) => s.movies.length > 0);

  const hero =
    data.trending?.results[0] ??
    data.popular?.results[0] ??
    data.latest?.results[0] ??
    data.upcoming?.results[0] ??
    data.rated?.results[0] ??
    null;

  if (!hero) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Movie data is temporarily unavailable</h1>
      </div>
    );
  }

  return (
    <>
      <HeroSection movie={hero} />
      <div className="mx-auto max-w-7xl space-y-10 px-3 py-8 sm:space-y-14 sm:px-6 sm:py-12 lg:px-8">
        {sections.map((section) => (
          <section key={section.title} className="min-w-0">
            <SectionHeading title={section.title} href={section.href} />
            <MovieGrid movies={section.movies.slice(0, 6)} />
          </section>
        ))}
      </div>
    </>
  );
}
