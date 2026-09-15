import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookA,
  Pencil,
  PlusCircle,
  Trash2,
  HelpCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { QuizQuestion, QuizSet } from "@/types/course";
import { useQuizSetsQuery } from "@/hooks/queries/useDashboardQuery";

export const EditQuizSetPage: React.FC = () => {
  const { quizSetId } = useParams();
  const { data: quizSets = [] } = useQuizSetsQuery();

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

  useEffect(() => {
    if (quizSet) {
      setTitle(quizSet.title || "");
      setIsPublished(quizSet.isPublished ?? true);
      if (quizSet.questions?.length) {
        setQuestions(quizSet.questions);
      }
    }
  }, [quizSet]);

  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionOptions, setNewQuestionOptions] = useState([
    { label: "", isCorrect: true },
    { label: "", isCorrect: false },
    { label: "", isCorrect: false },
    { label: "", isCorrect: false },
  ]);

  const handleSaveSet = () => {
    toast.success("Quiz set updated!");
    setIsEditingTitle(false);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim()) {
      toast.error("Question title is required");
      return;
    }

    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      title: newQuestionTitle.trim(),
      points: 5,
      options: newQuestionOptions.map((opt, idx) => ({
        id: `opt-${idx}-${Date.now()}`,
        label: opt.label || `Option ${idx + 1}`,
        isCorrect: opt.isCorrect,
      })),
    };

    const updated = [...questions, newQ];
    setQuestions(updated);
    setNewQuestionTitle("");
    setNewQuestionOptions([
      { label: "", isCorrect: true },
      { label: "", isCorrect: false },
      { label: "", isCorrect: false },
      { label: "", isCorrect: false },
    ]);
    toast.success("Question added to quiz set!");
  };

  const handleDeleteQuestion = (id: string | number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toast.info("Question removed");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/dashboard/quiz-sets"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground gap-1.5 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quiz Sets
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <Badge variant={isPublished ? "default" : "secondary"}>
              {isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>

        <Button onClick={handleSaveSet} className="bg-sky-600 hover:bg-sky-700">
          Save Quiz Set
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Questions List */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-500" />
              Questions ({questions.length})
            </h3>
          </div>

          {questions.map((q, idx) => (
            <div key={q.id} className="p-4 border rounded-xl bg-card shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h4 className="font-semibold text-sm">
                  {idx + 1}. {q.title}
                </h4>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {q.options.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-2 rounded-lg border font-medium ${
                      opt.isCorrect
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:bg-emerald-950/40"
                        : "bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {opt.label} {opt.isCorrect && "✓"}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Add Question Form */}
        <div className="p-5 border rounded-2xl bg-card shadow-sm space-y-4 h-fit sticky top-24">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-sky-600" />
            Add New Question
          </h3>

          <form onSubmit={handleAddQuestion} className="space-y-4">
            <div>
              <Label className="text-xs mb-1 block">Question Prompt</Label>
              <Input
                placeholder="Type question here..."
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs block">Options (Check the correct answer)</Label>
              {newQuestionOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Checkbox
                    checked={opt.isCorrect}
                    onCheckedChange={(checked) => {
                      const updated = newQuestionOptions.map((o, i) => ({
                        ...o,
                        isCorrect: i === idx ? Boolean(checked) : false,
                      }));
                      setNewQuestionOptions(updated);
                    }}
                  />
                  <Input
                    placeholder={`Option ${idx + 1}`}
                    value={opt.label}
                    onChange={(e) => {
                      const updated = [...newQuestionOptions];
                      updated[idx].label = e.target.value;
                      setNewQuestionOptions(updated);
                    }}
                    className="text-xs h-8"
                  />
                </div>
              ))}
            </div>

            <Button type="submit" size="sm" className="w-full bg-sky-600 hover:bg-sky-700">
              Add Question
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditQuizSetPage;
