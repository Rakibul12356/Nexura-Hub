import React from "react";
import { Outlet } from "react-router-dom";
import { Logo } from "@/components/common/logo";

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-muted/20 grainy">
      <div className="mb-6">
        <Logo />
      </div>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
