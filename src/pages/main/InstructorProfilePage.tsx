import React from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { CourseCard } from "@/components/common/CourseCard";
import { SectionTitle } from "@/components/common/section-title";
import {
  Presentation,
  MessageSquare,
  Star,
  UsersRound,
} from "lucide-react";
import {
  useInstructorProfileQuery,
  useInstructorPublicCoursesQuery,
  useFeaturedCoursesQuery,
} from "@/hooks/queries/useCoursesQuery";

export const InstructorProfilePage: React.FC = () => {
  const { instructorId } = useParams();
  const [params] = useSearchParams();
  const { data: featured = [] } = useFeaturedCoursesQuery();
  const resolvedId = instructorId || params.get("id") || featured[0]?.instructor?.id;

  const { data: profile, isLoading } = useInstructorProfileQuery(resolvedId);
  const { data: courses = [] } = useInstructorPublicCoursesQuery(resolvedId);

  if (!resolvedId && !isLoading) {
    return (
      <section className="container py-16 text-center text-muted-foreground">
        Instructor profile is not available yet.
      </section>
    );
  }

  const name = profile?.name || "Instructor";

  return (
    <section id="instructor-profile" className="space-y-6 py-8 lg:py-12 container">
      <div className="grid grid-cols-12 lg:gap-x-8 gap-y-8">
        <div className="col-span-12 lg:col-span-4">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <div className="mb-6">
              <div className="w-32 h-32 rounded-full mb-4 mx-auto overflow-hidden border-4 border-primary/10 shadow">
                <img
                  src={profile?.avatar || "/assets/images/profile.jpg"}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-bold text-center">{name}</h3>
                <div className="text-muted-foreground font-medium mb-6 text-sm text-center">
                  {profile?.designation || "Educator"}
                </div>
                <ul className="items-center gap-3 text-sm text-muted-foreground font-medium grid grid-cols-2 gap-y-3">
                  <li className="flex items-center space-x-2">
                    <Presentation className="text-sky-600 w-4 h-4" />
                    <span>{profile?.coursesCount ?? courses.length} Courses</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <UsersRound className="text-sky-600 w-4 h-4" />
                    <span>{profile?.studentsCount ?? 0}+ Students</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <MessageSquare className="text-sky-600 w-4 h-4" />
                    <span>{profile?.reviewsCount ?? 0} Reviews</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Star className="text-amber-500 fill-amber-500 w-4 h-4" />
                    <span>{profile?.rating ?? 0} Rating</span>
                  </li>
                </ul>
              </div>
            </div>
            {profile?.bio && (
              <p className="text-muted-foreground text-xs leading-relaxed border-t pt-4">{profile.bio}</p>
            )}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <SectionTitle className="mb-6">Courses by {name.split(" ")[0]}</SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorProfilePage;
