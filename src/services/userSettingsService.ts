
import { supabase } from '@/lib/supabase';
import { UserSettings } from '@/lib/types/settings';
import { toast } from 'sonner';

/**
 * Saves user settings to the database
 * @param settings User settings object
 */
export const saveUserSettings = async (settings: UserSettings): Promise<boolean> => {
  try {
    console.log('Saving user settings:', settings);
    
    // Try to use RPC function first
    try {
      const { error } = await supabase.rpc('save_user_settings', {
        p_user_id: settings.userId,
        p_theme: settings.theme,
        p_language: settings.language
      });
      
      if (error) throw error;
      
      console.log('User settings saved via RPC');
      return true;
    } catch (rpcError) {
      console.warn('RPC function failed, falling back to direct upsert', rpcError);
      
      // Fallback to direct upsert
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: settings.userId,
          theme: settings.theme,
          language: settings.language
        });
        
      if (error) throw error;
      
      console.log('User settings saved via direct upsert');
      return true;
    }
  } catch (error) {
    console.error('Error saving user settings:', error);
    toast.error('Failed to save settings');
    return false;
  }
};

/**
 * Gets user settings from the database
 * @param userId User ID
 */
export const getUserSettings = async (userId: string): Promise<UserSettings> => {
  try {
    console.log(`Getting settings for user ${userId}`);
    
    // Try to use RPC function first
    try {
      const { data, error } = await supabase.rpc('get_user_settings', {
        p_user_id: userId
      });
      
      if (error) throw error;
      
      console.log('User settings retrieved via RPC:', data);
      
      return {
        theme: data.theme || 'system',
        language: data.language || 'en',
        userId
      };
    } catch (rpcError) {
      console.warn('RPC function failed, falling back to direct select', rpcError);
      
      // Fallback to direct select
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" error, which we handle by returning defaults
        throw error;
      }
      
      console.log('User settings retrieved via direct select:', data);
      
      return {
        theme: data?.theme || 'system',
        language: data?.language || 'en',
        userId
      };
    }
  } catch (error) {
    console.error('Error getting user settings:', error);
    toast.error('Failed to load settings');
    
    // Return default settings on error
    return {
      theme: 'system',
      language: 'en',
      userId
    };
  }
};
