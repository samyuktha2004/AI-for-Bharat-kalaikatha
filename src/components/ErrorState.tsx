// Simple, clear error state for low-literacy users
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  minimal?: boolean;
}

export function ErrorState({ message, onRetry, minimal = false }: ErrorStateProps) {
  if (minimal) {
    return (
      <div className="flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <p className="text-sm text-red-700 dark:text-red-400">
          {message || 'Error'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-2 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
          >
            <RefreshCw className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl text-gray-900 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message || 'Please try again'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}
