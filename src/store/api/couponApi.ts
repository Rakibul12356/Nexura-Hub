import { baseApi } from "./baseApi";

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minPurchaseAmount?: number;
  expiryDate: string;
  maxRedemptions: number;
  redemptionCount: number;
  isActive: boolean;
}

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCoupons: builder.query<Coupon[], void>({
      query: () => "/coupons",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Coupon" as const, id })),
              { type: "Coupon", id: "LIST" },
            ]
          : [{ type: "Coupon", id: "LIST" }],
    }),
    validateCoupon: builder.mutation<
      { valid: boolean; coupon?: Coupon; message?: string },
      { code: string; price: number }
    >({
      query: (body) => ({
        url: "/coupons/validate",
        method: "POST",
        body,
      }),
    }),
    createCoupon: builder.mutation<Coupon, Omit<Coupon, "id" | "redemptionCount">>({
      query: (body) => ({
        url: "/coupons",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),
    deleteCoupon: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Coupon", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCouponsQuery,
  useValidateCouponMutation,
  useCreateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
