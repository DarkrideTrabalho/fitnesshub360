
import { supabase } from '@/lib/supabase';
import { UserSettings, SupabaseUserSettings } from '@/lib/types';
import { toast } from 'sonner';

/**
 * Save user settings to Supabase
 */
export const saveUserSettings = async (
  settings: UserSettings & { userId: string }
): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc(
      'save_user_settings', 
      {
        p_user_id: settings.userId,
        p_theme: settings.theme,
        p_language: settings.language
      }
    );

    if (error) {
      console.error('Error saving user settings:', error);
      toast.error('Failed to save settings');
      return false;
    }

    toast.success('Settings saved successfully');
    return true;
  } catch (error) {
    console.error('Exception saving user settings:', error);
    toast.error('An error occurred while saving settings');
    return false;
  }
};

/**
 * Get user settings from Supabase
 */
export const getUserSettings = async (userId: string): Promise<UserSettings & { userId: string }> => {
  try {
    const { data, error } = await supabase.rpc<SupabaseUserSettings>(
      'get_user_settings',
      { p_user_id: userId }
    );

    if (error) {
      console.error('Error getting user settings:', error);
      return { theme: 'system', language: 'en', userId };
    }

    if (!data) {
      console.log('No settings found, returning defaults');
      return { theme: 'system', language: 'en', userId };
    }

    return {
      theme: data.theme,
      language: data.language,
      userId: data.user_id
    };
  } catch (error) {
    console.error('Exception getting user settings:', error);
    return { theme: 'system', language: 'en', userId };
  }
};
