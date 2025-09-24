export default function SummaryCard({
  name,
  race,
  klass,
  background,
  weapons,
  pack,
}: {
  name: string;
  race: string | null;
  klass: string | null;
  background: string | null;
  weapons: string[];
  pack: string | null;
}) {
  return (
    <div className="rounded-2xl bg-slate-900/60 p-4 ring-1 ring-white/10">
      <div className="mb-2 text-sm font-semibold text-white/90">Summary</div>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <dt className="text-white/60">Name</dt>
        <dd className="font-medium">{name || "—"}</dd>
        <dt className="text-white/60">Race</dt>
        <dd className="font-medium">{race ?? "—"}</dd>
        <dt className="text-white/60">Class</dt>
        <dd className="font-medium">{klass ?? "—"}</dd>
        <dt className="text-white/60">Background</dt>
        <dd className="font-medium">{background ?? "—"}</dd>
        <dt className="text-white/60">Weapons</dt>
        <dd className="font-medium">
          {weapons.length ? weapons.join(", ") : "—"}
        </dd>
        <dt className="text-white/60">Pack</dt>
        <dd className="font-medium">{pack ?? "—"}</dd>
      </dl>
    </div>
  );
}
