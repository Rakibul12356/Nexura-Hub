import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Send, UserCheck } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";

interface DiscussionThread {
  id: string;
  userName: string;
  userAvatar: string;
  userRole: "student" | "instructor" | "admin";
  content: string;
  createdAt: string;
  upvotes: number;
  replies: Array<{
    id: string;
    userName: string;
    userAvatar: string;
    userRole: "student" | "instructor" | "admin";
    content: string;
    createdAt: string;
  }>;
}

interface LessonDiscussionProps {
  lessonId: string;
}

export const LessonDiscussion: React.FC<LessonDiscussionProps> = ({ lessonId }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [threads, setThreads] = useState<DiscussionThread[]>([
    {
      id: "thread-1",
      userName: "Rakibul Hasan",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      userRole: "admin",
      content: "Does HLS streaming auto-adjust bitrate according to network speed in this player?",
      createdAt: "2 hours ago",
      upvotes: 4,
      replies: [
        {
          id: "reply-1",
          userName: "Tapas Adhikary",
          userAvatar: "/assets/images/profile.jpg",
          userRole: "instructor",
          content: "Yes! hls.js handles Adaptive Bitrate (ABR) streaming automatically based on available bandwidth.",
          createdAt: "1 hour ago",
        },
      ],
    },
  ]);

  const [newQuestion, setNewQuestion] = useState("");
  const [replyInput, setReplyInput] = useState<{ [key: string]: string }>({});

  const handlePostQuestion = () => {
    if (!newQuestion.trim()) {
      toast.error("Please enter a question.");
      return;
    }

    const thread: DiscussionThread = {
      id: `thread-${Date.now()}`,
      userName: user ? `${user.firstName} ${user.lastName}` : "Student",
      userAvatar: user?.avatar || "/assets/images/profile.jpg",
      userRole: (user?.role as any) || "student",
      content: newQuestion.trim(),
      createdAt: "Just now",
      upvotes: 0,
      replies: [],
    };

    setThreads([thread, ...threads]);
    setNewQuestion("");
    toast.success("Question posted to discussion board!");
  };

  const handlePostReply = (threadId: string) => {
    const text = replyInput[threadId];
    if (!text || !text.trim()) return;

    setThreads(
      threads.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            replies: [
              ...t.replies,
              {
                id: `reply-${Date.now()}`,
                userName: user ? `${user.firstName} ${user.lastName}` : "Student",
                userAvatar: user?.avatar || "/assets/images/profile.jpg",
                userRole: (user?.role as any) || "student",
                content: text.trim(),
                createdAt: "Just now",
              },
            ],
          };
        }
        return t;
      })
    );

    setReplyInput({ ...replyInput, [threadId]: "" });
    toast.success("Reply submitted.");
  };

  const handleUpvote = (threadId: string) => {
    setThreads(
      threads.map((t) => (t.id === threadId ? { ...t, upvotes: t.upvotes + 1 } : t))
    );
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-sky-600" />
          Lesson Q&A Discussion Thread
        </h3>
        <span className="text-xs text-muted-foreground">{threads.length} Questions</span>
      </div>

      {/* Question Post Input */}
      <div className="flex gap-3 items-start">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask a question about this lecture..."
            rows={2}
            className="w-full bg-background border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
          />
          <div className="flex justify-end">
            <Button size="sm" onClick={handlePostQuestion} className="bg-sky-600 hover:bg-sky-700 gap-1.5">
              <Send className="h-4 w-4" />
              Post Question
            </Button>
          </div>
        </div>
      </div>

      {/* Discussion Threads List */}
      <div className="space-y-4">
        {threads.map((thread) => (
          <div key={thread.id} className="p-4 border rounded-xl bg-card space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={thread.userAvatar} />
                  <AvatarFallback>{thread.userName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{thread.userName}</span>
                    {thread.userRole === "instructor" && (
                      <Badge className="bg-amber-500 text-black text-[10px] px-1.5 py-0 font-bold gap-0.5">
                        <UserCheck className="h-3 w-3" /> Instructor
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{thread.createdAt}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUpvote(thread.id)}
                className="gap-1.5 text-xs text-muted-foreground hover:text-sky-600"
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                {thread.upvotes}
              </Button>
            </div>

            <p className="text-sm text-foreground leading-relaxed pl-10">{thread.content}</p>

            {/* Replies List */}
            {thread.replies.length > 0 && (
              <div className="pl-10 pt-2 space-y-2 border-t mt-3">
                {thread.replies.map((reply) => (
                  <div key={reply.id} className="p-3 rounded-lg bg-muted/40 text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{reply.userName}</span>
                      {reply.userRole === "instructor" && (
                        <Badge className="bg-amber-500 text-black text-[9px] px-1 py-0 font-bold">
                          Instructor
                        </Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground ml-auto">{reply.createdAt}</span>
                    </div>
                    <p className="text-muted-foreground">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply Input */}
            <div className="pl-10 pt-2 flex gap-2">
              <input
                type="text"
                value={replyInput[thread.id] || ""}
                onChange={(e) => setReplyInput({ ...replyInput, [thread.id]: e.target.value })}
                placeholder="Write a reply..."
                onKeyDown={(e) => e.key === "Enter" && handlePostReply(thread.id)}
                className="flex-1 bg-background border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <Button size="sm" variant="secondary" onClick={() => handlePostReply(thread.id)} className="h-8 text-xs">
                Reply
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonDiscussion;
