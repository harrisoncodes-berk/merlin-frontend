import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LogoutButton from "@/components/auth/LogoutButton";
import CharacterPanel from "@/components/character/CharacterPanel";
import CharacterSwitcher from "@/components/character/CharacterSwitcher";
import Composer from "@/components/chat/Composer";
import MessageList from "@/components/chat/MessageList";

import { getSession } from "@/api/chatApi";
import { useCharacterContext } from "@/contexts/CharacterProvider";
import { useChat } from "@/hooks/useChat";
import type { Session } from "@/models/chat";
import { UUID_RE } from "@/models/chat";

export default function ChatPage() {
  const [showChar, setShowChar] = useState(false);
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId || !UUID_RE.test(sessionId)) {
      navigate("/characters", { replace: true });
    }
  }, [sessionId, navigate]);

  const [meta, setMeta] = useState<Session | null>(null);
  const [metaLoading, setMetaLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!sessionId || !UUID_RE.test(sessionId)) return;

    (async () => {
      setMetaLoading(true);
      try {
        const m = await getSession({ sessionId });
        if (!cancelled) setMeta(m);
      } catch {
        if (!cancelled) navigate("/characters", { replace: true });
      } finally {
        if (!cancelled) setMetaLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sessionId, navigate]);

  const { character, isLoading: charLoading, error: charError } = useCharacterContext();

  const scopeKey = meta?.sessionId ?? "no-session";
  const streamingEnabled = !!meta && !meta.archivedAt;

  const { messages, isStreaming, send, stop, canAbort } = useChat(scopeKey, {
    resetOnScopeChange: true,
    enabled: streamingEnabled,
    sessionId: meta?.sessionId,
  });

  const hpText = charError ? "Err" : charLoading ? "…" : character ? `${character.hpCurrent}/${character.hpMax}` : "—";
  const acText = charError ? "Err" : charLoading ? "…" : character ? String(character.ac) : "—";
  const composerDisabled = !streamingEnabled || isStreaming;

  return (
    <div className="min-h-dvh grid grid-rows-[auto,1fr,auto] bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 text-white">
      <CharacterSwitcher />
      <LogoutButton />

      <header className="mx-auto flex w-full max-w-3xl items-center gap-2 border-b border-white/10 px-2 pb-3">
        <div className="h-7 w-7 rounded-lg bg-indigo-600" aria-hidden />
        <div className="text-sm">
          <div className="font-semibold">{meta?.adventureTitle ?? "Merlin"}</div>
          <div className="text-xs text-white/70">{meta ? "Chat Session" : "Loading session…"}</div>
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

      {meta?.archivedAt && (
        <div className="mx-auto my-2 w-full max-w-3xl rounded-md bg-amber-900/40 px-3 py-2 text-sm">
          This adventure is archived. You can view history but cannot send new messages.
        </div>
      )}

      <main className="mx-auto w-full max-w-3xl">
        {!metaLoading && meta && <MessageList messages={messages} isStreaming={isStreaming} />}
      </main>

      <footer className="mx-auto w-full max-w-3xl">
        <Composer
          key={scopeKey}
          onSend={send}
          canAbort={canAbort}
          onStop={stop}
          disabled={composerDisabled}
        />
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
