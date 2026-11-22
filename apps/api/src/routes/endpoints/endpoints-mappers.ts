import type { EndpointDelivery, EndpointWithSubscriptions } from "@hookrelay/db";
import type { DeliveryResponse, EndpointResponse } from "@hookrelay/shared/schemas";

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

export function toDeliveryResponse(delivery: EndpointDelivery): DeliveryResponse {
  return {
    id: delivery.id,
    eventId: delivery.eventId,
    eventType: delivery.eventType,
    payload: delivery.payload as DeliveryResponse["payload"],
    status: delivery.status,
    attempts: delivery.attempts,
    responseCode: delivery.responseCode,
    responseBody: delivery.responseBody,
    errorMessage: delivery.errorMessage,
    nextAttemptAt: delivery.nextAttemptAt?.toISOString() ?? null,
    deliveredAt: delivery.deliveredAt?.toISOString() ?? null,
    eventCreatedAt: delivery.eventCreatedAt.toISOString(),
  };
}
