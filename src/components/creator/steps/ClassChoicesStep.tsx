import type { Class, CharacterDraft, Background } from "@/models/character/creator";
import SkillChoiceComponent from "../choices/SkillChoiceComponent";
import WeaponChoiceComponent from "../choices/WeaponChoiceComponent";
import SpellChoiceComponent from "../choices/SpellChoiceComponent";


type ClassChoicesStepProps = {
  selectedClass: Class;
  selectedBackground: Background | null;
  draft: CharacterDraft;
  onUpdate: (updates: Partial<CharacterDraft>) => void;
}

export default function ClassChoicesStep({
  selectedClass,
  selectedBackground,
  draft,
  onUpdate,
}: ClassChoicesStepProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="mb-4 text-lg font-semibold">Class Choices</h3>
      <div className="flex-1 space-y-6">
        {selectedClass.skillChoices && (
          <div>
            <h4 className="mb-2 font-medium">Skills</h4>
            <SkillChoiceComponent
              choices={selectedClass.skillChoices}
              selected={draft.skills}
              backgroundSkills={selectedBackground?.skills ?? []}
              onUpdate={(skills) => onUpdate({ skills: skills })}
            />
          </div>
        )}

        {selectedClass.weaponChoices && selectedClass.weaponChoices.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium">Weapons</h4>
            <div className="space-y-3">
              {selectedClass.weaponChoices.map((choice) => (
                <WeaponChoiceComponent
                  key={choice.id}
                  choice={choice}
                  selected={draft.weapons}
                  onUpdate={(weapons) => onUpdate({ weapons: weapons })}
                />
              ))}
            </div>
          </div>
        )}

        {selectedClass.spellChoices && selectedClass.spellChoices.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium">Spells</h4>
            <div className="space-y-3">
              {selectedClass.spellChoices.map((choice) => (
                <SpellChoiceComponent
                  key={choice.id}
                  choice={choice}
                  selected={draft.spells}
                  onUpdate={(spells) => onUpdate({ spells })}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
