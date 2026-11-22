import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ApiError, apiClient, type CredentialsBody } from "../../lib/api/index.ts";

export const sessionKey = ["session"] as const;

/** The logged-in account, or `null` when there is no valid session cookie. */
export function useSession() {
  return useQuery({
    queryKey: sessionKey,
    queryFn: async () => {
      try {
        return await apiClient.auth.me();
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }
    },
    retry: false,
    staleTime: 60_000,
  });
}

/** Signing up and logging in both set the auth cookie, so both just refresh the session. */
function useCredentialsMutation(request: (values: CredentialsBody) => Promise<unknown>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: request,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sessionKey }),
  });
}

export function useLogin() {
  return useCredentialsMutation(apiClient.auth.login);
}

export function useSignup() {
  return useCredentialsMutation(apiClient.auth.register);
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiClient.auth.logout,
    onSuccess: () => queryClient.setQueryData(sessionKey, null),
  });
}
