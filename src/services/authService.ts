import apiClient from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { unwrapFromResponse } from "@/lib/api";
import { AuthTokens, LoginCredentials, RegisterCredentials, User } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return unwrapFromResponse<AuthTokens>(response);
  },

  async register(data: RegisterCredentials): Promise<AuthTokens> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return unwrapFromResponse<AuthTokens>(response);
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE);
    return unwrapFromResponse<User>(response);
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, userData);
    return unwrapFromResponse<User>(response);
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    return unwrapFromResponse<{ message: string }>(response);
  },

  async logout(refreshToken?: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, refreshToken ? { refreshToken } : {});
  },

  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string }> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return unwrapFromResponse(response);
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword });
    return unwrapFromResponse(response);
  },
};

export default authService;
