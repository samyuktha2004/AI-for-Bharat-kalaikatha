import { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { ANIMATION_TIMINGS, EASING, Z_INDEX } from '../../../constants/mapConstants';

interface MapSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const MapSearchBar = memo(({ searchQuery, onSearchChange }: MapSearchBarProps) => {
  // Memoize container classes for performance
  const containerClasses = useMemo(
    () => "fixed top-16 md:top-20 left-1/2 -translate-x-1/2 w-full max-w-sm md:max-w-2xl px-3 md:px-4",
    []
  );

  // Memoize input classes for performance
  const inputClasses = useMemo(
    () => "w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3 lg:py-4 text-sm md:text-base rounded-xl md:rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl border border-white/20 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:ring-amber-400 transition-all text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400",
    []
  );

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: ANIMATION_TIMINGS.SEARCH_BAR_SLIDE / 1000, ease: EASING.fluid }}
      className={containerClasses}
      style={{ zIndex: Z_INDEX.SEARCH_BAR }}
    >
      <div className="relative">
        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search crafts, states..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={inputClasses}
          aria-label="Search crafts and states"
        />
      </div>
    </motion.div>
  );
});

MapSearchBar.displayName = 'MapSearchBar';