import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, User, LoginCredentials, RegisterCredentials } from "@/types/auth";
import {
  getAuthToken,
  getUserData,
  setAuthToken,
  setUserData,
  removeAuthToken,
  removeUserData,
} from "@/lib/cookies";

const initialUser = getUserData();
const initialToken = getAuthToken();

const initialState: AuthState = {
  user: initialUser || {
    id: "user-1",
    firstName: "Jenny",
    lastName: "Jimenez",
    email: "jennyhot@hotmail.com",
    role: "instructor",
    avatar: "/assets/images/profile.jpg",
    bio: "Senior full stack instructor & developer",
    occupation: "Software Engineer",
  },
  token: initialToken || "demo-jwt-token",
  isAuthenticated: true,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      setAuthToken(action.payload.token);
      setUserData(action.payload.user);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      removeAuthToken();
      removeUserData();
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        setUserData(state.user);
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile } =
  authSlice.actions;

export default authSlice.reducer;
