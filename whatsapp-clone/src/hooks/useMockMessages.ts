'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/types';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { mockMessages, addMockMessage } from '@/lib/mockData';

export function useMockMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useMockAuth();

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    // Simulate loading delay
    setTimeout(() => {
      const chatMessages = mockMessages[chatId] || [];
      setMessages(chatMessages);
      setLoading(false);
    }, 300);
  }, [chatId]);

  // Send a new message
  const sendMessage = async (text: string, receiverId: string) => {
    if (!user || !chatId || !text.trim()) return;

    try {
      const newMessage = addMockMessage(chatId, {
        chatId,
        senderId: user.uid,
        receiverId,
        text: text.trim(),
        isRead: false,
        messageType: 'text',
      });

      // Update local state
      setMessages(prevMessages => [...prevMessages, newMessage]);

      // Simulate message delivery delay
      setTimeout(() => {
        console.log('Message delivered (demo)');
      }, 100);

    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (messageIds: string[]) => {
    if (!user || !chatId) return;

    try {
      // Update mock data
      const chatMessages = mockMessages[chatId] || [];
      chatMessages.forEach(msg => {
        if (messageIds.includes(msg.id) && msg.receiverId === user.uid) {
          msg.isRead = true;
        }
      });

      // Update local state
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          messageIds.includes(msg.id) && msg.receiverId === user.uid
            ? { ...msg, isRead: true }
            : msg
        )
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Get unread messages for current user
  const getUnreadMessages = () => {
    return messages.filter(message => 
      message.receiverId === user?.uid && !message.isRead
    );
  };

  return {
    messages,
    loading,
    sendMessage,
    markMessagesAsRead,
    getUnreadMessages,
  };
}