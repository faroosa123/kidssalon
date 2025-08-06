'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { useContacts } from '@/hooks/useContacts';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Send, Phone, Video, MoreVertical, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Contact, Message } from '@/types';

interface ChatScreenProps {
  chatId: string;
  contactId: string;
  onBack: () => void;
}

export default function ChatScreen({ chatId, contactId, onBack }: ChatScreenProps) {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, loading, sendMessage, markMessagesAsRead } = useMessages(chatId);
  const { getContactById } = useContacts();
  const { user } = useAuth();
  const [contact, setContact] = useState<Contact | null>(null);

  // Fetch contact details
  useEffect(() => {
    const fetchContact = async () => {
      const contactData = await getContactById(contactId);
      setContact(contactData);
    };
    fetchContact();
  }, [contactId, getContactById]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark messages as read when chat opens
  useEffect(() => {
    const unreadMessages = messages.filter(
      message => message.receiverId === user?.uid && !message.isRead
    );
    if (unreadMessages.length > 0) {
      markMessagesAsRead(unreadMessages.map(msg => msg.id));
    }
  }, [messages, user, markMessagesAsRead]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user) return;

    try {
      await sendMessage(messageText, contactId);
      setMessageText('');
      setIsTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusText = () => {
    if (!contact) return '';
    if (contact.isOnline) {
      return 'Online';
    } else {
      return `Last seen ${formatDistanceToNow(contact.lastSeen, { addSuffix: true })}`;
    }
  };

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors md:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                {contact.photoURL ? (
                  <img
                    src={contact.photoURL}
                    alt={contact.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-medium">
                    {contact.displayName?.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>
              {contact.isOnline && (
                <Circle className="w-3 h-3 text-green-500 fill-current absolute -bottom-1 -right-1" />
              )}
            </div>
            
            <div>
              <h2 className="font-medium text-gray-900">{contact.displayName}</h2>
              <p className="text-xs text-gray-500">{getStatusText()}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-center">
            <div className="text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={message.senderId === user?.uid}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                setIsTyping(e.target.value.length > 0);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full resize-none focus:outline-none focus:border-green-500 max-h-32"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '40px',
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn
            ? 'bg-green-600 text-white rounded-br-none'
            : 'bg-white text-gray-900 rounded-bl-none border'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        <div className="flex items-center justify-end mt-1 space-x-1">
          <span
            className={`text-xs ${
              isOwn ? 'text-green-100' : 'text-gray-500'
            }`}
          >
            {formatTime(message.timestamp)}
          </span>
          {isOwn && (
            <span className="text-green-100">
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}