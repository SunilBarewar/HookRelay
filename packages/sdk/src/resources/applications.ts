import type { Requester } from "../http.ts";
import type { Application, CreateApplicationInput, UpdateApplicationInput } from "../types.ts";

export class Applications {
  constructor(private readonly request: Requester) {}

  create(input: CreateApplicationInput): Promise<Application> {
    return this.request("POST", "/v1/applications", input);
  }

  update(id: string, input: UpdateApplicationInput): Promise<Application> {
    return this.request("PATCH", `/v1/applications/${encodeURIComponent(id)}`, input);
  }

  delete(id: string): Promise<{ message: string }> {
    return this.request("DELETE", `/v1/applications/${encodeURIComponent(id)}`);
  }
}
