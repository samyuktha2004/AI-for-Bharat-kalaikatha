import { X, Info, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  showDetailedText: boolean;
  onToggleDetailedText: () => void;
}

export function SettingsModal({ isOpen, onClose, showDetailedText, onToggleDetailedText }: SettingsModalProps) {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl">Settings</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-white/80 text-sm mt-1">Customize your experience</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Appearance */}
              <div>
                <h3 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Appearance
                </h3>

                {/* Theme Toggle */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 dark:text-white">Dark Mode</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Easier on the eyes at night</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        layout
                        className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                        animate={{ x: theme === 'dark' ? 24 : 0 }}
                      >
                        {theme === 'dark' ? (
                          <Moon className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Sun className="w-4 h-4 text-amber-500" />
                        )}
                      </motion.div>
                    </button>
                  </div>
                </div>

                {/* Detailed Text Toggle */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 dark:text-white">Detailed Descriptions</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {showDetailedText ? 'More explanations shown' : 'Simplified view'}
                      </p>
                    </div>
                    <button
                      onClick={onToggleDetailedText}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        showDetailedText ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        layout
                        className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                        animate={{ x: showDetailedText ? 24 : 0 }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-lg text-gray-900 dark:text-white mb-4">Notifications</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900 dark:text-white">WhatsApp Alerts</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Get order updates on WhatsApp</p>
                    </div>
                    <button
                      onClick={() => setNotifications(!notifications)}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        notifications ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    >
                      <motion.div
                        layout
                        className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
                        animate={{ x: notifications ? 24 : 0 }}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* About */}
              <div>
                <h3 className="text-lg text-gray-900 dark:text-white mb-2">About Kalaikatha</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Empowering Indian artisans with AI-powered tools to grow their craft business and preserve heritage traditions.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Version 1.0.0 • Made with ❤️ for artisans
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <button
                onClick={onClose}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
