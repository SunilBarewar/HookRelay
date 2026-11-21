import type { Requester } from "../http.ts";
import type { CreatedEvent, CreateEventInput } from "../types.ts";

export class Events {
  constructor(private readonly request: Requester) {}

  /** Publishes an event; it is delivered to every active endpoint subscribed to its type. */
  async create(applicationId: string, input: CreateEventInput): Promise<CreatedEvent> {
    // The API wraps this response as `{ message, data }`.
    const res = await this.request<{ data: CreatedEvent }>(
      "POST",
      `/v1/applications/${encodeURIComponent(applicationId)}/events`,
      input,
    );
    return res.data;
  }
}
