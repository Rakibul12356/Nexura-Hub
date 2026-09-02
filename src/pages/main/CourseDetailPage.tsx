import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/formatPrice";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  PlayCircle,
  Video,
  Clock,
  BookOpen,
  Star,
  Users,
  Award,
  Share2,
  ShieldCheck,
  FileText,
  Lock,
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { courses } = useAppSelector((state) => state.courses);

  const course =
    courses.find((c) => String(c.id) === String(courseId)) || courses[0];

  const handleEnroll = () => {
    toast.success("Enrolled successfully!");
    navigate("/enroll-success");
  };

  return (
    <div className="pb-16">
      {/* Course Hero Banner */}
      <div className="bg-slate-900 text-white py-12 lg:py-16 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-sky-500 hover:bg-sky-600 text-white font-medium">
                  {course.category}
                </Badge>
                <span className="text-xs text-slate-400">
                  Last updated: September 2024
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-poppins">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {course.subtitle ||
                  "Master modern full-stack web development with deep hands-on project experience, architectural patterns, and industry best practices."}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 pt-2">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span className="font-semibold text-white">4.9</span>
                  <span className="text-slate-400">(1,250 reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>3,400+ students</span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src={
                      course.instructor?.avatar ||
                      "https://avatars.githubusercontent.com/u/3633137?v=4"
                    }
                    alt={course.instructor?.name || "Instructor"}
                    className="h-6 w-6 rounded-full border border-slate-700 object-cover"
                  />
                  <span>Created by {course.instructor?.name || "Tapas Adhikary"}</span>
                </div>
              </div>
            </div>

            {/* Video preview / hero image */}
            <div className="lg:col-span-4">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800 group">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Link
                  to={`/player/${course.slug || "reactive-accelerator"}/1`}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors"
                >
                  <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="h-8 w-8 ml-0.5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details and Sidebar */}
      <div className="container mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main content tabs */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 font-semibold text-sm"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="curriculum"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 font-semibold text-sm"
                >
                  Curriculum
                </TabsTrigger>
                <TabsTrigger
                  value="instructor"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 font-semibold text-sm"
                >
                  Instructor
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 font-semibold text-sm"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="pt-6 space-y-8">
                {/* What you'll learn */}
                <div className="p-6 border rounded-xl bg-card shadow-sm">
                  <h3 className="text-xl font-bold mb-4">What you'll learn</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "Build production-grade web applications with React & TypeScript",
                      "Master state management using modern Redux Toolkit & RTK Query",
                      "Design aesthetic, responsive user interfaces using Tailwind CSS",
                      "Structure enterprise-level codebases with best architectural practices",
                      "Integrate secure authentication and REST APIs using Axios & Cookies",
                      "Implement interactive learning modules, drag & drop, and quiz sets",
                    ].map((point, index) => (
                      <div key={index} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground leading-relaxed">
                          {point}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Course Description */}
                <div>
                  <h3 className="text-xl font-bold mb-3">Course Description</h3>
                  <div className="prose dark:prose-invert max-w-none text-muted-foreground text-sm leading-relaxed space-y-3">
                    <p>
                      Welcome to the ultimate learning experience designed to take you from foundational concepts to advanced production techniques. This course breaks down complex topics into digestible, interactive modules with practical real-world exercises.
                    </p>
                    <p>
                      Whether you're looking to switch careers, level up your frontend engineering toolkit, or architect scalable client-side systems, this course delivers comprehensive depth with zero fluff.
                    </p>
                  </div>
                </div>
              </TabsContent>

              {/* Curriculum Tab */}
              <TabsContent value="curriculum" className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Course Curriculum</h3>
                  <span className="text-sm text-muted-foreground">
                    2 Modules • 5 Lessons • 1h 40m Total Length
                  </span>
                </div>

                <Accordion
                  type="multiple"
                  defaultValue={["mod-1", "mod-2"]}
                  className="w-full space-y-3"
                >
                  <AccordionItem
                    value="mod-1"
                    className="border rounded-xl px-4 bg-card"
                  >
                    <AccordionTrigger className="font-semibold text-base py-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-sky-600" />
                        <span>Module 1: Introduction to React Ecosystem</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="space-y-2 border-t pt-3">
                        {[
                          { title: "Course Introduction & Setup", duration: "12m", isFree: true },
                          { title: "What is React & Virtual DOM?", duration: "18m", isFree: true },
                          { title: "Components, Props and State Management", duration: "25m", isFree: false },
                        ].map((lesson, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                          >
                            <div className="flex items-center gap-3">
                              {lesson.isFree ? (
                                <PlayCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                              ) : (
                                <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                              )}
                              <span className="font-medium text-foreground">
                                {lesson.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              {lesson.isFree && (
                                <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300">
                                  Preview
                                </Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {lesson.duration}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="mod-2"
                    className="border rounded-xl px-4 bg-card"
                  >
                    <AccordionTrigger className="font-semibold text-base py-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-4 w-4 text-sky-600" />
                        <span>Module 2: State Management with Redux Toolkit</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="space-y-2 border-t pt-3">
                        {[
                          { title: "Why Redux in Large Enterprise Apps?", duration: "15m", isFree: false },
                          { title: "Creating Slices, Actions, and Selectors", duration: "30m", isFree: false },
                        ].map((lesson, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="font-medium text-foreground">
                                {lesson.title}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {lesson.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              {/* Instructor Tab */}
              <TabsContent value="instructor" className="pt-6 space-y-6">
                <div className="p-6 border rounded-xl bg-card shadow-sm">
                  <div className="flex items-start gap-4 flex-col sm:flex-row">
                    <img
                      src="https://avatars.githubusercontent.com/u/3633137?v=4"
                      alt="Tapas Adhikary"
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 shadow"
                    />
                    <div>
                      <h4 className="text-xl font-bold">Tapas Adhikary</h4>
                      <p className="text-sm text-muted-foreground">
                        Senior Software Engineer & Tech Educator
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 flex-wrap">
                        <span className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="h-3.5 w-3.5 fill-amber-500" /> 4.9 Instructor Rating
                        </span>
                        <span>• 2,400+ Students</span>
                        <span>• 12 Courses</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                    Tapas is a veteran full-stack software engineer and open-source enthusiast with over a decade of industry experience designing robust, scalable web products.
                  </p>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="pt-6 space-y-6">
                <div className="flex items-center gap-6 p-6 border rounded-xl bg-card">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-foreground">4.9</div>
                    <div className="flex items-center gap-1 text-amber-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Course Rating</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { name: "Sadia Rahman", rating: 5, date: "2 weeks ago", text: "One of the best React & Redux courses I have ever taken! Everything is explained clearly with great code examples." },
                    { name: "Anisur Khan", rating: 5, date: "1 month ago", text: "The module breakdown and project-oriented exercises made understanding complex concepts very straightforward." },
                  ].map((rev, index) => (
                    <div key={index} className="p-4 border rounded-xl bg-card space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{rev.name}</span>
                        <span className="text-xs text-muted-foreground">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{rev.text}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sticky Enrollment Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 border rounded-xl bg-card p-6 shadow-lg space-y-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-foreground">
                    {formatPrice(course.price)}
                  </span>
                  {course.discountPrice && (
                    <span className="text-base text-muted-foreground line-through">
                      {formatPrice(course.price + 20)}
                    </span>
                  )}
                  <Badge variant="success" className="ml-auto">
                    30% OFF
                  </Badge>
                </div>
                <p className="text-xs text-destructive mt-1 font-medium">
                  Special discount price valid for limited time!
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleEnroll}
                  size="lg"
                  className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold text-base shadow"
                >
                  Enroll Now
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Link to={`/player/${course.slug || "reactive-accelerator"}/1`}>
                    Preview Course
                  </Link>
                </Button>
              </div>

              <div className="space-y-3 pt-4 border-t text-sm">
                <h4 className="font-semibold text-foreground">This course includes:</h4>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-sky-600" />
                    <span>10 hours on-demand HD video</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-sky-600" />
                    <span>15 downloadable source code resources</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-sky-600" />
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-sky-600" />
                    <span>Certificate of completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-sky-600" />
                    <span>30-Day Money-Back Guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
