import type { AbilityScores } from "@/models/character";

export default function AbilitiesGrid({
  scores,
  mods,
}: {
  scores: AbilityScores;
  mods: Record<keyof AbilityScores, number>;
}) {
  const items: Array<[keyof AbilityScores, string]> = [
    ["str", "Strength"],
    ["dex", "Dexterity"],
    ["con", "Constitution"],
    ["int", "Intelligence"],
    ["wis", "Wisdom"],
    ["cha", "Charisma"],
  ];

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/70">
        Abilities
      </h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map(([k, label]) => {
          const score = scores[k];
          const mod = mods[k] ?? 0;
          const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
          return (
            <div
              key={k}
              className="rounded-xl bg-slate-800/70 p-3 ring-1 ring-white/10"
            >
              <div className="text-xs uppercase tracking-wide text-white/70">
                {label}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-sm text-white/80">{modStr}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
