import React from "react";
import { LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AdminSidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  badge?: string | number;
}

export const AdminSidebarItem: React.FC<AdminSidebarItemProps> = ({
  icon: Icon,
  label,
  href,
  badge,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive =
    (location.pathname === "/admin" && href === "/admin") ||
    location.pathname === href ||
    (href !== "/admin" && href !== "/" && location.pathname.startsWith(`${href}/`));

  const onClick = () => {
    navigate(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-muted-foreground text-sm font-medium pl-6 transition-all hover:text-foreground hover:bg-muted/50 py-3.5 relative",
        isActive &&
          "text-primary bg-primary/10 hover:bg-primary/15 hover:text-primary font-semibold"
      )}
    >
      <div className="flex items-center gap-x-2.5 py-0.5">
        <Icon
          size={19}
          className={cn("text-muted-foreground", isActive && "text-primary")}
        />
        <span>{label}</span>
      </div>

      {badge !== undefined && (
        <span
          className={cn(
            "ml-auto mr-4 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
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

export default AdminSidebarItem;
