import { describe, expect, it, vi } from "vitest";

import { HookRelay, HookRelayError } from "../src/index.ts";

function mockFetch(status: number, body: unknown) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status }));
}

describe("HookRelay client", () => {
  it("sends the API key and JSON body, and returns the parsed response", async () => {
    const fetch = mockFetch(201, { id: "a1", name: "App" });
    const hr = new HookRelay("hr_key", { local: true, fetch });

    const app = await hr.applications.create({ name: "App" });

    expect(app).toEqual({ id: "a1", name: "App" });
    const [url, init] = fetch.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("http://localhost:8000/v1/applications");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer hr_key");
    expect(init.body).toBe(JSON.stringify({ name: "App" }));
  });

  it("unwraps the { message, data } envelope for events", async () => {
    const fetch = mockFetch(201, { message: "ok", data: { id: "e1", deliveries: [] } });
    const hr = new HookRelay("hr_key", { fetch });

    const event = await hr.events.create("app1", { eventType: "a.b", payload: {} });

    expect(event.id).toBe("e1");
  });

  it("throws HookRelayError with the API error fields", async () => {
    const fetch = mockFetch(404, { error: "NotFoundError", code: "NOT_FOUND", message: "nope" });
    const hr = new HookRelay("hr_key", { fetch });

    const err = await hr.applications.delete("missing").catch((e) => e);

    expect(err).toBeInstanceOf(HookRelayError);
    expect(err).toMatchObject({ status: 404, code: "NOT_FOUND", message: "nope" });
  });

  it("uses the hosted API by default", async () => {
    const fetch = mockFetch(201, { id: "a1" });
    await new HookRelay("hr_key", { fetch }).applications.create({ name: "App" });

    const [url] = fetch.mock.calls[0] as unknown as [string];
    expect(url).toBe("https://api.hookrelay.dev/v1/applications");
  });

  it("requires an API key", () => {
    expect(() => new HookRelay("")).toThrow();
  });
});
