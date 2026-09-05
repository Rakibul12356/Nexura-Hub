import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MobileAdminSidebar } from "./mobile-admin-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogOut, Sun, Moon, ShieldCheck, ExternalLink, PlusCircle, BookOpen, PanelLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { toggleTheme, toggleSidebar } from "@/store/slices/uiSlice";
import { toast } from "react-toastify";

export const AdminNavbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const theme = useAppSelector((state) => state.ui.theme);
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Admin signed out successfully");
    navigate("/login");
  };

  return (
    <div className="px-4 border-b h-full flex items-center bg-card shadow-sm justify-between">
      <div className="flex items-center gap-2">
        <MobileAdminSidebar />
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
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9 border-2 border-purple-500">
                <AvatarImage src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"} alt={user?.firstName} />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-0.5 leading-none">
                <p className="font-semibold text-sm">
                  {user?.firstName} {user?.lastName || "(Admin)"}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@nexurahub.com"}</p>
                <Badge className="w-fit mt-1 text-[10px] bg-purple-600">Super Administrator</Badge>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AdminNavbar;
