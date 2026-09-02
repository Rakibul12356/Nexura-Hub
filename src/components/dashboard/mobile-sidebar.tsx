import React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export const MobileSidebar: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden pr-4 hover:opacity-75 transition">
        <Menu className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-card w-64">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
