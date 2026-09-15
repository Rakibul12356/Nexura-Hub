import { create } from "zustand";
import { getStoredTheme, setStoredTheme } from "@/api/axiosInstance";

interface UiStoreState {
  isSidebarOpen: boolean;
  theme: "light" | "dark";
  isMobileMenuOpen: boolean;

  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useUiStore = create<UiStoreState>((set) => ({
  isSidebarOpen: true,
  theme: getStoredTheme(),
  isMobileMenuOpen: false,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setMobileMenuOpen: (isOpen: boolean) => set({ isMobileMenuOpen: isOpen }),
  
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === "light" ? "dark" : "light";
      setStoredTheme(nextTheme);
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return { theme: nextTheme };
    }),

  setTheme: (theme: "light" | "dark") => {
    setStoredTheme(theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    set({ theme });
  },
}));
