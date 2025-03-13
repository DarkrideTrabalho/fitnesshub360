
import { supabase } from '@/lib/supabase';
import { UserSettings } from '@/lib/types';

interface SupabaseUserSettings {
  theme: string;
  language: string;
}

/**
 * Save user settings to the database
 */
export const saveUserSettings = async ({
  userId,
  theme,
  language,
}: UserSettings): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('save_user_settings', {
      p_user_id: userId,
      p_theme: theme,
      p_language: language,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving user settings:', error);
    return false;
  }
};

/**
 * Get user settings from the database
 */
export const getUserSettings = async (
  userId: string
): Promise<UserSettings> => {
  try {
    const { data, error } = await supabase.rpc<SupabaseUserSettings>('get_user_settings', {
      p_user_id: userId,
    });

    if (error) throw error;

    // Default settings if none are found
    if (!data) {
      return {
        theme: 'system',
        language: 'en',
        userId,
      };
    }

    return {
      theme: (data.theme || 'system') as 'light' | 'dark' | 'system',
      language: data.language || 'en',
      userId,
    };
  } catch (error) {
    console.error('Error fetching user settings:', error);
    // Return default settings on error
    return {
      theme: 'system',
      language: 'en',
      userId,
    };
  }
};

/**
 * Create default settings for a new user
 */
export const createDefaultUserSettings = async (
  userId: string
): Promise<boolean> => {
  try {
    return await saveUserSettings({
      userId,
      theme: 'system',
      language: 'en',
    });
  } catch (error) {
    console.error('Error creating default user settings:', error);
    return false;
  }
};
