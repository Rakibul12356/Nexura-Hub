import React, { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, Users, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { sendMessage } from "@/store/slices/chatSlice";

interface ChatWindowProps {
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onBack }) => {
  const dispatch = useAppDispatch();
  const { conversations, messages, activeConversationId } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversationId) return;

    dispatch(
      sendMessage({
        conversationId: activeConversationId,
        content: inputMessage.trim(),
        sender: {
          id: user?.id || "user-1",
          name: `${user?.firstName || "Rahim"} ${user?.lastName || "Ahmed"}`.trim(),
          avatar: user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          role: (user?.role as any) || "student",
        },
      })
    );

    setInputMessage("");
  };

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
                className={cn("flex gap-3 max-w-[85%] sm:max-w-[70%]", isMe ? "ml-auto flex-row-reverse" : "")}
              >
                {!isMe && (
                  <Avatar className="h-8 w-8 border shrink-0 mt-1">
                    <AvatarImage src={msg.senderAvatar} alt={msg.senderName} />
                    <AvatarFallback className="text-xs font-bold">{msg.senderName[0]}</AvatarFallback>
                  </Avatar>
                )}

                <div className="min-w-0">
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

                  <div
                    className={cn(
                      "p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words",
                      isMe
                        ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-tr-none"
                        : "bg-card border text-card-foreground rounded-tl-none"
                    )}
                  >
                    {msg.content}
                  </div>

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
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 border-t bg-card shrink-0 z-10">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <Input
            placeholder={`Message ${activeConv.name}...`}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 h-11 text-sm bg-muted/40 focus:bg-background rounded-full px-5 border-muted focus-visible:ring-2 focus-visible:ring-sky-500"
          />

          <Button
            type="submit"
            size="icon"
            disabled={!inputMessage.trim()}
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
