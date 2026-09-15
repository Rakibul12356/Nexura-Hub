import React from "react";
import { Logo } from "@/components/common/logo";
import { SidebarRoutes } from "./sidebar-routes";
import { useUiStore } from "@/store/useUiStore";
import { Button } from "@/components/ui/button";
import { PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar: React.FC = () => {
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-card shadow-sm select-none">
      {/* Exact 75px Height Header matching Navbar for a 100% seamless straight line */}
      <div
        className={cn(
          "h-[75px] border-b flex items-center shrink-0 transition-all",
          isSidebarOpen ? "px-5 justify-between" : "px-2 justify-center"
        )}
      >
        {isSidebarOpen ? (
          <>
            <Logo />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hidden lg:flex"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <button
            onClick={toggleSidebar}
            className="flex h-11 w-11 items-center justify-center rounded-lg hover:opacity-80 transition p-0.5"
            title="Expand Sidebar"
          >
            <img src="/nhLogo.png" alt="Nexura Hub" className="h-10 w-10 object-contain" />
          </button>
        )}
      </div>

      {/* Navigation Routes */}
      <div className="flex flex-col w-full py-2 flex-1">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;
