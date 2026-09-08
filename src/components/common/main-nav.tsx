import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { Logo } from "./logo";
import { Menu, X, LayoutDashboard, UserCheck, LogOut, BookOpen, ShieldCheck, Search, MessageSquare } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { setSearchQuery } from "@/store/slices/courseSlice";
import { toast } from "react-toastify";
import NotificationCenter from "./NotificationCenter";

interface MainNavProps {
  items?: NavItem[];
  children?: React.ReactNode;
}

export const MainNav: React.FC<MainNavProps> = ({ items, children }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { conversations } = useAppSelector((state) => state.chat);

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Successfully logged out");
    navigate("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(setSearchQuery(searchTerm.trim()));
      navigate("/courses");
    }
  };

  return (
    <>
      <div className="flex gap-4 lg:gap-8 items-center flex-1">
        <Logo />
        {items?.length ? (
          <nav className="hidden gap-6 md:flex items-center">
            {items.map((item, index) => {
              const isActive =
                item.href === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(item.href);

              return (
                <Link
                  key={index}
                  to={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center text-sm font-semibold transition-all relative py-1",
                    isActive
                      ? "text-sky-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-sky-600 after:rounded-full"
                      : "text-muted-foreground hover:text-foreground",
                    item.disabled && "cursor-not-allowed opacity-60"
                  )}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>
        ) : null}

        {/* Search Field */}
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:flex items-center max-w-xs md:max-w-sm w-full ml-2 lg:ml-4">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs sm:text-sm bg-muted/40 hover:bg-muted/60 focus:bg-background border-border/60 rounded-full w-full transition-all"
          />
        </form>

        {showMobileMenu && items && (
          <MobileNav items={items} onClose={() => setShowMobileMenu(false)}>
            {children}
          </MobileNav>
        )}
      </div>

      <nav className="flex items-center gap-3">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/messages"
              className="relative p-2 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition"
              title="Messages & Course Groups"
            >
              <MessageSquare className="h-5 w-5 text-sky-600" />
              {totalUnreadMessages > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-sky-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-background">
                  {totalUnreadMessages}
                </span>
              )}
            </Link>

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
