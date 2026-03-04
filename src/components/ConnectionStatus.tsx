import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff, Wrench } from 'lucide-react';

type ConnectionMode = 'online' | 'offline' | 'demo';

/**
 * Detect which services are configured
 */
function detectMode(): ConnectionMode {
  // Check if offline
  if (!navigator.onLine) return 'offline';
  
  // Check if any AWS/Azure services configured
  const hasAWS = !!(
    import.meta.env?.VITE_AWS_COGNITO_USER_POOL_ID ||
    import.meta.env?.VITE_AWS_S3_BUCKET ||
    import.meta.env?.VITE_OPENAI_API_KEY
  );
  
  const hasAzure = !!(
    import.meta.env?.VITE_AZURE_OPENAI_ENDPOINT ||
    import.meta.env?.VITE_AZURE_VISION_ENDPOINT
  );
  
  // If no cloud services, it's demo mode
  if (!hasAWS && !hasAzure) return 'demo';
  
  return 'online';
}

export function ConnectionStatus() {
  const [mode, setMode] = useState<ConnectionMode>(detectMode());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleOnline = () => setMode(detectMode());
    const handleOffline = () => setMode('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const config = {
    online: {
      icon: Wifi,
      color: 'bg-green-500 dark:bg-green-600',
      text: 'Online',
      description: 'All cloud features available',
    },
    offline: {
      icon: WifiOff,
      color: 'bg-gray-500 dark:bg-gray-600',
      text: 'Offline',
      description: 'Using cached data',
    },
    demo: {
      icon: Wrench,
      color: 'bg-blue-500 dark:bg-blue-600',
      text: 'Demo',
      description: 'Using smart fallbacks',
    },
  };

  const current = config[mode];
  const Icon = current.icon;

  return (
    <div className="fixed top-2 right-2 z-50">
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`${current.color} text-white rounded-full shadow-lg backdrop-blur-sm
          transition-all duration-200 flex items-center gap-2
          ${isExpanded ? 'px-4 py-2' : 'p-2'}`}
        title={`${current.text} - Click for details`}
      >
        <Icon className="w-4 h-4" />
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="text-xs font-medium whitespace-nowrap overflow-hidden"
            >
              {current.text}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-12 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl
              border border-gray-200 dark:border-gray-700 p-3 min-w-[200px]"
          >
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
              {current.description}
            </p>
            
            {mode === 'demo' && (
              <p className="text-xs text-blue-600 dark:text-blue-400">
                💡 Configure AWS/Azure for full features
              </p>
            )}
            
            {mode === 'offline' && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                📱 Limited functionality until back online
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
