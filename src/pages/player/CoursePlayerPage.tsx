import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { QuizModal } from "@/components/player/QuizModal";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, FileText, Download } from "lucide-react";
import { toast } from "react-toastify";
import { LessonResource } from "@/types/course";
import { useCourseDetailQuery } from "@/hooks/queries/useCoursesQuery";

const defaultResources: LessonResource[] = [
  { id: "1", title: "lecture-01-starter-code.zip", size: "2.4 MB", url: "https://github.com" },
  { id: "2", title: "react-architecture-cheatsheet.pdf", size: "1.1 MB", url: "https://react.dev" },
];

export const CoursePlayerPage: React.FC = () => {
  const { courseSlug = "reactive-accelerator", lessonId = "1" } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourseDetailQuery(courseSlug);

  const [currentTime, setCurrentTime] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({ "1": true });
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, boolean>>({});
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // Flatten all lessons across modules from API
  const allLessons = (course?.modules || []).flatMap((mod) =>
    (mod.lessons || []).map((l) => ({
      ...l,
      chapter: mod.title,
    }))
  );

  const currentLesson =
    allLessons.find((l) => String(l.id) === String(lessonId)) ||
    allLessons[0] || {
      id: lessonId,
      title: `Lesson ${lessonId}`,
      chapter: "Course Curriculum",
      videoUrl: undefined,
      hasQuiz: false,
    };

  const isCurrentCompleted = !!completedLessons[lessonId];
  const isQuizPassed = !!completedQuizzes[lessonId];

  // Helper to advance to next lesson
  const advanceToNextLesson = () => {
    const currentIndex = allLessons.findIndex((l) => String(l.id) === String(lessonId));
    if (currentIndex >= 0 && currentIndex + 1 < allLessons.length) {
      const nextLesson = allLessons[currentIndex + 1];
      toast.info(`Advancing to ${nextLesson.title}...`);
      setTimeout(() => {
        navigate(`/player/${courseSlug}/${nextLesson.id}`);
      }, 1000);
    } else {
      toast.success("🎓 Congratulations! You have completed all lessons in this course!");
    }
  };

  // Video End Handler
  const handleVideoEnded = () => {
    if ((currentLesson as any).hasQuiz && !isQuizPassed) {
      toast.warning("⚠️ This lesson includes a mandatory MCQ assessment. Please complete the quiz to proceed!");
      setIsQuizModalOpen(true);
    } else {
      setCompletedLessons((prev) => ({ ...prev, [lessonId]: true }));
      toast.success("Lesson finished!");
      advanceToNextLesson();
    }
  };

  // Quiz Completion Handler
  const handleQuizCompleted = (_score: number, passed: boolean) => {
    if (passed) {
      setCompletedQuizzes((prev) => ({ ...prev, [lessonId]: true }));
      setCompletedLessons((prev) => ({ ...prev, [lessonId]: true }));
      setIsQuizModalOpen(false);
      toast.success("✅ MCQ Assessment Passed! Auto-advancing to the next lesson...");
      advanceToNextLesson();
    } else {
      toast.error("You need to pass the MCQ to unlock the next lesson. Please try again!");
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading video player and course content...
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <VideoPlayer
        url={(currentLesson as any).videoUrl}
        title={currentLesson.title}
        onTimeUpdate={(t) => setCurrentTime(t)}
        onEnded={handleVideoEnded}
      />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight break-words">
                {currentLesson.title}
              </h1>
              {(currentLesson as any).hasQuiz && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 whitespace-nowrap">
                  <HelpCircle className="h-3 w-3" /> Mandatory MCQ
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
              {course?.title || "Reactive Accelerator"} • {currentLesson.chapter}
            </p>
          </div>
        </div>

        <Separator />

        <Tabs defaultValue="overview" className="w-full">
          <div className="overflow-x-auto no-scrollbar border-b border-border">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-4 sm:gap-6 border-b-0 min-w-max">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2.5 sm:pb-3 font-semibold text-xs sm:text-sm px-1 sm:px-2"
              >
                Overview
              </TabsTrigger>
              {(currentLesson as any).hasQuiz && (
                <TabsTrigger
                  value="quiz"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2.5 sm:pb-3 font-semibold text-xs sm:text-sm px-1 sm:px-2"
                >
                  Quiz Assessment
                </TabsTrigger>
              )}
              <TabsTrigger
                value="resources"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2.5 sm:pb-3 font-semibold text-xs sm:text-sm px-1 sm:px-2"
              >
                Resources ({defaultResources.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="pt-4 space-y-4">
            <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed">
              <p>
                {(currentLesson as any).description ||
                  "In this lecture, we explore the core building blocks of modern fullstack development. Follow along with the video and complete any associated assignments."}
              </p>
            </div>
          </TabsContent>

          {(currentLesson as any).hasQuiz && (
            <TabsContent value="quiz" className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                {(currentLesson as any).quizTitle
                  ? `Quiz: ${(currentLesson as any).quizTitle}`
                  : "Complete the quiz below to validate your knowledge before proceeding to the next chapter."}
              </p>
              <QuizModal
                quizzes={(currentLesson as any).quizzes}
                isOpen={isQuizModalOpen}
                onOpenChange={setIsQuizModalOpen}
                onComplete={handleQuizCompleted}
                lessonTitle={(currentLesson as any).quizTitle}
              />
            </TabsContent>
          )}

          <TabsContent value="resources" className="pt-4 space-y-3">
            {defaultResources.map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between p-3 border rounded-xl bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-sky-600" />
                  <div>
                    <p className="text-sm font-medium">{res.title}</p>
                    <p className="text-xs text-muted-foreground">{res.size || "1.2 MB"}</p>
                  </div>
                </div>
                <Button asChild variant="ghost" size="sm" className="gap-1 text-sky-600">
                  <a href={res.url || "#"} target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoursePlayerPage;
