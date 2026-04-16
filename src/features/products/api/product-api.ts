import type { PageParamsSchema } from "@/features/api/schema/pagination";
import type {
  ErrorApiResponse,
  SuccessApiResponse,
} from "@/features/api/schema/response";
import type {
  AdjustmentRequest,
  CreateProduct,
  CreateProductVariant,
  EditProductVariant,
  PaginatedProduct,
  PaginatedProductVariant,
  Product,
  ProductVariant,
  RestockRequest,
  ReturnRequest,
} from "@/features/products/schema/product";
import { api } from "@/lib/api";
import axios from "axios";

export const getAllProducts = async (params?: PageParamsSchema) => {
  try {
    const response = await api.get<SuccessApiResponse<PaginatedProduct>>(
      "/products",
      {
        params: {
          page: params?.page,
          size: params?.size ?? 10,
          sort: params?.sort,
        },
        paramsSerializer: {
          indexes: null,
        },
      },
    );
    if (!response) return null;
    const { data } = response;
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ErrorApiResponse;
    }
    throw error;
  }
};

export const getProductById = async (id: number) => {
  try {
    const { data } = await api.get<SuccessApiResponse<Product>>(
      `/products/${id}`,
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ErrorApiResponse;
    }
    throw error;
  }
};

export const searchProduct = async (query: string) => {
  try {
    const response = await api.get<SuccessApiResponse<Array<Product>>>(
      `/products/search?query=${query}`,
    );
    if (!response) return null;
    const { data } = response;
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ErrorApiResponse;
    }
    throw error;
  }
};

export const getProductVariantsByProductId = async (
  id: number,
  params?: PageParamsSchema,
) => {
  try {
    const response = await api.get<SuccessApiResponse<PaginatedProductVariant>>(
      `/products/${id}/variants`,
      {
        params: {
          page: params?.page,
          size: params?.size ?? 10,
          sort: params?.sort,
        },
        paramsSerializer: {
          indexes: null,
        },
      },
    );
    if (!response) return null;
    const { data } = response;
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ErrorApiResponse;
    }
    throw error;
  }
};

export const toggleProductStatus = async (id: number, active: boolean) => {
  try {
    const endpoint = active
      ? `/products/${id}/deactivate`
      : `/products/${id}/reactivate`;
    const { data } = await api.patch<SuccessApiResponse<Product>>(endpoint);
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ErrorApiResponse;
    }
    throw error;
  }
};

export const createProduct = async (product: CreateProduct) => {
  try {
    const formData = new FormData();
    formData.append("name", product.name);

    if (product.description) {
      formData.append("description", product.description);
    }

    if (product.image) {
      formData.append("image", product.image);
    }

    const { data } = await api.post<SuccessApiResponse<Product>>(
      `/products`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ErrorApiResponse;
    }
    throw error;
  }
};

export const createProductVariant = async (
  id: number,
  variant: CreateProductVariant,
) => {
  try {
    const formData = new FormData();
    formData.append("sku", variant.sku);
    formData.append("price", String(variant.price));
    if (variant.size) formData.append("size", variant.size);
    if (variant.flavor) formData.append("flavor", variant.flavor);
    if (variant.packaging) formData.append("packaging", variant.packaging);
    if (variant.image) formData.append("image", variant.image);

    const { data } = await api.post<SuccessApiResponse<ProductVariant>>(
      `/products/${id}/variants`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ErrorApiResponse;
    }
    throw error;
  }
};

export const editProductVariant = async (
  id: number,
  variant: EditProductVariant,
) => {
  try {
    const { data } = await api.put<SuccessApiResponse<ProductVariant>>(
      `/products/${id}/variants/${variant.id}`,
      variant,
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ErrorApiResponse;
    }
    throw error;
  }
};

export const getProductVariantDetailsById = async (
  productId: number,
  variantId: number,
) => {
  try {
    const { data } = await api.get<SuccessApiResponse<ProductVariant>>(
      `/products/${productId}/variants/${variantId}`,
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ErrorApiResponse;
    }
    throw error;
  }
};

export const restockProductVariant = async (
  productId: number,
  variantId: number,
  request: RestockRequest,
) => {
  try {
    const { data } = await api.post<SuccessApiResponse<ProductVariant>>(
      `/products/${productId}/variants/${variantId}/restock`,
      request,
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ErrorApiResponse;
    }
    throw error;
  }
};

export const adjustProductVariantStock = async (
  productId: number,
  variantId: number,
  request: AdjustmentRequest,
) => {
  try {
    const { data } = await api.post<SuccessApiResponse<ProductVariant>>(
      `/products/${productId}/variants/${variantId}/adjustment`,
      request,
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ErrorApiResponse;
    }
    throw error;
  }
};

export const returnProductVariantStock = async (
  productId: number,
  variantId: number,
  request: ReturnRequest,
) => {
  try {
    const { data } = await api.post<SuccessApiResponse<ProductVariant>>(
      `/products/${productId}/variants/${variantId}/return`,
      request,
    );
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as ErrorApiResponse;
    }
    throw error;
  }
};
