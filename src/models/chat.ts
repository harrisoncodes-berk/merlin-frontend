export type Role = "user" | "assistant" | "system";
export type MessageStatus = "streaming" | "complete" | "error";

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type Session = {
  sessionId: string;
  characterId: string;
  title: string;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type Message = {
  messageId: number;
  role: Role;
  content: string;
  createdAt: string;
};

export type HistoryResponse = {
  sessionId: string;
  messages: Message[];
  hasMore: boolean;
};

export type StreamServerEvent =
  | { event: "token"; data: { text: string } }
  | { event: "done"; data?: undefined }
  | { event: "error"; data?: { message?: string } };


export function uid(prefix = "m"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
