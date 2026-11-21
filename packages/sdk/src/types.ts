export type Application = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateApplicationInput = { name: string };
export type UpdateApplicationInput = { name: string };

export type Endpoint = {
  id: string;
  applicationId: string;
  url: string;
  description: string | null;
  status: "active" | "disabled";
  eventTypes: string[];
  createdAt: string;
  updatedAt: string;
};

/** Returned once, on creation. Store `signingSecret` to verify deliveries. */
export type CreatedEndpoint = Endpoint & { signingSecret: string };

export type CreateEndpointInput = {
  url: string;
  description?: string;
  /** Event types this endpoint receives, e.g. ["order.created"]. */
  eventTypes: string[];
};

export type DeliveryStatus = "pending" | "success" | "failed" | "dead_lettered";

export type CreatedEvent = {
  id: string;
  deliveries: { id: string; status: DeliveryStatus }[];
  createdAt: string;
};

export type CreateEventInput = {
  /** e.g. "order.created". Delivered to every active endpoint subscribed to it. */
  eventType: string;
  /** Any JSON object, sent as-is to the subscribed endpoints. */
  payload: Record<string, unknown>;
};
