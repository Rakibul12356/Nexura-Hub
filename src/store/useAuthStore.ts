import { create } from "zustand";
import { User } from "@/types/auth";
import {
  getAuthToken,
  getUserData,
  setAuthToken,
  setUserData,
  removeAllAuthCookies,
} from "@/api/axiosInstance";

interface AuthStoreState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setAuth: (user: User, token: string) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

const initialUser = getUserData();
const initialToken = getAuthToken();

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: initialUser || null,
  token: initialToken || null,
  isAuthenticated: Boolean(initialToken && initialUser),
  isLoading: false,
  error: null,

  setAuth: (user: User, token: string) => {
    setAuthToken(token);
    setUserData(user);
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
  },

  updateUser: (userData: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = { ...state.user, ...userData };
      setUserData(updatedUser);
      return { user: updatedUser };
    });
  },

  logout: () => {
    removeAllAuthCookies();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}));
