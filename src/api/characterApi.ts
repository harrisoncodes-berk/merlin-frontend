import type { Character } from "@/models/character";

let MOCK: Character = {
  core: {
    id: "pc1",
    name: "Ryn",
    race: "Lightfoot Halfling",
    className: "Rogue",
    background: "Urchin",
    level: 1,
    hp: { current: 9, max: 9 },
    ac: 14,
    speed: 25,
  },
  abilities: { str: 8, dex: 17, con: 12, int: 12, wis: 13, cha: 10 },
  features: [
    {
      id: "feat_sneak_attack",
      name: "Sneak Attack",
      summary: "+1d6 once/turn on qualifying attacks.",
    },
    {
      id: "feat_cunning_action",
      name: "Cunning Action",
      summary: "Dash, Disengage, or Hide as a bonus action.",
    },
  ],
  inventory: [
    {
      id: "inv_dagger",
      name: "Dagger",
      qty: 1,
      weight: 1,
      description: "Finesse, light, thrown (20/60).",
    },
    {
      id: "inv_thieves",
      name: "Thieves' Tools",
      qty: 1,
      weight: 1,
      description: "For locks & traps.",
    },
    { id: "inv_rope", name: "Silk Rope (50 ft)", qty: 1, weight: 5 },
    { id: "inv_rations", name: "Rations (1 day)", qty: 3, weight: 2 },
  ],
  skills: [
    { key: "acrobatics", proficient: true },
    { key: "sleightOfHand", proficient: true, expertise: true },
    { key: "stealth", proficient: true, expertise: true },
    { key: "perception", proficient: true },
    { key: "investigation", proficient: true },
  ],
  // Example for an Arcane Trickster at L3; at L1 this could be empty.
  spellcasting: {
    className: "Arcane Trickster",
    ability: "int",
    slots: { 1: { max: 2, used: 0 } },
    spells: [
      {
        id: "sp_mage_hand",
        name: "Mage Hand",
        level: 0,
        description: "Create a spectral hand to manipulate objects.",
      },
      {
        id: "sp_minor_illusion",
        name: "Minor Illusion",
        level: 0,
        description: "Sound or image that fits within a 5-foot cube.",
      },
      {
        id: "sp_disguise_self",
        name: "Disguise Self",
        level: 1,
        prepared: true,
        description: "Change your appearance for 1 hour.",
      },
    ],
  },
};

export async function getCharacter(): Promise<Character> {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 150));
  return JSON.parse(JSON.stringify(MOCK));
}
