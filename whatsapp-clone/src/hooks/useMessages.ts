'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Message } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

export function useMessages(chatId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    // Query messages for the specific chat
    const messagesQuery = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageData: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messageData.push({
          id: doc.id,
          chatId: data.chatId,
          senderId: data.senderId,
          receiverId: data.receiverId,
          text: data.text,
          timestamp: data.timestamp?.toDate() || new Date(),
          isRead: data.isRead || false,
          messageType: data.messageType || 'text',
        });
      });
      setMessages(messageData);
      setLoading(false);
    });

    return unsubscribe;
  }, [chatId]);

  // Send a new message
  const sendMessage = async (text: string, receiverId: string) => {
    if (!user || !chatId || !text.trim()) return;

    try {
      // Add message to messages collection
      const messageData = {
        id: uuidv4(),
        chatId,
        senderId: user.uid,
        receiverId,
        text: text.trim(),
        timestamp: serverTimestamp(),
        isRead: false,
        messageType: 'text' as const,
      };

      await addDoc(collection(db, 'messages'), messageData);

      // Update chat with last message and increment unread count for receiver
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: {
          text: text.trim(),
          senderId: user.uid,
          timestamp: serverTimestamp(),
        },
        lastMessageTime: serverTimestamp(),
        [`unreadCount.${receiverId}`]: increment(1),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (messageIds: string[]) => {
    if (!user) return;

    try {
      const promises = messageIds.map(messageId =>
        updateDoc(doc(db, 'messages', messageId), {
          isRead: true,
        })
      );
      await Promise.all(promises);
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