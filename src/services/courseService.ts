import apiClient from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { unwrapFromResponse, unwrapListFromResponse } from "@/lib/api";
import { Course, Category, EnrolledCourse, CourseReview, Module, Lesson, LessonResource } from "@/types/course";
import { EnrollmentStatus, InstructorPublicProfile } from "@/types/api";

export const courseService = {
  async getCourses(params?: Record<string, unknown>): Promise<Course[]> {
    const response = await apiClient.get(API_ENDPOINTS.COURSES.LIST, { params });
    return unwrapListFromResponse<Course>(response);
  },

  async getCourseById(id: string | number): Promise<Course | undefined> {
    const response = await apiClient.get(API_ENDPOINTS.COURSES.DETAILS(id));
    return unwrapFromResponse<Course>(response);
  },

  async createCourse(data: Partial<Course>): Promise<Course> {
    const response = await apiClient.post(API_ENDPOINTS.COURSES.CREATE, data);
    return unwrapFromResponse<Course>(response);
  },

  async updateCourse(id: string | number, data: Partial<Course>): Promise<Course> {
    const response = await apiClient.put(API_ENDPOINTS.COURSES.UPDATE(id), data);
    return unwrapFromResponse<Course>(response);
  },

  async deleteCourse(id: string | number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COURSES.DELETE(id));
  },

  async publishCourse(id: string | number, isPublished = true): Promise<Course> {
    const path = isPublished ? API_ENDPOINTS.COURSES.PUBLISH(id) : API_ENDPOINTS.COURSES.UNPUBLISH(id);
    const response = await apiClient.patch(path, { isPublished });
    return unwrapFromResponse<Course>(response);
  },

  async reorderModules(courseId: string | number, moduleIds: (string | number)[]): Promise<void> {
    await apiClient.put(API_ENDPOINTS.COURSES.REORDER_MODULES(courseId), { moduleIds });
  },

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES.LIST);
    return unwrapListFromResponse<Category>(response);
  },

  async getEnrolledCourses(): Promise<EnrolledCourse[]> {
    const response = await apiClient.get(API_ENDPOINTS.ENROLLMENTS.MY_COURSES);
    return unwrapListFromResponse<EnrolledCourse>(response);
  },

  async getEnrollmentStatus(courseId: string | number): Promise<EnrollmentStatus> {
    const response = await apiClient.get(API_ENDPOINTS.ENROLLMENTS.STATUS(courseId));
    return unwrapFromResponse<EnrollmentStatus>(response);
  },

  async enrollFree(courseId: string | number): Promise<EnrolledCourse> {
    const response = await apiClient.post(API_ENDPOINTS.ENROLLMENTS.ENROLL, { courseId });
    return unwrapFromResponse<EnrolledCourse>(response);
  },

  async getReviews(courseId: string | number): Promise<CourseReview[]> {
    const response = await apiClient.get(API_ENDPOINTS.COURSES.REVIEWS(courseId));
    return unwrapListFromResponse<CourseReview>(response);
  },

  async createReview(courseId: string | number, data: { rating: number; comment: string }): Promise<CourseReview> {
    const response = await apiClient.post(API_ENDPOINTS.COURSES.REVIEWS(courseId), data);
    return unwrapFromResponse<CourseReview>(response);
  },

  async getInstructor(id: string | number): Promise<InstructorPublicProfile> {
    const response = await apiClient.get(API_ENDPOINTS.INSTRUCTORS.PROFILE(id));
    return unwrapFromResponse<InstructorPublicProfile>(response);
  },

  async getInstructorCourses(id: string | number): Promise<Course[]> {
    const response = await apiClient.get(API_ENDPOINTS.INSTRUCTORS.COURSES(id));
    return unwrapListFromResponse<Course>(response);
  },

  async getModules(courseId: string | number): Promise<Module[]> {
    const response = await apiClient.get(API_ENDPOINTS.MODULES.LIST(courseId));
    return unwrapListFromResponse<Module>(response);
  },

  async getModule(id: string | number): Promise<Module> {
    const response = await apiClient.get(API_ENDPOINTS.MODULES.DETAILS(id));
    return unwrapFromResponse<Module>(response);
  },

  async createModule(courseId: string | number, data: Partial<Module>): Promise<Module> {
    const response = await apiClient.post(API_ENDPOINTS.MODULES.CREATE(courseId), data);
    return unwrapFromResponse<Module>(response);
  },

  async updateModule(id: string | number, data: Partial<Module>): Promise<Module> {
    const response = await apiClient.put(API_ENDPOINTS.MODULES.UPDATE(id), data);
    return unwrapFromResponse<Module>(response);
  },

  async deleteModule(id: string | number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.MODULES.DELETE(id));
  },

  async reorderLessons(moduleId: string | number, lessonIds: (string | number)[]): Promise<void> {
    await apiClient.put(API_ENDPOINTS.MODULES.REORDER_LESSONS(moduleId), { lessonIds });
  },

  async getLesson(id: string | number): Promise<Lesson> {
    const response = await apiClient.get(API_ENDPOINTS.LESSONS.DETAILS(id));
    return unwrapFromResponse<Lesson>(response);
  },

  async createLesson(moduleId: string | number, data: Partial<Lesson>): Promise<Lesson> {
    const response = await apiClient.post(API_ENDPOINTS.LESSONS.CREATE(moduleId), data);
    return unwrapFromResponse<Lesson>(response);
  },

  async updateLesson(id: string | number, data: Partial<Lesson>): Promise<Lesson> {
    const response = await apiClient.put(API_ENDPOINTS.LESSONS.UPDATE(id), data);
    return unwrapFromResponse<Lesson>(response);
  },

  async deleteLesson(id: string | number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.LESSONS.DELETE(id));
  },

  async attachResource(lessonId: string | number, data: Partial<LessonResource>): Promise<LessonResource> {
    const response = await apiClient.post(API_ENDPOINTS.LESSONS.ATTACH_RESOURCE(lessonId), data);
    return unwrapFromResponse<LessonResource>(response);
  },

  async deleteResource(lessonId: string | number, resourceId: string | number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.LESSONS.DELETE_RESOURCE(lessonId, resourceId));
  },
};

export default courseService;
