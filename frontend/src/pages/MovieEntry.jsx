import { useParams } from "react-router-dom";
import { MovieDetail } from "./MovieDetail";
import { MovieCollection } from "./MovieCollection";

const COLLECTIONS = new Set(["latest", "upcoming", "top-rated", "popular"]);

export function MovieEntry() {
  const { id } = useParams();
  if (COLLECTIONS.has(id)) return <MovieCollection slug={id} />;
  return <MovieDetail />;
}
