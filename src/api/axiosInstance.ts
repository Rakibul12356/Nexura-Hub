import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { User } from "@/types/auth";

/**
 * ---------------------------------------------------------
 * 1. Base URL & Cookie Keys Constants
 * ---------------------------------------------------------
 */
export const BASE_API_URL =
  import.meta.env.VITE_API_URL || "https://api.nexurahub.local/v1";

const TOKEN_KEY = "nexurahub_token";
const REFRESH_TOKEN_KEY = "nexurahub_refresh_token";
const USER_KEY = "nexurahub_user";
const THEME_KEY = "nexurahub_theme";

/**
 * ---------------------------------------------------------
 * 2. Cookie Helper Functions (Token & User Session Management)
 * ---------------------------------------------------------
 */
export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const setAuthToken = (token: string, expiresDays = 7): void => {
  Cookies.set(TOKEN_KEY, token, {
    expires: expiresDays,
    secure: window.location.protocol === "https:",
    sameSite: "lax",
    path: "/",
  });
};

export const removeAuthToken = (): void => {
  Cookies.remove(TOKEN_KEY, { path: "/" });
};

export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string, expiresDays = 30): void => {
  Cookies.set(REFRESH_TOKEN_KEY, token, {
    expires: expiresDays,
    secure: window.location.protocol === "https:",
    sameSite: "lax",
    path: "/",
  });
};

export const removeRefreshToken = (): void => {
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
};

export const getUserData = (): User | null => {
  const data = Cookies.get(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as User;
  } catch (error) {
    console.error("Error parsing user cookie", error);
    return null;
  }
};

export const setUserData = (user: User, expiresDays = 7): void => {
  Cookies.set(USER_KEY, JSON.stringify(user), {
    expires: expiresDays,
    secure: window.location.protocol === "https:",
    sameSite: "lax",
    path: "/",
  });
};

export const removeUserData = (): void => {
  Cookies.remove(USER_KEY, { path: "/" });
};

export const removeAllAuthCookies = (): void => {
  removeAuthToken();
  removeRefreshToken();
  removeUserData();
};

export const getStoredTheme = (): "light" | "dark" => {
  return (Cookies.get(THEME_KEY) as "light" | "dark") || "light";
};

export const setStoredTheme = (theme: "light" | "dark"): void => {
  Cookies.set(THEME_KEY, theme, { expires: 365, path: "/" });
};

/**
 * ---------------------------------------------------------
 * 3. Axios Instance & Interceptors Configuration
 * ---------------------------------------------------------
 */
export const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Retrieve Bearer Token from Cookies & Attach to Request
axiosInstance.interceptors.request.use(
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

// Response Interceptor: Handle 401 Session Expiry & Auto-clear Auth Cookies
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status;

    if (status === 401) {
      removeAllAuthCookies();
      if (!window.location.pathname.includes("/login")) {
        toast.error("Session expired. Please log in again.");
      }
    } else if (status === 403) {
      toast.error("Access forbidden: You do not have permission.");
    } else if (status === 404) {
      console.warn(`[API 404 Not Found]: ${error.config?.url}`);
    } else if (status && status >= 500) {
      toast.error("Server error (500). Please try again later.");
    }

    return Promise.reject(error);
  }
);

export const apiClient = axiosInstance;
export default axiosInstance;
