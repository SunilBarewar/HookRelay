import { useState, type FormEvent } from "react";

import { Button } from "../../components/ui/Button.tsx";
import { TextField } from "../../components/ui/TextField.tsx";
import { CreateApplicationBody } from "@hookrelay/shared/schemas";

interface ApplicationNameFormProps {
  /** Pre-fills and selects the name when renaming. */
  initialName?: string;
  submitLabel: string;
  /** Button label while the request is in flight, e.g. "Saving…". */
  pendingLabel: string;
  pending: boolean;
  /** Failure from the server, shown above the buttons. */
  error?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

/** Checks the name against the API's own schema, but words the problem for people. */
function validateName(name: string): { name: string } | { error: string } {
  const result = CreateApplicationBody.safeParse({ name });
  if (result.success) return result.data;
  return {
    error: name.trim() ? "Use 255 characters or fewer." : "Enter a name for the application.",
  };
}

/** The name field and buttons shared by the create and rename dialogs. */
export function ApplicationNameForm({
  initialName,
  submitLabel,
  pendingLabel,
  pending,
  error,
  onSubmit,
  onCancel,
}: ApplicationNameFormProps) {
  const [nameError, setNameError] = useState<string>();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    const checked = validateName(String(new FormData(form).get("name") ?? ""));

    if ("error" in checked) {
      setNameError(checked.error);
      (form.elements.namedItem("name") as HTMLElement | null)?.focus();
      return;
    }

    setNameError(undefined);
    onSubmit(checked.name);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <TextField
        data-autofocus
        label="Application name"
        name="name"
        autoComplete="off"
        placeholder="Billing service"
        defaultValue={initialName}
        onFocus={(event) => initialName && event.currentTarget.select()}
        error={nameError}
        onChange={() => nameError && setNameError(undefined)}
      />

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
