/**
 * SimplifiedTutorial - Visual-first onboarding for illiterate users
 * 
 * Features:
 * - 100% visual (no text reading required)
 * - Audio narration (speaks each step)
 * - Large animations (clear demonstrations)
 * - 4 simple steps (not overwhelming)
 * - Skip option (can dismiss anytime)
 * - One-time only (never shown again)
 */

import { motion, AnimatePresence } from 'motion/react';
import { Camera, MessageSquare, IndianRupee, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTextToSpeech } from '../../hooks/useArtisanFeatures';

interface SimplifiedTutorialProps {
  onComplete: () => void;
}

const TUTORIAL_STEPS = [
  {
    icon: Camera,
    color: 'from-blue-500 to-indigo-500',
    emoji: '📸',
    animation: 'camera',
    audioHindi: 'Kamera button dabaye aur apne product ki photo le',
    audioEnglish: 'Tap camera button to take photos of your products',
  },
  {
    icon: MessageSquare,
    color: 'from-green-500 to-emerald-500',
    emoji: '💬',
    animation: 'message',
    audioHindi: 'Message button dabaye customer ke orders dekhne ke liye',
    audioEnglish: 'Tap message button to see customer orders',
  },
  {
    icon: IndianRupee,
    color: 'from-orange-500 to-amber-500',
    emoji: '₹',
    animation: 'price',
    audioHindi: 'Rupee button dabaye apne product ki keemat set karne ke liye',
    audioEnglish: 'Tap rupee button to set prices for your products',
  },
  {
    icon: null,
    color: 'from-purple-500 to-pink-500',
    emoji: '🎉',
    animation: 'success',
    audioHindi: 'Badhai ho! Aap tayar hain. Abhi shuru karein',
    audioEnglish: 'Congratulations! You are ready. Start now',
  },
];

export function SimplifiedTutorial({ onComplete }: SimplifiedTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState<'hindi' | 'english'>('hindi');
  const { speak } = useTextToSpeech();

  const step = TUTORIAL_STEPS[currentStep];

  // Auto-play audio when step changes
  useEffect(() => {
    const audio = language === 'hindi' ? step.audioHindi : step.audioEnglish;
    const lang = language === 'hindi' ? 'hi-IN' : 'en-IN';
    
    // Delay to let animation complete
    setTimeout(() => {
      speak(audio, lang);
    }, 500);
  }, [currentStep, language]);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    speak(language === 'hindi' ? 'Shuru karte hain' : 'Let's start', language === 'hindi' ? 'hi-IN' : 'en-IN');
    localStorage.setItem('kalaikatha_tutorial_completed', 'true');
    onComplete();
  };

  const handleSkip = () => {
    speak(language === 'hindi' ? 'Tutorial skip kar diya' : 'Tutorial skipped', language === 'hindi' ? 'hi-IN' : 'en-IN');
    localStorage.setItem('kalaikatha_tutorial_completed', 'true');
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-50 flex flex-col"
    >
      {/* Header - Language toggle & Skip */}
      <div className="flex items-center justify-between p-6">
        {/* Language toggle */}
        <button
          onClick={() => setLanguage(language === 'hindi' ? 'english' : 'hindi')}
          className="px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center gap-2"
        >
          <span className="text-2xl">{language === 'hindi' ? '🇮🇳' : '🇬🇧'}</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {language === 'hindi' ? 'हिन्दी' : 'English'}
          </span>
        </button>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center"
        >
          <X className="w-7 h-7 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Icon Animation */}
            <div className="flex justify-center mb-12">
              {step.animation === 'camera' && (
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, -10, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className={`w-48 h-48 rounded-full bg-gradient-to-br ${step.color} shadow-2xl flex items-center justify-center`}
                >
                  <Camera className="w-24 h-24 text-white" />
                </motion.div>
              )}

              {step.animation === 'message' && (
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative"
                >
                  <div className={`w-48 h-48 rounded-full bg-gradient-to-br ${step.color} shadow-2xl flex items-center justify-center`}>
                    <MessageSquare className="w-24 h-24 text-white" />
                  </div>
                  {/* Badge animation */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                    }}
                    className="absolute -top-4 -right-4 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <span className="text-white font-bold text-2xl">3</span>
                  </motion.div>
                </motion.div>
              )}

              {step.animation === 'price' && (
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className={`w-48 h-48 rounded-full bg-gradient-to-br ${step.color} shadow-2xl flex items-center justify-center`}
                >
                  <IndianRupee className="w-24 h-24 text-white" />
                </motion.div>
              )}

              {step.animation === 'success' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: 'spring', duration: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className={`w-48 h-48 rounded-full bg-gradient-to-br ${step.color} shadow-2xl flex items-center justify-center mb-6`}>
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="text-8xl"
                    >
                      {step.emoji}
                    </motion.span>
                  </div>
                  
                  {/* Confetti */}
                  <div className="flex gap-4 text-5xl">
                    <motion.span
                      animate={{ y: [-20, 0], opacity: [0, 1] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      🎊
                    </motion.span>
                    <motion.span
                      animate={{ y: [-20, 0], opacity: [0, 1] }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      ✨
                    </motion.span>
                    <motion.span
                      animate={{ y: [-20, 0], opacity: [0, 1] }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      🎉
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Emoji */}
            {step.animation !== 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-8"
              >
                <span className="text-8xl">{step.emoji}</span>
              </motion.div>
            )}

            {/* Audio text (for sighted users only) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl"
            >
              <p className="text-center text-2xl text-gray-900 dark:text-white leading-relaxed">
                {language === 'hindi' ? step.audioHindi : step.audioEnglish}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer - Progress & Next */}
      <div className="p-6 space-y-6">
        {/* Progress dots */}
        <div className="flex justify-center gap-3">
          {TUTORIAL_STEPS.map((_, index) => (
            <motion.div
              key={index}
              animate={{
                scale: index === currentStep ? 1.3 : 1,
                backgroundColor: index === currentStep ? '#3B82F6' : '#D1D5DB',
              }}
              className="w-4 h-4 rounded-full"
            />
          ))}
        </div>

        {/* Next button */}
        <motion.button
          onClick={handleNext}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-6 rounded-3xl shadow-2xl flex items-center justify-center gap-4 bg-gradient-to-r ${
            currentStep === TUTORIAL_STEPS.length - 1
              ? 'from-green-500 to-emerald-500'
              : 'from-blue-500 to-indigo-500'
          }`}
        >
          <span className="text-white text-2xl font-bold">
            {currentStep === TUTORIAL_STEPS.length - 1
              ? language === 'hindi'
                ? 'शुरू करें'
                : 'Start'
              : language === 'hindi'
              ? 'अगला'
              : 'Next'}
          </span>
          <span className="text-4xl">
            {currentStep === TUTORIAL_STEPS.length - 1 ? '🚀' : '→'}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
