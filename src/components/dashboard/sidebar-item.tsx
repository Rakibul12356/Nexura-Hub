import React from "react";
import { LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string | number;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  href,
  badge,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);

  const isActive =
    location.pathname === href ||
    (href === "/admin/courses" &&
      location.pathname.startsWith("/admin/courses/") &&
      location.pathname !== "/admin/courses/add") ||
    (href === "/dashboard/courses" &&
      location.pathname.startsWith("/dashboard/courses/") &&
      location.pathname !== "/dashboard/courses/add") ||
    (href === "/dashboard/lives" &&
      location.pathname.startsWith("/dashboard/lives/") &&
      location.pathname !== "/dashboard/lives/add") ||
    (href === "/dashboard/quiz-sets" &&
      location.pathname.startsWith("/dashboard/quiz-sets/") &&
      location.pathname !== "/dashboard/quiz-sets/add");

  const onClick = () => {
    navigate(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      title={!isSidebarOpen ? label : undefined}
      className={cn(
        "flex items-center text-muted-foreground text-sm font-medium transition-all hover:text-foreground hover:bg-muted/50 py-3.5 relative w-full",
        isSidebarOpen ? "pl-6 pr-4 gap-x-2.5" : "justify-center px-2",
        isActive &&
          "text-primary bg-primary/10 hover:bg-primary/15 hover:text-primary font-semibold"
      )}
    >
      <div
        className={cn(
          "flex items-center py-0.5",
          isSidebarOpen ? "gap-x-2.5" : "justify-center"
        )}
      >
        <Icon
          size={20}
          className={cn(
            "shrink-0 text-muted-foreground transition-colors",
            isActive && "text-primary"
          )}
        />
        {isSidebarOpen && <span className="truncate">{label}</span>}
      </div>

      {isSidebarOpen && badge !== undefined && (
        <span
          className={cn(
            "ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0",
            isActive
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          {badge}
        </span>
      )}

      {isActive && (
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary rounded-l-full" />
      )}
    </button>
  );
};

export default SidebarItem;
