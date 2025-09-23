import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Character } from "@/models/character";
import {
  listCharacters,
  getCharacterById,
  getActiveCharacterId,
  setActiveCharacterId,
} from "@/api/characterApi";

type CharacterContextValue = {
  character: Character | null; // current active
  characters: Character[]; // all available (dummy for now)
  isLoading: boolean;
  selectCharacter: (id: string) => Promise<void>;
  error: string | null;
};

const CharacterContext = createContext<CharacterContextValue | null>(null);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // on mount: load list + pick active (from localStorage or first)
  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const all = await listCharacters();
        if (!mounted) return;
        setCharacters(all);

        const savedId = getActiveCharacterId() ?? all[0]?.character_id ?? null;
        if (savedId) {
          const active = await getCharacterById(savedId);
          if (!mounted) return;
          if (active) {
            setCharacter(active);
            setActiveCharacterId(savedId);
          } else {
            setError("Saved character not found.");
          }
        } else {
          setError("No characters available.");
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load characters.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function selectCharacter(character_id: string) {
    setIsLoading(true);
    const active = await getCharacterById(character_id);
    setCharacter(active);
    setActiveCharacterId(character_id);
    setIsLoading(false);
  }

  const value = useMemo<CharacterContextValue>(
    () => ({ character, characters, isLoading, selectCharacter, error }),
    [character, characters, isLoading, selectCharacter, error]
  );

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacterContext() {
  const ctx = useContext(CharacterContext);
  if (!ctx)
    throw new Error(
      "useCharacterContext must be used within CharacterProvider"
    );
  return ctx;
}
