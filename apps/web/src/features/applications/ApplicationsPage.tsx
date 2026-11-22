import { useRef, useState } from "react";

import { Button } from "../../components/ui/Button.tsx";
import { EmptyState } from "../../components/ui/EmptyState.tsx";
import { ErrorAlert } from "../../components/ui/ErrorAlert.tsx";
import { ListSkeleton } from "../../components/ui/ListSkeleton.tsx";
import { PlusIcon } from "../../components/ui/PlusIcon.tsx";
import { errorMessage, type ApplicationResponse } from "../../lib/api/index.ts";
import { useFocusFallback } from "../../lib/use-focus-fallback.ts";
import { CreateApplicationDialog } from "./CreateApplicationDialog.tsx";
import { DeleteApplicationDialog } from "./DeleteApplicationDialog.tsx";
import { EditApplicationDialog } from "./EditApplicationDialog.tsx";
import { ApplicationRow } from "./ApplicationRow.tsx";
import { useApplications } from "./hooks.ts";

const stackIcon = (
  <svg
    className="size-6"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 3 3 8l9 5 9-5-9-5Z" />
    <path d="m3 13 9 5 9-5" />
  </svg>
);

function NewApplicationButton({
  onClick,
  ref,
}: {
  onClick: () => void;
  ref?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <Button ref={ref} onClick={onClick}>
      <PlusIcon />
      New application
    </Button>
  );
}

export function ApplicationsPage() {
  const applications = useApplications();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<ApplicationResponse | null>(null);
  const [deleting, setDeleting] = useState<ApplicationResponse | null>(null);
  /** What the last dialog did, announced to screen readers. */
  const [notice, setNotice] = useState("");
  /** The row to tint after it was created or renamed. */
  const [highlightedId, setHighlightedId] = useState<string>();
  const hasApplications = applications.isSuccess && applications.data.length > 0;

  const headingRef = useRef<HTMLHeadingElement>(null);
  const headerButtonRef = useRef<HTMLButtonElement>(null);

  // Creating the first application replaces the empty-state button that opened the dialog, and
  // deleting a row removes its buttons, so focus may have nowhere to return to.
  const dialogClosed = useFocusFallback(`${creating}|${editing?.id}|${deleting?.id}`, [
    headerButtonRef,
    headingRef,
  ]);

  return (
    <>
      <title>Applications · HookRelay</title>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-semibold tracking-tight text-slate-900 outline-none"
          >
            Applications
          </h1>
          <p className="mt-1.5 max-w-2xl text-[15px] leading-6 text-slate-600">
            An application groups the endpoints and events for one product or environment.
          </p>
        </div>
        {/* The empty state has its own button, so the header one waits for a first application. */}
        {hasApplications && (
          <NewApplicationButton ref={headerButtonRef} onClick={() => setCreating(true)} />
        )}
      </div>

      {/* Tells screen reader users what the dialog just did. */}
      <p role="status" className="sr-only">
        {notice}
      </p>

      {applications.isPending && <ListSkeleton label="Loading your applications…" />}

      {applications.isError && (
        <ErrorAlert
          title="We couldn’t load your applications"
          message={errorMessage(applications.error)}
          retrying={applications.isFetching}
          onRetry={() => void applications.refetch()}
        />
      )}

      {applications.isSuccess &&
        (applications.data.length === 0 ? (
          <EmptyState
            icon={stackIcon}
            title="No applications yet"
            description="Create an application to start adding endpoints and sending events."
            action={<NewApplicationButton onClick={() => setCreating(true)} />}
          />
        ) : (
          <section aria-label="Your applications">
            <p className="mb-3 text-sm text-slate-500">
              {applications.data.length}{" "}
              {applications.data.length === 1 ? "application" : "applications"}
            </p>
            <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {applications.data.map((application) => (
                <ApplicationRow
                  key={application.id}
                  application={application}
                  highlighted={application.id === highlightedId}
                  onEdit={() => setEditing(application)}
                  onDelete={() => setDeleting(application)}
                />
              ))}
            </ul>
          </section>
        ))}

      <CreateApplicationDialog
        open={creating}
        onClose={() => {
          dialogClosed();
          setCreating(false);
        }}
        onCreated={(application) => {
          setHighlightedId(application.id);
          setNotice(`Created application ${application.name}`);
        }}
      />
      <EditApplicationDialog
        application={editing}
        onClose={() => {
          dialogClosed();
          setEditing(null);
        }}
        onSaved={(application) => {
          setHighlightedId(application.id);
          setNotice(`Renamed application to ${application.name}`);
        }}
      />
      <DeleteApplicationDialog
        application={deleting}
        onClose={() => {
          dialogClosed();
          setDeleting(null);
        }}
        onDeleted={(application) => {
          setHighlightedId(undefined);
          setNotice(`Deleted application ${application.name}`);
        }}
      />
    </>
  );
}
