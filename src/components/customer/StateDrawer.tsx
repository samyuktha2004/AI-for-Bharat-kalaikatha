import { motion, AnimatePresence } from 'motion/react';
import { X, Filter, Sparkles, Award, Grid3x3, List } from 'lucide-react';
import { indianStatesData } from '../../data/mockData';
import { useState, useRef } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useStateVideo } from '../../hooks/useStateVideo';

interface StateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stateId: string | null;
  onCraftSelect: (craft: any) => void;
}

export function StateDrawer({ isOpen, onClose, stateId, onCraftSelect }: StateDrawerProps) {
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const state = indianStatesData.find(s => s.id === stateId);

  // Use AI video generation with fallback
  const { videoUrl, fallbackImage, isAIGenerated, loading: videoLoading } = useStateVideo({
    stateName: state?.name || '',
    stateId: stateId || '',
    description: state?.description,
    fallbackUrl: state?.videoUrl,
    fallbackImage: state?.fallbackImage,
    enabled: isOpen && !!state,
  });

  if (!state) return null;

  const materials = ['all', ...new Set(state.crafts.map(c => c.material))];
  const filteredCrafts = filterMaterial === 'all' 
    ? state.crafts 
    : state.crafts.filter(c => c.material === filterMaterial);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl md:rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-2 md:pt-3 pb-1 md:pb-2">
              <div className="w-10 md:w-12 h-1 md:h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 md:top-6 right-4 md:right-6 p-1.5 md:p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
            >
              <X className="w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="overflow-y-auto max-h-[calc(85vh-20px)] pb-8">
              {/* Video Hero Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative w-full aspect-video overflow-hidden"
              >
                {/* Check if it's a video or image URL */}
                {videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') ? (
                  <>
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster={fallbackImage}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      {/* Fallback image if video fails */}
                      {fallbackImage && (
                        <ImageWithFallback
                          src={fallbackImage}
                          alt={state.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </video>
                  </>
                ) : (
                  <img
                    src={videoUrl}
                    alt={state.name}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h1 className="text-3xl text-white mb-2">{state.name}</h1>
                    <p className="text-white/90">{state.description}</p>
                  </motion.div>
                </div>
                
                {/* Play Indicator - only show for images (static) */}
                {!videoUrl.endsWith('.mp4') && !videoUrl.endsWith('.webm') && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <div className="px-6 mt-6">
                {/* Filter Section with View Toggle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mb-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">Filter by material</span>
                    </div>
                    
                    {/* View Mode Toggle */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                        }`}
                      >
                        <List className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                        }`}
                      >
                        <Grid3x3 className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {materials.map((material) => (
                      <button
                        key={material}
                        onClick={() => setFilterMaterial(material)}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                          filterMaterial === material
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {material.charAt(0).toUpperCase() + material.slice(1)}
                      </button>
                    ))}
                  </div>
                </motion.div>

                {/* Crafts Display - Grid or List */}
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    {filteredCrafts.map((craft, index) => (
                      <motion.button
                        key={craft.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + (index * 0.05) }}
                        onClick={() => onCraftSelect(craft)}
                        className="relative aspect-square rounded-2xl overflow-hidden group"
                      >
                        <img
                          src={craft.image}
                          alt={craft.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <h3 className="text-white text-sm mb-1">{craft.name}</h3>
                          <div className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span className="text-xs text-white/90">{craft.material}</span>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredCrafts.map((craft, index) => (
                      <motion.button
                        key={craft.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                        onClick={() => onCraftSelect(craft)}
                        className="w-full bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 group"
                      >
                        <div className="flex gap-4 p-4">
                          {/* Craft Image */}
                          <div className="relative w-32 h-32 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={craft.image}
                              alt={craft.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-2 right-2">
                              <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-600" />
                                <span className="text-xs text-gray-700">{craft.material}</span>
                              </div>
                            </div>
                          </div>

                          {/* Craft Info */}
                          <div className="flex-1 text-left">
                            <h3 className="text-lg text-gray-900 mb-1">{craft.name}</h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{craft.history}</p>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="w-4 h-4 text-amber-600" />
                              <span className="text-xs text-amber-700">{craft.heritageStatus}</span>
                            </div>

                            <div className="text-xs text-gray-500">
                              Region: {craft.region}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}