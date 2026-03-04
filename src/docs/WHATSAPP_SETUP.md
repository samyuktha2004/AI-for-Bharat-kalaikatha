# WhatsApp Integration Setup Guide

## 📱 Overview

Kalaikatha sends **instant WhatsApp notifications** for:
- ✅ New orders placed
- ✅ Bargain Bot counter-offers  
- ✅ Order acceptance/rejection
- ✅ Order status updates (shipped, delivered, etc.)
- ✅ Custom notifications

**Architecture:**
```
App Frontend (WhatsAppService.ts)
         ↓
AWS Amplify Lambda Function
         ↓
Twilio WhatsApp API
         ↓
Artisan's WhatsApp
```

---

## 🚀 Setup Instructions

### Step 1: Get Twilio Account (FREE)

1. **Sign up** at https://www.twilio.com/
2. **Get free trial credits** ($15 USD)
3. Go to **Console** → **Messaging** → **Try it out**
4. Select **WhatsApp**
5. **Get your WhatsApp Number** (e.g., `+14155552671`)

### Step 2: Get Credentials

1. In Twilio Console, go to **Account**
2. Copy:
   - **Account SID** (starts with AC...)
   - **Auth Token** (hidden, click eye to reveal)
   - **Your WhatsApp Number** (from step 1)

### Step 3: Add to `.env.local`

```env
VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TWILIO_AUTH_TOKEN=your-auth-token-here
VITE_TWILIO_WHATSAPP_NUMBER=+14155552671
```

### Step 4: Deploy AWS Amplify Function

Create an AWS Lambda function in your Amplify backend:

1. **Create Lambda function** in AWS Amplify with:
   - Node.js 18+ runtime
   - Environment variables: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER
   - Function code: See [send-whatsapp-lambda.js](./AMPLIFY_LAMBDA_FUNCTION.md)

2. **Create API Gateway endpoint** pointing to Lambda:
   - Triggers: POST /send-whatsapp
   - Returns: JSON response with `sid` field

3. **Add to `.env.local`:**
   ```env
   VITE_AWS_AMPLIFY_API_URL=https://your-api-id.execute-api.ap-south-1.amazonaws.com/prod/send-whatsapp
   ```

4. **Deploy** and test ✅

---

## 🎯 Usage in App

### 1. **User Sets Phone Number**

```typescript
import { saveUserPhone } from '@/services/WhatsAppService';

// When user enters phone during onboarding
saveUserPhone(userId, '+919876543210', 'Artisan Name');
```

### 2. **Send Order Notification**

```typescript
import { notifyOrderPlaced } from '@/services/WhatsAppService';

// When buyer places order
await notifyOrderPlaced(
  artisanPhone,      // +919876543210
  artisanName,       // Name
  buyerName,         // Buyer's name
  productName,       // What they want
  price,             // ₹15,000
  orderId            // ORD-2026-001
);
```

### 3. **Bargain Bot Sends Counter**

```typescript
import { notifyBargainCounter } from '@/services/WhatsAppService';

// When bot counters an offer
await notifyBargainCounter(
  buyerPhone,
  buyerName,
  artisanName,
  productName,
  originalOffer,     // ₹14,000
  counterOffer,      // ₹15,500
  orderId
);
```

### 4. **Notify Order Acceptance**

```typescript
import { notifyOrderAccepted } from '@/services/WhatsAppService';

await notifyOrderAccepted(
  buyerPhone,
  buyerName,
  artisanName,
  productName,
  finalPrice,
  orderId,
  'Custom - 30 days' // Delivery estimate
);
```

### 5. **Send Status Updates**

```typescript
import { notifyStatusUpdate } from '@/services/WhatsAppService';

// When order progresses
await notifyStatusUpdate(
  buyerPhone,
  'shipped',         // 'preparing' | 'shipped' | 'in_transit' | 'delivered'
  productName,
  orderId,
  'https://track.example.com/ORD-123' // Optional tracking URL
);
```

---

## 🔧 Integration Points

### In CustomOrders.tsx

```typescript
// When order is accepted
if (action === 'accept') {
  // ... existing code ...
  
  // NEW: Send WhatsApp notification
  await notifyOrderAccepted(
    order.buyerPhone,
    order.buyerName,
    artisan.name,
    order.productName,
    order.finalPrice,
    order.id
  );
}
```

### In BargainBot.tsx

```typescript
// When counter-offer generated
if (result.action === 'counter' && result.counterOffer) {
  // Send WhatsApp to buyer
  await notifyBargainCounter(
    buyerPhone,
    buyerName,
    artisanName,
    productName,
    buyerOffer,
    result.counterOffer,
    orderId
  );
}
```

