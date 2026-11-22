import { useState, type FormEvent } from "react";

import { Button } from "../../components/ui/Button.tsx";
import { Dialog } from "../../components/ui/Dialog.tsx";
import { TextField } from "../../components/ui/TextField.tsx";
import { CreateApplicationBody } from "@hookrelay/shared/schemas";
import { errorMessage, type ApplicationResponse } from "../../lib/api/index.ts";
import { useCreateApplication } from "./hooks.ts";

interface CreateApplicationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (application: ApplicationResponse) => void;
}

/** Checks the name against the API's own schema, but words the problem for people. */
function validateName(name: string): { name: string } | { error: string } {
  const result = CreateApplicationBody.safeParse({ name });
  if (result.success) return result.data;
  return {
    error: name.trim() ? "Use 255 characters or fewer." : "Enter a name for the application.",
  };
}

export function CreateApplicationDialog({
  open,
  onClose,
  onCreated,
}: CreateApplicationDialogProps) {
  const create = useCreateApplication();
  const [nameError, setNameError] = useState<string>();

  function close() {
    create.reset();
    setNameError(undefined);
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (create.isPending) return;

    const form = event.currentTarget;
    const name = String(new FormData(form).get("name") ?? "");
    const checked = validateName(name);

    if ("error" in checked) {
      setNameError(checked.error);
      (form.elements.namedItem("name") as HTMLElement | null)?.focus();
      return;
    }

    setNameError(undefined);
    create.mutate(checked, {
      onSuccess: (application) => {
        onCreated(application);
        close();
      },
    });
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      dismissible={!create.isPending}
      title="Create an application"
      description="Name it after the product or environment it’s for. You can add endpoints to it next."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <TextField
          data-autofocus
          label="Application name"
          name="name"
          autoComplete="off"
          placeholder="Billing service"
          error={nameError}
          onChange={() => nameError && setNameError(undefined)}
        />

        <div aria-live="polite">
          {create.isError && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-800"
            >
              {errorMessage(create.error)}
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" disabled={create.isPending} onClick={close}>
            Cancel
          </Button>
          <Button type="submit" loading={create.isPending}>
            {create.isPending ? "Creating…" : "Create application"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
