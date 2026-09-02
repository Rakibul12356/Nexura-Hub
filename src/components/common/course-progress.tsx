import React from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const colorByVariant: Record<string, string> = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByVariant: Record<string, string> = {
  default: "text-sm",
  sm: "text-xs",
};

interface CourseProgressProps {
  value: number;
  variant?: string;
  size?: "default" | "sm";
}

export const CourseProgress: React.FC<CourseProgressProps> = ({
  value,
  variant,
  size = "default",
}) => {
  return (
    <div>
      <Progress
        value={value}
        variant={variant}
        className={cn("h-2", !variant && "text-sky-700")}
      />
      <p
        className={cn(
          "font-medium mt-2",
          colorByVariant[variant || "default"] || "text-sky-700",
          sizeByVariant[size || "default"] || "text-sm"
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  );
};
