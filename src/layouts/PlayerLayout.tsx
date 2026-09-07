import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { CourseSidebar } from "@/components/player/CourseSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ArrowLeft, Menu } from "lucide-react";
import { Logo } from "@/components/common/logo";

export const PlayerLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Learning Navigation Bar (Container Centered) */}
      <header className="h-16 border-b z-50 bg-card/95 backdrop-blur sticky top-0 left-0 right-0 shadow-sm flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0 w-80">
                <CourseSidebar onLessonClick={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <Link
              to="/courses"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to courses</span>
            </Link>
          </div>

          <Logo />

          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/account/enrolled-courses">My Courses</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container 12-Column Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
