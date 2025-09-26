import { fetchJSON } from "@/api/client";
import type { Race } from "@/models/creatorTwo";

export async function listRacess(): Promise<Race[]> {
  const data = await fetchJSON<Race[]>("/creator/races", {
    requireAuth: true,
    retry401Once: true,
  });
  return data;
}