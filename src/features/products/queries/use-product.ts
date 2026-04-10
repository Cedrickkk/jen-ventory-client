import type { PageParamsSchema } from "@/features/api/schema/pagination";
import {
  createProduct,
  createProductVariant,
  editProductVariant,
  getAllProducts,
  getProductById,
  getProductVariantsById,
  searchProduct,
  toggleProductStatus,
} from "@/features/products/api/product-api";
import type {
  CreateProduct,
  CreateProductVariant,
  EditProductVariant,
} from "@/features/products/schema/product";
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

export const productQueries = {
  all: () => ["products"] as const,
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

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: CreateProduct) => createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueries.searches() });
      queryClient.invalidateQueries({ queryKey: productQueries.lists() });
    },
  });
};

export const useCreateProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      variant,
    }: {
      id: number;
      variant: CreateProductVariant;
    }) => createProductVariant(id, variant),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productQueries.lists() });
      queryClient.invalidateQueries({
        queryKey: productQueries.variants(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: productQueries.searches() });
    },
  });
};

export const useEditProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      variant,
    }: {
      id: number;
      variant: EditProductVariant;
    }) => editProductVariant(id, variant),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productQueries.variants(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: productQueries.variant(variables.variant.id).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: productQueries.detail(variables.id).queryKey,
      });
      queryClient.invalidateQueries({ queryKey: productQueries.lists() });
      queryClient.invalidateQueries({ queryKey: productQueries.searches() });
    },
  });
};

export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      toggleProductStatus(id, active),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: productQueries.lists() });
      queryClient.invalidateQueries({
        queryKey: productQueries.detail(variables.id).queryKey,
      });
      queryClient.invalidateQueries({ queryKey: productQueries.searches() });
    },
  });
};
