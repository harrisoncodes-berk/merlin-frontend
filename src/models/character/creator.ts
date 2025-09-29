import type { AbilityKey, Feature, InventoryItem, Skill, SkillKey, Spell, Weapon } from "./character/common";

export type Race = {
    id: string;
    name: string;
    description: string;
    size: string;
    speed: number;
    abilityBonuses: Partial<Record<AbilityKey, number>>;
    features: Feature[];
}

export type Class = {
    id: string;
    name: string;
    description: string;
    ac: number;
    hitDice: HitDice;
    features?: Feature[];
    skillChoices?: SkillChoices;
    weaponChoices?: WeaponChoice[];
    spellChoices?: SpellChoice[];
}

export type HitDice = {
    id: string;
    name: string; // 1d4
    rolls: number; // 1
    sides: number; // 4
}

export type SkillChoices = {
    proficiencies: number;
    expertise?: number;
    description: string; // Choose 4 skills to be proficicent in
    skills: SkillKey[];
}

export type WeaponChoice = {
    id: string;
    name: string;
    number: number;
    description: string; // Choose 1 weapon to be proficient in
    choices: Weapon[];
}

export type SpellChoice = {
    id: string;
    name: string; // Cantrip, Level 1, etc.
    number: number; // 2
    description: string; // Choose 3 Cantrips
    choices: Spell[];
}

export type Background = {
    id: string;
    classId: string;
    name: string;
    description: string;
    features?: Feature[];
    skills?: Skill[];
    inventory?: InventoryItem[];
}

export type CharacterDraft = {
    name: string;
    classId: string | null;
    raceId: string | null;
    backgroundId: string | null;
    skillProficiencies: SkillKey[]; // TODO: Update to be Skill[]
    weapons: Weapon[]; 
    spells: string[]; // TODO: Update type
    // TODO: Add inventory items
    // TODO: Add ability scores
  }