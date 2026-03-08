import { useState, useEffect } from 'react';

export interface Craft {
  id: string;
  name: string;
  material: string;
  history: string;
  heritageStatus: string;
  image: string;
  region: string;
}

export interface State {
  id: string;
  name: string;
  color: string;
  coordinates: { lat: number; lng: number };
  videoUrl: string;
  fallbackImage?: string;
  description: string;
  crafts: Craft[];
}

export function useCrafts() {
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with Azure Functions API call
    // Example: fetch('/api/states') backed by Azure Cosmos DB
    const fetchCrafts = async () => {
      try {
        setLoading(true);
        // Simulating API call
        // In production: await fetch('https://your-azure-function.azurewebsites.net/api/states')
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, return empty array until backend is connected
        setStates([]);
        setError(null);
      } catch (err) {
        setError('Failed to load crafts');
        console.error('Error fetching crafts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCrafts();
  }, []);

  return { states, loading, error };
}