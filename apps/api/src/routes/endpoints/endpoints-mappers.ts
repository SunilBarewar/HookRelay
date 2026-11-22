import type { EndpointWithSubscriptions } from "@hookrelay/db";
import type { EndpointResponse } from "@hookrelay/shared/schemas";

export function toEndpointResponse(endpoint: EndpointWithSubscriptions): EndpointResponse {
  return {
    id: endpoint.id,
    applicationId: endpoint.applicationId,
    url: endpoint.url,
    description: endpoint.description,
    status: endpoint.status,
    eventTypes: endpoint.subscriptions.map((s) => s.eventType),
    createdAt: endpoint.createdAt.toISOString(),
    updatedAt: endpoint.updatedAt.toISOString(),
  };
}
