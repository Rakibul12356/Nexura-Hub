import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck, BookOpen, Shield, LogOut } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const AccountLayout: React.FC = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const menu = [
    { label: "Profile", href: "/account", icon: UserCheck },
    { label: "Enrolled Courses", href: "/account/enrolled-courses", icon: BookOpen },
  ];

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Successfully logged out");
    navigate("/");
  };

  return (
    <section className="relative pb-16 pt-6">
      <div className="container relative">
        <div className="lg:flex gap-8">
          <div className="lg:w-1/4">
            <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
              <div className="profile-pic text-center mb-5">
                <div className="relative size-28 mx-auto">
                  <Avatar className="size-28 ring-4 ring-primary/10 shadow-md">
                    <AvatarImage
                      src={user?.avatar || "/assets/images/profile.jpg"}
                      alt="Profile"
                    />
                    <AvatarFallback className="text-2xl font-bold">
                      {user?.firstName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-4">
                  <h5 className="text-lg font-semibold">
                    {user?.firstName} {user?.lastName}
                  </h5>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary capitalize">
                    {user?.role || "Student"}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <ul className="space-y-1">
                  {menu.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:w-3/4 mt-6 lg:mt-0">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AccountLayout;
