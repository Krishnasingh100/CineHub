import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  function onSearch(e) {
    e.preventDefault();
    navigate(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
  }

  async function onLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-[#090909]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-black tracking-tight text-white">
          Cine<span className="text-amber-400">Hub</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-zinc-400 md:flex">
          <Link to="/movies/latest" className="hover:text-white">Latest</Link>
          <Link to="/movies/upcoming" className="hover:text-white">Upcoming</Link>
          <Link to="/movies/top-rated" className="hover:text-white">Top rated</Link>
          <Link to="/genres" className="hover:text-white">Genres</Link>
        </nav>
        <form onSubmit={onSearch} className="ml-auto hidden sm:block">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search movies"
            placeholder="Search movies..."
            className="w-44 rounded-full border bg-zinc-900 px-4 py-2 text-sm outline-none transition focus:border-amber-500 sm:w-56"
          />
        </form>
        {!user ? (
          <div className="flex items-center gap-3 text-sm">
            <Link to="/login" className="text-zinc-300 hover:text-white">Log in</Link>
            <Link to="/register" className="rounded-full bg-amber-400 px-4 py-2 font-semibold text-black hover:bg-amber-300">Join</Link>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            <Link to="/watchlist" className="hidden text-zinc-300 hover:text-white sm:block">Watchlist</Link>
            <Link
              to="/profile"
              className="grid h-8 w-8 place-items-center rounded-full bg-zinc-700 font-bold text-white"
              title="Profile"
            >
              {user.name.slice(0, 1).toUpperCase()}
            </Link>
            <button onClick={onLogout} className="text-zinc-400 hover:text-white">Log out</button>
          </div>
        )}
      </div>
    </header>
  );
}
