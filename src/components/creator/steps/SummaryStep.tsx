import type { CharacterDraft, Class, Race, Background } from "@/models/character/creator";

type SummaryStepProps = {
  draft: CharacterDraft;
  selectedClass: Class | null;
  selectedRace: Race | null;
  selectedBackground: Background | null;
}

export default function SummaryStep({ // TODO: Improve this component
  draft,
  selectedClass,
  selectedRace,
  selectedBackground,
}: SummaryStepProps) {
  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="mb-4 text-lg font-semibold">Character Summary</h3>
      <div className="flex-1 space-y-4">
        <div className="rounded-xl bg-slate-800/50 p-4 ring-1 ring-white/10">
          <div className="font-semibold text-lg">{draft.name}</div>
          <div className="text-sm text-white/70">
            {selectedRace?.name} {selectedClass?.name}
          </div>
          <div className="text-sm text-white/60">
            Background: {selectedBackground?.name}
          </div>
        </div>

        {selectedClass && (
          <div className="rounded-xl bg-slate-800/50 p-4 ring-1 ring-white/10">
            <div className="mb-2 font-medium">Class Features</div>
            <div className="text-sm text-white/70">
              AC: {selectedClass.ac} • Hit Dice: {selectedClass.hitDice.name}
            </div>
            {selectedClass.features && selectedClass.features.length > 0 && (
              <div className="mt-2">
                <div className="text-xs text-white/60 mb-1">Features:</div>
                <div className="space-y-1">
                  {selectedClass.features.map((feature) => (
                    <div key={feature.id} className="text-sm">
                      <span className="font-medium">{feature.name}</span>
                      {feature.description && (
                        <span className="text-white/70"> - {feature.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
