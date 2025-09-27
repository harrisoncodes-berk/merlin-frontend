import type { Class } from "@/models/creatorTwo";

interface ClassStepProps {
  classes: Class[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ClassStep({ classes, selectedId, onSelect }: ClassStepProps) {  
  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="mb-4 text-lg font-semibold">Choose Your Class</h3>
      <div className="flex-1 grid gap-3">
        {classes.map((cls) => (
          <button
            key={cls.id}
            onClick={() => onSelect(cls.id)}
            className={`rounded-xl p-4 text-left ring-1 transition-colors ${
              selectedId === cls.id
                ? "bg-indigo-600/20 ring-indigo-400"
                : "bg-slate-800/50 ring-white/10 hover:bg-slate-700/50"
            }`}
          >
            <div className="font-semibold">{cls.name}</div>
            <div className="mt-1 text-sm text-white/70">{cls.description}</div>
            <div className="mt-2 flex gap-4 text-xs text-white/60">
              <span>AC: {cls.ac}</span>
              <span>Hit Dice: {cls.hitDice.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
