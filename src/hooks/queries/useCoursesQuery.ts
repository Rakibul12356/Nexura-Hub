import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { courseApi, enrollmentApi, categoryApi } from "@/services/apiService";
import { Course } from "@/types/course";
import { toast } from "react-toastify";

export const useCoursesQuery = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => courseApi.getCourses(params),
  });
};

export const useCourseDetailQuery = (id: string | number) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => courseApi.getCourseById(id),
    enabled: Boolean(id),
  });
};

export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAll(),
  });
};

export const useMyEnrolledCoursesQuery = () => {
  return useQuery({
    queryKey: ["enrolled-courses"],
    queryFn: () => enrollmentApi.getMyEnrolledCourses(),
  });
};

export const useEnrollCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string | number) => enrollmentApi.enrollInCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolled-courses"] });
      toast.success("Successfully enrolled in course!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Enrollment failed");
    },
  });
};

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Course>) => courseApi.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course created successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create course");
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
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
      toast.success("Course updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update course");
    },
  });
};

export const useDeleteCourseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => courseApi.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete course");
    },
  });
};
