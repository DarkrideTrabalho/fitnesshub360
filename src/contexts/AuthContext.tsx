
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, getUserProfile } from '@/lib/supabase';
import { UserRole } from '@/lib/types';
import { toast } from 'sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Initializing');
    
    const initializeAuth = async () => {
      try {
        console.log('AuthProvider: Getting initial session');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('AuthProvider: Initial session:', session ? 'Found' : 'Not found');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log('AuthProvider: User found in session, fetching profile');
          await fetchUserProfile(session.user.id);
        } else {
          console.log('AuthProvider: No user in session');
          setUserProfile(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('AuthProvider: Error initializing authentication:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('AuthProvider: Auth state change:', _event);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        console.log('AuthProvider: User updated, fetching profile');
        fetchUserProfile(session.user.id);
      } else {
        console.log('AuthProvider: User signed out');
        setUserProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      console.log('AuthProvider: Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('AuthProvider: Fetching profile for userId:', userId);
      setIsLoading(true);
      const profile = await getUserProfile(userId);
      console.log('AuthProvider: Profile retrieved:', profile);
      
      if (!profile) {
        console.error('AuthProvider: No profile found for user:', userId);
        toast.error('No profile found for your account. Please contact an administrator.');
      } else {
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('AuthProvider: Error fetching user profile:', error);
      toast.error('Error loading your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('AuthProvider: Attempting login with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('AuthProvider: Login error:', error);
        throw error;
      }
      
      console.log('AuthProvider: Login successful:', data);
      // The auth state listener will handle updating state
    } catch (error: any) {
      console.error('AuthProvider: Exception during login:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthProvider: Attempting to sign out');
      await supabase.auth.signOut();
      console.log('AuthProvider: Sign out successful');
      // The auth state listener will handle updating state
    } catch (error) {
      console.error('AuthProvider: Error during sign out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userProfile,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
