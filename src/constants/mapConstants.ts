/**
 * Map Configuration Constants
 * Centralized configuration for the Interactive Map feature
 * Optimized for performance with memoized lookups
 */

// Type for position coordinates
type Position = { top: string; left: string };

// Desktop positions (laptop/desktop view - 1024px+) - PERFECT, DON'T CHANGE
export const STATE_POSITIONS_DESKTOP: Record<string, Position> = {
  // North India
  'jammu-kashmir': { top: '12%', left: '35%' },
  'himachal-pradesh': { top: '18%', left: '38%' },
  'punjab': { top: '20%', left: '32%' },
  'haryana': { top: '25%', left: '40%' },
  'delhi': { top: '25%', left: '42%' },
  'uttarakhand': { top: '22%', left: '45%' },
  'uttar-pradesh': { top: '32%', left: '48%' },
  
  // West India
  'rajasthan': { top: '29%', left: '37%' },
  'gujarat': { top: '40%', left: '31%' },
  'maharashtra': { top: '50%', left: '38%' },
  'goa': { top: '62%', left: '38%' },
  
  // Central India
  'madhya-pradesh': { top: '42%', left: '42%' },
  'chhattisgarh': { top: '50%', left: '56%' },
  
  // East India
  'bihar': { top: '36%', left: '62%' },
  'jharkhand': { top: '44%', left: '62%' },
  'west-bengal': { top: '40%', left: '58%' },
  'odisha': { top: '50%', left: '68%' },
  'assam': { top: '32%', left: '80%' },
  
  // South India
  'telangana': { top: '58%', left: '50%' },
  'andhra-pradesh': { top: '65%', left: '59%' },
  'karnataka': { top: '66%', left: '38%' },
  'tamil-nadu': { top: '80%', left: '43%' },
  'kerala': { top: '78%', left: '48%' },
} as const;

// Mobile positions (phone view - <1024px) - ADJUST THESE FOR MOBILE
export const STATE_POSITIONS_MOBILE: Record<string, Position> = {
  // North India
  'jammu-kashmir': { top: '12%', left: '35%' },
  'himachal-pradesh': { top: '18%', left: '38%' },
  'punjab': { top: '20%', left: '32%' },
  'haryana': { top: '25%', left: '40%' },
  'delhi': { top: '25%', left: '42%' },
  'uttarakhand': { top: '22%', left: '45%' },
  'uttar-pradesh': { top: '32%', left: '48%' },
  
  // West India
  'rajasthan': { top: '40%', left: '25%' },
  'gujarat': { top: '45%', left: '20%' },
  'maharashtra': { top: '50%', left: '38%' },
  'goa': { top: '62%', left: '38%' },
  
  // Central India
  'madhya-pradesh': { top: '42%', left: '42%' },
  'chhattisgarh': { top: '50%', left: '56%' },
  
  // East India
  'bihar': { top: '36%', left: '62%' },
  'jharkhand': { top: '44%', left: '62%' },
  'west-bengal': { top: '45%', left: '64%' },
  'odisha': { top: '50%', left: '68%' },
  'assam': { top: '32%', left: '80%' },
  
  // South India
  'telangana': { top: '58%', left: '50%' },
  'andhra-pradesh': { top: '65%', left: '59%' },
  'karnataka': { top: '58%', left: '25%' },
  'tamil-nadu': { top: '65%', left: '37%' },
  'kerala': { top: '78%', left: '48%' },
} as const;

// Deprecated: Keep for backward compatibility, remove after testing
export const STATE_POSITIONS = STATE_POSITIONS_DESKTOP;

// Azure Maps integration flag
export const AZURE_MAPS_ENABLED = false; // Set to true when Azure Maps is integrated

// Animation timings (milliseconds)
export const ANIMATION_TIMINGS = {
  MAP_LOAD: 1200,
  MAP_FADE_IN: 800,
  SEARCH_BAR_SLIDE: 600,
  PIN_ENTRY_DELAY: 500,
  PIN_ENTRY_STAGGER: 100,
  PULSE_DURATION: 1500,
  RIPPLE_DURATION: 1500,
  BOUNCE_DURATION: 1000,
  LEGEND_DELAY: 1000,
} as const;

// Map display settings
export const MAP_SETTINGS = {
  OPACITY_LIGHT: 0.6,
  OPACITY_DARK: 0.4,
  PIN_SIZE_MOBILE: 48,
  PIN_SIZE_DESKTOP: 64,
  ICON_SIZE_MOBILE: 20,
  ICON_SIZE_DESKTOP: 24,
  TOUCH_TARGET_MIN: 48,
} as const;

// Spring animation config
export const SPRING_CONFIG = {
  stiffness: 200,
  damping: 20,
} as const;

// Easing functions
export const EASING = {
  fluid: [0.22, 1, 0.36, 1] as const,
  smooth: 'easeInOut' as const,
} as const;

// Z-index layers
export const Z_INDEX = {
  SEARCH_BAR: 30,
  BADGE: 10,
  TOOLTIP: 20,
  PIN_HOVER: 10,
} as const;

// Fallback position calculation for unmapped states
export const getFallbackPosition = (index: number): { top: string; left: string } => ({
  top: `${20 + (index * 15) % 60}%`,
  left: `${20 + (index * 20) % 60}%`,
});

// Get state position with fallback and responsive support
export const getStatePosition = (stateId: string, index: number, isMobile: boolean = false) => {
  const positions = isMobile ? STATE_POSITIONS_MOBILE : STATE_POSITIONS_DESKTOP;
  return positions[stateId] || getFallbackPosition(index);
};