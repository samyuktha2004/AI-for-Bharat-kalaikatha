import { motion } from 'motion/react';
import { AlertCircle, RefreshCw, Home, MessageCircle } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error | string;
  reset?: () => void;
  title?: string;
  fullScreen?: boolean;
}

export function ErrorFallback({ 
  error, 
  reset, 
  title = 'Something went wrong',
  fullScreen = false 
}: ErrorFallbackProps) {
  const errorMessage = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred';

  const content = (
    <div className="text-center max-w-md mx-auto">
      {/* Error Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
      >
        <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-2xl text-gray-900 dark:text-white mb-3"
      >
        {title}
      </motion.h2>

      {/* Error Message */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-600 dark:text-gray-400 mb-8"
      >
        {errorMessage}
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 justify-center"
      >
        {reset && (
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        )}
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl hover:shadow-lg transition-all"
        >
          <Home className="w-5 h-5" />
          Go Home
        </button>
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
      >
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
          If this problem persists, please contact support
        </p>
        <button className="text-sm text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center gap-1">
          <MessageCircle className="w-4 h-4" />
          Report this issue
        </button>
      </motion.div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-stone-50 to-amber-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      {content}
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4 max-w-md mx-auto"
    >
      {icon && (
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-xl text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
