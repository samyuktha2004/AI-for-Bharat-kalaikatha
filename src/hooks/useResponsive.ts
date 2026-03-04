import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive breakpoint detection
 * Optimized with debouncing to reduce re-renders during resize
 */
export function useResponsive(breakpoint: number = 1024) {
  const [isMobile, setIsMobile] = useState(() => {
    // Initialize with current window size (SSR safe)
    if (typeof window !== 'undefined') {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  useEffect(() => {
    let timeoutId: number | null = null;

    const handleResize = () => {
      // Debounce resize events to reduce re-renders
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        const newIsMobile = window.innerWidth < breakpoint;
        // Only update if value actually changed
        setIsMobile((prev) => prev !== newIsMobile ? newIsMobile : prev);
      }, 150); // 150ms debounce
    };

    // Use passive listener for better scroll performance
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isMobile;
}
