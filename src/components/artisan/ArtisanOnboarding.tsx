import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  X,
  Mic,
  Package,
  Settings,
  Bell,
  Hand,
  Sparkles,
  ArrowRight,
  Circle
} from 'lucide-react';

interface OnboardingSlide {
  id: string;
  title: string;
  visualType: 'animation' | 'illustration';
  voiceText: string;
  animation: JSX.Element;
  gesture?: string;
}

interface ArtisanOnboardingProps {
  onComplete: () => void;
  artisanName: string;
  selectedLanguage?: string;
}

export function ArtisanOnboarding({ onComplete, artisanName, selectedLanguage = 'en' }: ArtisanOnboardingProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  // Translations for onboarding
  const translations: { [key: string]: any } = {
    en: {
      welcome: `Namaste ${artisanName}!`,
      welcomeVoice: `Welcome ${artisanName}. I am Vani, your voice assistant.`,
      voiceTitle: 'Talk to Me',
      voiceVoice: 'Tap the microphone and speak. I understand many Indian languages.',
      navTitle: 'Voice Navigation',
      navVoice: 'Tap the orange button and say "show orders" or "open photo studio".',
      ordersTitle: 'New Orders',
      ordersVoice: 'When customers want custom work, you will see it here.',
      toggleTitle: 'Availability',
      toggleVoice: 'Toggle this switch when you are busy.',
      productsTitle: 'Your Products',
      productsVoice: 'Add photos of your work. Customers can buy through WhatsApp.',
      readyTitle: 'Ready!',
      readyVoice: `You are ready to receive orders!`,
      skip: 'Skip',
      next: '→',
      back: 'Back',
      continue: 'Continue',
      startCreating: 'Start Creating',
    },
    ta: {
      welcome: `நமஸ்காரம் ${artisanName}!`,
      welcomeVoice: `வரவேற்கிறேன் ${artisanName}. நான் வாணி, உங்கள் குரல் உதவியாளர்.`,
      voiceTitle: 'என்னிடம் பேசுங்கள்',
      voiceVoice: 'மைக்ரோஃபோனை தட்டி பேசுங்கள். நான் பல இந்திய மொழிகளைப் புரிந்துகொள்கிறேன்.',
      navTitle: 'குரல் வழிசெலுத்தல்',
      navVoice: 'ஆரஞ்சு பொத்தானை தட்டி "ஆர்டர்களைக் காட்டு" அல்லது "ஃபோட்டோ ஸ்டுடியோவைத் திற" என்று சொல்லுங்கள்.',
      ordersTitle: 'புதிய ஆர்டர்கள்',
      ordersVoice: 'வாடிக்கையாளர்கள் தனிப்பயன் வேலை விரும்பும்போது, அதை இங்கே காண்பீர்கள்.',
      toggleTitle: 'கிடைக்கும் தன்மை',
      toggleVoice: 'நீங்கள் பிஸியாக இருக்கும்போது இந்த சுவிட்சை மாற்றவும்.',
      productsTitle: 'உங்கள் தயாரிப்புகள்',
      productsVoice: 'உங்கள் வேலையின் புகைப்படங்களைச் சேர்க்கவும். வாடிக்கையாளர்கள் வாட்ஸ்அப் மூலம் வாங்கலாம்.',
      readyTitle: 'தயார்!',
      readyVoice: `நீங்கள் ஆர்டர்களைப் பெற தயாராக உள்ளீர்கள்!`,
      skip: 'தவிர்',
      next: '→',
      back: 'பின்',
      continue: 'தொடர்க',
      startCreating: 'தொடங்குங்கள்',
    },
    hi: {
      welcome: `नमस्ते ${artisanName}!`,
      welcomeVoice: `स्वागत है ${artisanName}। मैं वाणी हूं, आपकी आवाज सहायक।`,
      voiceTitle: 'मुझसे बात करें',
      voiceVoice: 'माइक्रोफोन टैप करें और बोलें। मैं कई भारतीय भाषाएं समझती हूं।',
      navTitle: 'आवाज नेविगेशन',
      navVoice: 'नारंगी बटन टैप करें और "ऑर्डर दिखाओ" या "फोटो स्टूडियो खोलो" कहें।',
      ordersTitle: 'नए ऑर्डर',
      ordersVoice: 'जब ग्राहक कस्टम काम चाहते हैं, तो आप इसे यहां देखेंगे।',
      toggleTitle: 'उपलब्धता',
      toggleVoice: 'जब आप व्यस्त हों तो इस स्विच को टॉगल करें।',
      productsTitle: 'आपके उत्पाद',
      productsVoice: 'अपने काम की तस्वीरें जोड़ें। ग्राहक व्हाट्सएप से खरीद सकते हैं।',
      readyTitle: 'तैयार!',
      readyVoice: `आप ऑर्डर प्राप्त करने के लिए तैयार हैं!`,
      skip: 'छोड़ें',
      next: '→',
      back: 'पीछे',
      continue: 'जारी रखें',
      startCreating: 'शुरू करें',
    }
  };

  const t = translations[selectedLanguage] || translations.en;

  const slides: OnboardingSlide[] = [
    {
      id: 'welcome',
      title: t.welcome,
      visualType: 'animation',
      voiceText: t.welcomeVoice,
      animation: <WelcomeAnimation />,
    },
    {
      id: 'voice',
      title: t.voiceTitle,
      visualType: 'animation',
      voiceText: t.voiceVoice,
      animation: <VoiceAnimation />,
    },
    {
      id: 'navigation',
      title: t.navTitle,
      visualType: 'animation',
      voiceText: t.navVoice,
      animation: <NavigationAnimation />,
    },
    {
      id: 'orders',
      title: t.ordersTitle,
      visualType: 'animation',
      voiceText: t.ordersVoice,
      animation: <OrdersAnimation />,
    },
    {
      id: 'commission',
      title: t.toggleTitle,
      visualType: 'animation',
      voiceText: t.toggleVoice,
      animation: <CommissionAnimation />,
    },
    {
      id: 'products',
      title: t.productsTitle,
      visualType: 'animation',
      voiceText: t.productsVoice,
      animation: <ProductsAnimation />,
    },
    {
      id: 'ready',
      title: t.readyTitle,
      visualType: 'illustration',
      voiceText: t.readyVoice,
      animation: <ReadyAnimation artisanName={artisanName} />,
    }
  ];

  // Text-to-Speech (uses browser API or AWS Polly if configured)
  const speak = (text: string) => {
    if (!voiceEnabled) return;
    
    setIsSpeaking(true);
    
    try {
      // Map language code to voice language
      const langMap: { [key: string]: string } = {
        'en': 'en-IN',
        'ta': 'ta-IN',
        'hi': 'hi-IN',
      };
      
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langMap[selectedLanguage] || 'en-IN';
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synth.speak(utterance);
    } catch (error) {
      console.error('TTS failed:', error);
      setIsSpeaking(false);
    }
  };
  
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    // Auto-play voice narration when slide changes
    if (voiceEnabled) {
      const timer = setTimeout(() => {
        speak(slides[currentSlide].voiceText);
      }, 500);
      return () => {
        clearTimeout(timer);
        window.speechSynthesis.cancel(); // Stop speaking on slide change
      };
    }
  }, [currentSlide, voiceEnabled]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      console.log('🎉 Completing onboarding...');
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const completeOnboarding = () => {
    console.log('✅ Onboarding complete! Saving to localStorage...');
    localStorage.setItem('kalaikatha_artisan_onboarded', 'true');
    console.log('📞 Calling onComplete callback...');
    onComplete();
  };

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrevious();
      }
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 z-[100] flex flex-col"
    >
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={completeOnboarding}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          {t.skip}
        </button>

        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all"
          aria-label={voiceEnabled ? 'Mute voice' : 'Enable voice'}
        >
          {voiceEnabled ? (
            <Volume2 className={`w-5 h-5 ${isSpeaking ? 'text-amber-600 animate-pulse' : 'text-gray-700 dark:text-gray-300'}`} />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="relative"
            aria-label={`Go to slide ${index + 1}`}
          >
            <Circle
              className={`w-2 h-2 transition-all ${
                index === currentSlide
                  ? 'text-amber-600 fill-current w-3 h-3'
                  : index < currentSlide
                  ? 'text-amber-400 fill-current'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Slide Content */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 pb-20"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="w-full max-w-md text-center"
          >
            {/* Animation Container */}
            <div className="mb-8">
              {currentSlideData.animation}
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl text-gray-900 dark:text-white mb-4">
              {currentSlideData.title}
            </h2>
            
            {/* Prominent "Tap to Hear" Button */}
            <motion.button
              onClick={() => speak(currentSlideData.voiceText)}
              disabled={!voiceEnabled}
              className={`
                flex items-center justify-center gap-3 px-6 py-4 rounded-full mx-auto mb-6
                transition-all shadow-lg
                ${voiceEnabled
                  ? isSpeaking
                    ? 'bg-amber-500 text-white scale-110'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105 active:scale-95'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }
              `}
              whileHover={voiceEnabled ? { scale: 1.05 } : {}}
              whileTap={voiceEnabled ? { scale: 0.95 } : {}}
            >
              {isSpeaking ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <Volume2 className="w-6 h-6" />
                  </motion.div>
                  <span className="font-bold text-lg">
                    {selectedLanguage === 'ta' ? 'கேட்கிறது...' : selectedLanguage === 'hi' ? 'सुन रहे हैं...' : 'Playing...'}
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="w-6 h-6" />
                  <span className="font-bold text-lg">
                    {selectedLanguage === 'ta' ? '🔊 கேட்க தட்டவும்' : selectedLanguage === 'hi' ? '🔊 सुनने के लिए टैप करें' : '🔊 Tap to Hear'}
                  </span>
                </>
              )}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-6 pt-0">
        <div className="flex gap-3">
          {currentSlide > 0 && (
            <button
              onClick={handlePrevious}
              className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl hover:shadow-lg transition-all"
            >
              {t.back}
            </button>
          )}
          
          <button
            onClick={handleNext}
            className="flex-1 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <span className="font-medium">
              {currentSlide === slides.length - 1 ? t.startCreating : t.continue}
            </span>
            {currentSlide === slides.length - 1 ? (
              <Sparkles className="w-5 h-5" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== ANIMATION COMPONENTS ====================

function WelcomeAnimation() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Simple Vani Avatar - no complex animations */}
      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl">
        <Sparkles className="w-20 h-20 text-white" />
      </div>
    </div>
  );
}

function VoiceAnimation() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Simple Microphone - minimal animation */}
      <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl">
        <Mic className="w-16 h-16 text-white" />
      </div>
    </div>
  );
}

function NavigationAnimation() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Simple Orange Vani Button */}
      <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
        <Mic className="w-16 h-16 text-white" />
      </div>

      {/* Static command example */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-2">
        <div className="flex items-center gap-2">
          <Mic className="w-4 h-4 text-amber-600" />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            "show orders"
          </span>
        </div>
      </div>
    </div>
  );
}

function OrdersAnimation() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Simple bell icon */}
      <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-xl">
        <Bell className="w-16 h-16 text-white" />
      </div>
    </div>
  );
}

function CommissionAnimation() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Simple toggle representation */}
      <div className="text-center">
        <div className="w-24 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-end px-1 shadow-xl mb-4">
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
            <span className="text-green-600 text-xl">✓</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Open for Orders</div>
      </div>
    </div>
  );
}

function ProductsAnimation() {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Simple product card */}
      <div className="w-48 h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl shadow-xl flex items-center justify-center">
        <Package className="w-20 h-20 text-white/50" />
      </div>
    </div>
  );
}

function ReadyAnimation({ artisanName }: { artisanName: string }) {
  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
      {/* Simple success checkmark */}
      <div className="w-40 h-40 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl">
        <svg
          className="w-24 h-24 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
    </div>
  );
}