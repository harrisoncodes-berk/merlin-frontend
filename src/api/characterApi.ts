import type { Character } from "@/models/character";
import { fetchJSON } from "@/api/client";


// Be tolerant of either snake_case or camelCase from the server
type ServerCharacter = Partial<
  Character & {
    id?: string; // fallback if server still returns `id`
    character_id: string; // primary id from backend
    class_name?: string;
    hp_current?: number;
    hp_max?: number;
    portrait_url?: string | null;
  }
>;

function normalize(sc: ServerCharacter): Character {
  if (!sc) throw new Error("Empty character payload");

  // Prefer server's character_id; fall back to id if needed
  const id = sc.id ?? sc.character_id!;
  return {
    id,
    name: sc.name!,
    race: sc.race!,
    className: sc.className ?? sc.class_name!,
    background: sc.background!,
    level: sc.level!,
    hpCurrent: sc.hpCurrent ?? sc.hp_current!,
    hpMax: sc.hpMax ?? sc.hp_max!,
    ac: sc.ac!,
    speed: sc.speed!,
    abilities: sc.abilities!,
    skills: sc.skills ?? [],
    features: sc.features ?? [],
    inventory: sc.inventory ?? [],
    spellcasting: sc.spellcasting ?? undefined,
    portraitUrl: sc.portraitUrl ?? sc.portrait_url ?? null,
  };
}

export async function listCharacters(): Promise<Character[]> {
  const data = await fetchJSON<ServerCharacter[]>("/characters", {
    requireAuth: true,
    retry401Once: true,
  });
  return data.map(normalize);
}

export async function getCharacterById(
  id: string
): Promise<Character | null> {
  try {
    const data = await fetchJSON<ServerCharacter>(
      `/characters/${id}`,
      { requireAuth: true, retry401Once: true }
    );
    return normalize(data);
  } catch (err: any) {
    if (err?.status === 404) return null;
    throw err;
  }
}

