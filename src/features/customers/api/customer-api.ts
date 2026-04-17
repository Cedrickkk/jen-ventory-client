import type { PageParamsSchema } from "@/features/api/schema/pagination";
import type {
  ErrorApiResponse,
  SuccessApiResponse,
} from "@/features/api/schema/response";
import type {
  CreateCustomer,
  Customer,
  EditCustomer,
  PaginatedCustomer,
  PaginatedCustomerTransaction,
} from "@/features/customers/schema/customer";
import type { PaginatedGCashServiceLog } from "@/features/gcash/schema/gcash";
import type {
  CreateDebtPayment,
  Debt,
  DebtSummary,
} from "@/features/transactions/schema/debt";
import { api } from "@/lib/api";
import axios from "axios";

export const getAllCustomers = async (params?: PageParamsSchema) => {
  try {
    const response = await api.get<SuccessApiResponse<PaginatedCustomer>>(
      "/customers",
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

export const createCustomer = async (customer: CreateCustomer) => {
  try {
    const formData = new FormData();
    formData.append("name", customer.name);
    formData.append("phone", customer.phone);
    formData.append("address", customer.address);

    if (customer.image) {
      formData.append("image", customer.image);
    }

    const { data } = await api.post<SuccessApiResponse<Customer>>(
      `/customers`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
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

export const getCustomerById = async (id: number) => {
  try {
    const { data } = await api.get<SuccessApiResponse<Customer>>(
      `/customers/${id}`,
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

export const getCustomerTransactions = async (id: number) => {
  try {
    const { data } = await api.get<
      SuccessApiResponse<PaginatedCustomerTransaction>
    >(`/customers/${id}/transactions`);
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

export const editCustomer = async (id: number, customer: EditCustomer) => {
  try {
    const { data } = await api.put<SuccessApiResponse<Customer>>(
      `/customers/${id}`,
      customer,
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

export const toggleCustomerStatus = async (id: number, active: boolean) => {
  try {
    const endpoint = active
      ? `/customers/${id}/deactivate`
      : `/customers/${id}/reactivate`;
    const { data } = await api.patch<SuccessApiResponse<Customer>>(endpoint);
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

export const getCustomerDebtSummary = async (id: number) => {
  try {
    const { data } = await api.get<SuccessApiResponse<DebtSummary>>(
      `/customers/${id}/debt/summary`,
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

export const getCustomerDebtHistory = async (id: number) => {
  try {
    const { data } = await api.get<SuccessApiResponse<DebtSummary>>(
      `/customers/${id}/debt/history`,
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

export const getCustomerGCashHistory = async (id: number) => {
  try {
    const { data } = await api.get<
      SuccessApiResponse<PaginatedGCashServiceLog>
    >(`/customers/${id}/gcash`);
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

export const recordDebtPayment = async (
  customerId: number,
  payment: CreateDebtPayment,
) => {
  try {
    const { data } = await api.post<SuccessApiResponse<Debt>>(
      `/customers/${customerId}/debt/payment`,
      payment,
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
