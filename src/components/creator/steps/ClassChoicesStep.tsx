import type { Class, CharacterDraft } from "@/models/creatorTwo";
import SkillChoiceComponent from "../choices/SkillChoiceComponent";
import WeaponChoiceComponent from "../choices/WeaponChoiceComponent";
import SpellChoiceComponent from "../choices/SpellChoiceComponent";


type ClassChoicesStepProps = {
  selectedClass: Class;
  draft: CharacterDraft;
  onUpdate: (updates: Partial<CharacterDraft>) => void;
}

export default function ClassChoicesStep({
  selectedClass,
  draft,
  onUpdate,
}: ClassChoicesStepProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="mb-4 text-lg font-semibold">Class Choices</h3>
      <div className="flex-1 space-y-6">
        {selectedClass.skillChoices && (
          <div>
            <h4 className="mb-2 font-medium">Skill Proficiencies</h4>
            <div className="text-sm text-white/70 mb-3">
              {selectedClass.skillChoices.description}
            </div>
            <SkillChoiceComponent
              choices={selectedClass.skillChoices}
              selected={draft.skillProficiencies}
              onUpdate={(skills) => onUpdate({ skillProficiencies: skills })}
            />
          </div>
        )}

        {selectedClass.weaponChoices && selectedClass.weaponChoices.length > 0 && (
          <div>
            <h4 className="mb-2 font-medium">Weapon Proficiencies</h4>
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
