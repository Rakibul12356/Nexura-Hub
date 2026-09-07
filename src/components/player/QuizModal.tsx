import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { toast } from "react-toastify";

interface QuizOption {
  id: number | string;
  label: string;
  isCorrect: boolean;
}

interface QuizItem {
  id: string;
  title: string;
  description?: string;
  options: QuizOption[];
}

interface QuizModalProps {
  quizzes?: QuizItem[];
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onComplete?: (score: number, passed: boolean) => void;
  showCard?: boolean;
  lessonTitle?: string;
}

const defaultQuizzes: QuizItem[] = [
  {
    id: "q1",
    title: "What is the primary benefit of React Virtual DOM?",
    options: [
      { id: 1, label: "Batched and efficient DOM updates", isCorrect: true },
      { id: 2, label: "Direct hardware acceleration", isCorrect: false },
      { id: 3, label: "Runs C++ natively in browsers", isCorrect: false },
    ],
  },
  {
    id: "q2",
    title: "How do props flow in React component hierarchy?",
    options: [
      { id: 1, label: "Top to bottom (Unidirectional data flow)", isCorrect: true },
      { id: 2, label: "Bottom to top (Bidirectional flow)", isCorrect: false },
      { id: 3, label: "Randomly across sibling components", isCorrect: false },
    ],
  },
];

export const QuizModal: React.FC<QuizModalProps> = ({
  quizzes = defaultQuizzes,
  isOpen,
  onOpenChange,
  onComplete,
  showCard = true,
  lessonTitle,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | string>>({});
  const [submitted, setSubmitted] = useState(false);

  const isModalOpen = isOpen !== undefined ? isOpen : internalOpen;
  const setModalOpen = (openVal: boolean) => {
    if (onOpenChange) {
      onOpenChange(openVal);
    } else {
      setInternalOpen(openVal);
    }
  };

  const totalQuizzes = quizzes.length;
  const currentQuiz = quizzes[quizIndex];

  const handleSelectOption = (optionId: number | string) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizIndex]: optionId,
    }));
  };

  const handleNext = () => {
    if (quizIndex < totalQuizzes - 1) {
      setQuizIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (quizIndex > 0) {
      setQuizIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let score = 0;
    quizzes.forEach((q, idx) => {
      const selectedId = selectedAnswers[idx];
      const correctOpt = q.options.find((o) => o.isCorrect);
      if (correctOpt && correctOpt.id === selectedId) {
        score += 1;
      }
    });

    const isPassed = score > 0;
    toast.success(`Quiz Completed! You scored ${score} out of ${totalQuizzes}`);

    setTimeout(() => {
      onComplete?.(score, isPassed);
    }, 800);
  };

  return (
    <>
      {showCard && (
        <div className="w-full max-w-sm sm:max-w-[320px] bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="flex h-24 sm:h-28 items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-600 px-4 sm:px-6 text-center">
            <span className="text-sm sm:text-base font-semibold text-white line-clamp-2">
              {lessonTitle ? `${lessonTitle} Quiz` : "Lesson Quiz Set"}
            </span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Total Marks:</span>
              <Badge variant="success">{totalQuizzes * 5} Pts</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Mandatory MCQ: Test your understanding before moving forward.
            </p>
            <Button
              className="w-full gap-2 border-sky-500 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950"
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setSelectedAnswers({});
                setQuizIndex(0);
                setModalOpen(true);
              }}
            >
              <HelpCircle className="h-4 w-4" />
              Participate in Quiz
            </Button>
          </div>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[calc(100vw-32px)] sm:max-w-[550px] p-4 sm:p-6 rounded-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between border-b pb-3 gap-2">
              <DialogTitle className="text-sm sm:text-base font-bold truncate">
                {lessonTitle || "Lesson MCQ Assessment"} (Q {quizIndex + 1}/{totalQuizzes})
              </DialogTitle>
              <Badge variant="secondary" className="text-[10px] sm:text-xs shrink-0">Mandatory MCQ</Badge>
            </div>
          </DialogHeader>

          <div className="py-3 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              {currentQuiz?.title}
            </h3>

            <div className="space-y-2.5">
              {currentQuiz?.options.map((option) => {
                const isSelected = selectedAnswers[quizIndex] === option.id;
                const isCorrect = option.isCorrect;

                let btnStyle = "border bg-card hover:bg-muted text-foreground";
                if (isSelected) {
                  btnStyle = "border-sky-500 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-medium";
                }
                if (submitted) {
                  if (isCorrect) {
                    btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 font-bold";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "border-destructive bg-destructive/10 text-destructive";
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    className={`w-full text-left p-3 rounded-lg flex items-center justify-between text-sm transition-colors ${btnStyle}`}
                  >
                    <span>{option.label}</span>
                    {isSelected && <CheckCircle2 className="h-4 w-4 shrink-0 text-sky-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between sm:justify-between border-t pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={quizIndex === 0}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {quizIndex === totalQuizzes - 1 ? (
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                onClick={handleSubmit}
                disabled={submitted}
              >
                Submit Quiz
              </Button>
            ) : (
              <Button size="sm" onClick={handleNext} className="gap-1">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuizModal;
