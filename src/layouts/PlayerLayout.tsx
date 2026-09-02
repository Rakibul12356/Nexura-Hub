import React, { useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { CourseSidebar } from "@/components/player/CourseSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Menu, GraduationCap } from "lucide-react";
import { Logo } from "@/components/common/logo";

export const PlayerLayout: React.FC = () => {
  const { courseSlug = "reactive-accelerator" } = useParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Learning Navigation Bar */}
      <header className="h-16 border-b z-50 bg-card fixed top-0 left-0 right-0 flex items-center justify-between px-4 lg:px-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <CourseSidebar onLessonClick={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link
            to="/courses"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to courses</span>
          </Link>
        </div>

        <Logo />

        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="hidden sm:flex">
            <Link to="/account/enrolled-courses">My Courses</Link>
          </Button>
        </div>
      </header>

      {/* Sidebar & Player Body */}
      <div className="flex-1 flex pt-16">
        <aside className="hidden lg:flex w-80 flex-col fixed inset-y-0 top-16 z-40">
          <CourseSidebar />
        </aside>

        <main className="flex-1 lg:pl-80 p-4 lg:p-8 max-w-5xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PlayerLayout;
