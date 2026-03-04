import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff, X as XIcon, Sparkles } from 'lucide-react';
import type { ArtisanView } from '../../utils/constants';
import { prefersReducedMotion } from '../../utils/performance';

interface VaniNavigationAssistantProps {
  onNavigate: (view: ArtisanView) => void;
  currentView: ArtisanView;
}

export function VaniNavigationAssistant({ onNavigate, currentView }: VaniNavigationAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const [showFirstTimeHint, setShowFirstTimeHint] = useState(false);
  const shouldReduceMotion = prefersReducedMotion();

  // Check if first time user
  useEffect(() => {
    const hasUsedVani = localStorage.getItem('kalaikatha_vani_used');
    if (!hasUsedVani) {
      // Show hint after 2 seconds
      const timer = setTimeout(() => {
        setShowFirstTimeHint(true);
        // Auto-hide after 5 seconds
        setTimeout(() => setShowFirstTimeHint(false), 5000);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Parse voice commands and navigate
  const processVoiceCommand = useCallback((text: string) => {
    const lowerText = text.toLowerCase();
    
    // Navigation keywords mapping
    const navigationMap: Record<string, { view: ArtisanView; response: string }> = {
      'order': { 
        view: 'orders', 
        response: 'Opening your orders' 
      },
      'orders': { 
        view: 'orders', 
        response: 'Opening your orders' 
      },
      'custom order': { 
        view: 'orders', 
        response: 'Opening custom orders' 
      },
      'photo': { 
        view: 'studio', 
        response: 'Opening photo studio' 
      },
      'studio': { 
        view: 'studio', 
        response: 'Opening AI studio' 
      },
      'upload': { 
        view: 'studio', 
        response: 'Opening photo upload' 
      },
      'picture': { 
        view: 'studio', 
        response: 'Opening photo studio' 
      },
      'vault': { 
        view: 'vault', 
        response: 'Opening protected vault' 
      },
      'secret': { 
        view: 'vault', 
        response: 'Opening your trade secrets' 
      },
      'protected': { 
        view: 'vault', 
        response: 'Opening protected vault' 
      },
      'price': { 
        view: 'pricing', 
        response: 'Opening smart pricing' 
      },
      'pricing': { 
        view: 'pricing', 
        response: 'Opening smart pricing' 
      },
      'cost': { 
        view: 'pricing', 
        response: 'Opening pricing calculator' 
      },
      'market': { 
        view: 'marketing', 
        response: 'Opening marketing automation' 
      },
      'marketing': { 
        view: 'marketing', 
        response: 'Opening marketing automation' 
      },
      'instagram': { 
        view: 'marketing', 
        response: 'Opening marketing for Instagram' 
      },
      'bargain': { 
        view: 'bargain', 
        response: 'Opening bargain bot' 
      },
      'negotiate': { 
        view: 'bargain', 
        response: 'Opening negotiation bot' 
      },
      'negotiation': { 
        view: 'bargain', 
        response: 'Opening negotiation bot' 
      },
      'scheme': { 
        view: 'schemes', 
        response: 'Opening government schemes' 
      },
      'schemes': { 
        view: 'schemes', 
        response: 'Opening government schemes' 
      },
      'government': { 
        view: 'schemes', 
        response: 'Opening government schemes' 
      },
      'subsidy': { 
        view: 'schemes', 
        response: 'Opening government schemes' 
      },
      'whatsapp': { 
        view: 'whatsapp', 
        response: 'Opening WhatsApp settings' 
      },
      'notification': { 
        view: 'whatsapp', 
        response: 'Opening notification settings' 
      },
      'notifications': { 
        view: 'whatsapp', 
        response: 'Opening notification settings' 
      },
      'home': { 
        view: 'dashboard', 
        response: 'Going back to dashboard' 
      },
      'dashboard': { 
        view: 'dashboard', 
        response: 'Opening dashboard' 
      },
      'main': { 
        view: 'dashboard', 
        response: 'Going to main screen' 
      },
    };

    // Check for matches
    for (const [keyword, action] of Object.entries(navigationMap)) {
      if (lowerText.includes(keyword)) {
        setResponse(action.response);
        setShowResponse(true);
        speak(action.response);
        
        // Navigate after a short delay
        setTimeout(() => {
          onNavigate(action.view);
          setShowResponse(false);
        }, 1500);
        
        return;
      }
    }

    // No match found
    setResponse("I didn't understand that. Try saying 'show orders' or 'open photo studio'");
    setShowResponse(true);
    speak("I didn't understand that");
    setTimeout(() => setShowResponse(false), 3000);
  }, [onNavigate]);

  // Text-to-speech
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  // Voice recognition
  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setResponse('');
    
    // Mark as used
    localStorage.setItem('kalaikatha_vani_used', 'true');
    setShowFirstTimeHint(false);
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Voice input not supported. Please use Chrome or Edge.');
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcriptText = event.results[current][0].transcript;
      setTranscript(transcriptText);
      
      // Process final result
      if (event.results[current].isFinal) {
        processVoiceCommand(transcriptText);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error !== 'no-speech') {
        setResponse('Error listening. Please try again.');
        setShowResponse(true);
        setTimeout(() => setShowResponse(false), 3000);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <>
      {/* First-time user hint */}
      <AnimatePresence>
        {showFirstTimeHint && !shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20, y: 20 }}
            className="fixed bottom-28 right-6 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-2xl shadow-2xl max-w-[200px]"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <p className="font-bold text-sm">Tap to speak!</p>
            </div>
            <p className="text-xs leading-relaxed opacity-90">
              Say: "Upload photo", "Check orders", or "Calculate price"
            </p>
            <p className="text-xs mt-2 opacity-75">
              बोलने के लिए यहाँ टैप करें
            </p>
            {/* Arrow pointing down */}
            <motion.div
              className="absolute -bottom-2 right-8 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-orange-500"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Vani Button - ENHANCED for prominence */}
      <motion.button
        onClick={isListening ? stopListening : startListening}
        className={`fixed bottom-6 right-6 z-50 w-20 h-20 rounded-full shadow-2xl flex items-center justify-center transition-all ${
          isListening
            ? 'bg-gradient-to-br from-red-500 to-pink-500'
            : 'bg-gradient-to-br from-amber-500 to-orange-500'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={
          !isListening
            ? {
                boxShadow: [
                  '0 10px 40px rgba(251, 146, 60, 0.4)',
                  '0 10px 60px rgba(251, 146, 60, 0.6)',
                  '0 10px 40px rgba(251, 146, 60, 0.4)',
                ],
              }
            : {}
        }
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        {/* Pulse rings when idle */}
        {!isListening && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full bg-amber-500"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-orange-500"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.5,
              }}
            />
          </>
        )}
        
        {/* Icon */}
        <motion.div
          animate={isListening ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
          className="relative z-10"
        >
          {isListening ? (
            <MicOff className="w-10 h-10 text-white" />
          ) : (
            <Mic className="w-10 h-10 text-white" />
          )}
        </motion.div>
      </motion.button>

      {/* Listening Indicator - Simplified */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-28 right-6 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 max-w-xs"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
              <Mic className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white mb-1">
                Listening...
              </p>
              {transcript && (
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  "{transcript}"
                </p>
              )}
            </div>
            <button
              onClick={stopListening}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Response Display - Enhanced */}
      {showResponse && response && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-28 right-6 z-50 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-2xl p-4 max-w-xs"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white font-medium mb-1">
                Vani
              </p>
              <p className="text-xs text-white/90">
                {response}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Tooltip - Enhanced visibility */}
      {!isListening && !showResponse && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="hidden md:block fixed bottom-28 right-6 z-40 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-xl px-4 py-2 pointer-events-none shadow-xl"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tap to ask Vani</span>
          </div>
        </motion.div>
      )}
    </>
  );
}