import React from "react";
import { Link, useParams } from "react-router-dom";
import { CourseProgress } from "@/components/common/course-progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, PlayCircle, Lock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReviewModal } from "./ReviewModal";
import { CertificateGenerator } from "@/components/common/CertificateGenerator";
import { useCourseDetailQuery } from "@/hooks/queries/useCoursesQuery";

interface CourseSidebarProps {
  onLessonClick?: (lessonId: string | number) => void;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({ onLessonClick }) => {
  const { courseSlug = "reactive-accelerator", lessonId = "1" } = useParams();
  const { data: course } = useCourseDetailQuery(courseSlug);

  const modulesList = course?.modules || [];

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-card max-h-[calc(100vh-140px)]">
      <div className="p-6 flex flex-col border-b">
        <h2 className="font-bold text-lg text-foreground line-clamp-1">
          {course?.title || "Course Curriculum"}
        </h2>
        <div className="mt-4">
          <CourseProgress variant="success" value={course?.progress || 0} />
        </div>
      </div>

      <Accordion
        defaultValue={modulesList.map((_, i) => `item-${i}`)}
        type="multiple"
        className="w-full px-4 py-2 flex-1"
      >
        {modulesList.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground">
            No modules available for this course.
          </div>
        ) : (
          modulesList.map((moduleItem, mIdx) => (
            <AccordionItem key={moduleItem.id || mIdx} className="border-b" value={`item-${mIdx}`}>
              <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
                {moduleItem.title}
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col w-full gap-1 pt-1">
                  {(moduleItem.lessons || []).map((lesson) => {
                    const isActive = String(lessonId) === String(lesson.id);
                    return (
                      <Link
                        key={lesson.id}
                        to={`/player/${courseSlug}/${lesson.id}`}
                        onClick={() => onLessonClick?.(lesson.id)}
                        className={cn(
                          "flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-all",
                          isActive
                            ? "bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {lesson.completed ? (
                            <CheckCircle size={15} className="text-emerald-600 shrink-0" />
                          ) : lesson.isFree ? (
                            <PlayCircle size={15} className="text-sky-600 shrink-0" />
                          ) : (
                            <Lock size={15} className="text-muted-foreground shrink-0" />
                          )}
                          <span className="line-clamp-1">{lesson.title}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))
        )}
      </Accordion>

      <div className="mt-auto p-4 border-t flex flex-col gap-2">
        <Button asChild variant="outline" className="w-full text-xs gap-2 border-sky-500/40 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950">
          <Link to="/messages">
            <MessageSquare className="h-4 w-4" /> Course Community Chat
          </Link>
        </Button>
        <ReviewModal courseId={course?.id} />
        {(course?.progress || 0) >= 100 && course?.id ? (
          <CertificateGenerator courseId={course.id} courseTitle={course.title} />
        ) : null}
      </div>
    </div>
  );
};

export default CourseSidebar;
