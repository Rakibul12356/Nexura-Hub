import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLockBody } from "@/hooks/use-lock-body";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, buttonVariants } from "@/components/ui/button";
import { NavItem } from "@/types/common";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearchQuery } from "@/store/slices/courseSlice";

interface MobileNavProps {
  items: NavItem[];
  children?: React.ReactNode;
  onClose?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ items, children, onClose }) => {
  useLockBody();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(setSearchQuery(searchTerm.trim()));
      onClose?.();
      navigate("/courses");
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 lg:hidden bg-background/95 backdrop-blur-md"
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-card p-4 text-card-foreground shadow-md border">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-sm bg-muted/40 rounded-full w-full"
          />
        </form>

        <nav className="grid grid-flow-row auto-rows-max text-sm gap-1">
          {items.map((item, index) => (
            <Link
              key={index}
              to={item.disabled ? "#" : item.href}
              onClick={onClose}
              className={cn(
                "flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-muted transition-colors",
                item.disabled && "cursor-not-allowed opacity-60"
              )}
            >
              {item.title}
            </Link>
          ))}
          {isAuthenticated && (
            <>
              <Link
                to="/account"
                onClick={onClose}
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-muted"
              >
                Profile
              </Link>
              <Link
                to="/account/enrolled-courses"
                onClick={onClose}
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-muted"
              >
                Enrolled Courses
              </Link>
              <Link
                to="/dashboard"
                onClick={onClose}
                className="flex w-full items-center rounded-md p-2 text-sm font-medium hover:bg-muted text-sky-600"
              >
                Instructor Dashboard
              </Link>
            </>
          )}
        </nav>
        {!isAuthenticated && (
          <div className="items-center gap-3 flex flex-col sm:flex-row pt-2 border-t">
            <Link
              to="/login"
              onClick={onClose}
              className={cn(buttonVariants({ size: "sm" }), "w-full justify-center")}
            >
              Login
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  Register
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 mt-2">
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/register?role=student" onClick={onClose}>
                    Student
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/register?role=instructor" onClick={onClose}>
                    Instructor
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
