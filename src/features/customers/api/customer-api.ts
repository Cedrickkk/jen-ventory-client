import type {
  ErrorApiResponse,
  SuccessApiResponse,
} from "@/features/response/schema/response";
import { api } from "@/lib/api";
import axios from "axios";

/**
 * TODO: Add schema and paginated type for /customers
 */
export const getAllCustomers = async () => {
  try {
    const response = await api.get<SuccessApiResponse<string>>("/customers");
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
