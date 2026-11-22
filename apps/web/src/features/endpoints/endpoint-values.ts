import { EndpointDescription, EndpointEventTypes, EndpointUrl } from "@hookrelay/shared/schemas";
import type { EndpointResponse, UpdateEndpointBody } from "../../lib/api/index.ts";

/** What the endpoint form collects, ready to send once it passes `validateEndpointValues`. */
export interface EndpointFormValues {
  url: string;
  description: string;
  eventTypes: string[];
  active: boolean;
}

export type EndpointFieldErrors = Partial<Record<"url" | "description" | "eventTypes", string>>;

export const endpointFields = ["url", "description", "eventTypes"] as const;

/** One event type per line, or separated by commas. Blanks and repeats are dropped. */
export function parseEventTypes(text: string): string[] {
  return [
    ...new Set(
      text
        .split(/[\n,]+/)
        .map((type) => type.trim())
        .filter(Boolean),
    ),
  ];
}

/** Checks each field against the API's own schema, but words the problems for people. */
export function validateEndpointValues(values: EndpointFormValues): EndpointFieldErrors {
  const { url, description, eventTypes } = values;
  const errors: EndpointFieldErrors = {};

  if (!url) errors.url = "Enter the URL that should receive events.";
  else if (url.length > 2048) errors.url = "Use 2048 characters or fewer.";
  else if (!EndpointUrl.safeParse(url).success) {
    errors.url = "Enter a full URL, like https://example.com/webhooks.";
  }

  if (!EndpointDescription.safeParse(description).success) {
    errors.description = "Use 500 characters or fewer.";
  }

  if (eventTypes.length === 0) {
    errors.eventTypes = "Add at least one event type, like order.created.";
  } else if (eventTypes.length > 100) {
    errors.eventTypes = "Use 100 event types or fewer.";
  } else if (!EndpointEventTypes.safeParse(eventTypes).success) {
    errors.eventTypes = "Each event type must be 255 characters or fewer.";
  }

  return errors;
}

function sameSet(a: string[], b: string[]) {
  return a.length === b.length && a.every((value) => b.includes(value));
}

/** Just the fields that differ from the saved endpoint. Empty when nothing changed. */
export function diffEndpoint(
  endpoint: EndpointResponse,
  values: EndpointFormValues,
): UpdateEndpointBody {
  const changes: UpdateEndpointBody = {};

  if (values.url !== endpoint.url) changes.url = values.url;
  if ((values.description || null) !== endpoint.description) {
    changes.description = values.description || null;
  }
  if (!sameSet(values.eventTypes, endpoint.eventTypes)) changes.eventTypes = values.eventTypes;

  const status = values.active ? "active" : "disabled";
  if (status !== endpoint.status) changes.status = status;

  return changes;
}
