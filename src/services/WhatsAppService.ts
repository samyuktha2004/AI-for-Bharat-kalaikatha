/**
 * WhatsApp Notifications Service
 * Powered by Twilio WhatsApp API
 * 
 * Features:
 * - Order notifications to artisan & buyer
 * - Bargain bot negotiation updates
 * - Order status changes
 * - Fallback to mock messages for testing
 */

export interface WhatsAppNotification {
  id: string;
  timestamp: number;
  recipientPhone: string;
  recipientName: string;
  messageType: 'order_placed' | 'order_accepted' | 'order_rejected' | 'bargain_counter' | 'order_completed' | 'status_update';
  message: string;
  orderData?: any;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
}

const TWILIO_CONFIG = {
  accountSid: import.meta.env?.VITE_TWILIO_ACCOUNT_SID || '',
  authToken: import.meta.env?.VITE_TWILIO_AUTH_TOKEN || '',
  whatsappNumber: import.meta.env?.VITE_TWILIO_WHATSAPP_NUMBER || '', // e.g., +14155552671
  apiUrl: 'https://api.twilio.com/2010-04-01',
};

// AWS Amplify API Gateway endpoint for Lambda function
// Set via: VITE_AWS_AMPLIFY_API_URL environment variable
// Example: https://abc123.execute-api.ap-south-1.amazonaws.com/prod/send-whatsapp
const AWS_AMPLIFY_CONFIG = {
  apiUrl: import.meta.env?.VITE_AWS_AMPLIFY_API_URL || '',
};

export function isWhatsAppConfigured(): boolean {
  return !!(
    TWILIO_CONFIG.accountSid &&
    TWILIO_CONFIG.authToken &&
    TWILIO_CONFIG.whatsappNumber
  );
}

/**
 * Send WhatsApp notification via Twilio
 */
