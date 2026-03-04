import { motion } from 'motion/react';
import { ArrowLeft, Package, Clock, IndianRupee, Check, X as XIcon, MessageCircle, Calendar } from 'lucide-react';
import { useState } from 'react';
import refernce from 'figma:asset/852ca5c1ac40dbd85cdb673b76a77225c11846b5.png';
import natarajaImage from 'figma:asset/c4bd4a481962f09a4571c49fd1d8d14e665e0b1b.png';
interface Crops {
  onBack: () => void;
}

export function CustomOrders({ onBack }: CustomOrdersProps) {
  const [showDetailedText] = useState(
    localStorage.getItem('artisan_detailed_text') === 'true'
  );
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [counterOffer, setCounterOffer] = useState('');
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>({});
  const [showAcceptConfirmation, setShowAcceptConfirmation] = useState<string | null>(null);

  const orders = [
    {
      id: '1',
      productName: '15 Dancing Nataraja Sculptures for Luxury Hotel',
      buyer: 'Al Habtoor Palace Hotel - Dubai',
      description: 'Bulk order for 15 bronze Nataraja sculptures (12" each) for luxury hotel lobby display',
      specifications: 'Size: 12 inches each, Lost-wax cast method, Golden patina finish, Solid bronze (4.2kg each), Matching pedestals with hotel logo engraving',
      quantity: 15,
      budget: 166500, // 40% discount from ₹18,500 × 15 = ₹277,500
      dateRequired: '2026-07-01',
      images: [natarajaImage],
      expiresIn: '3 days',
      status: 'pending',
      aiSuggestion: {
        canFulfill: true,
        recommendedPrice: 222000, // 20% discount instead of 40%
        reasoning: 'Budget offers 40% discount (₹11,100 per piece). AI recommends 20% discount at ₹14,800/piece = ₹222,000 total.\n\nAnalysis:\n• Material cost: ₹4,200/piece × 15 = ₹63,000\n• Labor: 10 days/piece × 15 = 150 days @ ₹800/day = ₹120,000\n• 9th generation expertise premium: 15%\n• Bulk discount (15 pieces): Justify 20% max\n\nThis is a one-of-a-kind sculpture, not mass-produced. Price reflects 120 hours of manual labor per piece and generational metal alloy secrets.',
        timeRequired: '3 months (90 days)',
        counterOffer: {
          price: 222000,
          discount: '20%',
          perPiece: 14800,
          message: 'Ramesh can offer a 20% discount for 15 units, and complete the order in 3 months. The price reflects 120 hours of manual labor per piece and a 9th-generation metal alloy secret. This is a one-of-a-kind sculpture, not a mass-produced replica. Does this work for your timeline?',
        }
      }
    },
    {
      id: '2',
      productName: 'Custom Temple Bell Set (3 sizes)',
      buyer: 'Meenakshi Temple Trust',
      description: 'Traditional lost-wax cast temple bells with sacred engravings',
      specifications: 'Large (8kg), Medium (5kg), Small (2kg), Traditional bell metal alloy, Sanskrit mantras engraved',
      quantity: 3,
      budget: 45000,
      dateRequired: '2026-03-15',
      images: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400'],
      expiresIn: '7 days',
      status: 'negotiating',
      yourOffer: 48000,
      aiSuggestion: {
        canFulfill: true,
        recommendedPrice: 48000,
        reasoning: 'Current offer ₹48,000 matches optimal price. Temple bells require precise tuning (3 days tuning per bell) + bell metal alloy secret. AI holding firm at this price.',
        timeRequired: '25-30 days',
      }
    },
  ];

  const handleAccept = (orderId: string) => {
    console.log('Accepting order:', orderId);
    // Update order status
    setOrderStatuses(prev => ({ ...prev, [orderId]: 'accepted' }));
    // Show confirmation
    setShowAcceptConfirmation(orderId);
    // Auto-hide confirmation after 5 seconds
    setTimeout(() => setShowAcceptConfirmation(null), 5000);
  };

  const handleCounter = (orderId: string) => {
    console.log('Counter offer:', orderId, counterOffer);
    // Update order status to negotiating
    setOrderStatuses(prev => ({ ...prev, [orderId]: 'negotiating' }));
    setSelectedOrder(null);
  };

  const handleReject = (orderId: string) => {
    console.log('Rejecting order:', orderId);
    // Update order status to rejected
    setOrderStatuses(prev => ({ ...prev, [orderId]: 'rejected' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 pt-20">
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
            <h1 className="text-2xl text-gray-900 dark:text-white">Custom Orders</h1>
            {showDetailedText && <p className="text-gray-600 dark:text-gray-400">Review and respond to buyer requests</p>}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-2xl text-gray-900 dark:text-white mb-1">
              {orders.filter(o => (orderStatuses[o.id] || o.status) === 'pending').length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">New Requests</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl text-gray-900 dark:text-white mb-1">
              {orders.filter(o => (orderStatuses[o.id] || o.status) === 'negotiating').length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">AI Negotiating</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl text-gray-900 dark:text-white mb-1">
              {orders.filter(o => (orderStatuses[o.id] || o.status) === 'accepted').length}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Accepted</p>
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg mb-1">{order.productName}</h3>
                    <p className="text-sm text-white/90">Requested by {order.buyer}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{order.expiresIn}</span>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="p-6 space-y-4">
                {/* Images */}
                {order.images.length > 0 && (
                  <div className="flex gap-2">
                    {order.images.map((img, i) => (
                      <img
                        key={i}
                        src={natarajaImage}
                        alt="Reference"
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                    ))}
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-1">Description</h4>
                  <p className="text-gray-900 dark:text-white">{order.description}</p>
                </div>

                {/* Specifications */}
                <div>
                  <h4 className="text-sm text-gray-700 dark:text-gray-300 mb-1">Specifications</h4>
                  <p className="text-gray-900 dark:text-white text-sm">{order.specifications}</p>
                </div>

                {/* Requirements Grid */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1 flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      Quantity
                    </p>
                    <p className="text-lg text-gray-900 dark:text-white">{order.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      Budget
                    </p>
                    <p className="text-lg text-gray-900 dark:text-white">₹{order.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Required By
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {new Date(order.dateRequired).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* AI Suggestion */}
                <div className={`rounded-xl p-4 ${
                  order.aiSuggestion.canFulfill
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      order.aiSuggestion.canFulfill
                        ? 'bg-green-100 dark:bg-green-800'
                        : 'bg-red-100 dark:bg-red-800'
                    }`}>
                      <MessageCircle className={`w-5 h-5 ${
                        order.aiSuggestion.canFulfill
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm mb-1 ${
                        order.aiSuggestion.canFulfill
                          ? 'text-green-900 dark:text-green-300'
                          : 'text-red-900 dark:text-red-300'
                      }`}>
                        AI Analysis
                      </h4>
                      <p className={`text-sm mb-2 ${
                        order.aiSuggestion.canFulfill
                          ? 'text-green-800 dark:text-green-400'
                          : 'text-red-800 dark:text-red-400'
                      }`}>
                        {order.aiSuggestion.reasoning}
                      </p>
                      {order.aiSuggestion.canFulfill && (
                        <div className="flex gap-4 text-xs">
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Suggested Price: </span>
                            <span className="text-green-700 dark:text-green-400">₹{order.aiSuggestion.recommendedPrice.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-400">Time: </span>
                            <span className="text-green-700 dark:text-green-400">{order.aiSuggestion.timeRequired}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {(orderStatuses[order.id] || order.status) === 'pending' && (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
                    <button
                      onClick={() => handleReject(order.id)}
                      className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <XIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Decline</span>
                    </button>
                    
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 px-4 sm:px-6 py-3 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-xl hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="whitespace-nowrap">Counter</span>
                    </button>
                    
                    <button
                      onClick={() => handleAccept(order.id)}
                      className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="whitespace-nowrap">Accept ₹{order.aiSuggestion.recommendedPrice.toLocaleString()}</span>
                    </button>
                  </div>
                )}

                {(orderStatuses[order.id] || order.status) === 'accepted' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-500 dark:border-green-600 rounded-xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg text-green-900 dark:text-green-300 mb-2">
                          Order Accepted! 🎉
                        </h4>
                        <p className="text-sm text-green-800 dark:text-green-400 mb-3">
                          You accepted this order for ₹{order.aiSuggestion.recommendedPrice.toLocaleString()}
                        </p>
                        <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 space-y-2 text-sm">
                          <p className="text-gray-700 dark:text-gray-300">
                            <strong>Next Steps:</strong>
                          </p>
                          <ul className="space-y-1 text-gray-600 dark:text-gray-400 ml-4">
                            <li>• Buyer will be notified via WhatsApp</li>
                            <li>• You'll receive buyer contact details</li>
                            <li>• Discuss delivery timeline and payment terms</li>
                            <li>• Begin production once payment is confirmed</li>
                          </ul>
                        </div>
                        <button
                          onClick={() => {
                            window.open(`https://wa.me/?text=Order%20confirmed%20for%20${encodeURIComponent(order.productName)}`, '_blank');
                          }}
                          className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Contact Buyer on WhatsApp
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {(orderStatuses[order.id] || order.status) === 'rejected' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-4 text-center"
                  >
                    <XIcon className="w-8 h-8 text-gray-500 dark:text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Order declined
                    </p>
                  </motion.div>
                )}

                {(orderStatuses[order.id] || order.status) === 'negotiating' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h4 className="text-sm text-blue-900 dark:text-blue-300">
                        AI is negotiating for you
                      </h4>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-400 mb-3">
                      Your counter offer of ₹{order.yourOffer.toLocaleString()} has been sent. 
                      AI is working to reach ₹{order.aiSuggestion.recommendedPrice.toLocaleString()} 
                      while staying above your minimum range.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        className="flex-1 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => {
                          console.log('👁️ Viewing negotiation details for order:', order.id);
                          alert(`📊 Negotiation Details\n\nOrder: ${order.productName}\n\nCurrent Offer: ₹${order.yourOffer?.toLocaleString()}\nTarget Price: ₹${order.aiSuggestion.recommendedPrice.toLocaleString()}\nBuyer Budget: ₹${order.budget.toLocaleString()}\n\nAI Strategy:\n• Started with ₹${order.yourOffer?.toLocaleString()}\n• Incrementally pushing to ₹${order.aiSuggestion.recommendedPrice.toLocaleString()}\n• Will accept if buyer goes above ₹${(order.yourOffer || 0) + 50}\n\n(Full negotiation log coming soon!)`);
                        }}
                      >
                        View Negotiation
                      </button>
                      <button
                        className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
                        onClick={() => {
                          console.log('✅ Accepting current offer for order:', order.id);
                          alert(`✅ Offer Accepted!\n\nYou accepted ₹${order.yourOffer?.toLocaleString()} for ${order.productName}\n\nNext Steps:\n• Buyer will be notified\n• You'll receive WhatsApp contact\n• Agree on delivery timeline\n• Begin production\n\n(Integration with WhatsApp Business coming soon!)`);
                        }}
                      >
                        Accept Current Offer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp Integration Info */}
        {showDetailedText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4"
          >
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm text-green-900 dark:text-green-300 mb-1">
                  WhatsApp Business Integration
                </h4>
                <p className="text-xs text-green-700 dark:text-green-400">
                  After accepting an order, you'll receive the buyer's WhatsApp contact to discuss 
                  further details and share progress updates.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}