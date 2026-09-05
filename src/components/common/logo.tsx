import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <Link to="/" className={cn("flex items-center gap-2 text-primary font-bold tracking-tight", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <GraduationCap className="h-5 w-5" />
      </div>
      <span className="text-xl font-poppins font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
        Nexura Hub
      </span>
    </Link>
  );
};
