import { motion, AnimatePresence } from 'motion/react';
import { Shield, X, Check, AlertTriangle, Info } from 'lucide-react';
import { useState } from 'react';

interface TradeSecret {
  type: 'formula' | 'technique' | 'tool' | 'knowledge';
  confidence: number;
  region?: { x: number; y: number; width: number; height: number };
  reason: string;
}

interface TradeSecretConfirmationProps {
  secrets: TradeSecret[];
  imageUrl: string;
  onConfirm: (confirmedSecrets: TradeSecret[]) => void;
  onDismiss: () => void;
}

export function TradeSecretConfirmation({
  secrets,
  imageUrl,
  onConfirm,
  onDismiss,
}: TradeSecretConfirmationProps) {
  const [selectedSecrets, setSelectedSecrets] = useState<Set<number>>(
    new Set(secrets.map((_, idx) => idx)) // All selected by default
  );

  const toggleSecret = (index: number) => {
    const newSelected = new Set(selectedSecrets);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedSecrets(newSelected);
  };

  const handleConfirm = () => {
    const confirmed = secrets.filter((_, idx) => selectedSecrets.has(idx));
    onConfirm(confirmed);
  };

  const getTypeIcon = (type: TradeSecret['type']) => {
    switch (type) {
      case 'formula':
        return '🧪';
      case 'technique':
        return '🎨';
      case 'tool':
        return '🔧';
      case 'knowledge':
        return '📚';
    }
  };

  const getTypeLabel = (type: TradeSecret['type']) => {
    switch (type) {
      case 'formula':
        return 'Secret Formula';
      case 'technique':
        return 'Secret Technique';
      case 'tool':
        return 'Secret Tool';
      case 'knowledge':
        return 'Secret Knowledge';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl text-white">Trade Secret Protection</h2>
                  <p className="text-white/80 text-sm">
                    Confirm what needs protection
                  </p>
                </div>
              </div>
              <button
                onClick={onDismiss}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Warning Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900 dark:text-blue-300">
                  <p className="font-medium mb-1">⚠️ Liability Protection</p>
                  <p>
                    AI detected potential trade secrets in your image. Please review and
                    confirm which items should be kept private in your Protected Vault.
                    Unconfirmed items will be treated as public information.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div>
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Your Photo
                </h3>
                <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Craft with detected secrets"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Red boxes show where AI detected potential secrets
                </p>
              </div>

              {/* Detected Secrets List */}
              <div>
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Detected Secrets ({secrets.length})
                </h3>
                <div className="space-y-3">
                  {secrets.map((secret, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => toggleSecret(idx)}
                      className={`
                        border-2 rounded-xl p-4 cursor-pointer transition-all
                        ${
                          selectedSecrets.has(idx)
                            ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <div
                          className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                            ${
                              selectedSecrets.has(idx)
                                ? 'border-amber-500 bg-amber-500'
                                : 'border-gray-300 dark:border-gray-600'
                            }
                          `}
                        >
                          {selectedSecrets.has(idx) && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{getTypeIcon(secret.type)}</span>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {getTypeLabel(secret.type)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {Math.round(secret.confidence * 100)}% confident
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {secret.reason}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Explanation */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                What happens next?
              </h4>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">Selected Secrets</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Saved to Protected Vault (private, never shared)
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">Unselected Items</p>
                    <p className="text-gray-600 dark:text-gray-400">
                      Treated as public information
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedSecrets.size} of {secrets.length} secrets will be protected
              </p>
              <div className="flex gap-3">
                <button
                  onClick={onDismiss}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Confirm & Protect
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