export async function sendWhatsAppNotification(
  recipientPhone: string,
  message: string,
  messageType: WhatsAppNotification['messageType'],
  orderData?: any
): Promise<WhatsAppNotification> {
  const notification: WhatsAppNotification = {
    id: `wa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    recipientPhone,
    recipientName: recipientPhone.replace('+91', ''),
    messageType,
    message,
    orderData,
    status: 'pending',
  };

  console.log('📱 Sending WhatsApp notification:', { recipientPhone, messageType });

  if (isWhatsAppConfigured()) {
    try {
      // Use AWS Amplify API Gateway endpoint (configured via environment variable)
      // Falls back to mock if endpoint not configured
      const apiUrl = AWS_AMPLIFY_CONFIG.apiUrl || '/.aws/functions/send-whatsapp';
      
      const response = await fetch(`${apiUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountSid: TWILIO_CONFIG.accountSid,
          authToken: TWILIO_CONFIG.authToken,
          from: TWILIO_CONFIG.whatsappNumber,
          to: `whatsapp:${recipientPhone}`,
          body: message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Twilio API error: ${response.status}`);
      }

      const result = await response.json();
      notification.status = 'sent';
      console.log('✅ WhatsApp sent successfully:', result.sid);
    } catch (error) {
      console.error('❌ WhatsApp send failed:', error);
      notification.status = 'failed';
      // Still save notification even if failed
    }
  } else {
    console.log('🔧 Twilio not configured, using mock notification');
    notification.status = 'sent';
  }

  // Save notification to history
  saveNotificationToHistory(notification);
  return notification;
}

/**
 * Format order placed notification
 */
export async function notifyOrderPlaced(
  artisanPhone: string,
  artisanName: string,
  buyerName: string,
  productName: string,
  price: number,
  orderId: string
): Promise<WhatsAppNotification> {
  const message = `🎉 New Order - ${productName}

From: ${buyerName}
Price: ₹${price}
Order ID: ${orderId}

Reply YES to accept or COUNTER with your price.
---
Kalaikatha Marketplace`;

  return sendWhatsAppNotification(
    artisanPhone,
    message,
    'order_placed',
    { artisanName, buyerName, productName, price, orderId }
  );
}

/**
 * Format bargain counter notification
 */
export async function notifyBargainCounter(
  buyerPhone: string,
  buyerName: string,
  artisanName: string,
  productName: string,
  originalOffer: number,
  counterOffer: number,
  orderId: string
): Promise<WhatsAppNotification> {
  const message = `💰 Counter Offer from ${artisanName}

Product: ${productName}
Your Offer: ₹${originalOffer}
Counter: ₹${counterOffer} ✓

Accept? Reply YES or make another offer.
Order ID: ${orderId}
---
Kalaikatha Marketplace`;

  return sendWhatsAppNotification(
    buyerPhone,
    message,
    'bargain_counter',
    { buyerName, artisanName, productName, originalOffer, counterOffer, orderId }
  );
}

/**
 * Format order accepted notification
 */
export async function notifyOrderAccepted(
  buyerPhone: string,
  buyerName: string,
  artisanName: string,
  productName: string,
  finalPrice: number,
  orderId: string,
  deliveryEstimate: string = 'Custom'
): Promise<WhatsAppNotification> {
  const message = `✅ Order Accepted!

Product: ${productName}
Artisan: ${artisanName}
Final Price: ₹${finalPrice}
Delivery: ${deliveryEstimate}
Order ID: ${orderId}

Artisan will contact you soon.
---
Kalaikatha Marketplace`;

  return sendWhatsAppNotification(
    buyerPhone,
    message,
    'order_accepted',
    { buyerName, artisanName, productName, finalPrice, orderId, deliveryEstimate }
  );
}

/**
 * Format order rejected notification
 */
export async function notifyOrderRejected(
  buyerPhone: string,
  buyerName: string,
  artisanName: string,
  productName: string,
  reason: string = 'Custom order not available',
  orderId: string
): Promise<WhatsAppNotification> {
  const message = `❌ Order Not Accepted

Artisan: ${artisanName}
Product: ${productName}
Reason: ${reason}
Order ID: ${orderId}

Browse other artisans or try another product.
---
Kalaikatha Marketplace`;

  return sendWhatsAppNotification(
    buyerPhone,
    message,
    'order_rejected',
    { buyerName, artisanName, productName, reason, orderId }
  );
}

/**
 * Format order completed notification
 */
export async function notifyOrderCompleted(
  recipientPhone: string,
  recipientName: string,
  productName: string,
  orderId: string
): Promise<WhatsAppNotification> {
  const message = `🎊 Order Complete!

Product: ${productName}
Order ID: ${orderId}

Thank you for your business! Please rate your experience.

⭐ Rate: kalaikatha.app/rate/${orderId}
---
Kalaikatha Marketplace`;

  return sendWhatsAppNotification(
    recipientPhone,
    message,
    'order_completed',
    { recipientName, productName, orderId }
  );
}

/**
 * Format status update notification
 */
export async function notifyStatusUpdate(
  recipientPhone: string,
  status: 'preparing' | 'shipped' | 'in_transit' | 'delivered',
  productName: string,
  orderId: string,
  trackingUrl?: string
): Promise<WhatsAppNotification> {
  const statusEmoji = {
    preparing: '🔨 Preparing',
    shipped: '📦 Shipped',
    in_transit: '🚚 In Transit',
    delivered: '📍 Delivered',
  };

  const message = `${statusEmoji[status]} - ${productName}

Order ID: ${orderId}
${trackingUrl ? `Track: ${trackingUrl}` : ''}

Thank you for your patience!
---
Kalaikatha Marketplace`;

  return sendWhatsAppNotification(
    recipientPhone,
    message,
    'status_update',
    { status, productName, orderId, trackingUrl }
  );
}

/**
 * Save notification to history (localStorage)
 */
function saveNotificationToHistory(notification: WhatsAppNotification): void {
  const key = 'whatsapp_notifications_history';
  const history = JSON.parse(localStorage.getItem(key) || '[]');
  history.push(notification);
  // Keep only last 100 notifications
  if (history.length > 100) {
    history.shift();
  }
  localStorage.setItem(key, JSON.stringify(history));
}

/**
 * Get notification history
 */
export function getNotificationHistory(limit: number = 20): WhatsAppNotification[] {
  const key = 'whatsapp_notifications_history';
  const history = JSON.parse(localStorage.getItem(key) || '[]');
  return history.slice(-limit).reverse();
}

/**
 * Get unread notification count
 */
export function getUnreadCount(): number {
  const key = 'whatsapp_notifications_read';
  const readIds = new Set(JSON.parse(localStorage.getItem(key) || '[]'));
  const key2 = 'whatsapp_notifications_history';
  const history: WhatsAppNotification[] = JSON.parse(localStorage.getItem(key2) || '[]');
  return history.filter((n) => !readIds.has(n.id)).length;
}

/**
 * Mark notification as read
 */
export function markAsRead(notificationId: string): void {
  const key = 'whatsapp_notifications_read';
  const readIds = new Set(JSON.parse(localStorage.getItem(key) || '[]'));
  readIds.add(notificationId);
  localStorage.setItem(key, JSON.stringify(Array.from(readIds)));
}

/**
 * Store user phone number
 */
export function saveUserPhone(userId: string, phone: string, name: string): void {
  const key = `user_phone_${userId}`;
  localStorage.setItem(key, JSON.stringify({ phone, name, savedAt: Date.now() }));
  console.log('📱 Phone number saved for user:', userId);
}

/**
 * Get user phone number
 */
export function getUserPhone(userId: string): { phone: string; name: string } | null {
  const key = `user_phone_${userId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

/**
 * Format Indian phone number to international format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // If already has country code
  if (cleaned.startsWith('91')) {
    return `+${cleaned}`;
  }

  // If 10 digits (no country code), add India's code
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }

  // If already has +, just return
  if (phone.startsWith('+')) {
    return phone;
  }

  // Default: assume India
  return `+91${cleaned}`;
}

/**
 * Validate Indian phone number
 */
export function isValidIndianPhone(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  // India country code is +91, followed by 10 digits
  const regex = /^\+91\d{10}$/;
  return regex.test(formatted);
}

/**
 * Mock notification for testing
 */
export function generateMockNotification(
  type: WhatsAppNotification['messageType']
): WhatsAppNotification {
  const templates = {
    order_placed: {
      message: '🎉 New Order - Hand-Chiselled Bronze Nataraja\nFrom: Ramesh Kumar\nPrice: ₹15,000\nOrder ID: ORD-2026-001',
      recipientPhone: '+919876543210',
      recipientName: 'Artisan Shop',
    },
    order_accepted: {
      message: '✅ Order Accepted!\nProduct: Bronze Nataraja\nArtisan: Master Craftsman\nFinal Price: ₹16,500',
      recipientPhone: '+919876543211',
      recipientName: 'Buyer Name',
    },
    bargain_counter: {
      message: '💰 Counter Offer from Artisan\nYour Offer: ₹14,000\nCounter: ₹15,500 ✓',
      recipientPhone: '+919876543211',
      recipientName: 'Buyer',
    },
    order_rejected: {
      message: '❌ Order Not Accepted\nProduct: Nataraja\nReason: Custom order too complex',
      recipientPhone: '+919876543211',
      recipientName: 'Buyer',
    },
    order_completed: {
      message: '🎊 Order Complete!\nProduct: Bronze Nataraja\nThank you for your business! ⭐',
      recipientPhone: '+919876543210',
      recipientName: 'Buyer',
    },
    status_update: {
      message: '📦 Shipped - Bronze Nataraja\nOrder ID: ORD-2026-001\nTrack your package',
      recipientPhone: '+919876543211',
      recipientName: 'Buyer',
    },
  };

  const template = templates[type];
  return {
    id: `mock_${Date.now()}`,
    timestamp: Date.now(),
    recipientPhone: template.recipientPhone,
    recipientName: template.recipientName,
    messageType: type,
    message: template.message,
    status: 'sent',
  };
}

export default {
  sendWhatsAppNotification,
  notifyOrderPlaced,
  notifyBargainCounter,
  notifyOrderAccepted,
  notifyOrderRejected,
  notifyOrderCompleted,
  notifyStatusUpdate,
  getNotificationHistory,
  getUnreadCount,
  markAsRead,
  saveUserPhone,
  getUserPhone,
  formatPhoneNumber,
  isValidIndianPhone,
  generateMockNotification,
  isWhatsAppConfigured,
};
