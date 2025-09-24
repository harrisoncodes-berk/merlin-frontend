type Item = { id: string; name: string; description?: string };
export default function CheckboxList({
  label,
  items,
  selected,
  onToggle,
  max = Infinity,
}: {
  label: string;
  items: Item[];
  selected: string[];
  onToggle: (id: string) => void;
  max?: number;
}) {
  const atLimit = selected.length >= max;
  return (
    <div>
      <div className="mb-1 text-sm font-medium text-white/90">{label}</div>
      <div className="space-y-2 rounded-xl bg-slate-900/50 p-3 ring-1 ring-white/10">
        {items.map((it) => {
          const checked = selected.includes(it.id);
          const disabled = !checked && atLimit;
          return (
            <label
              key={it.id}
              className={`flex items-start gap-2 ${
                disabled ? "opacity-50" : ""
              }`}
            >
              <input
                type="checkbox"
                className="mt-1"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(it.id)}
              />
              <div>
                <div className="font-medium">{it.name}</div>
                {it.description && (
                  <div className="text-sm text-white/70">{it.description}</div>
                )}
              </div>
            </label>
          );
        })}
        {items.length === 0 && (
          <div className="text-sm text-white/60">
            None available for the selected class.
          </div>
        )}
      </div>
    </div>
  );
}
