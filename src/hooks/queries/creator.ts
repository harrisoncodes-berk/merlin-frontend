import { useQuery } from "@tanstack/react-query";
import { listBackgrounds, listClasses, listRaces } from "@/api/characterCreatorApi";
import { queryKeys } from "@/lib/queryKeys";
import type { Race, Class, Background } from "@/models/character/creator";

export const useRacesQuery = (enabled = true) =>
  useQuery<Race[]>({ queryKey: queryKeys.creator.races, queryFn: listRaces, enabled });

export const useClassesQuery = (enabled = true) =>
  useQuery<Class[]>({ queryKey: queryKeys.creator.classes, queryFn: listClasses, enabled });

export const useBackgroundsQuery = (enabled = true) =>
  useQuery<Background[]>({ queryKey: queryKeys.creator.backgrounds, queryFn: listBackgrounds, enabled });


