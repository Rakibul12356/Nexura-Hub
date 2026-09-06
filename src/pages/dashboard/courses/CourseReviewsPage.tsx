import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Search, Star } from "lucide-react";

export const CourseReviewsPage: React.FC = () => {
  const { courseId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const reviews = [
    {
      id: 1,
      studentName: "Sadia Rahman",
      rating: 5,
      comment: "Outstanding walkthrough of the entire modern React & Redux lifecycle!",
      date: "2024-02-14",
    },
    {
      id: 2,
      studentName: "Anisur Khan",
      rating: 5,
      comment: "Clear explanations, solid real world examples. Highly recommend!",
      date: "2024-02-18",
    },
    {
      id: 3,
      studentName: "Karim Ullah",
      rating: 4,
      comment: "Very helpful exercises and quizzes. Great pace.",
      date: "2024-02-22",
    },
  ];

  const filtered = reviews.filter(
    (r) =>
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 w-full">
      <div>
        <Link
          to={`/dashboard/courses/${courseId}`}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground gap-1.5 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Course
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
          Course Student Reviews
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Student feedback and star ratings submitted for this course
        </p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/40">
                <TableCell className="font-semibold">{item.studentName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-md">
                  {item.comment}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{item.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseReviewsPage;
