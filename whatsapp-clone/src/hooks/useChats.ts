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
  arrayUnion,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Chat, Message } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setChats([]);
      setLoading(false);
      return;
    }

    // Query chats where user is a participant
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const chatData: Chat[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        chatData.push({
          id: doc.id,
          participants: data.participants,
          lastMessage: data.lastMessage,
          lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
          unreadCount: data.unreadCount?.[user.uid] || 0,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      setChats(chatData);
      setLoading(false);
    });

    return unsubscribe;
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

    // Create new chat
    const chatDoc = await addDoc(collection(db, 'chats'), {
      participants: [user.uid, otherUserId],
      createdAt: serverTimestamp(),
      lastMessageTime: serverTimestamp(),
      unreadCount: {
        [user.uid]: 0,
        [otherUserId]: 0,
      },
    });

    return chatDoc.id;
  };

  // Mark chat as read
  const markChatAsRead = async (chatId: string) => {
    if (!user) return;

    await updateDoc(doc(db, 'chats', chatId), {
      [`unreadCount.${user.uid}`]: 0,
    });
  };

  return {
    chats,
    loading,
    createOrGetChat,
    markChatAsRead,
  };
}