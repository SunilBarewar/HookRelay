import { Button } from "../../components/ui/Button.tsx";
import { Dialog } from "../../components/ui/Dialog.tsx";
import { errorMessage, type EndpointResponse } from "../../lib/api/index.ts";
import { useDeleteEndpoint } from "./hooks.ts";

interface DeleteEndpointDialogProps {
  applicationId: string;
  /** The endpoint being deleted; the dialog is open while this is set. */
  endpoint: EndpointResponse | null;
  onClose: () => void;
  onDeleted: (endpoint: EndpointResponse) => void;
}

export function DeleteEndpointDialog({
  applicationId,
  endpoint,
  onClose,
  onDeleted,
}: DeleteEndpointDialogProps) {
  const remove = useDeleteEndpoint(applicationId);

  function close() {
    remove.reset();
    onClose();
  }

  return (
    <Dialog
      open={endpoint !== null}
      onClose={close}
      dismissible={!remove.isPending}
      title="Delete this endpoint?"
      description={
        endpoint
          ? `${endpoint.url} will stop receiving events. This permanently deletes the endpoint, its event subscriptions and its delivery history, and can’t be undone. To pause it instead, turn off “Receive events” when you edit it.`
          : undefined
      }
    >
      <div aria-live="polite">
        {remove.isError && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm leading-5 text-red-800"
          >
            {errorMessage(remove.error)}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {/* Focus starts on the safe choice. */}
        <Button
          data-autofocus
          type="button"
          variant="secondary"
          disabled={remove.isPending}
          onClick={close}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="danger"
          loading={remove.isPending}
          onClick={() =>
            endpoint &&
            remove.mutate(endpoint.id, {
              onSuccess: () => {
                onDeleted(endpoint);
                close();
              },
            })
          }
        >
          {remove.isPending ? "Deleting…" : "Delete endpoint"}
        </Button>
      </div>
    </Dialog>
  );
}
