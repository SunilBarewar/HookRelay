import { HookRelayError } from "./errors.ts";

export type Requester = <T>(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  path: string,
  body?: unknown,
) => Promise<T>;

export type HttpConfig = {
  apiKey: string;
  baseUrl: string;
  timeoutMs: number;
  fetch: typeof fetch;
};

export function createRequester(config: HttpConfig): Requester {
  return async (method, path, body) => {
    let response: Response;
    try {
      response = await config.fetch(`${config.baseUrl}${path}`, {
        method,
        headers: {
          authorization: `Bearer ${config.apiKey}`,
          accept: "application/json",
          ...(body !== undefined && { "content-type": "application/json" }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(config.timeoutMs),
      });
    } catch (cause) {
      throw new HookRelayError({
        status: 0,
        code: "NETWORK_ERROR",
        message: cause instanceof Error ? cause.message : "Network request failed",
      });
    }

    const text = await response.text();
    let json: unknown;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch {
      json = undefined;
    }

    if (!response.ok) {
      const err = (json ?? {}) as { code?: string; message?: string; details?: unknown };
      throw new HookRelayError({
        status: response.status,
        code: err.code ?? "UNKNOWN_ERROR",
        message: err.message ?? `Request failed with status ${response.status}`,
        details: err.details,
      });
    }

    return json as never;
  };
}
