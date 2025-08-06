'use client';

import React, { useState } from 'react';
import { useChats } from '@/hooks/useChats';
import { useContacts } from '@/hooks/useContacts';
import { useAuth } from '@/contexts/AuthContext';
import { Search, MessageCircle, Users, Settings, LogOut } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Chat, Contact } from '@/types';
import ContactList from './ContactList';

interface ChatListProps {
  onChatSelect: (chatId: string, contactId: string) => void;
  selectedChatId?: string;
}

export default function ChatList({ onChatSelect, selectedChatId }: ChatListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showContacts, setShowContacts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { chats, loading } = useChats();
  const { getContactById } = useContacts();
  const { user, signOut } = useAuth();

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => {
    // This would ideally include contact names, but for now we'll use lastMessage
    return chat.lastMessage?.text.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleChatClick = async (chat: Chat) => {
    // Find the other participant (not current user)
    const otherParticipant = chat.participants.find((p: string) => p !== user?.uid);
    if (otherParticipant) {
      onChatSelect(chat.id, otherParticipant);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (showContacts) {
    return (
      <ContactList
        onBack={() => setShowContacts(false)}
        onContactSelect={(contactId) => {
          // This will be handled by the parent component
          setShowContacts(false);
        }}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-green-600 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
            <span className="font-medium">
              {user?.displayName?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h1 className="font-semibold">WhatsApp</h1>
            <p className="text-xs text-green-100">
              {user?.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowContacts(true)}
            className="p-2 hover:bg-green-700 rounded-full transition-colors"
            title="Contacts"
          >
            <Users className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-green-700 rounded-full transition-colors"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          {showSettings && (
            <div className="absolute top-16 right-4 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-10">
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-green-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No chats yet</h3>
            <p className="text-gray-500 mb-4">Start a conversation by selecting a contact</p>
            <button
              onClick={() => setShowContacts(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Browse Contacts
            </button>
          </div>
        ) : (
          <div className="divide-y">
            {filteredChats.map((chat) => {
              const otherParticipant = chat.participants.find(p => p !== user?.uid);
              return (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  otherParticipant={otherParticipant || ''}
                  isSelected={selectedChatId === chat.id}
                  onClick={() => handleChatClick(chat)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface ChatListItemProps {
  chat: Chat;
  otherParticipant: string;
  isSelected: boolean;
  onClick: () => void;
}

function ChatListItem({ chat, otherParticipant, isSelected, onClick }: ChatListItemProps) {
  const { getContactById } = useContacts();
  const [contact, setContact] = React.useState<Contact | null>(null);

  React.useEffect(() => {
    const fetchContact = async () => {
      const contactData = await getContactById(otherParticipant);
      setContact(contactData);
    };
    if (otherParticipant) {
      fetchContact();
    }
  }, [otherParticipant, getContactById]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return formatDistanceToNow(date, { addSuffix: true });
    }
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
        isSelected ? 'bg-green-50 border-r-4 border-green-600' : ''
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mr-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          {contact?.photoURL ? (
            <img
              src={contact.photoURL}
              alt={contact.displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-medium">
              {contact?.displayName?.charAt(0).toUpperCase() || '?'}
            </span>
          )}
        </div>
        {contact?.isOnline && (
          <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white absolute ml-9 -mt-3"></div>
        )}
      </div>

      {/* Chat Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {contact?.displayName || 'Unknown User'}
          </h3>
          <span className="text-xs text-gray-500">
            {chat.lastMessageTime && formatTime(chat.lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 truncate">
            {chat.lastMessage?.text || 'No messages yet'}
          </p>
          {chat.unreadCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-600 rounded-full">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}