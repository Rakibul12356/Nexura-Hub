import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { VideoDescription } from "@/components/player/VideoDescription";
import { PlayerNotes } from "@/components/player/PlayerNotes";
import { LessonDiscussion } from "@/components/player/LessonDiscussion";
import { CertificateGenerator } from "@/components/common/CertificateGenerator";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

export const CoursePlayerPage: React.FC = () => {
  const { lessonId = "1" } = useParams();
  const [currentTime, setCurrentTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const lessonTitles: Record<string, string> = {
    "1": "1. Introduction to the Reactive Accelerator",
    "2": "2. What is React and the Virtual DOM?",
    "3": "3. Component Architecture and Props",
    "4": "4. Deep Dive into Redux Architecture",
    "5": "5. Async Thunks and RTK Query",
  };

  const title = lessonTitles[lessonId] || `Lesson ${lessonId}`;

  const handleMarkComplete = () => {
    setIsCompleted(true);
    toast.success("Lesson marked as completed! 100% course milestone unlocked.");
  };

  return (
    <div className="space-y-6 pb-20">
      <VideoPlayer title={title} onTimeUpdate={(t) => setCurrentTime(t)} />

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

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <CertificateGenerator courseTitle={title} />

            <Button
              variant={isCompleted ? "secondary" : "outline"}
              size="sm"
              onClick={handleMarkComplete}
              className="gap-1.5"
            >
              <CheckCircle2 className={`h-4 w-4 ${isCompleted ? "text-emerald-500 fill-emerald-500/20" : "text-emerald-600"}`} />
              {isCompleted ? "Completed" : "Mark Complete"}
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

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 font-semibold text-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="notes"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 font-semibold text-sm"
            >
              Personal Notes
            </TabsTrigger>
            <TabsTrigger
              value="discussion"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 font-semibold text-sm"
            >
              Discussion & Q&A
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-4">
            <VideoDescription />
          </TabsContent>

          <TabsContent value="notes" className="pt-4">
            <PlayerNotes currentTime={currentTime} />
          </TabsContent>

          <TabsContent value="discussion" className="pt-4">
            <LessonDiscussion lessonId={lessonId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoursePlayerPage;
