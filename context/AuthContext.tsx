import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import { useRouter, useSegments } from 'expo-router';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function useProtectedRoute(user: User | null) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log('Auth routing - User:', user?.email || 'No user', 'Segments:', segments);

    const currentPath = segments.join('/');
    const isOnAuthPage = currentPath.includes('auth');

    if (!user && !isOnAuthPage) {
      console.log('Redirecting to auth - no user');
      setTimeout(() => {
        router.replace('/auth');
      }, 0);
    } else if (user && isOnAuthPage) {
      console.log('Redirecting to tabs - user authenticated');
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 0);
    }
  }, [user, segments, router]);
}
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useProtectedRoute(user);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user?.email || 'No user');
      
      if (user) {
        try {
          // Save user to Firestore
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            console.log('Creating new user document...');
            await setDoc(userRef, {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              username: user.email?.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || `user${Math.floor(Math.random()*10000)}`,
              photoURL: user.photoURL,
              createdAt: new Date(),
              friends: [],
            });
            console.log('User document created successfully');
          }
        } catch (error) {
          console.error('Error saving user to Firestore:', error);
        }
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}