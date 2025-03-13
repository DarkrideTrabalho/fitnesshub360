
import { supabase } from '@/lib/supabase';
import { UserSettings } from '@/lib/types/settings';

/**
 * Save user settings to the database
 */
export const saveUserSettings = async ({
  userId,
  theme,
  language,
}: {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
}): Promise<void> => {
  try {
    const { error } = await supabase.rpc('save_user_settings', {
      p_user_id: userId as string,
      p_theme: theme,
      p_language: language,
    });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving user settings:', error);
    throw error;
  }
};

/**
 * Get user settings from the database
 */
export const getUserSettings = async (
  userId: string
): Promise<UserSettings | null> => {
  try {
    const { data, error } = await supabase.rpc('get_user_settings', {
      p_user_id: userId as string,
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
): Promise<void> => {
  try {
    await saveUserSettings({
      userId,
      theme: 'system',
      language: 'en',
    });
  } catch (error) {
    console.error('Error creating default user settings:', error);
  }
};
