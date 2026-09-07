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
  isQuizModalOpen?: boolean;
  setIsQuizModalOpen?: (open: boolean) => void;
  onQuizCompleted?: (score: number, passed: boolean) => void;
  hasQuiz?: boolean;
}

const defaultResources: LessonResource[] = [
  { id: "1", title: "lecture-01-starter-code.zip", size: "2.4 MB", url: "https://github.com" },
  { id: "2", title: "react-architecture-cheatsheet.pdf", size: "1.1 MB", url: "https://react.dev" },
];

export const VideoDescription: React.FC<VideoDescriptionProps> = ({
  description,
  resources = defaultResources,
  quizTitle,
  quizzes,
  isQuizModalOpen,
  setIsQuizModalOpen,
  onQuizCompleted,
  hasQuiz = true,
}) => {
  const displayResources = resources && resources.length > 0 ? resources : defaultResources;

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
                <>
                  <p>
                    In this introductory lecture, we explore the core building blocks of modern frontend development. You will learn how modern UI libraries like React work under the hood with virtual DOM diffing algorithms.
                  </p>
                  <h4 className="text-base font-semibold text-foreground mt-4">Key Takeaways:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Understanding declarative vs imperative UI paradigms</li>
                    <li>Component tree architecture and unidirectional data flow</li>
                    <li>Setup with Vite, TypeScript, and modern ESLint toolchains</li>
                  </ul>
                </>
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
                isOpen={isQuizModalOpen}
                onOpenChange={setIsQuizModalOpen}
                onComplete={onQuizCompleted}
                lessonTitle={quizTitle}
              />
            </TabsContent>
          )}

          <TabsContent value="resources" className="space-y-3">
            {displayResources.map((res) => (
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
