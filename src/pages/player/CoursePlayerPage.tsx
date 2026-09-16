import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { QuizModal } from "@/components/player/QuizModal";
import { PlayerNotes } from "@/components/player/PlayerNotes";
import { LessonDiscussion } from "@/components/player/LessonDiscussion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, FileText, Download } from "lucide-react";
import { toast } from "react-toastify";
import { useCourseDetailQuery, useLessonQuery } from "@/hooks/queries/useCoursesQuery";
import { useQuizSetQuery } from "@/hooks/queries/useDashboardQuery";
import { useCompleteLessonMutation } from "@/hooks/queries/useAdminQuery";

export const CoursePlayerPage: React.FC = () => {
  const { courseSlug = "", lessonId = "" } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourseDetailQuery(courseSlug);
  const { data: lesson } = useLessonQuery(lessonId);
  const completeLesson = useCompleteLessonMutation();

  const [currentTime, setCurrentTime] = useState(0);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const allLessons = useMemo(
    () =>
      (course?.modules || []).flatMap((mod) =>
        (mod.lessons || []).map((l) => ({
          ...l,
          chapter: mod.title,
        }))
      ),
    [course?.modules]
  );

  const currentLesson = lesson || allLessons.find((l) => String(l.id) === String(lessonId));
  const quizSetId = currentLesson?.quizSetId;
  const { data: quizSet } = useQuizSetQuery(quizSetId);
  const quizQuestions = quizSet?.questions || currentLesson?.questions || [];
  const hasQuiz = Boolean(quizSetId || currentLesson?.hasQuiz || quizQuestions.length);
  const resources = currentLesson?.resources || [];

  const advanceToNextLesson = () => {
    const currentIndex = allLessons.findIndex((l) => String(l.id) === String(lessonId));
    if (currentIndex >= 0 && currentIndex + 1 < allLessons.length) {
      const nextLesson = allLessons[currentIndex + 1];
      toast.info(`Advancing to ${nextLesson.title}...`);
      navigate(`/player/${courseSlug}/${nextLesson.id}`);
    } else {
      toast.success("Congratulations! You have completed all lessons in this course.");
    }
  };

  const markCompleteAndAdvance = () => {
    if (lessonId) {
      completeLesson.mutate(lessonId, {
        onSettled: () => advanceToNextLesson(),
      });
    } else {
      advanceToNextLesson();
    }
  };

  const handleVideoEnded = () => {
    if (hasQuiz && !currentLesson?.completed) {
      toast.warning("This lesson includes a mandatory MCQ assessment. Please complete the quiz to proceed.");
      setIsQuizModalOpen(true);
      return;
    }
    toast.success("Lesson finished!");
    markCompleteAndAdvance();
  };

  const handleQuizCompleted = (_score: number, passed: boolean) => {
    if (passed) {
      setIsQuizModalOpen(false);
      toast.success("MCQ assessment passed. Advancing to the next lesson...");
      markCompleteAndAdvance();
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
        url={currentLesson?.videoUrl}
        title={currentLesson?.title || "Lesson"}
        onTimeUpdate={(t) => setCurrentTime(t)}
        onEnded={handleVideoEnded}
      />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight break-words">
                {currentLesson?.title || "Lesson"}
              </h1>
              {hasQuiz && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 whitespace-nowrap">
                  <HelpCircle className="h-3 w-3" /> Mandatory MCQ
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 truncate">
              {course?.title} {currentLesson && "chapter" in currentLesson ? `• ${currentLesson.chapter}` : ""}
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
              {hasQuiz && (
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
                Resources ({resources.length})
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2.5 sm:pb-3 font-semibold text-xs sm:text-sm px-1 sm:px-2"
              >
                Notes
              </TabsTrigger>
              <TabsTrigger
                value="discussion"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-2.5 sm:pb-3 font-semibold text-xs sm:text-sm px-1 sm:px-2"
              >
                Q&A
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="pt-4 space-y-4">
            <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed">
              <p>
                {currentLesson?.description ||
                  "Follow along with the video and complete any associated assignments."}
              </p>
            </div>
          </TabsContent>

          {hasQuiz && (
            <TabsContent value="quiz" className="pt-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                {quizSet?.title || currentLesson?.quizSetTitle
                  ? `Quiz: ${quizSet?.title || currentLesson?.quizSetTitle}`
                  : "Complete the quiz below to validate your knowledge before proceeding to the next chapter."}
              </p>
              <QuizModal
                quizzes={quizQuestions}
                quizId={quizSetId}
                lessonId={lessonId}
                isOpen={isQuizModalOpen}
                onOpenChange={setIsQuizModalOpen}
                onComplete={handleQuizCompleted}
                lessonTitle={quizSet?.title || currentLesson?.quizSetTitle}
              />
            </TabsContent>
          )}

          <TabsContent value="resources" className="pt-4 space-y-3">
            {resources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No resources attached to this lesson.</p>
            ) : (
              resources.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between p-3 border rounded-xl bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-sky-600" />
                    <div>
                      <p className="text-sm font-medium">{res.title}</p>
                      <p className="text-xs text-muted-foreground">{res.size || res.type || "Resource"}</p>
                    </div>
                  </div>
                  {res.url ? (
                    <Button asChild variant="ghost" size="sm" className="gap-1 text-sky-600">
                      <a href={res.url} target="_blank" rel="noreferrer">
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  ) : null}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="notes" className="pt-4">
            {lessonId ? (
              <PlayerNotes lessonId={lessonId} currentTime={currentTime} />
            ) : null}
          </TabsContent>

          <TabsContent value="discussion" className="pt-4">
            {lessonId ? <LessonDiscussion lessonId={lessonId} /> : null}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoursePlayerPage;
