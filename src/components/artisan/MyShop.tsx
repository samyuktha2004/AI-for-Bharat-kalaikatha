import { motion } from 'motion/react';
import { ArrowLeft, Plus, Edit, Eye, ToggleLeft, ToggleRight, IndianRupee, Package } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import natarajaProductImage from 'figma:asset/852ca5c1ac40dbd85cdb673b76a77225c11846b5.png';

interface MyShopProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export function MyShop({ onBack, onNavigate }: MyShopProps) {
  const [showDetailedText] = useState(
    localStorage.getItem('artisan_detailed_text') === 'true'
  );
  const [listings, setListings] = useState([
    {
      id: 1,
      image: natarajaProductImage,
      name: 'Hand-Chiselled Bronze Nataraja (12")',
      price: 18500,
      stock: 2,
      views: 342,
      active: true,
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
      name: 'Traditional Temple Bell (Lost-Wax Cast)',
      price: 6500,
      stock: 5,
      views: 218,
      active: true,
    },
    
  ]);

  const handleEditProduct = (productId: number) => {
    const product = listings.find(l => l.id === productId);
    console.log('✏️ Editing product:', productId);
    toast.info(`Edit "${product?.name}" - Feature coming soon!`);
  };

  const handleToggleActive = (productId: number) => {
    setListings(prevListings =>
      prevListings.map(listing =>
        listing.id === productId
          ? { ...listing, active: !listing.active }
          : listing
      )
    );
    const product = listings.find(l => l.id === productId);
    const newStatus = !product?.active;
    console.log(`🔄 Toggled product #${productId} to ${newStatus ? 'active' : 'paused'}`);
    toast.success(newStatus ? '✅ Product is now live!' : '⏸️ Product paused');
  };

  const handleViewAnalytics = (productId: number) => {
    const product = listings.find(l => l.id === productId);
    console.log('📊 Viewing analytics for:', productId);
    toast.info(`Analytics for "${product?.name}" - Views: ${product?.views}, Revenue: ₹${(product?.price || 0) * 2}`);
  };

  const handleAddNewProduct = () => {
    console.log('➕ Adding new product - navigating to AI Studio');
    toast.success('Opening AI Studio to create your product!');
    if (onNavigate) {
      onNavigate('studio');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 p-4 pt-20">
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
            <h1 className="text-2xl text-gray-900 dark:text-white">My Shop</h1>
            {showDetailedText && <p className="text-gray-600 dark:text-gray-400">Manage your product listings</p>}
          </div>
        </motion.div>

        {/* Add New Product Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleAddNewProduct}
          className="w-full mb-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            {showDetailedText && <span className="text-lg">Add New Product</span>}
          </div>
        </motion.button>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl text-gray-900 dark:text-white">{listings.filter(l => l.active).length}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl text-gray-900 dark:text-white">{listings.reduce((sum, l) => sum + l.views, 0)}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Views</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl text-gray-900 dark:text-white">₹{(listings.reduce((sum, l) => sum + (l.price * l.stock), 0) / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Inventory</p>
          </div>
        </motion.div>

        {/* Product Listings */}
        <div className="space-y-4">
          {listings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (index * 0.1) }}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
            >
              <div className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={listing.image}
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                    {!listing.active && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Paused</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-gray-900 dark:text-white mb-1">{listing.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" />
                        <span>₹{listing.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        <span>{listing.stock} in stock</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Eye className="w-3 h-3" />
                      <span>{listing.views} views</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleEditProduct(listing.id)}
                      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      title="Edit product"
                    >
                      <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>

                    <button
                      onClick={() => handleToggleActive(listing.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        listing.active
                          ? 'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                      title={listing.active ? 'Pause listing' : 'Activate listing'}
                    >
                      {listing.active ? (
                        <ToggleRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Footer */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-4 py-3 flex justify-between items-center text-xs">
                <span className="text-gray-600 dark:text-gray-300">
                  {listing.active ? '✅ Live on marketplace' : '⏸️ Paused'}
                </span>
                <button
                  onClick={() => handleViewAnalytics(listing.id)}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Analytics →
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}