import apiClient from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { unwrapFromResponse, unwrapListFromResponse } from "@/lib/api";
import { DashboardStats, LiveClass, StudentEnrollment } from "@/types/dashboard";
import { Course, QuizSet, QuizQuestion } from "@/types/course";
import { Wallet, QuizSubmitResult } from "@/types/api";

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.STATS);
    return unwrapFromResponse<DashboardStats>(response);
  },

  async getInstructorCourses(): Promise<Course[]> {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.INSTRUCTOR_COURSES);
    return unwrapListFromResponse<Course>(response);
  },

  async getLiveClasses(): Promise<LiveClass[]> {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.LIVE_CLASSES);
    return unwrapListFromResponse<LiveClass>(response);
  },

  async createLive(data: Partial<LiveClass>): Promise<LiveClass> {
    const response = await apiClient.post(API_ENDPOINTS.LIVES.CREATE, data);
    return unwrapFromResponse<LiveClass>(response);
  },

  async updateLive(id: string | number, data: Partial<LiveClass>): Promise<LiveClass> {
    const response = await apiClient.put(API_ENDPOINTS.LIVES.UPDATE(id), data);
    return unwrapFromResponse<LiveClass>(response);
  },

  async deleteLive(id: string | number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.LIVES.DELETE(id));
  },

  async getQuizSets(): Promise<QuizSet[]> {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.QUIZ_SETS);
    return unwrapListFromResponse<QuizSet>(response);
  },

  async getQuizSet(id: string | number): Promise<QuizSet> {
    const response = await apiClient.get(API_ENDPOINTS.QUIZZES.DETAILS(id));
    return unwrapFromResponse<QuizSet>(response);
  },

  async createQuizSet(data: Partial<QuizSet>): Promise<QuizSet> {
    const response = await apiClient.post(API_ENDPOINTS.QUIZZES.CREATE, data);
    return unwrapFromResponse<QuizSet>(response);
  },

  async updateQuizSet(id: string | number, data: Partial<QuizSet>): Promise<QuizSet> {
    const response = await apiClient.put(API_ENDPOINTS.QUIZZES.UPDATE(id), data);
    return unwrapFromResponse<QuizSet>(response);
  },

  async deleteQuizSet(id: string | number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.QUIZZES.DELETE(id));
  },

  async addQuizQuestion(quizId: string | number, data: Partial<QuizQuestion>): Promise<QuizQuestion> {
    const response = await apiClient.post(API_ENDPOINTS.QUIZZES.ADD_QUESTION(quizId), data);
    return unwrapFromResponse<QuizQuestion>(response);
  },

  async deleteQuizQuestion(quizId: string | number, qId: string | number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.QUIZZES.DELETE_QUESTION(quizId, qId));
  },

  async submitQuiz(
    quizId: string | number,
    payload: { lessonId?: string | number; answers: Record<string, string> }
  ): Promise<QuizSubmitResult> {
    const response = await apiClient.post(API_ENDPOINTS.QUIZZES.SUBMIT(quizId), payload);
    return unwrapFromResponse<QuizSubmitResult>(response);
  },

  async getEnrollments(params?: Record<string, unknown>): Promise<StudentEnrollment[]> {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.ENROLLMENTS, { params });
    return unwrapListFromResponse<StudentEnrollment>(response);
  },

  async getCourseEnrollments(courseId: string | number, search?: string): Promise<StudentEnrollment[]> {
    const response = await apiClient.get(API_ENDPOINTS.COURSES.ENROLLMENTS(courseId), {
      params: search ? { search } : undefined,
    });
    return unwrapListFromResponse<StudentEnrollment>(response);
  },

  async getWallet(): Promise<Wallet> {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.WALLET);
    return unwrapFromResponse<Wallet>(response);
  },
};

export default dashboardService;
