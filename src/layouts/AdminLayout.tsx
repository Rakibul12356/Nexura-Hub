import React from "react";
import { Outlet } from "react-router-dom";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

export const AdminLayout: React.FC = () => {
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);

  return (
    <div className="h-full min-h-screen flex flex-col bg-muted/10">
      <div
        className={cn(
          "h-[75px] fixed inset-y-0 w-full z-50 transition-all duration-300",
          isSidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <AdminNavbar />
      </div>
      <div
        className={cn(
          "hidden lg:flex h-full flex-col fixed inset-y-0 z-50 transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <AdminSidebar />
      </div>
      <main
        className={cn(
          "pt-[75px] h-full flex-1 flex flex-col transition-all duration-300",
          isSidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
