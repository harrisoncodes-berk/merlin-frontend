import type { AbilityKey } from "@/models/character/common";

type SkillRow = {
  key: string;
  label: string;
  ability: AbilityKey;
  scoreMod: number;
  proficient: boolean;
  expertise: boolean;
  bonus: number;
};

export default function SkillsTable({
  skills,
  passivePerception,
  proficiency,
}: {
  skills: SkillRow[];
  passivePerception: number;
  proficiency: number;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
          Skills
        </h3>
        <div className="text-xs text-white/70">
          Proficiency Bonus:{" "}
          <span className="font-semibold">+{proficiency}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg ring-1 ring-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-800/80 text-white/80">
            <tr>
              <Th>Skill</Th>
              <Th>Ability</Th>
              <Th>Prof</Th>
              <Th>Bonus</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {skills.map((s) => (
              <tr key={s.key} className="bg-slate-900/60">
                <Td>{s.label}</Td>
                <Td className="uppercase text-white/70">{s.ability}</Td>
                <Td>
                  {s.expertise ? (
                    <span className="rounded bg-indigo-600/40 px-2 py-0.5 text-xs ring-1 ring-indigo-400/40">
                      Expertise
                    </span>
                  ) : s.proficient ? (
                    <span className="rounded bg-slate-700/60 px-2 py-0.5 text-xs ring-1 ring-white/10">
                      Proficient
                    </span>
                  ) : (
                    <span className="text-white/40">—</span>
                  )}
                </Td>
                <Td className="font-semibold">
                  {s.bonus >= 0 ? `+${s.bonus}` : s.bonus}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 text-xs text-white/70">
        Passive Perception:{" "}
        <span className="font-semibold">{passivePerception}</span> (10 +
        Perception bonus)
      </div>
    </section>
  );
}

function Th({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide ${className}`}
    >
      {children}
    </th>
  );
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-3 py-2 align-top ${className}`}>{children}</td>;
}
