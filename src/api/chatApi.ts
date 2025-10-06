import { fetchJSON, streamNDJSON } from "@/api/client";
import type {
  HistoryResponse,
  Session,
  StreamServerEvent,
} from "@/models/chat";

export function getSession({ sessionId }: { sessionId: string }) {
  return fetchJSON<Session>(`/chat/sessions/${sessionId}`, {
    requireAuth: true,
    retry401Once: true,
  });
}

export function getOrCreateActiveSession({ characterId }: { characterId: string }) {
  return fetchJSON<Session>("/chat/sessions/active", {
    method: "POST",
    body: { characterId },
    requireAuth: true,
    retry401Once: true,
  });
}

export function getHistory({
  sessionId,
  after,
  limit = 50,
}: {
  sessionId: string;
  after?: number;
  limit?: number;
}) {
  const qs = new URLSearchParams();
  if (after != null) qs.set("after", String(after));
  if (limit) qs.set("limit", String(limit));
  const path =
    qs.toString().length > 0
      ? `/chat/sessions/${sessionId}/history?${qs.toString()}`
      : `/chat/sessions/${sessionId}/history`;

  return fetchJSON<HistoryResponse>(path, {
    requireAuth: true,
    retry401Once: true,
  });
}

export async function* streamChat(
  sessionId: string,
  userText: string,
  opts?: { signal?: AbortSignal; clientMessageId?: string }
): AsyncIterable<StreamServerEvent> {
  const it = streamNDJSON<StreamServerEvent>(`/chat/sessions/${sessionId}/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      message: userText,
      clientMessageId: opts?.clientMessageId,
    },
    requireAuth: true,
    retry401Once: true,
    signal: opts?.signal,
  });

  for await (const ev of it) {
    yield ev;
  }
}

export function cancelTurn(sessionId: string) {
  return fetchJSON<void>(`/chat/sessions/${sessionId}/jobs/current`, {
    method: "DELETE",
    requireAuth: true,
    retry401Once: true,
  });
}
