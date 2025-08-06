'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, AuthContextType } from '@/types';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert Firebase user to our User type
  const createUserObject = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const userData = userDoc.data();
    
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      phoneNumber: firebaseUser.phoneNumber || userData?.phoneNumber,
      displayName: firebaseUser.displayName || userData?.displayName || '',
      photoURL: firebaseUser.photoURL || userData?.photoURL,
      isOnline: userData?.isOnline || true,
      lastSeen: userData?.lastSeen?.toDate() || new Date(),
      createdAt: userData?.createdAt?.toDate() || new Date(),
    };
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully signed in!');
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string, phoneNumber?: string) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update Firebase Auth profile
      await updateProfile(firebaseUser, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        uid: firebaseUser.uid,
        email,
        displayName,
        phoneNumber: phoneNumber || '',
        photoURL: '',
        isOnline: true,
        lastSeen: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      if (user) {
        // Update user status to offline before signing out
        await updateUserStatus(false);
      }
      await firebaseSignOut(auth);
      toast.success('Successfully signed out!');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
      throw error;
    }
  };

  // Update user online status
  const updateUserStatus = async (isOnline: boolean) => {
    if (!user) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        isOnline,
        lastSeen: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userObject = await createUserObject(firebaseUser);
          setUser(userObject);
          
          // Update user status to online when authenticated
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            isOnline: true,
            lastSeen: serverTimestamp(),
          });
        } catch (error) {
          console.error('Error setting user:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Update user status when the page is about to unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user) {
        updateUserStatus(false);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [user]);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}