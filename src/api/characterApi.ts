import type { Character } from "@/models/character";

const STORAGE_KEY = "merlin.activeCharacterId";

const DUMMY_CHARACTERS: Character[] = [
  {
    character_id: "c-rogue-001",
    name: "Nyx Emberfoot",
    race: "Halfling",
    className: "Rogue",
    background: "Urchin",
    level: 3,
    hpCurrent: 18,
    hpMax: 22,
    ac: 15,
    speed: 25,
    abilities: { str: 8, dex: 18, con: 12, int: 12, wis: 10, cha: 14 },
    skills: [{ key: "stealth", proficient: true, expertise: true }],
    features: [
      {
        id: "feat-sneak",
        name: "Sneak Attack",
        summary: "Extra damage with advantage.",
      },
    ],
    inventory: [
      {
        id: "inv-thieves-tools",
        name: "Thieves' Tools",
        quantity: 1,
        weight: 5,
      },
    ],
    spellcasting: undefined,
    portraitUrl: null,
  },
  {
    character_id: "c-wizard-001",
    name: "Seraphine Vale",
    race: "High Elf",
    className: "Wizard",
    background: "Sage",
    level: 3,
    hpCurrent: 14,
    hpMax: 18,
    ac: 13,
    speed: 30,
    abilities: { str: 8, dex: 14, con: 12, int: 18, wis: 12, cha: 10 },
    skills: [{ key: "arcana", proficient: true }],
    features: [
      {
        id: "feat-ritual",
        name: "Ritual Casting",
        summary:
          "Instead of using a spell slot, you add 10 minutes to the spell's listed casting time. ",
      },
    ],
    inventory: [
      {
        id: "inv-spellbook",
        name: "Spellbook",
        quantity: 1,
        weight: 1,
      },
    ],
    spellcasting: undefined,
    portraitUrl: null,
  },
];

export async function listCharacters(): Promise<Character[]> {
  // mimic latency
  await new Promise((r) => setTimeout(r, 120));
  return DUMMY_CHARACTERS;
}

export async function getCharacterById(
  character_id: string
): Promise<Character | null> {
  await new Promise((r) => setTimeout(r, 80));
  return DUMMY_CHARACTERS.find((c) => c.character_id === character_id) ?? null;
}

export function getActiveCharacterId(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setActiveCharacterId(id: string) {
  localStorage.setItem(STORAGE_KEY, id);
}
