import { Link } from "react-router-dom";
import { AuthForm } from "../components/AuthForm";

export function Login() {
  return (
    <div className="mx-auto w-full max-w-md px-3 py-12 sm:px-4 sm:py-20">
      <h1 className="text-2xl font-black sm:text-3xl">Welcome back</h1>
      <p className="mt-2 text-sm text-zinc-400 sm:text-base">Log in to rate, review, and save movies.</p>
      <div className="mt-6 rounded-xl border bg-zinc-950 p-4 sm:mt-8 sm:p-6">
        <AuthForm mode="login" />
      </div>
      <p className="mt-5 text-center text-sm text-zinc-500">
        New to CineHub? <Link to="/register" className="text-amber-400">Create an account</Link>
      </p>
    </div>
  );
}
