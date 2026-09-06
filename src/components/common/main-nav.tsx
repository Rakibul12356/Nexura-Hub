import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { Logo } from "./logo";
import { Menu, X, LayoutDashboard, UserCheck, LogOut, BookOpen, ShieldCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NavItem } from "@/types/common";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { toast } from "react-toastify";

interface MainNavProps {
  items?: NavItem[];
  children?: React.ReactNode;
}

import NotificationCenter from "./NotificationCenter";

export const MainNav: React.FC<MainNavProps> = ({ items, children }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Successfully logged out");
    navigate("/");
  };

  return (
    <>
      <div className="flex gap-6 lg:gap-10 items-center">
        <Logo />
        {items?.length ? (
          <nav className="hidden gap-6 lg:flex items-center">
            {items.map((item, index) => (
              <Link
                key={index}
                to={item.disabled ? "#" : item.href}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-foreground/80 text-muted-foreground",
                  item.disabled && "cursor-not-allowed opacity-60"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        ) : null}

        {showMobileMenu && items && (
          <MobileNav items={items} onClose={() => setShowMobileMenu(false)}>
            {children}
          </MobileNav>
        )}
      </div>

      <nav className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <NotificationCenter />
            <Link
              to={
                user?.role === "admin"
                  ? "/admin"
                  : user?.role === "instructor"
                  ? "/dashboard"
                  : "/account/enrolled-courses"
              }
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-2 hidden md:flex border-primary text-primary hover:text-primary"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer">
                  <Avatar className="h-9 w-9 border border-border ring-2 ring-primary/10">
                    <AvatarImage
                      src={user.avatar || "https://github.com/shadcn.png"}
                      alt={user.firstName}
                    />
                    <AvatarFallback>
                      {user.firstName ? user.firstName[0] : "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-sm">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="w-[180px] truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {user.role !== "admin" && (
                  <>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to="/account" className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to="/account/enrolled-courses" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        My Courses
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "instructor" && (
                      <DropdownMenuItem className="cursor-pointer" asChild>
                        <Link to="/dashboard" className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Instructor Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="items-center gap-3 hidden lg:flex">
            <Link
              to="/login"
              className={cn(buttonVariants({ size: "sm" }), "px-4")}
            >
              Login
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Register
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/register?role=student">Student</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/register?role=instructor">Instructor</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <button
          className="flex items-center space-x-2 lg:hidden p-2 rounded-md hover:bg-muted"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle Menu"
        >
          {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
    </>
  );
};
