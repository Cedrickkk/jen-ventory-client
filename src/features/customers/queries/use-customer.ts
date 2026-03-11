import type { PageParamsSchema } from "@/features/api/schema/pagination";
import {
  createCustomer,
  editCustomer,
  getAllCustomers,
  searchCustomer,
  toggleCustomerStatus,
} from "@/features/customers/api/customer-api";
import type {
  CreateCustomer,
  EditCustomer,
} from "@/features/customers/schema/customer";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

export const customerQueries = {
  all: () => ["customers"] as const,
  lists: () => [...customerQueries.all(), "list"] as const,
  list: (params?: PageParamsSchema) => {
    return queryOptions({
      queryKey: [...customerQueries.lists(), params],
      queryFn: () => getAllCustomers(params),
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

export const useGetCustomers = (params?: PageParamsSchema) => {
  return useQuery(customerQueries.list(params));
};

export const useSearchCustomer = (searchQuery: string) => {
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  return useQuery({
    ...customerQueries.search(debouncedSearch),
    enabled: debouncedSearch.length >= 3,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customer: CreateCustomer) => createCustomer(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerQueries.lists() });
    },
  });
};

export const useEditCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, customer }: { id: number; customer: EditCustomer }) =>
      editCustomer(id, customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerQueries.lists() });
    },
  });
};

export const useToggleCustomerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      toggleCustomerStatus(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerQueries.lists() });
    },
  });
};
