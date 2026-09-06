import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const BASE_API_URL =
  import.meta.env.VITE_API_URL || "https://api.nexurahub.local/v1";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
    credentials: "include", // Enable HttpOnly Cookie sending & receiving securely
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "Course",
    "Module",
    "Lesson",
    "Quiz",
    "User",
    "Discussion",
    "Coupon",
    "Notification",
    "Revenue",
  ],
  endpoints: () => ({}),
});

export default baseApi;
