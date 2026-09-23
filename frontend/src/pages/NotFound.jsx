import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-3 py-20 text-center sm:px-4 sm:py-32">
      <h1 className="text-xl font-bold sm:text-2xl">Page not found</h1>
      <p className="mt-3 text-sm text-zinc-400 sm:text-base">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block w-full rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-black min-[400px]:w-auto sm:text-base">
        Go home
      </Link>
    </div>
  );
}
