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
