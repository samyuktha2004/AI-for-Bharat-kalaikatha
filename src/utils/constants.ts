/**
 * Application-wide constants
 */

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'kalaikatha_user',
  NAME_CONFIRMED: 'kalaikatha_name_confirmed',
  ARTISAN_ONBOARDED: 'kalaikatha_artisan_onboarded',
  WELCOME_SEEN: 'kalaikatha_welcome_seen',
  SAVED_ARTISANS: 'kalaikatha_saved_artisans',
  LANGUAGE: 'kalaikatha_language',
  THEME: 'kalaikatha_theme',
} as const;

// UI Constants
export const UI = {
  BUTTON_BASE_CLASS: 'flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm hover:shadow-md transition-all flex-shrink-0',
  ICON_CLASS: 'w-4 h-4 md:w-5 md:h-5',
  TOPBAR_HEIGHT: '4rem',
} as const;

// Image Compression
export const IMAGE_COMPRESSION = {
  MAX_WIDTH: 800,
  QUALITY: 0.7,
  LOW_END_QUALITY: 0.6,
  CHUNK_SIZE: 256 * 1024, // 256KB chunks for upload
} as const;

// Device Detection Thresholds
export const DEVICE_THRESHOLDS = {
  LOW_MEMORY_GB: 2,
  LOW_CORES: 2,
  SLOW_CONNECTIONS: ['2g', 'slow-2g', '3g'],
} as const;

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  SIGNUP: '/api/auth/signup',
  LOGOUT: '/api/auth/logout',
  ARTISANS: '/api/artisans',
  CRAFTS: '/api/crafts',
  ORDERS: '/api/orders',
  UPLOAD: '/api/upload',
} as const;

// Supported Languages
export const LANGUAGES = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
] as const;

// User Types
export type UserType = 'buyer' | 'artisan';

// Artisan View Types
export type ArtisanView = 'dashboard' | 'studio' | 'bargain' | 'marketing' | 'shop' | 'vault' | 'orders' | 'schemes' | 'whatsapp' | 'pricing' | 'voiceStory';

// Animation Durations (in ms)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;