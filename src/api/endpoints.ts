export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  PROFILE: "/auth/me",
  UPDATE_PROFILE: "/auth/profile",
  CHANGE_PASSWORD: "/auth/change-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  REFRESH_TOKEN: "/auth/refresh-token",
  VERIFY_EMAIL: "/auth/verify-email",
} as const;

export const COURSE_ENDPOINTS = {
  LIST: "/courses",
  DETAILS: (id: string | number) => `/courses/${id}`,
  CREATE: "/courses",
  UPDATE: (id: string | number) => `/courses/${id}`,
  DELETE: (id: string | number) => `/courses/${id}`,
  PUBLISH: (id: string | number) => `/courses/${id}/publish`,
  UNPUBLISH: (id: string | number) => `/courses/${id}/unpublish`,
  REORDER_MODULES: (id: string | number) => `/courses/${id}/modules/reorder`,
  ENROLL: (id: string | number) => `/courses/${id}/enroll`,
  REVIEWS: (id: string | number) => `/courses/${id}/reviews`,
  ENROLLMENTS: (id: string | number) => `/courses/${id}/enrollments`,
} as const;

export const MODULE_ENDPOINTS = {
  LIST: (courseId: string | number) => `/courses/${courseId}/modules`,
  DETAILS: (id: string | number) => `/modules/${id}`,
  CREATE: (courseId: string | number) => `/courses/${courseId}/modules`,
  UPDATE: (id: string | number) => `/modules/${id}`,
  DELETE: (id: string | number) => `/modules/${id}`,
  REORDER_LESSONS: (id: string | number) => `/modules/${id}/lessons/reorder`,
} as const;

export const LESSON_ENDPOINTS = {
  DETAILS: (id: string | number) => `/lessons/${id}`,
  CREATE: (moduleId: string | number) => `/modules/${moduleId}/lessons`,
  UPDATE: (id: string | number) => `/lessons/${id}`,
  DELETE: (id: string | number) => `/lessons/${id}`,
  ATTACH_RESOURCE: (id: string | number) => `/lessons/${id}/resources`,
  DELETE_RESOURCE: (id: string | number, resourceId: string | number) =>
    `/lessons/${id}/resources/${resourceId}`,
  TOGGLE_COMPLETE: (id: string | number) => `/lessons/${id}/complete`,
  NOTES: (id: string | number) => `/lessons/${id}/notes`,
  DELETE_NOTE: (id: string | number, noteId: string | number) => `/lessons/${id}/notes/${noteId}`,
  DISCUSSIONS: (id: string | number) => `/lessons/${id}/discussions`,
} as const;

export const QUIZ_ENDPOINTS = {
  LIST: "/quizzes",
  DETAILS: (id: string | number) => `/quizzes/${id}`,
  CREATE: "/quizzes",
  UPDATE: (id: string | number) => `/quizzes/${id}`,
  DELETE: (id: string | number) => `/quizzes/${id}`,
  ADD_QUESTION: (id: string | number) => `/quizzes/${id}/questions`,
  DELETE_QUESTION: (id: string | number, qId: string | number) => `/quizzes/${id}/questions/${qId}`,
  SUBMIT: (id: string | number) => `/quizzes/${id}/submit`,
} as const;

export const CATEGORY_ENDPOINTS = {
  LIST: "/categories",
  DETAILS: (id: string | number) => `/categories/${id}`,
  CREATE: "/categories",
  UPDATE: (id: string | number) => `/categories/${id}`,
  DELETE: (id: string | number) => `/categories/${id}`,
} as const;

export const USER_ENDPOINTS = {
  LIST: "/users",
  DETAILS: (id: string | number) => `/users/${id}`,
  UPDATE_ROLE: (id: string | number) => `/users/${id}/role`,
  UPDATE_STATUS: (id: string | number) => `/users/${id}/status`,
  DELETE: (id: string | number) => `/users/${id}`,
} as const;

export const ENROLLMENT_ENDPOINTS = {
  MY_COURSES: "/user/enrolled-courses",
  ENROLL: "/enrollments",
  STATUS: (id: string | number) => `/enrollments/${id}/status`,
} as const;

export const ANALYTICS_ENDPOINTS = {
  OVERVIEW: "/analytics/overview",
  ADMIN_OVERVIEW: "/admin/overview",
  REVENUE: "/analytics/revenue",
  INSTRUCTOR_STATS: "/analytics/instructor",
  STUDENT_PROGRESS: "/analytics/student-progress",
} as const;

