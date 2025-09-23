export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export type AbilityScores = {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
};

export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  description?: string;
};

export type Feature = {
  id: string;
  name: string;
  summary?: string;
  uses?: number;
  maxUses?: number;
};

export type Skill = {
  key: SkillKey; // e.g., "stealth"
  proficient: boolean;
  expertise?: boolean;
};

export type Character = {
  character_id: string;
  name: string;
  race: string;
  className: string;
  background: string;
  level: number;
  hpCurrent: number;
  hpMax: number;
  ac: number;
  speed: number;
  abilities: AbilityScores;
  skills: Skill[];
  features: Feature[];
  inventory: InventoryItem[];
  spellcasting?: Spellcasting;
  portraitUrl?: string | null;
};

export type SkillKey =
  | "acrobatics"
  | "animalHandling"
  | "arcana"
  | "athletics"
  | "deception"
  | "history"
  | "insight"
  | "intimidation"
  | "investigation"
  | "medicine"
  | "nature"
  | "perception"
  | "performance"
  | "persuasion"
  | "religion"
  | "sleightOfHand"
  | "stealth"
  | "survival";

export interface Spell {
  id: string;
  name: string;
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; // 0 = cantrip
  school?: string;
  prepared?: boolean;
  description?: string;
}

export type SpellLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface SpellSlots {
  max: number;
  used: number;
}

export interface Spellcasting {
  className: string; // e.g., "Arcane Trickster"
  ability: AbilityKey; // spellcasting ability
  slots?: Partial<Record<SpellLevel, SpellSlots>>;
  spells: Spell[]; // include cantrips with level = 0
}

export type ComputedSkill = {
  key: SkillKey;
  label: string;
  ability: AbilityKey;
  scoreMod: number;
  proficient: boolean;
  expertise: boolean;
  bonus: number; // total bonus = mod + prof * (1 or 2)
};

export interface CharacterDerived {
  abilityMods: AbilityScores;
  proficiency: number;
  carryWeight: number;
  skills: ComputedSkill[];
  passivePerception: number;
}
