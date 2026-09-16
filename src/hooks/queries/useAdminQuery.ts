import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import adminService from "@/services/adminService";
import { paymentService, playerService } from "@/services/paymentService";
import { chatService, notificationService } from "@/services/chatService";
import { Coupon, DummyPaymentRequest } from "@/types/api";
import { Role } from "@/types/auth";
import { ManagedUser } from "@/types/admin";
import { getApiError } from "@/lib/api";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";

export const useAdminOverviewQuery = () => {
  return useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => adminService.getOverviewStats(),
  });
};

export const useAdminRevenueQuery = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["admin", "revenue", params],
    queryFn: () => adminService.getRevenueStats(params),
  });
};

export const useAdminWalletQuery = () => {
  return useQuery({
    queryKey: ["admin", "wallet"],
    queryFn: () => adminService.getWallet(),
  });
};

export const useAdminUsersQuery = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => adminService.getUsers(params),
  });
};

export const useUpdateUserRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string | number; role: Role }) =>
      adminService.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User role updated");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to update role")),
  });
};

export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string | number; status: ManagedUser["status"] }) =>
      adminService.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User status updated");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to update status")),
  });
};

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User account removed");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to delete user")),
  });
};

export const useCouponsQuery = () => {
  return useQuery({
    queryKey: ["coupons"],
    queryFn: () => adminService.getCoupons(),
  });
};

export const useCreateCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Coupon>) => adminService.createCoupon(data),
    onSuccess: (coupon) => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success(`Promo coupon '${coupon.code}' created successfully!`);
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to create coupon")),
  });
};

export const useDeleteCouponMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => adminService.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.info("Coupon promo deleted.");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to delete coupon")),
  });
};

export const useDummyPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DummyPaymentRequest) => paymentService.dummyPay(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolled-courses"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment-status"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["chat"] });
      toast.success("Payment completed successfully!");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Payment failed")),
  });
};

export const useValidateCouponMutation = () => {
  return useMutation({
    mutationFn: ({ code, courseId }: { code: string; courseId: string | number }) =>
      paymentService.validateCoupon(code, courseId),
    onError: (error: unknown) => toast.error(getApiError(error, "Invalid promo coupon code.")),
  });
};

export const useNotificationsQuery = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.list(),
    enabled: isAuthenticated,
  });
};

export const useUnreadNotificationCountQuery = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => notificationService.unreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });
};

export const useMarkNotificationsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useConversationsQuery = (enabled = true) => {
  return useQuery({
    queryKey: ["chat", "conversations"],
    queryFn: () => chatService.getConversations(),
    enabled,
  });
};

export const useConversationMessagesQuery = (conversationId: string | null) => {
  return useQuery({
    queryKey: ["chat", "messages", conversationId],
    queryFn: () => chatService.getMessages(conversationId as string),
    enabled: Boolean(conversationId),
  });
};

export const useCreateChatGroupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { courseId: string | number; groupName: string }) =>
      chatService.createGroup(payload),
    onSuccess: (conv) => {
      queryClient.invalidateQueries({ queryKey: ["chat", "conversations"] });
      toast.success(`Group "${conv.name}" created successfully!`);
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to create group")),
  });
};

export const useLessonNotesQuery = (lessonId?: string | number) => {
  return useQuery({
    queryKey: ["lesson-notes", String(lessonId)],
    queryFn: () => playerService.getNotes(lessonId as string | number),
    enabled: Boolean(lessonId),
  });
};

export const useLessonDiscussionsQuery = (lessonId?: string | number) => {
  return useQuery({
    queryKey: ["lesson-discussions", String(lessonId)],
    queryFn: () => playerService.getDiscussions(lessonId as string | number),
    enabled: Boolean(lessonId),
  });
};

export const useCompleteLessonMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string | number) => playerService.completeLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({ queryKey: ["lesson"] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-courses"] });
    },
  });
};

export const useCreateNoteMutation = (lessonId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { timestamp: number; text: string }) =>
      playerService.createNote(lessonId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-notes", String(lessonId)] });
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to save note")),
  });
};

export const useDeleteNoteMutation = (lessonId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string | number) => playerService.deleteNote(lessonId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-notes", String(lessonId)] });
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to delete note")),
  });
};

export const usePostDiscussionMutation = (lessonId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => playerService.postDiscussion(lessonId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-discussions", String(lessonId)] });
      toast.success("Question posted to discussion board!");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to post question")),
  });
};

export const useReplyDiscussionMutation = (lessonId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ discussionId, content }: { discussionId: string | number; content: string }) =>
      playerService.replyDiscussion(discussionId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-discussions", String(lessonId)] });
      toast.success("Reply submitted.");
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to reply")),
  });
};

export const useUpvoteDiscussionMutation = (lessonId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (discussionId: string | number) => playerService.upvoteDiscussion(discussionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-discussions", String(lessonId)] });
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Failed to upvote")),
  });
};

export const useMyCertificateQuery = (courseId?: string | number) => {
  return useQuery({
    queryKey: ["certificate", String(courseId)],
    queryFn: () => playerService.getMyCertificate(courseId as string | number),
    enabled: Boolean(courseId),
    retry: false,
  });
};

export const useIssueCertificateMutation = (courseId: string | number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => playerService.issueCertificate(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificate", String(courseId)] });
    },
    onError: (error: unknown) => toast.error(getApiError(error, "Certificate is available after 100% progress")),
  });
};
