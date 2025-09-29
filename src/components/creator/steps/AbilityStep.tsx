import { type AbilityKey, ABILITY_NAMES, type AbilityScores } from "@/models/character/common";

interface AbilityStepProps {
  abilities: AbilityScores;
  onUpdate: (abilities: AbilityScores) => void;
}

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export default function AbilityStep({ abilities, onUpdate }: AbilityStepProps) {
  const usedScores = Object.values(abilities).filter(score => score > 0);
  const availableScores = STANDARD_ARRAY.filter(score => !usedScores.includes(score));

  function assignScore(ability: AbilityKey, score: number) {
    const newAbilities = { ...abilities, [ability]: score };

    onUpdate(newAbilities);
  }

  function clearAbility(ability: AbilityKey) {
    const newAbilities = { ...abilities, [ability]: 0 };
    onUpdate(newAbilities);
  }

  function getModifier(score: number): string {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="mb-4 text-lg font-semibold">Ability Scores</h3>

      <div className="flex-1 space-y-6">
        {/* Ability Assignments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(ABILITY_NAMES) as AbilityKey[]).map((ability) => (
            <div
              key={ability}
              className="rounded-xl bg-slate-800/50 p-4 ring-1 ring-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="font-medium text-white/90">
                    {ABILITY_NAMES[ability]}
                  </h5>
                  <div className="text-xs text-white/60 uppercase tracking-wide">
                    {ability}
                  </div>
                </div>
                {abilities[ability] > 0 && (
                  <button
                    onClick={() => clearAbility(ability)}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {abilities[ability] > 0 ? (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {abilities[ability]}
                  </div>
                  <div className="text-sm text-white/70">
                    Modifier: {getModifier(abilities[ability])}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm text-white/60 mb-2">Choose a score:</div>
                  <div className="flex gap-2 flex-wrap">
                    {availableScores.map((score) => (
                      <button
                        key={score}
                        onClick={() => assignScore(ability, score)}
                        className="px-3 py-1 bg-slate-700/50 hover:bg-slate-600/50 rounded border border-white/10 text-white/90 font-mono transition-colors"
                      >
                        {score}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
