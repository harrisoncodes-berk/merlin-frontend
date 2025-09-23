import { useMemo } from "react";
import { useCharacterContext } from "@/contexts/CharacterProvider";
import {
  allAbilityMods,
  proficiencyFromLevel,
  totalWeight,
} from "@/lib/ability";
import { computeSkills } from "@/lib/skills";
import type { CharacterDerived } from "@/models/character";

export function useCharacter() {
  const { character, isLoading, error, selectCharacter } =
    useCharacterContext();

  const derived = useMemo<CharacterDerived | null>(() => {
    if (!character) return null;

    const abilityMods = allAbilityMods(character.abilities);
    const proficiency = proficiencyFromLevel(character.level); // ← flat field now
    const carryWeight = totalWeight(character.inventory);
    const skillCalc = computeSkills(
      character.abilities,
      proficiency,
      character.skills
    );

    return {
      abilityMods,
      proficiency,
      carryWeight,
      skills: skillCalc.list,
      passivePerception: skillCalc.passivePerception,
    };
  }, [character]);

  return {
    character,
    derived,
    loading: isLoading,
    error,
    // optional helper if callers want to change characters
    selectCharacter,
  } as const;
}
