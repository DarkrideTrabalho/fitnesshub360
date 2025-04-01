
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserSettings, AVAILABLE_LANGUAGES } from '@/lib/types/settings';
import { saveUserSettings, getUserSettings } from '@/services/userSettingsService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SettingsContextType {
  settings: UserSettings;
  updateTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
  updateLanguage: (language: string) => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: UserSettings = {
  theme: 'system',
  language: 'en',
  userId: ''
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadSettings = async () => {
      if (!user) {
        // Use default settings or local storage for non-authenticated users
        const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
        const storedLanguage = localStorage.getItem('language') || 'en';
        
        setSettings({
          theme: storedTheme,
          language: storedLanguage,
          userId: ''
        });
        
        setIsLoading(false);
        
        // Apply the theme
        applyTheme(storedTheme);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Load settings from database for authenticated users
        const userSettings = await getUserSettings(user.id);
        if (userSettings) {
          setSettings(userSettings);
          
          // Apply the theme
          applyTheme(userSettings.theme);
          
          // Store in localStorage as fallback
          localStorage.setItem('theme', userSettings.theme);
          localStorage.setItem('language', userSettings.language);
        } else {
          // Use defaults if no settings found
          const defaultTheme = 'system';
          const defaultLanguage = 'en';
          
          setSettings({
            theme: defaultTheme,
            language: defaultLanguage,
            userId: user.id
          });
          
          applyTheme(defaultTheme);
          localStorage.setItem('theme', defaultTheme);
          localStorage.setItem('language', defaultLanguage);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Failed to load user settings');
        
        // Use defaults on error
        const defaultTheme = 'system';
        setSettings({
          theme: defaultTheme,
          language: 'en',
          userId: user?.id || ''
        });
        
        applyTheme(defaultTheme);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [user]);

  const applyTheme = (theme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  };

  const updateTheme = async (theme: 'light' | 'dark' | 'system') => {
    try {
      // Apply the theme immediately for better UX
      applyTheme(theme);
      
      // Update state
      setSettings(prev => ({ ...prev, theme }));
      
      // Save to localStorage (for non-authenticated users and as fallback)
      localStorage.setItem('theme', theme);
      
      // If user is authenticated, save to database
      if (user) {
        await saveUserSettings({
          ...settings,
          theme,
          userId: user.id
        });
      }
      
      toast.success('Theme updated successfully');
    } catch (error) {
      console.error('Error updating theme:', error);
      toast.error('Failed to update theme');
    }
  };

  const updateLanguage = async (language: string) => {
    try {
      // Validate language code
      const isValidLanguage = AVAILABLE_LANGUAGES.some(lang => lang.code === language);
      if (!isValidLanguage) {
        throw new Error(`Invalid language code: ${language}`);
      }
      
      // Update state
      setSettings(prev => ({ ...prev, language }));
      
      // Save to localStorage (for non-authenticated users and as fallback)
      localStorage.setItem('language', language);
      
      // If user is authenticated, save to database
      if (user) {
        await saveUserSettings({
          ...settings,
          language,
          userId: user.id
        });
      }
      
      toast.success('Language updated successfully');
    } catch (error) {
      console.error('Error updating language:', error);
      toast.error('Failed to update language');
    }
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      updateTheme, 
      updateLanguage, 
      isLoading 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
