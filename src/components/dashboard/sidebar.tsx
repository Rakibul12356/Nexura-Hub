import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/common/logo";
import { SidebarRoutes } from "./sidebar-routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeft, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);

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
              onClick={() => dispatch(toggleSidebar())}
              className="h-8 w-8 text-muted-foreground hover:text-foreground hidden lg:flex"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition shadow-sm"
            title="Expand Sidebar"
          >
            <GraduationCap className="h-5 w-5" />
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