### In ArtisanOnboarding

```typescript
// When artisan first sets up account
<input
  type="tel"
  placeholder="Enter WhatsApp number"
  onChange={(e) => {
    const phone = formatPhoneNumber(e.target.value);
    if (isValidIndianPhone(phone)) {
      saveUserPhone(userId, phone, artisanName);
    }
  }}
/>
```

---

## 📊 Notification Types

| Type | When | To | Message |
|------|------|----|---------| 
| `order_placed` | Buyer creates order | Artisan | New order details + price |
| `bargain_counter` | Bot counters offer | Buyer | "Your offer: ₹14k, Counter: ₹15.5k ✓" |
| `order_accepted` | Artisan accepts | Buyer | "Order confirmed! Artisan will contact you." |
| `order_rejected` | Artisan rejects | Buyer | "Sorry, order not available." |
| `order_completed` | Order finished | Both | "Thank you! Please rate your experience." |
| `status_update` | Order progresses | Buyer | "📦 Shipped" / "🚚 In Transit" / "📍 Delivered" |

---

## ✅ Testing

### Local Testing (Without Twilio)

```typescript
import { generateMockNotification } from '@/services/WhatsAppService';

// Generate mock notification
const mock = generateMockNotification('order_placed');
console.log(mock.message);

// Shows realistic preview without sending real WhatsApp
```

### Real Testing (With Twilio)

1. Set up `.env.local` with credentials
2. Deploy function to AWS Amplify
3. Call notification function in your code
4. Message arrives instantly in WhatsApp! 📱

---

## 🛡️ Features

### ✅ Phone Number Validation
- Accepts 10-digit Indian numbers
- Converts to international format (+91)
- Validates before saving

### ✅ Notification History
- Saves all sent notifications locally
- Shows last 20 notifications
- Tracks read/unread status

### ✅ Graceful Fallback
- If Twilio down → Mock messages shown
- If credentials missing → App still works
- No error crashes

### ✅ Message Templates
- Pre-formatted for WhatsApp display
- Emojis for quick scanning
- Order details included
- Action buttons ready

---

## 🔐 Security

- **No passwords stored** in frontend
- **Phone numbers encrypted** in localStorage
- **API credentials** only on backend
- **Twilio handles** actual messaging
- **HTTPS only** transmission

---

## 💰 Costs (Free Tier)

| Item | Free Tier |
|------|-----------|
| Trial Credit | $15 USD |
| Messages/month | ~500-1000 |
| After trial | $0.01 per message |

**Estimate:** 100 orders/month × $0.01 = $1/month after trial ✅

---

## 🚨 Troubleshooting

### "Message not sent"
- ✅ Check `.env.local` has correct credentials
- ✅ Verify phone number is valid Indian number
- ✅ Ensure AWS Lambda function is deployed

### "Invalid phone number"
- ✅ Enter 10-digit number: `9876543210`
- ✅ Or with country code: `+919876543210`

### "Mock notifications appear"
- ✅ This is OK! Means Twilio not configured
- ✅ Real notifications work when deployed

### "Errors in console"
- ✅ Check browser DevTools → Console tab
- ✅ Look for fetch errors to your AWS API Gateway endpoint
- ✅ Check VITE_AWS_AMPLIFY_API_URL is set correctly
- ✅ Verify CORS not blocking request

---

## 📚 API Reference

### WhatsAppService.ts

```typescript
// Send notification
await sendWhatsAppNotification(
  recipientPhone: string,
  message: string,
  messageType: 'order_placed' | 'bargain_counter' | ...,
  orderData?: any
): Promise<WhatsAppNotification>

// Save phone
saveUserPhone(userId: string, phone: string, name: string): void

// Get phone
getUserPhone(userId: string): { phone; name } | null

// Format phone
formatPhoneNumber(phone: string): string // → '+91987654...'

// Validate phone
isValidIndianPhone(phone: string): boolean

// Get history
getNotificationHistory(limit?: number): WhatsAppNotification[]

// Get unread count
getUnreadCount(): number

// Mark as read
markAsRead(notificationId: string): void
```

---

## 🎯 Next Steps

1. **Get Twilio** account (takes 2 min)
2. **Add `.env.local`** credentials
3. **Test** with mock notifications first
4. **Deploy** to AWS Amplify
5. **Watch** real WhatsApp messages flow! 📱

---

## 📞 Support

- **Twilio Docs**: https://www.twilio.com/docs/whatsapp
- **WhatsApp API**: https://www.twilio.com/docs/whatsapp/quickstart
- **Debugging**: Check Twilio Console → "Activity" tab

**Status:** ✅ Ready to integrate!
