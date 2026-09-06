/**
 * Centralized API Endpoints Configuration
 * Contains all endpoint routes for the website
 */

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/profile",
  UPDATE_PROFILE: "/auth/profile",
  CHANGE_PASSWORD: "/auth/change-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  REFRESH_TOKEN: "/auth/refresh-token",
  VERIFY_EMAIL: "/auth/verify-email",
} as const;

// Course Endpoints
export const COURSE_ENDPOINTS = {
  LIST: "/courses",
  DETAILS: (id: string | number) => `/courses/${id}`,
  CREATE: "/courses",
  UPDATE: (id: string | number) => `/courses/${id}`,
  DELETE: (id: string | number) => `/courses/${id}`,
  PUBLISH: (id: string | number) => `/courses/${id}/publish`,
  UNPUBLISH: (id: string | number) => `/courses/${id}/unpublish`,
  REORDER_MODULES: (courseId: string | number) => `/courses/${courseId}/modules/reorder`,
  ENROLL: (id: string | number) => `/courses/${id}/enroll`,
  REVIEWS: (id: string | number) => `/courses/${id}/reviews`,
} as const;

// Module Endpoints
export const MODULE_ENDPOINTS = {
  LIST: (courseId: string | number) => `/courses/${courseId}/modules`,
  DETAILS: (moduleId: string | number) => `/modules/${moduleId}`,
  CREATE: (courseId: string | number) => `/courses/${courseId}/modules`,
  UPDATE: (moduleId: string | number) => `/modules/${moduleId}`,
  DELETE: (moduleId: string | number) => `/modules/${moduleId}`,
  REORDER_LESSONS: (moduleId: string | number) => `/modules/${moduleId}/lessons/reorder`,
} as const;

// Lesson Endpoints
export const LESSON_ENDPOINTS = {
  DETAILS: (lessonId: string | number) => `/lessons/${lessonId}`,
  CREATE: (moduleId: string | number) => `/modules/${moduleId}/lessons`,
  UPDATE: (lessonId: string | number) => `/lessons/${lessonId}`,
  DELETE: (lessonId: string | number) => `/lessons/${lessonId}`,
  ATTACH_RESOURCE: (lessonId: string | number) => `/lessons/${lessonId}/resources`,
  DELETE_RESOURCE: (lessonId: string | number, resourceId: string | number) =>
    `/lessons/${lessonId}/resources/${resourceId}`,
  TOGGLE_COMPLETE: (lessonId: string | number) => `/lessons/${lessonId}/complete`,
} as const;

// Quiz Endpoints
export const QUIZ_ENDPOINTS = {
  LIST: "/quizzes",
  DETAILS: (quizId: string | number) => `/quizzes/${quizId}`,
  CREATE: "/quizzes",
  UPDATE: (quizId: string | number) => `/quizzes/${quizId}`,
  DELETE: (quizId: string | number) => `/quizzes/${quizId}`,
  ADD_QUESTION: (quizId: string | number) => `/quizzes/${quizId}/questions`,
  DELETE_QUESTION: (quizId: string | number, qId: string | number) =>
    `/quizzes/${quizId}/questions/${qId}`,
  SUBMIT: (quizId: string | number) => `/quizzes/${quizId}/submit`,
} as const;

// Category Endpoints
export const CATEGORY_ENDPOINTS = {
  LIST: "/categories",
  DETAILS: (id: string | number) => `/categories/${id}`,
  CREATE: "/categories",
  UPDATE: (id: string | number) => `/categories/${id}`,
  DELETE: (id: string | number) => `/categories/${id}`,
} as const;

// User Management Endpoints
export const USER_ENDPOINTS = {
  LIST: "/users",
  DETAILS: (id: string | number) => `/users/${id}`,
  UPDATE_ROLE: (id: string | number) => `/users/${id}/role`,
  DELETE: (id: string | number) => `/users/${id}`,
} as const;

// Enrollment Endpoints
export const ENROLLMENT_ENDPOINTS = {
  MY_COURSES: "/user/enrolled-courses",
  ENROLL: "/enrollments",
  STATUS: (courseId: string | number) => `/enrollments/${courseId}/status`,
} as const;

// Analytics Endpoints
export const ANALYTICS_ENDPOINTS = {
  OVERVIEW: "/analytics/overview",
  REVENUE: "/analytics/revenue",
  INSTRUCTOR_STATS: "/analytics/instructor",
  STUDENT_PROGRESS: "/analytics/student-progress",
} as const;

// Media & Upload Endpoints
export const MEDIA_ENDPOINTS = {
  UPLOAD_IMAGE: "/upload/image",
  UPLOAD_PDF: "/upload/pdf",
  UPLOAD_VIDEO: "/upload/video",
  UPLOAD_FILE: "/upload/file",
  DELETE_FILE: "/upload/delete",
} as const;

// Dashboard Endpoints
export const DASHBOARD_ENDPOINTS = {
  STATS: "/dashboard/stats",
  INSTRUCTOR_COURSES: "/dashboard/courses",
  LIVE_CLASSES: "/dashboard/lives",
  QUIZ_SETS: "/dashboard/quiz-sets",
  ENROLLMENTS: "/dashboard/enrollments",
} as const;

// Grouped API Endpoints Export
export const API_ENDPOINTS = {
  AUTH: AUTH_ENDPOINTS,
  COURSES: COURSE_ENDPOINTS,
  MODULES: MODULE_ENDPOINTS,
  LESSONS: LESSON_ENDPOINTS,
  QUIZZES: QUIZ_ENDPOINTS,
  CATEGORIES: CATEGORY_ENDPOINTS,
  USERS: USER_ENDPOINTS,
  ENROLLMENTS: ENROLLMENT_ENDPOINTS,
  ANALYTICS: ANALYTICS_ENDPOINTS,
  MEDIA: MEDIA_ENDPOINTS,
  DASHBOARD: DASHBOARD_ENDPOINTS,
};

export default API_ENDPOINTS;
