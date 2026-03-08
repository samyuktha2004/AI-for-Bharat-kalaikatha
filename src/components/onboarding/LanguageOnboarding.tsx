/**
 * LanguageOnboarding - Smart language selection during onboarding
 * 
 * Benefits:
 * - Zero initial bundle (no languages bundled)
 * - Downloads ONLY selected languages (primary + optional secondary)
 * - Multi-language support: Artisan (Tamil) + Helper/Kids (English)
 * - Smart data usage: Only Tamil = 10KB, Tamil + English = 18KB
 * - Simpler UX: Language switcher shows only selected languages
 * 
 * Flow:
 * 1. Visual welcome (icons only, no text)
 * 2. Select PRIMARY language (required)
 * 3. Select SECONDARY languages (optional - e.g., English for kids/helpers)
 * 4. Download selected languages (~2-4 seconds on 2G)
 * 5. Cache in localStorage (instant forever)
 * 6. Language switcher shows only selected languages
 */

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Download, Check, Globe, Wifi, WifiOff, Plus, X } from 'lucide-react';

const LANGUAGES = [
  { 
    code: 'hi', 
    name: 'हिन्दी', 
    nameEn: 'Hindi',
    flag: '🇮🇳',
    region: 'उत्तर भारत',
    regionEn: 'North India',
    voiceLang: 'hi-IN',
    color: 'from-orange-500 to-red-500',
    size: '10KB',
  },
  { 
    code: 'ta', 
    name: 'தமிழ்', 
    nameEn: 'Tamil',
    flag: '🇮🇳',
    region: 'தமிழ்நாடு',
    regionEn: 'Tamil Nadu',
    voiceLang: 'ta-IN',
    color: 'from-blue-500 to-indigo-500',
    size: '12KB',
  },
  { 
    code: 'te', 
    name: 'తెలుగు', 
    nameEn: 'Telugu',
    flag: '🇮🇳',
    region: 'ఆంధ్ర, తెలంగాణ',
    regionEn: 'Andhra, Telangana',
    voiceLang: 'te-IN',
    color: 'from-green-500 to-emerald-500',
    size: '12KB',
  },
  { 
    code: 'kn', 
    name: 'ಕನ್ನಡ', 
    nameEn: 'Kannada',
    flag: '🇮🇳',
    region: 'ಕರ್ನಾಟಕ',
    regionEn: 'Karnataka',
    voiceLang: 'kn-IN',
    color: 'from-yellow-500 to-amber-500',
    size: '12KB',
  },
  { 
    code: 'ml', 
    name: 'മലയാളം', 
    nameEn: 'Malayalam',
    flag: '🇮🇳',
    region: 'കേരളം',
    regionEn: 'Kerala',
    voiceLang: 'ml-IN',
    color: 'from-purple-500 to-pink-500',
    size: '12KB',
  },
  { 
    code: 'bn', 
    name: 'বাংলা', 
    nameEn: 'Bengali',
    flag: '🇮🇳',
    region: 'পশ্চিমবঙ্গ',
    regionEn: 'West Bengal',
    voiceLang: 'bn-IN',
    color: 'from-teal-500 to-cyan-500',
    size: '10KB',
  },
  { 
    code: 'mr', 
    name: 'मराठी', 
    nameEn: 'Marathi',
    flag: '🇮🇳',
    region: 'महाराष्ट्र',
    regionEn: 'Maharashtra',
    voiceLang: 'mr-IN',
    color: 'from-rose-500 to-pink-500',
    size: '10KB',
  },
  { 
    code: 'en', 
    name: 'English', 
    nameEn: 'English',
    flag: '🇬🇧',
    region: 'All India',
    regionEn: 'All India',
    voiceLang: 'en-IN',
    color: 'from-gray-500 to-slate-500',
    size: '8KB',
    isHelper: true, // Flag for helper language
  },
];

interface LanguageOnboardingProps {
  onComplete: (languages: { primary: string; secondary: string[] }) => void;
}

