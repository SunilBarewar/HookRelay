// Request and response types come from the API's own zod schemas, so they can't drift.
// Import from the `schemas` subpath only: the package root pulls in Node-only code.
export type {
  AccountResponse,
  ApiKeyResponse,
  ApplicationListResponse,
  ApplicationResponse,
  AuthResponse,
  CreateApplicationBody,
  CreateEndpointBody,
  CreateEndpointResponse,
  CreateEventBody,
  CreateEventResponse,
  CredentialsBody,
  DeliveryStatus,
  EndpointListResponse,
  EndpointResponse,
  EndpointStatus,
  MessageResponse,
  UpdateAccountBody,
  UpdateApplicationBody,
  UpdateEndpointBody,
} from "@hookrelay/shared/schemas";
