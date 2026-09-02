import React from "react";
import { Outlet } from "react-router-dom";
import { MainNav } from "@/components/common/main-nav";
import { SiteFooter } from "@/components/common/site-footer";
import { NavItem } from "@/types/common";

const navLinks: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Courses",
    href: "/courses",
  },
  {
    title: "Instructor",
    href: "/inst-profile",
  },
  {
    title: "Pricing",
    href: "/courses",
  },
];

export const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="z-40 bg-background/80 backdrop-blur-md fixed top-0 left-0 right-0 border-b border-border transition-all">
        <div className="container flex h-20 items-center justify-between py-6">
          <MainNav items={navLinks} />
        </div>
      </header>
      <main className="flex-1 pt-20 flex flex-col">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
};

export default MainLayout;
