import { useNavigate } from "react-router-dom";
import { useCharacterContext } from "@/contexts/CharacterProvider";

export default function CharacterSelectPage() {
  const { characters, selectCharacter, isLoading, character } = useCharacterContext();
  const navigate = useNavigate();

  if (isLoading && characters.length === 0) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-200">
        <div className="animate-pulse text-sm text-slate-400">
          Loading characters…
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/70 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-semibold">Choose your character</h1>
        <p className="text-xs text-slate-400">
          Pick one to use in your current session.
        </p>
      </header>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {characters.map((c) => (
          <button
            key={c.character_id}
            onClick={async () => {
              await selectCharacter(c.character_id);
              navigate("/");
            }}
            className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left shadow hover:border-slate-700 hover:bg-slate-900 ${
              character?.character_id === c.character_id ? "ring-2 ring-emerald-500/60" : ""
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="text-base font-semibold">{c.name}</div>
              <div className="text-xs text-slate-400">
                {c.className} {c.level}
              </div>
            </div>
            <div className="text-xs text-slate-400">
              {c.race} • AC {c.ac} • HP {c.hpCurrent}/{c.hpMax}
            </div>
          </button>
        ))}
      </section>
    </main>
  );
}
