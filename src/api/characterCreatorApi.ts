import { fetchJSON } from "@/api/client";
import type { Background, Class, Race, CharacterDraft } from "@/models/character/creator";
import type { Character } from "@/models/character/character";

export async function listRaces(): Promise<Race[]> {
  const data = await fetchJSON<Race[]>("/creator/races", {
    requireAuth: true,
    retry401Once: true,
  });
  return data;
}

export async function listClasses(): Promise<Class[]> {
  const data = await fetchJSON<Class[]>("/creator/classes", {
    requireAuth: true,
    retry401Once: true,
  });
  return data;
}
  
export async function listBackgrounds(): Promise<Background[]> {
  const data = await fetchJSON<Background[]>("/creator/backgrounds", {
    requireAuth: true,
    retry401Once: true,
  });
  return data;
}

export async function createCharacter(character: CharacterDraft): Promise<Character> {
  const data = await fetchJSON<Character>("/creator/characters", {
    method: "POST",
    body: character,
    requireAuth: true,
    retry401Once: true,
  });
  return data;
}
