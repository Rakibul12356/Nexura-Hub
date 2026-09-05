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
}

const defaultQuizzes: QuizItem[] = [
  {
    id: "quiz-1",
    title: "Which hook is used for lifecycle side effects in React functional components?",
    description: "Component lifecycle & side effects handling.",
    options: [
      { id: 1, label: "useEffect", isCorrect: true },
      { id: 2, label: "useState", isCorrect: false },
      { id: 3, label: "useReducer", isCorrect: false },
      { id: 4, label: "useRef", isCorrect: false },
    ],
  },
  {
    id: "quiz-2",
    title: "How does Redux Toolkit simplify state management over legacy Redux?",
    description: "Immer integration and createSlice ergonomics.",
    options: [
      { id: 1, label: "Includes Immer for mutable updates inside reducers", isCorrect: true },
      { id: 2, label: "Removes actions completely", isCorrect: false },
      { id: 3, label: "Only works with class components", isCorrect: false },
      { id: 4, label: "Requires external middleware for everything", isCorrect: false },
    ],
  },
];

export const QuizModal: React.FC<QuizModalProps> = ({ quizzes = defaultQuizzes }) => {
  const [open, setOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | string>>({});
  const [submitted, setSubmitted] = useState(false);

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
    toast.success(`Quiz Completed! You scored ${score} out of ${totalQuizzes}`);
  };

  return (
    <>
      <div className="max-w-[300px] bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="flex h-28 items-center justify-center bg-gradient-to-r from-sky-500 to-indigo-600 px-6 text-center">
          <span className="text-base font-semibold text-white">
            Module 1 Lesson Quiz Set
          </span>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Total Marks:</span>
            <Badge variant="success">10 Pts</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Test your understanding of the concepts covered in this lesson.
          </p>
          <Button
            className="w-full gap-2 border-sky-500 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950"
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setSelectedAnswers({});
              setQuizIndex(0);
              setOpen(true);
            }}
          >
            <HelpCircle className="h-4 w-4" />
            Participate in Quiz
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <div className="flex items-center justify-between border-b pb-3">
              <DialogTitle className="text-base font-bold">
                Question {quizIndex + 1} of {totalQuizzes}
              </DialogTitle>
              <Badge variant="secondary">Single Choice</Badge>
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
