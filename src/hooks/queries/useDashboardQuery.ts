import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "@/services/apiService";
import { dashboardService } from "@/services/dashboardService";
import { courseService } from "@/services/courseService";
import { LiveClass } from "@/types/dashboard";
import { Lesson, Module, QuizQuestion, QuizSet } from "@/types/course";
import { getApiError } from "@/lib/api";
import { toast } from "react-toastify";

export const useDashboardStatsQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardApi.getStats(),
  });
};

export const useInstructorCoursesQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "instructor-courses"],
    queryFn: () => dashboardApi.getInstructorCourses(),
  });
};

export const useLiveClassesQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "live-classes"],
    queryFn: () => dashboardApi.getLiveClasses(),
  });
};

export const useCreateLiveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<LiveClass>) => dashboardService.createLive(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "live-classes"] });
      toast.success("Live class scheduled successfully!");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to schedule live class")),
  });
};

export const useUpdateLiveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<LiveClass> }) =>
      dashboardService.updateLive(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "live-classes"] });
      toast.success("Live class updated successfully!");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to update live class")),
  });
};

export const useDeleteLiveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => dashboardService.deleteLive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "live-classes"] });
      toast.success("Live class deleted");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to delete live class")),
  });
};

export const useQuizSetsQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "quiz-sets"],
    queryFn: () => dashboardApi.getQuizSets(),
  });
};

export const useQuizSetQuery = (id?: string | number) => {
  return useQuery({
    queryKey: ["quiz-set", String(id)],
    queryFn: () => dashboardService.getQuizSet(id as string | number),
    enabled: Boolean(id),
  });
};

export const useCreateQuizSetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<QuizSet>) => dashboardService.createQuizSet(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "quiz-sets"] });
      toast.success("Quiz set created! Add questions now.");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to create quiz set")),
  });
};

export const useUpdateQuizSetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<QuizSet> }) =>
      dashboardService.updateQuizSet(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "quiz-sets"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-set", String(variables.id)] });
      toast.success("Quiz set updated!");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to update quiz set")),
  });
};

export const useDeleteQuizSetMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => dashboardService.deleteQuizSet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "quiz-sets"] });
      toast.success("Quiz set deleted");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to delete quiz set")),
  });
};

export const useAddQuizQuestionMutation = (quizId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<QuizQuestion>) => dashboardService.addQuizQuestion(quizId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-set", String(quizId)] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "quiz-sets"] });
      toast.success("Question added to quiz set!");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to add question")),
  });
};

export const useDeleteQuizQuestionMutation = (quizId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (qId: string | number) => dashboardService.deleteQuizQuestion(quizId, qId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-set", String(quizId)] });
      toast.info("Question removed");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to delete question")),
  });
};

export const useStudentEnrollmentsQuery = (limit?: number) => {
  return useQuery({
    queryKey: ["dashboard", "student-enrollments", limit],
    queryFn: () => dashboardService.getEnrollments(limit ? { limit } : undefined),
  });
};

export const useCourseEnrollmentsQuery = (courseId?: string) => {
  return useQuery({
    queryKey: ["course-enrollments", courseId],
    queryFn: () => dashboardService.getCourseEnrollments(courseId as string),
    enabled: Boolean(courseId),
  });
};

export const useInstructorWalletQuery = () => {
  return useQuery({
    queryKey: ["dashboard", "wallet"],
    queryFn: () => dashboardService.getWallet(),
  });
};

export const useModuleQuery = (moduleId?: string) => {
  return useQuery({
    queryKey: ["module", moduleId],
    queryFn: () => courseService.getModule(moduleId as string),
    enabled: Boolean(moduleId),
  });
};

export const useCreateModuleMutation = (courseId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Module>) => courseService.createModule(courseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", String(courseId)] });
      toast.success("Module created!");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to create module")),
  });
};

export const useUpdateModuleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Module> }) =>
      courseService.updateModule(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["module", String(variables.id)] });
      toast.success("Module updated");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to update module")),
  });
};

export const useCreateLessonMutation = (moduleId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Lesson>) => courseService.createLesson(moduleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module", String(moduleId)] });
      toast.success("Lesson created");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to create lesson")),
  });
};

export const useUpdateLessonMutation = (moduleId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<Lesson> }) =>
      courseService.updateLesson(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module", String(moduleId)] });
      toast.success("Lesson saved");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to save lesson")),
  });
};

export const useDeleteLessonMutation = (moduleId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => courseService.deleteLesson(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module", String(moduleId)] });
      toast.success("Lesson deleted");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to delete lesson")),
  });
};

export const useDeleteModuleMutation = (courseId?: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => courseService.deleteModule(id),
    onSuccess: () => {
      if (courseId) queryClient.invalidateQueries({ queryKey: ["course", String(courseId)] });
      toast.success("Module deleted successfully");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to delete module")),
  });
};

export const useReorderLessonsMutation = (moduleId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonIds: (string | number)[]) => courseService.reorderLessons(moduleId, lessonIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["module", String(moduleId)] });
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to reorder lessons")),
  });
};

export const useSubmitQuizMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      quizId,
      lessonId,
      answers,
    }: {
      quizId: string | number;
      lessonId?: string | number;
      answers: Record<string, string>;
    }) => dashboardService.submitQuiz(quizId, { lessonId, answers }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-courses"] });
      if (result.passed) {
        toast.success(`Quiz passed! Score ${result.score}/${result.total}`);
      } else {
        toast.error(`You scored ${result.score}/${result.total}. Need at least 50% to pass.`);
      }
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to submit quiz")),
  });
};
