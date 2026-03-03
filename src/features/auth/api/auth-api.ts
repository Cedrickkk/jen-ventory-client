import type { User } from "@/features/auth/schema/user";
import type {
  ErrorApiResponse,
  SuccessApiResponse,
} from "@/features/response/schema/response";
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
    console.log("AM I TRIGERRED");
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
  await api.post("/logout");
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<SuccessApiResponse<User>>("/me");
    return data.data ?? null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401)
      return null;

    if (axios.isAxiosError<ErrorApiResponse>(error) && error.response) {
      throw error.response.data as ErrorApiResponse;
    }
    return null;
  }
};
