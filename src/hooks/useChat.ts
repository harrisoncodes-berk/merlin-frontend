import { useCallback, useRef, useState } from "react";
import type { Message } from "@/models/chat";
import { uid } from "@/models/chat";
import { chatStream } from "@/api/chatApi";

export function useChat() {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: uid("sys"),
      role: "system",
      content: "Session started. Be kind and roll fair.",
      status: "complete",
      createdAt: Date.now(),
    },
    {
      id: uid("a"),
      role: "assistant",
      content: "A salt wind combs the docks. What do you do?",
      status: "complete",
      createdAt: Date.now(),
    },
  ]);

  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMsg: Message = {
      id: uid("u"),
      role: "user",
      content: text,
      status: "complete",
      createdAt: Date.now(),
    };
    const assistantId = uid("a");
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      status: "streaming",
      createdAt: Date.now(),
    };

    setMessages((m) => [...m, userMsg, assistantMsg]);

    const ac = new AbortController();
    abortRef.current = ac;
    setIsStreaming(true);

    try {
      for await (const ev of chatStream(text, { signal: ac.signal })) {
        if (ev.type === "delta") {
          setMessages((m) =>
            m.map((mm) => (mm.id === assistantId ? { ...mm, content: mm.content + ev.content } : mm)),
          );
        } else if (ev.type === "final") {
          setMessages((m) =>
            m.map((mm) => (mm.id === assistantId ? { ...mm, status: "complete" } : mm)),
          );
        } else if (ev.type === "error") {
          setMessages((m) =>
            m.map((mm) =>
              mm.id === assistantId
                ? { ...mm, status: "error", content: mm.content || ev.error }
                : mm,
            ),
          );
        }
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [isStreaming]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const canAbort = isStreaming && !!abortRef.current;

  return { messages, isStreaming, send, stop, canAbort } as const;
}
