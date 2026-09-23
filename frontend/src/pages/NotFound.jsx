import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-3 text-zinc-400">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block rounded-full bg-amber-400 px-5 py-2 font-semibold text-black">
        Go home
      </Link>
    </div>
  );
}
