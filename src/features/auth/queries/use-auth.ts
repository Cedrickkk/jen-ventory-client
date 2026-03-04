import { getCurrentUser, login, logout } from "@/features/auth/api/auth-api";
import type { User } from "@/features/auth/schema/user";
import type {
  ErrorApiResponse,
  SuccessApiResponse,
} from "@/features/response/schema/response";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const authQueries = {
  all: () => ["auth"] as const,
  user: () => {
    return queryOptions({
      queryKey: [...authQueries.all(), "user"] as const,
      queryFn: getCurrentUser,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: false,
    });
  },
};

export const useCurrentUser = () => {
  return useQuery(authQueries.user());
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SuccessApiResponse<User>,
    ErrorApiResponse,
    { email: string; password: string }
  >({
    mutationFn: login,
    onSuccess: (response) => {
      queryClient.setQueryData(authQueries.user().queryKey, response.data);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(authQueries.user().queryKey, null);
      queryClient.clear();
    },
  });
};
