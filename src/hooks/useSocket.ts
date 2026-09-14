// src/hooks/useSocket.ts
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import socketService from "@/services/socket";
import {
  setSocketConnected,
  receiveSocketMessage,
  setTypingStatus,
  updateUserPresence,
} from "@/store/slices/chatSlice";
import { ChatMessage } from "@/types/chat";

export const useSocket = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { activeConversationId, isSocketConnected } = useAppSelector((state) => state.chat);

  useEffect(() => {
    // Admin role has no chat functionality as per system rules
    if (!user || user.role === "admin") {
      socketService.disconnect();
      dispatch(setSocketConnected(false));
      return;
    }

    // Connect to WebSocket Server
    const socket = socketService.connect(user.id, user.role);

    const handleConnect = () => {
      dispatch(setSocketConnected(true));
    };

    const handleDisconnect = () => {
      dispatch(setSocketConnected(false));
    };

    const handleMessageReceived = (data: { conversationId: string; message: ChatMessage }) => {
      dispatch(receiveSocketMessage(data));
    };

    const handleUserTyping = (data: {
      conversationId: string;
      userId: string | number;
      userName: string;
      isTyping: boolean;
    }) => {
      dispatch(setTypingStatus(data));
    };

    const handleUserPresence = (data: { userId: string | number; isOnline: boolean }) => {
      dispatch(updateUserPresence(data));
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    socketService.onMessageReceived(handleMessageReceived);
    socketService.onTypingStatus(handleUserTyping);
    socketService.onUserPresence(handleUserPresence);

    // Sync initial connection state if already connected
    if (socket.connected) {
      dispatch(setSocketConnected(true));
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socketService.removeListener("receive_message");
      socketService.removeListener("user_typing");
      socketService.removeListener("user_presence");
    };
  }, [user, dispatch]);

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

  return {
    isConnected: isSocketConnected,
    emitSendMessage,
    emitTypingStatus,
    joinRoom: socketService.joinRoom.bind(socketService),
    leaveRoom: socketService.leaveRoom.bind(socketService),
  };
};

export default useSocket;
