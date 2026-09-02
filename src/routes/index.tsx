import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// Layouts
import RootLayout from "@/layouts/RootLayout";
import MainLayout from "@/layouts/MainLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import PlayerLayout from "@/layouts/PlayerLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AccountLayout from "@/layouts/AccountLayout";

// Main Pages
import HomePage from "@/pages/main/HomePage";
import CoursesPage from "@/pages/main/CoursesPage";
import CourseDetailPage from "@/pages/main/CourseDetailPage";
import InstructorProfilePage from "@/pages/main/InstructorProfilePage";
import EnrollSuccessPage from "@/pages/main/EnrollSuccessPage";
import AccountProfilePage from "@/pages/main/account/AccountProfilePage";
import EnrolledCoursesPage from "@/pages/main/account/EnrolledCoursesPage";

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

// Player Page
import CoursePlayerPage from "@/pages/player/CoursePlayerPage";

// Dashboard Pages
import DashboardOverviewPage from "@/pages/dashboard/DashboardOverviewPage";
import DashboardCoursesPage from "@/pages/dashboard/courses/DashboardCoursesPage";
import AddCoursePage from "@/pages/dashboard/courses/AddCoursePage";
import EditCoursePage from "@/pages/dashboard/courses/EditCoursePage";
import EditModulePage from "@/pages/dashboard/courses/EditModulePage";
import CourseEnrollmentsPage from "@/pages/dashboard/courses/CourseEnrollmentsPage";
import CourseReviewsPage from "@/pages/dashboard/courses/CourseReviewsPage";
import DashboardLivesPage from "@/pages/dashboard/lives/DashboardLivesPage";
import AddLivePage from "@/pages/dashboard/lives/AddLivePage";
import EditLivePage from "@/pages/dashboard/lives/EditLivePage";
import DashboardQuizSetsPage from "@/pages/dashboard/quiz-sets/DashboardQuizSetsPage";
import AddQuizSetPage from "@/pages/dashboard/quiz-sets/AddQuizSetPage";
import EditQuizSetPage from "@/pages/dashboard/quiz-sets/EditQuizSetPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
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
          // Account nested routes
          {
            path: "account",
            element: <AccountLayout />,
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
        element: <PlayerLayout />,
        children: [
          {
            index: true,
            element: <CoursePlayerPage />,
          },
        ],
      },

      // Dashboard Layout
      {
        path: "dashboard",
        element: <DashboardLayout />,
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

      // Catch-all
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
