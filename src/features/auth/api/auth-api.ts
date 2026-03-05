import type {
  ErrorApiResponse,
  SuccessApiResponse,
} from "@/features/api/schema/response";
import type { User } from "@/features/auth/schema/user";
import { api } from "@/lib/api";
import axios from "axios";

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<SuccessApiResponse<User>> => {
  try {
    const { data } = await api.post<SuccessApiResponse<User>>("/auth/login", {
      email,
      password,
    });
    return data;
  } catch (error: unknown) {
    if (axios.isAxiosError<ErrorApiResponse>(error) && error.response) {
      throw error.response.data as ErrorApiResponse;
    }
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<SuccessApiResponse<User>>("/auth/me");
    return data.data ?? null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};
