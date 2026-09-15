import apiClient from "@/api/axiosInstance";
import { Course, Category, EnrolledCourse } from "@/types/course";

function safeArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.courses)) return data.courses;
  if (data && Array.isArray(data.categories)) return data.categories;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.result)) return data.result;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

export const courseService = {
  async getCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get("/courses");
      return safeArray(response.data);
    } catch {
      return [];
    }
  },

  async getCourseById(id: string | number): Promise<Course | undefined> {
    try {
      const response = await apiClient.get(`/courses/${id}`);
      return response.data?.course || response.data?.data || response.data;
    } catch {
      return undefined;
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get("/categories");
      return safeArray(response.data);
    } catch {
      return [];
    }
  },

  async getEnrolledCourses(): Promise<EnrolledCourse[]> {
    try {
      const response = await apiClient.get("/user/enrolled-courses");
      return safeArray(response.data);
    } catch {
      return [];
    }
  },
};
