import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Sparkles, Mic, Phone, MicOff } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { OTPVerificationModal } from './OTPVerificationModal';
import logoIcon from 'figma:asset/47690a220b997aa35549fe419decf1f499e5d1e2.png';
import logoText from 'figma:asset/839d5fc81266cc945ac41643b120ebf74a13775a.png';

interface AuthScreenProps {
  onSuccess: () => void;
  initialUserType?: 'buyer' | 'artisan';
}

// Theme configuration
const THEMES = {
  buyer: {
    gradient: 'from-indigo-600 to-purple-600',
    bg: 'from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
    badge: 'bg-indigo-50 dark:bg-indigo-900/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    ring: 'focus:ring-indigo-500',
    highlight: 'bg-indigo-100 dark:bg-indigo-900',
    message: 'Discover Heritage Crafts'
  },
  artisan: {
    gradient: 'from-amber-600 to-orange-600',
    bg: 'from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
    badge: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-600 dark:text-amber-400',
    ring: 'focus:ring-amber-500',
    highlight: 'bg-amber-100 dark:bg-amber-900',
    message: 'Share Your Artistry'
  }
};

const INPUT_BASE_CLASS = 'w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none dark:text-white';
const ICON_CLASS = 'absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400';

export function AuthScreen({ onSuccess, initialUserType = 'buyer' }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'buyer' | 'artisan'>(initialUserType);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isListeningName, setIsListeningName] = useState(false);
  const { login, signup, pendingVerification } = useAuth();

  const theme = THEMES[userType];

  // Store credentials for OTP verification
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleVoiceInput = () => {
    setIsListening(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Voice input not supported. Please use Chrome or Edge.');
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPhone(transcript.replace(/\D/g, ''));
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleVoiceNameInput = () => {
    setIsListeningName(true);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Voice input not supported. Please use Chrome or Edge.');
      setIsListeningName(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setName(transcript);
      setIsListeningName(false);
    };

    recognition.onerror = () => setIsListeningName(false);
    recognition.onend = () => setIsListeningName(false);
    recognition.start();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const identifier = loginMethod === 'email' ? email : phone;
      if (mode === 'login') {
        await login(identifier, password, userType);
        onSuccess();
      } else {
        await signup(identifier, password, userType, name);
        // Store credentials for OTP verification
        setSignupEmail(identifier);
        setSignupPassword(password);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // If trying to login but account doesn't exist, suggest signup
      if (mode === 'login' && error.message?.includes('No account found')) {
        // Switch to signup mode
        setMode('signup');
      }
      // If trying to signup but account exists, suggest login
      else if (mode === 'signup' && error.message?.includes('already')) {
        // Switch to login mode
        setMode('login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const VoiceButton = () => (
    <button
      type="button"
      onClick={handleVoiceInput}
      className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
        isListening ? `${theme.highlight}` : 'hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
      title="Voice input"
    >
      {isListening ? (
        <MicOff className={`w-5 h-5 ${theme.text} animate-pulse`} />
      ) : (
        <Mic className={`w-5 h-5 ${theme.text}`} />
      )}
    </button>
  );

  const VoiceNameButton = () => (
    <button
      type="button"
      onClick={handleVoiceNameInput}
      className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
        isListeningName ? `${theme.highlight}` : 'hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
      title="Voice input"
    >
      {isListeningName ? (
        <MicOff className={`w-5 h-5 ${theme.text} animate-pulse`} />
      ) : (
        <Mic className={`w-5 h-5 ${theme.text}`} />
      )}
    </button>
  );

  // Check if we should show name field
  const showNameField = mode === 'signup' && loginMethod === 'phone' && phone.length === 10;

  return (
    <div className={`fixed inset-0 bg-gradient-to-br ${theme.bg} flex items-center justify-center p-4 z-50 overflow-y-auto`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md my-8"
      >
        {/* Header */}
        <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="text-center mb-8">
          <div className="flex flex-col items-center mb-4">
            <img 
              src={logoIcon} 
              alt="Kalaikatha" 
              className="w-20 h-20 mb-3"
            />
            <img 
              src={logoText} 
              alt="Kalaikatha" 
              className="h-8 w-auto dark:brightness-0 dark:invert"
            />
          </div>
          <p className="text-gray-600 dark:text-gray-400">{theme.message}</p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* User Type Selector */}
          <div className={`bg-gradient-to-r ${theme.badge} p-4`}>
            <div className="grid grid-cols-2 gap-2 bg-white dark:bg-gray-900 rounded-2xl p-1">
              {(['buyer', 'artisan'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setUserType(type)}
                  className={`py-3 rounded-xl transition-all ${
                    userType === type
                      ? `bg-gradient-to-r ${THEMES[type].gradient} text-white shadow-lg`
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  I'm {type === 'buyer' ? 'a Buyer' : 'an Artisan'}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Login Method Toggle */}
            <div>
              <div className="flex gap-2 mb-2">
                {(['email', 'phone'] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setLoginMethod(method)}
                    className={`flex-1 py-2 rounded-lg text-sm transition-all ${
                      loginMethod === method
                        ? `${theme.highlight} ${theme.text}`
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {method === 'email' ? 'Email' : 'Phone'}
                  </button>
                ))}
              </div>

              {loginMethod === 'email' ? (
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Email</label>
                  <div className="relative">
                    <Mail className={ICON_CLASS} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`${INPUT_BASE_CLASS} ${theme.ring}`}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className={ICON_CLASS} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      pattern="[0-9]{10}"
                      className={`${INPUT_BASE_CLASS} ${userType === 'artisan' && mode === 'signup' ? 'pr-12' : ''} ${theme.ring}`}
                      placeholder="Enter 10-digit mobile"
                    />
                    {userType === 'artisan' && mode === 'signup' && <VoiceButton />}
                  </div>
                  {userType === 'artisan' && mode === 'signup' && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Mic className="w-3 h-3" /> Speak your number or type it
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Name */}
            {showNameField && (
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Name</label>
                <div className="relative">
                  <User className={ICON_CLASS} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={`${INPUT_BASE_CLASS} ${userType === 'artisan' && mode === 'signup' ? 'pr-12' : ''} ${theme.ring}`}
                    placeholder="Enter your name"
                  />
                  {userType === 'artisan' && mode === 'signup' && <VoiceNameButton />}
                </div>
                {userType === 'artisan' && mode === 'signup' && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Mic className="w-3 h-3" /> Speak your name or type it
                  </p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className={ICON_CLASS} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${INPUT_BASE_CLASS} ${theme.ring}`}
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2 bg-gradient-to-r ${theme.gradient} hover:shadow-lg ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="px-6 pb-6 text-center">
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className={`text-sm ${theme.text} hover:underline`}
            >
              {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </motion.div>

        {/* Continue as Guest */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onSuccess}
          className="w-full mt-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all shadow-sm"
        >
          Continue browsing as guest →
        </motion.button>
      </motion.div>

      {/* OTP Verification Modal */}
      {pendingVerification && (
        <OTPVerificationModal 
          email={pendingVerification.email}
          password={signupPassword}
          userType={pendingVerification.userType}
          onClose={onSuccess}
        />
      )}
    </div>
  );
}