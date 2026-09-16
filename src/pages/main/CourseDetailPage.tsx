import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PaymentCheckoutModal from "@/components/common/PaymentCheckoutModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/formatPrice";
import {
  CheckCircle2,
  PlayCircle,
  Video,
  Clock,
  BookOpen,
  Star,
  Users,
  Award,
  ShieldCheck,
  FileText,
  Lock,
} from "lucide-react";
import {
  useCourseDetailQuery,
  useCourseReviewsQuery,
  useEnrollmentStatusQuery,
} from "@/hooks/queries/useCoursesQuery";
import { useAuthStore } from "@/store/useAuthStore";
import { useEnrollCourseMutation } from "@/hooks/queries/useCoursesQuery";

export const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: course, isLoading } = useCourseDetailQuery(courseId || "");
  const { data: reviews = [] } = useCourseReviewsQuery(courseId || "");
  const { data: enrollment } = useEnrollmentStatusQuery(courseId || "", isAuthenticated);
  const enrollFree = useEnrollCourseMutation();

  if (isLoading && !course) {
    return (
      <div className="container py-20 text-center text-muted-foreground">Loading course details...</div>
    );
  }

  if (!course) {
    return (
      <div className="container py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Course Not Found</h2>
        <p className="text-muted-foreground">The requested course is currently unavailable.</p>
        <Button onClick={() => navigate("/courses")} variant="outline" className="mt-2">
          Browse Available Courses
        </Button>
      </div>
    );
  }

  const modules = course.modules || [];
  const lessonCount = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const firstLessonId = modules[0]?.lessons?.[0]?.id;
  const playerPath = `/player/${course.slug || course.id}/${firstLessonId || "1"}`;
  const isEnrolled = Boolean(enrollment?.isEnrolled);
  const avgRating =
    reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : course.instructor?.rating || 0;
  const learningPoints =
    course.learningPoints?.length
      ? course.learningPoints
      : [
          "Build production-grade web applications",
          "Master modern frontend architecture",
          "Design responsive user interfaces",
          "Integrate secure authentication and APIs",
        ];

  const handleFreeEnroll = () => {
    enrollFree.mutate(course.id, {
      onSuccess: () => navigate("/enroll-success"),
    });
  };

  return (
    <div className="pb-16">
      <div className="bg-slate-900 text-white py-12 lg:py-16 relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-sky-500 hover:bg-sky-600 text-white font-medium">{course.category}</Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                {course.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {course.subtitle || course.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 pt-2">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" />
                  <span className="font-semibold text-white">{avgRating.toFixed(1)}</span>
                  <span className="text-slate-400">({reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span>{course.instructor?.studentsCount || 0}+ students</span>
                </div>
                {course.instructor && (
                  <Link to={`/inst-profile/${course.instructor.id}`} className="flex items-center gap-2 hover:underline">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="h-6 w-6 rounded-full border border-slate-700 object-cover"
                    />
                    <span>Created by {course.instructor.name}</span>
                  </Link>
                )}
              </div>
            </div>
            <div className="lg:col-span-4">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-800 group">
                <img src={course.thumbnail || course.image} alt={course.title} className="w-full h-full object-cover" />
                <Link
                  to={playerPath}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/30 transition-colors"
                >
                  <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground shadow-lg">
                    <PlayCircle className="h-8 w-8 ml-0.5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                {["overview", "curriculum", "instructor", "reviews"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-3 font-semibold text-sm capitalize"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="pt-6 space-y-8">
                <div className="p-6 border rounded-xl bg-card shadow-sm">
                  <h3 className="text-xl font-bold mb-4">What you'll learn</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {learningPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Course Description</h3>
                  <div className="prose dark:prose-invert max-w-none text-muted-foreground text-sm leading-relaxed">
                    <p>{course.description || "Course curriculum and hands-on projects are listed in the tabs."}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Course Curriculum</h3>
                  <span className="text-sm text-muted-foreground">
                    {modules.length} Modules • {lessonCount} Lessons
                  </span>
                </div>
                <Accordion type="multiple" defaultValue={modules.map((m) => String(m.id))} className="w-full space-y-3">
                  {modules.map((mod) => (
                    <AccordionItem key={mod.id} value={String(mod.id)} className="border rounded-xl px-4 bg-card">
                      <AccordionTrigger className="font-semibold text-base py-4 hover:no-underline">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-4 w-4 text-sky-600" />
                          <span>{mod.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <div className="space-y-2 border-t pt-3">
                          {(mod.lessons || []).map((lesson) => (
                            <div
                              key={lesson.id}
                              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-sm"
                            >
                              <div className="flex items-center gap-3">
                                {lesson.isFree ? (
                                  <PlayCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                                ) : (
                                  <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                                )}
                                <span className="font-medium text-foreground">{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                {lesson.isFree && (
                                  <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300">
                                    Preview
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="instructor" className="pt-6 space-y-6">
                <div className="p-6 border rounded-xl bg-card shadow-sm">
                  <div className="flex items-start gap-4 flex-col sm:flex-row">
                    <img
                      src={course.instructor?.avatar}
                      alt={course.instructor?.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-primary/20 shadow"
                    />
                    <div>
                      <Link to={`/inst-profile/${course.instructor?.id}`} className="text-xl font-bold hover:underline">
                        {course.instructor?.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{course.instructor?.designation}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 flex-wrap">
                        <span className="flex items-center gap-1 text-amber-500 font-semibold">
                          <Star className="h-3.5 w-3.5 fill-amber-500" /> {course.instructor?.rating || 0} Rating
                        </span>
                        <span>• {course.instructor?.studentsCount || 0} Students</span>
                        <span>• {course.instructor?.coursesCount || 0} Courses</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{course.instructor?.bio}</p>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="pt-6 space-y-6">
                <div className="flex items-center gap-6 p-6 border rounded-xl bg-card">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-foreground">{avgRating.toFixed(1)}</div>
                    <div className="flex items-center gap-1 text-amber-400 mt-1 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{reviews.length} reviews</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {(reviews.length ? reviews : course.reviews || []).map((rev) => (
                    <div key={rev.id} className="p-4 border rounded-xl bg-card space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{rev.studentName}</span>
                        <span className="text-xs text-muted-foreground">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 border rounded-xl bg-card p-6 shadow-lg space-y-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-foreground">{formatPrice(course.price)}</span>
                  {course.discountPrice != null && course.discountPrice !== course.price && (
                    <span className="text-base text-muted-foreground line-through">
                      {formatPrice(course.discountPrice)}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {isEnrolled ? (
                  <Button asChild size="lg" className="w-full bg-sky-600 hover:bg-sky-700">
                    <Link to={playerPath}>Continue Learning</Link>
                  </Button>
                ) : course.price === 0 ? (
                  <Button
                    size="lg"
                    className="w-full bg-sky-600 hover:bg-sky-700"
                    onClick={handleFreeEnroll}
                    disabled={enrollFree.isPending}
                  >
                    Enroll for Free
                  </Button>
                ) : (
                  <PaymentCheckoutModal
                    courseId={course.id}
                    courseTitle={course.title}
                    originalPrice={course.price}
                    onSuccess={() => navigate("/enroll-success")}
                  />
                )}
                <Button asChild variant="outline" size="lg" className="w-full">
                  <Link to={playerPath}>Preview Course</Link>
                </Button>
              </div>

              <div className="space-y-3 pt-4 border-t text-sm">
                <h4 className="font-semibold text-foreground">This course includes:</h4>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-sky-600" />
                    <span>{lessonCount} on-demand lessons</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-sky-600" />
                    <span>Downloadable lesson resources</span>
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
                    <span>Dummy checkout — funds credit admin wallet</span>
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
