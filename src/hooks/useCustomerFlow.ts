import { useState, useCallback } from 'react';

export function useCustomerFlow() {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCraft, setSelectedCraft] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedArtisanId, setSelectedArtisanId] = useState<string | null>(null);

  const handleCraftSelect = useCallback((craft: any) => {
    setSelectedCraft(craft);
  }, []);

  const handleCreateOrder = useCallback(() => {
    setShowProfile(false);
    setShowOrderForm(true);
  }, []);

  const handleCustomOrder = useCallback((artisanId: string) => {
    setSelectedArtisanId(artisanId);
    setShowOrderForm(true);
  }, []);

  const handleOrderSubmit = useCallback((order: any) => {
    console.log('Order submitted:', order);
    setShowOrderForm(false);
    setSelectedArtisanId(null);
  }, []);

  const closeState = useCallback(() => setSelectedState(null), []);
  const closeCraft = useCallback(() => setSelectedCraft(null), []);
  const closeProfile = useCallback(() => setShowProfile(false), []);
  const openProfile = useCallback(() => setShowProfile(true), []);
  
  const closeOrderForm = useCallback(() => {
    setShowOrderForm(false);
    setSelectedArtisanId(null);
  }, []);

  return {
    selectedState,
    selectedCraft,
    showProfile,
    showOrderForm,
    selectedArtisanId,
    setSelectedState,
    handleCraftSelect,
    handleCreateOrder,
    handleCustomOrder,
    handleOrderSubmit,
    closeState,
    closeCraft,
    closeProfile,
    openProfile,
    closeOrderForm,
  };
}
