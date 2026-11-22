import { account, application, auth, endpoint, event } from "./resources.ts";

/** e.g. `apiClient.auth.login({ email, password })`, `apiClient.application.list()`. */
export const apiClient = { auth, account, application, endpoint, event };

export { ApiError } from "./http.ts";
export type * from "./types.ts";
