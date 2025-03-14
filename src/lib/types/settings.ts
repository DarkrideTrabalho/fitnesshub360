
// User settings types
export interface UserSettings {
  theme: string;
  language: string;
}

// API response type for Supabase user settings
export interface SupabaseUserSettings {
  user_id: string;
  theme: string;
  language: string;
  created_at?: string;
  updated_at?: string;
}
