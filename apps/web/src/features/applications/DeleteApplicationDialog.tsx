import { Button } from "../../components/ui/Button.tsx";
import { Dialog } from "../../components/ui/Dialog.tsx";
import { errorMessage, type ApplicationResponse } from "../../lib/api/index.ts";
import { useDeleteApplication } from "./hooks.ts";

interface DeleteApplicationDialogProps {
  /** The application being deleted; the dialog is open while this is set. */
  application: ApplicationResponse | null;
  onClose: () => void;
  onDeleted: (application: ApplicationResponse) => void;
}

export function DeleteApplicationDialog({
  application,
  onClose,
  onDeleted,
}: DeleteApplicationDialogProps) {
  const remove = useDeleteApplication();

  function close() {
    remove.reset();
    onClose();
  }

  return (
    <Dialog
      open={application !== null}
      onClose={close}
      dismissible={!remove.isPending}
      title={application ? `Delete “${application.name}”?` : "Delete application"}
      description="This permanently deletes the application and everything in it: its endpoints, events and delivery history. Deliveries that haven’t been sent yet won’t be sent. This can’t be undone."
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
            application &&
            remove.mutate(application.id, {
              onSuccess: () => {
                onDeleted(application);
                close();
              },
            })
          }
        >
          {remove.isPending ? "Deleting…" : "Delete application"}
        </Button>
      </div>
    </Dialog>
  );
}
