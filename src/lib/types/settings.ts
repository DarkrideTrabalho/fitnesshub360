
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  userId: string;
}

export type Language = {
  code: string;
  name: string;
  flag: string;
};

export const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];