export const MEDIA_ENDPOINTS = {
  UPLOAD_IMAGE: "/upload/image",
  UPLOAD_AVATAR: "/upload/avatar",
  UPLOAD_PDF: "/upload/pdf",
  UPLOAD_VIDEO: "/upload/video",
  UPLOAD_FILE: "/upload/file",
  DELETE_FILE: "/upload/delete",
} as const;

export const DASHBOARD_ENDPOINTS = {
  STATS: "/dashboard/stats",
  INSTRUCTOR_COURSES: "/dashboard/courses",
  LIVE_CLASSES: "/dashboard/lives",
  QUIZ_SETS: "/dashboard/quiz-sets",
  ENROLLMENTS: "/dashboard/enrollments",
  WALLET: "/dashboard/wallet",
} as const;

export const LIVE_ENDPOINTS = {
  LIST: "/dashboard/lives",
  CREATE: "/lives",
  DETAILS: (id: string | number) => `/lives/${id}`,
  UPDATE: (id: string | number) => `/lives/${id}`,
  DELETE: (id: string | number) => `/lives/${id}`,
} as const;

export const PAYMENT_ENDPOINTS = {
  DUMMY: "/payments/dummy",
  INIT: "/payments/init",
  DETAILS: (id: string | number) => `/payments/${id}`,
} as const;

export const COUPON_ENDPOINTS = {
  LIST: "/coupons",
  CREATE: "/coupons",
  UPDATE: (id: string | number) => `/coupons/${id}`,
  DELETE: (id: string | number) => `/coupons/${id}`,
  VALIDATE: "/coupons/validate",
} as const;

export const CHAT_ENDPOINTS = {
  CONVERSATIONS: "/chat/conversations",
  CONVERSATION: (id: string | number) => `/chat/conversations/${id}`,
  MESSAGES: (id: string | number) => `/chat/conversations/${id}/messages`,
  DIRECT: "/chat/conversations/direct",
  GROUPS: "/chat/groups",
  JOIN_GROUP: (id: string | number) => `/chat/groups/${id}/join`,
  READ: (id: string | number) => `/chat/conversations/${id}/read`,
  SEND: "/chat/messages",
  DELETE_MESSAGE: (id: string | number) => `/chat/messages/${id}`,
  REACT: (id: string | number) => `/chat/messages/${id}/reactions`,
  UPLOAD_IMAGE: "/chat/upload-image",
} as const;

export const NOTIFICATION_ENDPOINTS = {
  LIST: "/notifications",
  READ: (id: string | number) => `/notifications/${id}/read`,
  READ_ALL: "/notifications/read-all",
  UNREAD_COUNT: "/notifications/unread-count",
} as const;

export const CERTIFICATE_ENDPOINTS = {
  ISSUE: (courseId: string | number) => `/certificates/${courseId}`,
  MINE: (courseId: string | number) => `/certificates/me/${courseId}`,
  VERIFY: (publicId: string) => `/certificates/verify/${publicId}`,
} as const;

export const INSTRUCTOR_ENDPOINTS = {
  PROFILE: (id: string | number) => `/instructors/${id}`,
  COURSES: (id: string | number) => `/instructors/${id}/courses`,
} as const;

export const WALLET_ENDPOINTS = {
  ADMIN: "/admin/wallet",
  INSTRUCTOR: "/dashboard/wallet",
} as const;

export const DISCUSSION_ENDPOINTS = {
  REPLY: (id: string | number) => `/discussions/${id}/replies`,
  UPVOTE: (id: string | number) => `/discussions/${id}/upvote`,
} as const;

export const REVIEW_ENDPOINTS = {
  UPDATE: (id: string | number) => `/reviews/${id}`,
  DELETE: (id: string | number) => `/reviews/${id}`,
} as const;

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
  LIVES: LIVE_ENDPOINTS,
  PAYMENTS: PAYMENT_ENDPOINTS,
  COUPONS: COUPON_ENDPOINTS,
  CHAT: CHAT_ENDPOINTS,
  NOTIFICATIONS: NOTIFICATION_ENDPOINTS,
  CERTIFICATES: CERTIFICATE_ENDPOINTS,
  INSTRUCTORS: INSTRUCTOR_ENDPOINTS,
  WALLETS: WALLET_ENDPOINTS,
  DISCUSSIONS: DISCUSSION_ENDPOINTS,
  REVIEWS: REVIEW_ENDPOINTS,
};

export default API_ENDPOINTS;
