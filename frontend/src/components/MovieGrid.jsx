import { MovieCard } from "./MovieCard";
import { EmptyState } from "./Ui";

export function MovieGrid({ movies }) {
  if (!movies?.length) {
    return <EmptyState title="No movies found" detail="Try another title or browse one of our collections." />;
  }
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
