import { Dialog } from "../../components/ui/Dialog.tsx";
import { errorMessage, type ApplicationResponse } from "../../lib/api/index.ts";
import { ApplicationNameForm } from "./ApplicationNameForm.tsx";
import { useCreateApplication } from "./hooks.ts";

interface CreateApplicationDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: (application: ApplicationResponse) => void;
}

export function CreateApplicationDialog({
  open,
  onClose,
  onCreated,
}: CreateApplicationDialogProps) {
  const create = useCreateApplication();

  function close() {
    create.reset();
    onClose();
  }

  return (
    <Dialog
      open={open}
      onClose={close}
      dismissible={!create.isPending}
      title="Create an application"
      description="Name it after the product or environment it’s for. You can add endpoints to it next."
    >
      <ApplicationNameForm
        submitLabel="Create application"
        pendingLabel="Creating…"
        pending={create.isPending}
        error={create.isError ? errorMessage(create.error) : undefined}
        onCancel={close}
        onSubmit={(name) =>
          create.mutate(
            { name },
            {
              onSuccess: (application) => {
                onCreated(application);
                close();
              },
            },
          )
        }
      />
    </Dialog>
  );
}