export function LanguageOnboarding({ onComplete }: LanguageOnboardingProps) {
  const [step, setStep] = useState<'primary' | 'secondary'>('primary');
  const [primaryLang, setPrimaryLang] = useState<string | null>(null);
  const [secondaryLangs, setSecondaryLangs] = useState<string[]>([]);
  const [suggestedLang, setSuggestedLang] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentDownload, setCurrentDownload] = useState<string>('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-detect suggested language
  useEffect(() => {
    detectSuggestedLanguage();
  }, []);

  /**
   * Detect best language based on:
   * 1. Phone system language
   * 2. Previously used language (if any)
   */
  async function detectSuggestedLanguage() {
    try {
      // Check if user has a saved preference
      const savedLang = localStorage.getItem('kalaikatha_primary_language');
      if (savedLang) {
        setSuggestedLang(savedLang);
        return;
      }

      // Check phone system language
      const systemLang = navigator.language.split('-')[0];
      const isSupported = LANGUAGES.some(l => l.code === systemLang);
      if (isSupported) {
        setSuggestedLang(systemLang);
        speakLanguageName(
          LANGUAGES.find(l => l.code === systemLang)!.name,
          LANGUAGES.find(l => l.code === systemLang)!.voiceLang
        );
        return;
      }

      // Default to Hindi
      setSuggestedLang('hi');
    } catch (error) {
      console.error('Language detection failed:', error);
      setSuggestedLang('hi');
    }
  }

  /**
   * Speak language name using Web Speech API
   */
  function speakLanguageName(name: string, voiceLang: string) {
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
   * Download multiple language files
   */
  async function downloadLanguages(languages: string[]) {
    if (!isOnline) {
      alert('No internet connection. Please connect and try again.');
      return;
    }

    setDownloading(true);
    setProgress(0);

    try {
      const totalLanguages = languages.length;
      
      for (let i = 0; i < languages.length; i++) {
        const code = languages[i];
        setCurrentDownload(LANGUAGES.find(l => l.code === code)?.name || code);

        // Download language JSON
        const response = await fetch(`/locales/${code}.json`);
        
        if (!response.ok) {
          throw new Error(`Failed to download ${code}`);
        }

        const translations = await response.json();

        // Cache in localStorage
        localStorage.setItem(`kalaikatha_lang_${code}`, JSON.stringify(translations));

        // Update progress
        setProgress(Math.round(((i + 1) / totalLanguages) * 100));

        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Save preferences
      localStorage.setItem('kalaikatha_primary_language', languages[0]);
      localStorage.setItem('kalaikatha_current_language', languages[0]); // Set current language immediately
      localStorage.setItem('kalaikatha_selected_languages', JSON.stringify(languages));
      localStorage.setItem('kalaikatha_onboarding_complete', 'true');

      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 500));

      // Complete onboarding
      onComplete({
        primary: languages[0],
        secondary: languages.slice(1),
      });
    } catch (error) {
      console.error('Language download failed:', error);
      
      setDownloading(false);
      setProgress(0);
      
      const retry = confirm('Download failed. Retry?');
      if (retry) {
        downloadLanguages(languages);
      }
    }
  }

  /**
   * Handle primary language selection
   */
  function handleSelectPrimary(code: string, name: string, voiceLang: string) {
    setPrimaryLang(code);
    speakLanguageName(name, voiceLang);
    
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  /**
   * Toggle secondary language
   */
  function toggleSecondaryLang(code: string, name: string, voiceLang: string) {
    if (secondaryLangs.includes(code)) {
      setSecondaryLangs(secondaryLangs.filter(l => l !== code));
    } else {
      setSecondaryLangs([...secondaryLangs, code]);
      speakLanguageName(name, voiceLang);
    }
    
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }

  /**
   * Proceed to secondary language selection
   */
  function handleProceedToSecondary() {
    if (primaryLang) {
      setStep('secondary');
    }
  }

  /**
   * Skip secondary languages
   */
  function handleSkipSecondary() {
    if (primaryLang) {
      downloadLanguages([primaryLang]);
    }
  }

  /**
   * Confirm and download all selected languages
   */
  function handleConfirm() {
    if (primaryLang) {
      const allLanguages = [primaryLang, ...secondaryLangs];
      downloadLanguages(allLanguages);
    }
  }

  /**
   * Calculate total download size
   */
  function getTotalSize(): string {
    const languages = [primaryLang, ...secondaryLangs].filter(Boolean) as string[];
    const totalKB = languages.reduce((sum, code) => {
      const lang = LANGUAGES.find(l => l.code === code);
      return sum + parseInt(lang?.size || '0');
    }, 0);
    return `${totalKB} KB`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <AnimatePresence mode="wait">
          {!downloading ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: step === 'secondary' ? 20 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: step === 'secondary' ? -20 : 0 }}
            >
              {/* Title */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl mb-4"
                >
                  {step === 'primary' ? '🌍' : '➕'}
                </motion.div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  {step === 'primary' 
                    ? 'Choose Your Main Language'
                    : 'Add Helper Languages?'
                  }
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {step === 'primary' 
                    ? 'भाषा चुनें | మీ భాష ఎంచుకోండి | உங்கள் மொழியைத் தேர்ந்தெடுங்கள்'
                    : 'For kids, helpers, or Amazon/Etsy listings'
                  }
                </p>

                {/* Online/Offline Indicator */}
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700">
                  {isOnline ? (
                    <>
                      <Wifi className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Online</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Offline</span>
                    </>
                  )}
                </div>
              </div>

              {step === 'primary' ? (
                <>
                  {/* Suggested Language */}
                  {suggestedLang && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-600 rounded-2xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">💡</span>
                        <div>
                          <p className="text-blue-900 dark:text-blue-300 font-medium">
                            Suggested: {LANGUAGES.find(l => l.code === suggestedLang)?.name}
                          </p>
                          <p className="text-blue-700 dark:text-blue-400 text-sm">
                            Based on your phone settings
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Primary Language Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {LANGUAGES.map((lang, index) => {
                      const isSuggested = lang.code === suggestedLang;
                      const isSelected = lang.code === primaryLang;

                      return (
                        <motion.button
                          key={lang.code}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSelectPrimary(lang.code, lang.name, lang.voiceLang)}
                          whileTap={{ scale: 0.95 }}
                          className={`
                            p-6 rounded-2xl text-left transition-all relative overflow-hidden
                            ${isSelected
                              ? `bg-gradient-to-br ${lang.color} text-white shadow-2xl ring-4 ring-offset-2`
                              : isSuggested
                                ? 'bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900/70 text-gray-900 dark:text-white border-2 border-blue-400 dark:border-blue-500'
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                            }
                          `}
                        >
                          {isSuggested && !isSelected && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              ✨
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-5xl">{lang.flag}</span>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <Check className="w-7 h-7" />
                              </motion.div>
                            )}
                          </div>

                          <div className="font-bold text-2xl mb-1">{lang.name}</div>
                          <div className={`text-sm mb-2 ${isSelected ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                            {lang.nameEn}
                          </div>
                          <div className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-500 dark:text-gray-500'}`}>
                            {isSelected ? lang.regionEn : lang.region} • {lang.size}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Continue Button */}
                  {primaryLang && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleProceedToSecondary}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl py-5 font-bold text-xl shadow-2xl flex items-center justify-center gap-3"
                    >
                      Continue
                      <span>→</span>
                    </motion.button>
                  )}
                </>
              ) : (
                <>
                  {/* Selected Primary */}
                  <div className="mb-6 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-300 dark:border-green-600 rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-green-900 dark:text-green-300 font-medium">
                          Main Language: {LANGUAGES.find(l => l.code === primaryLang)?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Helper Language Info */}
                  <div className="mb-6 bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-300 dark:border-yellow-600 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div className="flex-1">
                        <p className="text-yellow-900 dark:text-yellow-300 font-medium mb-2">
                          When do you need extra languages?
                        </p>
                        <ul className="text-yellow-800 dark:text-yellow-400 text-sm space-y-1">
                          <li>✓ Kids/helpers who speak English</li>
                          <li>✓ Check Amazon/Etsy listings before posting</li>
                          <li>✓ Family members share this device</li>
                          <li>✓ Learn another language</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Languages Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {LANGUAGES.filter(l => l.code !== primaryLang).map((lang, index) => {
                      const isSelected = secondaryLangs.includes(lang.code);
                      const isEnglish = lang.code === 'en';

                      return (
                        <motion.button
                          key={lang.code}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => toggleSecondaryLang(lang.code, lang.name, lang.voiceLang)}
                          whileTap={{ scale: 0.95 }}
                          className={`
                            p-6 rounded-2xl text-left transition-all relative overflow-hidden
                            ${isSelected
                              ? `bg-gradient-to-br ${lang.color} text-white shadow-2xl ring-4 ring-offset-2`
                              : isEnglish
                                ? 'bg-amber-100 dark:bg-amber-900/50 hover:bg-amber-200 dark:hover:bg-amber-900/70 text-gray-900 dark:text-white border-2 border-amber-400 dark:border-amber-500'
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                            }
                          `}
                        >
                          {/* English recommended badge */}
                          {isEnglish && !isSelected && (
                            <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                              Recommended
                            </div>
                          )}

                          <div className="flex items-center justify-between mb-3">
                            <span className="text-5xl">{lang.flag}</span>
                            {isSelected ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <Check className="w-7 h-7" />
                              </motion.div>
                            ) : (
                              <Plus className={`w-6 h-6 ${isEnglish ? 'text-amber-600' : 'text-gray-400'}`} />
                            )}
                          </div>

                          <div className="font-bold text-2xl mb-1">{lang.name}</div>
                          <div className={`text-sm mb-2 ${isSelected ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                            {lang.nameEn}
                          </div>
                          <div className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-500 dark:text-gray-500'}`}>
                            +{lang.size} download
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {secondaryLangs.length > 0 && (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={handleConfirm}
                        disabled={!isOnline}
                        className={`
                          w-full rounded-2xl py-5 font-bold text-xl shadow-2xl
                          flex items-center justify-center gap-3
                          ${isOnline
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          }
                        `}
                      >
                        <Download className="w-6 h-6" />
                        Download {secondaryLangs.length + 1} Language{secondaryLangs.length > 0 ? 's' : ''} ({getTotalSize()})
                      </motion.button>
                    )}

                    <button
                      onClick={handleSkipSecondary}
                      className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl py-4 font-medium text-lg"
                    >
                      {secondaryLangs.length > 0 ? '← Back' : `Skip - Only ${LANGUAGES.find(l => l.code === primaryLang)?.name}`}
                    </button>
                  </div>
                </>
              )}

              {/* Data usage info */}
              <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                {step === 'primary' ? (
                  <>
                    <p>📊 One language ≈ 8-12 KB (1-2 seconds on 2G)</p>
                    <p>💾 Cached forever • Works offline after download</p>
                  </>
                ) : (
                  <>
                    <p>💡 Tip: Most artisans only need their main language</p>
                    <p>📊 Total download: {getTotalSize()} • Works offline forever</p>
                  </>
                )}
              </div>
            </motion.div>
          ) : (
            // Download Progress
            <motion.div
              key="downloading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="inline-block"
                >
                  <Download className="w-24 h-24 text-blue-500" />
                </motion.div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Downloading Languages...
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                {currentDownload}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-5 mb-4 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-5 rounded-full"
                />
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-xl mb-2">
                {progress}%
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm">
                {getTotalSize()} • Cached forever
              </p>

              {progress === 100 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-8 text-green-500 text-7xl"
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}