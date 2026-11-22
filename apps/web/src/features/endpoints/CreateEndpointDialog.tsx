import { useState } from "react";

import { Button } from "../../components/ui/Button.tsx";
import { Dialog } from "../../components/ui/Dialog.tsx";
import {
  errorMessage,
  type CreateEndpointResponse,
  type EndpointResponse,
} from "../../lib/api/index.ts";
import { EndpointForm } from "./EndpointForm.tsx";
import { useCreateEndpoint } from "./hooks.ts";
import { SigningSecret } from "./SigningSecret.tsx";

interface CreateEndpointDialogProps {
  applicationId: string;
  open: boolean;
  onClose: () => void;
  /** Called once the person has seen the signing secret and closed the dialog. */
  onCreated: (endpoint: EndpointResponse) => void;
}

/**
 * Step 1 collects the endpoint's details. Step 2 shows its signing secret, which the API reveals
 * only once, so that step can only be left with the Done button.
 */
export function CreateEndpointDialog({
  applicationId,
  open,
  onClose,
  onCreated,
}: CreateEndpointDialogProps) {
  const create = useCreateEndpoint(applicationId);
  const [created, setCreated] = useState<CreateEndpointResponse | null>(null);

  function close() {
    create.reset();
    setCreated(null);
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      // Escape, the backdrop and the X would throw the secret away, so the Done button is the exit.
      dismissible={!create.isPending && !created}
      title={created ? "Endpoint created" : "Create an endpoint"}
      description={
        created
          ? "Copy the signing secret now and keep it somewhere safe. It’s shown only once. If you lose it, delete this endpoint and create a new one."
          : "Choose where events are sent and which event types it should receive."
      }
    >
      {created ? (
        <div className="space-y-6">
          <SigningSecret secret={created.signingSecret} />
          <p className="text-sm leading-6 text-slate-600">
            Use it to check that a webhook really came from HookRelay. It signs every delivery to{" "}
            <span className="font-medium break-all text-slate-900">{created.url}</span>.
          </p>
          <div className="flex sm:justify-end">
            <Button
              type="button"
              className="w-full sm:w-auto"
              onClick={() => {
                onCreated(created);
                close();
              }}
            >
              Done, I’ve saved it
            </Button>
          </div>
        </div>
      ) : (
        <EndpointForm
          showStatus={false}
          submitLabel="Create endpoint"
          pendingLabel="Creating…"
          pending={create.isPending}
          error={create.isError ? errorMessage(create.error) : undefined}
          onCancel={close}
          onSubmit={(values) =>
            create.mutate(
              {
                url: values.url,
                eventTypes: values.eventTypes,
                ...(values.description && { description: values.description }),
              },
              { onSuccess: setCreated },
            )
          }
        />
      )}
    </Dialog>
  );
}
