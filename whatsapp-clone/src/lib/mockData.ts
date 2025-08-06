// Mock data for demo purposes - no Firebase needed!
import { User, Contact, Chat, Message } from '@/types';

// Mock current user
export const mockCurrentUser: User = {
  uid: 'user-1',
  email: 'you@example.com',
  displayName: 'You',
  phoneNumber: '+1234567890',
  photoURL: '',
  isOnline: true,
  lastSeen: new Date(),
  createdAt: new Date(Date.now() - 86400000), // 1 day ago
};

// Mock contacts/users
export const mockUsers: User[] = [
  {
    uid: 'user-2',
    email: 'alice@example.com',
    displayName: 'Alice Johnson',
    phoneNumber: '+1234567891',
    photoURL: '',
    isOnline: true,
    lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  },
  {
    uid: 'user-3',
    email: 'bob@example.com',
    displayName: 'Bob Smith',
    phoneNumber: '+1234567892',
    photoURL: '',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
  },
  {
    uid: 'user-4',
    email: 'carol@example.com',
    displayName: 'Carol Davis',
    phoneNumber: '+1234567893',
    photoURL: '',
    isOnline: true,
    lastSeen: new Date(),
    createdAt: new Date(Date.now() - 345600000), // 4 days ago
  },
  {
    uid: 'user-5',
    email: 'david@example.com',
    displayName: 'David Wilson',
    phoneNumber: '+1234567894',
    photoURL: '',
    isOnline: false,
    lastSeen: new Date(Date.now() - 7200000), // 2 hours ago
    createdAt: new Date(Date.now() - 432000000), // 5 days ago
  },
];

// Mock contacts
export const mockContacts: Contact[] = mockUsers.map(user => ({
  uid: user.uid,
  displayName: user.displayName,
  phoneNumber: user.phoneNumber,
  email: user.email,
  photoURL: user.photoURL,
  isRegistered: true,
  isOnline: user.isOnline,
  lastSeen: user.lastSeen,
}));

// Mock chats
export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    participants: ['user-1', 'user-2'],
    lastMessage: {
      id: 'msg-5',
      chatId: 'chat-1',
      senderId: 'user-2',
      receiverId: 'user-1',
      text: 'Hey! How are you doing today?',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      isRead: false,
      messageType: 'text',
    },
    lastMessageTime: new Date(Date.now() - 300000),
    unreadCount: 2,
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: 'chat-2',
    participants: ['user-1', 'user-3'],
    lastMessage: {
      id: 'msg-10',
      chatId: 'chat-2',
      senderId: 'user-1',
      receiverId: 'user-3',
      text: 'Thanks for the help with the project!',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isRead: true,
      messageType: 'text',
    },
    lastMessageTime: new Date(Date.now() - 3600000),
    unreadCount: 0,
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: 'chat-3',
    participants: ['user-1', 'user-4'],
    lastMessage: {
      id: 'msg-15',
      chatId: 'chat-3',
      senderId: 'user-4',
      receiverId: 'user-1',
      text: 'Let\'s meet up for coffee this weekend!',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      isRead: false,
      messageType: 'text',
    },
    lastMessageTime: new Date(Date.now() - 7200000),
    unreadCount: 1,
    createdAt: new Date(Date.now() - 259200000),
  },
];

