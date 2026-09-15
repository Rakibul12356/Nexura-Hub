import { create } from "zustand";
import { ChatConversation, ChatMessage, ChatUser } from "@/types/chat";

interface ChatStoreState {
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  isLoading: boolean;
  isSocketConnected: boolean;
  typingUsers: Record<string, { userId: string | number; userName: string }[]>;

  // Actions
  setSocketConnected: (isConnected: boolean) => void;
  receiveSocketMessage: (data: { conversationId: string; message: ChatMessage }) => void;
  setTypingStatus: (data: {
    conversationId: string;
    userId: string | number;
    userName: string;
    isTyping: boolean;
  }) => void;
  updateUserPresence: (data: { userId: string | number; isOnline: boolean }) => void;
  setActiveConversation: (id: string | null) => void;
  sendMessage: (data: {
    conversationId: string;
    content: string;
    sender: ChatUser;
    imageUrl?: string;
    replyTo?: { id: string; senderName: string; content: string };
  }) => void;
  unsendMessage: (data: { conversationId: string; messageId: string }) => void;
  toggleMessageReaction: (data: {
    conversationId: string;
    messageId: string;
    emoji: string;
    userId: string | number;
  }) => void;
  createCourseGroup: (data: {
    courseId: string | number;
    courseTitle: string;
    groupName: string;
    instructor: ChatUser;
  }) => void;
  autoJoinCourseGroupOnEnroll: (data: {
    courseId: string | number;
    courseTitle: string;
    student: ChatUser;
    instructor: ChatUser;
  }) => void;
}

