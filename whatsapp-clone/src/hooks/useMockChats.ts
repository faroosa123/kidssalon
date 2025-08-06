'use client';

import { useState, useEffect } from 'react';
import { Chat } from '@/types';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { mockChats } from '@/lib/mockData';

export function useMockChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useMockAuth();

  useEffect(() => {
    if (!user) {
      setChats([]);
      setLoading(false);
      return;
    }

    // Simulate loading delay
    setTimeout(() => {
      // Filter chats where user is a participant
      const userChats = mockChats.filter(chat => 
        chat.participants.includes(user.uid)
      );
      
      setChats(userChats);
      setLoading(false);
    }, 500);
  }, [user]);

  // Create or get existing chat between two users
  const createOrGetChat = async (otherUserId: string): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    // Check if chat already exists
    const existingChat = chats.find(chat => 
      chat.participants.includes(otherUserId) && chat.participants.includes(user.uid)
    );

    if (existingChat) {
      return existingChat.id;
    }

    // Create new chat (mock)
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      participants: [user.uid, otherUserId],
      lastMessageTime: new Date(),
      unreadCount: 0,
      createdAt: new Date(),
    };

    // Add to mock data
    mockChats.push(newChat);
    setChats([...chats, newChat]);

    return newChat.id;
  };

  // Mark chat as read
  const markChatAsRead = async (chatId: string) => {
    if (!user) return;

    // Update mock data
    const chat = mockChats.find(c => c.id === chatId);
    if (chat) {
      chat.unreadCount = 0;
    }

    // Update state
    setChats(chats.map(chat => 
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    ));
  };

  return {
    chats,
    loading,
    createOrGetChat,
    markChatAsRead,
  };
}