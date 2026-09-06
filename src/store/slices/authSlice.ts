import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, User, LoginCredentials, RegisterCredentials } from "@/types/auth";
import { authApi } from "@/services/apiService";
import authService from "@/services/authService";
import {
  getAuthToken,
  getUserData,
  setAuthToken,
  setUserData,
  removeAllAuthCookies,
} from "@/api/axiosInstance";

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
  isAuthenticated: Boolean(initialToken || initialUser),
  isLoading: false,
  error: null,
};

/**
 * Async Thunks using Axios API Service & JS-Cookie
 */

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      setAuthToken(response.token);
      setUserData(response.user);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      setAuthToken(response.token);
      setUserData(response.user);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.getProfile();
      setUserData(user);
      return user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to load user profile");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore API logout error in fallback mode
    } finally {
      removeAllAuthCookies();
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const updatedUser = await authApi.updateProfile(userData);
      setUserData(updatedUser);
      return updatedUser;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to update profile");
    }
  }
);

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
      removeAllAuthCookies();
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        setUserData(state.user);
      }
    },
  },
  extraReducers: (builder) => {
    // loginUser
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload as string;
    });

    // registerUser
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // fetchUserProfile
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    // logoutUser
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    });

    // updateUserProfile
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    });
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateProfile } =
  authSlice.actions;

export default authSlice.reducer;
