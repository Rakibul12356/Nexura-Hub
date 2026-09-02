import React from "react";
import { cn } from "@/lib/utils";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, className }) => {
  return (
    <h2 className={cn("text-xl md:text-2xl lg:text-3xl font-bold tracking-tight", className)}>
      {children}
    </h2>
  );
};
