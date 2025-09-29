import type { SkillKey } from "@/models/character/common";
import { SKILL_LABEL } from "@/lib/skills";

interface SkillChoiceComponentProps {
  choices: {
    proficiencies: number;
    expertise?: number;
    description: string;
    skills: SkillKey[];
  };
  selected: SkillKey[];
  onUpdate: (skills: SkillKey[]) => void;
}

export default function SkillChoiceComponent({
  choices,
  selected,
  onUpdate,
}: SkillChoiceComponentProps) {
  function toggleSkill(skill: SkillKey) {
    if (selected.includes(skill)) {
      onUpdate(selected.filter(s => s !== skill));
    } else if (selected.length < choices.proficiencies) {
      onUpdate([...selected, skill]);
    }
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-white/70">
        Select {choices.proficiencies} skills from the list below:
      </div>
      <div className="grid grid-cols-2 gap-2">
        {choices.skills.map((skill: SkillKey) => {
          const isSelected = selected.includes(skill);
          const isDisabled = !isSelected && selected.length >= choices.proficiencies;
          
          return (
            <label
              key={skill}
              className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${
                isDisabled ? "opacity-50" : "cursor-pointer hover:bg-slate-700/50"
              } ${isSelected ? "bg-indigo-600/20 ring-1 ring-indigo-400" : "bg-slate-800/50 ring-1 ring-white/10"}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => toggleSkill(skill)}
                className="rounded"
              />
              <span className="text-sm">{SKILL_LABEL[skill]}</span>
            </label>
          );
        })}
      </div>
      <div className="text-xs text-white/60">
        Selected: {selected.length}/{choices.proficiencies}
      </div>
    </div>
  );
}
