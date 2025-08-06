'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useChats } from '@/hooks/useChats';
import ChatList from '@/components/chat/ChatList';
import ChatScreen from '@/components/chat/ChatScreen';
import AuthForm from '@/components/auth/AuthForm';
import notificationService from '@/services/notificationService';

export default function MainLayout() {
  const { user, loading } = useAuth();
  const { markChatAsRead } = useChats();
  const [selectedChat, setSelectedChat] = useState<{
    chatId: string;
    contactId: string;
  } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Set up notifications when user is authenticated
  useEffect(() => {
    if (user) {
      // Request notification permission
      notificationService.requestPermission().then(token => {
        if (token) {
          console.log('FCM token received:', token);
          // In a real app, you'd save this token to the user's profile
        }
      });

      // Set up message listener
      notificationService.setupMessageListener();
    }
  }, [user]);

  const handleChatSelect = async (chatId: string, contactId: string) => {
    setSelectedChat({ chatId, contactId });
    // Mark chat as read
    await markChatAsRead(chatId);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return (
    <div className="h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto h-full">
        <div className="flex h-full bg-white shadow-lg">
          {/* Chat List - Hidden on mobile when chat is selected */}
          <div className={`${
            isMobile && selectedChat ? 'hidden' : 'flex'
          } w-full md:w-1/3 lg:w-1/4 border-r border-gray-200`}>
            <ChatList
              onChatSelect={handleChatSelect}
              selectedChatId={selectedChat?.chatId}
            />
          </div>

          {/* Chat Screen - Full width on mobile, 2/3 on desktop */}
          <div className={`${
            isMobile && !selectedChat ? 'hidden' : 'flex'
          } w-full md:w-2/3 lg:w-3/4`}>
            {selectedChat ? (
              <ChatScreen
                chatId={selectedChat.chatId}
                contactId={selectedChat.contactId}
                onBack={handleBackToList}
              />
            ) : (
              <div className="hidden md:flex items-center justify-center h-full bg-gray-50">
                <div className="text-center text-gray-500">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">WhatsApp Clone</h3>
                  <p className="text-sm">
                    Select a chat to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}