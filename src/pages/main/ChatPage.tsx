import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { cn } from "@/lib/utils";

export const ChatPage: React.FC = () => {
  const [showMobileChat, setShowMobileChat] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <div
      className={cn(
        "w-full h-full flex flex-col overflow-hidden p-3 sm:p-5",
        isDashboard ? "h-[calc(100vh-85px)]" : "container mx-auto h-[calc(100vh-5.5rem)]"
      )}
    >
      <div className="h-full border rounded-2xl overflow-hidden bg-card shadow-xl flex w-full relative">
        {/* Desktop View: Sidebar + Chat Window */}
        <div className="hidden md:flex w-80 lg:w-96 shrink-0 h-full overflow-hidden border-r">
          <ChatSidebar className="w-full h-full" />
        </div>

        <div className="hidden md:flex flex-1 h-full overflow-hidden">
          <ChatWindow />
        </div>

        {/* Mobile View: Toggle Sidebar or Active Window */}
        <div className="flex md:hidden w-full h-full overflow-hidden">
          {!showMobileChat ? (
            <ChatSidebar
              className="w-full h-full"
              onSelectConversation={() => setShowMobileChat(true)}
            />
          ) : (
            <ChatWindow onBack={() => setShowMobileChat(false)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
