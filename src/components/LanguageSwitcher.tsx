/**
 * LanguageSwitcher - Compact switcher for downloaded languages only
 * 
 * Features:
 * - Only shows languages user selected during onboarding
 * - Tamil artisan sees: தமிழ் | English (if they added English)
 * - Hindi-only artisan sees nothing (auto-hides when only 1 language)
 * - Simple, illiterate-friendly design
 * - Voice feedback on tap
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Globe, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface LanguageSwitcherProps {
  className?: string;
  compact?: boolean; // Show as floating button (default) or inline
}

export function LanguageSwitcher({ className = '', compact = true }: LanguageSwitcherProps) {
  const { lang, setLang, getAvailableLanguages, selectedLanguages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const availableLanguages = getAvailableLanguages();

  // Auto-hide if only one language selected
  if (selectedLanguages.length <= 1) {
    return null;
  }

  /**
   * Speak language name on selection
   */
  function speakLanguage(name: string, voiceLang: string) {
    try {
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.lang = voiceLang;
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech failed:', error);
    }
  }

  /**
   * Handle language change
   */
  function handleLanguageChange(code: string, name: string, voiceLang: string) {
    console.log('🟢 LanguageSwitcher - Changing language to:', code);
    setLang(code as any);
    speakLanguage(name, voiceLang);
    setIsOpen(false);

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  const currentLang = availableLanguages.find(l => l.code === lang);

  if (compact) {
    // Floating button mode (for dashboard)
    return (
      <>
        {/* Floating language button - Larger for accessibility */}
        <motion.button
          onClick={() => setIsOpen(true)}
          whileTap={{ scale: 0.95 }}
          className={`fixed top-20 right-4 z-40 min-w-[80px] h-20 px-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col items-center justify-center gap-1 border-2 border-gray-200 dark:border-gray-700 ${className}`}
          title="Change Language / भाषा बदलें"
        >
          <span className="text-3xl">{currentLang?.flag || '🌍'}</span>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
            {currentLang?.code.toUpperCase()}
          </span>
        </motion.button>

        {/* Language modal */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Globe className="w-7 h-7 text-blue-500" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Language / भाषा
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Info box */}
                <div className="mb-6 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600 rounded-2xl p-4">
                  <p className="text-blue-900 dark:text-blue-300 text-sm">
                    💡 Only showing languages you downloaded during setup. Want more? Go to Settings.
                  </p>
                </div>

                {/* Language buttons */}
                <div className="space-y-3">
                  {availableLanguages.map((language) => {
                    const isActive = language.code === lang;
                    const voiceLang = `${language.code}-IN`;

                    return (
                      <motion.button
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code, language.name, voiceLang)}
                        whileTap={{ scale: 0.98 }}
                        className={`
                          w-full p-4 rounded-2xl text-left transition-all
                          flex items-center gap-4
                          ${isActive
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-xl'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                          }
                        `}
                      >
                        <span className="text-4xl">{language.flag}</span>
                        <div className="flex-1">
                          <div className="font-bold text-xl">{language.name}</div>
                          <div className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                            {language.nameEn}
                          </div>
                        </div>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"
                          >
                            <div className="w-3 h-3 bg-white rounded-full" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Helper text */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tap to hear • Long-press for details
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Inline mode (for settings page)
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {availableLanguages.map((language) => {
        const isActive = language.code === lang;
        const voiceLang = `${language.code}-IN`;

        return (
          <motion.button
            key={language.code}
            onClick={() => handleLanguageChange(language.code, language.name, voiceLang)}
            whileTap={{ scale: 0.95 }}
            className={`
              px-6 py-3 rounded-xl font-medium transition-all
              flex items-center gap-3
              ${isActive
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
              }
            `}
          >
            <span className="text-2xl">{language.flag}</span>
            <span className="font-bold">{language.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
}