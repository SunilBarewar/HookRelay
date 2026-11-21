import { createRequester } from "./http.ts";
import { Applications } from "./resources/applications.ts";
import { Endpoints } from "./resources/endpoints.ts";
import { Events } from "./resources/events.ts";

export type HookRelayOptions = {
  /** Per-request timeout. Default 30s. */
  timeoutMs?: number;
  /** Custom fetch implementation (tests, proxies, older runtimes). */
  fetch?: typeof fetch;
};

// TODO: replace with the real hosted API URL when publishing the package on npm.
const LOCAL_URL = "http://localhost:8000";

export class HookRelay {
  readonly applications: Applications;
  readonly endpoints: Endpoints;
  readonly events: Events;

  constructor(apiKey: string, options: HookRelayOptions = {}) {
    if (!apiKey) throw new Error("HookRelay: an API key is required");

    const request = createRequester({
      apiKey,
      baseUrl: LOCAL_URL,
      timeoutMs: options.timeoutMs ?? 30_000,
      fetch: options.fetch ?? globalThis.fetch,
    });

    this.applications = new Applications(request);
    this.endpoints = new Endpoints(request);
    this.events = new Events(request);
  }
}
