import { AxiosResponse } from "axios";

const LIST_KEYS = [
  "courses",
  "categories",
  "lives",
  "quizSets",
  "enrollments",
  "items",
  "result",
  "users",
  "transactions",
  "conversations",
  "messages",
  "notifications",
  "coupons",
  "reviews",
  "notes",
  "discussions",
] as const;

export function unwrap<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    const inner = (payload as { data: T }).data;
    if (inner !== undefined) return inner;
  }
  return payload as T;
}

export function unwrapFromResponse<T>(response: AxiosResponse): T {
  return unwrap<T>(response.data);
}

export function unwrapList<T>(payload: unknown): T[] {
  const data = unwrap<unknown>(payload);
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of LIST_KEYS) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
  }
  return [];
}

export function unwrapListFromResponse<T>(response: AxiosResponse): T[] {
  return unwrapList<T>(response.data);
}

export function getApiError(error: unknown, fallback = "Something went wrong"): string {
  if (!error || typeof error !== "object") return fallback;
  const err = error as {
    response?: { data?: { message?: string } };
    message?: string;
  };
  return err.response?.data?.message || err.message || fallback;
}

export function isAuthRoute(url?: string): boolean {
  if (!url) return false;
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/refresh-token") ||
    url.includes("/auth/forgot-password") ||
    url.includes("/auth/reset-password")
  );
}
