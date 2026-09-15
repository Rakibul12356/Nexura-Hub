import apiClient from "@/api/axiosInstance";
import { DashboardStats, LiveClass, StudentEnrollment } from "@/types/dashboard";
import { Course, QuizSet } from "@/types/course";
function safeArray<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.courses)) return data.courses;
  if (data && Array.isArray(data.lives)) return data.lives;
  if (data && Array.isArray(data.quizSets)) return data.quizSets;
  if (data && Array.isArray(data.enrollments)) return data.enrollments;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.result)) return data.result;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get("/dashboard/stats");
      const payload = response.data?.data || response.data;
      if (payload && typeof payload === "object" && !Array.isArray(payload)) {
        return payload;
      }
      return {
        totalCourses: 0,
        totalEnrollments: 0,
        totalRevenue: 0,
        totalStudents: 0,
      };
    } catch {
      return {
        totalCourses: 0,
        totalEnrollments: 0,
        totalRevenue: 0,
        totalStudents: 0,
      };
    }
  },

  async getInstructorCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get("/dashboard/courses");
      return safeArray(response.data);
    } catch {
      return [];
    }
  },

  async getLiveClasses(): Promise<LiveClass[]> {
    try {
      const response = await apiClient.get("/dashboard/lives");
      return safeArray(response.data);
    } catch {
      return [];
    }
  },

  async getQuizSets(): Promise<QuizSet[]> {
    try {
      const response = await apiClient.get("/dashboard/quiz-sets");
      return safeArray(response.data);
    } catch {
      return [];
    }
  },

  async getEnrollments(): Promise<StudentEnrollment[]> {
    try {
      const response = await apiClient.get("/dashboard/enrollments");
      return safeArray(response.data);
    } catch {
      return [];
    }
  },
};
