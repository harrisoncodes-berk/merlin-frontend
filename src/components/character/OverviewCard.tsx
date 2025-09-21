import type { Character } from "@/models/character";

export default function OverviewCard({ c }: { c: Character }) {
  const { core } = c;
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
      <div className="flex flex-wrap items-baseline gap-2">
        <h2 className="text-2xl font-black">{core.name}</h2>
        <span className="text-sm text-white/70">
          {core.race} • {core.className} • {core.background}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <Badge label={`Level ${core.level}`} />
        <Badge label={`HP ${core.hp.current}/${core.hp.max}`} />
        <Badge label={`AC ${core.ac}`} />
        <Badge label={`Speed ${core.speed} ft`} />
      </div>
    </section>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-800/80 px-2.5 py-1 ring-1 ring-white/10">
      {label}
    </span>
  );
}
