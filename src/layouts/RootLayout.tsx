import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster as RadixToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { useAppSelector } from "@/store/hooks";

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const RootLayout: React.FC = () => {
  const theme = useAppSelector((state) => state.ui.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-inter selection:bg-primary selection:text-primary-foreground">
      <ScrollToTop />
      <Outlet />
      <RadixToaster />
      <SonnerToaster position="top-right" richColors />
    </div>
  );
};

export default RootLayout;
