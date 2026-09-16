import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuizModal } from "./QuizModal";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LessonResource } from "@/types/course";

interface VideoDescriptionProps {
  description?: string;
  resources?: LessonResource[];
  quizTitle?: string;
  quizzes?: any[];
  quizId?: string | number;
  lessonId?: string | number;
  isQuizModalOpen?: boolean;
  setIsQuizModalOpen?: (open: boolean) => void;
  onQuizCompleted?: (score: number, passed: boolean) => void;
  hasQuiz?: boolean;
}

export const VideoDescription: React.FC<VideoDescriptionProps> = ({
  description,
  resources = [],
  quizTitle,
  quizzes,
  quizId,
  lessonId,
  isQuizModalOpen,
  setIsQuizModalOpen,
  onQuizCompleted,
  hasQuiz = true,
}) => {
  const displayResources = resources || [];

  return (
    <div className="mt-6">
      <Tabs defaultValue="details">
        <TabsList className="bg-transparent p-0 border-b border-border w-full justify-start h-auto rounded-none gap-6">
          <TabsTrigger
            className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 font-semibold"
            value="details"
          >
            Lesson Description
          </TabsTrigger>
          {hasQuiz && (
            <TabsTrigger
              className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 font-semibold"
              value="quiz"
            >
              Quiz Assessment
            </TabsTrigger>
          )}
          <TabsTrigger
            className="capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 font-semibold"
            value="resources"
          >
            Resources ({displayResources.length})
          </TabsTrigger>
        </TabsList>

        <div className="pt-4">
          <TabsContent value="details" className="space-y-4">
            <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground leading-relaxed">
              {description ? (
                <p className="whitespace-pre-line text-foreground/90">{description}</p>
              ) : (
                <p>Follow along with the video and complete any associated assignments.</p>
              )}
            </div>
          </TabsContent>

          {hasQuiz && (
            <TabsContent value="quiz" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {quizTitle ? `Quiz: ${quizTitle}` : "Complete the quiz below to validate your knowledge before proceeding to the next chapter."}
              </p>
              <QuizModal
                quizzes={quizzes}
                quizId={quizId}
                lessonId={lessonId}
                isOpen={isQuizModalOpen}
                onOpenChange={setIsQuizModalOpen}
                onComplete={onQuizCompleted}
                lessonTitle={quizTitle}
              />
            </TabsContent>
          )}

          <TabsContent value="resources" className="space-y-3">
            {displayResources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No resources attached to this lesson.</p>
            ) : displayResources.map((res) => (
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
        </div>
      </Tabs>
    </div>
  );
};

export default VideoDescription;
