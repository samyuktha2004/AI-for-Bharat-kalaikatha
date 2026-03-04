import { createContext, useContext, useState, useEffect } from 'react';

interface SavedArtisansContextType {
  savedArtisans: string[];
  toggleSaveArtisan: (artisanId: string) => void;
  isArtisanSaved: (artisanId: string) => boolean;
}

const SavedArtisansContext = createContext<SavedArtisansContextType | undefined>(undefined);

export function SavedArtisansProvider({ children }: { children: React.ReactNode }) {
  const [savedArtisans, setSavedArtisans] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kalaikatha_saved_artisans');
    if (saved) {
      setSavedArtisans(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kalaikatha_saved_artisans', JSON.stringify(savedArtisans));
  }, [savedArtisans]);

  const toggleSaveArtisan = (artisanId: string) => {
    setSavedArtisans(prev => {
      if (prev.includes(artisanId)) {
        return prev.filter(id => id !== artisanId);
      } else {
        return [...prev, artisanId];
      }
    });
  };

  const isArtisanSaved = (artisanId: string) => {
    return savedArtisans.includes(artisanId);
  };

  return (
    <SavedArtisansContext.Provider value={{ savedArtisans, toggleSaveArtisan, isArtisanSaved }}>
      {children}
    </SavedArtisansContext.Provider>
  );
}

export function useSavedArtisans() {
  const context = useContext(SavedArtisansContext);
  if (!context) {
    throw new Error('useSavedArtisans must be used within SavedArtisansProvider');
  }
  return context;
}
