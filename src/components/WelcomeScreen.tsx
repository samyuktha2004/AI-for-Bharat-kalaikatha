import { motion, AnimatePresence } from 'motion/react';
import { Palette, ShoppingBag, Sparkles, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface WelcomeScreenProps {
  onSelectRole: (role: 'artisan' | 'buyer' | 'browse') => void;
}

export function WelcomeScreen({ onSelectRole }: WelcomeScreenProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('kalaikatha_welcomed');
    if (!hasSeenWelcome) {
      setShow(true);
    }
  }, []);

  const handleSelect = (role: 'artisan' | 'buyer' | 'browse') => {
    localStorage.setItem('kalaikatha_welcomed', 'true');
    setShow(false);
    onSelectRole(role);
  };

  const handleDismiss = () => {
    localStorage.setItem('kalaikatha_welcomed', 'true');
    setShow(false);
    onSelectRole('browse');
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden relative"
          >
            {/* Dismiss Button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close welcome screen"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Simple Logo */}
            <div className="text-center pt-8 pb-6">
              <h1 className="text-2xl md:text-3xl text-gray-900 dark:text-white">
                Kalaikatha
              </h1>
            </div>

            {/* 3 Simple Cards */}
            <div className="px-6 pb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Artisan */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                onClick={() => handleSelect('artisan')}
                className="group bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                  <Palette className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl text-gray-900 dark:text-white">
                  Artisan
                </h3>
              </motion.button>

              {/* Buyer */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={() => handleSelect('buyer')}
                className="group bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                  <ShoppingBag className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl text-gray-900 dark:text-white">
                  Buyer
                </h3>
              </motion.button>

              {/* Browse */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => handleSelect('browse')}
                className="group bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl text-gray-900 dark:text-white">
                  Browse
                </h3>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
