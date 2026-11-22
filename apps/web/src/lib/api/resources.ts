import { http } from "./http.ts";
import type {
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
  EndpointListResponse,
  EndpointResponse,
  UpdateEndpointBody,
  CredentialsBody,
  DeliveryListResponse,
  MessageResponse,
  UpdateAccountBody,
  UpdateApplicationBody,
} from "./types.ts";

export const auth = {
  /** Creates the account and logs in: the API sets the httpOnly auth cookie. */
  register: async (credentials: CredentialsBody) =>
    (await http.post<AuthResponse>("/auth/register", credentials)).data,
  login: async (credentials: CredentialsBody) =>
    (await http.post<AuthResponse>("/auth/login", credentials)).data,
  logout: async () => (await http.post<MessageResponse>("/auth/logout")).data,
  /** The logged-in account; rejects with a 401 ApiError when there is no valid session. */
  me: async () => (await http.get<AccountResponse>("/v1/accounts/me")).data,
};

export const account = {
  get: async (id: string) => (await http.get<AccountResponse>(`/v1/accounts/${id}`)).data,
  update: async (id: string, input: UpdateAccountBody) =>
    (await http.patch<AccountResponse>(`/v1/accounts/${id}`, input)).data,
  delete: async (id: string) => (await http.delete<MessageResponse>(`/v1/accounts/${id}`)).data,
  /** The key is only shown once; rotating invalidates the previous one. */
  generateApiKey: async (id: string) =>
    (await http.post<ApiKeyResponse>(`/v1/accounts/${id}/api-key`)).data,
};

export const application = {
  list: async () => (await http.get<ApplicationListResponse>("/v1/applications")).data,
  create: async (input: CreateApplicationBody) =>
    (await http.post<ApplicationResponse>("/v1/applications", input)).data,
  update: async (id: string, input: UpdateApplicationBody) =>
    (await http.patch<ApplicationResponse>(`/v1/applications/${id}`, input)).data,
  delete: async (id: string) => (await http.delete<MessageResponse>(`/v1/applications/${id}`)).data,
};

export const endpoint = {
  list: async (applicationId: string) =>
    (await http.get<EndpointListResponse>(`/v1/applications/${applicationId}/endpoints`)).data,
  update: async (applicationId: string, endpointId: string, input: UpdateEndpointBody) =>
    (
      await http.patch<EndpointResponse>(
        `/v1/applications/${applicationId}/endpoints/${endpointId}`,
        input,
      )
    ).data,
  delete: async (applicationId: string, endpointId: string) =>
    (
      await http.delete<MessageResponse>(
        `/v1/applications/${applicationId}/endpoints/${endpointId}`,
      )
    ).data,
  create: async (applicationId: string, input: CreateEndpointBody) =>
    (await http.post<CreateEndpointResponse>(`/v1/applications/${applicationId}/endpoints`, input))
      .data,
};

export const event = {
  create: async (applicationId: string, input: CreateEventBody) =>
    (
      await http.post<{ message: string; data: CreateEventResponse }>(
        `/v1/applications/${applicationId}/events`,
        input,
      )
    ).data.data,
};

export const delivery = {
  /** The events delivered to an endpoint, newest first. Pass the last page's `nextCursor` for older ones. */
  list: async (
    applicationId: string,
    endpointId: string,
    params: { cursor?: string; limit?: number } = {},
  ) =>
    (
      await http.get<DeliveryListResponse>(
        `/v1/applications/${applicationId}/endpoints/${endpointId}/deliveries`,
        { params },
      )
    ).data,
};
