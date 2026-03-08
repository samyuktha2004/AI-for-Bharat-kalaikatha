/**
 * SimplifiedDashboard - Ultra-simplified artisan interface
 * 
 * Design for:
 * - Illiterate users (100% icon-based)
 * - Low-end phones (minimal animations, small bundle)
 * - Poor connectivity (offline-first, cached data)
 * - Tech-backward users (maximum 6 actions on screen)
 * 
 * Features:
 * - No text required (all icons + colors)
 * - Voice guidance (speaks action names)
 * - Large touch targets (80px minimum)
 * - Color-coded actions (universal understanding)
 * - Audio feedback on every action
 * - Haptic vibration
 * - Works 100% offline
 */

import { motion, AnimatePresence } from 'motion/react';
import {
  Camera,
  MessageSquare,
  IndianRupee,
  Package,
  Bell,
  Settings,
  Mic,
  Phone,
  Home,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { SimpleVisualButton } from './SimpleVisualButton';
import { useTextToSpeech, useVoiceInput, useDeviceCapability } from '../../hooks/useArtisanFeatures';

interface SimplifiedDashboardProps {
  onNavigate: (view: string) => void;
  artisanName?: string;
}

export function SimplifiedDashboard({ onNavigate, artisanName = 'Friend' }: SimplifiedDashboardProps) {
  const [isListening, setIsListening] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const { speak, speaking } = useTextToSpeech();
  const { listening, transcript, start, stop } = useVoiceInput('hi-IN');
  const capability = useDeviceCapability();

  // Welcome message on first load
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('kalaikatha_dashboard_welcome_seen');
    
    if (!hasSeenWelcome) {
      // Speak welcome message after 1 second
      setTimeout(() => {
        speak(`Namaste ${artisanName}! Welcome to your dashboard. Tap any icon to start.`);
        localStorage.setItem('kalaikatha_dashboard_welcome_seen', 'true');
      }, 1000);
    }

    // Hide welcome overlay after 3 seconds
    setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
  }, []);

  // Voice command handling
  useEffect(() => {
    if (transcript) {
      handleVoiceCommand(transcript.toLowerCase());
    }
  }, [transcript]);

  const handleVoiceCommand = (command: string) => {
    // Simple keyword matching (works in Hindi/English)
    if (command.includes('photo') || command.includes('camera') || command.includes('फोटो')) {
      onNavigate('studio');
      speak('Opening camera');
    } else if (command.includes('order') || command.includes('आर्डर')) {
      onNavigate('orders');
      speak('Opening orders');
    } else if (command.includes('price') || command.includes('कीमत')) {
      onNavigate('bargain');
      speak('Opening price settings');
    } else if (command.includes('shop') || command.includes('दुकान')) {
      onNavigate('shop');
      speak('Opening your shop');
    } else if (command.includes('help') || command.includes('मदद')) {
      speakTutorial();
    }
  };

  const speakTutorial = () => {
    speak('Tap the camera icon to upload photos. Tap the message icon for orders. Tap the rupee icon to set prices. Tap the shop icon to view your products.');
  };

  const handleVoiceToggle = () => {
    if (listening) {
      stop();
      setIsListening(false);
    } else {
      start();
      setIsListening(true);
      speak('Listening... Speak now');
    }
  };

  // Count pending items (from localStorage for offline support)
  const pendingOrders = parseInt(localStorage.getItem('kalaikatha_pending_orders') || '0');
  const newNotifications = parseInt(localStorage.getItem('kalaikatha_notifications') || '0');

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Welcome Overlay (First time only) */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="text-8xl mb-4"
              >
                👋
              </motion.div>
              <h1 className="text-3xl mb-2 text-gray-900 dark:text-white">
                Namaste {artisanName}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Tap any icon below to begin
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header - Minimal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          {/* Home icon */}
          <button
            onClick={() => window.location.reload()}
            className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
          >
            <Home className="w-7 h-7 text-orange-600" />
          </button>

          {/* Settings */}
          <button
            onClick={() => onNavigate('settings')}
            className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
          >
            <Settings className="w-7 h-7 text-gray-600 dark:text-gray-400" />
          </button>
        </motion.div>

        {/* Voice Assistant - Center (Most Important) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mb-12"
        >
          {/* Microphone button */}
          <div className="relative">
            {/* Pulsing rings when listening */}
            {isListening && (
              <>
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1.5],
                    opacity: [0.5, 0, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  className="absolute inset-0 rounded-full bg-red-500 blur-xl"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1.3],
                    opacity: [0.3, 0, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeOut',
                    delay: 0.3,
                  }}
                  className="absolute inset-0 rounded-full bg-pink-500 blur-xl"
                />
              </>
            )}

            <motion.button
              onClick={handleVoiceToggle}
              whileTap={{ scale: 0.9 }}
              className={`
                relative w-32 h-32 rounded-full shadow-2xl
                flex items-center justify-center
                transition-all duration-300
                ${
                  isListening
                    ? 'bg-gradient-to-br from-red-500 to-pink-500'
                    : 'bg-gradient-to-br from-indigo-600 to-purple-600'
                }
              `}
            >
              <motion.div
                animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.8, repeat: isListening ? Infinity : 0 }}
              >
                <Mic className="w-16 h-16 text-white" />
              </motion.div>
            </motion.button>
          </div>

          {/* Voice status */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 px-6 py-3 bg-red-100 dark:bg-red-900/30 rounded-full"
              >
                <p className="text-red-700 dark:text-red-300 font-medium flex items-center gap-2">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    🎤
                  </motion.span>
                  Listening...
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transcript display */}
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 px-6 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-md"
            >
              <p className="text-gray-700 dark:text-gray-300 text-center">
                "{transcript}"
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Action Grid - 6 Main Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-6 mb-8"
        >
          {/* Upload Photo */}
          <div className="flex flex-col items-center">
            <SimpleVisualButton
              icon={Camera}
              color="blue"
              onClick={() => onNavigate('studio')}
              label="Upload Photo"
              size="large"
            />
          </div>

          {/* Orders */}
          <div className="flex flex-col items-center">
            <SimpleVisualButton
              icon={MessageSquare}
              color="green"
              onClick={() => onNavigate('orders')}
              label="View Orders"
              size="large"
              badge={pendingOrders}
              pulse={pendingOrders > 0}
            />
          </div>

          {/* Pricing */}
          <div className="flex flex-col items-center">
            <SimpleVisualButton
              icon={IndianRupee}
              color="orange"
              onClick={() => onNavigate('bargain')}
              label="Set Prices"
              size="large"
            />
          </div>

          {/* My Shop */}
          <div className="flex flex-col items-center">
            <SimpleVisualButton
              icon={Package}
              color="purple"
              onClick={() => onNavigate('shop')}
              label="My Shop"
              size="large"
            />
          </div>

          {/* Notifications */}
          <div className="flex flex-col items-center">
            <SimpleVisualButton
              icon={Bell}
              color="yellow"
              onClick={() => onNavigate('notifications')}
              label="Notifications"
              size="large"
              badge={newNotifications}
              pulse={newNotifications > 0}
            />
          </div>

          {/* Help/Support */}
          <div className="flex flex-col items-center">
            <SimpleVisualButton
              icon={Phone}
              color="red"
              onClick={speakTutorial}
              label="Get Help"
              size="large"
            />
          </div>
        </motion.div>

        {/* Network Status Indicator (for poor connectivity) */}
        {!navigator.onLine && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-400 dark:border-amber-600 rounded-2xl p-4 flex items-center gap-3"
          >
            <span className="text-3xl">📡</span>
            <div>
              <p className="text-amber-900 dark:text-amber-300 font-medium">
                No Internet
              </p>
              <p className="text-amber-700 dark:text-amber-400 text-sm">
                You can still view your shop and saved photos
              </p>
            </div>
          </motion.div>
        )}

        {/* Data Saver Mode Indicator */}
        {capability.isLowEnd && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-400 dark:border-blue-600 rounded-2xl p-4 flex items-center gap-3"
          >
            <span className="text-3xl">⚡</span>
            <div>
              <p className="text-blue-900 dark:text-blue-300 font-medium">
                Data Saver Mode Active
              </p>
              <p className="text-blue-700 dark:text-blue-400 text-sm">
                Photos will be compressed to save data
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
