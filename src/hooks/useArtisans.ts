import { useState, useEffect } from 'react';
import { artisansData } from '../data/mockData';

export interface Artisan {
  id: string;
  name: string;
  craft: string;
  state: string;
  bio: string;
  portrait: string;
  story: string;
  products: {
    id: string;
    name: string;
    price: number;
    image: string;
    whatsapp?: string;
    amazonLink?: string;
  }[];
  processVideo: string;
  commissionSettings: {
    acceptingCommissions: boolean;
    minimumBudget: number | null;
  };
}

export function useArtisans(craftId?: string | null) {
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with Azure Functions API call
    // Example: fetch('/api/artisans') backed by Azure SQL/Cosmos DB
    const fetchArtisans = async () => {
      try {
        setLoading(true);
        // Simulating API call
        // In production: await fetch('https://your-azure-function.azurewebsites.net/api/artisans')
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter artisans by craft if craftId is provided
        let filteredArtisans = artisansData;
        
        if (craftId) {
          // Map craftId to craft name for filtering
          const craftNameMap: Record<string, string> = {
            'blue-pottery': 'Blue Pottery',
            'kanjivaram-silk': 'Kanjivaram Silk',
            'bronze-casting': 'Bronze Casting',
            'bandhani': 'Bandhani',
            'rogan-art': 'Rogan Painting',
            'tanjore-painting': 'Tanjore Painting',
            'dokra': 'Dokra Metal Craft',
            'kantha': 'Kantha Embroidery',
            'patola': 'Patola Silk',
            'miniature-painting': 'Miniature Painting',
            'mysore-silk': 'Mysore Silk',
            'sandalwood-carving': 'Sandalwood Carving',
          };
          
          const craftName = craftNameMap[craftId];
          if (craftName) {
            filteredArtisans = artisansData.filter(artisan => artisan.craft === craftName);
          }
        }
        
        setArtisans(filteredArtisans);
        setError(null);
      } catch (err) {
        setError('Failed to load artisans');
        console.error('Error fetching artisans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, [craftId]);

  return { artisans, loading, error };
}