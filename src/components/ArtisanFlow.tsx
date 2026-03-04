import { lazy, Suspense, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useArtisanFlow } from '../hooks/useArtisanFlow';
import { LoadingState } from './LoadingState';
import { ProductStory } from './artisan/VoiceProductStory';
import { ConnectionStatus } from './ConnectionStatus';
import { toast } from 'sonner@2.0.3';

// Lazy load artisan components
const ArtisanDashboard = lazy(() => import('./artisan/ArtisanDashboard').then(m => ({ default: m.ArtisanDashboard })));
const AIStudio = lazy(() => import('./artisan/AIStudio').then(m => ({ default: m.AIStudio })));
const BargainBot = lazy(() => import('./artisan/BargainBot').then(m => ({ default: m.BargainBot })));
const MarketingReview = lazy(() => import('./artisan/MarketingReview').then(m => ({ default: m.MarketingReview })));
const MyShop = lazy(() => import('./artisan/MyShop').then(m => ({ default: m.MyShop })));
const ProtectedVault = lazy(() => import('./artisan/ProtectedVault').then(m => ({ default: m.ProtectedVault })));
const CustomOrders = lazy(() => import('./artisan/CustomOrders').then(m => ({ default: m.CustomOrders })));
const GovernmentSchemes = lazy(() => import('./artisan/GovernmentSchemes').then(m => ({ default: m.GovernmentSchemes })));
const WhatsAppNotifications = lazy(() => import('./artisan/WhatsAppNotifications').then(m => ({ default: m.WhatsAppNotifications })));
const SmartPricing = lazy(() => import('./artisan/SmartPricing').then(m => ({ default: m.SmartPricing })));
const ArtisanOnboarding = lazy(() => import('./artisan/ArtisanOnboarding').then(m => ({ default: m.ArtisanOnboarding })));
const NameConfirmation = lazy(() => import('./artisan/NameConfirmation').then(m => ({ default: m.NameConfirmation })));
const LanguageSelection = lazy(() => import('./artisan/LanguageSelection').then(m => ({ default: m.LanguageSelection })));
const VaniNavigationAssistant = lazy(() => import('./artisan/VaniNavigationAssistant').then(m => ({ default: m.VaniNavigationAssistant })));
const VoiceProductStory = lazy(() => import('./artisan/VoiceProductStory').then(m => ({ default: m.VoiceProductStory })));

export function ArtisanFlow() {
  const { user } = useAuth();
  const {
    currentView,
    showNameConfirmation,
    showLanguageSelection,
    showOnboarding,
    isPhoneSignup,
    navigateTo,
    navigateToDashboard,
    handleNameConfirmationComplete,
    handleLanguageSelectionComplete,
    handleOnboardingComplete,
  } = useArtisanFlow();
  
  const [showVoiceStory, setShowVoiceStory] = useState(false);

  // Handle voice story save to vault
  const handleSaveToVault = (story: ProductStory) => {
    // Save to vault localStorage
    const vaultItems = JSON.parse(localStorage.getItem('kalaikatha_vault_items') || '[]');
    const newItem = {
      id: story.id,
      type: 'voice-story',
      name: `Product Story - ${new Date().toLocaleDateString()}`,
      description: story.transcription.substring(0, 100) + '...',
      transcription: story.transcription,
      language: story.language,
      duration: story.duration,
      createdAt: story.recordedAt,
      isSecret: true,
    };
    vaultItems.push(newItem);
    localStorage.setItem('kalaikatha_vault_items', JSON.stringify(vaultItems));
    
    toast.success('Story saved to vault successfully!');
    setShowVoiceStory(false);
  };

  // Handle generate marketing from story
  const handleGenerateMarketing = (story: ProductStory) => {
    // Save story for marketing generation
    localStorage.setItem('kalaikatha_voice_story_for_marketing', JSON.stringify(story));
    
    setShowVoiceStory(false);
    navigateTo('marketing');
    
    toast.success('Generating marketing content from your story...');
  };

  // Listen for voiceStory view change
  if (currentView === 'voiceStory' && !showVoiceStory) {
    setShowVoiceStory(true);
  }
  
  // Listen for dashboard navigation from TopBar
  useEffect(() => {
    const handleDashboardNavigation = () => {
      console.log('🔵 ArtisanFlow: Received dashboard navigation event');
      navigateToDashboard();
    };
    
    window.addEventListener('navigate-to-dashboard', handleDashboardNavigation);
    
    return () => {
      window.removeEventListener('navigate-to-dashboard', handleDashboardNavigation);
    };
  }, [navigateToDashboard]);

  if (!user) return null;

  return (
    <div className="relative w-full min-h-[calc(100vh-4rem)] overflow-x-hidden">
      <ConnectionStatus />
      <Suspense fallback={<LoadingState minimal />}>
        {/* Step 1: Name Confirmation - Shows first if needed */}
        {showNameConfirmation && (
          <NameConfirmation 
            onComplete={handleNameConfirmationComplete}
            isPhoneSignup={isPhoneSignup}
          />
        )}

        {/* Step 2: Language Selection - Shows after name */}
        {showLanguageSelection && !showNameConfirmation && (
          <LanguageSelection 
            onComplete={handleLanguageSelectionComplete}
            artisanName={user.name || 'Friend'}
          />
        )}

        {/* Step 3: Onboarding - Shows after language */}
        {showOnboarding && !showNameConfirmation && !showLanguageSelection && (
          <ArtisanOnboarding 
            onComplete={handleOnboardingComplete}
            artisanName={user.name || 'Friend'}
            selectedLanguage={localStorage.getItem('artisan_language') || 'en'}
          />
        )}
        
        {currentView === 'dashboard' && <ArtisanDashboard onNavigate={navigateTo} />}
        {currentView === 'studio' && <AIStudio onBack={navigateToDashboard} onNavigate={navigateTo} />}
        {currentView === 'bargain' && <BargainBot onBack={navigateToDashboard} />}
        {currentView === 'marketing' && <MarketingReview onBack={navigateToDashboard} />}
        {currentView === 'shop' && <MyShop onBack={navigateToDashboard} onNavigate={navigateTo} />}
        {currentView === 'vault' && <ProtectedVault onBack={navigateToDashboard} />}
        {currentView === 'orders' && <CustomOrders onBack={navigateToDashboard} />}
        {currentView === 'schemes' && <GovernmentSchemes onBack={navigateToDashboard} />}
        {currentView === 'whatsapp' && <WhatsAppNotifications onBack={navigateToDashboard} />}
        {currentView === 'pricing' && <SmartPricing onBack={navigateToDashboard} />}
        
        {/* Global Vani Navigation Assistant - Shows on all views after onboarding */}
        {!showNameConfirmation && !showLanguageSelection && !showOnboarding && (
          <VaniNavigationAssistant 
            onNavigate={navigateTo} 
            currentView={currentView}
          />
        )}
        
        {/* Voice Product Story - Shows when needed */}
        {showVoiceStory && (
          <VoiceProductStory
            isOpen={showVoiceStory}
            onClose={() => {
              setShowVoiceStory(false);
              navigateToDashboard();
            }}
            onSaveToVault={handleSaveToVault}
            onGenerateMarketing={handleGenerateMarketing}
          />
        )}
      </Suspense>
    </div>
  );
}