import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { User } from "@/types/auth";
import { isAuthRoute, unwrap } from "@/lib/api";

export const BASE_API_URL =
  import.meta.env.VITE_API_URL || "https://nexura-hub-backend.onrender.com/api/v1";

const TOKEN_KEY = "nexurahub_token";
const REFRESH_TOKEN_KEY = "nexurahub_refresh_token";
const USER_KEY = "nexurahub_user";
const THEME_KEY = "nexurahub_theme";

const cookieBase = {
  secure: typeof window !== "undefined" && window.location.protocol === "https:",
  sameSite: "lax" as const,
  path: "/",
};

export const getAuthToken = (): string | undefined => Cookies.get(TOKEN_KEY);

export const setAuthToken = (token: string, expiresDays = 7): void => {
  Cookies.set(TOKEN_KEY, token, { ...cookieBase, expires: expiresDays });
};

export const removeAuthToken = (): void => {
  Cookies.remove(TOKEN_KEY, { path: "/" });
};

export const getRefreshToken = (): string | undefined => Cookies.get(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token: string, expiresDays = 30): void => {
  Cookies.set(REFRESH_TOKEN_KEY, token, { ...cookieBase, expires: expiresDays });
};

export const removeRefreshToken = (): void => {
  Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
};

export const getUserData = (): User | null => {
  const data = Cookies.get(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as User;
  } catch {
    return null;
  }
};

export const setUserData = (user: User, expiresDays = 7): void => {
  Cookies.set(USER_KEY, JSON.stringify(user), { ...cookieBase, expires: expiresDays });
};

export const removeUserData = (): void => {
  Cookies.remove(USER_KEY, { path: "/" });
};

export const removeAllAuthCookies = (): void => {
  removeAuthToken();
  removeRefreshToken();
  removeUserData();
};

export const persistSession = (user: User, token: string, refreshToken?: string): void => {
  setAuthToken(token);
  setUserData(user);
  if (refreshToken) setRefreshToken(refreshToken);
};

export const getStoredTheme = (): "light" | "dark" => {
  return (Cookies.get(THEME_KEY) as "light" | "dark") || "light";
};

export const setStoredTheme = (theme: "light" | "dark"): void => {
  Cookies.set(THEME_KEY, theme, { expires: 365, path: "/" });
};

export const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

const flushQueue = (token: string | null) => {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;
  if (!window.location.pathname.includes("/login")) {
    toast.error("Session expired. Please log in again.");
    window.location.href = "/login";
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    const original = error.config as RetryConfig | undefined;

    if (status === 401 && original && !original._retry && !isAuthRoute(original.url)) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        removeAllAuthCookies();
        redirectToLogin();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (!token) {
              reject(error);
              return;
            }
            original.headers.set("Authorization", `Bearer ${token}`);
            resolve(axiosInstance(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${BASE_API_URL}/auth/refresh-token`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );
        const payload = unwrap<{ token: string; refreshToken?: string; user?: User }>(
          refreshResponse.data
        );
        if (payload.user) {
          persistSession(payload.user, payload.token, payload.refreshToken);
        } else {
          setAuthToken(payload.token);
          if (payload.refreshToken) setRefreshToken(payload.refreshToken);
        }
        flushQueue(payload.token);
        original.headers.set("Authorization", `Bearer ${payload.token}`);
        return axiosInstance(original);
      } catch (refreshError) {
        flushQueue(null);
        removeAllAuthCookies();
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 401) {
      removeAllAuthCookies();
      if (!isAuthRoute(original?.url)) {
        redirectToLogin();
      }
    } else if (status && status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export const apiClient = axiosInstance;
export default axiosInstance;
