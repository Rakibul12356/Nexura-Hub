import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getStoredTheme, setStoredTheme } from "@/api/axiosInstance";

interface UIState {
  isSidebarOpen: boolean;
  theme: "light" | "dark";
  isMobileMenuOpen: boolean;
}

const initialState: UIState = {
  isSidebarOpen: true,
  theme: getStoredTheme(),
  isMobileMenuOpen: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      setStoredTheme(state.theme);
      if (state.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      setStoredTheme(state.theme);
      if (state.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleTheme,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
