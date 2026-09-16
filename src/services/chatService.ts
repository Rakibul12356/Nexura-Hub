import apiClient from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/api/endpoints";
import { unwrapFromResponse, unwrapListFromResponse } from "@/lib/api";
import { ChatConversation, ChatMessage } from "@/types/chat";
import { NotificationItem } from "@/types/api";

export const chatService = {
  async getConversations(): Promise<ChatConversation[]> {
    const response = await apiClient.get(API_ENDPOINTS.CHAT.CONVERSATIONS);
    return unwrapListFromResponse<ChatConversation>(response);
  },

  async getConversation(id: string | number): Promise<ChatConversation> {
    const response = await apiClient.get(API_ENDPOINTS.CHAT.CONVERSATION(id));
    return unwrapFromResponse<ChatConversation>(response);
  },

  async getMessages(conversationId: string | number, params?: { page?: number; limit?: number }): Promise<ChatMessage[]> {
    const response = await apiClient.get(API_ENDPOINTS.CHAT.MESSAGES(conversationId), {
      params: { page: params?.page ?? 1, limit: params?.limit ?? 50 },
    });
    return unwrapListFromResponse<ChatMessage>(response);
  },

  async createDirect(userId: string | number): Promise<ChatConversation> {
    const response = await apiClient.post(API_ENDPOINTS.CHAT.DIRECT, { userId });
    return unwrapFromResponse<ChatConversation>(response);
  },

  async createGroup(payload: { courseId: string | number; groupName: string }): Promise<ChatConversation> {
    const response = await apiClient.post(API_ENDPOINTS.CHAT.GROUPS, payload);
    return unwrapFromResponse<ChatConversation>(response);
  },

  async markRead(conversationId: string | number): Promise<void> {
    await apiClient.post(API_ENDPOINTS.CHAT.READ(conversationId));
  },

  async sendMessage(payload: {
    conversationId: string;
    content: string;
    imageUrl?: string;
    replyToId?: string;
  }): Promise<ChatMessage> {
    const response = await apiClient.post(API_ENDPOINTS.CHAT.SEND, payload);
    return unwrapFromResponse<ChatMessage>(response);
  },

  async unsendMessage(messageId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CHAT.DELETE_MESSAGE(messageId));
  },

  async toggleReaction(messageId: string, emoji: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.CHAT.REACT(messageId), { emoji });
  },

  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post(API_ENDPOINTS.CHAT.UPLOAD_IMAGE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapFromResponse<{ url: string }>(response);
  },
};

export const notificationService = {
  async list(): Promise<NotificationItem[]> {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.LIST);
    return unwrapListFromResponse<NotificationItem>(response);
  },

  async markRead(id: string | number): Promise<void> {
    await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS.READ(id));
  },

  async markAllRead(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
  },

  async unreadCount(): Promise<number> {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
    const data = unwrapFromResponse<{ count: number } | number>(response);
    return typeof data === "number" ? data : data.count ?? 0;
  },
};

export const mediaService = {
  async upload(
    endpoint: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ url: string; size?: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        if (event.total && onProgress) {
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      },
    });
    return unwrapFromResponse<{ url: string; size?: string }>(response);
  },
};

export default chatService;
