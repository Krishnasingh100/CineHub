import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, saveAuth } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export function AuthForm({ mode }) {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form);
    try {
      const data = await api.post(`/api/auth/${mode}`, payload);
      saveAuth(data); // stores token + user for future requests
      await refresh();
      navigate("/");
    } catch (err) {
      setError(err.message || "Could not continue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      {mode === "register" && (
        <input
          name="name"
          required
          maxLength={60}
          placeholder="Your name"
          autoComplete="name"
          className="w-full rounded-lg border bg-zinc-900 px-4 py-3 text-base outline-none focus:border-amber-500"
        />
      )}
      <input
        name="email"
        type="email"
        required
        placeholder="Email address"
        autoComplete="email"
        className="w-full rounded-lg border bg-zinc-900 px-4 py-3 text-base outline-none focus:border-amber-500"
      />
      <input
        name="password"
        type="password"
        required
        minLength={8}
        placeholder="Password (8+ characters)"
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        className="w-full rounded-lg border bg-zinc-900 px-4 py-3 text-base outline-none focus:border-amber-500"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button disabled={loading} className="w-full rounded-lg bg-amber-400 py-3 text-sm font-bold text-black disabled:opacity-60 sm:text-base">
        {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
      </button>
    </form>
  );
}
