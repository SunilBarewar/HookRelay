import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "../../lib/api/index.ts";

export const applicationsKey = ["applications"] as const;

export function useApplications() {
  return useQuery({
    queryKey: applicationsKey,
    queryFn: apiClient.application.list,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.application.create,
    // Returning the promise keeps the mutation pending until the list has refreshed.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationsKey }),
  });
}
