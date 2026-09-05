import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAuthToken, removeAuthToken, removeUserData } from "./cookies";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_API_URL || "https://api.nexurahub.local/v1";

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message || "An unexpected error occurred";

    if (status === 401) {
      removeAuthToken();
      removeUserData();
      // Optional: redirect to login if unauthorized
      if (!window.location.pathname.includes("/login")) {
        toast.error("Session expired. Please log in again.");
      }
    } else if (status === 403) {
      toast.error("You do not have permission to perform this action.");
    } else if (status && status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export default apiClient;
