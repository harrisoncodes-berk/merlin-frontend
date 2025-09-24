export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export type Feature = { id: string; name: string; summary: string };

export type Race = {
  race_id: string;
  name: string;
  description?: string;
  base_speed: number;
  ability_bonuses: Partial<Record<AbilityKey, number>>;
  features: Feature[];
};

export type ClassDef = {
  class_id: string;
  name: string;
  description?: string;
  hit_die: number; // e.g. 8 for Rogue
  primary_ability: AbilityKey; // e.g. "dex"
  saving_throws: AbilityKey[];
  skill_choices: { count: number; options: string[] };
  features: Feature[];
};

export type Background = {
  background_id: string;
  name: string;
  description?: string;
  features: Feature[];
  skill_proficiencies: string[]; // simple strings is fine for now
};

export type Weapon = {
  weapon_id: string;
  name: string;
  category: string;
  damage_dice: string;
  damage_type: string;
  properties: string[];
  description?: string;
};

export type EquipmentPack = {
  pack_id: string;
  name: string;
  description?: string;
  items: Array<{ name: string; qty: number }>;
};

/** Draft your UI edits before finalizing a character */
export type CharacterDraft = {
  name: string;
  race_id: string | null;
  class_id: string | null;
  background_id: string | null;
  weapon_ids: string[];
  pack_id: string | null;
};

/** Minimal character shape you can send to your existing Character model later */
export type CreatedCharacter = {
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
  abilities: Record<AbilityKey, number>;
  inventory: Array<{
    id: string;
    name: string;
    quantity: number;
    weight: number;
  }>;
  features: Feature[];
  skills: Array<{ key: string; proficient: boolean; expertise?: boolean }>;
  spellcasting?: unknown;
  portraitUrl: string | null;
};
