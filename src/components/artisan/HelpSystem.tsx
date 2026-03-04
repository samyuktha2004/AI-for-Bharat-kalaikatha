/**
 * HelpSystem - Multi-layered help for artisans who don't understand icons
 * 
 * Features:
 * 1. Auto-speak on first touch (one-time learning)
 * 2. Long-press for explanation (always available)
 * 3. Global help mode (safe exploration without triggering actions)
 * 4. Visual animations (reinforce understanding)
 * 5. Multilingual (Hindi, Tamil, Telugu, English)
 * 
 * Problem: Illiterate artisan sees camera icon but doesn't know what it means
 * Solution: Multiple ways to learn, all audio-based
 */

import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, X, Volume2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTextToSpeech } from '../../hooks/useArtisanFeatures';

interface HelpSystemProps {
  isHelpMode: boolean;
  onToggleHelpMode: () => void;
  currentLanguage: 'hi' | 'en' | 'ta' | 'te';
}

export function HelpSystem({ isHelpMode, onToggleHelpMode, currentLanguage }: HelpSystemProps) {
  const { speak } = useTextToSpeech();
  const [showTutorial, setShowTutorial] = useState(false);

  // Help mode messages (multilingual)
  const helpMessages = {
    hi: {
      helpModeOn: 'मदद मोड चालू है। अब किसी भी बटन को दबाने से आपको उसके बारे में बताया जाएगा, लेकिन वह काम नहीं करेगा। फिर से मदद बटन दबाएं काम करने के लिए।',
      helpModeOff: 'मदद मोड बंद। अब बटन दबाने पर काम होगा।',
      longPressHint: 'किसी भी बटन को लंबे समय तक दबाकर रखें उसके बारे में सुनने के लिए।',
      tutorial: 'ट्यूटोरियल',
    },
    en: {
      helpModeOn: 'Help mode is ON. Now tapping any button will explain what it does, but will not perform the action. Tap help button again to turn off.',
      helpModeOff: 'Help mode is OFF. Buttons will now work normally.',
      longPressHint: 'Long-press any button to hear what it does.',
      tutorial: 'Tutorial',
    },
    ta: {
      helpModeOn: 'உதவி பயன்முறை இயக்கத்தில் உள்ளது. இப்போது எந்த பொத்தானையும் தட்டினால் அது என்ன செய்கிறது என்று விளக்கும், ஆனால் செயலை செய்யாது.',
      helpModeOff: 'உதவி பயன்முறை முடக்கப்பட்டது. பொத்தான்கள் இயல்பாக செயல்படும்.',
      longPressHint: 'எந்த பொத்தானையும் நீண்ட நேரம் அழுத்தி அது என்ன செய்கிறது என்று கேளுங்கள்.',
      tutorial: 'பயிற்சி',
    },
    te: {
      helpModeOn: 'సహాయ మోడ్ ఆన్ చేయబడింది. ఇప్పుడు ఏదైనా బటన్‌ను నొక్కితే అది ఏమి చేస్తుందో వివరిస్తుంది, కానీ చర్య చేయదు.',
      helpModeOff: 'సహాయ మోడ్ ఆఫ్ చేయబడింది. బటన్లు సాధారణంగా పని చేస్తాయి.',
      longPressHint: 'ఏదైనా బటన్‌ను ఎక్కువసేపు నొక్కి అది ఏమి చేస్తుందో వినండి.',
      tutorial: 'శిక్షణ',
    },
  };

  const messages = helpMessages[currentLanguage];

  // Announce when help mode toggles
  useEffect(() => {
    const langCode = currentLanguage === 'hi' ? 'hi-IN' : 
                     currentLanguage === 'ta' ? 'ta-IN' :
                     currentLanguage === 'te' ? 'te-IN' : 'en-IN';
    
    if (isHelpMode) {
      speak(messages.helpModeOn, langCode);
    } else {
      speak(messages.helpModeOff, langCode);
    }
  }, [isHelpMode]);

  return (
    <>
      {/* Help Mode Toggle Button */}
      <motion.button
        onClick={onToggleHelpMode}
        whileTap={{ scale: 0.9 }}
        className={`
          fixed top-6 right-6 z-50
          w-16 h-16 rounded-full shadow-2xl
          flex items-center justify-center
          transition-all duration-300
          ${isHelpMode 
            ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
            : 'bg-gradient-to-br from-blue-500 to-indigo-500'
          }
        `}
      >
        {/* Pulsing animation when in help mode */}
        {isHelpMode && (
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 rounded-full bg-amber-500 blur-xl"
          />
        )}

        <HelpCircle className="w-8 h-8 text-white relative z-10" />

        {/* Badge showing help mode is ON */}
        {isHelpMode && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-white font-bold text-sm">ON</span>
          </motion.div>
        )}
      </motion.button>

      {/* Help Mode Banner (when active) */}
      <AnimatePresence>
        {isHelpMode && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-24 left-0 right-0 z-40 mx-4"
          >
            <div className="bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-500 dark:border-amber-600 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <HelpCircle className="w-8 h-8 text-white" />
                  </motion.div>
                </div>

                {/* Message */}
                <div className="flex-1">
                  <h3 className="text-amber-900 dark:text-amber-300 font-bold text-lg mb-2 flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    {currentLanguage === 'hi' && 'मदद मोड चालू है'}
                    {currentLanguage === 'en' && 'Help Mode Active'}
                    {currentLanguage === 'ta' && 'உதவி பயன்முறை'}
                    {currentLanguage === 'te' && 'సహాయ మోడ్'}
                  </h3>
                  <p className="text-amber-800 dark:text-amber-400 text-sm mb-3">
                    {currentLanguage === 'hi' && 'अब किसी भी बटन को दबाएं उसके बारे में जानने के लिए (काम नहीं होगा)'}
                    {currentLanguage === 'en' && 'Tap any button to learn what it does (action will not execute)'}
                    {currentLanguage === 'ta' && 'எந்த பொத்தானையும் தட்டி அறியவும் (செயல் இயங்காது)'}
                    {currentLanguage === 'te' && 'ఏదైనా బటన్‌ను నొక్కి తెలుసుకోండి (చర్య జరగదు)'}
                  </p>

                  {/* Hint */}
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs">
                    <span className="text-xl">💡</span>
                    <span>{messages.longPressHint}</span>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={onToggleHelpMode}
                  className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center flex-shrink-0"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Tutorial Button (Always available at bottom) */}
      <motion.button
        onClick={() => setShowTutorial(true)}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-6 z-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl px-6 py-4 flex items-center gap-3"
      >
        <span className="text-3xl">🎓</span>
        <span className="text-white font-bold">
          {messages.tutorial}
        </span>
      </motion.button>

      {/* Video Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowTutorial(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <span className="text-4xl">🎓</span>
                  {currentLanguage === 'hi' && 'वीडियो ट्यूटोरियल'}
                  {currentLanguage === 'en' && 'Video Tutorial'}
                  {currentLanguage === 'ta' && 'வீடியோ பயிற்சி'}
                  {currentLanguage === 'te' && 'వీడియో శిక్షణ'}
                </h2>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                >
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              {/* Video placeholder - Replace with actual video */}
              <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <div className="text-center text-white">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    ▶️
                  </motion.div>
                  <p className="text-xl">
                    {currentLanguage === 'hi' && 'वीडियो चलाने के लिए टैप करें'}
                    {currentLanguage === 'en' && 'Tap to play tutorial video'}
                    {currentLanguage === 'ta' && 'வீடியோவை இயக்க தட்டவும்'}
                    {currentLanguage === 'te' && 'వీడియో ప్లే చేయడానికి నొక్కండి'}
                  </p>
                </div>
              </div>

              {/* Tutorial steps (text for reference) */}
              <div className="space-y-3">
                <TutorialStep
                  icon="📸"
                  text={
                    currentLanguage === 'hi' ? 'नीला बटन = फोटो खींचें' :
                    currentLanguage === 'en' ? 'Blue button = Take photo' :
                    currentLanguage === 'ta' ? 'நீல பொத்தான் = புகைப்படம்' :
                    'నీలం బటన్ = ఫోటో'
                  }
                />
                <TutorialStep
                  icon="💬"
                  text={
                    currentLanguage === 'hi' ? 'हरा बटन = ऑर्डर देखें' :
                    currentLanguage === 'en' ? 'Green button = View orders' :
                    currentLanguage === 'ta' ? 'பச்சை பொத்தான் = ஆர்டர்கள்' :
                    'ఆకుపచ్చ బటన్ = ఆర్డర్లు'
                  }
                />
                <TutorialStep
                  icon="₹"
                  text={
                    currentLanguage === 'hi' ? 'नारंगी बटन = कीमत सेट करें' :
                    currentLanguage === 'en' ? 'Orange button = Set prices' :
                    currentLanguage === 'ta' ? 'ஆரஞ்சு பொத்தான் = விலை' :
                    'నారింజ బటన్ = ధర'
                  }
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Tutorial step component
function TutorialStep({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
      <span className="text-4xl">{icon}</span>
      <p className="text-gray-900 dark:text-white text-lg">{text}</p>
    </div>
  );
}

/**
 * Hook for managing help system state
 */
export function useHelpSystem() {
  const [isHelpMode, setIsHelpMode] = useState(false);
  const [hasSeenFirstTouch, setHasSeenFirstTouch] = useState<Record<string, boolean>>({});

  // Track first touch of each button
  const trackFirstTouch = (buttonId: string): boolean => {
    const key = `kalaikatha_first_touch_${buttonId}`;
    const seen = localStorage.getItem(key) === 'true';
    
    if (!seen) {
      localStorage.setItem(key, 'true');
      setHasSeenFirstTouch(prev => ({ ...prev, [buttonId]: true }));
      return true; // First time
    }
    
    return false; // Already seen
  };

  // Reset all first touches (for testing or re-onboarding)
  const resetFirstTouches = () => {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('kalaikatha_first_touch_')
    );
    keys.forEach(key => localStorage.removeItem(key));
    setHasSeenFirstTouch({});
  };

  return {
    isHelpMode,
    setIsHelpMode,
    toggleHelpMode: () => setIsHelpMode(prev => !prev),
    trackFirstTouch,
    resetFirstTouches,
  };
}
