import { Link } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";

export function Register() {
  return (
    <div className="mx-auto w-full max-w-md px-3 py-12 sm:px-4 sm:py-20">
      <h1 className="text-2xl font-black sm:text-3xl">Join CineHub</h1>
      <p className="mt-2 text-sm text-zinc-400 sm:text-base">Your watchlist and your point of view, in one place.</p>
      <div className="mt-6 rounded-xl border bg-zinc-950 p-4 sm:mt-8 sm:p-6">
        <AuthForm mode="register" />
      </div>
      <p className="mt-5 text-center text-sm text-zinc-500">
        Already have an account? <Link to="/login" className="text-amber-400">Log in</Link>
      </p>
    </div>
  );
}
