import type { Message } from "@/models/chat";

export default function MessageItem({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  const isSystem = msg.role === "system";

  const row = isSystem
    ? "justify-center"
    : isUser
      ? "justify-end"
      : "justify-start";
  const bubble = isSystem
    ? "mx-auto max-w-prose rounded-xl border border-slate-700/60 bg-slate-800/60 px-3 py-2 text-slate-300 shadow-sm"
    : isUser
      ? "ml-auto max-w-[72ch] rounded-2xl bg-indigo-600 px-4 py-2 text-white shadow"
      : "mr-auto max-w-[72ch] rounded-2xl bg-slate-700 px-4 py-2 text-slate-100 shadow";

  return (
    <li className={`flex ${row} w-full`}>
      <div className={bubble}>
        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
      </div>
    </li>
  );
}
