import { motion } from 'motion/react';
import { Sparkles, Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({ message = 'Loading...', fullScreen = true }: LoadingScreenProps) {
  if (!fullScreen) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-amber-600 dark:text-amber-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-stone-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center z-50"
    >
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          {/* Rotating Background Circle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-orange-600 rounded-full opacity-20 blur-xl"
          />
          
          {/* Logo */}
          <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-12 h-12 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl text-gray-900 dark:text-white mb-2"
        >
          Kalaikatha
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 dark:text-gray-400 mb-8"
        >
          Celebrating India's Heritage Crafts
        </motion.p>

        {/* Loading Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 justify-center"
        >
          <Loader2 className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{message}</span>
        </motion.div>

        {/* Loading Progress Dots */}
        <div className="flex gap-2 justify-center mt-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Skeleton Loader Component
export function SkeletonLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`} />
  );
}

// Card Skeleton
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
      <SkeletonLoader className="w-full h-48 mb-4" />
      <SkeletonLoader className="w-3/4 h-6 mb-3" />
      <SkeletonLoader className="w-full h-4 mb-2" />
      <SkeletonLoader className="w-5/6 h-4" />
    </div>
  );
}

// List Skeleton
export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <SkeletonLoader className="w-16 h-16 rounded-full flex-shrink-0" />
          <div className="flex-1">
            <SkeletonLoader className="w-1/2 h-5 mb-2" />
            <SkeletonLoader className="w-3/4 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
