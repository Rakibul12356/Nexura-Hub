import apiClient from "@/api/axiosInstance";
import { LoginCredentials, RegisterCredentials, User } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await apiClient.post("/auth/login", credentials);
    const payload = response.data?.data || response.data;
    return {
      user: payload.user,
      token: payload.token,
    };
  },

  async register(data: RegisterCredentials): Promise<{ user: User; token: string }> {
    const response = await apiClient.post("/auth/register", data);
    const payload = response.data?.data || response.data;
    return {
      user: payload.user,
      token: payload.token,
    };
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get("/auth/me");
    return response.data?.data || response.data;
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await apiClient.put("/auth/profile", userData);
    return response.data?.data || response.data;
  },
};

export default authService;
