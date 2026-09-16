import apiClient from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { unwrapFromResponse, unwrapListFromResponse } from "@/lib/api";
import { ManagedUser } from "@/types/admin";
import { AdminOverviewData, Coupon, RevenueLedgerData, Wallet } from "@/types/api";
import { Role } from "@/types/auth";

export const adminService = {
  async getOverviewStats(): Promise<AdminOverviewData> {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.OVERVIEW);
    return unwrapFromResponse<AdminOverviewData>(response);
  },

  async getRevenueStats(params?: Record<string, unknown>): Promise<RevenueLedgerData> {
    const response = await apiClient.get(API_ENDPOINTS.ANALYTICS.REVENUE, { params });
    return unwrapFromResponse<RevenueLedgerData>(response);
  },

  async getWallet(): Promise<Wallet> {
    const response = await apiClient.get(API_ENDPOINTS.WALLETS.ADMIN);
    return unwrapFromResponse<Wallet>(response);
  },

  async getUsers(params?: Record<string, unknown>): Promise<ManagedUser[]> {
    const response = await apiClient.get(API_ENDPOINTS.USERS.LIST, { params });
    return unwrapListFromResponse<ManagedUser>(response);
  },

  async updateUserRole(id: string | number, role: Role): Promise<ManagedUser> {
    const response = await apiClient.patch(API_ENDPOINTS.USERS.UPDATE_ROLE(id), { role });
    return unwrapFromResponse<ManagedUser>(response);
  },

  async updateUserStatus(id: string | number, status: ManagedUser["status"]): Promise<ManagedUser> {
    const response = await apiClient.patch(API_ENDPOINTS.USERS.UPDATE_STATUS(id), { status });
    return unwrapFromResponse<ManagedUser>(response);
  },

  async deleteUser(id: string | number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  },

  async getCoupons(): Promise<Coupon[]> {
    const response = await apiClient.get(API_ENDPOINTS.COUPONS.LIST);
    return unwrapListFromResponse<Coupon>(response);
  },

  async createCoupon(data: Partial<Coupon>): Promise<Coupon> {
    const response = await apiClient.post(API_ENDPOINTS.COUPONS.CREATE, data);
    return unwrapFromResponse<Coupon>(response);
  },

  async updateCoupon(id: string | number, data: Partial<Coupon>): Promise<Coupon> {
    const response = await apiClient.patch(API_ENDPOINTS.COUPONS.UPDATE(id), data);
    return unwrapFromResponse<Coupon>(response);
  },

  async deleteCoupon(id: string | number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COUPONS.DELETE(id));
  },
};

export default adminService;
