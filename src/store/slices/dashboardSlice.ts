import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardStats, LiveClass, StudentEnrollment } from "@/types/dashboard";
import { Course, Module, Lesson, QuizSet } from "@/types/course";
import { initialCourses } from "./courseSlice";

export const initialLives: LiveClass[] = [
  {
    id: 1,
    title: "Career In Backend Web Development",
    description: "Deep dive into career roadmaps, system design, and Node.js microservices.",
    date: "10 Nov 2024",
    time: "10:00 AM",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    isCompleted: false,
  },
  {
    id: 2,
    title: "Career In Frontend Development & Next.js",
    description: "Building production UI, performance optimization, and job hunting tips.",
    date: "12 Nov 2024",
    time: "08:30 PM",
    meetingLink: "https://zoom.us/j/123456789",
    isCompleted: false,
  },
];

export const initialQuizSets: QuizSet[] = [
  {
    id: 1,
    title: "React Fundamentals & Hooks Quiz Set",
    description: "Test your understanding of useState, useEffect, and custom hooks.",
    totalMarks: 20,
    isPublished: true,
    questions: [
      {
        id: "q-1",
        title: "Which hook is used for side effects in functional components?",
        description: "Standard lifecycle effect handler.",
        points: 5,
        options: [
          { id: "opt-1", label: "useEffect", isCorrect: true },
          { id: "opt-2", label: "useState", isCorrect: false },
          { id: "opt-3", label: "useReducer", isCorrect: false },
          { id: "opt-4", label: "useMemo", isCorrect: false },
        ],
      },
      {
        id: "q-2",
        title: "What does useState return?",
        description: "State tuple structure.",
        points: 5,
        options: [
          { id: "opt-21", label: "An array with state value and setter function", isCorrect: true },
          { id: "opt-22", label: "Just the current value", isCorrect: false },
          { id: "opt-23", label: "An object with get/set methods", isCorrect: false },
          { id: "opt-24", label: "A promise", isCorrect: false },
        ],
      },
    ],
  },
];

export const initialEnrollments: StudentEnrollment[] = [
  {
    id: "enr-1",
    studentName: "Rahim Ahmed",
    studentEmail: "rahim@example.com",
    courseTitle: "Reactive Accelerator",
    enrolledDate: "2024-01-10",
    progress: 75,
    paymentStatus: "paid",
  },
  {
    id: "enr-2",
    studentName: "Fatima Noor",
    studentEmail: "fatima@example.com",
    courseTitle: "Think In A Redux Way",
    enrolledDate: "2024-02-01",
    progress: 40,
    paymentStatus: "paid",
  },
  {
    id: "enr-3",
    studentName: "Tanvir Hasan",
    studentEmail: "tanvir@example.com",
    courseTitle: "Modern UI/UX Design with Tailwind",
    enrolledDate: "2024-02-15",
    progress: 90,
    paymentStatus: "paid",
  },
];

interface DashboardSliceState {
  stats: DashboardStats;
  instructorCourses: Course[];
  liveClasses: LiveClass[];
  quizSets: QuizSet[];
  enrollments: StudentEnrollment[];
  isLoading: boolean;
}

const initialState: DashboardSliceState = {
  stats: {
    totalCourses: 15,
    totalEnrollments: 1000,
    totalRevenue: 12000,
    totalStudents: 850,
  },
  instructorCourses: initialCourses,
  liveClasses: initialLives,
  quizSets: initialQuizSets,
  enrollments: initialEnrollments,
  isLoading: false,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    addCourse: (state, action: PayloadAction<Course>) => {
      state.instructorCourses.unshift(action.payload);
      state.stats.totalCourses += 1;
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.instructorCourses.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.instructorCourses[index] = action.payload;
      }
    },
    deleteCourse: (state, action: PayloadAction<string | number>) => {
      state.instructorCourses = state.instructorCourses.filter(
        (c) => c.id !== action.payload
      );
      state.stats.totalCourses = Math.max(0, state.stats.totalCourses - 1);
    },
    addLiveClass: (state, action: PayloadAction<LiveClass>) => {
      state.liveClasses.unshift(action.payload);
    },
    updateLiveClass: (state, action: PayloadAction<LiveClass>) => {
      const index = state.liveClasses.findIndex((l) => l.id === action.payload.id);
      if (index !== -1) {
        state.liveClasses[index] = action.payload;
      }
    },
    deleteLiveClass: (state, action: PayloadAction<string | number>) => {
      state.liveClasses = state.liveClasses.filter((l) => l.id !== action.payload);
    },
    addQuizSet: (state, action: PayloadAction<QuizSet>) => {
      state.quizSets.unshift(action.payload);
    },
    updateQuizSet: (state, action: PayloadAction<QuizSet>) => {
      const index = state.quizSets.findIndex((q) => q.id === action.payload.id);
      if (index !== -1) {
        state.quizSets[index] = action.payload;
      }
    },
    deleteQuizSet: (state, action: PayloadAction<string | number>) => {
      state.quizSets = state.quizSets.filter((q) => q.id !== action.payload);
    },
  },
});

export const {
  addCourse,
  updateCourse,
  deleteCourse,
  addLiveClass,
  updateLiveClass,
  deleteLiveClass,
  addQuizSet,
  updateQuizSet,
  deleteQuizSet,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
