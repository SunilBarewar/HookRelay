import type { Requester } from "../http.ts";
import type { CreatedEndpoint, CreateEndpointInput } from "../types.ts";

export class Endpoints {
  constructor(private readonly request: Requester) {}

  create(applicationId: string, input: CreateEndpointInput): Promise<CreatedEndpoint> {
    return this.request(
      "POST",
      `/v1/applications/${encodeURIComponent(applicationId)}/endpoints`,
      input,
    );
  }
}
