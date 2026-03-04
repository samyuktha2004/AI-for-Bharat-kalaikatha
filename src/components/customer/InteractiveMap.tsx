import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { indianStatesData } from '../../data/mockData';
import { LoadingScreen } from '../LoadingScreen';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { MapSearchBar } from './map/MapSearchBar';
import { MapLegend } from './map/MapLegend';
import { AIBadge } from './map/AIBadge';
import { StatePin } from './map/StatePin';
import { useResponsive } from '../../hooks/useResponsive';
import indiaMapImage from 'figma:asset/7fd5fb8a933651d1f6d8e284e3e3441e6c7838df.png';
import { 
  ANIMATION_TIMINGS, 
  EASING, 
  getStatePosition 
} from '../../constants/mapConstants';

interface InteractiveMapProps {
  onStateSelect: (stateId: string) => void;
  selectedState: string | null;
}

export function InteractiveMap({ onStateSelect, selectedState }: InteractiveMapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use optimized responsive hook with debouncing
  const isMobile = useResponsive(1024);

  // Map loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), ANIMATION_TIMINGS.MAP_LOAD);
    return () => clearTimeout(timer);
  }, []);

  // Memoized filtered states to prevent unnecessary recalculations
  const filteredStates = useMemo(() => {
    if (!searchQuery.trim()) return indianStatesData;

    const query = searchQuery.toLowerCase();
    return indianStatesData.filter(
      (state) =>
        state.name.toLowerCase().includes(query) ||
        state.crafts.some((craft) => craft.name.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  // Memoized callbacks to prevent child re-renders
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleHoverStart = useCallback((stateId: string) => {
    setHoveredState(stateId);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoveredState(null);
  }, []);

  // Memoize container classes for responsive design
  const containerClasses = useMemo(
    () => "absolute inset-0 flex items-center justify-center pt-20 pb-2 px-2 md:pt-24 md:pb-4 md:px-4",
    []
  );

  const mapClasses = useMemo(
    () => "relative w-full h-full bg-white/40 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-white/30 dark:border-gray-700/30",
    []
  );

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      {/* Search Bar */}
      <MapSearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />

      {/* Loading State */}
      <AnimatePresence>
        {isLoading && <LoadingScreen message="Loading Heritage Map..." fullScreen={true} />}
      </AnimatePresence>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: ANIMATION_TIMINGS.MAP_FADE_IN / 1000, 
          delay: 0.3, 
          ease: EASING.fluid 
        }}
        className={containerClasses}
      >
        <div className={mapClasses}>
          {/* India Map Background */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src={indiaMapImage}
              alt="India Map with Heritage Regions"
              className="w-full h-full object-contain opacity-60 dark:opacity-40"
            />
            {/* Gradient overlay for better pin visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/40 dark:from-gray-900/60 dark:via-transparent dark:to-gray-900/40" />
          </div>

          {/* AI Badge */}
          <AIBadge />

          {/* State Pins */}
          <div className="relative w-full h-full p-4 md:p-8" aria-label="Interactive map of Indian heritage crafts">
            {filteredStates.map((state, index) => {
              const position = getStatePosition(state.id, index, isMobile);
              const isActive = selectedState === state.id || hoveredState === state.id;

              return (
                <StatePin
                  key={state.id}
                  state={state}
                  index={index}
                  position={position}
                  isActive={isActive}
                  isHovered={hoveredState === state.id}
                  isMobile={isMobile}
                  onSelect={onStateSelect}
                  onHoverStart={handleHoverStart}
                  onHoverEnd={handleHoverEnd}
                />
              );
            })}
          </div>

          {/* Legend */}
          <MapLegend states={indianStatesData} maxItems={3} />
        </div>
      </motion.div>
    </div>
  );
}