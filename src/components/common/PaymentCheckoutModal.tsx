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
import {
  CreditCard,
  CheckCircle2,
  Download,
  ShieldCheck,
  Tag,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import { formatPrice } from "@/lib/formatPrice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { autoJoinCourseGroupOnEnroll } from "@/store/slices/chatSlice";

interface PaymentCheckoutModalProps {
  courseId?: string | number;
  courseTitle?: string;
  originalPrice?: number;
  onSuccess?: () => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  courseId = 1,
  courseTitle = "Reactive Accelerator: Modern Full-Stack Masterclass",
  originalPrice = 4999,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [gateway, setGateway] = useState<"stripe" | "sslcommerz" | "shurjopay">("stripe");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  const finalPrice = Math.max(0, originalPrice - appliedDiscount);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "NEXURA20") {
      const discount = Math.round(originalPrice * 0.2);
      setAppliedDiscount(discount);
      toast.success("Coupon NEXURA20 applied! 20% discount added.");
    } else if (couponCode.toUpperCase() === "FLAT500") {
      setAppliedDiscount(500);
      toast.success("Coupon FLAT500 applied! ৳500 discount added.");
    } else {
      toast.error("Invalid promo coupon code.");
    }
  };

  const handleCompletePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const txId = `TXN-${gateway.toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`;
      setTransactionId(txId);
      setIsProcessing(false);
      setIsPaid(true);

      dispatch(
        autoJoinCourseGroupOnEnroll({
          courseId,
          courseTitle,
          student: {
            id: user?.id || "user-1",
            name: `${user?.firstName || "Rahim"} ${user?.lastName || "Ahmed"}`.trim(),
            avatar: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            role: "student",
          },
          instructor: {
            id: 101,
            name: "Tapas Adhikary",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            role: "instructor",
          },
        })
      );

      toast.success("Payment completed successfully!");
      onSuccess?.();
    }, 1500);
  };

  const handleDownloadInvoice = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("NEXURA HUB - OFFICIAL INVOICE", 14, 22);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice Date: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`Transaction ID: ${transactionId}`, 14, 36);
      doc.text(`Payment Gateway: ${gateway.toUpperCase()}`, 14, 42);

      doc.line(14, 48, 196, 48);

      doc.setFont("helvetica", "bold");
      doc.text("Item Description", 14, 56);
      doc.text("Amount", 160, 56);

      doc.setFont("helvetica", "normal");
      doc.text(courseTitle, 14, 66);
      doc.text(`TK ${originalPrice}`, 160, 66);

      if (appliedDiscount > 0) {
        doc.text("Coupon Discount", 14, 74);
        doc.text(`- TK ${appliedDiscount}`, 160, 74);
      }

      doc.line(14, 82, 196, 82);

      doc.setFont("helvetica", "bold");
      doc.text("Total Paid:", 14, 90);
      doc.text(`TK ${finalPrice}`, 160, 90);

      doc.save(`Invoice_${transactionId}.pdf`);
    } catch (error) {
      console.error("Failed to generate invoice:", error);
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
                Course Checkout & Payment
              </DialogTitle>
            </DialogHeader>

            <div className="p-3.5 border rounded-xl bg-muted/30 space-y-1">
              <span className="text-xs text-muted-foreground">Course Selected</span>
              <h4 className="font-semibold text-sm leading-tight text-foreground">{courseTitle}</h4>
            </div>

            {/* Gateway Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground block">
                Select Payment Gateway
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "stripe", name: "Stripe", badge: "Global" },
                  { id: "sslcommerz", name: "SSLCommerz", badge: "BD" },
                  { id: "shurjopay", name: "Shurjopay", badge: "BD" },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGateway(g.id as any)}
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

            {/* Coupon Promo Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground block">
                Have a Promo Code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. NEXURA20"
                  className="flex-1 bg-background border rounded-lg px-3 py-1.5 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <Button size="sm" variant="outline" onClick={handleApplyCoupon} className="gap-1 text-xs">
                  <Tag className="h-3.5 w-3.5" /> Apply
                </Button>
              </div>
            </div>

            {/* Price Summary Breakdown */}
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
              disabled={isProcessing}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold gap-2 py-5 shadow"
            >
              {isProcessing ? (
                "Processing Secure Payment..."
              ) : (
                <>
                  Pay {formatPrice(finalPrice)} via {gateway.toUpperCase()}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        ) : (
          /* Payment Success & Invoice Download Modal */
          <div className="text-center py-6 space-y-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">Payment Successful!</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Thank you for enrolling in {courseTitle}.
              </p>
            </div>

            <div className="p-4 border rounded-xl bg-muted/30 text-xs space-y-1 font-mono text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-bold">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount Paid:</span>
                <span className="text-emerald-600 font-bold">{formatPrice(finalPrice)}</span>
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
