import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MovieGrid } from "../components/MovieGrid";
import { EmptyState, SectionHeading, LoadingSkeleton } from "../components/Ui";
import { api } from "../lib/api";

export function Watchlist() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState(null);

  useEffect(() => {
    api
      .get("/api/watchlist")
      .then((d) => setMovies(d.results))
      .catch((e) => {
        if (String(e.message).toLowerCase().includes("auth")) navigate("/login");
        else setMovies([]);
      });
  }, [navigate]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading title="My watchlist" />
      {!movies ? (
        <LoadingSkeleton count={6} />
      ) : movies.length ? (
        <MovieGrid movies={movies} />
      ) : (
        <EmptyState title="Your watchlist is empty" detail="When a movie catches your eye, save it here for later." />
      )}
    </div>
  );
}
