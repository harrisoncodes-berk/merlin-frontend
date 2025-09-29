import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Character } from "@/models/character/character";
import { listCharacters, getCharacterById } from "@/api/characterApi";
import { useAuth } from "@/contexts/AuthProvider";

type CharacterContextValue = {
  character: Character | null;
  characters: Character[];
  isLoading: boolean;
  error: string | null;
  selectCharacter: (id: string) => Promise<void>;
};

const CharacterContext = createContext<CharacterContextValue | null>(null);

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();

  const [characters, setCharacters] = useState<Character[]>([]);
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (authLoading) return;

    if (!user) {
      setCharacters([]);
      setCharacter(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const all = await listCharacters();
        if (!mounted) return;
        setCharacters(all);

        if (!all.length) {
          setCharacter(null);
          setError("No characters available.");
          return;
        }

        const initialId = all[0].id;
        const active = await getCharacterById(initialId);
        if (!mounted) return;
        setCharacter(active ?? all[0]);
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
  }, [user?.id, authLoading]);

  async function selectCharacter(id: string) {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const active = await getCharacterById(id);
      setCharacter(active);
    } finally {
      setIsLoading(false);
    }
  }

  const value = useMemo(
    () => ({ character, characters, isLoading, error, selectCharacter }),
    [character, characters, isLoading, error]
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
