import { useEffect, useMemo, useState } from "react";
import type { Character } from "@/models/character";
import { getCharacter } from "@/api/characterApi";
import {
  allAbilityMods,
  proficiencyFromLevel,
  totalWeight,
} from "@/lib/ability";
import { computeSkills } from "@/lib/skills";

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
    const proficiency = proficiencyFromLevel(data.core.level);
    const carry = totalWeight(data.inventory);
    const skillCalc = computeSkills(data.abilities, proficiency, data.skills);
    return {
      mods,
      proficiency,
      totalWeight: carry,
      skills: skillCalc.list,
      passivePerception: skillCalc.passivePerception,
    };
  }, [data]);

  return { character: data, derived, loading, error } as const;
}
