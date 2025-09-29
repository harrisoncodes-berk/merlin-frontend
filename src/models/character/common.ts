export type HitDice = {
    name: string;
    rolls: number;
    sides: number;
}

export type AbilityScores = {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
};

export type Feature = {
    id: string;
    name: string;
    description?: string;
    uses?: number;
    maxUses?: number;
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

export type Skill = {
    key: SkillKey;
    proficient: boolean;
    expertise?: boolean;
};

export type Weapon = {
    id: string;
    name: string;
    description: string;
    hitDice: HitDice;
}

export interface Spell {
    id: string;
    name: string;
    level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; // 0 = cantrip
    school?: string;
    prepared?: boolean;
    description?: string;
}

export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export const ABILITY_NAMES: Record<AbilityKey, string> = {
    str: "Strength",
    dex: "Dexterity",
    con: "Constitution",
    int: "Intelligence",
    wis: "Wisdom",
    cha: "Charisma"
};

export type InventoryItem = {
    id: string;
    name: string;
    quantity: number;
    weight: number;
    description?: string;
};