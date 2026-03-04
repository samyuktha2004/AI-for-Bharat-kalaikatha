import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, ShoppingCart, X, ChevronLeft, ChevronRight, Play, FileEdit, Heart, Users } from 'lucide-react';
import { useState } from 'react';
import { useSavedArtisans } from '../../contexts/SavedArtisansContext';
import { useArtisans } from '../../hooks/useArtisans';
import { LoadingGrid } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';

interface ArtisanGalleryInlineProps {
  craftId: string | null;
  onCustomOrder?: (artisanId?: string) => void;
}

export function ArtisanGalleryInline({ craftId, onCustomOrder }: ArtisanGalleryInlineProps) {
  const [selectedArtisan, setSelectedArtisan] = useState<any>(null);
  const [showProcess, setShowProcess] = useState(false);
  const { toggleSaveArtisan, isArtisanSaved } = useSavedArtisans();
  const { artisans, loading, error } = useArtisans(craftId);

  // Filter artisans by craftId
  const filteredArtisans = artisans;

  const ProductCarousel = ({ products }: { products: any[] }) => {
    const scroll = (direction: 'left' | 'right') => {
      const container = document.getElementById(`product-scroll-${selectedArtisan?.id}`);
      if (container) {
        const scrollAmount = direction === 'left' ? -300 : 300;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    };

    return (
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingCart className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-600">Available Products</span>
        </div>

        <div className="relative group">
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          <div
            id={`product-scroll-${selectedArtisan?.id}`}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-shrink-0 w-64"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                  <div className="relative aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="text-sm text-gray-900 mb-1">{product.name}</h4>
                    <p className="text-lg text-indigo-600 mb-3">₹{product.price.toLocaleString()}</p>
                    
                    {product.whatsapp ? (
                      <a
                        href={`https://wa.me/${product.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">WhatsApp</span>
                      </a>
                    ) : (
                      <a
                        href={product.amazonLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-sm">Amazon</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Loading State */}
      {loading && <LoadingGrid />}
      
      {/* Error State */}
      {error && (
        <div className="col-span-3">
          <EmptyState
            icon={Users}
            title="Unable to Load Artisans"
            description="Please check your internet connection and try again."
            action={{
              label: "Retry",
              onClick: () => window.location.reload()
            }}
          />
        </div>
      )}
      
      {/* Empty State */}
      {!loading && !error && filteredArtisans.length === 0 && (
        <div className="col-span-3">
          <EmptyState
            icon={Users}
            title="No Artisans Yet"
            description="This craft doesn't have any artisans registered yet. Check back soon as we onboard more talented makers!"
          />
        </div>
      )}
      
      {/* Instagram Grid View */}
      {!loading && !error && filteredArtisans.length > 0 && (
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {filteredArtisans.map((artisan, index) => (
            <motion.div
              key={artisan.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-square rounded-lg overflow-hidden group"
            >
              <button
                onClick={() => setSelectedArtisan(artisan)}
                className="w-full h-full"
              >
                <img
                  src={artisan.portrait}
                  alt={artisan.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-xs truncate">{artisan.name}</p>
                    <p className="text-white/80 text-xs">{artisan.craft}</p>
                  </div>
                </div>
              </button>
              {/* Heart Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveArtisan(artisan.id);
                }}
                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all z-10"
              >
                <Heart 
                  className={`w-4 h-4 transition-all ${
                    isArtisanSaved(artisan.id) 
                      ? 'text-red-500 fill-current' 
                      : 'text-gray-600'
                  }`} 
                />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Artisan Detail Modal */}
      <AnimatePresence>
        {selectedArtisan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={() => setSelectedArtisan(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl md:rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArtisan(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Artisan Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={selectedArtisan.portrait}
                      alt={selectedArtisan.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-gradient-to-r from-purple-400 to-pink-400"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-gray-900">{selectedArtisan.name}</h3>
                    <p className="text-sm text-gray-500">{selectedArtisan.craft} • {selectedArtisan.state}</p>
                  </div>
                  <button
                    onClick={() => setShowProcess(true)}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Process
                  </button>
                </div>
              </div>

              {/* Bio */}
              <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                <p className="text-gray-700 mb-2">{selectedArtisan.bio}</p>
                <blockquote className="italic text-gray-600 border-l-4 border-amber-400 pl-4 mt-4">
                  "{selectedArtisan.story}"
                </blockquote>
              </div>

              {/* Product Carousel */}
              <div className="p-6">
                <ProductCarousel products={selectedArtisan.products} />
              </div>

              {/* Custom Order Button */}
              {onCustomOrder && (
                <div className="p-6 pt-0">
                  <button
                    onClick={() => {
                      setSelectedArtisan(null);
                      onCustomOrder(selectedArtisan.id);
                    }}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <FileEdit className="w-5 h-5" />
                    <span>Request Custom Order</span>
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Process Video Modal */}
      <AnimatePresence>
        {showProcess && selectedArtisan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
            onClick={() => setShowProcess(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl"
            >
              <div className="relative aspect-video">
                <img
                  src={selectedArtisan.processVideo}
                  alt="Process"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-md hover:bg-white/40 transition-colors flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl text-gray-900 mb-2">Craft Process: {selectedArtisan.craft}</h3>
                <p className="text-gray-600 mb-4">Materials, heritage stories, and traditional techniques</p>
                <button
                  onClick={() => setShowProcess(false)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}