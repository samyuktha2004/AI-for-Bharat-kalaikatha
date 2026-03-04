// Optimized motion component that reduces animations on low-end devices
import { motion, MotionProps } from 'motion/react';
import { prefersReducedMotion } from '../utils/performance';
import { ReactNode } from 'react';

interface OptimizedMotionProps extends MotionProps {
  children: ReactNode;
  fallback?: 'div' | 'button' | 'section';
}

export function OptimizedMotion({ 
  children, 
  fallback = 'div',
  initial,
  animate,
  exit,
  transition,
  ...props 
}: OptimizedMotionProps) {
  const shouldReduceMotion = prefersReducedMotion();

  // For low-end devices, render static element
  if (shouldReduceMotion) {
    const Component = fallback;
    return <Component {...(props as any)}>{children}</Component>;
  }

  // For capable devices, use full motion
  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Simplified motion variants for low-end devices
export const getMotionVariants = () => {
  if (prefersReducedMotion()) {
    return {
      initial: {},
      animate: {},
      exit: {},
      transition: { duration: 0 }
    };
  }

  return {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 }
    },
    slideDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 }
    }
  };
};
