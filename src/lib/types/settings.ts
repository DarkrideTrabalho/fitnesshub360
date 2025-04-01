
// Settings Types
export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

export interface Theme {
  value: string;
  label: string;
}

export interface Language {
  value: string;
  label: string;
  code: string;
  flag: string;
  name: string;
}

export const AVAILABLE_THEMES: Theme[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' }
];

export const AVAILABLE_LANGUAGES: Language[] = [
  { value: 'en', label: 'English', code: 'en', flag: '🇬🇧', name: 'English' },
  { value: 'pt', label: 'Portuguese', code: 'pt', flag: '🇵🇹', name: 'Portuguese' },
  { value: 'es', label: 'Spanish', code: 'es', flag: '🇪🇸', name: 'Spanish' }
];
