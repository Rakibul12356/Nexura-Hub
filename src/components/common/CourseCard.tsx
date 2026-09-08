import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseProgress } from "@/components/common/course-progress";
import { formatPrice } from "@/lib/formatPrice";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link to={`/courses/${course.id}`} className="block h-full">
      <div className="group hover:shadow-lg transition-all overflow-hidden border bg-card text-card-foreground rounded-xl p-3 h-full flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 duration-300">
        <div>
          {/* Thumbnail Container - Fixed Height for 100% Uniform Image Sizes */}
          <div className="relative w-full h-44 sm:h-48 rounded-lg overflow-hidden bg-muted shrink-0">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {course.category && (
              <div className="absolute top-2 right-2">
                <span className="bg-primary/90 text-primary-foreground text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow">
                  {course.category}
                </span>
              </div>
            )}
          </div>

          {/* Card Body */}
          <div className="flex flex-col pt-3">
            {/* Title - Strict 1 line truncated */}
            <h3
              className="text-base font-semibold group-hover:text-sky-600 truncate transition-colors leading-snug"
              title={course.title}
            >
              {course.title}
            </h3>

            {/* Subtitle / Description - Fixed 2 lines block height (h-9) for perfect horizontal alignment */}
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 h-9 leading-relaxed overflow-hidden">
              {course.subtitle || course.description || ""}
            </p>

            {/* Chapters & Progress bar */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-x-1 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>{course.totalChapters || 4} Chapters</span>
              </div>

              <CourseProgress
                size="sm"
                value={course.progress || 80}
                variant={course.progress === 100 ? "success" : undefined}
              />
            </div>
          </div>
        </div>

        {/* Footer - Price & Enroll button */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t">
          <div>
            <span className="text-base font-bold text-foreground">
              {formatPrice(course.price)}
            </span>
            {course.discountPrice && (
              <span className="text-xs text-muted-foreground line-through ml-2">
                {formatPrice(course.discountPrice)}
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            className="text-xs text-sky-600 hover:text-sky-700 h-8 gap-1 font-medium px-2"
          >
            Enroll
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
