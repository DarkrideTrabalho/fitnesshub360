
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

// Available languages for the application
export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' }
];
