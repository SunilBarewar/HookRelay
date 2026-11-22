import { account, application, auth, delivery, endpoint, event } from "./resources.ts";

/** e.g. `apiClient.auth.login({ email, password })`, `apiClient.application.list()`. */
export const apiClient = { auth, account, application, endpoint, event, delivery };

export { ApiError } from "./http.ts";
export { errorMessage } from "./error-message.ts";
export type * from "./types.ts";
