
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Use the values from the connected Supabase project
const supabaseUrl = 'https://bvkjuqizqetxbgojvtnk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2a2p1cWl6cWV0eGJnb2p2dG5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwMjA3MjksImV4cCI6MjA1NjU5NjcyOX0.gVLSgClCuapCFSp4x4xQDtZdwBfKDkPGWF026aJ6MgI';

// Display detailed information about the configuration for debugging
console.log('====== SUPABASE CONFIGURATION ======');
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key (present):', !!supabaseAnonKey);
console.log('Supabase Anon Key (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');
console.log('===================================');

// Create the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'fitnesshub-auth-token'
  },
  // Add global error handler
  global: {
    fetch: async (url, options) => {
      const response = await fetch(url, options);
      
      // Log detailed error information for non-2xx responses
      if (!response.ok && !url.toString().includes('/auth/v1/token')) {
        console.error(`Supabase request failed: ${response.status} ${response.statusText}`, {
          url,
          method: options?.method || 'GET',
        });
      }
      
      return response;
    }
  }
});

// Function to test the connection with Supabase
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // First try to get the current session to test auth connection
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error getting current session:', sessionError);
      } else {
        console.log('Session check successful', sessionData.session ? 'Session exists' : 'No session');
      }
    } catch (sessionErr) {
      console.error('Exception getting session:', sessionErr);
    }
    
    // Try a simple query to check if the connection works
    // Changed to a more reliable table that should always exist
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('Error testing Supabase connection with admin_profiles:', error);
        
        // Try another table in case admin_profiles doesn't exist yet
        try {
          const { data: data2, error: error2 } = await supabase.rpc('get_service_role');
          
          if (error2) {
            console.error('Error testing Supabase service role:', error2);
            return false;
          }
          
          console.log('Supabase service role connection successful');
          return true;
        } catch (rpcError) {
          console.error('Exception testing RPC connection:', rpcError);
        }
        
        return false;
      }
      
      console.log('Supabase connection successful with admin_profiles table');
      return true;
    } catch (tableError) {
      console.error('Exception testing table connection:', tableError);
      
      // Last resort: Try auth API
      try {
        const authResponse = await fetch(`${supabaseUrl}/auth/v1/`, {
          headers: {
            'apikey': supabaseAnonKey,
            'Content-Type': 'application/json'
          }
        });
        
        if (authResponse.ok || authResponse.status === 404) {
          // 404 is expected for this endpoint, but means auth API is working
          console.log('Supabase auth API is reachable');
          return true;
        }
        
        console.error('Supabase auth API not reachable:', authResponse.status);
        return false;
      } catch (authError) {
        console.error('Exception testing auth API:', authError);
        return false;
      }
    }
  } catch (error) {
    console.error('Exception when testing Supabase connection:', error);
    return false;
  }
};

// Function to get the current user
export const getCurrentUser = async () => {
  try {
    console.log('Getting current session...');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      console.log('No session found');
      return null;
    }
    
    console.log('Session found, getting user...');
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      throw error;
    }
    
    console.log('User found:', data.user);
    return data.user;
  } catch (error) {
    console.error('Exception getting current user:', error);
    throw error;
  }
};

// Function to check if a user with specified email exists
export const checkUserExists = async (email: string) => {
  try {
    // Try to sign in with an invalid password, which will tell us if the user exists
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: 'invalid-test-password'
    });
    
    // If we get a specific error message, the user exists
    const userExists = error?.message.includes('Invalid login credentials');
    
    console.log(`User check for ${email}: ${userExists ? 'Exists' : 'Does not exist'}`);
    return userExists;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    return false;
  }
};

// Function to get the user profile
export const getUserProfile = async (userId: string) => {
  console.log('Getting profile for user:', userId);
  
  try {
    // First try to get as admin
    const { data: adminData, error: adminError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (adminError && adminError.code !== 'PGRST116') {
      console.error('Error getting admin profile:', adminError);
    }
      
    if (adminData) {
      console.log('Admin profile found:', adminData);
      return { ...adminData, role: 'admin' };
    }
    
    // Try to get as teacher
    const { data: teacherData, error: teacherError } = await supabase
      .from('teacher_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (teacherError && teacherError.code !== 'PGRST116') {
      console.error('Error getting teacher profile:', teacherError);
    }
      
    if (teacherData) {
      console.log('Teacher profile found:', teacherData);
      return { ...teacherData, role: 'teacher' };
    }
    
    // Try to get as student
    const { data: studentData, error: studentError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (studentError && studentError.code !== 'PGRST116') {
      console.error('Error getting student profile:', studentError);
    }
      
    if (studentData) {
      console.log('Student profile found:', studentData);
      return { ...studentData, role: 'student' };
    }
    
    // If no profile found
    console.log('No profile found for user:', userId);
    return null;
  } catch (error) {
    console.error('Exception getting user profile:', error);
    return null;
  }
};
