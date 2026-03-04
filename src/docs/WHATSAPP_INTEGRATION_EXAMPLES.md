/**
 * EXAMPLE: How to Integrate WhatsApp in CustomOrders Component
 * 
 * This file shows exactly where to add WhatsApp notifications
 * in your existing order management flow.
 * 
 * Copy these patterns into CustomOrders.tsx
 */

// ====== AT THE TOP OF FILE ======
import {
  notifyOrderPlaced,
  notifyOrderAccepted,
  notifyOrderRejected,
  notifyBargainCounter,
  notifyStatusUpdate,
  getUserPhone,
} from '@/services/WhatsAppService';

// ====== EXAMPLE 1: When Buyer Places Order ======
// Location: In the function that handles order submission

async function handlePlaceOrder(orderData: any) {
  try {
    // ... existing order creation logic ...
    
    const orderId = generateOrderId();
    
    // Save order to database/localStorage
    savedOrder = { ...orderData, id: orderId, status: 'pending' };
    
    // ✅ NEW: Send WhatsApp to artisan
    try {
      await notifyOrderPlaced(
        artisan.phone,           // +919876543210
        artisan.name,           // "Master Craftsman"
        buyer.name,             // "Ramesh Kumar"
        orderData.productName,  // "Bronze Nataraja"
        orderData.budget,       // 15000 (in rupees)
        orderId                 // "ORD-2026-001"
      );
      console.log('✅ WhatsApp notification sent to artisan');
    } catch (error) {
      console.warn('WhatsApp notification failed (non-critical):', error);
      // Don't block order creation if WhatsApp fails
    }
    
    // Show success to buyer
    toast.success('🎉 Order placed! Artisan will contact you on WhatsApp.');
  } catch (error) {
    toast.error('Failed to place order');
  }
}

// ====== EXAMPLE 2: When Artisan Accepts Order ======
// Location: In the accept order handler

async function handleAcceptOrder(orderId: string) {
  try {
    // ... existing acceptance logic ...
    
    const order = getOrder(orderId);
    const buyer = getBuyer(order.buyerId);
    
    // Update order status
    updateOrder(orderId, { status: 'accepted' });
    
    // ✅ NEW: Notify buyer via WhatsApp
    try {
      await notifyOrderAccepted(
        buyer.phone,           // +919876543211
        buyer.name,           // "Ramesh Kumar"
        artisan.name,         // "Master Craftsman"
        order.productName,    // "Bronze Nataraja"
        order.finalPrice,     // 16500 (after negotiation)
        orderId,
        '30 days'             // Delivery estimate
      );
      console.log('✅ Acceptance notification sent to buyer');
    } catch (error) {
      console.warn('WhatsApp failed:', error);
    }
    
    toast.success('✅ Order accepted! Buyer notified on WhatsApp.');
  } catch (error) {
    toast.error('Failed to accept order');
  }
}

// ====== EXAMPLE 3: When Artisan Rejects Order ======
// Location: In the reject order handler

async function handleRejectOrder(orderId: string, reason: string) {
  try {
    const order = getOrder(orderId);
    const buyer = getBuyer(order.buyerId);
    
    // Update order status
    updateOrder(orderId, { status: 'rejected', reason });
    
    // ✅ NEW: Notify buyer about rejection
    try {
      await notifyOrderRejected(
        buyer.phone,
        buyer.name,
        artisan.name,
        order.productName,
        reason || 'Custom order not available',
        orderId
      );
    } catch (error) {
      console.warn('WhatsApp failed:', error);
    }
    
    toast.info('📌 Order rejected. Buyer notified.');
  } catch (error) {
    toast.error('Failed to reject order');
  }
}

// ====== EXAMPLE 4: Bargain Bot Integration ======
// Location: In BargainBot.tsx when counter-offer is generated

async function handleBargainBotCounter(
  result: NegotiationResult,
  order: any,
  buyer: any
) {
  // Show UI feedback
  setCounterOffer(result.counterOffer);
  
  // ✅ NEW: Notify buyer about counter-offer
  if (result.action === 'counter' && result.counterOffer) {
    try {
      await notifyBargainCounter(
        buyer.phone,           // Buyer's WhatsApp
        buyer.name,
        artisan.name,
        order.productName,
        order.buyerOffer,      // Their original offer
        result.counterOffer,   // Our counter
        order.id
      );
      toast.success('💰 Counter-offer sent to buyer on WhatsApp!');
    } catch (error) {
      console.warn('WhatsApp failed:', error);
      toast.info('Counter-offer ready (WhatsApp notification failed)');
    }
  }
}

