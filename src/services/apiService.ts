import { axiosInstance } from "@/api/axiosInstance";
import { AxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "@/api/endpoints";
import { User, LoginCredentials, RegisterCredentials } from "@/types/auth";
import { Course, Module, Lesson, QuizSet, Category, EnrolledCourse } from "@/types/course";
import { DashboardStats, LiveClass, StudentEnrollment } from "@/types/dashboard";

/**
 * ---------------------------------------------------------
 * Generic Reusable API Service (Wrapper over Axios Instance)
 * ---------------------------------------------------------
 */
export const apiService = {
  /**
   * Generic GET Request
   */
  async get<T>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.get<T>(url, { params, ...config });
    return response.data;
  },

  /**
   * Generic POST Request
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.post<T>(url, data, config);
    return response.data;
  },

  /**
   * Generic PUT Request
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.put<T>(url, data, config);
    return response.data;
  },

  /**
   * Generic PATCH Request
   */
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.patch<T>(url, data, config);
    return response.data;
  },

  /**
   * Generic DELETE Request
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  },

  /**
   * Generic File / PDF / Image Upload Helper
   */
  async uploadFile<T>(
    url: string,
    fileOrFormData: File | FormData,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    let formData: FormData;
    if (fileOrFormData instanceof FormData) {
      formData = fileOrFormData;
    } else {
      formData = new FormData();
      formData.append("file", fileOrFormData);
    }

    const response = await axiosInstance.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  },

  /**
   * Standardized Reusable Generic CRUD Service Factory
   */
  createCrudService<T extends { id: string | number }>(baseEndpoint: string) {
    return {
      getAll: (params?: Record<string, any>): Promise<T[]> => apiService.get<T[]>(baseEndpoint, params),
      getById: (id: string | number): Promise<T> => apiService.get<T>(`${baseEndpoint}/${id}`),
      create: (data: Partial<T>): Promise<T> => apiService.post<T>(baseEndpoint, data),
      update: (id: string | number, data: Partial<T>): Promise<T> => apiService.put<T>(`${baseEndpoint}/${id}`, data),
      patch: (id: string | number, data: Partial<T>): Promise<T> => apiService.patch<T>(`${baseEndpoint}/${id}`, data),
      delete: (id: string | number): Promise<{ success: boolean; id: string | number }> =>
        apiService.delete<{ success: boolean; id: string | number }>(`${baseEndpoint}/${id}`),
    };
  },
};

/**
 * ---------------------------------------------------------
 * Domain-Specific Reusable API Services
 * ---------------------------------------------------------
 */

// 1. Auth Service
export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiService.post<{ user: User; token: string }>(API_ENDPOINTS.AUTH.LOGIN, credentials),

  register: (data: RegisterCredentials) =>
    apiService.post<{ user: User; token: string }>(API_ENDPOINTS.AUTH.REGISTER, data),

  getProfile: () => apiService.get<User>(API_ENDPOINTS.AUTH.PROFILE),

  updateProfile: (data: Partial<User>) =>
    apiService.put<User>(API_ENDPOINTS.AUTH.UPDATE_PROFILE, data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiService.post<{ message: string }>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data),

  logout: () => apiService.post<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT),
};

// 2. Course API Service
export const courseApi = {
  getCourses: (params?: Record<string, any>) => apiService.get<Course[]>(API_ENDPOINTS.COURSES.LIST, params),
  getCourseById: (id: string | number) => apiService.get<Course>(API_ENDPOINTS.COURSES.DETAILS(id)),
  createCourse: (data: Partial<Course>) => apiService.post<Course>(API_ENDPOINTS.COURSES.CREATE, data),
  updateCourse: (id: string | number, data: Partial<Course>) =>
    apiService.put<Course>(API_ENDPOINTS.COURSES.UPDATE(id), data),
  deleteCourse: (id: string | number) => apiService.delete<{ success: boolean }>(API_ENDPOINTS.COURSES.DELETE(id)),
  publishCourse: (id: string | number) => apiService.patch<Course>(API_ENDPOINTS.COURSES.PUBLISH(id)),
  unpublishCourse: (id: string | number) => apiService.patch<Course>(API_ENDPOINTS.COURSES.UNPUBLISH(id)),
};

// 3. Module API Service
export const moduleApi = {
  getModules: (courseId: string | number) => apiService.get<Module[]>(API_ENDPOINTS.MODULES.LIST(courseId)),
  getModuleById: (moduleId: string | number) => apiService.get<Module>(API_ENDPOINTS.MODULES.DETAILS(moduleId)),
  createModule: (courseId: string | number, data: Partial<Module>) =>
    apiService.post<Module>(API_ENDPOINTS.MODULES.CREATE(courseId), data),
  updateModule: (moduleId: string | number, data: Partial<Module>) =>
    apiService.put<Module>(API_ENDPOINTS.MODULES.UPDATE(moduleId), data),
  deleteModule: (moduleId: string | number) =>
    apiService.delete<{ success: boolean }>(API_ENDPOINTS.MODULES.DELETE(moduleId)),
  reorderLessons: (moduleId: string | number, lessonIds: (string | number)[]) =>
    apiService.put<{ success: boolean }>(API_ENDPOINTS.MODULES.REORDER_LESSONS(moduleId), { lessonIds }),
};

