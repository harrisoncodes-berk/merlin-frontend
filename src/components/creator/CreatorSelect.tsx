type Option = { value: string; label: string };
type Props = {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
};

export default function CreatorSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  required,
}: Props) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-white/90">
        {label}
        {required ? " *" : ""}
      </span>
      <select
        className="w-full rounded-xl bg-slate-900/70 px-3 py-2 text-white ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
