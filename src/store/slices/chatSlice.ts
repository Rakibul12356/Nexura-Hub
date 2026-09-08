import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatConversation, ChatMessage, ChatUser } from "@/types/chat";

interface ChatState {
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
  activeConversationId: string | null;
  isLoading: boolean;
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
      content: "Hi Rahim! Thanks for enrolling. Feel free to reach out if you get stuck on Redux Thunk.",
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
      content: "Hi Rahim! Thanks for enrolling. Feel free to reach out if you get stuck on Redux Thunk.",
      timestamp: "Yesterday",
      isRead: false,
    },
  ],
};

const initialState: ChatState = {
  conversations: initialConversations,
  messages: initialMessages,
  activeConversationId: "group-1",
  isLoading: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
      if (action.payload) {
        const conv = state.conversations.find((c) => c.id === action.payload);
        if (conv) {
          conv.unreadCount = 0;
        }
      }
    },

    sendMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        content: string;
        sender: ChatUser;
        imageUrl?: string;
        replyTo?: { id: string; senderName: string; content: string };
      }>
    ) => {
      const { conversationId, content, sender, imageUrl, replyTo } = action.payload;
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

      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }

      state.messages[conversationId].push(newMessage);

      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) {
        conv.lastMessage = newMessage;
        conv.updatedAt = timeString;
      }
    },

    unsendMessage: (
      state,
      action: PayloadAction<{ conversationId: string; messageId: string }>
    ) => {
      const { conversationId, messageId } = action.payload;
      if (state.messages[conversationId]) {
        state.messages[conversationId] = state.messages[conversationId].filter(
          (m) => m.id !== messageId
        );
        const conv = state.conversations.find((c) => c.id === conversationId);
        if (conv) {
          const remaining = state.messages[conversationId];
          conv.lastMessage = remaining.length > 0 ? remaining[remaining.length - 1] : undefined;
        }
      }
    },

    createCourseGroup: (
      state,
      action: PayloadAction<{
        courseId: string | number;
        courseTitle: string;
        groupName: string;
        instructor: ChatUser;
      }>
    ) => {
      const { courseId, courseTitle, groupName, instructor } = action.payload;
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

      state.conversations.unshift(newConversation);
      state.messages[groupId] = [
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
      ];
      state.activeConversationId = groupId;
    },

    autoJoinCourseGroupOnEnroll: (
      state,
      action: PayloadAction<{
        courseId: string | number;
        courseTitle: string;
        student: ChatUser;
        instructor: ChatUser;
      }>
    ) => {
      const { courseId, courseTitle, student, instructor } = action.payload;

      // 1. Check if group conversation exists for this course
      let groupConv = state.conversations.find(
        (c) => c.type === "group" && (c.courseId === courseId || c.courseTitle === courseTitle)
      );

      if (groupConv) {
        // Add student to members if not already joined
        if (!groupConv.members.some((m) => m.id === student.id)) {
          groupConv.members.push(student);
        }
      } else {
        // Create group conversation on the fly
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
        state.conversations.unshift(groupConv);
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

      // 2. Ensure Direct 1-on-1 Contact with Instructor exists
      const directConvId = `direct-${instructor.id}`;
      let directConv = state.conversations.find((c) => c.id === directConvId);
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
        state.conversations.unshift(directConv);
        state.messages[directConvId] = [directConv.lastMessage];
      }
    },
  },
});

export const {
  setActiveConversation,
  sendMessage,
  unsendMessage,
  createCourseGroup,
  autoJoinCourseGroupOnEnroll,
} = chatSlice.actions;

export default chatSlice.reducer;
