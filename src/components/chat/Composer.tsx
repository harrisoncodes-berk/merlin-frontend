import { useEffect, useRef, useState } from "react";

export default function Composer({
  onSend,
  canAbort,
  onStop,
  disabled = false,
}: {
  onSend: (text: string) => void;
  canAbort?: boolean;
  onStop?: () => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState(1);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!taRef.current) return;
    taRef.current.style.height = "0px";
    const next = Math.min(160, taRef.current.scrollHeight);
    taRef.current.style.height = next + "px";
    const r = Math.min(6, Math.ceil(next / 24));
    setRows(r);
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      if (disabled || canAbort) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    const text = value.trim();
    if (!text || disabled || canAbort) return;
    onSend(text);
    setValue("");
  }

  return (
    <div className="mt-3 rounded-2xl border border-white/10 bg-slate-900/40 p-2 shadow-sm">
      <div className="flex items-end gap-2">
        <textarea
          ref={taRef}
          rows={rows}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message…"
          className="max-h-40 w-full resize-none bg-transparent px-3 py-2 outline-none placeholder:text-slate-400"
          aria-label="Message"
        />
        {canAbort ? (
          <button
            onClick={onStop}
            className="mb-1 rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={disabled}
            aria-disabled={disabled}
            title={disabled ? "Wait for the reply to finish" : undefined}
            className={`mb-1 rounded-lg px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 ${disabled
                ? "bg-indigo-600/40 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 focus:ring-indigo-300"
              }`}
          >
            Send
          </button>
        )}
      </div>
      <div className="mt-1 flex items-center justify-between px-2">
        <span className="text-xs text-slate-400">Enter to send · Shift+Enter for newline</span>
      </div>
    </div>
  );
}
