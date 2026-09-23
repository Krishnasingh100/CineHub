import { imageUrl } from "../lib/tmdbImg";

function Group({ title, providers }) {
  if (!providers?.length) return null;
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-zinc-300">{title}</h3>
      <div className="flex flex-wrap gap-3">
        {providers.map((p) => (
          <div
            key={p.provider_id}
            title={p.provider_name}
            className="flex items-center gap-2 rounded-lg bg-zinc-800 p-2 pr-3 text-sm"
          >
            {p.logo_path && (
              <img src={imageUrl(p.logo_path, "w92")} alt="" width={32} height={32} className="rounded" />
            )}
            <span>{p.provider_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// OMDB has no watch-provider API, so when `data` is empty we link out to
// external availability search instead of showing a dead empty state.
export function WhereToWatch({ data, title, year, imdbId }) {
  const hasProviders = data && (data.flatrate?.length || data.rent?.length || data.buy?.length);
  if (hasProviders) {
    return (
      <div className="space-y-6 rounded-xl border bg-zinc-900/70 p-5">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Availability in India</p>
        <Group title="Stream" providers={data.flatrate} />
        <Group title="Rent" providers={data.rent} />
        <Group title="Buy" providers={data.buy} />
        {data.link && (
          <a href={data.link} target="_blank" rel="noreferrer" className="inline-block text-sm text-amber-400">
            View provider details ↗
          </a>
        )}
      </div>
    );
  }

  const query = encodeURIComponent(title + (year ? ` ${year}` : ""));
  const links = [
    { label: "Check JustWatch", href: `https://www.justwatch.com/in/search?q=${query}` },
    {
      label: "Search streaming options",
      href: `https://www.google.com/search?q=${encodeURIComponent(
        `where to watch ${title}${year ? ` (${year})` : ""} online`
      )}`,
    },
  ];
  if (imdbId && /^tt\d+$/.test(imdbId)) {
    links.push({ label: "View on IMDb", href: `https://www.imdb.com/title/${imdbId}/` });
  }

  return (
    <div className="space-y-3 rounded-xl border bg-zinc-900/70 p-5">
      <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">Availability</p>
      <p className="text-sm text-zinc-400">
        Live streaming data isn&apos;t available for this title, but you can check these sources:
      </p>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className="block rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-700"
        >
          {l.label} ↗
        </a>
      ))}
    </div>
  );
}
