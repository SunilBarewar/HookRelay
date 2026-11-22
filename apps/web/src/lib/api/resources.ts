import { http } from "./http.ts";
import type {
  Account,
  ApiKeyResponse,
  Application,
  AuthResponse,
  CreatedEndpoint,
  CreatedEvent,
  CreateEndpointInput,
  CreateEventInput,
  Credentials,
  MessageResponse,
  UpdateAccountInput,
} from "./types.ts";

export const auth = {
  /** Creates the account and logs in: the API sets the httpOnly auth cookie. */
  register: async (credentials: Credentials) =>
    (await http.post<AuthResponse>("/auth/register", credentials)).data,
  login: async (credentials: Credentials) =>
    (await http.post<AuthResponse>("/auth/login", credentials)).data,
  logout: async () => (await http.post<MessageResponse>("/auth/logout")).data,
  /** The logged-in account; rejects with a 401 ApiError when there is no valid session. */
  me: async () => (await http.get<Account>("/v1/accounts/me")).data,
};

export const account = {
  get: async (id: string) => (await http.get<Account>(`/v1/accounts/${id}`)).data,
  update: async (id: string, input: UpdateAccountInput) =>
    (await http.patch<Account>(`/v1/accounts/${id}`, input)).data,
  delete: async (id: string) => (await http.delete<MessageResponse>(`/v1/accounts/${id}`)).data,
  /** The key is only shown once; rotating invalidates the previous one. */
  generateApiKey: async (id: string) =>
    (await http.post<ApiKeyResponse>(`/v1/accounts/${id}/api-key`)).data,
};

export const application = {
  // NOTE: the API has no list route yet (GET /v1/applications); this 404s until it's added.
  list: async () => (await http.get<Application[]>("/v1/applications")).data,
  create: async (input: { name: string }) =>
    (await http.post<Application>("/v1/applications", input)).data,
  update: async (id: string, input: { name: string }) =>
    (await http.patch<Application>(`/v1/applications/${id}`, input)).data,
  delete: async (id: string) => (await http.delete<MessageResponse>(`/v1/applications/${id}`)).data,
};

export const endpoint = {
  create: async (applicationId: string, input: CreateEndpointInput) =>
    (await http.post<CreatedEndpoint>(`/v1/applications/${applicationId}/endpoints`, input)).data,
};

export const event = {
  create: async (applicationId: string, input: CreateEventInput) =>
    (
      await http.post<{ message: string; data: CreatedEvent }>(
        `/v1/applications/${applicationId}/events`,
        input,
      )
    ).data.data,
};
