import { ApiError } from "../../lib/api/index.ts";

export type CredentialField = "email" | "password";

/** What to show the user: next to a field when `field` is set, otherwise above the submit button. */
export interface FormError {
  field?: CredentialField;
  message: string;
}

/** Fallback wording for failures that aren't specific to login or signup. */
export function describeApiError(error: unknown): FormError {
  if (error instanceof ApiError) {
    if (error.status === undefined) {
      return {
        message: "We couldn’t reach HookRelay. Check your connection and try again.",
      };
    }
    if (error.status >= 500) {
      return { message: "Something went wrong on our side. Please try again in a moment." };
    }
    return { message: error.message };
  }
  return { message: "Something went wrong. Please try again." };
}
