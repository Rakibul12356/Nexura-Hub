import { Course } from "./course";
import { User, Role } from "./auth";

export interface AdminStats {
  totalRevenue: number;         // Total Platform Gross Merchandise Value (GMV)
  adminNetCommission: number;   // 5% of instructor courses + 100% of admin courses
  instructorPayouts: number;    // 95% of instructor course sales
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  activeEnrollments: number;
  growthRate: {
    revenue: number;
    students: number;
    courses: number;
  };
}

export interface PlatformTransaction {
  id: string;
  courseId: string | number;
  courseTitle: string;
  creatorType: "instructor" | "admin";
  instructorName: string;
  studentName: string;
  studentEmail: string;
  price: number;
  adminCommissionRate: number;  // 0.05 (5%) for instructor, 1.0 (100%) for admin
  adminCommissionAmount: number;
  instructorEarnings: number;
  date: string;
  status: "completed" | "pending" | "refunded";
  paymentMethod: string;
}

export interface ManagedUser {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  avatar?: string;
  status: "active" | "suspended" | "pending";
  joinDate: string;
  enrolledCoursesCount?: number;
  totalSpent?: number;
  createdCoursesCount?: number;
  totalStudentsCount?: number;
  totalEarnings?: number;
  adminCommissionGenerated?: number;
  phone?: string;
  bio?: string;
}

export interface MonthlyGrowthData {
  month: string;
  gmv: number;                  // Total sales
  adminRevenue: number;         // Admin net earnings (5% + self courses)
  instructorEarnings: number;   // Instructor 95% earnings
  students: number;             // New student signups
  enrollments: number;          // Total course enrollments
}

export interface CategoryStat {
  name: string;
  count: number;
  revenue: number;
  color: string;
}
