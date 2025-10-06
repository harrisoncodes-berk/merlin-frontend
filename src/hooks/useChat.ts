// src/hooks/useChat.ts
import { useCallback, useEffect, useState } from "react";
import { getHistory, sendMessage } from "@/api/chatApi";
import type { Message } from "@/models/chat";

type Options = {
  enabled?: boolean;
  resetOnScopeChange?: boolean;
  sessionId?: string | null;
};

export function useChat(
  scopeKey: string,
  { enabled = true, resetOnScopeChange = true, sessionId = null }: Options
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!enabled || !sessionId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await getHistory({ sessionId });
        if (!cancelled) setMessages(res.messages);
      } catch {
        if (!cancelled) setMessages([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, sessionId]);

  useEffect(() => {
    if (!resetOnScopeChange) return;
    setIsStreaming(false);
  }, [scopeKey, resetOnScopeChange]);

  const send = useCallback(
    async (text: string) => {
      if (!enabled || isStreaming) return;
      if (!sessionId) throw new Error("No sessionId");

      setMessages((prev) => [...prev, { role: "user", content: text } as Message]);
      setIsStreaming(true);

      try {
        const assistant = await sendMessage(sessionId, text);

        setMessages((prev) => [...prev, { ...assistant } as Message]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "system", content: "Something went wrong." } as Message,
        ]);
      } finally {
        setIsStreaming(false);
      }
    },
    [enabled, isStreaming, sessionId]
  );

  const stop = useCallback(() => { }, []);
  const canAbort = false;

  return { messages, isStreaming, send, stop, canAbort };
}
