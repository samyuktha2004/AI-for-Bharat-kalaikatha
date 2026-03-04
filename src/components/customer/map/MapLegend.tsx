import { memo, useMemo } from 'react';
import { motion } from 'motion/react';
import { ANIMATION_TIMINGS } from '../../../constants/mapConstants';

interface State {
  id: string;
  name: string;
  color: string;
}

interface MapLegendProps {
  states: State[];
  maxItems?: number;
}

export const MapLegend = memo(({ states, maxItems = 3 }: MapLegendProps) => {
  const displayStates = states.slice(0, maxItems);

  // Memoize container classes for performance
  const containerClasses = useMemo(
    () => "absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-2 md:p-3 lg:p-4 rounded-lg md:rounded-xl shadow-lg max-w-[140px] md:max-w-none",
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: ANIMATION_TIMINGS.LEGEND_DELAY / 1000 }}
      className={containerClasses}
    >
      <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mb-1 md:mb-2">Heritage Regions</p>
      <div className="space-y-0.5 md:space-y-1">
        {displayStates.map((state) => (
          <div key={state.id} className="flex items-center gap-1.5 md:gap-2">
            <div
              className="w-2 h-2 md:w-3 md:h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: state.color }}
              aria-hidden="true"
            />
            <span className="text-[10px] md:text-xs text-gray-700 dark:text-gray-300 truncate">{state.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

MapLegend.displayName = 'MapLegend';