import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, BookA } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addQuizSet } from "@/store/slices/dashboardSlice";
import { toast } from "sonner";
import { QuizSet } from "@/types/course";

export const AddQuizSetPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const newSetId = Date.now();
    const newSet: QuizSet = {
      id: newSetId,
      title,
      description,
      totalMarks: 20,
      isPublished: true,
      questions: [],
    };

    dispatch(addQuizSet(newSet));
    toast.success("Quiz set created! Add questions now.");
    navigate(`/dashboard/quiz-sets/${newSetId}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          to="/dashboard/quiz-sets"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground gap-1.5 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quiz Sets
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <BookA className="h-6 w-6 text-indigo-500" />
          Create New Quiz Set
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Give your quiz set a title and description before adding questions
        </p>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-1 block">Quiz Set Title *</Label>
            <Input
              placeholder="e.g. 'Module 3: React State Management Quiz'"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label className="mb-1 block">Instructions / Description</Label>
            <Textarea
              placeholder="Describe what concepts will be assessed..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button asChild variant="outline">
              <Link to="/dashboard/quiz-sets">Cancel</Link>
            </Button>
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
              Continue to Questions
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuizSetPage;
