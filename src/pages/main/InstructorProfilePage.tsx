import React from "react";
import { Link } from "react-router-dom";
import { CourseProgress } from "@/components/common/course-progress";
import { SectionTitle } from "@/components/common/section-title";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import {
  ArrowRight,
  BookOpen,
  MessageSquare,
  Presentation,
  Star,
  UsersRound,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export const InstructorProfilePage: React.FC = () => {
  const { courses } = useAppSelector((state) => state.courses);

  return (
    <section id="instructor-profile" className="space-y-6 py-8 lg:py-12 container">
      <div className="grid grid-cols-12 lg:gap-x-8 gap-y-8">
        {/* Instructor Info Sidebar */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
              <div className="w-32 h-32 rounded-full mb-4 mx-auto overflow-hidden border-4 border-primary/10 shadow">
                <img
                  src="https://avatars.githubusercontent.com/u/3633137?v=4"
                  alt="Tapas Adhikary"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-center">
                  Tapas Adhikary
                </h3>
                <div className="text-muted-foreground font-medium mb-6 text-sm text-center">
                  Senior Software Engineer & Educator
                </div>
                <ul className="items-center gap-3 text-sm text-muted-foreground font-medium grid grid-cols-2 gap-y-3">
                  <li className="flex items-center space-x-2">
                    <Presentation className="text-sky-600 w-4 h-4" />
                    <span>10+ Courses</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <UsersRound className="text-sky-600 w-4 h-4" />
                    <span>2k+ Students</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <MessageSquare className="text-sky-600 w-4 h-4" />
                    <span>1,500+ Reviews</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="text-amber-500 fill-amber-500 w-4 h-4" />
                    <span>4.9 Rating</span>
                  </li>
                </ul>
              </div>
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed border-t pt-4">
              Tapas is a passionate software engineer, content creator, and mentor. Having mentored thousands of developers globally, he specializes in building modern web applications with React, TypeScript, and state architectures.
            </p>
          </div>
        </div>

        {/* Instructor's Courses */}
        <div className="col-span-12 lg:col-span-8">
          <div>
            <SectionTitle className="mb-6">Courses by Tapas</SectionTitle>
            <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`}>
                  <div className="group hover:shadow-lg transition-all overflow-hidden border bg-card text-card-foreground rounded-xl p-3 h-full flex flex-col justify-between hover:border-primary/40 duration-300">
                    <div>
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex flex-col pt-3">
                        <div className="text-base font-semibold group-hover:text-sky-600 line-clamp-1 transition-colors">
                          {course.title}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {course.category}
                        </p>
                        <div className="my-3 flex items-center gap-x-2 text-xs text-muted-foreground">
                          <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                          <span>{course.totalChapters || 4} Chapters</span>
                        </div>

                        <CourseProgress
                          size="sm"
                          value={course.progress || 80}
                          variant={course.progress === 100 ? "success" : undefined}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      <span className="text-sm font-bold text-foreground">
                        {formatPrice(course.price)}
                      </span>

                      <Button
                        variant="ghost"
                        className="text-xs text-sky-600 hover:text-sky-700 h-7 gap-1 font-medium"
                      >
                        Enroll
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorProfilePage;
