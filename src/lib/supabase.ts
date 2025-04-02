
// This file is deprecated. Use @/integrations/supabase/client instead.
import { supabase } from '@/integrations/supabase/client';

console.warn('src/lib/supabase.ts is deprecated. Import from @/integrations/supabase/client instead.');

// Re-export the supabase client for backwards compatibility
export { supabase };

// Export the test connection function for backwards compatibility
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
          // Try a simple function call instead of RPC
          const { error: authError } = await supabase.auth.getUser();
          
          if (authError) {
            console.error('Error testing Supabase auth:', authError);
            return false;
          }
          
          console.log('Supabase auth connection successful');
          return true;
        } catch (authError) {
          console.error('Exception testing auth connection:', authError);
        }
        
        return false;
      }
      
      console.log('Supabase connection successful with admin_profiles table');
      return true;
    } catch (tableError) {
      console.error('Exception testing table connection:', tableError);
      
      // Last resort: Try direct API call
      try {
        // Get the URL from the Supabase config
        const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        
        if (!url || !apiKey) {
          console.error('Supabase URL or API key not found in environment variables');
          return false;
        }
        
        const authResponse = await fetch(`${url}/auth/v1/`, {
          headers: {
            'apikey': apiKey,
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

// Re-export other functions for backwards compatibility
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

// Re-export these functions for backwards compatibility
export { checkUserExists, getUserProfile } from '@/services/userService';
