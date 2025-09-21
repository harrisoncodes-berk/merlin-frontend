export type Role = "user" | "assistant" | "system";
export type MessageStatus = "streaming" | "complete" | "error";

export interface Message {
  id: string;
  role: Role;
  content: string;
  status: MessageStatus;
  createdAt: number;
  meta?: {
    mechanics?: Array<{ kind: string; text: string }>;
  };
}

export type StreamEvent =
  | { type: "delta"; content: string }
  | { type: "final" }
  | { type: "error"; error: string };

export function uid(prefix = "m"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
