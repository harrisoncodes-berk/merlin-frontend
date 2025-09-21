import type { Message } from "@/models/chat";
import MessageItem from "./MessageItem";
import { useAutoscroll } from "@/hooks/useAutoscroll";

export default function MessageList({
  messages,
  isStreaming,
}: {
  messages: Message[];
  isStreaming?: boolean;
}) {
  const { containerRef, endRef, onScroll, pinned, scrollToBottom } =
    useAutoscroll({
      itemCount: messages.length + (isStreaming ? 1 : 0),
      isStreaming,
    });

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="relative mt-3 grid max-h-[calc(100dvh-12rem)] grid-rows-[1fr] overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/40 p-3 sm:p-4"
    >
      {/* “Jump to latest” pill when user has scrolled up */}
      {!pinned && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-800/90 px-3 py-1 text-xs text-white shadow ring-1 ring-white/15 hover:bg-slate-700"
        >
          Jump to latest ↓
        </button>
      )}

      <ul className="space-y-3">
        {messages.map((m) => (
          <MessageItem key={m.id} msg={m} />
        ))}
        {isStreaming && (
          <li className="mr-auto max-w-[72ch] rounded-2xl bg-slate-700 px-4 py-2 text-slate-100">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-duration:900ms]" />
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:150ms] [animation-duration:900ms]" />
              <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:300ms] [animation-duration:900ms]" />
            </span>
          </li>
        )}
        {/* Sentinel for smooth scrolling */}
        <li ref={endRef} aria-hidden />
      </ul>
    </div>
  );
}
