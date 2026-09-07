import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { AccountMenu } from "@/components/account-menu";

export async function Navbar() {
  const user = await getCurrentUser();
  return <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-[#090909]/95 backdrop-blur">
    <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">
      <Link href="/" className="text-xl font-black tracking-tight text-white">Cine<span className="text-amber-400">Hub</span></Link>
      <nav className="hidden items-center gap-5 text-sm text-zinc-400 md:flex"><Link href="/movies/latest" className="hover:text-white">Latest</Link><Link href="/movies/upcoming" className="hover:text-white">Upcoming</Link><Link href="/movies/top-rated" className="hover:text-white">Top rated</Link><Link href="/genres" className="hover:text-white">Genres</Link></nav>
      <form action="/search" className="ml-auto hidden sm:block"><input name="q" aria-label="Search movies" placeholder="Search movies..." className="w-44 rounded-full border bg-zinc-900 px-4 py-2 text-sm outline-none transition focus:border-amber-500 sm:w-56" /></form>
      <AccountMenu user={user} />
    </div>
  </header>;
}
