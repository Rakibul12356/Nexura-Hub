import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { CourseSidebar } from "@/components/player/CourseSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserCheck, BookOpen, LayoutDashboard, LogOut } from "lucide-react";
import { Logo } from "@/components/common/logo";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const PlayerLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Successfully logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Learning Navigation Bar (Container Centered) */}
      <header className="h-16 border-b z-50 bg-card/95 backdrop-blur sticky top-0 left-0 right-0 shadow-sm flex items-center">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left Side: Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Right Side: My Courses, User Profile Dropdown, and Mobile Sidebar Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button asChild size="sm" variant="outline" className="hidden sm:flex">
              <Link to="/account/enrolled-courses">My Courses</Link>
            </Button>

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="cursor-pointer rounded-full focus-visible:outline-none ring-offset-background transition-opacity hover:opacity-80">
                    <Avatar className="h-9 w-9 border border-border ring-2 ring-primary/10">
                      <AvatarImage
                        src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                        alt={user.firstName}
                      />
                      <AvatarFallback>
                        {user.firstName ? user.firstName[0] : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </button>
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
                  {user.role === "admin" && (
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to="/admin" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <Link to="/login">Login</Link>
              </Button>
            )}

            {/* Mobile Curriculum Sidebar Menu Button (Beside Profile) */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-80">
                <CourseSidebar onLessonClick={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Container 12-Column Layout */}
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 w-full max-w-full overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Main Video & Content Area (Left 8 Cols) */}
          <main className="lg:col-span-8 w-full min-w-0">
            <Outlet />
          </main>

          {/* Curriculum Sidebar (Right 4 Cols - Sticky) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24">
            <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
              <CourseSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PlayerLayout;
