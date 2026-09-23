import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SectionHeading, LoadingSkeleton } from "../components/Ui";
import { PaginatedMovieGrid } from "../components/PaginatedMovieGrid";
import { api } from "../lib/api";

export function GenreDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(null);
    api.get(`/api/movies/genres/${id}`).then(setData).catch(() => setData({ results: [], page: 1, total_pages: 1, genreName: "Genre" }));
  }, [id]);

  return (
    <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 sm:py-12 lg:px-8">
      <SectionHeading title={data?.genreName || "Genre"} />
      {!data ? (
        <LoadingSkeleton count={12} />
      ) : (
        <PaginatedMovieGrid
          initialMovies={data.results}
          initialPage={data.page}
          totalPages={data.total_pages}
          endpoint={`/api/movies/genres/${id}`}
        />
      )}
    </div>
  );
}
