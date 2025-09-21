export const API_BASE: string | null =
  (import.meta.env.VITE_API_URL?.replace(/\/$/, "") as string | undefined) ??
  null;

export class ApiError extends Error {
  status: number;
  info?: unknown;
  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.info = info;
  }
}

function join(path: string): string {
  if (!API_BASE) throw new Error("VITE_API_URL is not set");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

type FetchOpts = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export async function fetchJSON<T>(
  path: string,
  opts: FetchOpts = {}
): Promise<T> {
  const res = await fetch(join(path), {
    method: opts.method ?? (opts.body ? "POST" : "GET"),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(opts.headers ?? {}),
    },
    body: opts.body == null ? undefined : JSON.stringify(opts.body),
    signal: opts.signal,
  });

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // fall through; non-JSON error pages etc.
      data = text;
    }
  }
  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.status}`, res.status, data);
  }
  return data as T;
}

/** Stream newline-delimited JSON (NDJSON) from an endpoint. */
export async function* streamNDJSON<T = unknown>(
  path: string,
  opts: Omit<FetchOpts, "headers"> & { headers?: Record<string, string> } = {}
): AsyncIterable<T> {
  const res = await fetch(join(path), {
    method: opts.method ?? "GET",
    headers: { Accept: "application/x-ndjson", ...(opts.headers ?? {}) },
    body: opts.body == null ? undefined : JSON.stringify(opts.body),
    signal: opts.signal,
  });
  if (!res.ok) {
    const msg = `Stream failed: ${res.status}`;
    throw new ApiError(msg, res.status);
  }
  const reader = res.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (!line) continue;
      try {
        yield JSON.parse(line) as T;
      } catch {
        // ignore bad lines; consider logging
      }
    }
  }
  // last line without newline
  const tail = buffer.trim();
  if (tail) {
    try {
      yield JSON.parse(tail) as T;
    } catch {
      /* ignore */
    }
  }
}
