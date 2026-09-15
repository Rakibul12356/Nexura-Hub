import React from "react";
import { useLocation } from "react-router-dom";
import {
  BarChart,
  BookOpen,
  PlusCircle,
  Radio,
  BookA,
  Users,
  DollarSign,
  ShieldCheck,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { useAuthStore } from "@/store/useAuthStore";
import { useInstructorCoursesQuery } from "@/hooks/queries/useDashboardQuery";
import { useCoursesQuery } from "@/hooks/queries/useCoursesQuery";

export const SidebarRoutes: React.FC = () => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const { data: rawInstructorCourses } = useInstructorCoursesQuery();
  const { data: rawAllCourses } = useCoursesQuery();

  const instructorCourses = Array.isArray(rawInstructorCourses) ? rawInstructorCourses : [];
  const allCourses = Array.isArray(rawAllCourses) ? rawAllCourses : [];

  const isAdminRoute = location.pathname.startsWith("/admin");

  const pendingCourses = allCourses.filter((c) => !c?.isPublished).length;

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
      badge: pendingCourses > 0 ? `${pendingCourses} new` : allCourses.length,
    },
    {
      icon: Users,
      label: "User Management",
      href: "/admin/users",
    },
    {
      icon: DollarSign,
      label: "Revenue & 5% Cut",
      href: "/admin/revenue",
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
    ...(user?.role !== "admin"
      ? [
          {
            icon: MessageSquare,
            label: "Student Messages",
            href: "/dashboard/messages",
          },
        ]
      : []),
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
