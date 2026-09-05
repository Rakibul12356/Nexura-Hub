import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";

export const MobileAdminSidebar: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden pr-4 hover:opacity-75 transition">
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-card w-72">
        <AdminSidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileAdminSidebar;
