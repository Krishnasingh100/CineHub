import Image from "next/image";
import Link from "next/link";
import { posterUrl, type TmdbMovie } from "@/lib/tmdb";

export function MovieCard({ movie }: { movie: TmdbMovie }) {
  const poster = posterUrl(movie.poster_path);
  return <Link href={`/movies/${movie.id}`} className="group block min-w-0"><div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-zinc-900 shadow-lg"><>{poster ? <Image src={poster} alt={movie.title} fill sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 16vw" className="object-cover transition duration-300 group-hover:scale-105" /> : <div className="grid h-full place-items-center px-4 text-center text-sm text-zinc-600">No poster</div>}</></div><div className="mt-3"><h3 className="truncate font-medium text-zinc-100 group-hover:text-amber-300">{movie.title}</h3><div className="mt-1 flex items-center justify-between text-xs text-zinc-500"><span>{movie.release_date?.slice(0, 4) || "—"}</span><span className="text-amber-400">★ {movie.vote_average?.toFixed(1) || "—"}</span></div></div></Link>;
}
