import Cookies from "js-cookie";
import { User } from "@/types/auth";

const TOKEN_KEY = "nexurahub_token";
const USER_KEY = "nexurahub_user";
const THEME_KEY = "nexurahub_theme";

export const getAuthToken = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const setAuthToken = (token: string, expiresDays = 7): void => {
  Cookies.set(TOKEN_KEY, token, {
    expires: expiresDays,
    secure: window.location.protocol === "https:",
    sameSite: "lax",
  });
};

export const removeAuthToken = (): void => {
  Cookies.remove(TOKEN_KEY);
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
  });
};

export const removeUserData = (): void => {
  Cookies.remove(USER_KEY);
};

export const getStoredTheme = (): "light" | "dark" => {
  return (Cookies.get(THEME_KEY) as "light" | "dark") || "light";
};

export const setStoredTheme = (theme: "light" | "dark"): void => {
  Cookies.set(THEME_KEY, theme, { expires: 365 });
};
