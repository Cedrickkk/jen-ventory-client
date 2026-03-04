import { queryOptions, useQuery } from "@tanstack/react-query";
import { getAllCustomers } from "../api/customer-api";

export const customerQueries = {
  all: () => ["customers"] as const,
  lists: () => [...customerQueries.all(), "list"] as const,
  list: () => {
    return queryOptions({
      queryKey: [...customerQueries.lists()],
      queryFn: () => getAllCustomers(),
      staleTime: 5 * 60 * 1000,
      retry: false,
    });
  },
};

export const useGetCustomers = () => {
  return useQuery(customerQueries.list());
};
