import type {
  Race,
  ClassDef,
  Background,
  Weapon,
  EquipmentPack,
  CharacterDraft,
  CreatedCharacter,
  AbilityKey,
} from "@/models/creator";

/** ---------- Dummy Data ---------- */

const RACES: Race[] = [
  {
    race_id: "halfling",
    name: "Halfling",
    description: "Small folk with nimble feet.",
    base_speed: 25,
    ability_bonuses: { dex: 2, cha: 1 },
    features: [{ id: "lucky", name: "Lucky", summary: "Reroll 1s on d20." }],
  },
  {
    race_id: "goliath",
    name: "Goliath",
    description: "Towering mountain-born.",
    base_speed: 30,
    ability_bonuses: { str: 2, con: 1 },
    features: [
      {
        id: "powerful_build",
        name: "Powerful Build",
        summary: "Count as one size larger.",
      },
    ],
  },
  {
    race_id: "high_elf",
    name: "High Elf",
    description: "Graceful, learned elves.",
    base_speed: 30,
    ability_bonuses: { dex: 2, int: 1 },
    features: [
      { id: "cantrip", name: "Cantrip", summary: "One wizard cantrip." },
    ],
  },
];

const CLASSES: ClassDef[] = [
  {
    class_id: "rogue",
    name: "Rogue",
    description: "Sneaky experts.",
    hit_die: 8,
    primary_ability: "dex",
    saving_throws: ["dex", "int"],
    skill_choices: {
      count: 4,
      options: [
        "acrobatics",
        "athletics",
        "deception",
        "investigation",
        "perception",
        "sleight_of_hand",
        "stealth",
      ],
    },
    features: [
      {
        id: "sneak_attack",
        name: "Sneak Attack",
        summary: "Extra damage with advantage.",
      },
    ],
  },
  {
    class_id: "barbarian",
    name: "Barbarian",
    description: "Primal warriors.",
    hit_die: 12,
    primary_ability: "str",
    saving_throws: ["str", "con"],
    skill_choices: {
      count: 2,
      options: [
        "animal_handling",
        "athletics",
        "intimidation",
        "nature",
        "perception",
        "survival",
      ],
    },
    features: [
      { id: "rage", name: "Rage", summary: "Bonus damage, resistances." },
    ],
  },
  {
    class_id: "wizard",
    name: "Wizard",
    description: "Scholars of arcana.",
    hit_die: 6,
    primary_ability: "int",
    saving_throws: ["int", "wis"],
    skill_choices: {
      count: 2,
      options: [
        "arcana",
        "history",
        "insight",
        "investigation",
        "medicine",
        "religion",
      ],
    },
    features: [
      {
        id: "spellcasting",
        name: "Spellcasting",
        summary: "Study-based magic.",
      },
    ],
  },
];

const BACKGROUNDS: Background[] = [
  {
    background_id: "urchin",
    name: "Urchin",
    description: "Street-raised survivor.",
    features: [
      {
        id: "city_secrets",
        name: "City Secrets",
        summary: "Know urban shortcuts.",
      },
    ],
    skill_proficiencies: ["sleight_of_hand", "stealth"],
  },
  {
    background_id: "warrior",
    name: "Warrior",
    description: "Veteran of many fights.",
    features: [
      {
        id: "military_rank",
        name: "Military Rank",
        summary: "Command respect among soldiers.",
      },
    ],
    skill_proficiencies: ["athletics", "intimidation"],
  },
  {
    background_id: "sage",
    name: "Sage",
    description: "Researcher and academic.",
    features: [
      { id: "researcher", name: "Researcher", summary: "Find lore with ease." },
    ],
    skill_proficiencies: ["arcana", "history"],
  },
];

const WEAPONS: Weapon[] = [
  {
    weapon_id: "shortsword",
    name: "Shortsword",
    category: "martial",
    damage_dice: "1d6",
    damage_type: "piercing",
    properties: ["finesse", "light"],
    description: "A light, quick blade.",
  },
  {
    weapon_id: "greataxe",
    name: "Greataxe",
    category: "martial",
    damage_dice: "1d12",
    damage_type: "slashing",
    properties: ["heavy", "two_handed"],
    description: "A brutal two-handed axe.",
  },
  {
    weapon_id: "sling",
    name: "Sling",
    category: "simple",
    damage_dice: "1d4",
    damage_type: "bludgeoning",
    properties: ["ammunition", "range_30_120"],
    description: "A leather sling for stones.",
  },
];

const PACKS: EquipmentPack[] = [
  {
    pack_id: "explorers_pack",
    name: "Explorer’s Pack",
    description: "All-around adventuring kit.",
    items: [
      { name: "Backpack", qty: 1 },
      { name: "Bedroll", qty: 1 },
      { name: "Rations (days)", qty: 10 },
    ],
  },
  {
    pack_id: "burglars_pack",
    name: "Burglar’s Pack",
    description: "Tools for a quiet entry.",
    items: [
      { name: "Backpack", qty: 1 },
      { name: "Ball bearings (bag)", qty: 1 },
      { name: "String (feet)", qty: 10 },
    ],
  },
];

