import { errorMessage } from "../../lib/api/index.ts";

export type CredentialField = "email" | "password";

/** What to show the user: next to a field when `field` is set, otherwise above the submit button. */
export interface FormError {
  field?: CredentialField;
  message: string;
}

/** Fallback wording for failures that aren't specific to login or signup. */
export function describeApiError(error: unknown): FormError {
  return { message: errorMessage(error) };
}
