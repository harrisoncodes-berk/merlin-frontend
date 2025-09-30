import type { SpellChoice } from "@/models/character/creator";
import type { Spell } from "@/models/character/common";
import { useMemo } from "react";

interface SpellChoiceComponentProps {
  choice: SpellChoice;
  selected: Spell[];
  onUpdate: (spells: Spell[]) => void;
}

export default function SpellChoiceComponent({
  choice,
  selected,
  onUpdate,
}: SpellChoiceComponentProps) {
  const choiceSelections = useMemo(() => selected.filter(s => choice.choices.some(c => c.id === s.id)), [selected, choice]);

  function toggleSpell(spellId: string) {
    const spell = choice.choices.find(s => s.id === spellId);
    if (!spell) return;
    
    if (selected.includes(spell)) {
      onUpdate(selected.filter(s => s !== spell));
    } else if (choiceSelections.length < choice.number) {
      onUpdate([...selected, spell]);
    }
  }

  const levelLabel = choice.name;

  return (
    <div className="rounded-xl bg-slate-800/50 p-3 ring-1 ring-white/10">
      <div className="mb-2 text-sm font-medium text-white/90">
        {levelLabel} Spells
      </div>
      <div className="mb-2 text-xs text-white/70">
        {choice.description}
      </div>
      <div className="grid gap-2">
        {choice.choices.map((spell) => {
          const isSelected = selected.includes(spell);
          const isDisabled = !isSelected && choiceSelections.length >= choice.number;
          
          return (
            <label
              key={spell.id}
              className={`flex items-start gap-3 rounded-lg p-2 transition-colors ${
                isDisabled ? "opacity-50" : "cursor-pointer hover:bg-slate-700/50"
              } ${isSelected ? "bg-indigo-600/20 ring-1 ring-indigo-400" : "bg-slate-900/50 ring-1 ring-white/10"}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => toggleSpell(spell.id)}
                className="mt-1 rounded"
              />
              <div className="flex-1">
                <div className="font-medium">{spell.name}</div>
                <div className="text-sm text-white/70">{spell.description}</div>
                <div className="text-xs text-white/60">
                  {spell.level === 0 ? "Cantrip" : `Level ${spell.level}`}
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
