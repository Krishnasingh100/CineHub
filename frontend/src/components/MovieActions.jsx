import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export function MovieActions({ movieId, signedIn, inWatchlist, rating }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(inWatchlist);
  const [value, setValue] = useState(rating?.toString() ?? "");
  const [message, setMessage] = useState("");

  async function watchlist() {
    if (!signedIn) return navigate("/login");
    try {
      if (saved) await api.del(`/api/watchlist/${movieId}`);
      else await api.post(`/api/watchlist/${movieId}`);
      setSaved(!saved);
      setMessage(saved ? "Removed from watchlist" : "Added to watchlist");
    } catch {
      setMessage("Something went wrong. Try again.");
    }
  }

  async function submitRating() {
    if (!signedIn) return navigate("/login");
    const number = Number(value);
    if (!Number.isInteger(number) || number < 1 || number > 10) {
      return setMessage("Choose a whole number from 1 to 10.");
    }
    try {
      await api.put(`/api/movies/${movieId}/rating`, { value: number });
      setMessage("Your rating is saved.");
    } catch (err) {
      if (String(err.message).toLowerCase().includes("auth")) return navigate("/login");
      setMessage("Something went wrong. Try again.");
    }
  }

  return (
    <div className="flex w-full flex-col gap-3 min-[400px]:w-auto min-[400px]:flex-row min-[400px]:flex-wrap min-[400px]:items-end sm:items-center">
      <button
        onClick={watchlist}
        className={`w-full rounded-full border px-4 py-2.5 text-sm font-semibold min-[400px]:w-auto ${
          saved
            ? "border-red-500/60 bg-red-500/10 text-red-300"
            : "border-zinc-600 bg-zinc-900 text-zinc-100 hover:border-zinc-400"
        }`}
      >
        {saved ? "♥ In watchlist" : "♡ Add to watchlist"}
      </button>
      <div className="w-full min-[400px]:w-auto">
        <p className="mb-1 text-sm font-semibold text-zinc-200">Your Rating</p>
        <div className="flex overflow-hidden rounded-full border border-zinc-700 bg-zinc-900">
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="Your rating"
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none min-[400px]:flex-none"
          >
            <option value="">Rate it</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1} / 10
              </option>
            ))}
          </select>
          <button onClick={submitRating} className="shrink-0 border-l border-zinc-700 px-4 text-sm font-semibold text-amber-400">
            {rating ? "Update" : "Save"}
          </button>
        </div>
      </div>
      {message && <span className="w-full text-xs text-zinc-400">{message}</span>}
    </div>
  );
}
