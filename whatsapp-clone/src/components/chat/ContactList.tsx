'use client';

import React, { useState } from 'react';
import { useMockContacts } from '@/hooks/useMockContacts';
import { useMockChats } from '@/hooks/useMockChats';
import { ArrowLeft, Search, UserPlus, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ContactListProps {
  onBack: () => void;
  onContactSelect: (contactId: string) => void;
}

export default function ContactList({ onBack, onContactSelect }: ContactListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { contacts, loading, searchContacts } = useMockContacts();
  const { createOrGetChat } = useMockChats();

  // Get filtered contacts based on search
  const filteredContacts = searchTerm ? searchContacts(searchTerm) : contacts;

  const handleContactClick = async (contact: Contact) => {
    try {
      // Create or get existing chat with this contact
      const chatId = await createOrGetChat(contact.uid);
      onContactSelect(contact.uid);
      onBack(); // Go back to chat list
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const formatLastSeen = (lastSeen: Date) => {
    return formatDistanceToNow(lastSeen, { addSuffix: true });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center p-4 bg-green-600 text-white">
        <button
          onClick={onBack}
          className="mr-3 p-1 hover:bg-green-700 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-semibold">Select Contact</h1>
          <p className="text-xs text-green-100">
            {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-green-500"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <UserPlus className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try a different search term' : 'No registered contacts available'}
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredContacts.map((contact) => (
              <ContactListItem
                key={contact.uid}
                contact={contact}
                onClick={() => handleContactClick(contact)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ContactListItemProps {
  contact: Contact;
  onClick: () => void;
}

function ContactListItem({ contact, onClick }: ContactListItemProps) {
  const getStatusText = () => {
    if (contact.isOnline) {
      return 'Online';
    } else {
      return `Last seen ${formatDistanceToNow(contact.lastSeen, { addSuffix: true })}`;
    }
  };

  return (
    <div
      onClick={onClick}
      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mr-3 relative">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          {contact.photoURL ? (
            <img
              src={contact.photoURL}
              alt={contact.displayName}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <span className="text-white font-medium">
              {contact.displayName?.charAt(0).toUpperCase() || '?'}
            </span>
          )}
        </div>
        {/* Online status indicator */}
        <div className="absolute -bottom-1 -right-1">
          <Circle
            className={`w-4 h-4 ${
              contact.isOnline ? 'text-green-500 fill-current' : 'text-gray-400'
            }`}
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {contact.displayName || 'Unknown User'}
          </h3>
          {contact.isOnline && (
            <span className="text-xs text-green-600 font-medium">Online</span>
          )}
        </div>
        
        <div className="space-y-1">
          {contact.email && (
            <p className="text-xs text-gray-500 truncate">{contact.email}</p>
          )}
          {contact.phoneNumber && (
            <p className="text-xs text-gray-500 truncate">{contact.phoneNumber}</p>
          )}
          <p className="text-xs text-gray-400">{getStatusText()}</p>
        </div>
      </div>

      {/* Action indicator */}
      <div className="flex-shrink-0 ml-2">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-green-600 text-xs font-medium">
            {contact.displayName?.charAt(0).toUpperCase() || '?'}
          </span>
        </div>
      </div>
    </div>
  );
}