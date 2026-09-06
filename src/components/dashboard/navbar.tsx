import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MobileSidebar } from "./mobile-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, UserCheck, BookOpen, Sun, Moon, ShieldCheck, PanelLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { toggleTheme, toggleSidebar } from "@/store/slices/uiSlice";
import { toast } from "react-toastify";

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const theme = useAppSelector((state) => state.ui.theme);
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Successfully logged out");
    navigate("/");
  };

  return (
    <div className="px-4 border-b h-full flex items-center bg-card shadow-sm justify-between">
      <div className="flex items-center gap-2">
        <MobileSidebar />
      </div>

      <div className="flex items-center gap-x-3 ml-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(toggleTheme())}
          className="text-muted-foreground hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              <Avatar className="h-9 w-9 border">
                <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} alt="User" />
                <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-sm">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="w-[180px] truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            {user?.role !== "admin" && (
              <>
                {user?.role === "instructor" && (
                  <DropdownMenuItem asChild className="cursor-pointer font-semibold">
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-sky-600" />
                      Instructor Studio
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/account" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/account/enrolled-courses" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    My Courses
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
