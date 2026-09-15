import apiClient from "@/api/axiosInstance";
import { Course, Category, EnrolledCourse } from "@/types/course";

export const initialCourses: Course[] = [
  {
    id: 1,
    slug: "reactive-accelerator",
    title: "Reactive Accelerator: Modern Full-Stack Masterclass",
    subtitle: "Master React, TypeScript, Next.js, Node.js, and MongoDB with industry best practices.",
    category: "Web Development",
    categoryId: "cat-1",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    price: 4999,
    discountPrice: 3999,
    isPublished: true,
    isFeatured: true,
    creatorType: "instructor",
    totalChapters: 12,
    progress: 45,
    instructor: {
      id: 101,
      name: "Tapas Adhikary",
      designation: "Senior Frontend Architect & Educator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      rating: 4.9,
      studentsCount: 3200,
      coursesCount: 5,
    },
  },
];

export const initialCategories: Category[] = [
  { id: "cat-1", title: "Web Development", thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=150" },
  { id: "cat-2", title: "Mobile Development", thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=150" },
];

export const initialEnrolledCourses: EnrolledCourse[] = [
  {
    ...initialCourses[0],
    enrolledDate: "2024-01-15",
    completedModules: 4,
    totalModules: 12,
    completedQuizzes: 3,
    totalQuizzes: 8,
    quizScore: 85,
    otherScore: 90,
    totalScore: 88,
  },
];

function safeArray<T>(data: any, fallback: T[]): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.courses)) return data.courses;
  if (data && Array.isArray(data.categories)) return data.categories;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.result)) return data.result;
  if (data && Array.isArray(data.items)) return data.items;
  return fallback;
}

export const courseService = {
  async getCourses(): Promise<Course[]> {
    try {
      const response = await apiClient.get("/courses");
      return safeArray(response.data, initialCourses);
    } catch {
      return initialCourses;
    }
  },

  async getCourseById(id: string | number): Promise<Course | undefined> {
    try {
      const response = await apiClient.get(`/courses/${id}`);
      return response.data?.course || response.data?.data || response.data;
    } catch {
      return initialCourses.find((c) => String(c.id) === String(id)) || initialCourses[0];
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiClient.get("/categories");
      return safeArray(response.data, initialCategories);
    } catch {
      return initialCategories;
    }
  },

  async getEnrolledCourses(): Promise<EnrolledCourse[]> {
    try {
      const response = await apiClient.get("/user/enrolled-courses");
      return safeArray(response.data, initialEnrolledCourses);
    } catch {
      return initialEnrolledCourses;
    }
  },
};
