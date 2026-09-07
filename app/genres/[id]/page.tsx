import { MovieGrid } from "@/components/movie-grid";
import { SectionHeading } from "@/components/ui";
import { getByGenre, getGenres } from "@/lib/tmdb";
export default async function GenrePage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const [movies, genres] = await Promise.all([getByGenre(id), getGenres()]); const name = genres.find((g) => g.id === Number(id))?.name ?? "Genre"; return <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><SectionHeading title={name}/><MovieGrid movies={movies.results}/></div>; }
