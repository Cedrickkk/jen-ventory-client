import type {
  ErrorApiResponse,
  SuccessApiResponse,
} from "@/features/api/schema/response";
import { api } from "@/lib/api";
import axios from "axios";
import type { GCashFeeTier, PaginatedGCashServiceLog } from "../schema/gcash";

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

export const getAllGCashServiceLogs = async () => {
  try {
    const response = await api.get<
      SuccessApiResponse<PaginatedGCashServiceLog>
    >("/gcash/transactions");
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
