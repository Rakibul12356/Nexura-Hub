import React from "react";
import { Logo } from "@/components/common/logo";
import { AdminSidebarItem } from "./admin-sidebar-item";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  PlusCircle,
  Home,
  GraduationCap,
  PanelLeftClose,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/uiSlice";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const AdminSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { courses, users, transactions } = useAppSelector((state) => state.admin);
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);

  const pendingCourses = courses.filter((c) => !c.isPublished).length;
  const pendingUsers = users.filter((u) => u.status === "pending").length;

  const routes = [
    {
      icon: LayoutDashboard,
      label: "Overview",
      href: "/admin",
    },
    {
      icon: BookOpen,
      label: "All Courses",
      href: "/admin/courses",
      badge: pendingCourses > 0 ? `${pendingCourses} new` : courses.length,
    },
    {
      icon: Users,
      label: "User Management",
      href: "/admin/users",
      badge: pendingUsers > 0 ? `${pendingUsers} req` : users.length,
    },
    {
      icon: DollarSign,
      label: "Revenue & 5% Cut",
      href: "/admin/revenue",
      badge: transactions.length,
    },
  ];

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
        {routes.map((route) => (
          <AdminSidebarItem
            key={route.href}
            icon={route.icon}
            label={route.label}
            href={route.href}
            badge={route.badge}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
