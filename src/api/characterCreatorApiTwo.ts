import { fetchJSON } from "@/api/client";
import type { Background, Class, Race } from "@/models/creatorTwo";

export async function listRaces(): Promise<Race[]> {
  console.log('listRaces');
  const data = await fetchJSON<Race[]>("/creator/races", {
    requireAuth: true,
    retry401Once: true,
  });
  console.log('races data', data);
  return data;
}

export async function listClasses(): Promise<Class[]> {
  console.log('listClasses');
  const data = await fetchJSON<Class[]>("/creator/classes", {
    requireAuth: true,
    retry401Once: true,
  });
  console.log('classes data', data);
  return data;
}
  
export async function listBackgrounds(): Promise<Background[]> {
  const data = await fetchJSON<Background[]>("/creator/backgrounds", {
    requireAuth: true,
    retry401Once: true,
  });
  return data;
}
