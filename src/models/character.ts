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

export interface Character {
  core: CharacterCore;
  abilities: AbilityScores;
  features: Feature[];
  inventory: InventoryItem[];
}
