import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Home } from "./pages/Home";
import { MovieEntry } from "./pages/MovieEntry";
import { Trending } from "./pages/Trending";
import { Genres } from "./pages/Genres";
import { GenreDetail } from "./pages/GenreDetail";
import { Search } from "./pages/Search";
import { Watchlist } from "./pages/Watchlist";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-full flex flex-col bg-[#090909] text-zinc-100">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies/:id" element={<MovieEntry />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/genres" element={<Genres />} />
              <Route path="/genres/:id" element={<GenreDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
