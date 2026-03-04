/**
 * SimpleVisualButton - Ultra-simplified button for illiterate users
 * 
 * Features:
 * - Large touch target (80px minimum)
 * - Icon-only communication (no text required)
 * - Color-coded (red=danger, green=success, blue=action)
 * - Audio feedback on tap
 * - Haptic vibration on touch
 * - Visual pulse animation
 * - Works offline
 */

import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { useTextToSpeech } from '../../hooks/useArtisanFeatures';
import { useState, useRef, useEffect } from 'react';

interface SimpleVisualButtonProps {
  icon: LucideIcon;
  color: 'red' | 'green' | 'blue' | 'orange' | 'purple' | 'yellow';
  onClick: () => void;
  label?: string; // Spoken aloud, not shown
  helpText?: string; // Detailed explanation when in help mode or long-press
  size?: 'normal' | 'large' | 'huge';
  disabled?: boolean;
  badge?: number; // Notification count
  pulse?: boolean; // Attention-grabbing animation
  isHelpMode?: boolean; // Global help mode (from HelpSystem)
  onFirstTouch?: () => void; // Called on first touch only
  buttonId?: string; // Unique ID for tracking first touches
}

const COLOR_CLASSES = {
  red: 'bg-gradient-to-br from-red-500 to-pink-500 active:from-red-600 active:to-pink-600',
  green: 'bg-gradient-to-br from-green-500 to-emerald-500 active:from-green-600 active:to-emerald-600',
  blue: 'bg-gradient-to-br from-blue-500 to-indigo-500 active:from-blue-600 active:to-indigo-600',
  orange: 'bg-gradient-to-br from-orange-500 to-amber-500 active:from-orange-600 active:to-amber-600',
  purple: 'bg-gradient-to-br from-purple-500 to-pink-500 active:from-purple-600 active:to-pink-600',
  yellow: 'bg-gradient-to-br from-yellow-400 to-amber-400 active:from-yellow-500 active:to-amber-500',
};

const SIZE_CLASSES = {
  normal: 'w-20 h-20', // 80px
  large: 'w-28 h-28',  // 112px
  huge: 'w-40 h-40',   // 160px
};

const ICON_SIZES = {
  normal: 'w-10 h-10', // 40px
  large: 'w-14 h-14',  // 56px
  huge: 'w-20 h-20',   // 80px
};

export function SimpleVisualButton({
  icon: Icon,
  color,
  onClick,
  label,
  helpText,
  size = 'normal',
  disabled = false,
  badge,
  pulse = false,
  isHelpMode = false,
  onFirstTouch,
  buttonId,
}: SimpleVisualButtonProps) {
  const { speak } = useTextToSpeech();
  const [firstTouch, setFirstTouch] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current && onFirstTouch && !firstTouch) {
      buttonRef.current.addEventListener('touchstart', () => {
        onFirstTouch();
        setFirstTouch(true);
      }, { once: true });
    }
  }, [onFirstTouch, firstTouch]);

  const handleClick = () => {
    if (disabled) return;

    // Haptic feedback (if supported)
    if ('vibrate' in navigator) {
      navigator.vibrate(50); // 50ms vibration
    }

    // Audio feedback (browser beep or TTS)
    if (label) {
      speak(label);
    } else {
      // Play system sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltrzxnMpBSp+zPDajzsIGGS57OihUBELTKXh8bllHAU2jdXzzn0vBSd4yO/cmEIME1yw6OyrWBQKOZPW88JxJgUme8rx15A6Bx1rtOnpn00MDUyn4/G2ZBwGN5HY88x8LAQmdsfv3pk9CRZZsurkqFYSC0mh4fK9bSAFM4fS89OFMwcdbbvs6aVSEgtHnuDxumwaBS+D0fPWgjQHHGq+7OmlUBELSaHg8rpuHwYug9Dz14M0Bx1rwOzop1ESC0ic3/K5bhwFLYPP89aBNQccasDs6KdREwtJnt/yuW0bBS+Dz/PWgzQIHWu/7OmlUhELSKHf8rpwHgUtg9Dz1oQzBx5pv+zoqFQSC0uh4PO6bCAFLoTR89aDNAgdarDs6ahVEwtIoeDzu28eBTCE0fPWgzUIH2m87eipVBMLSKHg8rtvIAYwhdHz14Q1CB9qu+3oqVYTDEij4PO7byIGMIXR89eENQgfa7zt6KpXFAxIo+H0vG8iBjGF0fPYhTYIH2u77emsWRUNSaTi9L5xIwYziNLz2IY3CB9suO7qrVwWDUql4/S/cSQGNIjT89mGOAgga7zv66tcFg1LpuP0v3ElBjaI1PPZhzgIIGq+7+ytXRcOS6bk9L9yJQc3i9Tz2Yg4CCBqvfDrrl4XDk2m5PW/cyUHOIvU89qJOQggab3w66xfGAxOp+T1wHMlBzmM1fPaiToIIWi98Ouqog0MTqfl9sB0JQc6jNXz2oo6CCFpvfDsqaIeDE+n5faAdCUHO43W89uKOwghab3w7KmjHgxPqOX2wHUlBzuO1vPbi5TKcOQqIwAAAABJRU5ErkJggg==');
      audio.play().catch(() => {}); // Ignore errors
    }

    onClick();
  };

  return (
    <div className="relative">
      {/* Pulsing attention animation */}
      {pulse && !disabled && (
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className={`absolute inset-0 rounded-full ${COLOR_CLASSES[color]} opacity-50 blur-xl`}
        />
      )}

      {/* Main button */}
      <motion.button
        ref={buttonRef}
        onClick={handleClick}
        disabled={disabled}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        className={`
          ${SIZE_CLASSES[size]}
          ${COLOR_CLASSES[color]}
          rounded-full
          shadow-2xl
          flex items-center justify-center
          transition-all duration-200
          relative
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{
          // Ensure minimum touch target of 44px (iOS standard)
          minWidth: '44px',
          minHeight: '44px',
        }}
      >
        {/* Icon */}
        <Icon className={`${ICON_SIZES[size]} text-white drop-shadow-lg`} />

        {/* Notification badge */}
        {badge !== undefined && badge > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 min-w-[32px] h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-white font-bold text-lg px-2"
            >
              {badge > 99 ? '99+' : badge}
            </motion.span>
          </motion.div>
        )}
      </motion.button>

      {/* Optional text label (for sighted users) - Very subtle */}
      {label && (
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
          {label}
        </p>
      )}
    </div>
  );
}