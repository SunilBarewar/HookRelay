import type { ReactNode } from "react";

import { EmptyState } from "../../components/ui/EmptyState.tsx";
import { ErrorAlert } from "../../components/ui/ErrorAlert.tsx";
import { ListSkeleton } from "../../components/ui/ListSkeleton.tsx";
import { errorMessage, type EndpointResponse } from "../../lib/api/index.ts";
import { EndpointRow } from "./EndpointRow.tsx";
import { useEndpoints } from "./hooks.ts";

const endpointIcon = (
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
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  </svg>
);

interface EndpointListProps {
  applicationId: string;
  highlightedId?: string;
  /** Shown in the empty state, e.g. a button to add the first endpoint. */
  emptyAction?: ReactNode;
  onEdit: (endpoint: EndpointResponse) => void;
  onDelete: (endpoint: EndpointResponse) => void;
}

/** An application's endpoints, with loading, error and empty states. */
export function EndpointList({
  applicationId,
  highlightedId,
  emptyAction,
  onEdit,
  onDelete,
}: EndpointListProps) {
  const endpoints = useEndpoints(applicationId);

  if (endpoints.isPending) return <ListSkeleton label="Loading endpoints…" />;

  if (endpoints.isError) {
    return (
      <ErrorAlert
        title="We couldn’t load the endpoints"
        message={errorMessage(endpoints.error)}
        retrying={endpoints.isFetching}
        onRetry={() => void endpoints.refetch()}
      />
    );
  }

  if (endpoints.data.length === 0) {
    return (
      <EmptyState
        icon={endpointIcon}
        title="No endpoints yet"
        description="Endpoints are the URLs that receive this application’s events. Add one to start delivering them."
        action={emptyAction}
      />
    );
  }

  const count = endpoints.data.length;

  return (
    <section aria-label="Endpoints">
      <p className="mb-3 text-sm text-slate-500">
        {count} {count === 1 ? "endpoint" : "endpoints"}
      </p>
      <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {endpoints.data.map((endpoint) => (
          <EndpointRow
            key={endpoint.id}
            endpoint={endpoint}
            highlighted={endpoint.id === highlightedId}
            onEdit={() => onEdit(endpoint)}
            onDelete={() => onDelete(endpoint)}
          />
        ))}
      </ul>
    </section>
  );
}
