import { useEffect, useMemo, useState } from "react";
import type { Character } from "@/models/character";
import { getCharacter } from "@/api/characterApi";
import {
  allAbilityMods,
  proficiencyFromLevel,
  totalWeight,
} from "@/lib/ability";

export function useCharacter() {
  const [data, setData] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCharacter()
      .then((c) => {
        if (!cancelled) {
          setData(c);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? "Failed to load character");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const derived = useMemo(() => {
    if (!data) return null;
    const mods = allAbilityMods(data.abilities);
    const prof = proficiencyFromLevel(data.core.level);
    const carry = totalWeight(data.inventory);
    return { mods, proficiency: prof, totalWeight: carry };
  }, [data]);

  return { character: data, derived, loading, error } as const;
}
