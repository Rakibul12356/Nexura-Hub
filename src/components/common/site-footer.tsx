import React from "react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

interface SiteFooterProps {
  className?: string;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ className }) => {
  return (
    <footer className={cn("border-t bg-muted/20 mt-auto", className)}>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-4 md:px-0">
          <Logo />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with{" "}
            <span className="font-semibold text-foreground">React, TypeScript & Tailwind CSS</span>
            . Scalable LMS platform powered by Redux Toolkit and Axios.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Nexura Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
