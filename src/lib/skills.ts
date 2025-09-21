import type {
  AbilityKey,
  AbilityScores,
  SkillKey,
  SkillProficiency,
} from "@/models/character";
import { abilityMod } from "@/lib/ability";

export const SKILL_TO_ABILITY: Record<SkillKey, AbilityKey> = {
  acrobatics: "dex",
  animalHandling: "wis",
  arcana: "int",
  athletics: "str",
  deception: "cha",
  history: "int",
  insight: "wis",
  intimidation: "cha",
  investigation: "int",
  medicine: "wis",
  nature: "int",
  perception: "wis",
  performance: "cha",
  persuasion: "cha",
  religion: "int",
  sleightOfHand: "dex",
  stealth: "dex",
  survival: "wis",
};

export const SKILL_LABEL: Record<SkillKey, string> = {
  acrobatics: "Acrobatics",
  animalHandling: "Animal Handling",
  arcana: "Arcana",
  athletics: "Athletics",
  deception: "Deception",
  history: "History",
  insight: "Insight",
  intimidation: "Intimidation",
  investigation: "Investigation",
  medicine: "Medicine",
  nature: "Nature",
  perception: "Perception",
  performance: "Performance",
  persuasion: "Persuasion",
  religion: "Religion",
  sleightOfHand: "Sleight of Hand",
  stealth: "Stealth",
  survival: "Survival",
};

export type ComputedSkill = {
  key: SkillKey;
  label: string;
  ability: AbilityKey;
  scoreMod: number;
  proficient: boolean;
  expertise: boolean;
  bonus: number; // total bonus = mod + prof * (1 or 2)
};

export function computeSkills(
  abilities: AbilityScores,
  profBonus: number,
  profs: SkillProficiency[] | undefined
): { list: ComputedSkill[]; passivePerception: number } {
  const profMap = new Map<SkillKey, SkillProficiency>();
  (profs ?? []).forEach((p) => profMap.set(p.key, p));
  const list: ComputedSkill[] = Object.keys(SKILL_TO_ABILITY).map((k) => {
    const key = k as SkillKey;
    const ability = SKILL_TO_ABILITY[key];
    const mod = abilityMod(abilities[ability]);
    const p = profMap.get(key);
    const proficient = !!p?.proficient;
    const expertise = !!p?.expertise;
    const profAdd = proficient ? (expertise ? profBonus * 2 : profBonus) : 0;
    return {
      key,
      label: SKILL_LABEL[key],
      ability,
      scoreMod: mod,
      proficient,
      expertise,
      bonus: mod + profAdd,
    };
  });
  const perception = list.find((s) => s.key === "perception")!;
  const passivePerception = 10 + perception.bonus;
  return { list, passivePerception };
}
