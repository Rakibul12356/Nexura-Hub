import React from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart,
  BookOpen,
  PlusCircle,
  Radio,
  BookA,
  Users,
  DollarSign,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { useAppSelector } from "@/store/hooks";

export const SidebarRoutes: React.FC = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);
  const { courses: adminCourses, users: adminUsers, transactions } = useAppSelector(
    (state) => state.admin
  );
  const { instructorCourses } = useAppSelector((state) => state.dashboard);

  const isAdminRoute = location.pathname.startsWith("/admin");

  const pendingCourses = adminCourses.filter((c) => !c.isPublished).length;
  const pendingUsers = adminUsers.filter((u) => u.status === "pending").length;

  const adminRoutes = [
    {
      icon: LayoutDashboard,
      label: "Overview",
      href: "/admin",
    },
    {
      icon: BookOpen,
      label: "All Courses",
      href: "/admin/courses",
      badge: pendingCourses > 0 ? `${pendingCourses} new` : adminCourses.length,
    },
    {
      icon: Users,
      label: "User Management",
      href: "/admin/users",
      badge: pendingUsers > 0 ? `${pendingUsers} req` : adminUsers.length,
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
  ];

  const instructorRoutes = [
    ...(user?.role === "admin"
      ? [
          {
            icon: ShieldCheck,
            label: "Admin Control Hub",
            href: "/admin",
          },
        ]
      : []),
    {
      icon: BarChart,
      label: "Analytics",
      href: "/dashboard",
    },
    {
      icon: BookOpen,
      label: "Courses",
      href: "/dashboard/courses",
      badge: instructorCourses.length,
    },
    {
      icon: PlusCircle,
      label: "Add Course",
      href: "/dashboard/courses/add",
    },
    {
      icon: Radio,
      label: "Live Classes",
      href: "/dashboard/lives",
    },
    {
      icon: BookA,
      label: "Quiz Sets",
      href: "/dashboard/quiz-sets",
    },
  ];

  const routes = isAdminRoute ? adminRoutes : instructorRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
          badge={route.badge}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
