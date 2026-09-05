import React from "react";
import { useParams, Link } from "react-router-dom";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { VideoDescription } from "@/components/player/VideoDescription";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

export const CoursePlayerPage: React.FC = () => {
  const { lessonId = "1" } = useParams();

  const lessonTitles: Record<string, string> = {
    "1": "1. Introduction to the Reactive Accelerator",
    "2": "2. What is React and the Virtual DOM?",
    "3": "3. Component Architecture and Props",
    "4": "4. Deep Dive into Redux Architecture",
    "5": "5. Async Thunks and RTK Query",
  };

  const title = lessonTitles[lessonId] || `Lesson ${lessonId}`;

  const handleMarkComplete = () => {
    toast.success("Lesson marked as completed!");
  };

  return (
    <div className="space-y-6 pb-20">
      <VideoPlayer title={title} />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Reactive Accelerator • Chapter 1
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkComplete}
              className="gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Mark Complete
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-sky-600 hover:bg-sky-700 gap-1.5"
            >
              <Link to={`/player/reactive-accelerator/${Number(lessonId) < 5 ? Number(lessonId) + 1 : 1}`}>
                Next Lesson
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <Separator />
        <VideoDescription />
      </div>
    </div>
  );
};

export default CoursePlayerPage;
