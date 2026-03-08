import { Mic, Upload, Image, Video, TrendingUp, Eye, ShoppingBag, Settings, Camera, MessageSquare, Lock, Store, Globe, Award, MessageCircle, IndianRupee, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SettingsModal } from './SettingsModal';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../contexts/AuthContext';

interface ArtisanDashboardProps {
  onNavigate: (view: 'dashboard' | 'studio' | 'bargain' | 'marketing' | 'shop' | 'vault' | 'orders' | 'schemes' | 'whatsapp' | 'pricing' | 'voiceStory') => void;
}

export function ArtisanDashboard({ onNavigate }: ArtisanDashboardProps) {
  const { t, td } = useTranslation();
  const { user } = useAuth();
  const [showDetailedText, setShowDetailedText] = useState(
    localStorage.getItem('artisan_detailed_text') === 'true'
  );
  const [showSettings, setShowSettings] = useState(false);

  const toggleDetailedText = () => {
    const newValue = !showDetailedText;
    setShowDetailedText(newValue);
    localStorage.setItem('artisan_detailed_text', String(newValue));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 pb-20 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Top Bar - Settings */}
        <div className="fixed top-20 right-4 z-50 flex gap-2">
          {/* Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 md:p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all"
            title={t('settings.title')}
          >
            <Settings className={`w-4 h-4 md:w-5 md:h-5 text-gray-700 dark:text-gray-300 ${showDetailedText ? 'rotate-180' : ''} transition-transform duration-300`} />
          </button>
        </div>

        {/* Header - no animation */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 dark:text-gray-100 mb-2">{td('Welcome,Master artisan', { name: user?.name || 'Master Artisan' })}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('')}</p>
        </div>

        {/* Active Negotiations Alert - simplified */}
        <button
          onClick={() => onNavigate('orders')}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-6 mb-6 shadow-xl hover:shadow-2xl transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 relative">
              <MessageSquare className="w-8 h-8" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">
                2
              </div>
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-lg mb-1">{t('Custom Orders')}</h3>
              <p className="text-white/90 text-sm">2 {t('Custom Orders Request').toLowerCase()} {t('waiting for response ').toLowerCase()}</p>
            </div>
          </div>
        </button>

        {/* Vani AI Center - Voice First - REMOVED for performance */}
        {/* Vani is now in the floating button bottom-right - less resource intensive */}
        <div className="text-center mb-8 py-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            💬 {t('Tap mic button (bottom right) for voice navigation')}
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 mb-6 shadow-xl">
          <h3 className="text-lg text-gray-900 dark:text-gray-100 mb-4">{t('Upload Your Work')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onNavigate('studio')}
              className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
                <Image className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 text-center">Photos</span>
            </button>

            <button className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl hover:shadow-lg transition-all"
              onClick={() => {
                toast.info('Video Upload coming soon! Record process videos with AI captions in multiple languages.');
              }}
            >
              <div className="w-16 h-16 rounded-full bg-purple-500 flex items-center justify-center">
                <Video className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 text-center">Videos</span>
            </button>

            <button 
              onClick={() => onNavigate('voiceStory')}
              className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl hover:shadow-lg transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 text-center">Voice Story</span>
            </button>

            <button className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl hover:shadow-lg transition-all"
              onClick={() => {
                toast.info('Bulk Upload coming soon! Upload up to 10 photos at once with AI batch analysis.');
              }}
            >
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 text-center">Documents</span>
            </button>
          </div>
          {showDetailedText && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
              🔒 Trade secrets are automatically detected and protected in your vault
            </p>
          )}
        </div>

        {/* Quick Access Grid - no animation */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onNavigate('shop')}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all group"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Store className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h4 className="text-gray-900 dark:text-gray-100 mb-1">My Shop</h4>
                {showDetailedText && <p className="text-sm text-gray-500 dark:text-gray-400">View listings</p>}
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('vault')}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all group"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h4 className="text-gray-900 dark:text-gray-100 mb-1">Protected Vault</h4>
                {showDetailedText && <p className="text-sm text-gray-500 dark:text-gray-400">Trade secrets</p>}
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('studio')}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all group"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h4 className="text-gray-900 dark:text-gray-100 mb-1">AI Studio</h4>
                {showDetailedText && <p className="text-sm text-gray-500 dark:text-gray-400">Enhance photos</p>}
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('bargain')}
            className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all group"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div className="text-center">
                <h4 className="text-gray-900 dark:text-gray-100 mb-1">Bargain Bot</h4>
                {showDetailedText && <p className="text-sm text-gray-500 dark:text-gray-400">Set prices</p>}
              </div>
            </div>
          </button>
        </div>

        {/* Marketplace Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="text-lg text-gray-900 dark:text-gray-100">Your Performance</h3>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-indigo-100 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-indigo-600" />
              </div>
              <p className="text-4xl text-gray-900 dark:text-gray-100 mb-1">₹45K</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sales (This Month)</p>
              <p className="text-sm text-green-600 mt-1">↑ 23%</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-4xl text-gray-900 dark:text-gray-100 mb-1">1.2K</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Profile Views</p>
              <p className="text-sm text-green-600 mt-1">↑ 15%</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('marketing')}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Review Marketing Content</span>
          </button>
        </div>

        {/* Government Schemes - NEW FEATURE */}
        <button
          onClick={() => onNavigate('schemes')}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-3xl p-6 mb-6 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden"
        >
          {/* New Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-400 text-green-900 rounded-full text-xs font-bold">
            NEW ✨
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div className="flex-1 text-left pr-20">
              <h3 className="text-lg mb-1 font-medium">Government Schemes & Subsidies</h3>
              <p className="text-white/90 text-sm">
                🎯 3 AI-matched schemes available for bronze artisans in Thanjavur
              </p>
            </div>
          </div>
        </button>

        {/* Smart Pricing - AI PRICING CALCULATOR */}
        <button
          onClick={() => onNavigate('pricing')}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-3xl p-6 mb-6 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden"
        >
          {/* AI Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-amber-400 text-purple-900 rounded-full text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI POWERED
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <IndianRupee className="w-8 h-8" />
            </div>
            <div className="flex-1 text-left pr-24">
              <h3 className="text-lg mb-1 font-medium">Smart Pricing Calculator</h3>
              <p className="text-white/90 text-sm">
                💡 AI prevents exploitation with fair price recommendations
              </p>
            </div>
          </div>
        </button>

        {/* WhatsApp Notifications - DEMO FEATURE */}
        <button
          onClick={() => onNavigate('whatsapp')}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-3xl p-6 mb-6 shadow-xl hover:shadow-2xl transition-all relative overflow-hidden"
        >
          {/* Demo Badge */}
          <div className="absolute top-4 right-4 px-3 py-1 bg-blue-400 text-blue-900 rounded-full text-xs font-bold">
            DEMO 🎬
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-8 h-8" />
            </div>
            <div className="flex-1 text-left pr-20">
              <h3 className="text-lg mb-1 font-medium">WhatsApp Notifications</h3>
              <p className="text-white/90 text-sm">
                📱 Get instant alerts for orders, views & schemes on WhatsApp
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onToggleDetailedText={toggleDetailedText}
        showDetailedText={showDetailedText}
      />
    </div>
  );
}