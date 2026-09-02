import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/dashboard/navbar";
import { Sidebar } from "@/components/dashboard/sidebar";

export const DashboardLayout: React.FC = () => {
  return (
    <div className="h-full min-h-screen flex flex-col bg-muted/10">
      <div className="h-[75px] lg:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden lg:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="lg:pl-56 pt-[75px] h-full flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
