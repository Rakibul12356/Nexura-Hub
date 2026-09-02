import React from "react";
import { BarChart, BookOpen, PlusCircle, Radio, BookA, Home } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

const routes = [
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

export const SidebarRoutes: React.FC = () => {
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
