// Type definitions for the WhatsApp clone application

export interface User {
  uid: string;
  email: string;
  phoneNumber?: string;
  displayName: string;
  photoURL?: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
}

export interface Contact {
  uid: string;
  displayName: string;
  phoneNumber?: string;
  email?: string;
  photoURL?: string;
  isRegistered: boolean;
  isOnline: boolean;
  lastSeen: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file';
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageTime: Date;
  unreadCount: number;
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, phoneNumber?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserStatus: (isOnline: boolean) => Promise<void>;
}

export interface NotificationPermission {
  granted: boolean;
  token?: string;
}