
import React, { createContext, useContext } from 'react';
import { useSettings } from './SettingsContext';

// This is a very simple translation context. In a real app, you'd want to use a proper
// i18n library like react-i18next or Lingui.

// Simple translations object
const translations: Record<string, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    teachers: 'Teachers',
    students: 'Students',
    schedules: 'Schedules',
    classes: 'Classes',
    payments: 'Payments',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    systemMode: 'System Mode',
    language: 'Language',
    save: 'Save',
    cancel: 'Cancel',
    theme: 'Theme',
    welcome: 'Welcome',
    notifications: 'Notifications',
    noNotifications: 'No notifications',
    markAsRead: 'Mark as read',
    allNotifications: 'All notifications',
    // Add more translations as needed
  },
  pt: {
    dashboard: 'Painel',
    teachers: 'Professores',
    students: 'Alunos',
    schedules: 'Horários',
    classes: 'Aulas',
    payments: 'Pagamentos',
    profile: 'Perfil',
    settings: 'Definições',
    logout: 'Sair',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Escuro',
    systemMode: 'Modo Sistema',
    language: 'Idioma',
    save: 'Guardar',
    cancel: 'Cancelar',
    theme: 'Tema',
    welcome: 'Bem-vindo',
    notifications: 'Notificações',
    noNotifications: 'Sem notificações',
    markAsRead: 'Marcar como lido',
    allNotifications: 'Todas as notificações',
    // Add more translations as needed
  },
  es: {
    dashboard: 'Panel',
    teachers: 'Profesores',
    students: 'Estudiantes',
    schedules: 'Horarios',
    classes: 'Clases',
    payments: 'Pagos',
    profile: 'Perfil',
    settings: 'Ajustes',
    logout: 'Cerrar sesión',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',
    systemMode: 'Modo Sistema',
    language: 'Idioma',
    save: 'Guardar',
    cancel: 'Cancelar',
    theme: 'Tema',
    welcome: 'Bienvenido',
    notifications: 'Notificaciones',
    noNotifications: 'Sin notificaciones',
    markAsRead: 'Marcar como leído',
    allNotifications: 'Todas las notificaciones',
    // Add more translations as needed
  },
  fr: {
    dashboard: 'Tableau de bord',
    teachers: 'Professeurs',
    students: 'Étudiants',
    schedules: 'Horaires',
    classes: 'Cours',
    payments: 'Paiements',
    profile: 'Profil',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    lightMode: 'Mode Clair',
    darkMode: 'Mode Sombre',
    systemMode: 'Mode Système',
    language: 'Langue',
    save: 'Enregistrer',
    cancel: 'Annuler',
    theme: 'Thème',
    welcome: 'Bienvenue',
    notifications: 'Notifications',
    noNotifications: 'Pas de notifications',
    markAsRead: 'Marquer comme lu',
    allNotifications: 'Toutes les notifications',
    // Add more translations as needed
  },
  it: {
    dashboard: 'Pannello',
    teachers: 'Insegnanti',
    students: 'Studenti',
    schedules: 'Orari',
    classes: 'Lezioni',
    payments: 'Pagamenti',
    profile: 'Profilo',
    settings: 'Impostazioni',
    logout: 'Esci',
    lightMode: 'Modalità Chiara',
    darkMode: 'Modalità Scura',
    systemMode: 'Modalità Sistema',
    language: 'Lingua',
    save: 'Salva',
    cancel: 'Annulla',
    theme: 'Tema',
    welcome: 'Benvenuto',
    notifications: 'Notifiche',
    noNotifications: 'Nessuna notifica',
    markAsRead: 'Segna come letto',
    allNotifications: 'Tutte le notifiche',
    // Add more translations as needed
  }
};

// Default language
const DEFAULT_LANGUAGE = 'en';

interface TranslationContextType {
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { settings } = useSettings();
  
  const t = (key: string): string => {
    const language = settings.language || DEFAULT_LANGUAGE;
    return translations[language]?.[key] || translations[DEFAULT_LANGUAGE]?.[key] || key;
  };
  
  return (
    <TranslationContext.Provider value={{ t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
