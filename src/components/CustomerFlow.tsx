import { InteractiveMap } from './customer/InteractiveMap';
import { StateDrawer } from './customer/StateDrawer';
import { CraftDetails } from './customer/CraftDetails';
import { BuyerProfile } from './buyer/BuyerProfile';
import { CustomOrderForm } from './buyer/CustomOrderForm';
import { ConnectionStatus } from './ConnectionStatus';
import { User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCustomerFlow } from '../hooks/useCustomerFlow';

interface CustomerFlowProps {
  onLoginRequired: () => void;
}

export function CustomerFlow({ onLoginRequired }: CustomerFlowProps) {
  const { isAuthenticated, user } = useAuth();
  const {
    selectedState,
    selectedCraft,
    showProfile,
    showOrderForm,
    selectedArtisanId,
    setSelectedState,
    handleCraftSelect,
    handleCreateOrder,
    handleCustomOrder,
    handleOrderSubmit,
    closeState,
    closeCraft,
    closeProfile,
    openProfile,
    closeOrderForm,
  } = useCustomerFlow();
  
  const handleLoginRequired = () => {
    console.log('🟡 CustomerFlow: Login required - Forwarding to App');
    onLoginRequired();
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden">
      <ConnectionStatus />
      <InteractiveMap onStateSelect={setSelectedState} selectedState={selectedState} />
      
      <StateDrawer
        isOpen={!!selectedState && !selectedCraft}
        onClose={closeState}
        stateId={selectedState}
        onCraftSelect={handleCraftSelect}
      />

      <CraftDetails
        isOpen={!!selectedCraft}
        onClose={closeCraft}
        craft={selectedCraft}
        onMeetMakers={() => {}}
        onLoginRequired={handleLoginRequired}
        onCustomOrder={handleCustomOrder}
      />

      {/* Floating User Profile Button (only when logged in as buyer) */}
      {isAuthenticated && user?.type === 'buyer' && !showProfile && !selectedCraft && (
        <button
          onClick={openProfile}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all z-30"
        >
          <User className="w-6 h-6" />
        </button>
      )}

      <BuyerProfile
        isOpen={showProfile}
        onClose={closeProfile}
        onCreateOrder={handleCreateOrder}
      />

      <CustomOrderForm
        isOpen={showOrderForm}
        onClose={closeOrderForm}
        onSubmit={handleOrderSubmit}
        artisanId={selectedArtisanId}
        craftId={selectedCraft?.id}
      />
    </div>
  );
}