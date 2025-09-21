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
      summary:
        "Once per turn, deal +1d6 damage if you have advantage or an ally adjacent to the target.",
    },
    {
      id: "feat_cunning_action",
      name: "Cunning Action",
      summary: "On your turn, Dash, Disengage, or Hide as a bonus action.",
    },
  ],
  inventory: [
    {
      id: "inv_dagger",
      name: "Dagger",
      qty: 1,
      weight: 1,
      description: "Simple melee, finesse, light, thrown (20/60).",
    },
    {
      id: "inv_thieves",
      name: "Thieves' Tools",
      qty: 1,
      weight: 1,
      description: "Picks, files, and small mirrors for locks and traps.",
    },
    {
      id: "inv_rope",
      name: "Silk Rope (50 ft)",
      qty: 1,
      weight: 5,
      description: "Knotted lengths for climbing and tying.",
    },
    {
      id: "inv_rations",
      name: "Rations (1 day)",
      qty: 3,
      weight: 2,
      description: "Dried meats, hardtack, and nuts.",
    },
  ],
};

export async function getCharacter(): Promise<Character> {
  // Simulate latency
  await new Promise((r) => setTimeout(r, 150));
  return JSON.parse(JSON.stringify(MOCK));
}
