import type { PageParamsSchema } from "@/features/api/schema/pagination";
import {
  getAllProducts,
  getProductById,
  getProductVariantsById,
  searchProduct,
} from "@/features/products/api/product-api";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

export const productQueries = {
  all: () => ["customers"] as const,
  lists: () => [...productQueries.all(), "list"] as const,
  list: (params?: PageParamsSchema) => {
    return queryOptions({
      queryKey: [...productQueries.lists(), params],
      queryFn: () => getAllProducts(params),
      staleTime: 5 * 60 * 1000,
      retry: false,
    });
  },
  details: () => [...productQueries.all(), "detail"] as const,
  detail: (id: number) => {
    return queryOptions({
      queryKey: [...productQueries.details(), id],
      queryFn: () => getProductById(id),
    });
  },
  searches: () => [...productQueries.all(), "search"] as const,
  search: (query: string) => {
    return queryOptions({
      queryKey: [...productQueries.searches(), query],
      queryFn: () => searchProduct(query),
    });
  },
  variants: (id: number) =>
    [...productQueries.detail(id).queryKey, "variants"] as const,
  variant: (id: number | null, params?: PageParamsSchema) => {
    return queryOptions({
      queryKey: productQueries.variants(id!),
      queryFn: () => getProductVariantsById(id!, params),
      enabled: id !== null,
    });
  },
};

export const useGetProducts = (params?: PageParamsSchema) => {
  return useQuery(productQueries.list(params));
};

export const useGetProductById = (id: number) => {
  return useQuery(productQueries.detail(id));
};

export const useSearchProduct = (searchQuery: string) => {
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  return useQuery({
    ...productQueries.search(debouncedSearch),
    enabled: debouncedSearch.length >= 3,
  });
};

export const useGetProductVariants = (
  id: number | null,
  params?: PageParamsSchema,
) => {
  return useQuery(productQueries.variant(id, params));
};
