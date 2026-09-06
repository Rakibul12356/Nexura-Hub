import { describe, it, expect } from "vitest";

export function calculateCheckoutTotal(
  originalPrice: number,
  couponCode?: string
): { discount: number; finalPrice: number } {
  let discount = 0;
  if (couponCode === "NEXURA20") {
    discount = Math.round(originalPrice * 0.2);
  } else if (couponCode === "FLAT500") {
    discount = 500;
  }

  const finalPrice = Math.max(0, originalPrice - discount);
  return { discount, finalPrice };
}

describe("Checkout & Coupon Discount Engine", () => {
  it("applies 20% percentage discount correctly", () => {
    const result = calculateCheckoutTotal(5000, "NEXURA20");
    expect(result.discount).toBe(1000);
    expect(result.finalPrice).toBe(4000);
  });

  it("applies flat ৳500 discount correctly", () => {
    const result = calculateCheckoutTotal(3000, "FLAT500");
    expect(result.discount).toBe(500);
    expect(result.finalPrice).toBe(2500);
  });

  it("handles invalid promo code gracefully without discount", () => {
    const result = calculateCheckoutTotal(3000, "INVALID_CODE");
    expect(result.discount).toBe(0);
    expect(result.finalPrice).toBe(3000);
  });
});
