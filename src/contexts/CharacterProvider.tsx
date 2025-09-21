import { createContext, useContext, type ReactNode } from "react";
import { useCharacter } from "@/hooks/useCharacter";

type CharacterContextValue = ReturnType<typeof useCharacter>;

const CharacterContext = createContext<CharacterContextValue | null>(null);

export function CharacterProvider({ children }: { children: ReactNode }) {
  const value = useCharacter();
  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}

export function useCharacterContext() {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error("useCharacterContext must be used within <CharacterProvider>");
  return ctx;
}
