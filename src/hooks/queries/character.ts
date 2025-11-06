import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listCharacters, getCharacterById } from "@/api/characterApi";
import { createCharacter } from "@/api/characterCreatorApi";
import { queryKeys } from "@/lib/queryKeys";
import type { Character } from "@/models/character/character";
import type { CharacterDraft } from "@/models/character/creator";

export function useCharactersQuery(enabled = true) {
  return useQuery<Character[]>({
    queryKey: queryKeys.characters.list,
    queryFn: listCharacters,
    enabled,
  });
}

export function useCharacterQuery(id: string | null, enabled = true) {
  return useQuery<Character | null>({
    queryKey: id ? queryKeys.characters.detail(id) : ["characters", "detail", "none"],
    queryFn: () => getCharacterById(id!),
    enabled: !!id && enabled,
  });
}

export function useCreateCharacterMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (draft: CharacterDraft) => createCharacter(draft),
    onSuccess: (created: Character) => {
      qc.setQueryData<Character[]>(queryKeys.characters.list, (prev) =>
        Array.isArray(prev) ? [created, ...prev] : [created]
      );
      qc.invalidateQueries({ queryKey: queryKeys.characters.all });
    },
  });
}