const initialConversations: ChatConversation[] = [
  {
    id: "group-1",
    type: "group",
    name: "Reactive Accelerator - Batch 1 Community",
    avatar: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150&auto=format&fit=crop&q=80",
    courseId: 1,
    courseTitle: "Reactive Accelerator",
    instructorId: 101,
    members: [
      { id: 101, name: "Tapas Adhikary", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", role: "instructor", isOnline: true },
      { id: "user-1", name: "Rahim Ahmed", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", role: "student", isOnline: true },
      { id: "user-2", name: "Fatima Noor", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", role: "student", isOnline: false },
      { id: "user-3", name: "Tanvir Hasan", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80", role: "student", isOnline: true },
    ],
    lastMessage: {
      id: "m-group-3",
      senderId: 101,
      senderName: "Tapas Adhikary",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      senderRole: "instructor",
      content: "Welcome everyone to the React Accelerator group! Ask any module 2 questions here.",
      timestamp: "10:30 AM",
      isRead: true,
    },
    unreadCount: 0,
    updatedAt: "10:30 AM",
  },
  {
    id: "direct-101",
    type: "direct",
    name: "Tapas Adhikary (Instructor)",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    instructorId: 101,
    courseTitle: "Reactive Accelerator",
    members: [
      { id: 101, name: "Tapas Adhikary", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", role: "instructor", isOnline: true },
    ],
    lastMessage: {
      id: "m-direct-2",
      senderId: 101,
      senderName: "Tapas Adhikary",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      senderRole: "instructor",
      content: "Hi Rahim! Thanks for enrolling. Feel free to reach out if you get stuck on TanStack Query.",
      timestamp: "Yesterday",
      isRead: false,
    },
    unreadCount: 1,
    updatedAt: "Yesterday",
  },
];

const initialMessages: Record<string, ChatMessage[]> = {
  "group-1": [
    {
      id: "m-group-1",
      senderId: "user-3",
      senderName: "Tanvir Hasan",
      senderAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      senderRole: "student",
      content: "Has anyone completed the quiz in chapter 3?",
      timestamp: "09:15 AM",
      isRead: true,
    },
    {
      id: "m-group-2",
      senderId: "user-2",
      senderName: "Fatima Noor",
      senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      senderRole: "student",
      content: "Yes! Make sure to review the custom hook assignment first.",
      timestamp: "09:40 AM",
      isRead: true,
    },
    {
      id: "m-group-3",
      senderId: 101,
      senderName: "Tapas Adhikary",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      senderRole: "instructor",
      content: "Welcome everyone to the React Accelerator group! Ask any module 2 questions here.",
      timestamp: "10:30 AM",
      isRead: true,
    },
  ],
  "direct-101": [
    {
      id: "m-direct-1",
      senderId: "user-1",
      senderName: "Rahim Ahmed",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      senderRole: "student",
      content: "Hello Tapas Sir, excited to start this course!",
      timestamp: "Yesterday",
      isRead: true,
    },
    {
      id: "m-direct-2",
      senderId: 101,
      senderName: "Tapas Adhikary",
      senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      senderRole: "instructor",
      content: "Hi Rahim! Thanks for enrolling. Feel free to reach out if you get stuck on TanStack Query.",
      timestamp: "Yesterday",
      isRead: false,
    },
  ],
};

export const useChatStore = create<ChatStoreState>((set) => ({
  conversations: initialConversations,
  messages: initialMessages,
  activeConversationId: "group-1",
  isLoading: false,
  isSocketConnected: false,
  typingUsers: {},

  setSocketConnected: (isConnected: boolean) => set({ isSocketConnected: isConnected }),

  receiveSocketMessage: ({ conversationId, message }) =>
    set((state) => {
      const currentMessages = state.messages[conversationId] || [];
      if (currentMessages.some((m) => m.id === message.id)) return state;

      const updatedMessages = [...currentMessages, message];
      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: message,
            updatedAt: message.timestamp || "Just now",
            unreadCount: state.activeConversationId !== conversationId ? conv.unreadCount + 1 : conv.unreadCount,
          };
        }
        return conv;
      });

      return {
        messages: { ...state.messages, [conversationId]: updatedMessages },
        conversations: updatedConversations,
      };
    }),

  setTypingStatus: ({ conversationId, userId, userName, isTyping }) =>
    set((state) => {
      const currentList = state.typingUsers[conversationId] || [];
      let updatedList = [...currentList];

      if (isTyping) {
        if (!updatedList.some((u) => u.userId === userId)) {
          updatedList.push({ userId, userName });
        }
      } else {
        updatedList = updatedList.filter((u) => u.userId !== userId);
      }

      return {
        typingUsers: { ...state.typingUsers, [conversationId]: updatedList },
      };
    }),

  updateUserPresence: ({ userId, isOnline }) =>
    set((state) => ({
      conversations: state.conversations.map((conv) => ({
        ...conv,
        members: conv.members.map((member) =>
          member.id === userId ? { ...member, isOnline } : member
        ),
      })),
    })),

  setActiveConversation: (id: string | null) =>
    set((state) => ({
      activeConversationId: id,
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, unreadCount: 0 } : conv
      ),
    })),

  sendMessage: ({ conversationId, content, sender, imageUrl, replyTo }) =>
    set((state) => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: sender.id,
        senderName: sender.name,
        senderAvatar: sender.avatar,
        senderRole: sender.role,
        content,
        timestamp: timeString,
        isRead: true,
        imageUrl,
        replyTo,
      };

      const currentMessages = state.messages[conversationId] || [];
      const updatedMessages = [...currentMessages, newMessage];

      const updatedConversations = state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, lastMessage: newMessage, updatedAt: timeString }
          : conv
      );

      return {
        messages: { ...state.messages, [conversationId]: updatedMessages },
        conversations: updatedConversations,
      };
    }),

  unsendMessage: ({ conversationId, messageId }) =>
    set((state) => {
      const currentMessages = state.messages[conversationId] || [];
      const updatedMessages = currentMessages.filter((m) => m.id !== messageId);

      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          const lastMsg = updatedMessages.length > 0 ? updatedMessages[updatedMessages.length - 1] : undefined;
          return { ...conv, lastMessage: lastMsg };
        }
        return conv;
      });

      return {
        messages: { ...state.messages, [conversationId]: updatedMessages },
        conversations: updatedConversations,
      };
    }),

  toggleMessageReaction: ({ conversationId, messageId, emoji, userId }) =>
    set((state) => {
      const currentMessages = state.messages[conversationId];
      if (!currentMessages) return state;

      const updatedMessages = currentMessages.map((msg) => {
        if (msg.id !== messageId) return msg;

        const reactions = msg.reactions ? [...msg.reactions] : [];
        const existingIdx = reactions.findIndex((r) => r.emoji === emoji);

        if (existingIdx > -1) {
          const reaction = { ...reactions[existingIdx] };
          const userIdx = reaction.users.indexOf(userId);

          if (userIdx > -1) {
            reaction.users = reaction.users.filter((id) => id !== userId);
            reaction.count -= 1;
            if (reaction.count <= 0) {
              reactions.splice(existingIdx, 1);
            } else {
              reactions[existingIdx] = reaction;
            }
          } else {
            reaction.users = [...reaction.users, userId];
            reaction.count += 1;
            reactions[existingIdx] = reaction;
          }
        } else {
          reactions.push({ emoji, count: 1, users: [userId] });
        }

        return { ...msg, reactions };
      });

      return {
        messages: { ...state.messages, [conversationId]: updatedMessages },
      };
    }),

  createCourseGroup: ({ courseId, courseTitle, groupName, instructor }) =>
    set((state) => {
      const groupId = `group-${Date.now()}`;
      const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const newConversation: ChatConversation = {
        id: groupId,
        type: "group",
        name: groupName || `${courseTitle} Discussion Group`,
        avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80",
        courseId,
        courseTitle,
        instructorId: instructor.id,
        members: [instructor],
        unreadCount: 0,
        updatedAt: now,
      };

      return {
        conversations: [newConversation, ...state.conversations],
        messages: {
          ...state.messages,
          [groupId]: [
            {
              id: `msg-${Date.now()}`,
              senderId: instructor.id,
              senderName: instructor.name,
              senderAvatar: instructor.avatar,
              senderRole: "instructor",
              content: `Welcome to the official group chat for ${courseTitle}!`,
              timestamp: now,
              isRead: true,
            },
          ],
        },
        activeConversationId: groupId,
      };
    }),

  autoJoinCourseGroupOnEnroll: ({ courseId, courseTitle, student, instructor }) =>
    set((state) => {
      const conversations = [...state.conversations];

      let groupConv = conversations.find(
        (c) => c.type === "group" && (c.courseId === courseId || c.courseTitle === courseTitle)
      );

      if (groupConv) {
        if (!groupConv.members.some((m) => m.id === student.id)) {
          groupConv.members = [...groupConv.members, student];
        }
      } else {
        const groupId = `group-${courseId || Date.now()}`;
        groupConv = {
          id: groupId,
          type: "group",
          name: `${courseTitle} Community Group`,
          avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80",
          courseId,
          courseTitle,
          instructorId: instructor.id,
          members: [instructor, student],
          unreadCount: 0,
          updatedAt: "Just now",
        };
        conversations.unshift(groupConv);
        state.messages[groupId] = [
          {
            id: `msg-${Date.now()}`,
            senderId: instructor.id,
            senderName: instructor.name,
            senderAvatar: instructor.avatar,
            senderRole: "instructor",
            content: `Welcome ${student.name} to the ${courseTitle} community group!`,
            timestamp: "Just now",
            isRead: true,
          },
        ];
      }

      const directConvId = `direct-${instructor.id}`;
      let directConv = conversations.find((c) => c.id === directConvId);
      if (!directConv) {
        directConv = {
          id: directConvId,
          type: "direct",
          name: `${instructor.name} (Instructor)`,
          avatar: instructor.avatar,
          instructorId: instructor.id,
          courseTitle,
          members: [instructor, student],
          unreadCount: 0,
          updatedAt: "Just now",
          lastMessage: {
            id: `msg-${Date.now()}`,
            senderId: instructor.id,
            senderName: instructor.name,
            senderAvatar: instructor.avatar,
            senderRole: "instructor",
            content: `Welcome to ${courseTitle}! Feel free to send me any direct questions.`,
            timestamp: "Just now",
            isRead: false,
          },
        };
        conversations.unshift(directConv);
        state.messages[directConvId] = [directConv.lastMessage];
      }

      return {
        conversations,
        messages: { ...state.messages },
      };
    }),
}));
