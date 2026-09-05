import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

export const DashboardLayout: React.FC = () => {
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);

  return (
    <div className="h-full min-h-screen flex flex-col bg-muted/10">
      <div
        className={cn(
          "h-[75px] fixed inset-y-0 w-full z-50 transition-all duration-300",
          isSidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <Navbar />
      </div>
      <div
        className={cn(
          "hidden lg:flex h-full flex-col fixed inset-y-0 z-50 transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <Sidebar />
      </div>
      <main
        className={cn(
          "pt-[75px] h-full flex-1 flex flex-col transition-all duration-300",
          isSidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
