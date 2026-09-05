import React from "react";
import { Outlet } from "react-router-dom";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const AdminLayout: React.FC = () => {
  return (
    <div className="h-full min-h-screen flex flex-col bg-muted/10">
      <div className="h-[75px] lg:pl-64 fixed inset-y-0 w-full z-50">
        <AdminNavbar />
      </div>
      <div className="hidden lg:flex h-full w-64 flex-col fixed inset-y-0 z-50">
        <AdminSidebar />
      </div>
      <main className="lg:pl-64 pt-[75px] h-full flex-1 flex flex-col">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
