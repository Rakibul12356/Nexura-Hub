import { axiosInstance } from "@/api/axiosInstance";
import { AxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { unwrap, unwrapFromResponse } from "@/lib/api";
import { User, LoginCredentials, RegisterCredentials } from "@/types/auth";
import { Course, Module, Lesson, QuizSet } from "@/types/course";
import { courseService } from "@/services/courseService";
import { dashboardService } from "@/services/dashboardService";
import { mediaService } from "@/services/chatService";

export const apiService = {
  async get<T>(url: string, params?: Record<string, unknown>, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get(url, { params, ...config });
    return unwrapFromResponse<T>(response);
  },

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.post(url, data, config);
    return unwrapFromResponse<T>(response);
  },

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.put(url, data, config);
    return unwrapFromResponse<T>(response);
  },

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.patch(url, data, config);
    return unwrapFromResponse<T>(response);
  },

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete(url, config);
    return unwrapFromResponse<T>(response);
  },

  async uploadFile<T>(
    url: string,
    fileOrFormData: File | FormData,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData =
      fileOrFormData instanceof FormData
        ? fileOrFormData
        : (() => {
            const fd = new FormData();
            fd.append("file", fileOrFormData);
            return fd;
          })();

    const response = await axiosInstance.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    });
    return unwrapFromResponse<T>(response);
  },
};

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiService.post<{ user: User; token: string; refreshToken?: string }>(API_ENDPOINTS.AUTH.LOGIN, credentials),
  register: (data: RegisterCredentials) =>
    apiService.post<{ user: User; token: string; refreshToken?: string }>(API_ENDPOINTS.AUTH.REGISTER, data),
  getProfile: () => apiService.get<User>(API_ENDPOINTS.AUTH.PROFILE),
  updateProfile: (data: Partial<User>) => apiService.put<User>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiService.post<{ message: string }>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data),
  logout: (refreshToken?: string) =>
    apiService.post<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT, refreshToken ? { refreshToken } : {}),
};

export const courseApi = {
  getCourses: (params?: Record<string, unknown>) => courseService.getCourses(params),
  getCourseById: (id: string | number) => courseService.getCourseById(id),
  createCourse: (data: Partial<Course>) => courseService.createCourse(data),
  updateCourse: (id: string | number, data: Partial<Course>) => courseService.updateCourse(id, data),
  deleteCourse: (id: string | number) => courseService.deleteCourse(id),
  publishCourse: (id: string | number) => courseService.publishCourse(id, true),
  unpublishCourse: (id: string | number) => courseService.publishCourse(id, false),
};

export const moduleApi = {
  getModules: (courseId: string | number) => courseService.getModules(courseId),
  getModuleById: (moduleId: string | number) => courseService.getModule(moduleId),
  createModule: (courseId: string | number, data: Partial<Module>) => courseService.createModule(courseId, data),
  updateModule: (moduleId: string | number, data: Partial<Module>) => courseService.updateModule(moduleId, data),
  deleteModule: (moduleId: string | number) => courseService.deleteModule(moduleId),
  reorderLessons: (moduleId: string | number, lessonIds: (string | number)[]) =>
    courseService.reorderLessons(moduleId, lessonIds),
};

export const lessonApi = {
  getLessonById: (lessonId: string | number) => courseService.getLesson(lessonId),
  createLesson: (moduleId: string | number, data: Partial<Lesson>) => courseService.createLesson(moduleId, data),
  updateLesson: (lessonId: string | number, data: Partial<Lesson>) => courseService.updateLesson(lessonId, data),
  deleteLesson: (lessonId: string | number) => courseService.deleteLesson(lessonId),
  attachResource: (lessonId: string | number, resourceData: Partial<Lesson>) =>
    courseService.attachResource(lessonId, resourceData),
  toggleComplete: (lessonId: string | number) =>
    apiService.patch<{ completed: boolean; progress: number }>(API_ENDPOINTS.LESSONS.TOGGLE_COMPLETE(lessonId), {
      completed: true,
    }),
};

export const quizApi = {
  getQuizzes: () => dashboardService.getQuizSets(),
  getQuizById: (quizId: string | number) => dashboardService.getQuizSet(quizId),
  createQuiz: (data: Partial<QuizSet>) => dashboardService.createQuizSet(data),
  updateQuiz: (quizId: string | number, data: Partial<QuizSet>) => dashboardService.updateQuizSet(quizId, data),
  deleteQuiz: (quizId: string | number) => dashboardService.deleteQuizSet(quizId),
  submitQuiz: (quizId: string | number, answers: Record<string, string>, lessonId?: string | number) =>
    dashboardService.submitQuiz(quizId, { answers, lessonId }),
};

export const categoryApi = {
  getAll: () => courseService.getCategories(),
  getById: (id: string | number) => apiService.get(API_ENDPOINTS.CATEGORIES.DETAILS(id)),
  create: (data: Record<string, unknown>) => apiService.post(API_ENDPOINTS.CATEGORIES.CREATE, data),
  update: (id: string | number, data: Record<string, unknown>) =>
    apiService.put(API_ENDPOINTS.CATEGORIES.UPDATE(id), data),
  delete: (id: string | number) => apiService.delete(API_ENDPOINTS.CATEGORIES.DELETE(id)),
};

export const enrollmentApi = {
  getMyEnrolledCourses: () => courseService.getEnrolledCourses(),
  enrollInCourse: (courseId: string | number) => courseService.enrollFree(courseId),
  checkEnrollmentStatus: (courseId: string | number) => courseService.getEnrollmentStatus(courseId),
};

export const dashboardApi = {
  getStats: () => dashboardService.getStats(),
  getInstructorCourses: () => dashboardService.getInstructorCourses(),
  getLiveClasses: () => dashboardService.getLiveClasses(),
  getQuizSets: () => dashboardService.getQuizSets(),
  getEnrollments: () => dashboardService.getEnrollments(),
};

export const mediaApi = {
  uploadImage: (file: File, onProgress?: (percent: number) => void) =>
    mediaService.upload(API_ENDPOINTS.MEDIA.UPLOAD_IMAGE, file, onProgress),
  uploadPdf: (file: File, onProgress?: (percent: number) => void) =>
    mediaService.upload(API_ENDPOINTS.MEDIA.UPLOAD_PDF, file, onProgress),
  uploadVideo: (file: File, onProgress?: (percent: number) => void) =>
    mediaService.upload(API_ENDPOINTS.MEDIA.UPLOAD_VIDEO, file, onProgress),
  deleteFile: (fileUrl: string) => apiService.post<{ success: boolean }>(API_ENDPOINTS.MEDIA.DELETE_FILE, { fileUrl }),
};

export { unwrap };
export default apiService;
