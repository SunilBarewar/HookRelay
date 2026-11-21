import { createRequester } from "./http.ts";
import { Applications } from "./resources/applications.ts";
import { Endpoints } from "./resources/endpoints.ts";
import { Events } from "./resources/events.ts";

export type HookRelayOptions = {
  /** API base URL, without a trailing slash. */
  baseUrl?: string;
  /** Per-request timeout. Default 30s. */
  timeoutMs?: number;
  /** Custom fetch implementation (tests, proxies, older runtimes). */
  fetch?: typeof fetch;
};

export const DEFAULT_BASE_URL = "https://api.hookrelay.dev";

export class HookRelay {
  readonly applications: Applications;
  readonly endpoints: Endpoints;
  readonly events: Events;

  constructor(apiKey: string, options: HookRelayOptions = {}) {
    if (!apiKey) throw new Error("HookRelay: an API key is required");

    const request = createRequester({
      apiKey,
      baseUrl: (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, ""),
      timeoutMs: options.timeoutMs ?? 30_000,
      fetch: options.fetch ?? globalThis.fetch,
    });

    this.applications = new Applications(request);
    this.endpoints = new Endpoints(request);
    this.events = new Events(request);
  }
}
