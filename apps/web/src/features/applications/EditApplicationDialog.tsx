import { Dialog } from "../../components/ui/Dialog.tsx";
import { errorMessage, type ApplicationResponse } from "../../lib/api/index.ts";
import { ApplicationNameForm } from "./ApplicationNameForm.tsx";
import { useUpdateApplication } from "./hooks.ts";

interface EditApplicationDialogProps {
  /** The application being renamed; the dialog is open while this is set. */
  application: ApplicationResponse | null;
  onClose: () => void;
  onSaved: (application: ApplicationResponse) => void;
}

export function EditApplicationDialog({
  application,
  onClose,
  onSaved,
}: EditApplicationDialogProps) {
  const update = useUpdateApplication();

  function close() {
    update.reset();
    onClose();
  }

  return (
    <Dialog
      open={application !== null}
      onClose={close}
      dismissible={!update.isPending}
      title="Rename application"
      description={application ? `Choose a new name for “${application.name}”.` : undefined}
    >
      {application && (
        <ApplicationNameForm
          initialName={application.name}
          submitLabel="Save name"
          pendingLabel="Saving…"
          pending={update.isPending}
          error={update.isError ? errorMessage(update.error) : undefined}
          onCancel={close}
          onSubmit={(name) => {
            // Nothing to save, so don't send a request.
            if (name === application.name) return close();

            update.mutate(
              { id: application.id, name },
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
