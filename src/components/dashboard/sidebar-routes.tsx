import React from "react";
import { BarChart, BookOpen, PlusCircle, Radio, BookA, Home, ShieldCheck } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { useAppSelector } from "@/store/hooks";

export const SidebarRoutes: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const routes = [
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
    {
      icon: Home,
      label: "Back to Home",
      href: "/",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
