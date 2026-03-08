import { motion } from 'motion/react';
import { X, ShoppingBag, Heart, MessageSquare, Package, TrendingUp, Eye } from 'lucide-react';
import { useState } from 'react';

interface BuyerProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: () => void;
}

export function BuyerProfile({ isOpen, onClose, onCreateOrder }: BuyerProfileProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'bids' | 'favorites'>('orders');

  const orders = [
    {
      id: '1',
      item: 'Handwoven Silk Saree',
      artisan: 'Lakshmi Devi',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400',
      price: 4500,
      status: 'delivered',
      date: '2 weeks ago',
    },
    {
      id: '2',
      item: 'Blue Pottery Vase',
      artisan: 'Rajesh Kumar',
      image: 'https://images.unsplash.com/photo-1617090946034-ebc960daa9bd?w=400',
      price: 850,
      status: 'in-transit',
      date: '3 days ago',
    },
  ];

  const bids = [
    {
      id: '1',
      item: 'Custom Embroidered Shawl',
      artisan: 'Multiple Artisans',
      image: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?w=400',
      yourBid: 3200,
      responses: 3,
      bestOffer: 3500,
      expiresIn: '2 days',
      status: 'active',
    },
    {
      id: '2',
      item: 'Terracotta Tea Set',
      artisan: 'Priya Sharma',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400',
      yourBid: 1200,
      responses: 1,
      bestOffer: 1400,
      expiresIn: 'expired',
      status: 'accepted',
    },
  ];

  const favorites = [
    {
      id: '1',
      name: 'Madhubani Paintings',
      state: 'Bihar',
      image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=400',
      artisans: 12,
    },
    {
      id: '2',
      name: 'Pashmina Shawls',
      state: 'Kashmir',
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400',
      artisans: 8,
    },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl">My Profile</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl mb-1">{orders.length}</div>
              <div className="text-sm text-white/80">Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">{bids.filter(b => b.status === 'active').length}</div>
              <div className="text-sm text-white/80">Active Bids</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">{favorites.length}</div>
              <div className="text-sm text-white/80">Favorites</div>
            </div>
          </div>
        </div>

        {/* Create Custom Order CTA */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateOrder}
          className="mx-6 mt-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
        >
          <Package className="w-5 h-5" />
          <span>Create Custom Order</span>
        </motion.button>

        {/* Tabs */}
        <div className="flex gap-2 p-6 pb-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              activeTab === 'orders'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Orders</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bids')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              activeTab === 'bids'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span>Bids</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              activeTab === 'favorites'
                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" />
              <span>Favorites</span>
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    <img
                      src={order.image}
                      alt={order.item}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-gray-900 dark:text-white mb-1">{order.item}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">by {order.artisan}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg text-indigo-600 dark:text-indigo-400">₹{order.price.toLocaleString()}</span>
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          order.status === 'delivered'
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                            : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        }`}>
                          {order.status === 'delivered' ? '✓ Delivered' : '🚚 In Transit'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{order.date}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'bids' && (
            <div className="space-y-4">
              {bids.map((bid) => (
                <motion.div
                  key={bid.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4 mb-4">
                    <img
                      src={bid.image}
                      alt={bid.item}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-gray-900 dark:text-white mb-1">{bid.item}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{bid.artisan}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          bid.status === 'active'
                            ? 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300'
                            : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        }`}>
                          {bid.status === 'active' ? `${bid.responses} offers` : '✓ Accepted'}
                        </span>
                        {bid.expiresIn !== 'expired' && (
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            Expires in {bid.expiresIn}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Your Offer</p>
                      <p className="text-lg text-gray-900 dark:text-white">₹{bid.yourBid.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Best Counter</p>
                      <p className="text-lg text-indigo-600 dark:text-indigo-400">₹{bid.bestOffer.toLocaleString()}</p>
                    </div>
                  </div>
                  {bid.status === 'active' && (
                    <button className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors">
                      View Offers
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              {favorites.map((fav) => (
                <motion.div
                  key={fav.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4 p-4">
                    <img
                      src={fav.image}
                      alt={fav.name}
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-gray-900 dark:text-white mb-1">{fav.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{fav.state}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Eye className="w-4 h-4" />
                        <span>{fav.artisans} artisans</span>
                      </div>
                    </div>
                    <button className="self-center p-2">
                      <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
