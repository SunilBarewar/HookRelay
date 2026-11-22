import { ApiError } from "./http.ts";

/** Plain-language wording for any failed API call, safe to show to people. */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === undefined) {
      return "We couldn’t reach HookRelay. Check your connection and try again.";
    }
    if (error.status >= 500) {
      return "Something went wrong on our side. Please try again in a moment.";
    }
    return error.message;
  }
  return "Something went wrong. Please try again.";
}
