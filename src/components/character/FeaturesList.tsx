import type { Feature } from "@/models/character";

export default function FeaturesList({ features }: { features: Feature[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/70">
        Features
      </h3>
      <ul className="space-y-2">
        {features.map((f) => (
          <li
            key={f.id}
            className="rounded-lg bg-slate-800/70 p-3 ring-1 ring-white/10"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="font-semibold">{f.name}</div>
              {f.maxUses != null && (
                <span className="text-xs text-white/70">
                  {f.uses ?? 0}/{f.maxUses}
                </span>
              )}
            </div>
            {f.summary && (
              <p className="mt-1 text-sm text-white/80">{f.summary}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
