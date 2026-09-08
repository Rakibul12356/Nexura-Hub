import React from "react";
import { Link } from "react-router-dom";
import { CourseProgress } from "@/components/common/course-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, PlayCircle, Award } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export const EnrolledCoursesPage: React.FC = () => {
  const { enrolledCourses } = useAppSelector((state) => state.courses);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b">
        <div>
          <h2 className="text-xl font-bold">My Enrolled Courses</h2>
          <p className="text-sm text-muted-foreground">
            Track your ongoing progress, quizzes, and certificates
          </p>
        </div>
        <Badge variant="success" className="px-3 py-1">
          {enrolledCourses.length} Active Courses
        </Badge>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {enrolledCourses.map((course) => (
          <div
            key={course.id}
            className="group hover:shadow-md transition-all overflow-hidden border bg-card text-card-foreground rounded-xl p-4 flex flex-col justify-between"
          >
            <div>
              <div className="relative w-full h-44 sm:h-48 rounded-lg overflow-hidden bg-muted shrink-0">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="shadow-sm">
                    {course.category}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col pt-3">
                <div className="text-lg font-semibold group-hover:text-sky-600 transition-colors line-clamp-1">
                  {course.title}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Enrolled on: {course.enrolledDate}
                </p>

                <div className="my-3 flex items-center gap-x-2 text-xs text-muted-foreground">
                  <BookOpen className="w-4 h-4 text-sky-600" />
                  <span>{course.totalChapters || 4} Chapters</span>
                </div>

                <div className="border-t border-b border-border py-2 my-2 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Total Modules:</span>
                    <span className="font-semibold text-foreground">
                      {course.totalModules}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completed Modules:</span>
                    <Badge variant="success" className="text-[10px] px-1.5 py-0">
                      {course.completedModules} / {course.totalModules}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quizzes Taken:</span>
                    <span className="font-semibold text-foreground">
                      {course.completedQuizzes} / {course.totalQuizzes}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Marks Achieved:</span>
                    <span className="font-bold text-foreground text-sm text-sky-600">
                      {course.totalScore} / 100
                    </span>
                  </div>
                </div>

                <div className="mt-2">
                  <CourseProgress
                    size="sm"
                    value={course.progress || 80}
                    variant={course.progress === 100 ? "success" : undefined}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center gap-2">
              <Button asChild size="sm" className="w-full gap-1.5 bg-sky-600 hover:bg-sky-700">
                <Link to={`/player/${course.slug || "reactive-accelerator"}/1`}>
                  <PlayCircle className="h-4 w-4" />
                  Resume Learning
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnrolledCoursesPage;
