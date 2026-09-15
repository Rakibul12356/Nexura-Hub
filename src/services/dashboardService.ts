import apiClient from "@/api/axiosInstance";
import { DashboardStats, LiveClass, StudentEnrollment } from "@/types/dashboard";
import { Course, QuizSet } from "@/types/course";
import { initialCourses } from "./courseService";

export const initialLives: LiveClass[] = [
  {
    id: "live-1",
    title: "Mastering React 19 Compiler & Server Actions",
    description: "Deep dive into automatic memoization and server functions.",
    date: "2026-09-20",
    time: "08:00 PM",
    duration: "90 min",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    isCompleted: false,
  },
];

export const initialQuizSets: QuizSet[] = [
  {
    id: "quiz-1",
    title: "React State & Hooks Master Assessment",
    description: "Evaluate your understanding of useState, useEffect, and custom hooks.",
    totalMarks: 50,
    isPublished: true,
  },
];

export const initialEnrollments: StudentEnrollment[] = [
  {
    id: "en-1",
    studentName: "Rahim Ahmed",
    studentEmail: "rahim@example.com",
    studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    courseTitle: "Reactive Accelerator",
    enrolledDate: "2024-01-15",
    progress: 65,
    paymentStatus: "paid",
  },
];

function safeArray<T>(data: any, fallback: T[]): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.courses)) return data.courses;
  if (data && Array.isArray(data.lives)) return data.lives;
  if (data && Array.isArray(data.quizSets)) return data.quizSets;
  if (data && Array.isArray(data.enrollments)) return data.enrollments;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.result)) return data.result;
  if (data && Array.isArray(data.items)) return data.items;
  return fallback;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get("/dashboard/stats");
      if (response.data && typeof response.data === "object" && !Array.isArray(response.data)) {
        return response.data;
      }
      return {
        totalCourses: 15,
        totalEnrollments: 1000,
        totalRevenue: 12000,
        totalStudents: 850,
      };
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
      return safeArray(response.data, initialCourses);
    } catch {
      return initialCourses;
    }
  },

  async getLiveClasses(): Promise<LiveClass[]> {
    try {
      const response = await apiClient.get("/dashboard/lives");
      return safeArray(response.data, initialLives);
    } catch {
      return initialLives;
    }
  },

  async getQuizSets(): Promise<QuizSet[]> {
    try {
      const response = await apiClient.get("/dashboard/quiz-sets");
      return safeArray(response.data, initialQuizSets);
    } catch {
      return initialQuizSets;
    }
  },

  async getEnrollments(): Promise<StudentEnrollment[]> {
    try {
      const response = await apiClient.get("/dashboard/enrollments");
      return safeArray(response.data, initialEnrollments);
    } catch {
      return initialEnrollments;
    }
  },
};
