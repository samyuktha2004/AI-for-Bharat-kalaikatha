import { motion } from 'motion/react';
import { Mail, Lock, Loader, ArrowRight, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface OTPVerificationModalProps {
  email: string;
  password: string;
  userType: 'buyer' | 'artisan';
  onClose: () => void;
}

const THEMES = {
  buyer: {
    gradient: 'from-indigo-600 to-purple-600',
    badge: 'bg-indigo-50 dark:bg-indigo-900/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    ring: 'focus:ring-indigo-500',
    button: 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600',
  },
  artisan: {
    gradient: 'from-amber-600 to-orange-600',
    badge: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-600 dark:text-amber-400',
    ring: 'focus:ring-amber-500',
    button: 'bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-600',
  }
};

export function OTPVerificationModal({ email, password, userType, onClose }: OTPVerificationModalProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const { verifyOTP, resendOTP } = useAuth();
  
  const theme = THEMES[userType];

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!otp || otp.length < 6) {
        setError('Please enter a valid 6-digit code');
        setIsLoading(false);
        return;
      }

      await verifyOTP(email, otp, userType, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setIsResending(true);

    try {
      await resendOTP(email);
      setOtp('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${theme.badge} mb-4`}>
            <Mail className={`w-8 h-8 ${theme.text}`} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We sent a 6-digit code to<br />
            <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </motion.div>
        )}

        {/* OTP Form */}
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          {/* OTP Input */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Verification Code
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="otp"
                type="text"
                placeholder="000000"
                inputMode="numeric"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(val);
                  setError('');
                }}
                maxLength={6}
                className={`w-full pl-12 pr-4 py-3 text-center text-2xl tracking-widest font-mono bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none transition-colors ${theme.ring}`}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Enter the 6-digit code from your email
            </p>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={isLoading || otp.length < 6}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${theme.button}`}
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Resend Code + Cancel */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={isResending}
            className="flex-1 py-2 px-4 rounded-xl text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isResending ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Resend Code
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 px-4 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-700 dark:text-blue-400">
            <strong>Tip:</strong> Check your spam folder if you don't see the email. We sent the code from <strong>no-reply@cognito-idp.ap-south-1.amazonaws.com</strong>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
