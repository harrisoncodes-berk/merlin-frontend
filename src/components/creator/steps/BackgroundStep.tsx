import type { Background } from "@/models/character/creator";

interface BackgroundStepProps {
  backgrounds: Background[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function BackgroundStep({ backgrounds, selectedId, onSelect }: BackgroundStepProps) {  
  return (
    <div className="h-full w-full flex flex-col">
      <h3 className="mb-4 text-lg font-semibold">Choose Your Background</h3>
      <div className="flex-1 grid gap-3">
        {backgrounds.map((bg) => (
          <button
            key={bg.id}
            onClick={() => onSelect(bg.id)}
            className={`rounded-xl p-4 text-left ring-1 transition-colors ${
              selectedId === bg.id
                ? "bg-indigo-600/20 ring-indigo-400"
                : "bg-slate-800/50 ring-white/10 hover:bg-slate-700/50"
            }`}
          >
            <div className="font-semibold">{bg.name}</div>
            <div className="mt-1 text-sm text-white/70">{bg.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
