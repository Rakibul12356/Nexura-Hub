import { useAuthStore } from "./useAuthStore";
import { useUiStore } from "./useUiStore";
import { useChatStore } from "./useChatStore";

export function useAppSelector<T>(selector: (state: any) => T): T {
  const auth = useAuthStore();
  const ui = useUiStore();
  const chat = useChatStore();

  const combinedState = {
    auth,
    ui,
    chat,
    courses: {
      courses: [],
      currentCourse: null,
      categories: [],
      enrolledCourses: [],
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
      monthlyGrowth: [],
      categoryStats: [],
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
