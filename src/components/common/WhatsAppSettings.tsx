/**
 * WhatsApp Settings Component
 * Phone number setup and notification preferences
 */

import { motion } from 'motion/react';
import { MessageCircle, Phone, Check, X, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks';
import {
  saveUserPhone,
  getUserPhone,
  formatPhoneNumber,
  isValidIndianPhone,
  getNotificationHistory,
  getUnreadCount,
  markAsRead,
  generateMockNotification,
  isWhatsAppConfigured,
  type WhatsAppNotification,
} from '@/services/WhatsAppService';

interface WhatsAppSettingsProps {
  userId: string;
  userName: string;
  onClose?: () => void;
}

export function WhatsAppSettings({
  userId,
  userName,
  onClose,
}: WhatsAppSettingsProps) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [notifications, setNotifications] = useState<WhatsAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load existing phone number
  useEffect(() => {
    const saved = getUserPhone(userId);
    if (saved) {
      setPhone(saved.phone);
      setIsSaved(true);
      setIsPhoneValid(true);
    }
  }, [userId]);

  // Load notifications
  useEffect(() => {
    const history = getNotificationHistory(20);
    setNotifications(history);
    setUnreadCount(getUnreadCount());
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    setIsPhoneValid(isValidIndianPhone(value));
  };

  const handleSavePhone = () => {
    if (!isPhoneValid) {
      alert('❌ Invalid phone number. Please enter a valid Indian 10-digit number.');
      return;
    }

    const formatted = formatPhoneNumber(phone);
    saveUserPhone(userId, formatted, userName);
    setIsSaved(true);
    alert(`✅ WhatsApp phone saved!\n\n${formatted}\n\nYou'll receive order notifications here.`);
  };

  const handleTestNotification = () => {
    const mockNotif = generateMockNotification('order_placed');
    setNotifications([mockNotif, ...notifications]);
    alert('✅ Test notification sent!\n\n' + mockNotif.message);
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 p-4 pt-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">WhatsApp Notifications</h1>
              <p className="text-gray-600 dark:text-gray-400">Stay updated on orders & negotiations</p>
            </div>
          </div>
        </motion.div>

        {/* Phone Number Setup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">📱 Phone Number</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Your WhatsApp Number
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="10-digit Indian number: 9876543210"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all dark:bg-gray-700 dark:text-white ${
                    phone === ''
                      ? 'border-gray-200 dark:border-gray-600'
                      : isPhoneValid
                        ? 'border-green-500 dark:border-green-400'
                        : 'border-red-500 dark:border-red-400'
                  }`}
                />
                {phone && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isPhoneValid ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                💡 Enter 10-digit number or include +91 country code
              </p>
            </div>

            {isSaved && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-sm"
              >
                ✅ Phone saved: {formatPhoneNumber(phone)}
              </motion.div>
            )}

            <button
              onClick={handleSavePhone}
              disabled={!isPhoneValid}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💾 Save WhatsApp Number
            </button>
          </div>
        </motion.div>

        {/* Notification Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🔔 What You'll Receive</h2>

          <div className="space-y-3">
            {[
              { icon: '🎉', title: 'New Order Placed', desc: 'When a buyer orders your product' },
              { icon: '💰', title: 'Bargain Counter', desc: 'When Bargain Bot counters an offer' },
              { icon: '✅', title: 'Order Accepted', desc: 'When you accept a custom order' },
              { icon: '📦', title: 'Status Updates', desc: 'Preparing, shipped, in transit, delivered' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleTestNotification}
            className="w-full mt-6 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
          >
            🧪 Send Test Notification
          </button>
        </motion.div>

        {/* Notification History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              📨 Notification History {unreadCount > 0 && <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">{unreadCount}</span>}
            </h2>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {showHistory ? 'Hide' : 'Show'}
            </button>
          </div>

          {showHistory && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                  No notifications yet. Test message will appear here.
                </p>
              ) : (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all ${
                      notif.messageType === 'order_placed'
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                        : notif.messageType === 'bargain_counter'
                          ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                          : notif.messageType === 'order_accepted'
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                            : 'bg-gray-50 dark:bg-gray-700 border-gray-500'
                    }`}
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {notif.messageType.replace(/_/g, ' ').toUpperCase()}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(notif.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{notif.message}</p>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>

        {/* Setup Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">⚙️ Setup Guide</h3>
          <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
            <li>Enter your WhatsApp number above</li>
            <li>Save your number</li>
            <li>Test with button to verify it works</li>
            <li>You're all set! Orders will arrive instantly</li>
          </ol>
          {!isWhatsAppConfigured() && (
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-3 italic">
              💡 Setup: Twilio WhatsApp API will be configured by admin for production.
            </p>
          )}
        </motion.div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-full mt-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
