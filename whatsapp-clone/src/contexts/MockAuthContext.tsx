'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';
import { mockCurrentUser } from '@/lib/mockData';
import toast from 'react-hot-toast';

const MockAuthContext = createContext<AuthContextType | undefined>(undefined);

export function useMockAuth() {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuth must be used within a MockAuthProvider');
  }
  return context;
}

interface MockAuthProviderProps {
  children: ReactNode;
}

export function MockAuthProvider({ children }: MockAuthProviderProps) {
  const [user, setUser] = useState<User | null>(mockCurrentUser); // Auto-login for demo
  const [loading, setLoading] = useState(false);

  // Mock sign in - always succeeds
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser(mockCurrentUser);
    setLoading(false);
    toast.success('Successfully signed in! (Demo Mode)');
  };

  // Mock sign up - always succeeds
  const signUp = async (email: string, password: string, displayName: string, phoneNumber?: string) => {
    setLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      ...mockCurrentUser,
      email,
      displayName,
      phoneNumber: phoneNumber || '',
    };
    
    setUser(newUser);
    setLoading(false);
    toast.success('Account created successfully! (Demo Mode)');
  };

  // Mock sign out
  const signOut = async () => {
    setLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    setLoading(false);
    toast.success('Successfully signed out!');
  };

  // Mock update user status
  const updateUserStatus = async (isOnline: boolean) => {
    if (user) {
      setUser({
        ...user,
        isOnline,
        lastSeen: new Date(),
      });
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserStatus,
  };

  return (
    <MockAuthContext.Provider value={value}>
      {children}
    </MockAuthContext.Provider>
  );
}