/** “Dependencies” (allowed choices) */
const CLASS_BG_ALLOWED: Record<string, string[]> = {
  rogue: ["urchin", "sage"],
  barbarian: ["warrior"],
  wizard: ["sage"],
};
const CLASS_WEAPON_ALLOWED: Record<string, string[]> = {
  rogue: ["shortsword", "sling"],
  barbarian: ["greataxe"],
  wizard: ["sling"],
};
const CLASS_PACK_ALLOWED: Record<string, string[]> = {
  rogue: ["burglars_pack"],
  barbarian: ["explorers_pack"],
  wizard: ["explorers_pack"],
};

/** ---------- API-like functions ---------- */

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function listRaces(): Promise<Race[]> {
  await sleep(80);
  return RACES;
}

export async function listClasses(): Promise<ClassDef[]> {
  await sleep(80);
  return CLASSES;
}

export async function listBackgroundsForClass(
  class_id: string | null
): Promise<Background[]> {
  await sleep(60);
  if (!class_id) return BACKGROUNDS;
  const allowed = new Set(CLASS_BG_ALLOWED[class_id] ?? []);
  return BACKGROUNDS.filter((b) => allowed.has(b.background_id));
}

export async function listWeaponsForClass(
  class_id: string | null
): Promise<Weapon[]> {
  await sleep(60);
  if (!class_id) return WEAPONS;
  const allowed = new Set(CLASS_WEAPON_ALLOWED[class_id] ?? []);
  return WEAPONS.filter((w) => allowed.has(w.weapon_id));
}

export async function listPacksForClass(
  class_id: string | null
): Promise<EquipmentPack[]> {
  await sleep(60);
  if (!class_id) return PACKS;
  const allowed = new Set(CLASS_PACK_ALLOWED[class_id] ?? []);
  return PACKS.filter((p) => allowed.has(p.pack_id));
}

/** Defaults until you add ability picking */
function defaultAbilitiesForClass(
  class_id: string
): Record<AbilityKey, number> {
  switch (class_id) {
    case "rogue":
      return { str: 8, dex: 16, con: 12, int: 12, wis: 10, cha: 14 };
    case "barbarian":
      return { str: 16, dex: 12, con: 16, int: 8, wis: 12, cha: 8 };
    case "wizard":
      return { str: 8, dex: 14, con: 12, int: 16, wis: 12, cha: 10 };
    default:
      return { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
  }
}

function acForClass(class_id: string): number {
  if (class_id === "barbarian") return 14;
  if (class_id === "rogue") return 15;
  if (class_id === "wizard") return 13;
  return 12;
}

/** Mock “create” */
export async function createCharacterFromDraft(
  draft: CharacterDraft
): Promise<CreatedCharacter> {
  await sleep(200);

  if (
    !draft.name ||
    !draft.race_id ||
    !draft.class_id ||
    !draft.background_id
  ) {
    throw new Error("Missing required fields");
  }

  const race = RACES.find((r) => r.race_id === draft.race_id)!;
  const klass = CLASSES.find((c) => c.class_id === draft.class_id)!;
  const bg = BACKGROUNDS.find((b) => b.background_id === draft.background_id)!;

  const abilities = defaultAbilitiesForClass(klass.class_id);
  const level = 1;
  const hpMax = klass.hit_die; // L1 baseline
  const speed = race.base_speed;
  const ac = acForClass(klass.class_id);

  const inventory = [
    ...draft.weapon_ids.map((id) => {
      const w = WEAPONS.find((x) => x.weapon_id === id)!;
      return { id: `inv-${id}`, name: w.name, quantity: 1, weight: 2 };
    }),
  ];

  if (draft.pack_id) {
    const pack = PACKS.find((p) => p.pack_id === draft.pack_id)!;
    inventory.push({
      id: `pack-${pack.pack_id}`,
      name: pack.name,
      quantity: 1,
      weight: 15,
    });
  }

  return {
    character_id: `char_${Math.random().toString(36).slice(2, 10)}`,
    name: draft.name,
    race: race.name,
    className: klass.name,
    background: bg.name,
    level,
    hpCurrent: hpMax,
    hpMax,
    ac,
    speed,
    abilities,
    inventory,
    features: [...race.features, ...klass.features, ...bg.features],
    skills: bg.skill_proficiencies.map((k) => ({ key: k, proficient: true })),
    spellcasting:
      klass.class_id === "wizard" ? { className: "Wizard" } : undefined,
    portraitUrl: null,
  };
}
