import { type PageParamsSchema } from "@/features/api/schema/pagination";
import {
  createGCashServiceLogTransaction,
  getAllGCashFeeTiers,
  getAllGCashServiceLogs,
  searchGCashServiceLog,
} from "@/features/gcash/api/gcash-api";
import type { CreateGCashServiceLog } from "@/features/gcash/schema/gcash";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

export const gcashQueries = {
  all: () => ["gcash"] as const,
  feeTiers: () => [...gcashQueries.all(), "fee-tiers"] as const,
  feeTier: () => {
    return queryOptions({
      queryKey: gcashQueries.feeTiers(),
      queryFn: () => getAllGCashFeeTiers(),
    });
  },
  logs: () => [...gcashQueries.all(), "logs"] as const,
  log: (params?: PageParamsSchema) =>
    queryOptions({
      queryKey: [...gcashQueries.logs(), params],
      queryFn: () => getAllGCashServiceLogs(params),
    }),
  searches: () => [...gcashQueries.all(), "search"] as const,
  search: (query: string, params?: PageParamsSchema) => {
    return queryOptions({
      queryKey: [...gcashQueries.searches(), query],
      queryFn: () => searchGCashServiceLog(query, params),
    });
  },
};

export const useGetGCashFeeTiers = () => {
  return useQuery(gcashQueries.feeTier());
};

export const useGetGCashServiceLogs = (params?: PageParamsSchema) => {
  return useQuery(gcashQueries.log(params));
};

export const useCreateGCashServiceLog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gcashServiceLog: CreateGCashServiceLog) =>
      createGCashServiceLogTransaction(gcashServiceLog),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: gcashQueries.logs(),
      });
    },
  });
};

export const useSearchGCashServiceLog = (searchQuery: string) => {
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  return useQuery({
    ...gcashQueries.search(debouncedSearch),
    enabled: debouncedSearch.length >= 3,
  });
};
