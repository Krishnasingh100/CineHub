import { imageUrl } from "../lib/tmdbImg";
import { EmptyState } from "./Ui";

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

export function WhereToWatch({ data }) {
  if (!data || (!data.flatrate?.length && !data.rent?.length && !data.buy?.length)) {
    return (
      <EmptyState
        title="No providers listed in India"
        detail="Availability changes often. Check back later for streaming and purchase options."
      />
    );
  }
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
