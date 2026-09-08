import React, { useState } from "react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";

export const ChatPage: React.FC = () => {
  const [showMobileChat, setShowMobileChat] = useState(false);

  return (
    <div className="container mx-auto py-3 px-2 sm:px-4 h-full flex flex-col overflow-hidden">
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
