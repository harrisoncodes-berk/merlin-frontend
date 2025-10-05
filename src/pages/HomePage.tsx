import { useNavigate } from "react-router-dom";
import { useCharacterContext } from "@/contexts/CharacterProvider";
import LogoutButton from "@/components/auth/LogoutButton";

export default function HomePage() {
  const navigate = useNavigate();
  const { characters, isLoading } = useCharacterContext();

  const hasCharacters = characters.length > 0;

  return (
    <div className="min-h-dvh grid grid-rows-[auto,1fr,auto] bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 text-white">
      <LogoutButton />
      
      <header className="mx-auto flex w-full max-w-3xl items-center gap-2 border-b border-white/10 px-2 pb-3">
        <div className="h-7 w-7 rounded-lg bg-indigo-600" />
        <div className="text-sm">
          <div className="font-semibold">Merlin</div>
          <div className="text-xs text-white/70">Welcome Home</div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to Merlin, Adventurer!
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Your AI-powered Dungeons & Dragons companion is ready to guide your adventures.
          </p>
        </div>

        <div className="w-full max-w-lg space-y-4">
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-pulse text-sm text-white/60">
                Loading your characters...
              </div>
            </div>
          ) : hasCharacters ? (
            <div className="space-y-3">
              <p className="text-center text-white/70">
                You have {characters.length} character{characters.length !== 1 ? 's' : ''} ready for adventure.
              </p>
              <button
                onClick={() => navigate('/characters')}
                className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Select Character
              </button>
              <button
                onClick={() => navigate('/create')}
                className="w-full rounded-lg bg-slate-700/50 px-6 py-3 font-semibold text-white/90 hover:bg-slate-600/50 transition-colors border border-white/10"
              >
                Create New Character
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-white/70">
                Ready to start your adventure? Create your first character to begin!
              </p>
              <button
                onClick={() => navigate('/create')}
                className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-500 transition-colors"
              >
                Create Your First Character
              </button>
            </div>
          )}
        </div>

        <div className="text-center text-sm text-white/50 max-w-md">
          Once you have a character selected, you can start chatting with Merlin to begin your D&D adventure.
        </div>
      </main>

      <footer className="mx-auto w-full max-w-3xl">
        <div className="border-t border-white/10 pt-4 text-center text-xs text-white/40">
          Merlin · AI-Powered D&D Companion
        </div>
      </footer>
    </div>
  );
}
