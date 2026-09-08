import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MainNav } from "@/components/common/main-nav";
import { SiteFooter } from "@/components/common/site-footer";
import { NavItem } from "@/types/common";
import { cn } from "@/lib/utils";

const navLinks: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Courses",
    href: "/courses",
  },
];

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const isMessagesPage = location.pathname.startsWith("/messages");

  return (
    <div className={cn("flex min-h-screen flex-col bg-background", isMessagesPage && "h-screen overflow-hidden")}>
      <header className="z-40 bg-background/80 backdrop-blur-md fixed top-0 left-0 right-0 border-b border-border transition-all">
        <div className="container flex h-20 items-center justify-between py-6">
          <MainNav items={navLinks} />
        </div>
      </header>
      <main className={cn("flex-1 pt-20 flex flex-col", isMessagesPage && "h-[calc(100vh-5rem)] overflow-hidden")}>
        <Outlet />
      </main>
      {!isMessagesPage && <SiteFooter />}
    </div>
  );
};

export default MainLayout;
