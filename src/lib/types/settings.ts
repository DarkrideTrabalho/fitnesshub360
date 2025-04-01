
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
}

export const AVAILABLE_THEMES: Theme[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' }
];

export const AVAILABLE_LANGUAGES: Language[] = [
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'es', label: 'Spanish' }
];
