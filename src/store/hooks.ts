import { useAuthStore } from "./useAuthStore";
import { useUiStore } from "./useUiStore";
import { useChatStore } from "./useChatStore";

import { initialEnrolledCourses, initialCourses, initialCategories } from "@/services/courseService";

export function useAppSelector<T>(selector: (state: any) => T): T {
  const auth = useAuthStore();
  const ui = useUiStore();
  const chat = useChatStore();

  const combinedState = {
    auth,
    ui,
    chat,
    courses: {
      courses: initialCourses,
      currentCourse: null,
      categories: initialCategories,
      enrolledCourses: initialEnrolledCourses,
      isLoading: false,
      error: null,
      filters: {},
    },
    dashboard: {
      stats: null,
      instructorCourses: [],
      liveClasses: [],
      studentEnrollments: [],
      quizSets: [],
      isLoading: false,
      error: null,
    },
    admin: {
      users: [],
      courses: [],
      revenueStats: null,
      transactions: [],
      monthlyGrowth: [
        { month: "Jan", gmv: 12000, adminRevenue: 1800, instructorEarnings: 10200, students: 120, enrollments: 150 },
        { month: "Feb", gmv: 19000, adminRevenue: 2850, instructorEarnings: 16150, students: 210, enrollments: 260 },
        { month: "Mar", gmv: 25000, adminRevenue: 3750, instructorEarnings: 21250, students: 340, enrollments: 410 },
        { month: "Apr", gmv: 32000, adminRevenue: 4800, instructorEarnings: 27200, students: 480, enrollments: 590 },
        { month: "May", gmv: 41000, adminRevenue: 6150, instructorEarnings: 34850, students: 650, enrollments: 820 },
        { month: "Jun", gmv: 54000, adminRevenue: 8100, instructorEarnings: 45900, students: 890, enrollments: 1140 },
      ],
      categoryStats: [
        { name: "Web Development", count: 42, revenue: 24500, color: "#0284c7" },
        { name: "Mobile App Dev", count: 28, revenue: 16200, color: "#10b981" },
        { name: "Data Science & AI", count: 19, revenue: 11800, color: "#8b5cf6" },
        { name: "UI/UX Design", count: 15, revenue: 8400, color: "#f59e0b" },
        { name: "Cyber Security", count: 11, revenue: 6100, color: "#ef4444" },
      ],
      isLoading: false,
      error: null,
    },
  };

  return selector(combinedState);
}

export function useAppDispatch() {
  return (action: any) => {
    if (typeof action === "function") {
      return action(useAppDispatch(), () => ({
        auth: useAuthStore.getState(),
        ui: useUiStore.getState(),
        chat: useChatStore.getState(),
      }));
    }
    return action;
  };
}
