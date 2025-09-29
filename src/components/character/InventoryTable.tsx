import type { InventoryItem } from "@/models/character/character";

export default function InventoryTable({
  items,
  total,
}: {
  items: InventoryItem[];
  total: number;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/40 p-4">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/70">
        Inventory
      </h3>
      <div className="overflow-x-auto rounded-lg ring-1 ring-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-800/80 text-white/80">
            <tr>
              <Th>Name</Th>
              <Th>Qty</Th>
              <Th>Wt (lb)</Th>
              <Th>Total</Th>
              <Th className="w-1/2">Description</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {items.map((it) => (
              <tr key={it.id} className="bg-slate-900/60">
                <Td>{it.name}</Td>
                <Td>{it.quantity}</Td>
                <Td>{it.weight}</Td>
                <Td>{(it.weight * it.quantity).toFixed(1)}</Td>
                <Td className="text-white/80">{it.description ?? "—"}</Td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-800/80">
            <tr>
              <Td colSpan={3} className="text-white/70">
                Total carried
              </Td>
              <Td className="font-semibold">{total.toFixed(1)}</Td>
              <Td />
            </tr>
          </tfoot>
        </table>
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
  colSpan,
}: {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td colSpan={colSpan} className={`px-3 py-2 align-top ${className}`}>
      {children}
    </td>
  );
}
