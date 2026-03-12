import type { PageParamsSchema } from "@/features/api/schema/pagination";
import type {
  ErrorApiResponse,
  SuccessApiResponse,
} from "@/features/api/schema/response";
import type {
  PaginatedTransaction,
  Transaction,
} from "@/features/transactions/schema/transaction";
import { api } from "@/lib/api";
import axios from "axios";

export const getAllTransactions = async (params?: PageParamsSchema) => {
  try {
    const response = await api.get<SuccessApiResponse<PaginatedTransaction>>(
      "/transactions",
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

export const getTransactionById = async (id: number) => {
  try {
    const { data } = await api.get<SuccessApiResponse<Transaction>>(
      `/transactions/${id}`,
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
