export type Role = "user" | "assistant" | "system";
export type MessageStatus = "streaming" | "complete" | "error";

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
  messageId?: number;
  role: Role;
  content: string;
  createdAt?: string;
};

export type StreamEvent =
  | { type: "delta"; content: string }
  | { type: "final" }
  | { type: "error"; error: string };

export function uid(prefix = "m"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export type HistoryResponse = {
  sessionId: string;
  messages: Message[];
  hasMore: boolean;
};