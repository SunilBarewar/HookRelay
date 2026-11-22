import { useRef, useState } from "react";
import { Link, useParams } from "react-router";

import { Button, ButtonLink } from "../../components/ui/Button.tsx";
import { EmptyState } from "../../components/ui/EmptyState.tsx";
import { ErrorAlert } from "../../components/ui/ErrorAlert.tsx";
import { ListSkeleton } from "../../components/ui/ListSkeleton.tsx";
import { PlusIcon } from "../../components/ui/PlusIcon.tsx";
import { errorMessage, type EndpointResponse } from "../../lib/api/index.ts";
import { useFocusFallback } from "../../lib/use-focus-fallback.ts";
import { paths } from "../../routes/paths.ts";
import { useApplications } from "../applications/hooks.ts";
import { CreateEndpointDialog } from "./CreateEndpointDialog.tsx";
import { DeleteEndpointDialog } from "./DeleteEndpointDialog.tsx";
import { EditEndpointDialog } from "./EditEndpointDialog.tsx";
import { EndpointList } from "./EndpointList.tsx";
import { useEndpoints } from "./hooks.ts";

function NewEndpointButton({
  onClick,
  ref,
}: {
  onClick: () => void;
  ref?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <Button ref={ref} onClick={onClick}>
      <PlusIcon />
      New endpoint
    </Button>
  );
}

function BackLink() {
  return (
    <nav aria-label="Breadcrumb" className="mb-5">
      <Link
        to={paths.applications}
        className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <span aria-hidden="true">←</span> Applications
      </Link>
    </nav>
  );
}

/** One application and its endpoints. */
export function EndpointsPage() {
  const { applicationId = "" } = useParams();
  const applications = useApplications();
  const application = applications.data?.find((candidate) => candidate.id === applicationId);

  // The list below reads the same query; this one only decides whether the header button shows.
  const endpoints = useEndpoints(applicationId, Boolean(application));
  const hasEndpoints = endpoints.isSuccess && endpoints.data.length > 0;

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<EndpointResponse | null>(null);
  const [deleting, setDeleting] = useState<EndpointResponse | null>(null);
  /** What the last dialog did, announced to screen readers. */
  const [notice, setNotice] = useState("");
  /** The row to tint after it was edited. */
  const [highlightedId, setHighlightedId] = useState<string>();

  const headingRef = useRef<HTMLHeadingElement>(null);
  const headerButtonRef = useRef<HTMLButtonElement>(null);
  // Adding the first endpoint replaces the empty-state button, and deleting a row removes its
  // buttons, so focus may have nowhere to return to.
  const dialogClosed = useFocusFallback(`${creating}|${editing?.id}|${deleting?.id}`, [
    headerButtonRef,
    headingRef,
  ]);

  if (applications.isPending) {
    return (
      <>
        <BackLink />
        <ListSkeleton label="Loading application…" />
      </>
    );
  }

  if (applications.isError) {
    return (
      <>
        <BackLink />
        <ErrorAlert
          title="We couldn’t load this application"
          message={errorMessage(applications.error)}
          retrying={applications.isFetching}
          onRetry={() => void applications.refetch()}
        />
      </>
    );
  }

  if (!application) {
    return (
      <>
        <title>Application not found · HookRelay</title>
        <BackLink />
        <EmptyState
          title="Application not found"
          description="It may have been deleted, or the link may be wrong."
          action={<ButtonLink to={paths.applications}>Back to applications</ButtonLink>}
        />
      </>
    );
  }

  return (
    <>
      <title>{`${application.name} · HookRelay`}</title>
      <BackLink />

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-2xl font-semibold tracking-tight break-words text-slate-900 outline-none"
          >
            {application.name}
          </h1>
          <p className="mt-1.5 max-w-2xl text-[15px] leading-6 text-slate-600">
            Endpoints receive the events published to this application.
          </p>
        </div>
        {/* The empty state has its own button, so the header one waits for a first endpoint. */}
        {hasEndpoints && (
          <NewEndpointButton ref={headerButtonRef} onClick={() => setCreating(true)} />
        )}
      </div>

      {/* Tells screen reader users what the dialog just did. */}
      <p role="status" className="sr-only">
        {notice}
      </p>

      <EndpointList
        applicationId={application.id}
        highlightedId={highlightedId}
        emptyAction={<NewEndpointButton onClick={() => setCreating(true)} />}
        onEdit={setEditing}
        onDelete={setDeleting}
      />

      <CreateEndpointDialog
        applicationId={application.id}
        open={creating}
        onClose={() => {
          dialogClosed();
          setCreating(false);
        }}
        onCreated={(endpoint) => {
          setHighlightedId(endpoint.id);
          setNotice(`Created endpoint ${endpoint.url}`);
        }}
      />
      <EditEndpointDialog
        applicationId={application.id}
        endpoint={editing}
        onClose={() => {
          dialogClosed();
          setEditing(null);
        }}
        onSaved={(endpoint) => {
          setHighlightedId(endpoint.id);
          setNotice(`Saved changes to ${endpoint.url}`);
        }}
      />
      <DeleteEndpointDialog
        applicationId={application.id}
        endpoint={deleting}
        onClose={() => {
          dialogClosed();
          setDeleting(null);
        }}
        onDeleted={(endpoint) => {
          setHighlightedId(undefined);
          setNotice(`Deleted endpoint ${endpoint.url}`);
        }}
      />
    </>
  );
}
