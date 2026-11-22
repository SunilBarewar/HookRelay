import { Button } from "../../components/ui/Button.tsx";
import { EmptyState } from "../../components/ui/EmptyState.tsx";
import { ErrorAlert } from "../../components/ui/ErrorAlert.tsx";
import { ListSkeleton } from "../../components/ui/ListSkeleton.tsx";
import { errorMessage, type EndpointResponse } from "../../lib/api/index.ts";
import { DeliveryRow } from "./DeliveryRow.tsx";
import { useDeliveries } from "./hooks.ts";

const inboxIcon = (
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
    <path d="M22 12h-6l-2 3h-4l-2-3H2" />
    <path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1Z" />
  </svg>
);

/** The events delivered to one endpoint, with loading, error, empty and load-more handling. */
export function DeliveryList({ endpoint }: { endpoint: EndpointResponse }) {
  const deliveries = useDeliveries(endpoint.applicationId, endpoint.id);

  if (deliveries.isPending) return <ListSkeleton label="Loading events…" />;

  if (deliveries.isError) {
    return (
      <ErrorAlert
        title="We couldn’t load the events"
        message={errorMessage(deliveries.error)}
        retrying={deliveries.isFetching}
        onRetry={() => void deliveries.refetch()}
      />
    );
  }

  const items = deliveries.data.pages.flatMap((page) => page.items);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={inboxIcon}
        title="No events yet"
        description={
          endpoint.status === "active"
            ? `Events published to this application with one of these types will appear here: ${[...endpoint.eventTypes].sort().join(", ")}.`
            : "This endpoint is disabled, so new events aren’t delivered to it. Turn it back on from the endpoints page to receive them."
        }
      />
    );
  }

  return (
    <section aria-label="Events">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-sm text-slate-500">
          {items.length} {items.length === 1 ? "event" : "events"}
          {deliveries.hasNextPage ? " loaded" : ""}
        </p>
        <Button
          variant="secondary"
          className="h-9 px-3"
          loading={deliveries.isFetching && !deliveries.isFetchingNextPage}
          onClick={() => void deliveries.refetch()}
        >
          {deliveries.isFetching && !deliveries.isFetchingNextPage ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {items.map((delivery) => (
          <DeliveryRow key={delivery.id} delivery={delivery} />
        ))}
      </ul>

      {deliveries.hasNextPage && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="secondary"
            loading={deliveries.isFetchingNextPage}
            onClick={() => void deliveries.fetchNextPage()}
          >
            {deliveries.isFetchingNextPage ? "Loading…" : "Load more events"}
          </Button>
        </div>
      )}
    </section>
  );
}
