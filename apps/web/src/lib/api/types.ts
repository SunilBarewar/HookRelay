export type DeliveryStatus = "pending" | "success" | "failed" | "dead_lettered";

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  email: string;
}

export interface Account {
  id: string;
  email: string;
  hasApiKey: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAccountInput {
  email?: string;
  password?: string;
}

export interface ApiKeyResponse {
  message: string;
  apiKey: string;
}

export interface MessageResponse {
  message: string;
}

export interface Application {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Endpoint {
  id: string;
  applicationId: string;
  url: string;
  description: string | null;
  status: "active" | "disabled";
  eventTypes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEndpointInput {
  url: string;
  description?: string;
  eventTypes: string[];
}

/** The signing secret is only returned once, when the endpoint is created. */
export interface CreatedEndpoint extends Endpoint {
  signingSecret: string;
}

export interface CreateEventInput {
  eventType: string;
  payload: Record<string, unknown>;
}

export interface CreatedEvent {
  id: string;
  deliveries: { id: string; status: DeliveryStatus }[];
  createdAt: string;
}
