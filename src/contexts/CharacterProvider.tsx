import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Character } from "@/models/character/character";
import { useAuth } from "@/contexts/AuthProvider";
import { useCharacterQuery, useCharactersQuery } from "@/hooks/queries/character";

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

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    data: characters = [],
    isLoading: charactersLoading,
    error: charactersError,
  } = useCharactersQuery(!!user && !authLoading);

  // Choose initial character when list loads
  useEffect(() => {
    if (!charactersLoading && characters.length && !selectedId) {
      setSelectedId(characters[0].id);
    }
    if (!charactersLoading && characters.length === 0) {
      setSelectedId(null);
    }
  }, [charactersLoading, characters, selectedId]);

  const {
    data: character,
    isLoading: characterLoading,
  } = useCharacterQuery(selectedId, !!user && !authLoading);

  function selectCharacter(id: string) {
    setSelectedId(id);
  }

  const isLoading = authLoading || charactersLoading || (!!selectedId && characterLoading);
  const error = charactersError ? (charactersError as any)?.message ?? "Failed to load characters." : null;

  const value = useMemo(
    () => ({ character: character ?? null, characters, isLoading, error, selectCharacter }),
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
