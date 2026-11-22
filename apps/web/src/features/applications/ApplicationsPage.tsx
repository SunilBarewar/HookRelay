import { useEffect, useRef, useState } from "react";

import { Button } from "../../components/ui/Button.tsx";
import { EmptyState } from "../../components/ui/EmptyState.tsx";
import { errorMessage, type ApplicationResponse } from "../../lib/api/index.ts";
import { CreateApplicationDialog } from "./CreateApplicationDialog.tsx";
import { DeleteApplicationDialog } from "./DeleteApplicationDialog.tsx";
import { EditApplicationDialog } from "./EditApplicationDialog.tsx";
import { ApplicationRow } from "./ApplicationRow.tsx";
import { ApplicationsSkeleton } from "./ApplicationsSkeleton.tsx";
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

const plusIcon = (
  <svg
    className="size-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
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
      {plusIcon}
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
  const restoreFocus = useRef(false);

  // The control that opened a dialog can disappear while it is open: creating the first
  // application replaces the empty-state button, and deleting a row removes its buttons. The
  // browser then has nowhere to return focus, so move it somewhere sensible.
  useEffect(() => {
    if (!restoreFocus.current) return;
    restoreFocus.current = false;
    if (document.activeElement === document.body) {
      (headerButtonRef.current ?? headingRef.current)?.focus();
    }
  }, [creating, editing, deleting]);

  function dialogClosed() {
    restoreFocus.current = true;
  }

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

      {applications.isPending && <ApplicationsSkeleton />}

      {applications.isError && (
        <div
          role="alert"
          className="flex flex-col items-start gap-4 rounded-2xl border border-red-200 bg-red-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold text-red-900">We couldn’t load your applications</p>
            <p className="mt-1 text-sm text-red-800">{errorMessage(applications.error)}</p>
          </div>
          <Button
            variant="secondary"
            loading={applications.isFetching}
            onClick={() => void applications.refetch()}
          >
            {applications.isFetching ? "Retrying…" : "Try again"}
          </Button>
        </div>
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
