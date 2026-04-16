import type { PageParamsSchema } from "@/features/api/schema/pagination";
import {
  adjustProductVariantStock,
  createProduct,
  createProductVariant,
  editProductVariant,
  getAllProducts,
  getProductById,
  getProductVariantDetailsById,
  getProductVariantsByProductId,
  restockProductVariant,
  returnProductVariantStock,
  searchProduct,
  toggleProductStatus,
} from "@/features/products/api/product-api";
import type {
  AdjustmentDirection,
  CreateProduct,
  CreateProductVariant,
  EditProductVariant,
  StockMovementType,
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
  variants: (productId: number) =>
    [...productQueries.detail(productId).queryKey, "variants"] as const,
  variant: (productId: number | null, params?: PageParamsSchema) => {
    return queryOptions({
      queryKey: productQueries.variants(productId!),
      queryFn: () => getProductVariantsByProductId(productId!, params),
      enabled: productId !== null,
    });
  },
  variantDetail: (productId: number, variantId: number) => {
    return queryOptions({
      queryKey: [...productQueries.variants(productId), "detail", variantId],
      queryFn: () => getProductVariantDetailsById(productId, variantId),
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

export const useCreateProductVariantStockMovement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      variantId,
      movementType,
      quantity,
      direction,
      notes,
    }: {
      productId: number;
      variantId: number;
      movementType: StockMovementType;
      quantity: number;
      direction?: AdjustmentDirection | null;
      notes?: string | null;
    }) => {
      const commonNotes = notes?.trim() ? notes.trim() : undefined;

      if (movementType === "ADJUSTMENT") {
        if (!direction) {
          throw new Error("Direction is required");
        }

        return adjustProductVariantStock(productId, variantId, {
          quantity,
          direction,
          notes: commonNotes,
        });
      }

      if (movementType === "RETURN") {
        return returnProductVariantStock(productId, variantId, {
          quantity,
          notes: commonNotes,
        });
      }

      return restockProductVariant(productId, variantId, {
        quantity,
        notes: commonNotes,
      });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productQueries.detail(variables.productId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: productQueries.variants(variables.productId),
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

export const useProductVariantDetailsById = (
  productId: number,
  variantId: number,
) => {
  return useQuery(productQueries.variantDetail(productId, variantId));
};
