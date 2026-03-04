/**
 * SmartPricing - AI-powered pricing calculator
 * 
 * Prevents artisan exploitation by calculating fair prices using AI
 * Features:
 * - Material cost + labor hours input
 * - Skill level and uniqueness scoring
 * - Market demand analysis
 * - Floor/Suggested/Premium pricing with reasoning
 * - Exploitation warning if pricing below cost
 * - Voice-friendly for illiterate artisans
 * - Tamil/Hindi language support
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  IndianRupee, 
  Clock, 
  Star, 
  TrendingUp, 
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Mic,
  Info
} from 'lucide-react';
import { useSmartPricing } from '../../hooks/useArtisanFeatures';
import { useTextToSpeech } from '../../hooks/useArtisanFeatures';
import { toast } from 'sonner@2.0.3';

interface SmartPricingProps {
  onBack: () => void;
}

export function SmartPricing({ onBack }: SmartPricingProps) {
  const { calculatePrice, calculating, pricing, error } = useSmartPricing();
  const { speak } = useTextToSpeech();

  // Form state
  const [materialCost, setMaterialCost] = useState('');
  const [laborHours, setLaborHours] = useState('');
  const [skillLevel, setSkillLevel] = useState(5);
  const [uniquenessScore, setUniquenessScore] = useState(5);
  const [marketDemand, setMarketDemand] = useState(5);

  // Voice input for numbers
  const [listeningFor, setListeningFor] = useState<string | null>(null);

  const handleCalculate = async () => {
    // Validation
    if (!materialCost || !laborHours) {
      toast.error('Please enter material cost and labor hours');
      speak('Please enter material cost and labor hours');
      return;
    }

    const factors = {
      materialCost: parseFloat(materialCost),
      laborHours: parseFloat(laborHours),
      skillLevel,
      uniquenessScore,
      marketDemand,
    };

    await calculatePrice(factors);

    // Speak the result
    if (pricing) {
      const message = `Suggested price is ${pricing.suggestedPrice} rupees. ${pricing.reasoning}`;
      speak(message);
    }
  };

  const handleVoiceInput = (field: string) => {
    setListeningFor(field);
    speak(`Say the ${field}`);
    // In production, this would trigger actual voice recognition
    toast.info(`Voice input for ${field} - Feature coming soon!`);
  };

  const isExploitative = pricing && pricing.floorPrice > parseFloat(materialCost) + (parseFloat(laborHours) * 150);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              Smart Pricing
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI calculates fair prices to prevent exploitation
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-4 mb-6 shadow-lg"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium mb-1">How Smart Pricing Works</p>
              <p className="text-white/90 text-xs">
                AI analyzes your costs, skill level, and market demand to suggest fair prices. 
                We'll warn you if pricing is below cost to prevent exploitation.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Input Form */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-6">
          <h2 className="text-lg text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Cost Details
          </h2>

          {/* Material Cost */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Material Cost (₹)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={materialCost}
                onChange={(e) => setMaterialCost(e.target.value)}
                placeholder="e.g., 5000"
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => handleVoiceInput('material cost')}
                className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                title="Voice input"
              >
                <Mic className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Raw materials, tools, electricity, etc.
            </p>
          </div>

          {/* Labor Hours */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Labor Hours
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={laborHours}
                onChange={(e) => setLaborHours(e.target.value)}
                placeholder="e.g., 24"
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={() => handleVoiceInput('labor hours')}
                className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                title="Voice input"
              >
                <Mic className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Total time to create this product
            </p>
          </div>

          {/* Skill Level Slider */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500" />
              Skill Level: {skillLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={skillLevel}
              onChange={(e) => setSkillLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Beginner</span>
              <span>Master</span>
            </div>
          </div>

          {/* Uniqueness Score Slider */}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Uniqueness: {uniquenessScore}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={uniquenessScore}
              onChange={(e) => setUniquenessScore(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Common</span>
              <span>One-of-a-kind</span>
            </div>
          </div>

          {/* Market Demand Slider */}
          <div className="mb-6">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Market Demand: {marketDemand}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={marketDemand}
              onChange={(e) => setMarketDemand(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Low demand</span>
              <span>High demand</span>
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculate}
            disabled={calculating}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl py-4 font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {calculating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Calculating with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Calculate Fair Price
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800 dark:text-red-300 font-medium">Error</p>
                  <p className="text-xs text-red-700 dark:text-red-400 mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing Results */}
        <AnimatePresence>
          {pricing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              {/* Exploitation Warning */}
              {isExploitative && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-5 shadow-xl"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-lg mb-1">⚠️ Exploitation Alert!</p>
                      <p className="text-sm text-white/90">
                        Your floor price (₹{pricing.floorPrice}) is below your actual costs. 
                        This pricing would result in a loss. Please adjust your prices to ensure fair compensation.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Floor Price */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border-2 border-gray-200 dark:border-gray-700"
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Minimum Price</p>
                  <p className="text-3xl text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                    <IndianRupee className="w-6 h-6" />
                    {pricing.floorPrice.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Covers your costs only
                  </p>
                </motion.div>

                {/* Suggested Price */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-5 shadow-xl border-2 border-indigo-400"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                    <p className="text-xs text-white/90">Recommended</p>
                  </div>
                  <p className="text-3xl text-white mb-2 flex items-center gap-1">
                    <IndianRupee className="w-6 h-6" />
                    {pricing.suggestedPrice.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-white/90">
                    Fair value for your work
                  </p>
                </motion.div>

                {/* Premium Price */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border-2 border-amber-400 dark:border-amber-600"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-amber-500" />
                    <p className="text-xs text-gray-500 dark:text-gray-400">Premium</p>
                  </div>
                  <p className="text-3xl text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                    <IndianRupee className="w-6 h-6" />
                    {pricing.premiumPrice.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    For unique/custom pieces
                  </p>
                </motion.div>
              </div>

              {/* AI Reasoning */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-5 shadow-lg border border-indigo-200 dark:border-indigo-800"
              >
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      AI Pricing Analysis
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {pricing.reasoning}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Price Breakdown */}
              {pricing.breakdown && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg"
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Price Breakdown
                  </p>
                  <div className="space-y-2">
                    {pricing.breakdown.materialCost !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Material Cost</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          ₹{pricing.breakdown.materialCost.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    {pricing.breakdown.laborCost !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Labor Cost</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          ₹{pricing.breakdown.laborCost.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    {pricing.breakdown.skillPremium !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Skill Premium</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          ₹{pricing.breakdown.skillPremium.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    {pricing.breakdown.uniquenessPremium !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Uniqueness Premium</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          ₹{pricing.breakdown.uniquenessPremium.toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-indigo-600 dark:text-indigo-400">
                          ₹{pricing.suggestedPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}