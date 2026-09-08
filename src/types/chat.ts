export interface ChatUser {
  id: string | number;
  name: string;
  avatar: string;
  role: "student" | "instructor" | "admin";
  isOnline?: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string | number;
  senderName: string;
  senderAvatar: string;
  senderRole: "student" | "instructor" | "admin";
  content: string;
  timestamp: string;
  isRead?: boolean;
  imageUrl?: string;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
  attachment?: {
    type: "image" | "file" | "code";
    url: string;
    name: string;
  };
}

export interface ChatConversation {
  id: string;
  type: "direct" | "group";
  name: string;
  avatar?: string;
  courseId?: string | number;
  courseTitle?: string;
  instructorId?: string | number;
  members: ChatUser[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  updatedAt: string;
}
