import { useQuery } from "@tanstack/react-query";

import { apiClient } from "../../lib/api/index.ts";

export const applicationsKey = ["applications"] as const;

export function useApplications() {
  return useQuery({
    queryKey: applicationsKey,
    queryFn: apiClient.application.list,
  });
}
