import type { Character } from "@/models/character";

export default function OverviewCard({ c }: { c: Character }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
      <div className="flex flex-wrap items-baseline gap-2">
        <h2 className="text-2xl font-black">{c.name}</h2>
        <span className="text-sm text-white/70">
          {c.race} • {c.className} • {c.background}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <Badge label={`Level ${c.level}`} />
        <Badge label={`HP ${c.hpCurrent}/${c.hpMax}`} />
        <Badge label={`AC ${c.ac}`} />
        <Badge label={`Speed ${c.speed} ft`} />
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
