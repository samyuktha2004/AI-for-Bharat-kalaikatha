import { motion } from 'motion/react';
import { ArrowLeft, Lock, Eye, EyeOff, Shield, FileImage, FileVideo, FileText, AlertCircle, Mic } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProtectedVaultProps {
  onBack: () => void;
}

// PinPad Component for entering PIN
interface PinPadProps {
  value: string;
  maxLength: number;
  onChange?: (value: string) => void;
}

function PinPad({ value, maxLength, onChange }: PinPadProps) {
  const handleNumberClick = (num: number) => {
    if (value.length < maxLength && onChange) {
      onChange(value + num.toString());
    }
  };

  const handleBackspace = () => {
    if (value.length > 0 && onChange) {
      onChange(value.slice(0, -1));
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange('');
    }
  };

  return (
    <div className="space-y-4">
      {/* PIN Display */}
      <div className="flex justify-center gap-2 mb-6">
        {Array.from({ length: maxLength }).map((_, i) => (
          <div
            key={i}
            className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-2xl ${
              i < value.length
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
            }`}
          >
            {i < value.length ? '•' : ''}
          </div>
        ))}
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className="w-full aspect-square rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-2xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="w-full aspect-square rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-200 dark:hover:bg-red-900/50 active:scale-95 transition-all"
        >
          Clear
        </button>
        <button
          onClick={() => handleNumberClick(0)}
          className="w-full aspect-square rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-2xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all"
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          className="w-full aspect-square rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}

export function ProtectedVault({ onBack }: ProtectedVaultProps) {
  const [showDetailedText] = useState(
    localStorage.getItem('artisan_detailed_text') === 'true'
  );
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [hasPin, setHasPin] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [setupStep, setSetupStep] = useState<'pin' | 'confirm' | 'question' | 'answer'>('pin');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [enteredPin, setEnteredPin] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [pinError, setPinError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [pinLength, setPinLength] = useState(4);

  // Check if PIN exists on mount
  useEffect(() => {
    const storedPin = localStorage.getItem('vault_pin');
    const storedLength = localStorage.getItem('vault_pin_length');
    setHasPin(!!storedPin);
    setIsLocked(!!storedPin);
    if (storedLength) {
      setPinLength(parseInt(storedLength));
    }
  }, []);

  const handleUnlockClick = () => {
    if (!hasPin) {
      // First time - setup PIN
      setShowPinSetup(true);
      setSetupStep('pin');
      setPin('');
      setConfirmPin('');
      setSecurityQuestion('');
      setSecurityAnswer('');
    } else {
      // Has PIN - enter it
      setShowPinEntry(true);
      setEnteredPin('');
    }
  };

  const handleSetupPin = () => {
    if (setupStep === 'pin') {
      if (pin.length < 4 || pin.length > 6) {
        setPinError('PIN must be 4-6 digits');
        return;
      }
      setPinLength(pin.length);
      setSetupStep('confirm');
      setPinError('');
    } else if (setupStep === 'confirm') {
      if (confirmPin !== pin) {
        setPinError('PINs do not match. Please try again.');
        setConfirmPin('');
        return;
      }
      setSetupStep('question');
      setPinError('');
    } else if (setupStep === 'question') {
      if (!securityQuestion.trim()) {
        setPinError('Please enter a security question');
        return;
      }
      setSetupStep('answer');
      setPinError('');
    } else if (setupStep === 'answer') {
      if (!securityAnswer.trim()) {
        setPinError('Please enter a one-word answer');
        return;
      }
      if (securityAnswer.trim().split(' ').length > 1) {
        setPinError('Answer must be ONE WORD only');
        return;
      }
      
      // Store everything
      const hashedPin = btoa(pin);
      const hashedAnswer = btoa(securityAnswer.toLowerCase().trim());
      localStorage.setItem('vault_pin', hashedPin);
      localStorage.setItem('vault_pin_length', pin.length.toString());
      localStorage.setItem('vault_security_question', securityQuestion);
      localStorage.setItem('vault_security_answer', hashedAnswer);
      
      setHasPin(true);
      setIsLocked(false);
      setShowPinSetup(false);
      setPin('');
      setConfirmPin('');
      setSecurityQuestion('');
      setSecurityAnswer('');
      setPinError('');
      setSetupStep('pin');
      console.log('🔐 Vault PIN and recovery created');
      alert('✅ Vault Secured!\n\nYour PIN and security question have been set.');
    }
  };

  const handleUnlockWithPin = () => {
    const storedPin = localStorage.getItem('vault_pin');
    const hashedEnteredPin = btoa(enteredPin);
    
    if (hashedEnteredPin === storedPin) {
      // Correct PIN
      setIsLocked(false);
      setShowPinEntry(false);
      setEnteredPin('');
      setAttemptsLeft(3);
      setPinError('');
      console.log('🔓 Vault unlocked');
    } else {
      // Wrong PIN
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      
      if (newAttempts <= 0) {
        setPinError('Too many attempts. Vault locked for 5 minutes.');
        setShowPinEntry(false);
        setEnteredPin('');
        setTimeout(() => {
          setAttemptsLeft(3);
        }, 300000); // 5 minutes
      } else {
        setPinError(`Wrong PIN. ${newAttempts} attempts left.`);
        setEnteredPin('');
      }
    }
  };

  const handleRecoverySubmit = () => {
    const storedAnswer = localStorage.getItem('vault_security_answer');
    const hashedRecoveryAnswer = btoa(recoveryAnswer.toLowerCase().trim());
    
    if (hashedRecoveryAnswer === storedAnswer) {
      // Correct answer - reset PIN
      localStorage.removeItem('vault_pin');
      localStorage.removeItem('vault_pin_length');
      localStorage.removeItem('vault_security_question');
      localStorage.removeItem('vault_security_answer');
      setHasPin(false);
      setIsLocked(true);
      setShowRecovery(false);
      setRecoveryAnswer('');
      setAttemptsLeft(3);
      alert('✅ PIN Reset Successful!\n\nClick "Set Up PIN" to create a new PIN.');
    } else {
      setPinError('Incorrect answer. Please try again.');
      setRecoveryAnswer('');
    }
  };

  const handlePinDigitClick = (digit: string) => {
    setPinError('');
    if (setupStep === 'pin' && pin.length < 6) {
      setPin(prev => prev + digit);
    } else if (setupStep === 'confirm' && confirmPin.length < pinLength) {
      setConfirmPin(prev => prev + digit);
    } else if (showPinEntry && enteredPin.length < pinLength) {
      setEnteredPin(prev => prev + digit);
    }
  };

  const handleDeleteDigit = () => {
    setPinError('');
    if (setupStep === 'pin') {
      setPin(prev => prev.slice(0, -1));
    } else if (setupStep === 'confirm') {
      setConfirmPin(prev => prev.slice(0, -1));
    } else if (showPinEntry) {
      setEnteredPin(prev => prev.slice(0, -1));
    }
  };

  const handleClearPin = () => {
    setPinError('');
    if (setupStep === 'pin') {
      setPin('');
    } else if (setupStep === 'confirm') {
      setConfirmPin('');
    } else if (showPinEntry) {
      setEnteredPin('');
    }
  };

  const handleForgotPin = () => {
    const question = localStorage.getItem('vault_security_question');
    if (!question) {
      alert('❌ No recovery question set.\n\nPlease contact support or reset the app.');
      return;
    }
    setShowPinEntry(false);
    setShowRecovery(true);
    setRecoveryAnswer('');
    setPinError('');
  };

  const vaultItems = [
    {
      id: 1,
      type: 'video',
      name: 'Golden Patina Secret Technique',
      thumbnail: 'https://images.unsplash.com/photo-1582719366074-e33fe5f7ec73?w=400',
      detectedSecrets: ['9th generation alloy ratio', 'Patina temperature (exact °C)', 'Acid mixture formula'],
      uploadDate: '3 days ago',
      autoDetected: true,
    },
    {
      id: 2,
      type: 'image',
      name: 'Lost-Wax Mold Blueprint',
      thumbnail: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400',
      detectedSecrets: ['Wax layering technique', 'Grandfather\'s chisel angles', 'Cooling time secrets'],
      uploadDate: '1 week ago',
      autoDetected: true,
    },
    {
      id: 3,
      type: 'document',
      name: 'Bell Metal Alloy Composition',
      thumbnail: 'https://images.unsplash.com/photo-1456324463128-7ff6903988d8?w=400',
      detectedSecrets: ['Copper-tin ratio (family secret)', 'Smelting temperature chart', 'Sound tuning measurements'],
      uploadDate: '2 weeks ago',
      autoDetected: false,
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <FileImage className="w-5 h-5" />;
      case 'video': return <FileVideo className="w-5 h-5" />;
      case 'document': return <FileText className="w-5 h-5" />;
      default: return <Lock className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 pt-20 pb-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={onBack}
            className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl text-gray-900 dark:text-white flex items-center gap-2">
              <Lock className="w-6 h-6 text-amber-600" />
              Protected Vault
            </h1>
            {showDetailedText && <p className="text-gray-600 dark:text-gray-400">Your trade secrets, safe and secure</p>}
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-6 mb-6 shadow-xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg mb-1">AI Protection Active</h3>
              <p className="text-white/90 text-sm">
                Vani AI automatically detects and protects trade secrets in your uploads. These will never appear in public listings.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Lock/Unlock Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-6 shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            {isLocked ? (
              <Lock className="w-5 h-5 text-red-600" />
            ) : (
              <Eye className="w-5 h-5 text-green-600" />
            )}
            <span className="text-gray-900 dark:text-white">
              {isLocked ? 'Vault Locked' : 'Vault Unlocked'}
            </span>
          </div>
          <button
            onClick={isLocked ? handleUnlockClick : () => setIsLocked(true)}
            className={`px-6 py-2 rounded-full transition-all ${
              isLocked
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isLocked ? (
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4" />
                <span>Unlock</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                <span>Lock</span>
              </div>
            )}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center">
            <p className="text-3xl text-amber-600 mb-1">{vaultItems.length}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Protected Items</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center">
            <p className="text-3xl text-green-600 mb-1">
              {vaultItems.filter(i => i.autoDetected).length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Auto-Detected</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center">
            <p className="text-3xl text-blue-600 mb-1">
              {vaultItems.reduce((sum, i) => sum + i.detectedSecrets.length, 0)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Trade Secrets</p>
          </div>
        </motion.div>

        {/* Vault Items */}
        {isLocked ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-xl text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Lock className="w-12 h-12 text-amber-600" />
            </div>
            <h3 className="text-xl text-gray-900 dark:text-white mb-2">Vault is Locked</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {hasPin ? 'Enter your PIN to unlock' : 'Set up a PIN to protect your trade secrets'}
            </p>
            <button
              onClick={handleUnlockClick}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full hover:shadow-lg transition-all"
            >
              {hasPin ? 'Unlock Vault' : 'Set Up PIN'}
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {vaultItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                onClick={() => setSelectedItem(item)}
                className="w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all text-left"
              >
                <div className="flex gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-full h-full object-cover blur-sm"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-gray-900 dark:text-white">{item.name}</h3>
                      <div className="flex items-center gap-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">
                        {getTypeIcon(item.type)}
                        <span className="capitalize">{item.type}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-2">
                      {item.detectedSecrets.map((secret, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <AlertCircle className="w-3 h-3 text-red-500" />
                          <span>{secret}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{item.uploadDate}</span>
                      {item.autoDetected && (
                        <span className="flex items-center gap-1 text-green-600">
                          <Shield className="w-3 h-3" />
                          AI Protected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Help Text */}
        {showDetailedText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-800"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <p className="mb-2">When you upload content, Vani AI scans for:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Recipes, formulas, and measurements</li>
                  <li>Tool specifications and settings</li>
                  <li>Traditional techniques and processes</li>
                  <li>Family or proprietary patterns</li>
                </ul>
                <p className="mt-2 text-blue-700 dark:text-blue-400">
                  Protected content is automatically blurred or hidden from public view.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* PIN Setup Modal */}
        {showPinSetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl w-full max-w-lg">
              {setupStep === 'pin' && (
                <>
                  <h2 className="text-2xl text-gray-900 dark:text-white mb-2">Set Up Vault PIN</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Enter a 4-6 digit PIN:</p>
                  <PinPad value={pin} maxLength={6} onChange={setPin} />
                  {pinError && <p className="text-red-500 text-sm mt-4 text-center">{pinError}</p>}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setShowPinSetup(false);
                        setPin('');
                        setPinError('');
                      }}
                      className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSetupPin}
                      disabled={pin.length < 4}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {setupStep === 'confirm' && (
                <>
                  <h2 className="text-2xl text-gray-900 dark:text-white mb-2">Confirm Your PIN</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Enter the same {pinLength}-digit PIN again:</p>
                  <PinPad value={confirmPin} maxLength={pinLength} onChange={setConfirmPin} />
                  {pinError && <p className="text-red-500 text-sm mt-4 text-center">{pinError}</p>}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setSetupStep('pin');
                        setConfirmPin('');
                        setPinError('');
                      }}
                      className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSetupPin}
                      disabled={confirmPin.length !== pinLength}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {setupStep === 'question' && (
                <>
                  <h2 className="text-2xl text-gray-900 dark:text-white mb-2">Security Question</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">This helps recover your PIN if you forget it:</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Enter your security question:
                      </label>
                      <input
                        type="text"
                        value={securityQuestion}
                        onChange={(e) => {
                          setSecurityQuestion(e.target.value);
                          setPinError('');
                        }}
                        placeholder="e.g., What is your grandfather's name?"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        💡 Examples: "Mother's village?", "First craft learned?", "Guru's name?"
                      </p>
                    </div>
                  </div>
                  {pinError && <p className="text-red-500 text-sm mt-4">{pinError}</p>}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setSetupStep('confirm');
                        setSecurityQuestion('');
                        setPinError('');
                      }}
                      className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSetupPin}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {setupStep === 'answer' && (
                <>
                  <h2 className="text-2xl text-gray-900 dark:text-white mb-2">Security Answer</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{securityQuestion}</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                        Enter ONE WORD answer:
                      </label>
                      <input
                        type="text"
                        value={securityAnswer}
                        onChange={(e) => {
                          setSecurityAnswer(e.target.value);
                          setPinError('');
                        }}
                        placeholder="One word only"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <p className="text-xs text-red-500 mt-2">
                        ⚠️ Must be ONE WORD only (no spaces)
                      </p>
                    </div>
                  </div>
                  {pinError && <p className="text-red-500 text-sm mt-4">{pinError}</p>}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => {
                        setSetupStep('question');
                        setSecurityAnswer('');
                        setPinError('');
                      }}
                      className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSetupPin}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      Complete Setup
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* PIN Entry Modal */}
        {showPinEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl w-full max-w-lg">
              <h2 className="text-2xl text-gray-900 dark:text-white mb-2">Enter Vault PIN</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Enter your {pinLength}-digit PIN:</p>
              <PinPad value={enteredPin} maxLength={pinLength} onChange={setEnteredPin} />
              {pinError && <p className="text-red-500 text-sm mt-4 text-center">{pinError}</p>}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPinEntry(false);
                    setEnteredPin('');
                    setPinError('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUnlockWithPin}
                  disabled={enteredPin.length !== pinLength}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Unlock
                </button>
              </div>
              <button
                onClick={handleForgotPin}
                className="w-full mt-4 px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
              >
                Forgot PIN?
              </button>
            </div>
          </motion.div>
        )}

        {/* PIN Recovery Modal */}
        {showRecovery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl w-full max-w-lg">
              <h2 className="text-2xl text-gray-900 dark:text-white mb-2">PIN Recovery</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Answer your security question to reset PIN:</p>
              <div className="space-y-4">
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {localStorage.getItem('vault_security_question')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Your Answer:
                  </label>
                  <input
                    type="text"
                    value={recoveryAnswer}
                    onChange={(e) => {
                      setRecoveryAnswer(e.target.value);
                      setPinError('');
                    }}
                    placeholder="Enter your one-word answer"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
              {pinError && <p className="text-red-500 text-sm mt-4">{pinError}</p>}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowRecovery(false);
                    setRecoveryAnswer('');
                    setPinError('');
                    setShowPinEntry(true);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleRecoverySubmit}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Reset PIN
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}