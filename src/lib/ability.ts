import type {
  AbilityKey,
  AbilityScores,
  InventoryItem,
} from "@/models/character";

export function abilityMod(score: number): number {
  // 5e: floor((score - 10)/2)
  return Math.floor((score - 10) / 2);
}

export function allAbilityMods(a: AbilityScores): Record<AbilityKey, number> {
  return {
    str: abilityMod(a.str),
    dex: abilityMod(a.dex),
    con: abilityMod(a.con),
    int: abilityMod(a.int),
    wis: abilityMod(a.wis),
    cha: abilityMod(a.cha),
  };
}

export function proficiencyFromLevel(level: number): number {
  // 5e table compressed; good enough for read-only
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

export function totalWeight(items: InventoryItem[]): number {
  return items.reduce((sum, it) => sum + it.weight * it.quantity, 0);
}
