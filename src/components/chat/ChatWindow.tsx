import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Users, Image as ImageIcon, X, Reply, Trash2, CornerUpLeft, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ChatMessage } from "@/types/chat";
import { useSocket } from "@/hooks/useSocket";

interface ChatWindowProps {
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onBack }) => {
  const conversations = useChatStore((state) => state.conversations);
  const messages = useChatStore((state) => state.messages);
  const activeConversationId = useChatStore((state) => state.activeConversationId);
  const isSocketConnected = useChatStore((state) => state.isSocketConnected);
  const typingUsers = useChatStore((state) => state.typingUsers);
  
  const sendMessageStore = useChatStore((state) => state.sendMessage);
  const unsendMessageStore = useChatStore((state) => state.unsendMessage);
  const toggleMessageReactionStore = useChatStore((state) => state.toggleMessageReaction);

  const user = useAuthStore((state) => state.user);
  const { emitSendMessage, emitTypingStatus, emitReaction } = useSocket();

  const EMOJI_OPTIONS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

  const handleToggleReaction = (messageId: string, emoji: string) => {
    if (!activeConversationId) return;
    const currentUserId = user?.id || "user-1";
    toggleMessageReactionStore({
      conversationId: activeConversationId,
      messageId,
      emoji,
      userId: currentUserId,
    });
    emitReaction(activeConversationId, messageId, emoji);
  };

  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    if (!activeConversationId) return;

    emitTypingStatus(activeConversationId, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitTypingStatus(activeConversationId, false);
    }, 2000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputMessage.trim() && !selectedImage) || !activeConversationId) return;

    const replyData = replyingTo
      ? {
          id: replyingTo.id,
          senderName: replyingTo.senderName,
          content: replyingTo.content || (replyingTo.imageUrl ? "📷 Photo" : ""),
        }
      : undefined;

    const senderObj = {
      id: user?.id || "user-1",
      name: `${user?.firstName || "Rahim"} ${user?.lastName || "Ahmed"}`.trim(),
      avatar: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      role: (user?.role as any) || "student",
    };

    const socketMessageData: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: senderObj.id,
      senderName: senderObj.name,
      senderAvatar: senderObj.avatar,
      senderRole: senderObj.role,
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isRead: true,
      imageUrl: selectedImage || undefined,
      replyTo: replyData,
    };

    sendMessageStore({
      conversationId: activeConversationId,
      content: inputMessage.trim(),
      imageUrl: selectedImage || undefined,
      replyTo: replyData,
      sender: senderObj,
    });

    // Emit via WebSocket Client
    emitSendMessage(activeConversationId, socketMessageData);
    emitTypingStatus(activeConversationId, false);

    setInputMessage("");
    setSelectedImage(null);
    setReplyingTo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUnsend = (messageId: string) => {
    if (!activeConversationId) return;
    unsendMessageStore({ conversationId: activeConversationId, messageId });
  };

  const currentTypingUsers = (activeConversationId ? typingUsers[activeConversationId] : []) || [];

  if (!activeConv) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 bg-muted/20 text-center">
        <Users className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <h3 className="font-semibold text-lg">No Conversation Selected</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          Select a 1-on-1 contact or course group channel from the left sidebar to start chatting.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden bg-background select-none relative">
      {/* Top Header */}
      <div className="h-16 px-4 sm:px-6 border-b flex items-center justify-between bg-card/80 backdrop-blur-md shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3 min-w-0">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden h-8 w-8 shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}

          <Avatar className="h-10 w-10 border shrink-0">
            <AvatarImage src={activeConv.avatar} alt={activeConv.name} />
            <AvatarFallback className="font-bold text-sky-600 bg-sky-100">{activeConv.name[0]}</AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-foreground truncate">
                {activeConv.name}
              </h3>
              {activeConv.type === "group" ? (
                <Badge variant="secondary" className="text-[10px] bg-sky-500/10 text-sky-600 font-semibold shrink-0">
                  Course Group
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-600 font-semibold shrink-0">
                  1-on-1 Direct
                </Badge>
              )}

              {isSocketConnected ? (
                <Badge className="text-[9px] bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 font-semibold shrink-0">
                  ● Live WS
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[9px] text-muted-foreground shrink-0">
                  ○ Fallback Mode
                </Badge>
              )}
            </div>

            <p className="text-xs text-muted-foreground truncate flex items-center gap-2 mt-0.5">
              {activeConv.courseTitle && <span>Course: {activeConv.courseTitle}</span>}
              {activeConv.type === "group" && (
                <span>• {activeConv.members.length} Members</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 space-y-4 bg-slate-50/50 dark:bg-zinc-950/40">
        {activeMessages.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-12">
            No messages yet. Type below to start the conversation!
          </div>
        ) : (
          activeMessages.map((msg) => {
            const isMe = String(msg.senderId) === String(user?.id || "user-1");

            return (
              <div
                key={msg.id}
                className={cn("group flex gap-3 max-w-[85%] sm:max-w-[75%]", isMe ? "ml-auto flex-row-reverse" : "")}
              >
                {!isMe && (
                  <Avatar className="h-8 w-8 border shrink-0 mt-1">
                    <AvatarImage src={msg.senderAvatar} alt={msg.senderName} />
                    <AvatarFallback className="text-xs font-bold">{msg.senderName[0]}</AvatarFallback>
                  </Avatar>
                )}

                <div className="min-w-0 flex flex-col relative">
                  {!isMe && (
                    <div className="flex items-center gap-1.5 text-[11px] mb-1">
                      <span className="font-semibold text-foreground">{msg.senderName}</span>
                      {msg.senderRole === "instructor" && (
                        <span className="px-1.5 py-0.2 rounded bg-sky-600 text-white text-[9px] font-bold tracking-wide">
                          INSTRUCTOR
                        </span>
                      )}
                    </div>
                  )}

                  {/* Message Bubble + Action Buttons Container */}
                  <div className="flex items-center gap-1 group/bubble relative">
                    <div
                      className={cn(
                        "p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words flex flex-col gap-2 relative",
                        isMe
                          ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-tr-none"
                          : "bg-card border text-card-foreground rounded-tl-none"
                      )}
                    >
                      {/* Replying quote preview inside bubble */}
                      {msg.replyTo && (
                        <div
                          className={cn(
                            "px-3 py-1.5 rounded-lg border-l-4 text-xs font-normal",
                            isMe
                              ? "bg-black/20 border-white/60 text-white/90"
                              : "bg-muted border-sky-500 text-muted-foreground"
                          )}
                        >
                          <span className="font-semibold block text-[11px]">
                            Replying to {msg.replyTo.senderName}
                          </span>
                          <span className="truncate block opacity-90 max-w-xs">
                            {msg.replyTo.content || "📷 Image"}
                          </span>
                        </div>
                      )}

                      {/* Attached Image inside bubble */}
                      {msg.imageUrl && (
                        <div className="overflow-hidden rounded-xl max-w-xs max-h-60 border bg-black/10">
                          <img
                            src={msg.imageUrl}
                            alt="attachment"
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => window.open(msg.imageUrl, "_blank")}
                          />
                        </div>
                      )}

                      {/* Text Content */}
                      {msg.content && <div>{msg.content}</div>}
                    </div>

                    {/* Quick Hover Action Toolbar (Messenger style) */}
                    <div
                      className={cn(
                        "opacity-0 group-hover/bubble:opacity-100 transition-opacity flex items-center gap-1 px-1 shrink-0",
                        isMe ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      {/* Reaction Popover Button */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            title="Add Reaction"
                            className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground hover:text-amber-500"
                          >
                            <Smile className="h-3.5 w-3.5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          side="top"
                          align="center"
                          className="w-auto p-1 rounded-full flex gap-1 bg-card/95 backdrop-blur-md shadow-xl border z-50"
                        >
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => handleToggleReaction(msg.id, emoji)}
                              className="h-7 w-7 hover:bg-muted/80 rounded-full flex items-center justify-center text-sm hover:scale-125 transition-transform"
                            >
                              {emoji}
                            </button>
                          ))}
                        </PopoverContent>
                      </Popover>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setReplyingTo(msg)}
                        title="Reply"
                        className="h-7 w-7 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                      >
                        <Reply className="h-3.5 w-3.5" />
                      </Button>

                      {isMe && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleUnsend(msg.id)}
                          title="Unsend"
                          className="h-7 w-7 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Message Reactions Badges */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div
                      className={cn(
                        "flex flex-wrap gap-1 mt-1 px-1",
                        isMe ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.reactions.map((r) => {
                        const currentUserId = user?.id || "user-1";
                        const hasMyReaction = r.users.includes(currentUserId);

                        return (
                          <button
                            key={r.emoji}
                            type="button"
                            onClick={() => handleToggleReaction(msg.id, r.emoji)}
                            className={cn(
                              "inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border shadow-2xs font-medium transition-all hover:scale-105",
                              hasMyReaction
                                ? "bg-sky-500/15 border-sky-500/40 text-sky-600 font-semibold dark:bg-sky-950/40"
                                : "bg-muted/60 hover:bg-muted text-muted-foreground border-border/60"
                            )}
                          >
                            <span>{r.emoji}</span>
                            <span>{r.count}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <span
                    className={cn(
                      "text-[10px] text-muted-foreground mt-1 block px-1",
                      isMe ? "text-right" : "text-left"
                    )}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })
        )}
        {currentTypingUsers.length > 0 && (
          <div className="text-xs text-sky-600 dark:text-sky-400 font-medium italic flex items-center gap-2 animate-pulse pl-2 py-1">
            <span className="h-2 w-2 rounded-full bg-sky-500 animate-ping" />
            {currentTypingUsers.map((u) => u.userName).join(", ")}{" "}
            {currentTypingUsers.length === 1 ? "is typing..." : "are typing..."}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Preview Bar */}
      {replyingTo && (
        <div className="px-4 py-2 bg-muted/60 border-t flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 truncate">
            <CornerUpLeft className="h-4 w-4 text-sky-600 shrink-0" />
            <span className="truncate">
              Replying to <strong className="text-foreground font-semibold">{replyingTo.senderName}</strong>:{" "}
              {replyingTo.content || "📷 Image"}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setReplyingTo(null)}
            className="h-6 w-6 rounded-full hover:bg-background shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {/* Selected Image Attachment Preview Bar */}
      {selectedImage && (
        <div className="px-4 py-2 bg-muted/40 border-t flex items-center gap-3">
          <div className="relative group">
            <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border shadow-sm" />
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow hover:opacity-90 transition-opacity"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-xs text-muted-foreground">Image attached. Press send when ready.</span>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 sm:p-4 border-t bg-card shrink-0 z-10">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* File Upload Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            title="Attach Image"
            className="h-10 w-10 rounded-full hover:bg-muted text-muted-foreground hover:text-sky-600 shrink-0"
          >
            <ImageIcon className="h-5 w-5" />
          </Button>

          <Input
            placeholder={`Message ${activeConv.name}...`}
            value={inputMessage}
            onChange={handleInputChange}
            className="flex-1 h-11 text-sm bg-muted/40 focus:bg-background rounded-full px-5 border-muted focus-visible:ring-2 focus-visible:ring-sky-500"
          />

          <Button
            type="submit"
            size="icon"
            disabled={!inputMessage.trim() && !selectedImage}
            className="h-11 w-11 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:opacity-90 text-white shrink-0 shadow-md transition-all"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
