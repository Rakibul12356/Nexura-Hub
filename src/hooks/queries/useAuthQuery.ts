import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/apiService";
import authService from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { getRefreshToken } from "@/api/axiosInstance";
import { LoginCredentials, RegisterCredentials, User } from "@/types/auth";
import { getApiError } from "@/lib/api";
import { toast } from "react-toastify";

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token, data.refreshToken);
      toast.success("Successfully logged in!");
    },
    onError: (error: unknown) => {
      toast.error(getApiError(error, "Login failed"));
    },
  });
};

export const useRegisterMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterCredentials) => authService.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.token, data.refreshToken);
      toast.success("Account created successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getApiError(error, "Registration failed"));
    },
  });
};

export const useProfileQuery = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateUser = useAuthStore((state) => state.updateUser);

  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: async () => {
      const user = await authApi.getProfile();
      updateUser(user);
      return user;
    },
    enabled: isAuthenticated,
  });
};

export const useUpdateProfileMutation = () => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: Partial<User>) => authApi.updateProfile(userData),
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.setQueryData(["auth", "profile"], updatedUser);
      toast.success("Profile updated successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getApiError(error, "Failed to update profile"));
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      authService.changePassword(data),
    onSuccess: () => toast.success("Password changed successfully!"),
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to change password")),
  });
};

export const useLogoutMutation = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout(getRefreshToken());
      } catch {
        /* still clear local session */
      }
    },
    onSettled: () => {
      logout();
      queryClient.clear();
      toast.info("Logged out successfully");
    },
  });
};
