import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/services/apiService";
import authService from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { LoginCredentials, RegisterCredentials, User } from "@/types/auth";
import { toast } from "react-toastify";

export const useLoginMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return await authService.login(credentials);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Successfully logged in!");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error.message || "Login failed";
      toast.error(msg);
    },
  });
};

export const useRegisterMutation = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: RegisterCredentials) => {
      return await authService.register(data);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      toast.success("Account created successfully!");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || error.message || "Registration failed";
      toast.error(msg);
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
    mutationFn: async (userData: Partial<User>) => {
      return await authApi.updateProfile(userData);
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.setQueryData(["auth", "profile"], updatedUser);
      toast.success("Profile updated successfully!");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Failed to update profile";
      toast.error(msg);
    },
  });
};

export const useLogoutMutation = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } catch {
        // Fallback logout
      }
    },
    onSettled: () => {
      logout();
      queryClient.clear();
      toast.info("Logged out successfully");
    },
  });
};
