export interface DashboardStats {
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  totalStudents: number;
}

export interface LiveClass {
  id: string | number;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration?: string;
  meetingLink?: string;
  isCompleted?: boolean;
}

export interface StudentEnrollment {
  id: string | number;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  courseTitle: string;
  enrolledDate: string;
  progress: number;
  paymentStatus: "paid" | "pending" | "failed";
}
