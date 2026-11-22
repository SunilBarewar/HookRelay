import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  apiClient,
  type CreateEndpointBody,
  type UpdateEndpointBody,
} from "../../lib/api/index.ts";

export const endpointsKey = (applicationId: string) => ["endpoints", applicationId] as const;

export function useEndpoints(applicationId: string, enabled = true) {
  return useQuery({
    queryKey: endpointsKey(applicationId),
    queryFn: () => apiClient.endpoint.list(applicationId),
    enabled,
  });
}

export function useUpdateEndpoint(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, changes }: { id: string; changes: UpdateEndpointBody }) =>
      apiClient.endpoint.update(applicationId, id, changes),
    // Returning the promise keeps the mutation pending until the list has refreshed.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: endpointsKey(applicationId) }),
  });
}

export function useDeleteEndpoint(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (endpointId: string) => apiClient.endpoint.delete(applicationId, endpointId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: endpointsKey(applicationId) }),
  });
}

export function useCreateEndpoint(applicationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateEndpointBody) => apiClient.endpoint.create(applicationId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: endpointsKey(applicationId) }),
  });
}
