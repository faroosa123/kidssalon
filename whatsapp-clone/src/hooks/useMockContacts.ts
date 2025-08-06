'use client';

import { useState, useEffect } from 'react';
import { Contact, User } from '@/types';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { mockContacts, mockUsers, getMockContactById } from '@/lib/mockData';

export function useMockContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useMockAuth();

  // Fetch all registered users (for contact discovery)
  useEffect(() => {
    if (!user) {
      setAllUsers([]);
      setContacts([]);
      setLoading(false);
      return;
    }

    // Simulate loading delay
    setTimeout(() => {
      // Filter out current user
      const otherUsers = mockUsers.filter(u => u.uid !== user.uid);
      const otherContacts = mockContacts.filter(c => c.uid !== user.uid);
      
      setAllUsers(otherUsers);
      setContacts(otherContacts);
      setLoading(false);
    }, 400);
  }, [user]);

  // Search contacts by name or email
  const searchContacts = (searchTerm: string): Contact[] => {
    if (!searchTerm.trim()) return contacts;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return contacts.filter(contact =>
      contact.displayName.toLowerCase().includes(lowercaseSearch) ||
      contact.email?.toLowerCase().includes(lowercaseSearch) ||
      contact.phoneNumber?.includes(searchTerm)
    );
  };

  // Get contact by user ID
  const getContactById = async (userId: string): Promise<Contact | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    return getMockContactById(userId);
  };

  // Check if a phone number or email is registered
  const checkRegistration = async (identifier: string): Promise<Contact[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return contacts.filter(contact =>
      contact.email === identifier || contact.phoneNumber === identifier
    );
  };

  // Get online contacts
  const getOnlineContacts = (): Contact[] => {
    return contacts.filter(contact => contact.isOnline);
  };

  return {
    contacts,
    allUsers,
    loading,
    searchContacts,
    getContactById,
    checkRegistration,
    getOnlineContacts,
  };
}