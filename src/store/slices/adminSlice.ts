import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Course } from "@/types/course";
import {
  AdminStats,
  PlatformTransaction,
  ManagedUser,
  MonthlyGrowthData,
  CategoryStat,
} from "@/types/admin";

export interface AdminCourse extends Course {
  creatorType: "instructor" | "admin";
  instructorEmail?: string;
  isFeatured?: boolean;
  enrollmentsCount: number;
  totalRevenue: number;
  adminEarnings: number;
  createdAt: string;
}

interface AdminState {
  courses: AdminCourse[];
  users: ManagedUser[];
  transactions: PlatformTransaction[];
  monthlyGrowth: MonthlyGrowthData[];
  categoryStats: CategoryStat[];
  isLoading: boolean;
  selectedTimeRange: "7d" | "30d" | "90d" | "1y" | "all";
}

const initialCourses: AdminCourse[] = [
  {
    id: "course-1",
    title: "Master Modern React & Redux Toolkit Architecture",
    subtitle: "Build enterprise scalable full-stack applications with production best practices.",
    category: "Web Development",
    categoryId: "1",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80",
    price: 49.99,
    discountPrice: 39.99,
    isPublished: true,
    isFeatured: true,
    creatorType: "instructor",
    instructor: {
      id: "inst-1",
      name: "Jenny Jimenez",
      designation: "Senior Software Architect",
      avatar: "/assets/images/profile.jpg",
    },
    instructorEmail: "instructor@nexurahub.com",
    enrollmentsCount: 342,
    totalRevenue: 13676.58,
    adminEarnings: 683.83, // 5%
    createdAt: "2026-01-15",
  },
  {
    id: "course-2",
    title: "Complete Next.js 15 & Tailwind CSS Masterclass",
    subtitle: "Server components, streaming SSR, API routes and automated deployment.",
    category: "Full Stack",
    categoryId: "2",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
    price: 59.99,
    discountPrice: 49.99,
    isPublished: true,
    isFeatured: true,
    creatorType: "admin", // Admin created course = 100% platform revenue!
    instructor: {
      id: "admin-1",
      name: "Nexura Hub Official (Admin)",
      designation: "Platform Core Team",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    },
    instructorEmail: "admin@nexurahub.com",
    enrollmentsCount: 512,
    totalRevenue: 25594.88,
    adminEarnings: 25594.88, // 100%
    createdAt: "2026-02-01",
  },
  {
    id: "course-3",
    title: "TypeScript from Scratch to Professional Master",
    subtitle: "Generics, utility types, decorative patterns, and enterprise typing strategies.",
    category: "Programming",
    categoryId: "3",
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&auto=format&fit=crop&q=80",
    price: 39.99,
    discountPrice: 29.99,
    isPublished: true,
    isFeatured: false,
    creatorType: "instructor",
    instructor: {
      id: "inst-2",
      name: "David Miller",
      designation: "TypeScript Specialist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    instructorEmail: "david.miller@nexurahub.com",
    enrollmentsCount: 215,
    totalRevenue: 6447.85,
    adminEarnings: 322.39, // 5%
    createdAt: "2026-02-18",
  },
  {
    id: "course-4",
    title: "UI/UX Design Systems with Figma & Tokens",
    subtitle: "Design stunning interfaces, design tokens, responsive auto-layout, and prototypes.",
    category: "Design",
    categoryId: "4",
    thumbnail: "https://images.unsplash.com/photo-1581291518655-9523c93269e3?w=800&auto=format&fit=crop&q=80",
    price: 44.99,
    discountPrice: 34.99,
    isPublished: true,
    isFeatured: false,
    creatorType: "instructor",
    instructor: {
      id: "inst-3",
      name: "Sophia Martinez",
      designation: "Principal Product Designer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    instructorEmail: "sophia@nexurahub.com",
    enrollmentsCount: 188,
    totalRevenue: 6578.12,
    adminEarnings: 328.91, // 5%
    createdAt: "2026-03-02",
  },
  {
    id: "course-5",
    title: "Docker, Kubernetes & Cloud DevOps Engineering",
    subtitle: "Complete container orchestration, CI/CD pipelines, and AWS cloud deployment.",
    category: "DevOps",
    categoryId: "5",
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80",
    price: 69.99,
    discountPrice: 59.99,
    isPublished: false, // Draft for admin review
    isFeatured: false,
    creatorType: "instructor",
    instructor: {
      id: "inst-4",
      name: "Michael Chen",
      designation: "Cloud DevOps Architect",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
    instructorEmail: "m.chen@nexurahub.com",
    enrollmentsCount: 0,
    totalRevenue: 0,
    adminEarnings: 0,
    createdAt: "2026-03-20",
  },
];

const initialUsers: ManagedUser[] = [
  {
    id: "admin-1",
    firstName: "Rakibul",
    lastName: "Hasan",
    email: "admin@nexurahub.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    status: "active",
    joinDate: "2025-11-01",
    createdCoursesCount: 1,
    totalEarnings: 25594.88,
  },
  {
    id: "inst-1",
    firstName: "Jenny",
    lastName: "Jimenez",
    email: "instructor@nexurahub.com",
    role: "instructor",
    avatar: "/assets/images/profile.jpg",
    status: "active",
    joinDate: "2025-12-10",
    createdCoursesCount: 2,
    totalStudentsCount: 480,
    totalEarnings: 12992.75, // 95%
    adminCommissionGenerated: 683.83, // 5%
    bio: "Senior full stack instructor & software architect",
  },
  {
    id: "inst-2",
    firstName: "David",
    lastName: "Miller",
    email: "david.miller@nexurahub.com",
    role: "instructor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "active",
    joinDate: "2026-01-05",
    createdCoursesCount: 1,
    totalStudentsCount: 215,
    totalEarnings: 6125.46,
    adminCommissionGenerated: 322.39,
  },
  {
    id: "inst-3",
    firstName: "Sophia",
    lastName: "Martinez",
    email: "sophia@nexurahub.com",
    role: "instructor",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "active",
    joinDate: "2026-01-20",
    createdCoursesCount: 1,
    totalStudentsCount: 188,
    totalEarnings: 6249.21,
    adminCommissionGenerated: 328.91,
  },
  {
    id: "inst-4",
    firstName: "Michael",
    lastName: "Chen",
    email: "m.chen@nexurahub.com",
    role: "instructor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    status: "pending",
    joinDate: "2026-03-10",
    createdCoursesCount: 1,
    totalStudentsCount: 0,
    totalEarnings: 0,
    adminCommissionGenerated: 0,
  },
  {
    id: "student-1",
    firstName: "Alex",
    lastName: "Rahman",
    email: "student@nexurahub.com",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "active",
    joinDate: "2026-01-12",
    enrolledCoursesCount: 3,
    totalSpent: 129.97,
  },
  {
    id: "student-2",
    firstName: "Emma",
    lastName: "Watson",
    email: "emma.w@gmail.com",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    status: "active",
    joinDate: "2026-01-28",
    enrolledCoursesCount: 2,
    totalSpent: 89.98,
  },
  {
    id: "student-3",
    firstName: "Liam",
    lastName: "Johnson",
    email: "liam.j@outlook.com",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    status: "active",
    joinDate: "2026-02-14",
    enrolledCoursesCount: 4,
    totalSpent: 174.96,
  },
  {
    id: "student-4",
    firstName: "Sara",
    lastName: "Khan",
    email: "sara.k@gmail.com",
    role: "student",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    status: "suspended",
    joinDate: "2026-02-22",
    enrolledCoursesCount: 1,
    totalSpent: 39.99,
  },
];

const initialTransactions: PlatformTransaction[] = [
  {
    id: "TXN-98421",
    courseId: "course-2",
    courseTitle: "Complete Next.js 15 & Tailwind CSS Masterclass",
    creatorType: "admin",
    instructorName: "Nexura Hub Official (Admin)",
    studentName: "Alex Rahman",
    studentEmail: "student@nexurahub.com",
    price: 49.99,
    adminCommissionRate: 1.0, // 100% Admin course
    adminCommissionAmount: 49.99,
    instructorEarnings: 0,
    date: "2026-03-05 14:22",
    status: "completed",
    paymentMethod: "Stripe / Card",
  },
  {
    id: "TXN-98420",
    courseId: "course-1",
    courseTitle: "Master Modern React & Redux Toolkit Architecture",
    creatorType: "instructor",
    instructorName: "Jenny Jimenez",
    studentName: "Emma Watson",
    studentEmail: "emma.w@gmail.com",
    price: 39.99,
    adminCommissionRate: 0.05, // 5% Instructor course
    adminCommissionAmount: 2.00,
    instructorEarnings: 37.99,
    date: "2026-03-05 11:15",
    status: "completed",
    paymentMethod: "PayPal",
  },
  {
    id: "TXN-98419",
    courseId: "course-3",
    courseTitle: "TypeScript from Scratch to Professional Master",
    creatorType: "instructor",
    instructorName: "David Miller",
    studentName: "Liam Johnson",
    studentEmail: "liam.j@outlook.com",
    price: 29.99,
    adminCommissionRate: 0.05,
    adminCommissionAmount: 1.50,
    instructorEarnings: 28.49,
    date: "2026-03-04 18:40",
    status: "completed",
    paymentMethod: "Stripe / Card",
  },
  {
    id: "TXN-98418",
    courseId: "course-4",
    courseTitle: "UI/UX Design Systems with Figma & Tokens",
    creatorType: "instructor",
    instructorName: "Sophia Martinez",
    studentName: "Alex Rahman",
    studentEmail: "student@nexurahub.com",
    price: 34.99,
    adminCommissionRate: 0.05,
    adminCommissionAmount: 1.75,
    instructorEarnings: 33.24,
    date: "2026-03-04 09:12",
    status: "completed",
    paymentMethod: "SSLCommerz / Bkash",
  },
  {
    id: "TXN-98417",
    courseId: "course-2",
    courseTitle: "Complete Next.js 15 & Tailwind CSS Masterclass",
    creatorType: "admin",
    instructorName: "Nexura Hub Official (Admin)",
    studentName: "Liam Johnson",
    studentEmail: "liam.j@outlook.com",
    price: 49.99,
    adminCommissionRate: 1.0,
    adminCommissionAmount: 49.99,
    instructorEarnings: 0,
    date: "2026-03-03 21:05",
    status: "completed",
    paymentMethod: "Stripe / Card",
  },
  {
    id: "TXN-98416",
    courseId: "course-1",
    courseTitle: "Master Modern React & Redux Toolkit Architecture",
    creatorType: "instructor",
    instructorName: "Jenny Jimenez",
    studentName: "Sara Khan",
    studentEmail: "sara.k@gmail.com",
    price: 39.99,
    adminCommissionRate: 0.05,
    adminCommissionAmount: 2.00,
    instructorEarnings: 37.99,
    date: "2026-03-02 16:30",
    status: "completed",
    paymentMethod: "PayPal",
  },
];

const initialMonthlyGrowth: MonthlyGrowthData[] = [
  { month: "Oct", gmv: 4200, adminRevenue: 1450, instructorEarnings: 2750, students: 85, enrollments: 120 },
  { month: "Nov", gmv: 6800, adminRevenue: 2840, instructorEarnings: 3960, students: 140, enrollments: 195 },
  { month: "Dec", gmv: 9500, adminRevenue: 4120, instructorEarnings: 5380, students: 210, enrollments: 280 },
  { month: "Jan", gmv: 12400, adminRevenue: 5800, instructorEarnings: 6600, students: 310, enrollments: 390 },
  { month: "Feb", gmv: 16800, adminRevenue: 8900, instructorEarnings: 7900, students: 430, enrollments: 540 },
  { month: "Mar", gmv: 22600, adminRevenue: 12400, instructorEarnings: 10200, students: 580, enrollments: 720 },
];

const initialCategoryStats: CategoryStat[] = [
  { name: "Web Development", count: 12, revenue: 18450, color: "#0284c7" },
  { name: "Full Stack", count: 8, revenue: 26800, color: "#6366f1" },
  { name: "Programming", count: 10, revenue: 9400, color: "#10b981" },
  { name: "Design", count: 6, revenue: 7200, color: "#f59e0b" },
  { name: "DevOps", count: 4, revenue: 4100, color: "#ec4899" },
];

const initialState: AdminState = {
  courses: initialCourses,
  users: initialUsers,
  transactions: initialTransactions,
  monthlyGrowth: initialMonthlyGrowth,
  categoryStats: initialCategoryStats,
  isLoading: false,
  selectedTimeRange: "30d",
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setTimeRange: (state, action: PayloadAction<AdminState["selectedTimeRange"]>) => {
      state.selectedTimeRange = action.payload;
    },
    toggleCoursePublish: (state, action: PayloadAction<string | number>) => {
      const course = state.courses.find((c) => String(c.id) === String(action.payload));
      if (course) {
        course.isPublished = !course.isPublished;
      }
    },
    toggleCourseFeatured: (state, action: PayloadAction<string | number>) => {
      const course = state.courses.find((c) => String(c.id) === String(action.payload));
      if (course) {
        course.isFeatured = !course.isFeatured;
      }
    },
    deleteAdminCourse: (state, action: PayloadAction<string | number>) => {
      state.courses = state.courses.filter((c) => String(c.id) !== String(action.payload));
    },
    addAdminCourse: (state, action: PayloadAction<Partial<AdminCourse>>) => {
      const newCourse: AdminCourse = {
        id: `course-${Date.now()}`,
        title: action.payload.title || "Untitled Admin Course",
        subtitle: action.payload.subtitle || "",
        description: action.payload.description || "",
        category: action.payload.category || "Web Development",
        categoryId: action.payload.categoryId || "1",
        thumbnail: action.payload.thumbnail || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
        price: action.payload.price || 49.99,
        discountPrice: action.payload.discountPrice || 39.99,
        isPublished: action.payload.isPublished ?? true,
        isFeatured: action.payload.isFeatured ?? false,
        creatorType: "admin", // Admin courses yield 100% revenue!
        instructor: {
          id: "admin-1",
          name: "Nexura Hub Official (Admin)",
          designation: "Platform Core Team",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        },
        instructorEmail: "admin@nexurahub.com",
        enrollmentsCount: 0,
        totalRevenue: 0,
        adminEarnings: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      state.courses.unshift(newCourse);
    },
    updateAdminCourse: (state, action: PayloadAction<{ id: string | number; data: Partial<AdminCourse> }>) => {
      const index = state.courses.findIndex((c) => String(c.id) === String(action.payload.id));
      if (index !== -1) {
        state.courses[index] = { ...state.courses[index], ...action.payload.data };
      }
    },
    toggleUserStatus: (state, action: PayloadAction<{ userId: string | number; status: "active" | "suspended" }>) => {
      const user = state.users.find((u) => String(u.id) === String(action.payload.userId));
      if (user) {
        user.status = action.payload.status;
      }
    },
    updateUserRole: (state, action: PayloadAction<{ userId: string | number; role: ManagedUser["role"] }>) => {
      const user = state.users.find((u) => String(u.id) === String(action.payload.userId));
      if (user) {
        user.role = action.payload.role;
      }
    },
    deleteUser: (state, action: PayloadAction<string | number>) => {
      state.users = state.users.filter((u) => String(u.id) !== String(action.payload));
    },
    recordPurchase: (
      state,
      action: PayloadAction<{
        courseId: string | number;
        studentName: string;
        studentEmail: string;
        paymentMethod?: string;
      }>
    ) => {
      const course = state.courses.find((c) => String(c.id) === String(action.payload.courseId));
      if (!course) return;

      const price = course.discountPrice || course.price;
      const isAdminCourse = course.creatorType === "admin";
      const adminCommissionRate = isAdminCourse ? 1.0 : 0.05; // 5% for instructor, 100% for admin
      const adminCommissionAmount = Number((price * adminCommissionRate).toFixed(2));
      const instructorEarnings = Number((price * (1 - adminCommissionRate)).toFixed(2));

      // Update course metrics
      course.enrollmentsCount += 1;
      course.totalRevenue += price;
      course.adminEarnings += adminCommissionAmount;

      // Add to transaction log
      const newTxn: PlatformTransaction = {
        id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
        courseId: course.id,
        courseTitle: course.title,
        creatorType: course.creatorType,
        instructorName: course.instructor?.name || "Instructor",
        studentName: action.payload.studentName,
        studentEmail: action.payload.studentEmail,
        price,
        adminCommissionRate,
        adminCommissionAmount,
        instructorEarnings,
        date: new Date().toISOString().replace("T", " ").substring(0, 16),
        status: "completed",
        paymentMethod: action.payload.paymentMethod || "Card Payment",
      };

      state.transactions.unshift(newTxn);
    },
  },
});

export const {
  setTimeRange,
  toggleCoursePublish,
  toggleCourseFeatured,
  deleteAdminCourse,
  addAdminCourse,
  updateAdminCourse,
  toggleUserStatus,
  updateUserRole,
  deleteUser,
  recordPurchase,
} = adminSlice.actions;

export default adminSlice.reducer;
