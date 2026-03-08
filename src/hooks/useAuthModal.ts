import { useState, useCallback } from 'react';

export function useAuthModal() {
  const [showAuth, setShowAuth] = useState(false);
  const [authIntent, setAuthIntent] = useState<'buyer' | 'artisan' | null>(null);

  const openLogin = useCallback(() => {
    setAuthIntent('buyer');
    setShowAuth(true);
  }, []);

  const openArtisanLogin = useCallback(() => {
    setAuthIntent('artisan');
    setShowAuth(true);
  }, []);

  const openBuyerLogin = useCallback(() => {
    setAuthIntent('buyer');
    setShowAuth(true);
  }, []);

  const closeAuth = useCallback(() => {
    setShowAuth(false);
    setAuthIntent(null);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    closeAuth();
  }, [closeAuth]);

  return {
    showAuth,
    authIntent,
    openLogin,
    openArtisanLogin,
    openBuyerLogin,
    closeAuth,
    handleAuthSuccess,
  };
}