import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Search, GraduationCap } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export const CourseEnrollmentsPage: React.FC = () => {
  const { courseId } = useParams();
  const { enrollments } = useAppSelector((state) => state.dashboard);
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = enrollments.filter(
    (e) =>
      e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.studentEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Link
            to={`/dashboard/courses/${courseId}`}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground gap-1.5 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Course
          </Link>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-sky-600" />
            Course Enrollments
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            List of students currently enrolled in this course
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name or email..."
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
              <TableHead>Student Name</TableHead>
              <TableHead>Email Address</TableHead>
              <TableHead>Enrollment Date</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/40">
                <TableCell className="font-semibold">{item.studentName}</TableCell>
                <TableCell className="text-muted-foreground">{item.studentEmail}</TableCell>
                <TableCell className="text-muted-foreground text-xs">{item.enrolledDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-600 h-full rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-xs">{item.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="success">{item.paymentStatus}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseEnrollmentsPage;
