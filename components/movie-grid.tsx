import type { TmdbMovie } from "@/lib/tmdb";
import { MovieCard } from "@/components/movie-card";
import { EmptyState } from "@/components/ui";
export function MovieGrid({ movies }: { movies: TmdbMovie[] }) { return movies.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"><>{movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}</></div> : <EmptyState title="No movies found" detail="Try another title or browse one of our collections." />; }
