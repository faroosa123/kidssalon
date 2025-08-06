'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Contact, User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch all registered users (for contact discovery)
  useEffect(() => {
    if (!user) {
      setAllUsers([]);
      setLoading(false);
      return;
    }

    const usersQuery = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const userData: User[] = [];
      snapshot.forEach((doc) => {
        if (doc.id !== user.uid) { // Exclude current user
          const data = doc.data();
          userData.push({
            uid: doc.id,
            email: data.email,
            phoneNumber: data.phoneNumber,
            displayName: data.displayName,
            photoURL: data.photoURL,
            isOnline: data.isOnline || false,
            lastSeen: data.lastSeen?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        }
      });
      setAllUsers(userData);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  // Convert users to contacts format
  useEffect(() => {
    const contactsData: Contact[] = allUsers.map(userData => ({
      uid: userData.uid,
      displayName: userData.displayName,
      phoneNumber: userData.phoneNumber,
      email: userData.email,
      photoURL: userData.photoURL,
      isRegistered: true, // All users from DB are registered
      isOnline: userData.isOnline,
      lastSeen: userData.lastSeen,
    }));
    setContacts(contactsData);
  }, [allUsers]);

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
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return null;

      const userData = userDoc.data();
      return {
        uid: userId,
        displayName: userData.displayName,
        phoneNumber: userData.phoneNumber,
        email: userData.email,
        photoURL: userData.photoURL,
        isRegistered: true,
        isOnline: userData.isOnline || false,
        lastSeen: userData.lastSeen?.toDate() || new Date(),
      };
    } catch (error) {
      console.error('Error fetching contact:', error);
      return null;
    }
  };

  // Check if a phone number or email is registered
  const checkRegistration = async (identifier: string): Promise<Contact[]> => {
    try {
      // Check by email
      const emailQuery = query(
        collection(db, 'users'),
        where('email', '==', identifier)
      );
      const emailSnapshot = await getDocs(emailQuery);
      
      // Check by phone number
      const phoneQuery = query(
        collection(db, 'users'),
        where('phoneNumber', '==', identifier)
      );
      const phoneSnapshot = await getDocs(phoneQuery);

      const registeredContacts: Contact[] = [];

      emailSnapshot.forEach(doc => {
        const data = doc.data();
        registeredContacts.push({
          uid: doc.id,
          displayName: data.displayName,
          phoneNumber: data.phoneNumber,
          email: data.email,
          photoURL: data.photoURL,
          isRegistered: true,
          isOnline: data.isOnline || false,
          lastSeen: data.lastSeen?.toDate() || new Date(),
        });
      });

      phoneSnapshot.forEach(doc => {
        const data = doc.data();
        // Avoid duplicates if user has both email and phone
        if (!registeredContacts.find(contact => contact.uid === doc.id)) {
          registeredContacts.push({
            uid: doc.id,
            displayName: data.displayName,
            phoneNumber: data.phoneNumber,
            email: data.email,
            photoURL: data.photoURL,
            isRegistered: true,
            isOnline: data.isOnline || false,
            lastSeen: data.lastSeen?.toDate() || new Date(),
          });
        }
      });

      return registeredContacts;
    } catch (error) {
      console.error('Error checking registration:', error);
      return [];
    }
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