import {
  getAllCustomers,
  searchCustomer,
} from "@/features/customers/api/customer-api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

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
  searches: () => [...customerQueries.all(), "search"] as const,
  search: (query: string) => {
    return queryOptions({
      queryKey: [...customerQueries.searches(), query],
      queryFn: () => searchCustomer(query),
    });
  },
};

export const useGetCustomers = () => {
  return useQuery(customerQueries.list());
};

export const useSearchCustomer = (searchQuery: string) => {
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  return useQuery({
    ...customerQueries.search(debouncedSearch),
    enabled: debouncedSearch.length >= 3,
  });
};
