import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      /**
       * Force all queries to refetch
       */
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        queryClient.clear();
        window.location.href = "/";
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        queryClient.clear();
        window.location.href = "/";
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
