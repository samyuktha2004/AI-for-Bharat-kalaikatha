import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../utils/storage';
import type { ArtisanView } from '../utils/constants';

export function useArtisanFlow() {
  const [currentView, setCurrentView] = useState<ArtisanView>('dashboard');
  const [showNameConfirmation, setShowNameConfirmation] = useState(false);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user } = useAuth();

  const isPhoneSignup = user ? (!user.email.includes('@') || !user.name || user.name.trim() === '') : false;

  useEffect(() => {
    if (!user) return;

    // Step 1: Name confirmation
    if (!storage.hasConfirmedName()) {
      setShowNameConfirmation(true);
      return;
    }

    // Step 2: Language selection
    const hasLanguage = localStorage.getItem('artisan_language');
    if (!hasLanguage) {
      setShowLanguageSelection(true);
      return;
    }

    // Step 3: Onboarding
    if (!storage.hasCompletedOnboarding()) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleNameConfirmationComplete = useCallback(() => {
    storage.setNameConfirmed();
    setShowNameConfirmation(false);
    
    // Check if language is selected
    const hasLanguage = localStorage.getItem('artisan_language');
    if (!hasLanguage) {
      setShowLanguageSelection(true);
    } else if (!storage.hasCompletedOnboarding()) {
      setShowOnboarding(true);
    }
  }, []);

  const handleLanguageSelectionComplete = useCallback((languageCode: string) => {
    console.log('✅ Language selected:', languageCode);
    setShowLanguageSelection(false);
    
    if (!storage.hasCompletedOnboarding()) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  const navigateTo = useCallback((view: ArtisanView) => {
    setCurrentView(view);
  }, []);

  const navigateToDashboard = useCallback(() => {
    setCurrentView('dashboard');
  }, []);

  return {
    currentView,
    showNameConfirmation,
    showLanguageSelection,
    showOnboarding,
    isPhoneSignup,
    navigateTo,
    navigateToDashboard,
    handleNameConfirmationComplete,
    handleLanguageSelectionComplete,
    handleOnboardingComplete,
  };
}