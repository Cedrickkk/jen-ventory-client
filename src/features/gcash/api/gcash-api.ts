import type { PageParamsSchema } from "@/features/api/schema/pagination";
import type {
  ErrorApiResponse,
  SuccessApiResponse,
} from "@/features/api/schema/response";
import type {
  CreateGCashServiceLog,
  GCashFeeTier,
  GCashServiceLog,
  PaginatedGCashServiceLog,
} from "@/features/gcash/schema/gcash";
import { api } from "@/lib/api";
import axios from "axios";

export const getAllGCashFeeTiers = async () => {
  try {
    const response =
      await api.get<SuccessApiResponse<GCashFeeTier[]>>("/gcash/fee-tiers");
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

export const getAllGCashServiceLogs = async (params?: PageParamsSchema) => {
  try {
    const response = await api.get<
      SuccessApiResponse<PaginatedGCashServiceLog>
    >("/gcash/transactions", {
      params: {
        page: params?.page,
        size: params?.size ?? 10,
        sort: params?.sort,
      },
      paramsSerializer: {
        indexes: null,
      },
    });
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

export const createGCashServiceLogTransaction = async (
  gcashServiceLog: CreateGCashServiceLog,
) => {
  try {
    const { data } = await api.post<SuccessApiResponse<GCashServiceLog>>(
      `/gcash/transactions`,
      gcashServiceLog,
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

export const searchGCashServiceLog = async (
  query: string,
  params?: PageParamsSchema,
) => {
  try {
    const response = await api.get<
      SuccessApiResponse<PaginatedGCashServiceLog>
    >(`/gcash/transactions/search?query=${query}`, {
      params: {
        page: params?.page,
        size: params?.size ?? 10,
        sort: params?.sort,
      },
      paramsSerializer: {
        indexes: null,
      },
    });
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
