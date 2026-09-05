import React from "react";
import { Logo } from "@/components/common/logo";
import { AdminSidebarItem } from "./admin-sidebar-item";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  DollarSign,
  ShieldCheck,
  PlusCircle,
  Home,
  GraduationCap,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { Badge } from "@/components/ui/badge";

export const AdminSidebar: React.FC = () => {
  const { courses, users, transactions } = useAppSelector((state) => state.admin);

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
      icon: PlusCircle,
      label: "Add Admin Course",
      href: "/admin/courses/add",
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
    {
      icon: GraduationCap,
      label: "Instructor Studio",
      href: "/dashboard",
    },
    {
      icon: Home,
      label: "Main Website",
      href: "/",
    },
  ];

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-card shadow-sm">
      {/* Brand Header */}
      <div className="p-5 border-b flex flex-col gap-2">
        <Logo />
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-semibold w-fit">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Platform SuperAdmin</span>
        </div>
      </div>

      {/* Navigation Routes */}
      <div className="flex flex-col w-full py-2 flex-1">
        <div className="px-6 py-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Admin Portal
        </div>
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

      {/* Footer System Status */}
      <div className="p-4 border-t mt-auto text-xs text-muted-foreground space-y-1 bg-muted/20">
        <div className="flex items-center justify-between font-medium">
          <span>Platform Status:</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Live & Healthy
          </span>
        </div>
        <div className="text-[11px] text-muted-foreground/80">Nexura Hub Core v2.4</div>
      </div>
    </div>
  );
};

export default AdminSidebar;