// Mock messages for each chat
export const mockMessages: { [chatId: string]: Message[] } = {
  'chat-1': [
    {
      id: 'msg-1',
      chatId: 'chat-1',
      senderId: 'user-1',
      receiverId: 'user-2',
      text: 'Hi Alice! 👋',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isRead: true,
      messageType: 'text',
    },
    {
      id: 'msg-2',
      chatId: 'chat-1',
      senderId: 'user-2',
      receiverId: 'user-1',
      text: 'Hello! How\'s your day going?',
      timestamp: new Date(Date.now() - 1500000), // 25 minutes ago
      isRead: true,
      messageType: 'text',
    },
    {
      id: 'msg-3',
      chatId: 'chat-1',
      senderId: 'user-1',
      receiverId: 'user-2',
      text: 'Pretty good! Just working on some projects. How about you?',
      timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
      isRead: true,
      messageType: 'text',
    },
    {
      id: 'msg-4',
      chatId: 'chat-1',
      senderId: 'user-2',
      receiverId: 'user-1',
      text: 'Same here! Been busy with work but it\'s going well.',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      isRead: true,
      messageType: 'text',
    },
    {
      id: 'msg-5',
      chatId: 'chat-1',
      senderId: 'user-2',
      receiverId: 'user-1',
      text: 'Hey! How are you doing today?',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      isRead: false,
      messageType: 'text',
    },
  ],
  'chat-2': [
    {
      id: 'msg-6',
      chatId: 'chat-2',
      senderId: 'user-3',
      receiverId: 'user-1',
      text: 'Hey, do you need help with that React project?',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      isRead: true,
      messageType: 'text',
    },
    {
      id: 'msg-7',
      chatId: 'chat-2',
      senderId: 'user-1',
      receiverId: 'user-3',
      text: 'Yes, that would be great! I\'m stuck on the state management part.',
      timestamp: new Date(Date.now() - 6900000),
      isRead: true,
      messageType: 'text',
    },
    {
      id: 'msg-8',
      chatId: 'chat-2',
      senderId: 'user-3',
      receiverId: 'user-1',
      text: 'No problem! Let me share some code examples with you.',
      timestamp: new Date(Date.now() - 6600000),
      isRead: true,
      messageType: 'text',
    },
    {
      id: 'msg-9',
      chatId: 'chat-2',
      senderId: 'user-3',
      receiverId: 'user-1',
      text: 'Check your email, I sent you some resources!',
      timestamp: new Date(Date.now() - 4200000),
      isRead: true,
      messageType: 'text',
    },
    {
      id: 'msg-10',
      chatId: 'chat-2',
      senderId: 'user-1',
      receiverId: 'user-3',
      text: 'Thanks for the help with the project!',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isRead: true,
      messageType: 'text',
    },
  ],
  'chat-3': [
    {
      id: 'msg-11',
      chatId: 'chat-3',
      senderId: 'user-1',
      receiverId: 'user-4',
      text: 'Hi Carol! How was your weekend?',
      timestamp: new Date(Date.now() - 10800000), // 3 hours ago
      isRead: true,
      messageType: 'text',
    },
    {
      id: 'msg-12',
      chatId: 'chat-3',
      senderId: 'user-4',
      receiverId: 'user-1',
      text: 'It was amazing! Went hiking with friends.',
      timestamp: new Date(Date.now() - 10200000),
      isRead: true,
      messageType: 'text',
    },
    {
      id: 'msg-13',
      chatId: 'chat-3',
      senderId: 'user-1',
      receiverId: 'user-4',
      text: 'That sounds fun! I love hiking too.',
      timestamp: new Date(Date.now() - 9600000),
      isRead: true,
      messageType: 'text',
    },
    {
      id: 'msg-14',
      chatId: 'chat-3',
      senderId: 'user-4',
      receiverId: 'user-1',
      text: 'We should go together sometime!',
      timestamp: new Date(Date.now() - 8400000),
      isRead: true,
      messageType: 'text',
    },
    {
      id: 'msg-15',
      chatId: 'chat-3',
      senderId: 'user-4',
      receiverId: 'user-1',
      text: 'Let\'s meet up for coffee this weekend!',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      isRead: false,
      messageType: 'text',
    },
  ],
};

// Helper functions for mock data
export const getMockUserById = (userId: string): User | null => {
  if (userId === mockCurrentUser.uid) return mockCurrentUser;
  return mockUsers.find(user => user.uid === userId) || null;
};

export const getMockContactById = (userId: string): Contact | null => {
  return mockContacts.find(contact => contact.uid === userId) || null;
};

export const addMockMessage = (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
  const newMessage: Message = {
    ...message,
    id: `msg-${Date.now()}`,
    timestamp: new Date(),
  };
  
  if (!mockMessages[chatId]) {
    mockMessages[chatId] = [];
  }
  
  mockMessages[chatId].push(newMessage);
  
  // Update chat's last message
  const chat = mockChats.find(c => c.id === chatId);
  if (chat) {
    chat.lastMessage = newMessage;
    chat.lastMessageTime = newMessage.timestamp;
    if (message.senderId !== mockCurrentUser.uid) {
      chat.unreadCount += 1;
    }
  }
  
  return newMessage;
};