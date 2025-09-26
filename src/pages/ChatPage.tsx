import MessageList from "@/components/chat/MessageList";
import Composer from "@/components/chat/Composer";
import { useChat } from "@/hooks/useChat";
import { useState } from "react";
import CharacterPanel from "@/components/character/CharacterPanel";
import { useCharacterContext } from "@/contexts/CharacterProvider";
import LogoutButton from "@/components/auth/LogoutButton";
import CharacterSwitcher from "@/components/character/CharacterSwitcher";

export default function ChatPage() {
  const [showChar, setShowChar] = useState(false);

  const {
    character,
    isLoading: charLoading,
    error: charError,
  } = useCharacterContext();

  const scopeKey = character?.id ?? "no-character";
  const { messages, isStreaming, send, stop, canAbort } = useChat(scopeKey, {
    resetOnScopeChange: true,
  });

  const hpText = charError
    ? "Err"
    : character
    ? `${character.hpCurrent}/${character.hpMax}`
    : charLoading
    ? "…"
    : "—";

  const acText = charError
    ? "Err"
    : character
    ? String(character.ac)
    : charLoading
    ? "…"
    : "—";

  return (
    <div className="min-h-dvh grid grid-rows-[auto,1fr,auto] bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 text-white">
      <CharacterSwitcher />
      <LogoutButton />
      <header className="mx-auto flex w-full max-w-3xl items-center gap-2 border-b border-white/10 px-2 pb-3">
        <div className="h-7 w-7 rounded-lg bg-indigo-600" />
        <div className="text-sm">
          <div className="font-semibold">Merlin</div>
          <div className="text-xs text-white/70">Chat MVP · Step 1</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <MiniStat label="HP" value={hpText} />
          <MiniStat label="AC" value={acText} />
          <button
            onClick={() => setShowChar(true)}
            className="rounded-md bg-slate-800/70 px-3 py-1 text-sm hover:bg-slate-700"
          >
            Character
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl">
        <MessageList messages={messages} isStreaming={isStreaming} />
      </main>

      <footer className="mx-auto w-full max-w-3xl">
        <Composer key={scopeKey} onSend={send} canAbort={canAbort} onStop={stop} />
      </footer>

      <CharacterPanel open={showChar} onClose={() => setShowChar(false)} />
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-slate-900/60 px-2 py-1 text-xs ring-1 ring-white/10">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold">{value}</span>
    </span>
  );
}
