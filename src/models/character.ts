export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface AbilityScores {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface CharacterCore {
  id: string;
  name: string;
  race: string;
  className: string; // e.g., "Rogue"
  background: string;
  level: number;
  hp: { current: number; max: number };
  ac: number; // armor class
  speed: number; // feet
}

export interface Feature {
  id: string;
  name: string;
  summary: string;
  uses?: number;
  maxUses?: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  qty: number;
  weight: number; // per item, in lb
  description?: string;
}

/** ---------- Skills ---------- */
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

export interface SkillProficiency {
  key: SkillKey;
  proficient: boolean;
  expertise?: boolean; // counts as double proficiency if true
}

/** ---------- Spells ---------- */
export interface Spell {
  id: string;
  name: string;
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; // 0 = cantrip
  school?: string;
  prepared?: boolean;
  description?: string; // short summary for now
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

/** ---------- Aggregate ---------- */
export interface Character {
  core: CharacterCore;
  abilities: AbilityScores;
  features: Feature[];
  inventory: InventoryItem[];
  skills?: SkillProficiency[]; // optional, else defaults to none
  spellcasting?: Spellcasting; // optional (non-casters)
}
