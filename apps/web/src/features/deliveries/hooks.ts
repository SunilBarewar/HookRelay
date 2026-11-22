import { useInfiniteQuery } from "@tanstack/react-query";

import { apiClient, type DeliveryListResponse } from "../../lib/api/index.ts";

const REFRESH_WHILE_IN_PROGRESS_MS = 5_000;

export const deliveriesKey = (applicationId: string, endpointId: string) =>
  ["deliveries", applicationId, endpointId] as const;

/** Pending deliveries haven't been tried yet, and failed ones are waiting for a retry. */
function hasWorkInProgress(pages: DeliveryListResponse[] | undefined) {
  return (
    pages?.some((page) =>
      page.items.some((item) => item.status === "pending" || item.status === "failed"),
    ) ?? false
  );
}

/**
 * An endpoint's deliveries, newest first, loaded a page at a time. While any are still being
 * delivered or retried, it refreshes itself so their status updates without a reload.
 */
export function useDeliveries(applicationId: string, endpointId: string) {
  return useInfiniteQuery({
    queryKey: deliveriesKey(applicationId, endpointId),
    queryFn: ({ pageParam }) =>
      apiClient.delivery.list(applicationId, endpointId, pageParam ? { cursor: pageParam } : {}),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchInterval: (query) =>
      hasWorkInProgress(query.state.data?.pages) ? REFRESH_WHILE_IN_PROGRESS_MS : false,
  });
}
