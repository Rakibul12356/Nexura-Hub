import React from "react";
import { Link } from "react-router-dom";
import { SectionTitle } from "@/components/common/section-title";
import { CourseCard } from "@/components/common/CourseCard";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, Sparkles } from "lucide-react";
import { useCategoriesQuery, useFeaturedCoursesQuery } from "@/hooks/queries/useCoursesQuery";

export const HomePage: React.FC = () => {
  const { data: categories = [] } = useCategoriesQuery();
  const { data: courses = [], isLoading } = useFeaturedCoursesQuery();

  return (
    <>
      <section className="space-y-6 pb-12 pt-10 md:pb-16 md:pt-14 lg:py-32 grainy relative overflow-hidden">
        <div className="container flex max-w-[64rem] flex-col items-center gap-6 text-center relative isolate">
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

      <section id="categories" className="container space-y-6 py-12 md:py-16 lg:py-20">
        <div className="flex items-center justify-between gap-4">
          <div>
            <SectionTitle>Top Categories</SectionTitle>
            <p className="text-sm text-muted-foreground mt-1">Explore thousands of in-demand skills</p>
          </div>
          <Link
            to="/courses"
            className="text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            Browse All <ArrowRightIcon className="h-4 w-4 shrink-0" />
          </Link>
        </div>

        <div className="mx-auto grid justify-center gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              to={`/courses?category=${category.value || category.title}`}
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

      <section id="courses" className="container space-y-6 py-12 md:py-16 lg:py-20 border-t">
        <div className="flex items-center justify-between gap-4">
          <div>
            <SectionTitle>Featured Courses</SectionTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Hand-picked best selling courses by top industry leaders
            </p>
          </div>
          <Link
            to="/courses"
            className="text-sm font-medium text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            Browse All <ArrowRightIcon className="h-4 w-4 shrink-0" />
          </Link>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-10">Loading featured courses…</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default HomePage;
