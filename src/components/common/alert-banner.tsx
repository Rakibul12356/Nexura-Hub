import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, CheckCircleIcon } from "lucide-react";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full justify-center",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-300 text-primary",
        success: "bg-emerald-700 border-emerald-800 text-white",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
};

interface AlertBannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  label,
  variant = "warning",
  className,
}) => {
  const Icon = iconMap[variant || "warning"];
  return (
    <div className={cn(bannerVariants({ variant }), className)}>
      <Icon className="h-4 w-4 mr-2" />
      <span>{label}</span>
    </div>
  );
};

export default AlertBanner;
