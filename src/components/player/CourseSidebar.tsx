import React from "react";
import { Link, useParams } from "react-router-dom";
import { CourseProgress } from "@/components/common/course-progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, PlayCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReviewModal } from "./ReviewModal";
import { useAppSelector } from "@/store/hooks";

interface CourseSidebarProps {
  onLessonClick?: (lessonId: string | number) => void;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({ onLessonClick }) => {
  const { courseSlug = "reactive-accelerator", lessonId = "1" } = useParams();
  const { courses } = useAppSelector((state) => state.courses);
  const course = courses[0];

  return (
    <div className="h-full flex flex-col overflow-y-auto bg-card max-h-[calc(100vh-140px)]">
      <div className="p-6 flex flex-col border-b">
        <h2 className="font-bold text-lg text-foreground line-clamp-1">
          {course?.title || "Reactive Accelerator"}
        </h2>
        <div className="mt-4">
          <CourseProgress variant="success" value={80} />
        </div>
      </div>

      <Accordion
        defaultValue={["item-1", "item-2"]}
        type="multiple"
        className="w-full px-4 py-2"
      >
        <AccordionItem className="border-b" value="item-1">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
            Module 1: Getting Started
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col w-full gap-1 pt-1">
              {[
                { id: "1", title: "Introduction", completed: true, isFree: true },
                { id: "2", title: "What is React & JSX?", completed: true, isFree: true },
                { id: "3", title: "Components and State", completed: false, isFree: false },
              ].map((lesson) => {
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

        <AccordionItem className="border-b" value="item-2">
          <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3">
            Module 2: State Management
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col w-full gap-1 pt-1">
              {[
                { id: "4", title: "Redux Architecture", completed: false, isFree: false },
                { id: "5", title: "Async Thunks & RTK Query", completed: false, isFree: false },
              ].map((lesson) => {
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
                      <Lock size={15} className="text-muted-foreground shrink-0" />
                      <span className="line-clamp-1">{lesson.title}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-auto p-4 border-t flex justify-center">
        <ReviewModal />
      </div>
    </div>
  );
};

export default CourseSidebar;
