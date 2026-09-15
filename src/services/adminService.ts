import apiClient from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { ManagedUser } from "@/types/admin";

export const adminService = {
  /**
   * Fetch platform GMV, Net Revenue, and overall overview metrics
   */
  async getOverviewStats() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.OVERVIEW);
      return response.data?.data || response.data;
    } catch {
      return null;
    }
  },

  /**
   * Fetch platform revenue ledger & transaction breakdown
   */
  async getRevenueStats() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.REVENUE);
      return response.data?.data || response.data;
    } catch {
      return null;
    }
  },

  /**
   * Fetch all managed users (Students, Instructors, Admins)
   */
  async getUsers(params?: Record<string, any>): Promise<ManagedUser[]> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USERS.LIST, { params });
      const data = response.data?.data || response.data;
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

  /**
   * Update user role (student <-> instructor <-> admin)
   */
  async updateUserRole(id: string | number, role: string) {
    const response = await apiClient.patch(API_ENDPOINTS.USERS.UPDATE_ROLE(id), { role });
    return response.data?.data || response.data;
  },

  /**
   * Suspend or delete user account
   */
  async deleteUser(id: string | number) {
    const response = await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
    return response.data;
  },
};

export default adminService;
