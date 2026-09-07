import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { VideoDescription } from "@/components/player/VideoDescription";
import { PlayerNotes } from "@/components/player/PlayerNotes";
import { LessonDiscussion } from "@/components/player/LessonDiscussion";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle } from "lucide-react";
import { toast } from "react-toastify";

interface LessonConfig {
  id: string;
  title: string;
  chapter: string;
  hasQuiz: boolean;
  quizTitle?: string;
  quizzes?: Array<{
    id: string;
    title: string;
    options: Array<{ id: number | string; label: string; isCorrect: boolean }>;
  }>;
}

const LESSONS: Record<string, LessonConfig> = {
  "1": {
    id: "1",
    title: "1. Introduction to the Reactive Accelerator",
    chapter: "Module 1: Getting Started",
    hasQuiz: false,
  },
  "2": {
    id: "2",
    title: "2. What is React and the Virtual DOM?",
    chapter: "Module 1: Getting Started",
    hasQuiz: true,
    quizTitle: "Virtual DOM & Reconciliation MCQ",
    quizzes: [
      {
        id: "q1",
        title: "What algorithm does React use to reconcile Virtual DOM changes?",
        options: [
          { id: 1, label: "Diffing Algorithm (Heuristic O(n))", isCorrect: true },
          { id: 2, label: "Binary Tree Traversal Search", isCorrect: false },
          { id: 3, label: "Deep Linear Brute Force Search", isCorrect: false },
        ],
      },
      {
        id: "q2",
        title: "Why is the Virtual DOM faster than direct real DOM updates?",
        options: [
          { id: 1, label: "It batches updates and repaints only actual changed nodes", isCorrect: true },
          { id: 2, label: "It compiles directly to WebAssembly binary", isCorrect: false },
          { id: 3, label: "It runs exclusively on server threads", isCorrect: false },
        ],
      },
    ],
  },
  "3": {
    id: "3",
    title: "3. Component Architecture and Props",
    chapter: "Module 1: Getting Started",
    hasQuiz: true,
    quizTitle: "Component Architecture & Props Assessment",
    quizzes: [
      {
        id: "q3",
        title: "How should props be treated inside a React component?",
        options: [
          { id: 1, label: "Read-only and immutable", isCorrect: true },
          { id: 2, label: "Mutable and editable directly", isCorrect: false },
          { id: 3, label: "Stored in global window object", isCorrect: false },
        ],
      },
      {
        id: "q4",
        title: "Which hook is used for functional component local state?",
        options: [
          { id: 1, label: "useState", isCorrect: true },
          { id: 2, label: "useComponent", isCorrect: false },
          { id: 3, label: "useDOM", isCorrect: false },
        ],
      },
    ],
  },
  "4": {
    id: "4",
    title: "4. Deep Dive into Redux Architecture",
    chapter: "Module 2: State Management",
    hasQuiz: false,
  },
  "5": {
    id: "5",
    title: "5. Async Thunks and RTK Query",
    chapter: "Module 2: State Management",
    hasQuiz: true,
    quizTitle: "Redux Toolkit & RTK Query MCQ",
    quizzes: [
      {
        id: "q5",
        title: "What library does Redux Toolkit use for mutable draft state syntax?",
        options: [
          { id: 1, label: "Immer", isCorrect: true },
          { id: 2, label: "Lodash cloneDeep", isCorrect: false },
          { id: 3, label: "Immutable.js", isCorrect: false },
        ],
      },
    ],
  },
};

export const CoursePlayerPage: React.FC = () => {
  const { lessonId = "1" } = useParams();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({ "1": true });
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, boolean>>({});
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  const currentLesson = LESSONS[lessonId] || {
    id: lessonId,
    title: `Lesson ${lessonId}`,
    chapter: "Course Content",
    hasQuiz: false,
  };

  const isCurrentCompleted = !!completedLessons[lessonId];
  const isQuizPassed = !!completedQuizzes[lessonId];

  // Helper to advance to next lesson
  const advanceToNextLesson = () => {
    const currentNum = parseInt(lessonId, 10);
    const nextNum = currentNum + 1;
    if (LESSONS[String(nextNum)]) {
      toast.info(`Advancing to Lesson ${nextNum}...`);
      setTimeout(() => {
        navigate(`/player/reactive-accelerator/${nextNum}`);
      }, 1000);
    } else {
      toast.success("🎓 Congratulations! You have completed all lessons in this course!");
    }
  };

  // Video End Handler: Triggered automatically when video playback finishes
  const handleVideoEnded = () => {
    // If the lesson has an MCQ and it has not been submitted/passed yet
    if (currentLesson.hasQuiz && !isQuizPassed) {
      toast.warning("⚠️ This lesson includes a mandatory MCQ assessment. Please complete the quiz to proceed!");
      setIsQuizModalOpen(true);
    } else {
      // Mark lesson complete and auto-advance
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

  return (
    <div className="space-y-6 pb-20">
      <VideoPlayer
        title={currentLesson.title}
        onTimeUpdate={(t) => setCurrentTime(t)}
        onEnded={handleVideoEnded}
      />

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                {currentLesson.title}
              </h1>
              {currentLesson.hasQuiz && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  <HelpCircle className="h-3 w-3" /> Mandatory MCQ
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Reactive Accelerator • {currentLesson.chapter}
            </p>
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
            <VideoDescription
              hasQuiz={currentLesson.hasQuiz}
              quizTitle={currentLesson.quizTitle}
              quizzes={currentLesson.quizzes}
              isQuizModalOpen={isQuizModalOpen}
              setIsQuizModalOpen={setIsQuizModalOpen}
              onQuizCompleted={handleQuizCompleted}
            />
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
