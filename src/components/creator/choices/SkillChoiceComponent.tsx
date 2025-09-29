import type { Skill, SkillKey } from "@/models/character/common";
import { SKILL_LABEL } from "@/lib/skills";
import { useMemo } from "react";

type SkillChoiceComponentProps = {
  choices: {
    proficiencies: number;
    expertise?: number;
    description: string;
    skills: SkillKey[];
  };
  selected: Skill[];
  backgroundSkills: Skill[];
  onUpdate: (skills: Skill[]) => void;
}

export default function SkillChoiceComponent({
  choices,
  selected,
  backgroundSkills,
  onUpdate,
}: SkillChoiceComponentProps) {

  const expertiseSelected = useMemo(() => selected.filter(s => s.expertise), [selected]);

  function toggleSkill(skill: SkillKey) {
    if (!backgroundSkills.some(s => s.key === skill)) {
      if (selected.some(s => s.key === skill)) {
        onUpdate(selected.filter(s => s.key !== skill));
      } else if (selected.length < choices.proficiencies + backgroundSkills.length) {
        onUpdate([...selected, { key: skill, proficient: true, expertise: false }]);
      }
    }
  }

  function toggleExpertise(skill: SkillKey) {
    if (!choices.expertise) return;
    const skillObj = selected.find(s => s.key === skill);
    if (skillObj) {
      if (skillObj.expertise) {
        const otherSelected = selected.filter(s => s.key !== skill);
        onUpdate([...otherSelected, { key: skill, proficient: true, expertise: false }]);
      } else if (expertiseSelected.length < choices.expertise) {
        const otherSelected = selected.filter(s => s.key !== skill);
        onUpdate([...otherSelected, { key: skill, proficient: true, expertise: true }]);
      }
    } else {
      onUpdate([...selected, { key: skill, proficient: true, expertise: true }]);
    }
  }

  let description = `Select ${choices.proficiencies + backgroundSkills.length} skills to be proficient in (background skills are automatically selected):`;
  if (choices.expertise) {
    description = `Select ${choices.proficiencies + backgroundSkills.length} skills to be proficient in and ${choices.expertise} of those skills to be an expert in (background skills are automatically selected):`;
  }

  return (
    <div className="space-y-3 rounded-xl bg-slate-800/50 p-3 ring-1 ring-white/10">
      <div className="text-sm text-white/70">
        {description}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {choices.skills.map((skill: SkillKey) => {
          const isProficient = selected.some(s => s.key === skill);
          const isProficientDisabled = !isProficient && selected.length >= choices.proficiencies + backgroundSkills.length;

          let isExpertise = false;
          let isExpertiseDisabled = true;
          if (choices.expertise) {
            isExpertise = expertiseSelected.some(s => s.key === skill);
            isExpertiseDisabled = !isExpertise && expertiseSelected.length >= choices.expertise;
          }

          return (
            <label
              key={skill}
              className={`flex items-center gap-2 rounded-lg p-2 transition-colors ${isProficientDisabled && isExpertiseDisabled ? "opacity-50" : "cursor-pointer hover:bg-slate-700/50"
                } ${isProficient ? "bg-indigo-600/20 ring-1 ring-indigo-400" : "bg-slate-800/50 ring-1 ring-white/10"}`}
            >
              <input
                type="checkbox"
                checked={isProficient}
                disabled={isProficientDisabled}
                onChange={() => toggleSkill(skill)}
                className="rounded"
              />
              {choices.expertise && (
                <input
                  type="checkbox"
                  checked={isExpertise}
                  disabled={isExpertiseDisabled}
                  onChange={() => toggleExpertise(skill)}
                  className="rounded"
                />
              )}
              <span className="text-sm">{SKILL_LABEL[skill]}</span>
            </label>
          );
        })}
      </div>
      <div className="text-xs text-white/60">
        Proficiencies: {selected.length}/{choices.proficiencies + backgroundSkills.length}
        {choices.expertise && (
          <span className="ml-2">
            Expertises: {expertiseSelected.length}/{choices.expertise}
          </span>
        )}
      </div>
    </div>
  );
}
