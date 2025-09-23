import { useCallback, useEffect, useRef, useState } from "react";
import type { Message } from "@/models/chat";
import { uid } from "@/models/chat";
import { chatStream } from "@/api/chatApi";

const STORAGE_PREFIX = "merlin.chat.";

function load(scopeKey: string): Message[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + scopeKey);
    return raw ? (JSON.parse(raw) as Message[]) : null;
  } catch {
    return null;
  }
}
function save(scopeKey: string, msgs: Message[]) {
  try {
    localStorage.setItem(STORAGE_PREFIX + scopeKey, JSON.stringify(msgs));
  } catch {}
}

/** Seed the first-time conversation for a scope */
function seedMessages(): Message[] {
  const now = Date.now();
  return [
    {
      id: uid("sys"),
      role: "system",
      content: "Session started. Be kind and roll fair.",
      status: "complete",
      createdAt: now,
    },
    {
      id: uid("a"),
      role: "assistant",
      content: "A salt wind combs the docks. What do you do?",
      status: "complete",
      createdAt: now,
    },
  ];
}

type UseChatOptions = {
  /** If true, clears history on scope change (instead of loading saved). */
  resetOnScopeChange?: boolean;
};

export function useChat(scopeKey: string, opts: UseChatOptions = {}) {
  const { resetOnScopeChange = false } = opts;

  // initialize from storage (or seed if first time)
  const [messages, setMessages] = useState<Message[]>(
    () => load(scopeKey) ?? seedMessages()
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // swap message state when the scope changes
  useEffect(() => {
    // stop any in-flight stream
    abortRef.current?.abort();
    setIsStreaming(false);

    if (resetOnScopeChange) {
      const seeded = seedMessages();
      setMessages(seeded);
      save(scopeKey, seeded);
    } else {
      setMessages(load(scopeKey) ?? seedMessages());
    }
  }, [scopeKey, resetOnScopeChange]);

  // persist per scope
  useEffect(() => {
    save(scopeKey, messages);
  }, [scopeKey, messages]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      const now = Date.now();
      const userMsg: Message = {
        id: uid("u"),
        role: "user",
        content: trimmed,
        status: "complete",
        createdAt: now,
      };
      const assistantId = uid("a");
      const assistantMsg: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        status: "streaming",
        createdAt: now,
      };

      setMessages((m) => [...m, userMsg, assistantMsg]);

      const ac = new AbortController();
      abortRef.current = ac;
      setIsStreaming(true);

      try {
        for await (const ev of chatStream(trimmed, {
          signal: ac.signal,
          // scopeKey,
        })) {
          if (ev.type === "delta") {
            setMessages((m) =>
              m.map((mm) =>
                mm.id === assistantId
                  ? { ...mm, content: mm.content + ev.content }
                  : mm
              )
            );
          } else if (ev.type === "final") {
            setMessages((m) =>
              m.map((mm) =>
                mm.id === assistantId ? { ...mm, status: "complete" } : mm
              )
            );
          } else if (ev.type === "error") {
            setMessages((m) =>
              m.map((mm) =>
                mm.id === assistantId
                  ? { ...mm, status: "error", content: mm.content || ev.error }
                  : mm
              )
            );
          }
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [isStreaming, scopeKey]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const canAbort = isStreaming && !!abortRef.current;

  return { messages, isStreaming, send, stop, canAbort } as const;
}
