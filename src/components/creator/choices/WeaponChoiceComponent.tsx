import type { WeaponChoice } from "@/models/creatorTwo";

interface WeaponChoiceComponentProps {
  choice: WeaponChoice;
  selected: string[];
  onUpdate: (weapons: string[]) => void;
}

export default function WeaponChoiceComponent({
  choice,
  selected,
  onUpdate,
}: WeaponChoiceComponentProps) {
  function toggleWeapon(weaponId: string) {
    const weapon = choice.choices.find(w => w.id === weaponId);
    if (!weapon) return;
    
    if (selected.includes(weapon.name)) {
      onUpdate(selected.filter(name => name !== weapon.name));
    } else if (selected.length < choice.number) {
      onUpdate([...selected, weapon.name]);
    }
  }

  return (
    <div className="rounded-xl bg-slate-800/50 p-3 ring-1 ring-white/10">
      <div className="mb-2 text-sm font-medium text-white/90">
        {choice.name}
      </div>
      <div className="mb-2 text-xs text-white/70">
        {choice.description}
      </div>
      <div className="grid gap-2">
        {choice.choices.map((weapon) => {
          const isSelected = selected.includes(weapon.name);
          const isDisabled = !isSelected && selected.length >= choice.number;
          
          return (
            <label
              key={weapon.id}
              className={`flex items-start gap-3 rounded-lg p-2 transition-colors ${
                isDisabled ? "opacity-50" : "cursor-pointer hover:bg-slate-700/50"
              } ${isSelected ? "bg-indigo-600/20 ring-1 ring-indigo-400" : "bg-slate-900/50 ring-1 ring-white/10"}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => toggleWeapon(weapon.id)}
                className="mt-1 rounded"
              />
              <div className="flex-1">
                <div className="font-medium">{weapon.name}</div>
                <div className="text-sm text-white/70">{weapon.description}</div>
                <div className="text-xs text-white/60">
                  Damage: {weapon.hitDice.name}
                </div>
              </div>
            </label>
          );
        })}
      </div>
      <div className="mt-2 text-xs text-white/60">
        Selected: {selected.length}/{choice.number}
      </div>
    </div>
  );
}
