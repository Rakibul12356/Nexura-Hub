import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "react-toastify";
import { useCreateReviewMutation } from "@/hooks/queries/useCoursesQuery";

interface ReviewModalProps {
  courseId?: string | number;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ courseId }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const createReview = useCreateReviewMutation(courseId || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) {
      toast.error("Course is not available for review yet.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }
    createReview.mutate(
      { rating, comment: comment.trim() },
      {
        onSuccess: () => {
          setOpen(false);
          setComment("");
          setRating(5);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          Leave a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate and Review this Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 hover:scale-125 transition-transform"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>

          <div>
            <Textarea
              placeholder="What did you think of this course and instructor? Share your feedback..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createReview.isPending} className="bg-sky-600 hover:bg-sky-700">
              Submit Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
