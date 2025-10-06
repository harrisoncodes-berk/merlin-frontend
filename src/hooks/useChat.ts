import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cancelTurn, getHistory, streamChat } from "@/api/chatApi";
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
  const [inflight, setInflight] = useState<string>("");

  const abortRef = useRef<AbortController | null>(null);
  const inflightRef = useRef(inflight);
  useEffect(() => {
    inflightRef.current = inflight;
  }, [inflight]);

  useEffect(() => {
    if (!enabled || !sessionId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await getHistory({ sessionId });
        if (cancelled) return;
        setMessages(
          res.messages.map((m) => ({
            messageId: m.messageId,
            role: m.role,
            content: m.content,
            createdAt: m.createdAt,
          }))
        );
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
    setInflight("");
    setIsStreaming(false);
  }, [scopeKey, resetOnScopeChange]);

  const send = useCallback(
    async (text: string) => {
      if (!enabled || isStreaming) return;
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setInflight("");
      setIsStreaming(true);

      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        if (!sessionId) throw new Error("No sessionId");
        for await (const ev of streamChat(sessionId, text, {
          signal: ac.signal,
          clientMessageId: crypto.randomUUID(),
        })) {
          if (ev.event === "token" && ev.data?.text) setInflight((s) => s + ev.data.text);
          else if (ev.event === "done") break;
          else if (ev.event === "error") throw new Error(ev.data?.message || "Stream error");
        }
        setMessages((prev) => [...prev, { role: "assistant", content: inflightRef.current ?? "" }]);
        setInflight("");
      } catch {
        setInflight("");
      } finally {
        if (abortRef.current === ac) setIsStreaming(false);
      }
    },
    [enabled, isStreaming, sessionId]
  );

  const stop = useCallback(async () => {
    if (!isStreaming) return;
    abortRef.current?.abort();
    if (sessionId) {
      try {
        await cancelTurn(sessionId);
      } catch { }
    }
  }, [isStreaming, sessionId]);

  const canAbort = isStreaming;

  return {
    messages: useMemo(
      () => (inflight ? [...messages, { role: "assistant", content: inflight } as Message] : messages),
      [messages, inflight]
    ),
    isStreaming,
    send,
    stop,
    canAbort,
  };
}
