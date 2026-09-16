import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { courseApi, enrollmentApi, categoryApi } from "@/services/apiService";
import { courseService } from "@/services/courseService";
import { Course } from "@/types/course";
import { getApiError } from "@/lib/api";
import { toast } from "react-toastify";

export const useCoursesQuery = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => courseApi.getCourses(params),
  });
};

export const useFeaturedCoursesQuery = () => {
  return useQuery({
    queryKey: ["courses", "featured"],
    queryFn: () =>
      courseApi.getCourses({ isFeatured: true, isPublished: true, limit: 8 }),
  });
};

export const useCourseDetailQuery = (id: string | number) => {
  return useQuery({
    queryKey: ["course", String(id)],
    queryFn: () => courseApi.getCourseById(id),
    enabled: Boolean(id),
  });
};

export const useLessonQuery = (id?: string | number) => {
  return useQuery({
    queryKey: ["lesson", String(id)],
    queryFn: () => courseService.getLesson(id as string | number),
    enabled: Boolean(id),
  });
};

export const useReorderModulesMutation = (courseId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (moduleIds: (string | number)[]) => courseService.reorderModules(courseId, moduleIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", String(courseId)] });
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to reorder modules")),
  });
};

export const useAttachResourceMutation = (lessonId: string | number, moduleId?: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof courseService.attachResource>[1]) =>
      courseService.attachResource(lessonId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", String(lessonId)] });
      if (moduleId) queryClient.invalidateQueries({ queryKey: ["module", String(moduleId)] });
      toast.success("Resource added successfully!");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to attach resource")),
  });
};

export const useDeleteResourceMutation = (lessonId: string | number, moduleId?: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (resourceId: string | number) => courseService.deleteResource(lessonId, resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson", String(lessonId)] });
      if (moduleId) queryClient.invalidateQueries({ queryKey: ["module", String(moduleId)] });
      toast.success("Resource removed");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to delete resource")),
  });
};

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAll(),
  });
};

export const useMyEnrolledCoursesQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: () => enrollmentApi.getMyEnrolledCourses(),
    enabled,
  });
};

export const useEnrollmentStatusQuery = (courseId: string | number, enabled = true) => {
  return useQuery({
    queryKey: ["enrollment-status", String(courseId)],
    queryFn: () => enrollmentApi.checkEnrollmentStatus(courseId),
    enabled: Boolean(courseId) && enabled,
  });
};

export const useCourseReviewsQuery = (courseId: string | number) => {
  return useQuery({
    queryKey: ["course-reviews", String(courseId)],
    queryFn: () => courseService.getReviews(courseId),
    enabled: Boolean(courseId),
  });
};

export const useInstructorProfileQuery = (id?: string | number) => {
  return useQuery({
    queryKey: ["instructor", String(id)],
    queryFn: () => courseService.getInstructor(id as string | number),
    enabled: Boolean(id),
  });
};

export const useInstructorPublicCoursesQuery = (id?: string | number) => {
  return useQuery({
    queryKey: ["instructor-courses", String(id)],
    queryFn: () => courseService.getInstructorCourses(id as string | number),
    enabled: Boolean(id),
  });
};

export const useEnrollCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string | number) => enrollmentApi.enrollInCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolled-courses"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment-status"] });
      toast.success("Successfully enrolled in course!");
    },
    onError: (error: unknown) => {
      toast.error(getApiError(error, "Enrollment failed"));
    },
  });
};

export const useCreateReviewMutation = (courseId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { rating: number; comment: string }) =>
      courseService.createReview(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-reviews", String(courseId)] });
      queryClient.invalidateQueries({ queryKey: ["course", String(courseId)] });
      toast.success("Thank you for your feedback! Review submitted.");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to submit review")),
  });
};

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Course>) => courseApi.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "instructor-courses"] });
      toast.success("Course created successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getApiError(error, "Failed to create course"));
    },
  });
};

export const useUpdateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Course> }) =>
      courseApi.updateCourse(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", String(variables.id)] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "instructor-courses"] });
      toast.success("Course updated successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getApiError(error, "Failed to update course"));
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => courseApi.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "instructor-courses"] });
      toast.success("Course deleted successfully!");
    },
    onError: (error: unknown) => {
      toast.error(getApiError(error, "Failed to delete course"));
    },
  });
};

export const usePublishCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, publish }: { id: string | number; publish: boolean }) =>
      publish ? courseApi.publishCourse(id) : courseApi.unpublishCourse(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", String(variables.id)] });
      toast.success(variables.publish ? "Course published!" : "Course unpublished");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to update publish state")),
  });
};
