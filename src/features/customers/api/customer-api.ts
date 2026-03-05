import type {
  ErrorApiResponse,
  SuccessApiResponse,
} from "@/features/api/schema/response";
import type {
  Customer,
  PaginatedCustomer,
} from "@/features/customers/schema/customer";
import { api } from "@/lib/api";
import axios from "axios";

export const getAllCustomers = async () => {
  try {
    const response =
      await api.get<SuccessApiResponse<PaginatedCustomer>>("/customers");
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

export const searchCustomer = async (query: string) => {
  try {
    const response = await api.get<SuccessApiResponse<Array<Customer>>>(
      `/customers/search?query=${query}`,
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
