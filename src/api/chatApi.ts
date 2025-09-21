import type { StreamEvent } from "@/models/chat";

// Mock streaming API so the UI works before you wire the backend.
const demoReply = (you: string) =>
  `You whisper: "${you}". A lantern sways over the docks; the lock is old brass—scored, stubborn. What do you do next?`;

export function chatStream(
  userText: string,
  _opts?: { signal?: AbortSignal },
): AsyncIterable<StreamEvent> {
  async function* gen() {
    const text = demoReply(userText);
    const chunks = text.split(/(\s+)/); // keep spaces for smoother streaming
    for (const c of chunks) {
      await new Promise((r) => setTimeout(r, 25));
      yield { type: "delta", content: c } as const;
    }
    yield { type: "final" } as const;
  }
  return gen();
}
