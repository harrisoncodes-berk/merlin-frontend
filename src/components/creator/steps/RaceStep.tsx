import type { Race } from "@/models/creatorTwo";

interface RaceStepProps {
  races: Race[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function RaceStep({ races, selectedId, onSelect }: RaceStepProps) {  
  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="mb-4 text-lg font-semibold">Choose Your Race</h3>
      <div className="flex-1 grid gap-3">
        {races.map((race) => (
          <button
            key={race.id}
            onClick={() => onSelect(race.id)}
            className={`rounded-xl p-4 text-left ring-1 transition-colors ${
              selectedId === race.id
                ? "bg-indigo-600/20 ring-indigo-400"
                : "bg-slate-800/50 ring-white/10 hover:bg-slate-700/50"
            }`}
          >
            <div className="font-semibold">{race.name}</div>
            <div className="mt-1 text-sm text-white/70">{race.description}</div>
            <div className="mt-2 flex gap-4 text-xs text-white/60">
              <span>Size: {race.size}</span>
              <span>Speed: {race.speed} ft</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
