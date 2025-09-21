import type { Spell, SpellSlots, SpellLevel } from "@/models/character";

export default function SpellsPanel({
  spells,
  slots,
  castingClass,
}: {
  spells: Spell[];
  slots?: Partial<Record<SpellLevel, SpellSlots>>;
  castingClass: string;
}) {
  const byLevel = groupByLevel(spells);
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
          Spells
        </h3>
        <span className="text-xs text-white/70">{castingClass}</span>
      </header>

      {/* Cantrips */}
      <SpellLevelBlock
        title="Cantrips"
        hint="Level 0"
        spells={byLevel[0] ?? []}
      />

      {/* Leveled spells with slots */}
      {([1, 2, 3, 4, 5, 6, 7, 8, 9] as SpellLevel[]).map((lvl) => {
        const list = byLevel[lvl] ?? [];
        const s = slots?.[lvl];
        if (!list.length && !s) return null;
        return (
          <div key={lvl} className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold">Level {lvl}</div>
              {s && (
                <div className="text-xs text-white/70">
                  Slots: <span className="font-semibold">{s.max - s.used}</span>{" "}
                  / {s.max}
                </div>
              )}
            </div>
            <SpellList spells={list} />
          </div>
        );
      })}
    </section>
  );
}

function groupByLevel(spells: Spell[]): Record<number, Spell[]> {
  return spells.reduce((acc, sp) => {
    (acc[sp.level] ||= []).push(sp);
    return acc;
  }, {} as Record<number, Spell[]>);
}

function SpellLevelBlock({
  title,
  hint,
  spells,
}: {
  title: string;
  hint?: string;
  spells: Spell[];
}) {
  if (!spells.length) return null;
  return (
    <div className="mt-1">
      <div className="mb-2 text-sm font-semibold">
        {title} {hint && <span className="text-white/50">· {hint}</span>}
      </div>
      <SpellList spells={spells} />
    </div>
  );
}

function SpellList({ spells }: { spells: Spell[] }) {
  return (
    <ul className="space-y-2">
      {spells.map((sp) => (
        <li
          key={sp.id}
          className="rounded-lg bg-slate-800/70 p-3 ring-1 ring-white/10"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold">{sp.name}</div>
            {sp.prepared && (
              <span className="rounded bg-emerald-600/40 px-2 py-0.5 text-xs ring-1 ring-emerald-400/40">
                Prepared
              </span>
            )}
          </div>
          {sp.description && (
            <p className="mt-1 text-sm text-white/80">{sp.description}</p>
          )}
          {sp.school && (
            <div className="mt-1 text-xs text-white/60">{sp.school}</div>
          )}
        </li>
      ))}
    </ul>
  );
}
