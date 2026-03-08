// Performance utilities for low-end devices and low data

// Detect if device is low-end
export const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for low memory
  const memory = (navigator as any).deviceMemory;
  if (memory && memory < 4) return true;
  
  // Check for slow connection
  const connection = (navigator as any).connection;
  if (connection) {
    const slowTypes = ['slow-2g', '2g', '3g'];
    if (slowTypes.includes(connection.effectiveType)) return true;
    if (connection.saveData) return true;
  }
  
  // Check CPU cores
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return true;
  
  return false;
};

// Get optimized image quality based on connection
export const getImageQuality = (): 'low' | 'medium' | 'high' => {
  if (typeof window === 'undefined') return 'medium';
  
  const connection = (navigator as any).connection;
  if (!connection) return 'medium';
  
  if (connection.saveData) return 'low';
  if (connection.effectiveType === '4g') return 'high';
  if (connection.effectiveType === '3g') return 'medium';
  return 'low';
};

// Optimize Unsplash image URL
export const optimizeImageUrl = (url: string, size: 'small' | 'medium' | 'large' = 'medium'): string => {
  if (!url || !url.includes('unsplash')) return url;
  
  const quality = getImageQuality();
  const sizeMap = {
    small: quality === 'low' ? 'w=400&q=50' : 'w=400&q=75',
    medium: quality === 'low' ? 'w=800&q=50' : quality === 'medium' ? 'w=800&q=75' : 'w=1200&q=85',
    large: quality === 'low' ? 'w=1200&q=60' : quality === 'medium' ? 'w=1600&q=75' : 'w=2400&q=85'
  };
  
  const params = sizeMap[size];
  return url.includes('?') ? `${url}&${params}` : `${url}?${params}`;
};

// Compress JSON data for localStorage
export const compressData = (data: any): string => {
  try {
    return btoa(JSON.stringify(data));
  } catch {
    return JSON.stringify(data);
  }
};

// Decompress JSON data from localStorage
export const decompressData = (data: string): any => {
  try {
    return JSON.parse(atob(data));
  } catch {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
};

// Clean old localStorage data
export const cleanOldStorage = (maxAgeDays: number = 7) => {
  if (typeof window === 'undefined') return;
  
  const keys = Object.keys(localStorage);
  const now = Date.now();
  
  keys.forEach(key => {
    if (key.startsWith('cache_')) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        const age = now - (data.timestamp || 0);
        const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;
        
        if (age > maxAge) {
          localStorage.removeItem(key);
        }
      } catch {
        localStorage.removeItem(key);
      }
    }
  });
};

// Debounce function for reducing frequent calls
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Check if reduced motion is preferred
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches || isLowEndDevice();
};

// Get storage usage
export const getStorageUsage = (): { used: number; available: number; percentage: number } => {
  if (typeof window === 'undefined') return { used: 0, available: 0, percentage: 0 };
  
  try {
    let used = 0;
    Object.keys(localStorage).forEach(key => {
      used += (localStorage.getItem(key) || '').length;
    });
    
    // Estimate available (5MB typical limit)
    const available = 5 * 1024 * 1024;
    const percentage = (used / available) * 100;
    
    return { used, available, percentage };
  } catch {
    return { used: 0, available: 0, percentage: 0 };
  }
};

// Clean storage if usage is high
export const autoCleanStorage = () => {
  const usage = getStorageUsage();
  if (usage.percentage > 80) {
    cleanOldStorage(3); // More aggressive cleaning
  } else if (usage.percentage > 60) {
    cleanOldStorage(7);
  }
};
