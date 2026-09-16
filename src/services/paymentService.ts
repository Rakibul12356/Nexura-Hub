import apiClient from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { unwrapFromResponse } from "@/lib/api";
import {
  CouponValidation,
  DummyPaymentRequest,
  DummyPaymentResult,
  CertificatePayload,
  LessonCompleteResult,
  LessonNote,
  DiscussionThread,
} from "@/types/api";

export const paymentService = {
  async validateCoupon(code: string, courseId: string | number): Promise<CouponValidation> {
    const response = await apiClient.post(API_ENDPOINTS.COUPONS.VALIDATE, { code, courseId });
    return unwrapFromResponse<CouponValidation>(response);
  },

  async dummyPay(payload: DummyPaymentRequest): Promise<DummyPaymentResult> {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENTS.DUMMY, payload);
    return unwrapFromResponse<DummyPaymentResult>(response);
  },

  async getPayment(id: string | number): Promise<DummyPaymentResult> {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENTS.DETAILS(id));
    return unwrapFromResponse<DummyPaymentResult>(response);
  },
};

export const playerService = {
  async completeLesson(lessonId: string | number, completed = true): Promise<LessonCompleteResult> {
    const response = await apiClient.patch(API_ENDPOINTS.LESSONS.TOGGLE_COMPLETE(lessonId), { completed });
    return unwrapFromResponse<LessonCompleteResult>(response);
  },

  async getNotes(lessonId: string | number): Promise<LessonNote[]> {
    const response = await apiClient.get(API_ENDPOINTS.LESSONS.NOTES(lessonId));
    const data = unwrapFromResponse<LessonNote[] | { notes: LessonNote[] }>(response);
    return Array.isArray(data) ? data : data.notes || [];
  },

  async createNote(lessonId: string | number, payload: { timestamp: number; text: string }): Promise<LessonNote> {
    const response = await apiClient.post(API_ENDPOINTS.LESSONS.NOTES(lessonId), payload);
    return unwrapFromResponse<LessonNote>(response);
  },

  async deleteNote(lessonId: string | number, noteId: string | number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.LESSONS.DELETE_NOTE(lessonId, noteId));
  },

  async getDiscussions(lessonId: string | number): Promise<DiscussionThread[]> {
    const response = await apiClient.get(API_ENDPOINTS.LESSONS.DISCUSSIONS(lessonId));
    const data = unwrapFromResponse<DiscussionThread[] | { discussions: DiscussionThread[] }>(response);
    return Array.isArray(data) ? data : data.discussions || [];
  },

  async postDiscussion(lessonId: string | number, content: string): Promise<DiscussionThread> {
    const response = await apiClient.post(API_ENDPOINTS.LESSONS.DISCUSSIONS(lessonId), { content });
    return unwrapFromResponse<DiscussionThread>(response);
  },

  async replyDiscussion(discussionId: string | number, content: string): Promise<DiscussionThread> {
    const response = await apiClient.post(API_ENDPOINTS.DISCUSSIONS.REPLY(discussionId), { content });
    return unwrapFromResponse<DiscussionThread>(response);
  },

  async upvoteDiscussion(discussionId: string | number): Promise<DiscussionThread> {
    const response = await apiClient.post(API_ENDPOINTS.DISCUSSIONS.UPVOTE(discussionId));
    return unwrapFromResponse<DiscussionThread>(response);
  },

  async issueCertificate(courseId: string | number): Promise<CertificatePayload> {
    const response = await apiClient.post(API_ENDPOINTS.CERTIFICATES.ISSUE(courseId));
    return unwrapFromResponse<CertificatePayload>(response);
  },

  async getMyCertificate(courseId: string | number): Promise<CertificatePayload> {
    const response = await apiClient.get(API_ENDPOINTS.CERTIFICATES.MINE(courseId));
    return unwrapFromResponse<CertificatePayload>(response);
  },

  async verifyCertificate(publicId: string): Promise<CertificatePayload> {
    const response = await apiClient.get(API_ENDPOINTS.CERTIFICATES.VERIFY(publicId));
    return unwrapFromResponse<CertificatePayload>(response);
  },
};

export default paymentService;
