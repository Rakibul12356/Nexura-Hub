import React from "react";
import { Logo } from "@/components/common/logo";
import { SidebarRoutes } from "./sidebar-routes";

export const Sidebar: React.FC = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-card shadow-sm">
      <div className="p-6 border-b">
        <Logo />
      </div>
      <div className="flex flex-col w-full py-2">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;
