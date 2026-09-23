import { useEffect, useState } from "react";
import { PaginatedMovieGrid } from "../components/PaginatedMovieGrid";
import { SectionHeading, LoadingSkeleton } from "../components/Ui";
import { api } from "../lib/api";

export function Trending() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/api/movies/trending").then(setData).catch(() => setData({ results: [], page: 1, total_pages: 1 }));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading title="Trending now" />
      {!data ? (
        <LoadingSkeleton count={12} />
      ) : (
        <PaginatedMovieGrid
          initialMovies={data.results}
          initialPage={data.page}
          totalPages={data.total_pages}
          endpoint="/api/movies/trending"
        />
      )}
    </div>
  );
}
