import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getMovie } from "@/lib/tmdb";
import { MovieGrid } from "@/components/movie-grid";
import { EmptyState, SectionHeading } from "@/components/ui";
export default async function WatchlistPage() { const user = await getCurrentUser(); if (!user) redirect("/login"); const entries = await (await db()).collection<{ movieId: number }>("watchlist").find({ userId: new ObjectId(user.id) }).sort({ createdAt: -1 }).toArray(); const movies = (await Promise.all(entries.map((entry) => getMovie(String(entry.movieId)).catch(() => null)))).filter((m): m is NonNullable<typeof m> => Boolean(m)); return <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><SectionHeading title="My watchlist"/>{movies.length ? <MovieGrid movies={movies}/> : <EmptyState title="Your watchlist is empty" detail="When a movie catches your eye, save it here for later."/>}</div>; }
