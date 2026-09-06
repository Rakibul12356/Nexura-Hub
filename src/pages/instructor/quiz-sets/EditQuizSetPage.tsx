import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookA,
  Pencil,
  PlusCircle,
  Trash2,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateQuizSet } from "@/store/slices/dashboardSlice";
import { toast } from "react-toastify";
import { QuizQuestion, QuizSet } from "@/types/course";

export const EditQuizSetPage: React.FC = () => {
  const { quizSetId } = useParams();
  const dispatch = useAppDispatch();
  const { quizSets } = useAppSelector((state) => state.dashboard);

  const quizSet =
    quizSets.find((q) => String(q.id) === String(quizSetId)) || quizSets[0];

  const [title, setTitle] = useState(quizSet?.title || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isPublished, setIsPublished] = useState<boolean>(quizSet?.isPublished ?? true);

  const [questions, setQuestions] = useState<QuizQuestion[]>(
    quizSet?.questions || [
      {
        id: "q-1",
        title: "Which hook is used for side effects in React functional components?",
        description: "Standard lifecycle side effect handler.",
        points: 5,
        options: [
          { id: "opt-1", label: "useEffect", isCorrect: true },
          { id: "opt-2", label: "useState", isCorrect: false },
          { id: "opt-3", label: "useReducer", isCorrect: false },
          { id: "opt-4", label: "useMemo", isCorrect: false },
        ],
      },
    ]
  );

  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDesc, setQuestionDesc] = useState("");
  const [optionA, setOptionA] = useState({ label: "", isCorrect: false });
  const [optionB, setOptionB] = useState({ label: "", isCorrect: false });
  const [optionC, setOptionC] = useState({ label: "", isCorrect: false });
  const [optionD, setOptionD] = useState({ label: "", isCorrect: false });

  const handleSaveTitle = () => {
    dispatch(updateQuizSet({ ...quizSet, title }));
    setIsEditingTitle(false);
    toast.success("Quiz set title updated");
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTitle.trim()) {
      toast.error("Please enter question title");
      return;
    }
    if (!optionA.isCorrect && !optionB.isCorrect && !optionC.isCorrect && !optionD.isCorrect) {
      toast.error("Please mark at least one correct option");
      return;
    }

    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      title: questionTitle,
      description: questionDesc,
      points: 5,
      options: [
        { id: `opt-1-${Date.now()}`, label: optionA.label || "Option A", isCorrect: optionA.isCorrect },
        { id: `opt-2-${Date.now()}`, label: optionB.label || "Option B", isCorrect: optionB.isCorrect },
        { id: `opt-3-${Date.now()}`, label: optionC.label || "Option C", isCorrect: optionC.isCorrect },
        { id: `opt-4-${Date.now()}`, label: optionD.label || "Option D", isCorrect: optionD.isCorrect },
      ],
    };

    const updated = [...questions, newQuestion];
    setQuestions(updated);
    dispatch(updateQuizSet({ ...quizSet, questions: updated }));

    // Reset form
    setQuestionTitle("");
    setQuestionDesc("");
    setOptionA({ label: "", isCorrect: false });
    setOptionB({ label: "", isCorrect: false });
    setOptionC({ label: "", isCorrect: false });
    setOptionD({ label: "", isCorrect: false });
    setIsAddingQuestion(false);
    toast.success("Question added to quiz set!");
  };

  const handleDeleteQuestion = (qId: string | number) => {
    const updated = questions.filter((q) => q.id !== qId);
    setQuestions(updated);
    dispatch(updateQuizSet({ ...quizSet, questions: updated }));
    toast.success("Question deleted");
  };

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard/quiz-sets"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quiz Sets
        </Link>

        <Button
          onClick={() => {
            setIsPublished(!isPublished);
            toast.success(
              !isPublished ? "Quiz set published" : "Quiz set moved to draft"
            );
          }}
          size="sm"
          className={
            isPublished
              ? "bg-slate-700 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }
        >
          {isPublished ? "Unpublish" : "Publish"}
        </Button>
      </div>

      {/* Quiz Set Title Card */}
      <div className="border bg-card rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between font-medium text-sm">
          <span>Quiz Set Title</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditingTitle(!isEditingTitle)}
            className="gap-1 text-xs"
          >
            <Pencil className="h-3.5 w-3.5" />
            {isEditingTitle ? "Cancel" : "Edit"}
          </Button>
        </div>

        {!isEditingTitle ? (
          <h2 className="text-xl font-bold mt-2">{title}</h2>
        ) : (
          <div className="mt-3 space-y-3">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            <Button size="sm" onClick={handleSaveTitle}>
              Save Title
            </Button>
          </div>
        )}
      </div>

      {/* Questions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Quiz Questions ({questions.length})</h3>
            <p className="text-xs text-muted-foreground">
              Add multiple choice questions and designate the correct answer
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingQuestion(!isAddingQuestion)}
            className="gap-1.5 text-sky-600"
          >
            <PlusCircle className="h-4 w-4" />
            {isAddingQuestion ? "Cancel" : "Add Question"}
          </Button>
        </div>

        {/* Add Question Form Card */}
        {isAddingQuestion && (
          <div className="border bg-card rounded-2xl p-6 shadow-md border-sky-200 dark:border-sky-900">
            <h4 className="font-bold text-base mb-4">New Question Builder</h4>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <Label className="mb-1 block">Question Title *</Label>
                <Input
                  placeholder="e.g. 'What is the purpose of useEffect?'"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="mb-1 block">Explanation / Description</Label>
                <Input
                  placeholder="Optional hint or explanation..."
                  value={questionDesc}
                  onChange={(e) => setQuestionDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Option A */}
                <div className="border p-3 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Option A</Label>
                    <div className="flex items-center gap-1.5">
                      <Checkbox
                        id="optA-correct"
                        checked={optionA.isCorrect}
                        onCheckedChange={(c) =>
                          setOptionA({ ...optionA, isCorrect: Boolean(c) })
                        }
                      />
                      <label htmlFor="optA-correct" className="text-xs text-emerald-600 font-medium">
                        Correct Answer
                      </label>
                    </div>
                  </div>
                  <Input
                    placeholder="Option A text"
                    value={optionA.label}
                    onChange={(e) =>
                      setOptionA({ ...optionA, label: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Option B */}
                <div className="border p-3 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Option B</Label>
                    <div className="flex items-center gap-1.5">
                      <Checkbox
                        id="optB-correct"
                        checked={optionB.isCorrect}
                        onCheckedChange={(c) =>
                          setOptionB({ ...optionB, isCorrect: Boolean(c) })
                        }
                      />
                      <label htmlFor="optB-correct" className="text-xs text-emerald-600 font-medium">
                        Correct Answer
                      </label>
                    </div>
                  </div>
                  <Input
                    placeholder="Option B text"
                    value={optionB.label}
                    onChange={(e) =>
                      setOptionB({ ...optionB, label: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Option C */}
                <div className="border p-3 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Option C</Label>
                    <div className="flex items-center gap-1.5">
                      <Checkbox
                        id="optC-correct"
                        checked={optionC.isCorrect}
                        onCheckedChange={(c) =>
                          setOptionC({ ...optionC, isCorrect: Boolean(c) })
                        }
                      />
                      <label htmlFor="optC-correct" className="text-xs text-emerald-600 font-medium">
                        Correct Answer
                      </label>
                    </div>
                  </div>
                  <Input
                    placeholder="Option C text"
                    value={optionC.label}
                    onChange={(e) =>
                      setOptionC({ ...optionC, label: e.target.value })
                    }
                  />
                </div>

                {/* Option D */}
                <div className="border p-3 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold">Option D</Label>
                    <div className="flex items-center gap-1.5">
                      <Checkbox
                        id="optD-correct"
                        checked={optionD.isCorrect}
                        onCheckedChange={(c) =>
                          setOptionD({ ...optionD, isCorrect: Boolean(c) })
                        }
                      />
                      <label htmlFor="optD-correct" className="text-xs text-emerald-600 font-medium">
                        Correct Answer
                      </label>
                    </div>
                  </div>
                  <Input
                    placeholder="Option D text"
                    value={optionD.label}
                    onChange={(e) =>
                      setOptionD({ ...optionD, label: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
                  Save Question
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingQuestion(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Question List Cards */}
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="border bg-card rounded-xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-sky-600">
                    Question {idx + 1} • {q.points || 5} Points
                  </span>
                  <h4 className="text-base font-bold text-foreground mt-0.5">
                    {q.title}
                  </h4>
                  {q.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {q.description}
                    </p>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDeleteQuestion(q.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                      opt.isCorrect
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 font-semibold"
                        : "bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {opt.isCorrect && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditQuizSetPage;
