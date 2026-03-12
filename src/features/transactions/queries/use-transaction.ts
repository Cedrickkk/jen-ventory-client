import type { PageParamsSchema } from "@/features/api/schema/pagination";
import {
  getAllTransactions,
  getTransactionById,
} from "@/features/transactions/api/transaction-api";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const transactionQueries = {
  all: () => ["transactions"] as const,
  lists: () => [...transactionQueries.all(), "list"] as const,
  list: (params?: PageParamsSchema) => {
    return queryOptions({
      queryKey: [...transactionQueries.lists(), params],
      queryFn: () => getAllTransactions(params),
      staleTime: 5 * 60 * 1000,
      retry: false,
    });
  },
  details: () => [...transactionQueries.all(), "detail"] as const,
  detail: (id: number) => {
    return queryOptions({
      queryKey: [...transactionQueries.details(), id],
      queryFn: () => getTransactionById(id),
    });
  },
};

export const useGetAllTransactions = (pageParams?: PageParamsSchema) => {
  return useQuery(transactionQueries.list(pageParams));
};

export const useGetTransactionById = (id: number) => {
  return useQuery(transactionQueries.detail(id));
};
