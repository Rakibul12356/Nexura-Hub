import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/services/apiService";

export const useDashboardStatsQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardApi.getStats(),
  });
};

export const useInstructorCoursesQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "instructor-courses"],
    queryFn: () => dashboardApi.getInstructorCourses(),
  });
};

export const useLiveClassesQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "live-classes"],
    queryFn: () => dashboardApi.getLiveClasses(),
  });
};

export const useQuizSetsQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "quiz-sets"],
    queryFn: () => dashboardApi.getQuizSets(),
  });
};

export const useStudentEnrollmentsQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "student-enrollments"],
    queryFn: () => dashboardApi.getEnrollments(),
  });
};
