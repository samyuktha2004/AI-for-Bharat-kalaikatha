import { motion } from 'motion/react';
import { X, Upload, Calendar, IndianRupee, Clock, Users, Package, MessageCircle, Heart, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useSavedArtisans } from '../../contexts/SavedArtisansContext';
import { useArtisans } from '../../hooks/useArtisans';
import { useCustomOrders } from '../../hooks/useCustomOrders';
import { useAuth } from '../../contexts/AuthContext';

interface CustomOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (order: any) => void;
  artisanId?: string | null;
  craftId?: string | null;
}

export function CustomOrderForm({ isOpen, onClose, onSubmit, artisanId, craftId }: CustomOrderFormProps) {
  const [step, setStep] = useState(1);
  const { savedArtisans } = useSavedArtisans();
  const { artisans } = useArtisans();
  const { createOrder } = useCustomOrders();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    specifications: '',
    quantity: 1,
    budget: '',
    dateRequired: '',
    images: [] as string[],
    artistSelection: artisanId ? 'single' : 'open' as 'open' | 'specific' | 'saved' | 'single',
    selectedArtists: artisanId ? [artisanId] : [] as string[],
    responseTimeLimit: '7' as '3' | '7' | '14' | '30',
  });

  // Filter artisans who accept commissions
  const availableArtisans = artisans.filter(a => 
    a.commissionSettings.acceptingCommissions &&
    (!formData.budget || !a.commissionSettings.minimumBudget || 
     parseFloat(formData.budget) >= a.commissionSettings.minimumBudget)
  );

  const savedArtisansList = artisans.filter(a => 
    savedArtisans.includes(a.id) && 
    a.commissionSettings.acceptingCommissions &&
    (!formData.budget || !a.commissionSettings.minimumBudget || 
     parseFloat(formData.budget) >= a.commissionSettings.minimumBudget)
  );

  // Get selected artisan if single mode
  const selectedArtisan = artisanId ? artisans.find(a => a.id === artisanId) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: 'open',
      craftId: craftId || null,
    });
    onClose();
  };

  const toggleArtist = (artistId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedArtists: prev.selectedArtists.includes(artistId)
        ? prev.selectedArtists.filter(id => id !== artistId)
        : [...prev.selectedArtists, artistId]
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl mb-1">Create Custom Order</h2>
              <p className="text-white/80 text-sm">Step {step} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all ${
                  s <= step ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Product Details */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                  placeholder="e.g., Custom Embroidered Shawl"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                  placeholder="Describe what you're looking for..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Detailed Specifications
                </label>
                <textarea
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                  placeholder="Size, color, material, design preferences..."
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Upload Reference Images
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-amber-500 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Requirements */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Quantity *
                  </label>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    Budget (₹) *
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      required
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                      placeholder="Your budget"
                    />
                  </div>
                </div>
              </div>

              {formData.budget && availableArtisans.length === 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm text-amber-900 dark:text-amber-300 mb-1">
                        Budget too low for current artisans
                      </h4>
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        No artisans currently accepting commissions at this budget. Consider increasing your budget or waiting for new artisans.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Date Required *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={formData.dateRequired}
                    onChange={(e) => setFormData({ ...formData, dateRequired: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Response Time Limit
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['3', '7', '14', '30'].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setFormData({ ...formData, responseTimeLimit: days as any })}
                      className={`py-3 rounded-xl transition-all ${
                        formData.responseTimeLimit === days
                          ? 'bg-amber-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {days} days
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  ⏱️ Artisans must respond within this time to prevent endless waiting
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Artist Selection */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Single Artisan Mode (pre-selected) */}
              {artisanId && selectedArtisan ? (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                  <h4 className="text-lg text-gray-900 dark:text-white mb-4">Order for Specific Artisan</h4>
                  <div className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-xl p-4">
                    <img
                      src={selectedArtisan.portrait}
                      alt={selectedArtisan.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-gray-900 dark:text-white">{selectedArtisan.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{selectedArtisan.craft} • {selectedArtisan.state}</p>
                      {selectedArtisan.commissionSettings.minimumBudget && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          Min. budget: ₹{selectedArtisan.commissionSettings.minimumBudget.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm text-gray-700 dark:text-gray-300 mb-3">
                      Who should see this order?
                    </label>
                    <div className="space-y-3">
                      {/* Open to All */}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, artistSelection: 'open', selectedArtists: [] })}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          formData.artistSelection === 'open'
                            ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-amber-600 mt-0.5" />
                          <div>
                            <h4 className="text-gray-900 dark:text-white mb-1">Open to All Artisans</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {availableArtisans.length} artisans accepting commissions can view and respond
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Saved Artisans */}
                      {savedArtisansList.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, artistSelection: 'saved', selectedArtists: savedArtisansList.map(a => a.id) })}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            formData.artistSelection === 'saved'
                              ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <Heart className="w-5 h-5 text-amber-600 mt-0.5 fill-current" />
                            <div>
                              <h4 className="text-gray-900 dark:text-white mb-1">Saved Artisans Only</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Send to {savedArtisansList.length} artisans you've saved
                              </p>
                            </div>
                          </div>
                        </button>
                      )}

                      {/* Select Specific */}
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, artistSelection: 'specific' })}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          formData.artistSelection === 'specific'
                            ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-amber-600 mt-0.5" />
                          <div>
                            <h4 className="text-gray-900 dark:text-white mb-1">Select Specific Artisans</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Choose which artisans can see this order
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Artisan Selection Grid */}
                  {formData.artistSelection === 'specific' && (
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        Select artisans ({formData.selectedArtists.length} selected)
                      </p>
                      {availableArtisans.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No artisans available for your budget
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                          {availableArtisans.map((artisan) => (
                            <button
                              key={artisan.id}
                              type="button"
                              onClick={() => toggleArtist(artisan.id)}
                              className={`p-3 rounded-xl border-2 transition-all text-left ${
                                formData.selectedArtists.includes(artisan.id)
                                  ? 'border-amber-600 bg-amber-50 dark:bg-amber-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <img
                                    src={artisan.portrait}
                                    alt={artisan.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                  />
                                  {savedArtisans.includes(artisan.id) && (
                                    <Heart className="w-4 h-4 text-red-500 fill-current absolute -top-1 -right-1 bg-white rounded-full" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm text-gray-900 dark:text-white truncate">
                                    {artisan.name}
                                  </h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                    {artisan.craft}
                                  </p>
                                  {artisan.commissionSettings.minimumBudget && (
                                    <p className="text-xs text-amber-600 dark:text-amber-400">
                                      Min: ₹{artisan.commissionSettings.minimumBudget.toLocaleString()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Azure AI Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm text-blue-900 dark:text-blue-300 mb-1">
                      Azure Agentic AI Negotiation
                    </h4>
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Our AI will handle counter-negotiations automatically, ensuring artisans can fulfill
                      orders profitably while getting you the best price within their acceptable range.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </form>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (step < 3) {
                  setStep(step + 1);
                } else {
                  handleSubmit(new Event('submit') as any);
                }
              }}
              disabled={step === 3 && formData.artistSelection === 'specific' && formData.selectedArtists.length === 0}
              className="flex-1 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 3 ? 'Submit Order' : 'Continue'}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}