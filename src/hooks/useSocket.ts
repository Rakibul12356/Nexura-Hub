// src/hooks/useSocket.ts
import { useEffect, useCallback } from "react";
import socketService from "@/services/socket";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { ChatMessage } from "@/types/chat";

export const useSocket = () => {
  const user = useAuthStore((state) => state.user);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const isSocketConnected = useChatStore((state) => state.isSocketConnected);
  
  const setSocketConnected = useChatStore((state) => state.setSocketConnected);
  const receiveSocketMessage = useChatStore((state) => state.receiveSocketMessage);
  const setTypingStatus = useChatStore((state) => state.setTypingStatus);
  const updateUserPresence = useChatStore((state) => state.updateUserPresence);
  const toggleMessageReaction = useChatStore((state) => state.toggleMessageReaction);

  useEffect(() => {
    // Admin role has no chat functionality as per system rules
    if (!user || user.role === "admin") {
      socketService.disconnect();
      setSocketConnected(false);
      return;
    }

    // Connect to WebSocket Server
    const socket = socketService.connect(user.id, user.role);

    const handleConnect = () => {
      setSocketConnected(true);
    };

    const handleDisconnect = () => {
      setSocketConnected(false);
    };

    const handleMessageReceived = (data: { conversationId: string; message: ChatMessage }) => {
      receiveSocketMessage(data);
    };

    const handleUserTyping = (data: {
      conversationId: string;
      userId: string | number;
      userName: string;
      isTyping: boolean;
    }) => {
      setTypingStatus(data);
    };

    const handleUserPresence = (data: { userId: string | number; isOnline: boolean }) => {
      updateUserPresence(data);
    };

    const handleReactionReceived = (data: {
      conversationId: string;
      messageId: string;
      emoji: string;
      userId: string | number;
    }) => {
      toggleMessageReaction(data);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socketService.onMessageReceived(handleMessageReceived);
    socketService.onTypingStatus(handleUserTyping);
    socketService.onUserPresence(handleUserPresence);
    socketService.onReactionReceived(handleReactionReceived);

    // Sync initial connection state if already connected
    if (socket.connected) {
      setSocketConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socketService.removeListener("receive_message");
      socketService.removeListener("user_typing");
      socketService.removeListener("user_presence");
      socketService.removeListener("receive_reaction");
    };
  }, [
    user,
    setSocketConnected,
    receiveSocketMessage,
    setTypingStatus,
    updateUserPresence,
    toggleMessageReaction,
  ]);

  // Join active conversation room when activeConversationId changes
  useEffect(() => {
    if (activeConversationId && isSocketConnected) {
      socketService.joinRoom(activeConversationId);

      return () => {
        socketService.leaveRoom(activeConversationId);
      };
    }
  }, [activeConversationId, isSocketConnected]);

  const emitSendMessage = useCallback(
    (conversationId: string, message: ChatMessage) => {
      socketService.sendMessage(conversationId, message);
    },
    []
  );

  const emitTypingStatus = useCallback(
    (conversationId: string, isTyping: boolean) => {
      if (user) {
        socketService.sendTypingStatus(conversationId, user.id, `${user.firstName} ${user.lastName}`, isTyping);
      }
    },
    [user]
  );

  const emitReaction = useCallback(
    (conversationId: string, messageId: string, emoji: string) => {
      if (user) {
        socketService.sendReaction(conversationId, messageId, emoji, user.id);
      }
    },
    [user]
  );

  return {
    isConnected: isSocketConnected,
    emitSendMessage,
    emitTypingStatus,
    emitReaction,
    joinRoom: socketService.joinRoom.bind(socketService),
    leaveRoom: socketService.leaveRoom.bind(socketService),
  };
};

export default useSocket;
