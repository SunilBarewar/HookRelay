import { useState, type FormEvent } from "react";

import { Button } from "../../components/ui/Button.tsx";
import { Switch } from "../../components/ui/Switch.tsx";
import { TextArea } from "../../components/ui/TextArea.tsx";
import { TextField } from "../../components/ui/TextField.tsx";
import {
  endpointFields,
  parseEventTypes,
  validateEndpointValues,
  type EndpointFieldErrors,
  type EndpointFormValues,
} from "./endpoint-values.ts";

interface EndpointFormProps {
  /** Pre-fills the fields when editing; leave out to start blank. */
  initial?: EndpointFormValues;
  /** Editing can pause delivery; a new endpoint always starts active. */
  showStatus: boolean;
  submitLabel: string;
  /** Button label while the request is in flight, e.g. "Saving…". */
  pendingLabel: string;
  pending: boolean;
  /** Failure from the server, shown above the buttons. */
  error?: string;
  onSubmit: (values: EndpointFormValues) => void;
  onCancel: () => void;
}

/** The fields and buttons shared by the create and edit endpoint dialogs. */
export function EndpointForm({
  initial,
  showStatus,
  submitLabel,
  pendingLabel,
  pending,
  error,
  onSubmit,
  onCancel,
}: EndpointFormProps) {
  const [errors, setErrors] = useState<EndpointFieldErrors>({});
  const [active, setActive] = useState(initial?.active ?? true);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const values: EndpointFormValues = {
      url: String(data.get("url") ?? "").trim(),
      description: String(data.get("description") ?? "").trim(),
      eventTypes: parseEventTypes(String(data.get("eventTypes") ?? "")),
      active,
    };

    const problems = validateEndpointValues(values);
    const firstProblem = endpointFields.find((field) => problems[field]);
    if (firstProblem) {
      setErrors(problems);
      (form.elements.namedItem(firstProblem) as HTMLElement | null)?.focus();
      return;
    }

    setErrors({});
    onSubmit(values);
  }

  function clearError(field: keyof EndpointFieldErrors) {
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <TextField
        data-autofocus
        label="Endpoint URL"
        name="url"
        type="url"
        inputMode="url"
        autoComplete="off"
        placeholder="https://example.com/webhooks"
        hint="HookRelay sends events to this address."
        defaultValue={initial?.url}
        error={errors.url}
        onChange={() => clearError("url")}
      />
      <TextField
        label="Description (optional)"
        name="description"
        autoComplete="off"
        placeholder="Production order webhooks"
        defaultValue={initial?.description}
        error={errors.description}
        onChange={() => clearError("description")}
      />
      <TextArea
        label="Event types"
        name="eventTypes"
        autoComplete="off"
        spellCheck={false}
        placeholder={"order.created\norder.paid"}
        hint="One per line. This endpoint only receives events of these types."
        defaultValue={initial?.eventTypes.join("\n")}
        error={errors.eventTypes}
        onChange={() => clearError("eventTypes")}
      />
      {showStatus && (
        <Switch
          checked={active}
          onChange={setActive}
          label="Receive events"
          description={
            active
              ? "Active: matching events are delivered to this endpoint."
              : "Disabled: no events are delivered until you turn it back on."
          }
        />
      )}

      <div aria-live="polite">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-800"
          >
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" disabled={pending} onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={pending}>
          {pending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
