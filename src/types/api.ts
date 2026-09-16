import { Role } from "./auth";
import { Course } from "./course";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EnrollmentStatus {
  isEnrolled: boolean;
  id?: string;
  progress?: number;
  paymentStatus?: "paid" | "pending" | "failed";
}

export interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  expiryDate: string;
  maxRedemptions: number;
  redemptionCount: number;
  isActive: boolean;
}

export interface CouponValidation {
  valid: boolean;
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  discountAmount: number;
  finalPrice: number;
}

export interface DummyPaymentRequest {
  courseId: string | number;
  couponCode?: string;
  gateway?: "stripe" | "sslcommerz" | "shurjopay" | "dummy";
}

export interface DummyPaymentResult {
  paymentId: string;
  transactionId: string;
  isDummy: boolean;
  courseId: string;
  courseTitle: string;
  originalPrice: number;
  discountAmount: number;
  amountPaid: number;
  gateway: string;
  gatewayLabel?: string;
  paymentMethod: string;
  paidAt: string;
  enrollment: {
    id: string;
    isEnrolled: boolean;
    paymentStatus: string;
  };
  split?: {
    creatorType: "instructor" | "admin";
    adminCommissionRate: number;
    adminCommissionAmount: number;
    instructorEarnings: number;
  };
  adminWallet?: {
    credited: number;
    balanceAfter: number;
  };
}

export interface WalletLedgerEntry {
  id: string;
  entryType: "credit" | "debit";
  amount: number;
  balanceAfter: number;
  note?: string;
  createdAt: string;
}

export interface Wallet {
  ownerType: "admin" | "instructor";
  balance: number;
  currency: string;
  isDummy: boolean;
  lifetimeCredits: number;
  recent: WalletLedgerEntry[];
}

export interface NotificationItem {
  id: string;
  type: "live" | "discussion" | "quiz" | "system" | "enrollment" | "payment";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface CertificatePayload {
  publicId: string;
  studentName: string;
  courseTitle: string;
  completionDate: string;
  verifyUrl: string;
}

export interface InstructorPublicProfile {
  id: string;
  name: string;
  designation?: string;
  avatar?: string;
  bio?: string;
  coursesCount?: number;
  studentsCount?: number;
  reviewsCount?: number;
  rating?: number;
  courses?: Course[];
}

export interface DiscussionReply {
  id: string;
  userName: string;
  userAvatar?: string;
  userRole: Role;
  content: string;
  createdAt: string;
}

export interface DiscussionThread {
  id: string;
  userName: string;
  userAvatar?: string;
  userRole: Role;
  content: string;
  createdAt: string;
  upvotes: number;
  replies: DiscussionReply[];
}

export interface LessonNote {
  id: string;
  timestamp: number;
  text: string;
  createdAt: string;
}

export interface QuizSubmitResult {
  score: number;
  total: number;
  passed: boolean;
  correctCount: number;
  totalQuestions: number;
}

export interface LessonCompleteResult {
  completed: boolean;
  progress: number;
}

export interface AdminOverviewData {
  totalRevenue: number;
  adminNetCommission: number;
  instructorPayouts: number;
  dummyWalletBalance?: number;
  isDummyPayments?: boolean;
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  activeEnrollments: number;
  growthRate?: {
    revenue: number;
    students: number;
    courses: number;
  };
  monthlyGrowth?: Array<{
    month: string;
    gmv: number;
    adminRevenue: number;
    instructorEarnings: number;
    students: number;
    enrollments: number;
  }>;
  categoryStats?: Array<{
    name: string;
    count: number;
    revenue: number;
    color: string;
  }>;
  recentTransactions?: import("./admin").PlatformTransaction[];
}

export interface RevenueLedgerData {
  totalGmv: number;
  adminNetCommission: number;
  instructorPayouts: number;
  dummyWalletBalance?: number;
  isDummyPayments?: boolean;
  instructorCourseSales?: number;
  admin5PercentCut?: number;
  adminDirectCourseSales?: number;
  monthlyGrowth?: AdminOverviewData["monthlyGrowth"];
  transactions: import("./admin").PlatformTransaction[];
}
