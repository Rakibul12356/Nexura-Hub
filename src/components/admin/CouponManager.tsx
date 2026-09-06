import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tag, Plus, Trash2, Ticket, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  expiryDate: string;
  maxRedemptions: number;
  redemptionCount: number;
  isActive: boolean;
}

export const CouponManager: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: "coup-1",
      code: "NEXURA20",
      discountType: "percentage",
      discountValue: 20,
      expiryDate: "2026-12-31",
      maxRedemptions: 500,
      redemptionCount: 142,
      isActive: true,
    },
    {
      id: "coup-2",
      code: "FLAT500",
      discountType: "flat",
      discountValue: 500,
      expiryDate: "2026-10-15",
      maxRedemptions: 100,
      redemptionCount: 88,
      isActive: true,
    },
  ]);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [expiryDate, setExpiryDate] = useState("2026-12-31");
  const [maxRedemptions, setMaxRedemptions] = useState<number>(200);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter a coupon promo code.");
      return;
    }

    const newCoupon: Coupon = {
      id: `coup-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      expiryDate,
      maxRedemptions: Number(maxRedemptions),
      redemptionCount: 0,
      isActive: true,
    };

    setCoupons([newCoupon, ...coupons]);
    setCode("");
    toast.success(`Promo coupon '${newCoupon.code}' created successfully!`);
  };

  const handleDeleteCoupon = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id));
    toast.info("Coupon promo deleted.");
  };

  return (
    <div className="space-y-6 p-6 border rounded-2xl bg-card shadow-sm">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Ticket className="h-5 w-5 text-sky-600" />
            Promo Coupon & Discount Engine
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage promotional codes, percentage discounts, and redemptions.
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-mono">
          {coupons.length} Active Codes
        </Badge>
      </div>

      {/* Create Coupon Form */}
      <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 p-4 rounded-xl bg-muted/40 border">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Promo Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. SUMMER30"
            className="w-full bg-background border rounded-lg px-3 py-1.5 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Type</label>
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as any)}
            className="w-full bg-background border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="flat">Flat Amount (৳)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Discount Value</label>
          <input
            type="number"
            value={discountValue}
            onChange={(e) => setDiscountValue(Number(e.target.value))}
            min={1}
            className="w-full bg-background border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1">Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full bg-background border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-end">
          <Button type="submit" size="sm" className="w-full bg-sky-600 hover:bg-sky-700 gap-1">
            <Plus className="h-4 w-4" /> Create Coupon
          </Button>
        </div>
      </form>

      {/* Coupon List Table */}
      <div className="border rounded-xl overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/60 text-muted-foreground uppercase font-semibold">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Redemptions</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-3 font-mono font-bold text-sky-600 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" />
                  {coupon.code}
                </td>
                <td className="p-3 font-semibold">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}% OFF`
                    : `৳${coupon.discountValue} OFF`}
                </td>
                <td className="p-3 text-muted-foreground">{coupon.expiryDate}</td>
                <td className="p-3 font-mono">
                  {coupon.redemptionCount} / {coupon.maxRedemptions}
                </td>
                <td className="p-3">
                  <Badge variant="success" className="gap-1 text-[10px]">
                    <CheckCircle2 className="h-3 w-3" /> Active
                  </Badge>
                </td>
                <td className="p-3 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CouponManager;
