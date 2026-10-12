import { queryClient } from "@/lib/query";
import axios from "axios";

declare module "axios" {
  interface AxiosRequestConfig { skipAuthRefresh?: boolean; }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Silent JWT Token Refresh
 */

let csrfRequest: Promise<string> | null = null;
export const refreshCsrf = (): Promise<string> => {
  if (!csrfRequest) {
    csrfRequest = api.get<{ token: string }>("/auth/csrf")
      .then(({ data }) => data.token)
      .finally(() => { csrfRequest = null; });
  }
  return csrfRequest;
};
api.interceptors.request.use(async (config) => {
  if (!["get", "head", "options"].includes(config.method?.toLowerCase() ?? "get")) {
    config.headers.set("X-XSRF-TOKEN", await refreshCsrf());
  }
  return config;
});

const refreshSession = async () => {
  const refresh = async () => {
    try { await api.get("/auth/me", { skipAuthRefresh: true }); return; }
    catch (error) { if (!axios.isAxiosError(error) || error.response?.status !== 401) throw error; }
    await api.post("/auth/refresh-token");
  };
  if (navigator.locks) return navigator.locks.request("jenventory-refresh-session", refresh);
  return refresh();
};
let isRefreshing = false;

let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((_promise) => {
    return error ? _promise.reject(error) : _promise.resolve(null);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);
    if (error.response?.status === 409) {
      queryClient.invalidateQueries();
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.skipAuthRefresh &&
      !["/auth/login", "/auth/refresh-token", "/auth/logout", "/auth/csrf", "/auth/register"].includes(originalRequest.url ?? "")
    ) {
      if (isRefreshing) {
        originalRequest._retry = true;
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshSession();
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (axios.isAxiosError(refreshError) && [401, 403].includes(refreshError.response?.status ?? 0)) {
          queryClient.clear();
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