// 4. Lesson API Service
export const lessonApi = {
  getLessonById: (lessonId: string | number) => apiService.get<Lesson>(API_ENDPOINTS.LESSONS.DETAILS(lessonId)),
  createLesson: (moduleId: string | number, data: Partial<Lesson>) =>
    apiService.post<Lesson>(API_ENDPOINTS.LESSONS.CREATE(moduleId), data),
  updateLesson: (lessonId: string | number, data: Partial<Lesson>) =>
    apiService.put<Lesson>(API_ENDPOINTS.LESSONS.UPDATE(lessonId), data),
  deleteLesson: (lessonId: string | number) =>
    apiService.delete<{ success: boolean }>(API_ENDPOINTS.LESSONS.DELETE(lessonId)),
  attachResource: (lessonId: string | number, resourceData: any) =>
    apiService.post(API_ENDPOINTS.LESSONS.ATTACH_RESOURCE(lessonId), resourceData),
  toggleComplete: (lessonId: string | number) =>
    apiService.patch<{ completed: boolean }>(API_ENDPOINTS.LESSONS.TOGGLE_COMPLETE(lessonId)),
};

// 5. Quiz API Service
export const quizApi = {
  getQuizzes: (params?: Record<string, any>) => apiService.get<QuizSet[]>(API_ENDPOINTS.QUIZZES.LIST, params),
  getQuizById: (quizId: string | number) => apiService.get<QuizSet>(API_ENDPOINTS.QUIZZES.DETAILS(quizId)),
  createQuiz: (data: Partial<QuizSet>) => apiService.post<QuizSet>(API_ENDPOINTS.QUIZZES.CREATE, data),
  updateQuiz: (quizId: string | number, data: Partial<QuizSet>) =>
    apiService.put<QuizSet>(API_ENDPOINTS.QUIZZES.UPDATE(quizId), data),
  deleteQuiz: (quizId: string | number) => apiService.delete<{ success: boolean }>(API_ENDPOINTS.QUIZZES.DELETE(quizId)),
  submitQuiz: (quizId: string | number, answers: Record<string, string>) =>
    apiService.post<{ score: number; passed: boolean }>(API_ENDPOINTS.QUIZZES.SUBMIT(quizId), { answers }),
};

// 6. Category API Service
export const categoryApi = apiService.createCrudService<Category>(API_ENDPOINTS.CATEGORIES.LIST);

// 7. Enrollment API Service
export const enrollmentApi = {
  getMyEnrolledCourses: () => apiService.get<EnrolledCourse[]>(API_ENDPOINTS.ENROLLMENTS.MY_COURSES),
  enrollInCourse: (courseId: string | number) =>
    apiService.post<EnrolledCourse>(API_ENDPOINTS.ENROLLMENTS.ENROLL, { courseId }),
  checkEnrollmentStatus: (courseId: string | number) =>
    apiService.get<{ isEnrolled: boolean }>(API_ENDPOINTS.ENROLLMENTS.STATUS(courseId)),
};

// 8. Dashboard & Analytics API Service
export const dashboardApi = {
  getStats: () => apiService.get<DashboardStats>(API_ENDPOINTS.DASHBOARD.STATS),
  getInstructorCourses: () => apiService.get<Course[]>(API_ENDPOINTS.DASHBOARD.INSTRUCTOR_COURSES),
  getLiveClasses: () => apiService.get<LiveClass[]>(API_ENDPOINTS.DASHBOARD.LIVE_CLASSES),
  getQuizSets: () => apiService.get<QuizSet[]>(API_ENDPOINTS.DASHBOARD.QUIZ_SETS),
  getEnrollments: () => apiService.get<StudentEnrollment[]>(API_ENDPOINTS.DASHBOARD.ENROLLMENTS),
};

// 9. Media & File Upload API Service
export const mediaApi = {
  uploadImage: (file: File, onProgress?: (percent: number) => void) =>
    apiService.uploadFile<{ url: string }>(API_ENDPOINTS.MEDIA.UPLOAD_IMAGE, file, onProgress),
  uploadPdf: (file: File, onProgress?: (percent: number) => void) =>
    apiService.uploadFile<{ url: string; size: string }>(API_ENDPOINTS.MEDIA.UPLOAD_PDF, file, onProgress),
  uploadVideo: (file: File, onProgress?: (percent: number) => void) =>
    apiService.uploadFile<{ url: string }>(API_ENDPOINTS.MEDIA.UPLOAD_VIDEO, file, onProgress),
  deleteFile: (fileUrl: string) => apiService.post<{ success: boolean }>(API_ENDPOINTS.MEDIA.DELETE_FILE, { fileUrl }),
};

export default apiService;
