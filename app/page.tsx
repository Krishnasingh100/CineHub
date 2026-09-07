import { HeroSection } from "@/components/hero-section";
import { MovieGrid } from "@/components/movie-grid";
import { SectionHeading } from "@/components/ui";
import { getMovies, getTrending } from "@/lib/tmdb";

export default async function Home() {
  const [trending, popular, latest, upcoming, rated] = await Promise.all([getTrending(), getMovies("popular"), getMovies("now_playing"), getMovies("upcoming"), getMovies("top_rated")]);
  const sections = [["Trending now", trending, "/search?q=trending"], ["Popular movies", popular.results, "/movies/popular"], ["Latest releases", latest.results, "/movies/latest"], ["Coming soon", upcoming.results, "/movies/upcoming"], ["Top rated", rated.results, "/movies/top-rated"]] as const;
  return <><HeroSection movie={trending[0] ?? popular.results[0]} /><div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6 lg:px-8">{sections.map(([title, movies, href]) => <section key={title}><SectionHeading title={title} href={href} /><MovieGrid movies={movies.slice(0, 6)} /></section>)}</div></>;
}
