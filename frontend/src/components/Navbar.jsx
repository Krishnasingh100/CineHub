import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function onSearch(e) {
    e.preventDefault();
    setMenuOpen(false);
    navigate(q.trim() ? `/search?q=${encodeURIComponent(q.trim())}` : "/search");
  }

  function go(path) {
    setMenuOpen(false);
    navigate(path);
  }

  async function onLogout() {
    await logout();
    setMenuOpen(false);
    navigate("/");
  }

  const links = [
    { to: "/movies/latest", label: "Latest" },
    { to: "/movies/upcoming", label: "Upcoming" },
    { to: "/movies/top-rated", label: "Top rated" },
    { to: "/genres", label: "Genres" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-[#090909]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-3 sm:h-16 sm:gap-5 sm:px-6 lg:px-8">
        {/* Hamburger — phones + small tablets only */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-zinc-200 hover:bg-zinc-800 md:hidden"
        >
          {menuOpen ? (
            <span aria-hidden className="text-xl leading-none">✕</span>
          ) : (
            <span aria-hidden className="text-xl leading-none">☰</span>
          )}
        </button>
        <Link to="/" onClick={() => setMenuOpen(false)} className="shrink-0 text-lg font-black tracking-tight text-white sm:text-xl">
          Cine<span className="text-amber-400">Hub</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-zinc-400 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="whitespace-nowrap hover:text-white">{l.label}</Link>
          ))}
        </nav>
        <form onSubmit={onSearch} className="ml-auto hidden min-w-0 flex-1 justify-end sm:flex md:flex-none">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search movies"
            placeholder="Search movies..."
            className="w-44 min-w-0 rounded-full border bg-zinc-900 px-4 py-2 text-sm outline-none transition focus:border-amber-500 md:w-56"
          />
        </form>
        {!user ? (
          <div className="ml-auto flex shrink-0 items-center gap-2 text-sm sm:ml-0 sm:gap-3">
            <Link to="/login" className="hidden whitespace-nowrap text-zinc-300 hover:text-white min-[400px]:block">Log in</Link>
            <Link to="/register" className="whitespace-nowrap rounded-full bg-amber-400 px-3 py-2 text-xs font-semibold text-black hover:bg-amber-300 sm:px-4 sm:text-sm">Join</Link>
          </div>
        ) : (
          <div className="ml-auto flex shrink-0 items-center gap-2 text-sm sm:ml-0 sm:gap-3">
            <Link to="/watchlist" className="hidden text-zinc-300 hover:text-white lg:block">Watchlist</Link>
            <Link
              to="/profile"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-700 font-bold text-white"
              title="Profile"
            >
              {user.name.slice(0, 1).toUpperCase()}
            </Link>
            <button onClick={onLogout} className="hidden whitespace-nowrap text-zinc-400 hover:text-white min-[400px]:block">Log out</button>
          </div>
        )}
      </div>

      {/* Mobile search — visible on phones where the desktop input is hidden */}
      <div className="border-t border-zinc-800/60 px-3 pb-3 pt-2 sm:hidden">
        <form onSubmit={onSearch} className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search movies"
            placeholder="Search movies..."
            className="min-w-0 flex-1 rounded-full border bg-zinc-900 px-4 py-2.5 text-sm outline-none transition focus:border-amber-500"
          />
          <button type="submit" aria-label="Search" className="shrink-0 rounded-full bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white active:bg-zinc-700">
            Go
          </button>
        </form>
      </div>

      {/* Mobile / tablet dropdown menu */}
      {menuOpen && (
        <nav className="border-t border-zinc-800/60 px-3 py-3 md:hidden" aria-label="Mobile">
          <div className="grid gap-1 text-[15px]">
            {links.map((l) => (
              <button
                key={l.to}
                type="button"
                onClick={() => go(l.to)}
                className="rounded-lg px-3 py-2.5 text-left text-zinc-200 hover:bg-zinc-800 hover:text-white"
              >
                {l.label}
              </button>
            ))}
            {user ? (
              <>
                <button type="button" onClick={() => go("/watchlist")} className="rounded-lg px-3 py-2.5 text-left text-zinc-200 hover:bg-zinc-800 hover:text-white">
                  Watchlist
                </button>
                <button type="button" onClick={() => go("/profile")} className="rounded-lg px-3 py-2.5 text-left text-zinc-200 hover:bg-zinc-800 hover:text-white">
                  Profile
                </button>
                <button type="button" onClick={onLogout} className="rounded-lg px-3 py-2.5 text-left text-zinc-400 hover:bg-zinc-800 hover:text-white min-[400px]:hidden">
                  Log out
                </button>
              </>
            ) : (
              <button type="button" onClick={() => go("/login")} className="rounded-lg px-3 py-2.5 text-left text-zinc-200 hover:bg-zinc-800 hover:text-white min-[400px]:hidden">
                Log in
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
