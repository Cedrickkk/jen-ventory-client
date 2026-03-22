import type { PageParamsSchema } from "@/features/api/schema/pagination";
import {
  createCustomer,
  editCustomer,
  getAllCustomers,
  getCustomerById,
  getCustomerDebtHistory,
  getCustomerDebtSummary,
  getCustomerGCashHistory,
  getCustomerTransactions,
  searchCustomer,
  toggleCustomerStatus,
} from "@/features/customers/api/customer-api";
import type {
  CreateCustomer,
  EditCustomer,
} from "@/features/customers/schema/customer";
import {
  keepPreviousData,
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
      placeholderData: keepPreviousData,
    });
  },
  details: () => [...customerQueries.all(), "detail"] as const,
  detail: (id: number) => {
    return queryOptions({
      queryKey: [...customerQueries.details(), id],
      queryFn: () => getCustomerById(id),
    });
  },
  searches: () => [...customerQueries.all(), "search"] as const,
  search: (query: string) => {
    return queryOptions({
      queryKey: [...customerQueries.searches(), query],
      queryFn: () => searchCustomer(query),
      placeholderData: keepPreviousData,
    });
  },
  transactions: (id: number) =>
    [...customerQueries.detail(id).queryKey, "transactions"] as const,
  transaction: (id: number) => {
    return queryOptions({
      queryKey: customerQueries.transactions(id),
      queryFn: () => getCustomerTransactions(id),
    });
  },
  debts: (id: number) =>
    [...customerQueries.detail(id).queryKey, "debts"] as const,
  debtSummary: (id: number | null) => {
    return queryOptions({
      queryKey: [...customerQueries.debts(id!), "summary"],
      queryFn: () => getCustomerDebtSummary(id!),
      enabled: id !== null,
    });
  },
  debtHistory: (id: number | null) => {
    return queryOptions({
      queryKey: [...customerQueries.debts(id!), "history"],
      queryFn: () => getCustomerDebtHistory(id!),
      enabled: id !== null,
    });
  },
  gCashHistories: (id: number) =>
    [...customerQueries.detail(id).queryKey, id, "gcash"] as const,
  gCashHistory: (id: number) => {
    return queryOptions({
      queryKey: customerQueries.gCashHistories(id),
      queryFn: () => getCustomerGCashHistory(id),
    });
  },
};

export const useGetCustomers = (params?: PageParamsSchema) => {
  return useQuery(customerQueries.list(params));
};

export const useGetCustomerById = (id: number) => {
  return useQuery(customerQueries.detail(id));
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
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: customerQueries.detail(variables.id).queryKey,
      });
      queryClient.invalidateQueries({ queryKey: customerQueries.lists() });
      queryClient.invalidateQueries({ queryKey: customerQueries.searches() });
    },
  });
};

export const useToggleCustomerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      toggleCustomerStatus(id, active),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: customerQueries.lists() });
      queryClient.invalidateQueries({
        queryKey: customerQueries.detail(variables.id).queryKey,
      });
      queryClient.invalidateQueries({ queryKey: customerQueries.searches() });
    },
  });
};

export const useGetCustomerTransactions = (id: number) => {
  return useQuery(customerQueries.transaction(id));
};

export const useGetCustomerDebtHistory = (id: number | null) => {
  return useQuery(customerQueries.debtHistory(id));
};

export const useGetCustomerDebtSummary = (id: number | null) => {
  return useQuery(customerQueries.debtSummary(id));
};

export const useGetCustomerGCashHistory = (id: number) => {
  return useQuery(customerQueries.gCashHistory(id));
};
