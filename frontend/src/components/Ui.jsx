export function SectionHeading({ title, href, action }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-2 sm:mb-5">
      <h2 className="min-w-0 flex-1 text-lg font-bold tracking-tight text-white min-[400px]:text-xl sm:flex-none sm:text-2xl">{title}</h2>
      {href && (
        <a href={href} className="shrink-0 rounded px-1 py-1 text-xs font-medium text-amber-400 hover:text-amber-300 sm:text-sm">
          {action ?? "View all"} →
        </a>
      )}
    </div>
  );
}

export function EmptyState({ title, detail }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 px-4 py-10 text-center sm:px-6 sm:py-14">
      <h2 className="text-sm font-semibold text-zinc-200 sm:text-base">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-xs text-zinc-500 sm:text-sm">{detail}</p>
    </div>
  );
}

export function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="aspect-[2/3] animate-pulse rounded-md bg-zinc-800 sm:rounded-lg" />
      ))}
    </div>
  );
}
