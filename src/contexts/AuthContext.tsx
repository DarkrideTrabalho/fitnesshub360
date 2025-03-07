
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, testSupabaseConnection } from '@/lib/supabase';
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
        // Test database connection first
        const isConnected = await testSupabaseConnection();
        
        if (!isConnected) {
          console.error('AuthProvider: Failed to connect to Supabase');
          toast.error('Database connection failed', {
            description: 'Could not connect to the database. Please check your internet connection.'
          });
          setIsLoading(false);
          return;
        }
        
        console.log('AuthProvider: Getting initial session');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('AuthProvider: Error getting session:', sessionError);
          toast.error('Authentication error', {
            description: 'Could not retrieve session information.'
          });
          setIsLoading(false);
          return;
        }
        
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
        toast.error('Failed to initialize authentication');
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
      
      // First check if admin profile exists
      const { data: adminProfile, error: adminError } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (adminError && adminError.code !== 'PGRST116') {
        console.error('AuthProvider: Error fetching admin profile:', adminError);
      }
      
      if (adminProfile) {
        console.log('AuthProvider: Admin profile found:', adminProfile);
        setUserProfile({ ...adminProfile, role: 'admin' });
        setIsLoading(false);
        return;
      }
      
      // Then check for teacher profile
      const { data: teacherProfile, error: teacherError } = await supabase
        .from('teacher_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (teacherError && teacherError.code !== 'PGRST116') {
        console.error('AuthProvider: Error fetching teacher profile:', teacherError);
      }
      
      if (teacherProfile) {
        console.log('AuthProvider: Teacher profile found:', teacherProfile);
        setUserProfile({ ...teacherProfile, role: 'teacher' });
        setIsLoading(false);
        return;
      }
      
      // Finally check for student profile
      const { data: studentProfile, error: studentError } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (studentError && studentError.code !== 'PGRST116') {
        console.error('AuthProvider: Error fetching student profile:', studentError);
      }
      
      if (studentProfile) {
        console.log('AuthProvider: Student profile found:', studentProfile);
        setUserProfile({ ...studentProfile, role: 'student' });
        setIsLoading(false);
        return;
      }
      
      console.error('AuthProvider: No profile found for user:', userId);
      toast.error('No profile found for your account. Please contact an administrator.');
      setIsLoading(false);
    } catch (error) {
      console.error('AuthProvider: Error fetching user profile:', error);
      toast.error('Error loading your profile. Please try again.');
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('AuthProvider: Attempting login with:', email);
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Trim the email and password
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();
      
      // Test connection before attempting login
      const isConnected = await testSupabaseConnection();
      if (!isConnected) {
        throw new Error('Cannot connect to the database. Please check your connection.');
      }
      
      // Debug login attempt
      console.log(`AuthProvider: Login attempt with: ${trimmedEmail}, password length: ${trimmedPassword.length}`);
      
      // Try with direct API call first for debugging
      try {
        console.log('Trying direct API login...');
        const response = await fetch(`${supabase.auth.url}/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabase.supabaseKey,
          },
          body: JSON.stringify({
            email: trimmedEmail,
            password: trimmedPassword,
          }),
        });
        
        const result = await response.json();
        console.log('Direct API login result:', result);
      } catch (directApiError) {
        console.error('Error with direct API login:', directApiError);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: trimmedEmail, 
        password: trimmedPassword
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
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('AuthProvider: Error during sign out:', error);
        throw error;
      }
      
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
