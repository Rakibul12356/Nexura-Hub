// src/services/socket.ts
import { io, Socket } from "socket.io-client";
import { ChatMessage, ChatUser } from "@/types/chat";

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;

  /**
   * Initialize and connect to the WebSocket server
   */
  public connect(userId: string | number, userRole: string): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      transports: ["websocket", "polling"],
      auth: {
        userId,
        userRole,
      },
    });

    this.socket.on("connect", () => {
      this.isConnected = true;
      console.log("[WebSocket] Connected successfully with Socket ID:", this.socket?.id);
    });

    this.socket.on("connect_error", (error) => {
      this.isConnected = false;
      // Silently fall back for client-only mock environment
      console.warn("[WebSocket] Server connection offline. Operating in fallback mock mode.", error.message);
    });

    this.socket.on("disconnect", (reason) => {
      this.isConnected = false;
      console.log("[WebSocket] Disconnected:", reason);
    });

    return this.socket;
  }

  /**
   * Disconnect from the WebSocket server
   */
  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Join a specific conversation/course group room
   */
  public joinRoom(conversationId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("join_room", { conversationId });
    }
  }

  /**
   * Leave a conversation/course group room
   */
  public leaveRoom(conversationId: string) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("leave_room", { conversationId });
    }
  }

  /**
   * Emit a new chat message to room
   */
  public sendMessage(conversationId: string, message: ChatMessage) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("send_message", { conversationId, message });
    }
  }

  /**
   * Emit typing status indicator
   */
  public sendTypingStatus(conversationId: string, userId: string | number, userName: string, isTyping: boolean) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("typing_status", { conversationId, userId, userName, isTyping });
    }
  }

  /**
   * Listen for incoming messages
   */
  public onMessageReceived(callback: (data: { conversationId: string; message: ChatMessage }) => void) {
    if (this.socket) {
      this.socket.on("receive_message", callback);
    }
  }

  /**
   * Listen for typing status events
   */
  public onTypingStatus(callback: (data: { conversationId: string; userId: string | number; userName: string; isTyping: boolean }) => void) {
    if (this.socket) {
      this.socket.on("user_typing", callback);
    }
  }

  /**
   * Listen for user online/offline presence changes
   */
  public onUserPresence(callback: (data: { userId: string | number; isOnline: boolean }) => void) {
    if (this.socket) {
      this.socket.on("user_presence", callback);
    }
  }

  /**
   * Remove specific event listener
   */
  public removeListener(eventName: string) {
    if (this.socket) {
      this.socket.off(eventName);
    }
  }

  /**
   * Check connection status
   */
  public getIsConnected(): boolean {
    return this.isConnected && !!this.socket?.connected;
  }
}

export const socketService = new SocketService();
export default socketService;
