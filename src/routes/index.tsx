import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import PageLoader from "@/components/common/page-loader";

// Layouts
import RootLayout from "@/layouts/RootLayout";
import MainLayout from "@/layouts/MainLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import AdminLayout from "@/layouts/AdminLayout";
import PlayerLayout from "@/layouts/PlayerLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AccountLayout from "@/layouts/AccountLayout";

// Helper for Lazy Loading components with Suspense fallback
const Loadable = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => {
  return (props: any) => (
    <Suspense fallback={<PageLoader />}>
      <Component {...props} />
    </Suspense>
  );
};

// Main Pages (Lazy Loaded)
const HomePage = Loadable(lazy(() => import("@/pages/main/HomePage")));
const CoursesPage = Loadable(lazy(() => import("@/pages/main/CoursesPage")));
const CourseDetailPage = Loadable(lazy(() => import("@/pages/main/CourseDetailPage")));
const InstructorProfilePage = Loadable(lazy(() => import("@/pages/main/InstructorProfilePage")));
const EnrollSuccessPage = Loadable(lazy(() => import("@/pages/main/EnrollSuccessPage")));
const AccountProfilePage = Loadable(lazy(() => import("@/pages/main/account/AccountProfilePage")));
const EnrolledCoursesPage = Loadable(lazy(() => import("@/pages/main/account/EnrolledCoursesPage")));
const ChatPage = Loadable(lazy(() => import("@/pages/main/ChatPage")));

// Auth Pages (Lazy Loaded)
const LoginPage = Loadable(lazy(() => import("@/pages/auth/LoginPage")));
const RegisterPage = Loadable(lazy(() => import("@/pages/auth/RegisterPage")));

// Player Page (Lazy Loaded)
const CoursePlayerPage = Loadable(lazy(() => import("@/pages/player/CoursePlayerPage")));

// Instructor Pages (Instructor Studio) (Lazy Loaded)
const DashboardOverviewPage = Loadable(lazy(() => import("@/pages/instructor/DashboardOverviewPage")));
const DashboardCoursesPage = Loadable(lazy(() => import("@/pages/instructor/courses/DashboardCoursesPage")));
const AddCoursePage = Loadable(lazy(() => import("@/pages/instructor/courses/AddCoursePage")));
const EditCoursePage = Loadable(lazy(() => import("@/pages/instructor/courses/EditCoursePage")));
const EditModulePage = Loadable(lazy(() => import("@/pages/instructor/courses/EditModulePage")));
const CourseEnrollmentsPage = Loadable(lazy(() => import("@/pages/instructor/courses/CourseEnrollmentsPage")));
const CourseReviewsPage = Loadable(lazy(() => import("@/pages/instructor/courses/CourseReviewsPage")));
const DashboardLivesPage = Loadable(lazy(() => import("@/pages/instructor/lives/DashboardLivesPage")));
const AddLivePage = Loadable(lazy(() => import("@/pages/instructor/lives/AddLivePage")));
const EditLivePage = Loadable(lazy(() => import("@/pages/instructor/lives/EditLivePage")));
const DashboardQuizSetsPage = Loadable(lazy(() => import("@/pages/instructor/quiz-sets/DashboardQuizSetsPage")));
const AddQuizSetPage = Loadable(lazy(() => import("@/pages/instructor/quiz-sets/AddQuizSetPage")));
const EditQuizSetPage = Loadable(lazy(() => import("@/pages/instructor/quiz-sets/EditQuizSetPage")));

// Admin Control Hub Pages (Lazy Loaded)
const AdminOverviewPage = Loadable(lazy(() => import("@/pages/admin/AdminOverviewPage")));
const AdminCoursesPage = Loadable(lazy(() => import("@/pages/admin/AdminCoursesPage")));
const AdminUsersPage = Loadable(lazy(() => import("@/pages/admin/AdminUsersPage")));
const AdminRevenuePage = Loadable(lazy(() => import("@/pages/admin/AdminRevenuePage")));

import ProtectedRoute from "@/components/common/ProtectedRoute";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: (
      <ErrorBoundary>
        <div />
      </ErrorBoundary>
    ),
    children: [
      // Public / Main Layout
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "courses",
            element: <CoursesPage />,
          },
          {
            path: "courses/:courseId",
            element: <CourseDetailPage />,
          },
          {
            path: "inst-profile",
            element: <InstructorProfilePage />,
          },
          {
            path: "enroll-success",
            element: <EnrollSuccessPage />,
          },
          {
            path: "messages",
            element: <ChatPage />,
          },
          // Account nested routes
          {
            path: "account",
            element: (
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            ),
            children: [
              {
                index: true,
                element: <AccountProfilePage />,
              },
              {
                path: "enrolled-courses",
                element: <EnrolledCoursesPage />,
              },
            ],
          },
        ],
      },

      // Auth Layout
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "register",
            element: <RegisterPage />,
          },
        ],
      },

      // Player / Learning Layout
      {
        path: "player/:courseSlug/:lessonId",
        element: (
          <ProtectedRoute>
            <PlayerLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <CoursePlayerPage />,
          },
        ],
      },

      // Instructor Studio Dashboard Layout
      {
        path: "dashboard",
        element: (
          <ProtectedRoute requiredRoles={["instructor", "admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardOverviewPage />,
          },
          {
            path: "courses",
            element: <DashboardCoursesPage />,
          },
          {
            path: "courses/add",
            element: <AddCoursePage />,
          },
          {
            path: "courses/:courseId",
            element: <EditCoursePage />,
          },
          {
            path: "courses/:courseId/modules/:moduleId",
            element: <EditModulePage />,
          },
          {
            path: "courses/:courseId/enrollments",
            element: <CourseEnrollmentsPage />,
          },
          {
            path: "courses/:courseId/reviews",
            element: <CourseReviewsPage />,
          },
          {
            path: "lives",
            element: <DashboardLivesPage />,
          },
          {
            path: "lives/add",
            element: <AddLivePage />,
          },
          {
            path: "lives/:liveId",
            element: <EditLivePage />,
          },
          {
            path: "quiz-sets",
            element: <DashboardQuizSetsPage />,
          },
          {
            path: "quiz-sets/add",
            element: <AddQuizSetPage />,
          },
          {
            path: "quiz-sets/:quizSetId",
            element: <EditQuizSetPage />,
          },
        ],
      },

      // Admin SuperAdmin Dashboard Layout (Uses Common DashboardLayout)
      {
        path: "admin",
        element: (
          <ProtectedRoute requiredRoles={["admin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <AdminOverviewPage />,
          },
          {
            path: "courses",
            element: <AdminCoursesPage />,
          },
          {
            path: "users",
            element: <AdminUsersPage />,
          },
          {
            path: "revenue",
            element: <AdminRevenuePage />,
          },
        ],
      },

      // Catch-all
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
