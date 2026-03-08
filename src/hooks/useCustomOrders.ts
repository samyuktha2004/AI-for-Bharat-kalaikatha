import { useState, useEffect } from 'react';

export interface CustomOrder {
  id: string;
  productName: string;
  description: string;
  specifications: string;
  quantity: number;
  budget: string;
  dateRequired: string;
  images: string[];
  artistSelection: 'open' | 'specific' | 'saved' | 'single';
  selectedArtists: string[];
  responseTimeLimit: '3' | '7' | '14' | '30';
  createdAt: string;
  status: 'open' | 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  craftId: string | null;
  buyerId: string;
}

export function useCustomOrders(userId?: string) {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    // TODO: Replace with Azure Functions API call
    // Example: fetch(`/api/orders?userId=${userId}`) backed by Azure SQL Database
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Simulating API call
        // In production: await fetch(`https://your-azure-function.azurewebsites.net/api/orders/${userId}`)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // For now, return empty array until backend is connected
        setOrders([]);
        setError(null);
      } catch (err) {
        setError('Failed to load orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const createOrder = async (order: Omit<CustomOrder, 'id' | 'createdAt' | 'status' | 'buyerId'>) => {
    try {
      // TODO: Replace with Azure Functions API call
      // POST to Azure Functions endpoint
      // In production: 
      // const response = await fetch('https://your-azure-function.azurewebsites.net/api/orders', {
      //   method: 'POST',
      //   body: JSON.stringify(order)
      // });
      
      console.log('Order would be created:', order);
      // For now, just log it
      return { success: true };
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  };

  return { orders, loading, error, createOrder };
}
