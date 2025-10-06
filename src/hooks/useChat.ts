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
  const [inflight, setInflight] = useState("");

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
        setMessages(res.messages);
      } catch {
        if (!cancelled) setMessages([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [enabled, sessionId]);

  // Reset/abort on scope change
  useEffect(() => {
    if (!resetOnScopeChange) return;
    setInflight("");
    setIsStreaming(false);
    abortRef.current?.abort();
    abortRef.current = null;
  }, [scopeKey, resetOnScopeChange]);

  const send = useCallback(
    async (text: string) => {
      if (!enabled || isStreaming) return;
      if (!sessionId) throw new Error("No sessionId");

      setMessages((prev) => [...prev, { role: "user", content: text } as Message]);
      setInflight("");
      setIsStreaming(true);

      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        for await (const ev of streamChat(sessionId, text, { signal: ac.signal })) {
          if (ev.event === "token") {
            setInflight((s) => s + (ev.data?.text ?? ""));
          } else if (ev.event === "error") {
            throw new Error(ev.data?.message || "Stream error");
          } else if (ev.event === "done") {
            break;
          }
        }

        const assistantContent = inflightRef.current ?? "";
        if (assistantContent.trim()) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: assistantContent } as Message,
          ]);
        }
        setInflight("");
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Something went wrong." } as Message,
        ]);
        setInflight("");
      } finally {
        if (abortRef.current === ac) {
          setIsStreaming(false);
        }
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

  const visibleMessages = useMemo(
    () =>
      inflight
        ? [...messages, { role: "assistant", content: inflight } as Message]
        : messages,
    [messages, inflight]
  );

  return { messages: visibleMessages, isStreaming, send, stop, canAbort };
}
