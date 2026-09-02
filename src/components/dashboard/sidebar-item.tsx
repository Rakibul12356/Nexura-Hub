import React from "react";
import { LucideIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  href,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive =
    (location.pathname === "/" && href === "/") ||
    location.pathname === href ||
    (href !== "/dashboard" && location.pathname.startsWith(href));

  const onClick = () => {
    navigate(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 dark:text-slate-400 text-sm font-[500] pl-6 transition-all hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-300/20 py-4",
        isActive &&
          "text-sky-700 dark:text-sky-400 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
      )}
    >
      <div className="flex items-center gap-x-2">
        <Icon
          size={22}
          className={cn(
            "text-slate-500 dark:text-slate-400",
            isActive && "text-sky-700 dark:text-sky-400"
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-sky-700 dark:border-sky-400 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};
