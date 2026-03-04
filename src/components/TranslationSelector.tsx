import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Check } from 'lucide-react';
import { translateText, SupportedLanguage } from '../services/AWSTranslateService';

interface TranslationSelectorProps {
  content: {
    en: string;
  };
  onTranslate?: (translated: Record<string, string>) => void;
  className?: string;
}

export function TranslationSelector({ content, onTranslate, className = '' }: TranslationSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [translations, setTranslations] = useState<Record<SupportedLanguage, string>>({
    en: content.en,
    hi: '',
    ta: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const languages: Array<{ code: SupportedLanguage; label: string; flag: string }> = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  ];

  const handleLanguageSelect = async (lang: SupportedLanguage) => {
    setSelectedLanguage(lang);
    setShowDropdown(false);

    // If not translated yet, fetch translation
    if (lang !== 'en' && !translations[lang]) {
      setIsLoading(true);
      try {
        const translated = await translateText(content.en, lang);
        const updated = { ...translations, [lang]: translated };
        setTranslations(updated);
        onTranslate?.(updated);
      } catch (error) {
        console.error('Translation failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const currentLanguage = languages.find(l => l.code === selectedLanguage);

  return (
    <div className={`relative ${className}`}>
      {/* Language Selector Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
      >
        <Globe className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        <span className="text-sm font-medium text-indigo-900 dark:text-indigo-300">
          {currentLanguage?.flag} {currentLanguage?.label}
        </span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
            >
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  disabled={isLoading && selectedLanguage === lang.code}
                  className={`w-full flex items-center justify-between gap-2 px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    selectedLanguage === lang.code
                      ? 'bg-indigo-50 dark:bg-indigo-900/30'
                      : ''
                  } disabled:opacity-50`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {lang.label}
                    </span>
                  </span>
                  {selectedLanguage === lang.code && (
                    <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Display Content in Selected Language */}
      {/* This would be used by parent to display translated content */}
    </div>
  );
}

/**
 * Hook to manage translations for a piece of content
 */
export function useTranslation(initialText: string) {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');
  const [translations, setTranslations] = useState<Record<SupportedLanguage, string>>({
    en: initialText,
    hi: '',
    ta: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const translate = async (lang: SupportedLanguage) => {
    if (lang === 'en') {
      setCurrentLanguage(lang);
      return;
    }

    if (translations[lang]) {
      setCurrentLanguage(lang);
      return;
    }

    setIsLoading(true);
    try {
      const translated = await translateText(initialText, lang);
      setTranslations(prev => ({
        ...prev,
        [lang]: translated,
      }));
      setCurrentLanguage(lang);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentLanguage,
    currentText: translations[currentLanguage],
    translate,
    isLoading,
    translations,
  };
}
