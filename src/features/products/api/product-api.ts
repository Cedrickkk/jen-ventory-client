import type { PageParamsSchema } from "@/features/api/schema/pagination";
import type {
  ErrorApiResponse,
  SuccessApiResponse,
} from "@/features/api/schema/response";
import type {
  EditProductVariant,
  PaginatedProduct,
  PaginatedProductVariant,
  Product,
  ProductVariant,
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

export const getProductVariantsById = async (
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
