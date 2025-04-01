
import { supabase } from "@/lib/supabase";
import { UserSettings, AVAILABLE_THEMES, AVAILABLE_LANGUAGES } from "@/lib/types";

// Get user settings
export const getUserSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    if (!userId) {
      console.error("getUserSettings: No userId provided");
      return null;
    }

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No settings found, create default settings
        return createDefaultSettings(userId);
      }
      console.error("Error fetching user settings:", error);
      return null;
    }

    if (!data) {
      return createDefaultSettings(userId);
    }

    return {
      userId: data.user_id,
      theme: data.theme,
      language: data.language
    };
  } catch (error) {
    console.error("Exception in getUserSettings:", error);
    return null;
  }
};

// Create default settings
export const createDefaultSettings = async (userId: string): Promise<UserSettings | null> => {
  try {
    const defaultSettings: UserSettings = {
      userId: userId,
      theme: "system",
      language: "en"
    };

    const { error } = await supabase.from("user_settings").insert([
      {
        user_id: defaultSettings.userId,
        theme: defaultSettings.theme,
        language: defaultSettings.language
      }
    ]);

    if (error) {
      console.error("Error creating default settings:", error);
      return null;
    }

    return defaultSettings;
  } catch (error) {
    console.error("Exception in createDefaultSettings:", error);
    return null;
  }
};

// Update user settings
export const updateUserSettings = async (
  settings: UserSettings
): Promise<UserSettings | null> => {
  try {
    const { error } = await supabase
      .from("user_settings")
      .update({
        theme: settings.theme,
        language: settings.language
      })
      .eq("user_id", settings.userId);

    if (error) {
      console.error("Error updating user settings:", error);
      return null;
    }

    return settings;
  } catch (error) {
    console.error("Exception in updateUserSettings:", error);
    return null;
  }
};

// Get available themes
export const getAvailableThemes = () => AVAILABLE_THEMES;

// Get available languages
export const getAvailableLanguages = () => AVAILABLE_LANGUAGES;
