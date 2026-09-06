import apiClient from "@/api/axiosInstance";
import { DashboardStats, LiveClass, StudentEnrollment } from "@/types/dashboard";
import { Course, QuizSet } from "@/types/course";
import {
  initialLives,
  initialQuizSets,
  initialEnrollments,
} from "@/store/slices/dashboardSlice";
import { initialCourses } from "@/store/slices/courseSlice";

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get("/dashboard/stats");
      return response.data;
    } catch {
      return {
        totalCourses: 15,
        totalEnrollments: 1000,
        totalRevenue: 12000,
        totalStudents: 850,
      };
    }
  },

  async getInstructorCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get("/dashboard/courses");
      return response.data;
    } catch {
      return initialCourses;
    }
  },

  async getLiveClasses(): Promise<LiveClass[]> {
    try {
      const response = await apiClient.get("/dashboard/lives");
      return response.data;
    } catch {
      return initialLives;
    }
  },

  async getQuizSets(): Promise<QuizSet[]> {
    try {
      const response = await apiClient.get("/dashboard/quiz-sets");
      return response.data;
    } catch {
      return initialQuizSets;
    }
  },

  async getEnrollments(): Promise<StudentEnrollment[]> {
    try {
      const response = await apiClient.get("/dashboard/enrollments");
      return response.data;
    } catch {
      return initialEnrollments;
    }
  },
};
