import { motion, AnimatePresence } from 'motion/react';
import { X, Award, MapPin, History, Lock, FileEdit } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ArtisanGalleryInline } from './ArtisanGalleryInline';
import { useAuth } from '../../contexts/AuthContext';

interface CraftDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  craft: any;
  onMeetMakers: () => void;
  onLoginRequired: () => void;
  onCustomOrder?: (artisanId?: string) => void;
}

export function CraftDetails({ isOpen, onClose, craft, onLoginRequired, onCustomOrder }: CraftDetailsProps) {
  const makersRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isOpen && makersRef.current) {
      // Auto-scroll to makers section after heritage info is visible
      const timer = setTimeout(() => {
        makersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!craft) return null;

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

          {/* Full Screen Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-hidden"
          >
            {/* Close Button - Fixed */}
            <button
              onClick={onClose}
              className="fixed top-4 md:top-6 right-4 md:right-6 p-2 md:p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors z-50 shadow-lg"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Scrollable Content */}
            <div className="h-full overflow-y-auto">
              {/* Hero Video Section */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative w-full aspect-video overflow-hidden"
              >
                <img
                  src={craft.image}
                  alt={craft.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Play Button */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <button className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/40 transition-colors flex items-center justify-center group">
                    <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl text-white mb-2"
                  >
                    {craft.name}
                  </motion.h1>
                </div>
              </motion.div>

              <div className="px-6 mt-6 space-y-6 pb-20">
                {/* Quick Info Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-amber-600" />
                      <span className="text-sm text-amber-900">Region</span>
                    </div>
                    <p className="text-gray-800">{craft.region}</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-900">Material</span>
                    </div>
                    <p className="text-gray-800">{craft.material}</p>
                  </div>
                </motion.div>

                {/* Craft History */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <History className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="text-lg text-gray-900">Craft History</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{craft.history}</p>
                </motion.div>

                {/* Heritage Status */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg text-gray-900">Heritage Status</h3>
                  </div>
                  <p className="text-green-800">{craft.heritageStatus}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Recognized and protected under national heritage preservation programs
                  </p>
                </motion.div>

                {/* Meet the Makers Section - Inline */}
                <motion.div
                  ref={makersRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="pt-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                    <h2 className="text-xl text-gray-900 dark:text-white">Meet the Makers</h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>

                  {isAuthenticated ? (
                    <ArtisanGalleryInline craftId={craft.id} onCustomOrder={onCustomOrder} />
                  ) : (
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8 text-center border border-indigo-100 dark:border-indigo-800">
                      <div className="w-16 h-16 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                        <Lock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="text-xl text-gray-900 dark:text-white mb-2">Sign in to Meet the Artisans</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Create an account to connect with artisans, view their profiles, and purchase authentic handcrafted items
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          console.log('🔵 Sign In button clicked - Opening buyer login modal');
                          onLoginRequired();
                        }}
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer font-semibold"
                      >
                        Sign In / Sign Up
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}