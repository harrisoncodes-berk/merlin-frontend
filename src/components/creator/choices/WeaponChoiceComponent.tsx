import type { WeaponChoice } from "@/models/character/creator";
import type { Weapon } from "@/models/character/common";
import { useMemo } from "react";

type WeaponChoiceComponentProps = {
  choice: WeaponChoice;
  selected: Weapon[];
  onUpdate: (weapons: Weapon[]) => void;
}

export default function WeaponChoiceComponent({
  choice,
  selected,
  onUpdate,
}: WeaponChoiceComponentProps) {
  const choiceSelections = useMemo(() => selected.filter(w => choice.choices.some(c => c.id === w.id)), [selected, choice]);

  function toggleWeapon(weaponId: string) {
    const weapon = choice.choices.find(w => w.id === weaponId);
    if (!weapon) return;

    if (selected.includes(weapon)) {
      onUpdate(selected.filter(w => w !== weapon));
    } else if (choiceSelections.length < choice.number) {
      onUpdate([...selected, weapon]);
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
          const isSelected = choiceSelections.includes(weapon);
          const isDisabled = !isSelected && choiceSelections.length >= choice.number;

          return (
            <label
              key={weapon.id}
              className={`flex items-start gap-3 rounded-lg p-2 transition-colors ${isDisabled ? "opacity-50" : "cursor-pointer hover:bg-slate-700/50"
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
        Selected: {choiceSelections.length}/{choice.number}
      </div>
    </div>
  );
}
