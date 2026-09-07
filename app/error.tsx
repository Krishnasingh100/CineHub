"use client";
export default function Error({ retry }: { error: Error; retry: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <h1 className="text-2xl font-bold">We couldn’t load CineHub</h1>
      <p className="mt-3 text-zinc-400">
        Please check your connection and try again.
      </p>
      <button
        onClick={retry}
        className="mt-6 rounded-full bg-amber-400 px-5 py-2 font-semibold text-black"
      >
        Try again
      </button>
    </div>
  );
}
