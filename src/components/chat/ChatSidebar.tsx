import React, { useState } from "react";
import { Search, Plus, MessageSquare, Users, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveConversation } from "@/store/slices/chatSlice";
import { CreateGroupModal } from "./CreateGroupModal";

interface ChatSidebarProps {
  className?: string;
  onSelectConversation?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ className, onSelectConversation }) => {
  const dispatch = useAppDispatch();
  const { conversations, activeConversationId } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);

  const [filter, setFilter] = useState<"all" | "direct" | "group">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredConversations = conversations.filter((c) => {
    if (filter === "direct" && c.type !== "direct") return false;
    if (filter === "group" && c.type !== "group") return false;
    if (
      searchTerm &&
      !c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !c.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className={cn("flex flex-col h-full w-full bg-card overflow-hidden select-none", className)}>
      {/* Header */}
      <div className="p-4 border-b space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <MessageSquare className="h-4 w-4" />
            </div>
            <h2 className="font-bold text-lg text-foreground tracking-tight">Messages</h2>
          </div>

          {(user?.role === "instructor" || user?.role === "admin") && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="gap-1 text-xs h-8 border-sky-500/40 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950 font-medium"
            >
              <Plus className="h-3.5 w-3.5" /> Group
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search messages & groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-lg bg-muted/40 border-muted focus-visible:ring-1 focus-visible:ring-sky-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-muted/80 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-center transition-all",
              filter === "all" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("direct")}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1",
              filter === "direct" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <User className="h-3 w-3" /> Direct
          </button>
          <button
            onClick={() => setFilter("group")}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-center transition-all flex items-center justify-center gap-1",
              filter === "group" ? "bg-background text-foreground shadow-sm font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="h-3 w-3" /> Groups
          </button>
        </div>
      </div>

      {/* Conversations Scrollable List */}
      <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-border/40">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No conversations found.
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            return (
              <button
                key={conv.id}
                onClick={() => {
                  dispatch(setActiveConversation(conv.id));
                  onSelectConversation?.();
                }}
                className={cn(
                  "w-full p-3.5 flex items-start gap-3 transition-colors text-left relative",
                  isActive
                    ? "bg-sky-500/10 border-l-4 border-sky-600 dark:bg-sky-950/40"
                    : "hover:bg-muted/50"
                )}
              >
                <div className="relative shrink-0 mt-0.5">
                  <Avatar className="h-11 w-11 border shadow-sm">
                    <AvatarImage src={conv.avatar} alt={conv.name} />
                    <AvatarFallback className="font-bold text-sky-600 bg-sky-100">{conv.name[0]}</AvatarFallback>
                  </Avatar>
                  {conv.type === "direct" && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm truncate text-foreground leading-tight">
                      {conv.name}
                    </h4>
                    <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                      {conv.updatedAt}
                    </span>
                  </div>

                  {conv.courseTitle && (
                    <span className="inline-block text-[10px] text-sky-600 dark:text-sky-400 font-medium truncate mt-0.5">
                      {conv.courseTitle}
                    </span>
                  )}

                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {conv.lastMessage?.content || "No messages yet"}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="h-5 min-w-5 px-1.5 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 self-center shadow">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Modal */}
      <CreateGroupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ChatSidebar;
