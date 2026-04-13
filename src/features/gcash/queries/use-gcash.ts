import {
  getAllGCashFeeTiers,
  getAllGCashServiceLogs,
} from "@/features/gcash/api/gcash-api";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const gcashQueries = {
  all: () => ["gcash"] as const,
  feeTiers: () => [...gcashQueries.all(), "fee-tiers"] as const,
  feeTier: () => {
    return queryOptions({
      queryKey: gcashQueries.feeTiers(),
      queryFn: () => getAllGCashFeeTiers(),
    });
  },
  transactions: () => [...gcashQueries.all()] as const,
  transaction: () => {
    return queryOptions({
      queryKey: [...gcashQueries.transactions()],
      queryFn: () => getAllGCashServiceLogs(),
    });
  },
};

export const useGetGCashFeeTiers = () => {
  return useQuery(gcashQueries.feeTier());
};

export const useGetGCashServiceLogs = () => {
  return useQuery(gcashQueries.transaction());
};
