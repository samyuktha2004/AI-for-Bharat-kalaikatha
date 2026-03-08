import { motion } from 'motion/react';
import { ArrowLeft, Bell, Check, MessageCircle, Package, Eye, Gift, DollarSign, Phone, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { toast } from 'sonner';

interface WhatsAppNotificationsProps {
  onBack: () => void;
}

export function WhatsAppNotifications({ onBack }: WhatsAppNotificationsProps) {
  const { t, lang } = useTranslation();
  
  // Notification toggles (demo only, no backend)
  const [enabled, setEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    newOrders: true,
    productViews: true,
    schemeAlerts: true,
    payments: true,
  });
  const [showDetailedText] = useState(
    localStorage.getItem('artisan_detailed_text') === 'true'
  );

  const handleEnableWhatsApp = () => {
    setEnabled(!enabled);
    if (!enabled) {
      toast.success(t('whatsapp.status.connected') || 'WhatsApp notifications enabled!');
    } else {
      toast.info('WhatsApp notifications disabled');
    }
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(`${key} ${!notifications[key] ? 'enabled' : 'disabled'}`);
  };

  // WhatsApp message mockups (language-aware)
  const getExampleMessages = () => {
    if (lang === 'ta') {
      return [
        {
          icon: Package,
          title: 'புதிய ஆர்டர்',
          message: '🎉 புதிய ஆர்டர்!\n\nமும்பையிலிருந்து வெண்கல நடராஜருக்கு\nவிலை: ₹5,000\n\n📱 விவரங்களைப் பார்க்க',
          time: '2 mins ago',
        },
        {
          icon: Eye,
          title: 'தயாரிப்பு பார்வைகள்',
          message: '👀 உங்கள் தீபம் செட்டுக்கு இன்று 5 புதிய பார்வைகள் கிடைத்தன!\n\nபார்வைகள்: 47 இந்த வாரம்\n\n📊 Analytics பார்க்க',
          time: '1 hour ago',
        },
        {
          icon: Gift,
          title: 'திட்ட எச்சரிக்கை',
          message: '🎁 புதிய திட்டம் கிடைக்கிறது!\n\nODOP ஏற்றுமதி மானியம்\nஉங்களுக்கு: ₹50,000 - ₹2,00,000\n\n✅ இப்போதே விண்ணப்பிக்கவும்',
          time: '3 hours ago',
        },
      ];
    } else if (lang === 'hi') {
      return [
        {
          icon: Package,
          title: 'नया ऑर्डर',
          message: '🎉 नया ऑर्डर!\n\nमुंबई से कांस्य नटराज के लिए\nमूल्य: ₹5,000\n\n📱 विवरण देखें',
          time: '2 mins ago',
        },
        {
          icon: Eye,
          title: 'उत्पाद देखे गए',
          message: '👀 आपके दीपक सेट को आज 5 नए व्यूज मिले!\n\nव्यूज: 47 इस सप्ताह\n\n📊 Analytics देखें',
          time: '1 hour ago',
        },
        {
          icon: Gift,
          title: 'योजना अलर्ट',
          message: '🎁 नई योजना उपलब्ध है!\n\nODOP निर्यात सब्सिडी\nआपके लिए: ₹50,000 - ₹2,00,000\n\n✅ अभी आवेदन करें',
          time: '3 hours ago',
        },
      ];
    } else {
      return [
        {
          icon: Package,
          title: 'New Order',
          message: '🎉 New Order!\n\nBronze Nataraja from Mumbai\nPrice: ₹5,000\n\n📱 View Details',
          time: '2 mins ago',
        },
        {
          icon: Eye,
          title: 'Product Views',
          message: '👀 Your Diya set got 5 new views today!\n\nViews: 47 this week\n\n📊 View Analytics',
          time: '1 hour ago',
        },
        {
          icon: Gift,
          title: 'Scheme Alert',
          message: '🎁 New scheme available!\n\nODOP Export Subsidy\nFor you: ₹50,000 - ₹2,00,000\n\n✅ Apply Now',
          time: '3 hours ago',
        },
      ];
    }
  };

  const exampleMessages = getExampleMessages();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 pt-20 pb-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <button
            onClick={onBack}
            className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl text-gray-900 dark:text-white">
                WhatsApp Alerts
              </h1>
            </div>
            {showDetailedText && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Get instant updates on your phone
              </p>
            )}
          </div>
        </motion.div>

        {/* Main Enable/Disable Button - Hero CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <button
            onClick={handleEnableWhatsApp}
            className={`w-full p-6 rounded-3xl shadow-xl transition-all duration-300 ${
              enabled
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  enabled ? 'bg-white/20' : 'bg-green-100 dark:bg-green-900'
                }`}>
                  {enabled ? (
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  ) : (
                    <Phone className="w-8 h-8 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <div className="text-left">
                  <p className={`text-xl font-medium ${enabled ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {enabled ? '✅ Connected' : 'Enable WhatsApp'}
                  </p>
                  {showDetailedText && (
                    <p className={`text-sm mt-1 ${enabled ? 'text-green-100' : 'text-gray-600 dark:text-gray-400'}`}>
                      {enabled ? 'You\'ll receive notifications' : 'Tap to get started'}
                    </p>
                  )}
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                enabled ? 'border-white bg-white' : 'border-gray-300 dark:border-gray-600'
              }`}>
                {enabled && <div className="w-3 h-3 rounded-full bg-green-600" />}
              </div>
            </div>
          </button>
        </motion.div>

        {/* Notification Types - Simplified */}
        {enabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="text-lg text-gray-900 dark:text-white mb-4 px-2">
              {showDetailedText ? 'Choose What to Receive' : 'Notifications'}
            </h2>
            
            <div className="space-y-3">
              {/* New Orders */}
              <button
                onClick={() => toggleNotification('newOrders')}
                className={`w-full p-5 rounded-2xl transition-all ${
                  notifications.newOrders
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-200 dark:border-indigo-700'
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    notifications.newOrders ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <Package className={`w-6 h-6 ${notifications.newOrders ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 dark:text-white">
                      New Orders
                    </p>
                    {showDetailedText && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        When customers buy your products
                      </p>
                    )}
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    notifications.newOrders ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {notifications.newOrders && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </button>

              {/* Product Views */}
              <button
                onClick={() => toggleNotification('productViews')}
                className={`w-full p-5 rounded-2xl transition-all ${
                  notifications.productViews
                    ? 'bg-purple-50 dark:bg-purple-900/30 border-2 border-purple-200 dark:border-purple-700'
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    notifications.productViews ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <Eye className={`w-6 h-6 ${notifications.productViews ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Product Views
                    </p>
                    {showDetailedText && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        Daily summary of who viewed your items
                      </p>
                    )}
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    notifications.productViews ? 'border-purple-600 bg-purple-600' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {notifications.productViews && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </button>

              {/* Scheme Alerts */}
              <button
                onClick={() => toggleNotification('schemeAlerts')}
                className={`w-full p-5 rounded-2xl transition-all ${
                  notifications.schemeAlerts
                    ? 'bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-200 dark:border-amber-700'
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    notifications.schemeAlerts ? 'bg-amber-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <Gift className={`w-6 h-6 ${notifications.schemeAlerts ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Government Schemes
                    </p>
                    {showDetailedText && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        New subsidies & grants for artisans
                      </p>
                    )}
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    notifications.schemeAlerts ? 'border-amber-600 bg-amber-600' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {notifications.schemeAlerts && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </button>

              {/* Payments */}
              <button
                onClick={() => toggleNotification('payments')}
                className={`w-full p-5 rounded-2xl transition-all ${
                  notifications.payments
                    ? 'bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700'
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    notifications.payments ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    <DollarSign className={`w-6 h-6 ${notifications.payments ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 dark:text-white">
                      Payment Updates
                    </p>
                    {showDetailedText && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                        When money arrives in your account
                      </p>
                    )}
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    notifications.payments ? 'border-green-600 bg-green-600' : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {notifications.payments && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* Example Messages - Cleaner Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-lg text-gray-900 dark:text-white mb-4 px-2">
            {showDetailedText ? 'How Messages Look' : 'Preview'}
          </h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg">
            <div className="space-y-4">
              {exampleMessages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-[#DCF8C6] dark:bg-green-900/40 rounded-2xl rounded-tl-sm p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-600 rounded-full">
                      <msg.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        Kalaikatha
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {msg.time}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed">
                    {msg.message}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Benefits - Compact */}
        {showDetailedText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-3xl p-6">
              <h3 className="text-lg text-gray-900 dark:text-white mb-4">Why WhatsApp?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Instant alerts - never miss an order
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    No app needed - works on any phone
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center flex-shrink-0">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Free forever - no charges ever
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}