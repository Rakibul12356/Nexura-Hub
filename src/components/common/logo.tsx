import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Logo: React.FC<{ className?: string; showText?: boolean; imgClassName?: string }> = ({
  className = "",
  imgClassName = "h-11 sm:h-12 md:h-14 w-auto object-contain shrink-0 max-h-[56px]",
}) => {
  return (
    <Link to="/" className={cn("flex items-center font-bold tracking-tight", className)}>
      <img src="/nhLogo.png" alt="Nexura Hub" className={imgClassName} />
    </Link>
  );
};


