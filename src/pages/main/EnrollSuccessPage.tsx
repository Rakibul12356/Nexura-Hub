import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, BookOpen } from "lucide-react";

export const EnrollSuccessPage: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
      <div className="flex flex-col items-center gap-6 max-w-md text-center p-8 rounded-2xl border bg-card text-card-foreground shadow-lg">
        <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 animate-in zoom-in">
          <CheckCircle className="w-12 h-12" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Enrollment Successful!
          </h1>
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            Congratulations! You have gained full access to the course and learning materials.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
          <Button asChild className="w-full bg-sky-600 hover:bg-sky-700 gap-2">
            <Link to="/player/reactive-accelerator/1">
              Start Learning
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full gap-2">
            <Link to="/courses">
              <BookOpen className="h-4 w-4" />
              Browse More
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnrollSuccessPage;
