import apiClient from "@/api/axiosInstance";
import { Course, Category, EnrolledCourse } from "@/types/course";
import { initialCourses, initialCategories, initialEnrolledCourses } from "@/store/slices/courseSlice";

export const courseService = {
  async getCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get("/courses");
      return response.data;
    } catch {
      return initialCourses;
    }
  },

  async getCourseById(id: string | number): Promise<Course | undefined> {
    try {
      const response = await apiClient.get(`/courses/${id}`);
      return response.data;
    } catch {
      return initialCourses.find((c) => String(c.id) === String(id)) || initialCourses[0];
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get("/categories");
      return response.data;
    } catch {
      return initialCategories;
    }
  },

  async getEnrolledCourses(): Promise<EnrolledCourse[]> {
    try {
      const response = await apiClient.get("/user/enrolled-courses");
      return response.data;
    } catch {
      return initialEnrolledCourses;
    }
  },
};
