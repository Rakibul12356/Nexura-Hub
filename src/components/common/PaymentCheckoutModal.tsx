import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle2, Download, Tag, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { formatPrice } from "@/lib/formatPrice";
import { useAuthStore } from "@/store/useAuthStore";
import { useDummyPaymentMutation, useValidateCouponMutation } from "@/hooks/queries/useAdminQuery";
import { DummyPaymentResult } from "@/types/api";

interface PaymentCheckoutModalProps {
  courseId?: string | number;
  courseTitle?: string;
  originalPrice?: number;
  onSuccess?: () => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  courseId = 1,
  courseTitle = "Course",
  originalPrice = 0,
  onSuccess,
}) => {
  const user = useAuthStore((state) => state.user);
  const dummyPay = useDummyPaymentMutation();
  const validateCoupon = useValidateCouponMutation();

  const [gateway, setGateway] = useState<"stripe" | "sslcommerz" | "shurjopay">("stripe");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isPaid, setIsPaid] = useState(false);
  const [receipt, setReceipt] = useState<DummyPaymentResult | null>(null);

  const finalPrice = Math.max(0, originalPrice - appliedDiscount);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }
    validateCoupon.mutate(
      { code: couponCode.trim(), courseId },
      {
        onSuccess: (data) => {
          setAppliedDiscount(data.discountAmount);
          toast.success(`Coupon ${data.code} applied!`);
        },
      }
    );
  };

  const handleCompletePayment = () => {
    if (!user) {
      toast.error("Please sign in to enroll.");
      return;
    }
    dummyPay.mutate(
      {
        courseId,
        couponCode: appliedDiscount > 0 ? couponCode.trim().toUpperCase() : undefined,
        gateway,
      },
      {
        onSuccess: (data) => {
          setReceipt(data);
          setIsPaid(true);
          onSuccess?.();
        },
      }
    );
  };

  const handleDownloadInvoice = async () => {
    if (!receipt) return;
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("NEXURA HUB - OFFICIAL INVOICE", 14, 22);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice Date: ${new Date(receipt.paidAt).toLocaleDateString()}`, 14, 30);
      doc.text(`Transaction ID: ${receipt.transactionId}`, 14, 36);
      doc.text(`Payment Method: Dummy (${receipt.gatewayLabel || gateway})`, 14, 42);
      doc.line(14, 48, 196, 48);
      doc.setFont("helvetica", "bold");
      doc.text("Item Description", 14, 56);
      doc.text("Amount", 160, 56);
      doc.setFont("helvetica", "normal");
      doc.text(receipt.courseTitle, 14, 66);
      doc.text(`TK ${receipt.originalPrice}`, 160, 66);
      if (receipt.discountAmount > 0) {
        doc.text("Coupon Discount", 14, 74);
        doc.text(`- TK ${receipt.discountAmount}`, 160, 74);
      }
      doc.line(14, 82, 196, 82);
      doc.setFont("helvetica", "bold");
      doc.text("Total Paid:", 14, 90);
      doc.text(`TK ${receipt.amountPaid}`, 160, 90);
      doc.save(`Invoice_${receipt.transactionId}.pdf`);
    } catch {
      toast.error("Failed to generate invoice PDF");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow">
          Enroll Now
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-6">
        {!isPaid ? (
          <div className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-sky-600" />
                Course Checkout (Dummy Payment)
              </DialogTitle>
            </DialogHeader>

            <p className="text-[11px] text-muted-foreground rounded-lg bg-amber-500/10 border border-amber-500/20 p-2">
              No real card is charged. Payment is posted to the backend and credited to the admin dummy wallet.
            </p>

            <div className="p-3.5 border rounded-xl bg-muted/30 space-y-1">
              <span className="text-xs text-muted-foreground">Course Selected</span>
              <h4 className="font-semibold text-sm leading-tight text-foreground">{courseTitle}</h4>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground block">Invoice gateway label</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "stripe", name: "Stripe", badge: "Global" },
                  { id: "sslcommerz", name: "SSLCommerz", badge: "BD" },
                  { id: "shurjopay", name: "Shurjopay", badge: "BD" },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGateway(g.id as typeof gateway)}
                    className={`p-3 rounded-xl border text-center font-semibold text-xs transition-all ${
                      gateway === g.id
                        ? "border-sky-500 bg-sky-500/10 text-sky-600 shadow-xs ring-1 ring-sky-500"
                        : "bg-background hover:bg-muted/50"
                    }`}
                  >
                    <div>{g.name}</div>
                    <Badge variant="outline" className="text-[9px] mt-1 px-1 py-0">
                      {g.badge}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">Have a Promo Code?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. NEXURA20"
                  className="flex-1 bg-background border rounded-lg px-3 py-1.5 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleApplyCoupon}
                  disabled={validateCoupon.isPending}
                  className="gap-1 text-xs"
                >
                  <Tag className="h-3.5 w-3.5" /> Apply
                </Button>
              </div>
            </div>

            <div className="space-y-2 border-t pt-3 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Original Price</span>
                <span>{formatPrice(originalPrice)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount Applied</span>
                  <span>- {formatPrice(appliedDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-foreground border-t pt-2">
                <span>Total Amount Due</span>
                <span className="text-sky-600 font-mono">{formatPrice(finalPrice)}</span>
              </div>
            </div>

            <Button
              onClick={handleCompletePayment}
              disabled={dummyPay.isPending}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold gap-2 py-5 shadow"
            >
              {dummyPay.isPending ? (
                "Processing dummy payment..."
              ) : (
                <>
                  Pay {formatPrice(finalPrice)} (Dummy)
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Payment Successful!</h3>
              <p className="text-xs text-muted-foreground mt-1">Thank you for enrolling in {courseTitle}.</p>
            </div>
            <div className="p-4 border rounded-xl bg-muted/30 text-xs space-y-1 font-mono text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-bold">{receipt?.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="text-emerald-600 font-bold">{formatPrice(receipt?.amountPaid || 0)}</span>
              </div>
            </div>
            <Button
              onClick={handleDownloadInvoice}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 shadow"
            >
              <Download className="h-4 w-4" />
              Download Official PDF Invoice
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentCheckoutModal;
