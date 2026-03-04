import { STORAGE_KEYS } from './constants';

/**
 * LocalStorage utilities with type safety
 */

export const storage = {
  // User
  getUser: () => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },
  setUser: (user: any) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  removeUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Name Confirmation
  hasConfirmedName: () => {
    return localStorage.getItem(STORAGE_KEYS.NAME_CONFIRMED) === 'true';
  },
  setNameConfirmed: () => {
    localStorage.setItem(STORAGE_KEYS.NAME_CONFIRMED, 'true');
  },

  // Artisan Onboarding
  hasCompletedOnboarding: () => {
    return localStorage.getItem(STORAGE_KEYS.ARTISAN_ONBOARDED) === 'true';
  },
  setOnboardingComplete: () => {
    localStorage.setItem(STORAGE_KEYS.ARTISAN_ONBOARDED, 'true');
  },

  // Welcome Screen
  hasSeenWelcome: () => {
    return localStorage.getItem(STORAGE_KEYS.WELCOME_SEEN) === 'true';
  },
  setWelcomeSeen: () => {
    localStorage.setItem(STORAGE_KEYS.WELCOME_SEEN, 'true');
  },

  // Saved Artisans
  getSavedArtisans: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SAVED_ARTISANS);
    return data ? JSON.parse(data) : [];
  },
  setSavedArtisans: (artisans: string[]) => {
    localStorage.setItem(STORAGE_KEYS.SAVED_ARTISANS, JSON.stringify(artisans));
  },

  // Language
  getLanguage: () => {
    return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';
  },
  setLanguage: (lang: string) => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  },

  // Theme
  getTheme: () => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },
  setTheme: (theme: string) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  // Clear all app data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
