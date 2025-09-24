import { useNavigate } from "react-router-dom";
import { useCharacterContext } from "@/contexts/CharacterProvider";

export default function CharacterSelectPage() {
  const { characters, selectCharacter, isLoading, character } =
    useCharacterContext();
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

  const isEmpty = !isLoading && characters.length === 0;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/70 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Choose your character</h1>
            <p className="text-xs text-slate-400">
              Pick one to use in your current session.
            </p>
          </div>
          <button
            onClick={() => navigate("/create")}
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            + Create Character
          </button>
        </div>
      </header>

      {isEmpty ? (
        <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm text-slate-400">
            You don’t have any characters yet.
          </p>
          <button
            onClick={() => navigate("/create")}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Create your first character
          </button>
        </section>
      ) : (
        <section className="mx-auto grid max-w-5xl grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* “Create new” tile */}
          <button
            onClick={() => navigate("/create")}
            className="flex min-h-[116px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-left hover:border-slate-600 hover:bg-slate-900/60"
          >
            <div className="mb-1 text-base font-semibold">
              Create new character
            </div>
            <div className="text-xs text-slate-400">Start a fresh hero</div>
          </button>

          {characters.map((c) => (
            <button
              key={c.character_id}
              onClick={async () => {
                await selectCharacter(c.character_id);
                navigate("/");
              }}
              className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left shadow hover:border-slate-700 hover:bg-slate-900 ${
                character?.character_id === c.character_id
                  ? "ring-2 ring-emerald-500/60"
                  : ""
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
      )}
    </main>
  );
}
