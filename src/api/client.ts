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
  requireAuth?: boolean;
  retry401Once?: boolean;
};

let getAccessToken: () => string | null = () => null;
export function setAuthTokenProvider(fn: () => string | null) {
  getAccessToken = fn;
}

async function waitForToken(timeoutMs = 2000) {
  const start = Date.now();
  while (!getAccessToken()) {
    if (Date.now() - start > timeoutMs) break;
    await new Promise((r) => setTimeout(r, 40));
  }
}

async function doFetch(path: string, opts: FetchOpts): Promise<Response> {
  const res = await fetch(join(path), {
    method: opts.method ?? (opts.body ? "POST" : "GET"),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(opts.headers ?? {}),
      ...(getAccessToken()
        ? { Authorization: `Bearer ${getAccessToken()}` }
        : {}),
    },
    body: opts.body == null ? undefined : JSON.stringify(opts.body),
    signal: opts.signal,
  });
  return res;
}

export async function fetchJSON<T>(
  path: string,
  opts: FetchOpts = {}
): Promise<T> {
  if (opts.requireAuth && !getAccessToken()) {
    await waitForToken();
  }

  let res = await doFetch(path, opts);

  if (res.status === 401 && opts.retry401Once) {
    await waitForToken(600);
    res = await doFetch(path, opts);
  }

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.status}`, res.status, data);
  }
  return data as T;
}

export async function* streamNDJSON<T = unknown>(
  path: string,
  opts: Omit<FetchOpts, "headers"> & { headers?: Record<string, string> } = {}
): AsyncIterable<T> {
  if (opts.requireAuth && !getAccessToken()) {
    await waitForToken();
  }

  const res = await fetch(join(path), {
    method: opts.method ?? "GET",
    headers: {
      Accept: "application/x-ndjson",
      ...(opts.headers ?? {}),
      ...(getAccessToken()
        ? { Authorization: `Bearer ${getAccessToken()}` }
        : {}),
    },
    body: opts.body == null ? undefined : JSON.stringify(opts.body),
    signal: opts.signal,
  });

  if (res.status === 401 && (opts as FetchOpts).retry401Once) {
    await waitForToken(600);
    const retry = await fetch(join(path), {
      method: opts.method ?? "GET",
      headers: {
        Accept: "application/x-ndjson",
        ...(opts.headers ?? {}),
        ...(getAccessToken()
          ? { Authorization: `Bearer ${getAccessToken()}` }
          : {}),
      },
      body: opts.body == null ? undefined : JSON.stringify(opts.body),
      signal: opts.signal,
    });
    if (!retry.ok)
      throw new ApiError(`Stream failed: ${retry.status}`, retry.status);
    yield* readNDJSON<T>(retry);
    return;
  }

  if (!res.ok) {
    throw new ApiError(`Stream failed: ${res.status}`, res.status);
  }
  yield* readNDJSON<T>(res);
}

// helper to read NDJSON
async function* readNDJSON<T>(res: Response): AsyncIterable<T> {
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
      } catch {}
    }
  }
  const tail = buffer.trim();
  if (tail) {
    try {
      yield JSON.parse(tail) as T;
    } catch {}
  }
}
