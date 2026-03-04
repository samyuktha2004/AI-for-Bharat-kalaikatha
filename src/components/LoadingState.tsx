// Simple, clear loading state for low-literacy users

import logoIcon from 'figma:asset/47690a220b997aa35549fe419decf1f499e5d1e2.png';

interface LoadingStateProps {
  message?: string;
  minimal?: boolean;
}

export function LoadingState({ message, minimal = false }: LoadingStateProps) {
  if (minimal) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Kalaikatha Logo */}
        <div className="mb-6">
          <img 
            src={logoIcon} 
            alt="Kalaikatha" 
            className="w-20 h-20 mx-auto mb-4 animate-pulse"
          />
          <h2 className="text-2xl text-gray-900 dark:text-white mb-2">Kalaikatha</h2>
        </div>
        
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-amber-200 dark:border-amber-900 border-t-amber-600 dark:border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
        
        <p className="text-xl text-gray-700 dark:text-gray-300">
          {message || 'Loading...'}
        </p>
      </div>
    </div>
  );
}