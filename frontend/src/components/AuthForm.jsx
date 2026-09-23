import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
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
      await api.post(`/api/auth/${mode}`, payload);
      await refresh();
      navigate("/");
    } catch (err) {
      setError(err.message || "Could not continue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "register" && (
        <input
          name="name"
          required
          maxLength={60}
          placeholder="Your name"
          className="w-full rounded-lg border bg-zinc-900 px-4 py-3 outline-none focus:border-amber-500"
        />
      )}
      <input
        name="email"
        type="email"
        required
        placeholder="Email address"
        className="w-full rounded-lg border bg-zinc-900 px-4 py-3 outline-none focus:border-amber-500"
      />
      <input
        name="password"
        type="password"
        required
        minLength={8}
        placeholder="Password (8+ characters)"
        className="w-full rounded-lg border bg-zinc-900 px-4 py-3 outline-none focus:border-amber-500"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button disabled={loading} className="w-full rounded-lg bg-amber-400 py-3 font-bold text-black disabled:opacity-60">
        {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
      </button>
    </form>
  );
}
