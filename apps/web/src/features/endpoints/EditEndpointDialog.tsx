import { Dialog } from "../../components/ui/Dialog.tsx";
import { errorMessage, type EndpointResponse } from "../../lib/api/index.ts";
import { diffEndpoint } from "./endpoint-values.ts";
import { EndpointForm } from "./EndpointForm.tsx";
import { useUpdateEndpoint } from "./hooks.ts";

interface EditEndpointDialogProps {
  applicationId: string;
  /** The endpoint being edited; the dialog is open while this is set. */
  endpoint: EndpointResponse | null;
  onClose: () => void;
  onSaved: (endpoint: EndpointResponse) => void;
}

export function EditEndpointDialog({
  applicationId,
  endpoint,
  onClose,
  onSaved,
}: EditEndpointDialogProps) {
  const update = useUpdateEndpoint(applicationId);

  function close() {
    update.reset();
    onClose();
  }

  return (
    <Dialog
      open={endpoint !== null}
      onClose={close}
      dismissible={!update.isPending}
      title="Edit endpoint"
      description="Change where events are sent, which events it receives, or pause delivery."
    >
      {endpoint && (
        <EndpointForm
          initial={{
            url: endpoint.url,
            description: endpoint.description ?? "",
            eventTypes: [...endpoint.eventTypes].sort(),
            active: endpoint.status === "active",
          }}
          showStatus
          submitLabel="Save changes"
          pendingLabel="Saving…"
          pending={update.isPending}
          error={update.isError ? errorMessage(update.error) : undefined}
          onCancel={close}
          onSubmit={(values) => {
            const changes = diffEndpoint(endpoint, values);

            // Nothing changed, so there is nothing to save.
            if (Object.keys(changes).length === 0) return close();

            update.mutate(
              { id: endpoint.id, changes },
              {
                onSuccess: (saved) => {
                  onSaved(saved);
                  close();
                },
              },
            );
          }}
        />
      )}
    </Dialog>
  );
}
