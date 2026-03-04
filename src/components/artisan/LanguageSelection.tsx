import { motion } from 'motion/react';
import { useState } from 'react';
import { Globe, Download, Check, Volume2 } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  packSize: string;
}

interface LanguageSelectionProps {
  onComplete: (languageCode: string) => void;
  artisanName: string;
}

export function LanguageSelection({ onComplete, artisanName }: LanguageSelectionProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const languages: Language[] = [
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', flag: '🇮🇳', packSize: '45 MB' },
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', packSize: '38 MB' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', packSize: '42 MB' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', packSize: '41 MB' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳', packSize: '40 MB' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳', packSize: '43 MB' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳', packSize: '39 MB' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', packSize: '41 MB' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', packSize: '44 MB' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳', packSize: '40 MB' },
  ];

  const handleLanguageSelect = async (code: string) => {
    setSelectedLanguage(code);
    setIsDownloading(true);
    setDownloadProgress(0);

    // Simulate language pack download
    const downloadInterval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(downloadInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // Wait for "download" to complete
    setTimeout(() => {
      clearInterval(downloadInterval);
      setDownloadProgress(100);
      
      // Store selected language
      localStorage.setItem('artisan_language', code);
      localStorage.setItem('artisan_language_pack_downloaded', 'true');
      
      console.log('📦 Language pack downloaded:', code);
      
      // Complete after showing success
      setTimeout(() => {
        onComplete(code);
      }, 800);
    }, 2000);
  };

  const selectedLang = languages.find(l => l.code === selectedLanguage);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 z-50 overflow-y-auto pt-safe pb-safe">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl text-gray-900 dark:text-white mb-2">
            Choose Your Language
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Vani will speak to you in your preferred language
          </p>
        </motion.div>

        {!isDownloading ? (
          <>
            {/* Language Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
              {languages.map((lang, index) => (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`p-4 sm:p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${
                    selectedLanguage === lang.code
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-3xl sm:text-4xl">{lang.flag}</div>
                    <div className="flex-1 text-left">
                      <h3 className="text-base sm:text-lg text-gray-900 dark:text-white font-medium">
                        {lang.nativeName}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {lang.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Download className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{lang.packSize}</span>
                      </div>
                    </div>
                    {selectedLanguage === lang.code && (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Help Text */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-300">
                  <p className="mb-2">
                    <strong>What's a language pack?</strong>
                  </p>
                  <p>
                    Vani downloads voice recognition and speech for your language. 
                    This lets you talk to the app even offline! Works on low internet.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Downloading State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Download className="w-12 h-12 text-white" />
              </motion.div>
            </div>

            <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-white mb-2">
              Downloading {selectedLang?.nativeName} Pack
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">
              This will take just a moment...
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-4">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${downloadProgress}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {downloadProgress}% complete
              </p>
            </div>

            {downloadProgress === 100 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400"
              >
                <Check className="w-6 h-6" />
                <span className="font-medium">Download Complete!</span>
              </motion.div>
            )}

            {/* Size Info */}
            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              <p>💾 {selectedLang?.packSize} | 📱 Works offline | 🔊 Voice enabled</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}