// ====== EXAMPLE 5: Status Update Notifications ======
// Location: When processing order progress

async function handleOrderStatusChange(
  orderId: string,
  newStatus: 'preparing' | 'shipped' | 'in_transit' | 'delivered'
) {
  const order = getOrder(orderId);
  const buyer = getBuyer(order.buyerId);
  
  // Update database
  updateOrder(orderId, { status: newStatus });
  
  // ✅ NEW: Notify buyer of status change
  try {
    await notifyStatusUpdate(
      buyer.phone,
      newStatus,
      order.productName,
      orderId,
      `https://track.kalaikatha.app/order/${orderId}` // Optional tracking URL
    );
    
    const statuses = {
      'preparing': '🔨 Order is being prepared',
      'shipped': '📦 Order has shipped',
      'in_transit': '🚚 Order is on the way',
      'delivered': '📍 Order delivered!',
    };
    
    toast.success(`✅ ${statuses[newStatus]} Buyer notified on WhatsApp.`);
  } catch (error) {
    console.warn('Status update notification failed:', error);
  }
}

// ====== EXAMPLE 6: Phone Number Setup in Onboarding ======
// Location: In ArtisanOnboarding.tsx

import { saveUserPhone, formatPhoneNumber, isValidIndianPhone } from '@/services/WhatsAppService';

function PhoneNumberStep() {
  const [phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(false);
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    setIsValid(isValidIndianPhone(value));
  };
  
  const handleNext = () => {
    if (!isValid) {
      alert('Please enter a valid 10-digit Indian phone number');
      return;
    }
    
    // ✅ NEW: Save phone for WhatsApp notifications
    const formatted = formatPhoneNumber(phone);
    saveUserPhone(currentUserId, formatted, artisanName);
    
    // Move to next onboarding step
    proceedToNextStep();
  };
  
  return (
    <div>
      <h2>📱 WhatsApp for Order Notifications</h2>
      <input
        type="tel"
        value={phone}
        onChange={handlePhoneChange}
        placeholder="Enter your 10-digit WhatsApp number"
      />
      {isValid && <p>✅ Valid number</p>}
      <button onClick={handleNext}>Next Step →</button>
    </div>
  );
}

// ====== EXAMPLE 7: WhatsApp Settings Page ======
// Location: Add to ArtisanDashboard navigation

import { WhatsAppSettings } from '@/components/common/WhatsAppSettings';

function ArtisanDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  
  // ... existing code ...
  
  return (
    <div>
      {activeView === 'whatsapp' && (
        <WhatsAppSettings
          userId={currentUserId}
          userName={artisanName}
          onClose={() => setActiveView('dashboard')}
        />
      )}
      
      {/* Navigation button */}
      <button onClick={() => setActiveView('whatsapp')}>
        📱 WhatsApp Settings
      </button>
    </div>
  );
}

// ====== QUICK REFERENCE ======
/*
WHEN SOMETHING HAPPENS          WHAT TO CALL
─────────────────────────────────────────────────────────
Buyer places order           → notifyOrderPlaced()
Artisan accepts order        → notifyOrderAccepted()
Artisan rejects order        → notifyOrderRejected()
Bargain Bot counters         → notifyBargainCounter()
Order status changes         → notifyStatusUpdate()
                             → ('preparing', 'shipped', 
                             →  'in_transit', 'delivered')
Need user's phone            → getUserPhone(userId)
Format phone properly        → formatPhoneNumber(phone)
Validate phone number        → isValidIndianPhone(phone)
Save user's phone           → saveUserPhone(userId, phone, name)

All functions return Promise, so use await or .then()
*/

// ====== COMMON PATTERNS ======

// Pattern 1: Try-catch with toast
try {
  await notifyOrderPlaced(...);
  toast.success('✅ Order placed! Artisan notified.');
} catch (error) {
  console.warn('WhatsApp failed (non-blocking):', error);
  toast.info('Order placed (WhatsApp sending...)');
}

// Pattern 2: Fire and forget (don't wait for WhatsApp)
notifyOrderPlaced(...).catch(err => console.warn('WhatsApp:', err));

// Pattern 3: Conditional notification
if (order.urgencyLevel > 5) {
  await notifyOrderPlaced(...); // Only for urgent orders
}

// Pattern 4: Check if phone exists before sending
const buyerPhone = getUserPhone(buyerId);
if (buyerPhone) {
  await notifyOrderAccepted(buyerPhone.phone, ...);
} else {
  console.log('Buyer has not set up WhatsApp');
}
