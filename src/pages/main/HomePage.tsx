import React from "react";
import { Link } from "react-router-dom";
import { CourseProgress } from "@/components/common/course-progress";
import { SectionTitle } from "@/components/common/section-title";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";
import { BookOpen, ArrowRight, ArrowRightIcon, Sparkles } from "lucide-react";
import { useAppSelector } from "@/store/hooks";

export const HomePage: React.FC = () => {
  const { categories, courses } = useAppSelector((state) => state.courses);

  return (
    <>
      {/* Hero Section */}
      <section className="space-y-6 pb-12 pt-10 md:pb-16 md:pt-14 lg:py-32 grainy relative overflow-hidden">
        <div className="container flex max-w-[64rem] flex-col items-center gap-6 text-center relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#38bdf8] to-[#6366f1] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            />
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-muted/80 px-4 py-1.5 text-sm font-medium border shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-sky-500" /> Hey, Welcome to Nexura Hub
          </span>
          <h1 className="font-heading text-4xl font-extrabold sm:text-5xl md:text-6xl lg:text-7xl tracking-tight">
            Learn Today,{" "}
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Lead Tomorrow.
            </span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            “You don’t understand anything until you learn it more than one way.”
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center pt-2">
            <Link to="/courses" className={cn(buttonVariants({ size: "lg" }), "shadow-md")}>
              Explore Now
            </Link>
            <Link
              to="/register?role=instructor"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Become An Instructor
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="container space-y-6 py-12 md:py-16 lg:py-20">
        <div className="flex items-center justify-between">
          <div>
            <SectionTitle>Top Categories</SectionTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Explore thousands of in-demand skills
            </p>
          </div>

          <Link
            to="/courses"
            className="text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1"
          >
            Browse All <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="mx-auto grid justify-center gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              to={`/courses?category=${category.value}`}
              key={category.id}
              className="group relative overflow-hidden rounded-xl border bg-card text-card-foreground p-3 hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              <div className="flex flex-col gap-4 items-center justify-between rounded-lg p-5">
                <div className="w-16 h-16 rounded-full overflow-hidden border p-1 bg-muted/40 group-hover:scale-110 transition-transform">
                  <img
                    src={category.thumbnail}
                    alt={category.title}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <h3 className="font-semibold text-center text-sm md:text-base group-hover:text-sky-600 transition-colors">
                  {category.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="container space-y-6 py-12 md:py-16 lg:py-20 border-t">
        <div className="flex items-center justify-between">
          <div>
            <SectionTitle>Featured Courses</SectionTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Hand-picked best selling courses by top industry leaders
            </p>
          </div>

          <Link
            to="/courses"
            className="text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1"
          >
            Browse All <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <Link key={course.id} to={`/courses/${course.id}`}>
              <div className="group hover:shadow-lg transition-all overflow-hidden border bg-card text-card-foreground rounded-xl p-3 h-full flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 duration-300">
                <div>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-primary/90 text-primary-foreground text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col pt-3">
                    <div className="text-base font-semibold group-hover:text-sky-600 line-clamp-1 transition-colors">
                      {course.title}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {course.subtitle || course.description}
                    </p>

                    <div className="my-3 flex items-center gap-x-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-x-1">
                        <BookOpen className="w-3.5 h-3.5 text-sky-600" />
                        <span>{course.totalChapters || 4} Chapters</span>
                      </div>
                    </div>

                    <CourseProgress
                      size="sm"
                      value={course.progress || 80}
                      variant={course.progress === 100 ? "success" : undefined}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div>
                    <span className="text-base font-bold text-foreground">
                      {formatPrice(course.price)}
                    </span>
                    {course.discountPrice && (
                      <span className="text-xs text-muted-foreground line-through ml-2">
                        {formatPrice(course.price + 20)}
                      </span>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    className="text-xs text-sky-600 hover:text-sky-700 h-8 gap-1 font-medium"
                  >
                    Enroll
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default HomePage;
