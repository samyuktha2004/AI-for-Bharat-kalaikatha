# WhatsApp + Bargain Bot Deployment Checklist

## Phase 1: Local Setup ✅
- [x] BargainBotService.ts created (600+ lines)
- [x] BargainBot.tsx updated with service integration
- [x] WhatsAppService.ts created (550+ lines)
- [x] WhatsAppSettings.tsx created (500+ lines)
- [x] AWS Lambda function template prepared
- [x] Integration documentation created
- [x] Build verification: ✅ Compiles without errors
- [x] Dev server: ✅ Running on localhost:3001

## Phase 2: Bargain Bot (Ready to Wire)
- [ ] **Integrate into CustomOrders workflow**
  - Add negotiation logic when buyer makes offer
  - Call `processNegotiation()` from BargainBotService
  - Display counter-offer UI with accept/reject options
  - Save negotiation history
  
- [ ] **Test negotiation flow**
  - Create test order with initial price
  - Submit buyer offer
  - Verify Bargain Bot calculates appropriate counter
  - Check soft floor protection (5-10% flexibility)
  - Verify localStorage persistence

- [ ] **Integrate with AI responses**
  - Optional: Replace mock persuasive messages with AWS Bedrock
  - Update negotiation_message field in negotiation history
  - Test fallback to mock if Bedrock unavailable

**Key Feature:** Auto-negotiation with soft floor logic protects artisan margin while being flexible (5-10% below hard floor)

## Phase 3: WhatsApp Setup (Pre-Deployment)

### 3a. Twilio Account Setup
- [ ] Sign up at https://www.twilio.com (free $15 trial)
- [ ] Verify your phone number with WhatsApp
- [ ] Provision a WhatsApp-enabled number
- [ ] Copy these credentials:
  - [ ] Account SID (20 chars, starts with AC...)
  - [ ] Auth Token (34 chars)
  - [ ] WhatsApp Number (format: +1234567890)

### 3b. Create .env.local
```
VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_TWILIO_AUTH_TOKEN=yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
VITE_TWILIO_WHATSAPP_NUMBER=+1234567890
```

### 3c. Test Locally
- [ ] Use mock notifications (no Twilio needed)
  - Go to WhatsAppSettings component
  - Click "Send Test Notification"
  - Verify notification appears in history
  
- [ ] Test with real Twilio (optional)
  - Add env variables from 3b above
  - Set phone number in settings UI
  - Click "Send Test Notification"
  - Receive WhatsApp on your phone within 10 seconds

## Phase 4: Component Integration (Wire Services to UI)

### 4a. CustomOrders.tsx
- [ ] Import WhatsApp service:
  ```typescript
  import { 
    notifyOrderPlaced,
    notifyOrderAccepted,
    notifyOrderRejected,
    notifyStatusUpdate,
    getUserPhone,
  } from '@/services/WhatsAppService';
  ```

- [ ] Add notification when order placed
  - Location: `handleSubmitOrder()` function
  - Call: `await notifyOrderPlaced(artisanPhone, artisanName, buyerName, product, budget, orderId)`
  - Handle: try-catch (non-blocking)
  
- [ ] Add notification when order accepted
  - Location: `handleAcceptOrder()` function
  - Call: `await notifyOrderAccepted(buyerPhone, buyerName, artisanName, product, finalPrice, orderId, estimate)`
  
- [ ] Add notification when order rejected
  - Location: `handleRejectOrder()` function
  - Call: `await notifyOrderRejected(buyerPhone, buyerName, artisanName, product, reason, orderId)`
  
- [ ] Add notification on status changes
  - Location: Each status update (preparing → shipped → in_transit → delivered)
  - Call: `await notifyStatusUpdate(buyerPhone, status, product, orderId, trackingUrl)`

### 4b. BargainBot.tsx
- [ ] Import WhatsApp service:
  ```typescript
  import { notifyBargainCounter } from '@/services/WhatsAppService';
  ```

- [ ] Add notification when counter-offer sent
  - Location: When bargain bot returns counter
  - Call: `await notifyBargainCounter(buyerPhone, buyerName, artisanName, product, buyerOffer, counterOffer, orderId)`
  - Toast: "💰 Counter-offer sent to buyer on WhatsApp!"

### 4c. Onboarding (Optional)
- [ ] Add phone number collection to ArtisanOnboarding
  - Import: `useWhatsAppSettings()` or add manual input
  - Component: WhatsAppSettings (already built)
  - Save: Call `saveUserPhone(userId, formattedPhone, userName)`
  
- [ ] Add phone number collection to BuyerOnboarding
  - Same as above for buyer registration

### 4d. Dashboard Settings
- [ ] Add "WhatsApp Settings" link to ArtisanDashboard
  - Import: `WhatsAppSettings` component
  - Show: Phone setup, notification history, test button
  - Allow phone update anytime

## Phase 5: Deployment to AWS Amplify

### 5a. Create Lambda Function in Amplify
- [ ] Go to AWS Amplify console
- [ ] Select your app → Backend environments
- [ ] Go to Functions
- [ ] Create new function: `send-whatsapp`
- [ ] Runtime: Node.js 18+
- [ ] Copy Lambda code from AMPLIFY_LAMBDA_FUNCTION.md
- [ ] Add environment variables:
  ```
  TWILIO_ACCOUNT_SID = ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  TWILIO_AUTH_TOKEN = yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
  TWILIO_WHATSAPP_NUMBER = +1234567890
  ```

### 5b. Create API Gateway Endpoint
- [ ] Go to API Gateway in AWS Console
- [ ] Create new HTTP API
- [ ] Create POST route: `/send-whatsapp`
- [ ] Integrate with Lambda function: `send-whatsapp`
- [ ] Deploy to `prod` stage
- [ ] Copy API endpoint URL

### 5c. Update Frontend Configuration
- [ ] Add endpoint to `.env.local`:
  ```
  VITE_AWS_AMPLIFY_API_URL=https://your-api-id.execute-api.ap-south-1.amazonaws.com/prod/send-whatsapp
  ```
- [ ] Or set in Amplify environment variables if deploying frontend

### 5d. Test Live Function
- [ ] Navigate to WhatsAppSettings component
- [ ] Verify phone field appears
- [ ] Enter valid Indian phone: 9876543210
- [ ] Click "Send Test Notification"
- [ ] Should receive WhatsApp in <30 seconds
  - ✅ If you get it: WhatsApp live!
  - ❌ If not: Check Lambda logs in CloudWatch

## Phase 6: End-to-End Testing (Full Workflow)

### Order Creation → Notification Flow
```
1. Buyer logs in → Visits artisan profile
2. Buyer places custom order → 
   ✅ Artisan gets WhatsApp: "Ramesh has ordered 'Bronze Nataraja' for ₹15,000"
3. Artisan negotiates (via BargainBot) →
   #4. Buyer gets WhatsApp: "Counter-offer: ₹16,500" 
5. Buyer accepts →
   ✅ Artisan gets WhatsApp: "Order accepted! Ramesh agreed to ₹16,500"
6. Artisan marks _preparing →
   ✅ Buyer gets WhatsApp: "🔨 Your order is being prepared"
7. Artisan marks _shipped →
   ✅ Buyer gets WhatsApp: "📦 Your order has shipped"
8. Marks _delivered →
   ✅ Buyer gets WhatsApp: "📍 Order delivered! Please rate your experience"
```

### Test Criteria
- [ ] All 6 notification types send successfully
- [ ] Phone number validation works (only accepts 10-digit Indian)
- [ ] Notification history persists after page refresh
- [ ] Unread count badge shows correctly
- [ ] Mock fallback works when Twilio not configured
- [ ] Error messages clear and actionable

## Phase 7: Monitoring & Maintenance

### Analytics
- [ ] Check Twilio dashboard for message volume
- [ ] Monitor cost (India: ~₹0.50-1 per message)
- [ ] Review failed message logs if any

### Alerts
- [ ] Set up CloudWatch alarms for Lambda function
- [ ] Monitor localStorage quota (WhatsApp history)
  - Automatically caps at 50 messages
  - Oldest deleted when limit exceeded

### Future Enhancements
- [ ] SMS fallback (if WhatsApp fails)
- [ ] Telegram alternative delivery
- [ ] Email fallback (non-critical updates)
- [ ] Delivery receipts from Twilio
- [ ] Read receipts notification
- [ ] Custom message templates per artisan
- [ ] Notification scheduling (quiet hours)
- [ ] Bulk message sender for marketing

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "Twilio not configured" mock showing | Add env vars to .env.local or Amplify environment |
| Messages not receiving | 1) Check phone in international format (+91...) 2) Verify Twilio balance 3) Check spam folder |
| Function 404 error | Check AWS API Gateway route and Lambda integration
| Phone validation fails | Ensure 10-digit Indian number, no spaces/dashes |
| History not persisting | Check browser localStorage not full |
| Blank component | Check WhatsAppService import path correct |

## Success Metrics

After completing all phases:
- ✅ Bargain Bot automatically negotiates orders
- ✅ Artisans/buyers receive real-time WhatsApp alerts
- ✅ Negotiation history tracked and persisted
- ✅ Phone validation prevents invalid numbers
- ✅ Graceful fallback to mock when Twilio down
- ✅ Full mobile responsive UI
- ✅ Zero build/TypeScript errors
- ✅ < 3 second notification latency
- ✅ 100% uptime (Twilio SLA: 99.99%)

## Estimated Timeline

| Phase | Hours | Dependencies |
|-------|-------|-------------|
| 1. Local Setup | ✅ 0 (Done) | None |
| 2. Wire Bargain Bot | 2-3 | Phase 1 |
| 3. Twilio Setup | 0.5 | Twilio account signup |
| 4. Integrate Components | 3-4 | Phase 2 |
| 5. Deploy | 1 | Phase 4 complete |
| 6. End-to-End Test | 1-2 | Phase 5 complete |

**Total: ~8-10 hours** (most is integration, not new code)

## Code Checksum

- **Created Files**: 5
  - BargainBotService.ts (600 lines)
  - WhatsAppService.ts (550 lines)
  - WhatsAppSettings.tsx (500 lines)
  - send-whatsapp.js (100 lines)
  - WHATSAPP_SETUP.md (350 lines)
  
- **Updated Files**: 2
  - BargainBot.tsx
  - hooks/index.ts (fixed export)

- **Documentation Files**: 4
  - WHATSAPP_SETUP.md
  - WHATSAPP_INTEGRATION_EXAMPLES.md
  - This checklist
  - Inline code comments (150+ lines)

- **Total New Code**: 2,200+ lines
- **Build Status**: ✅ Zero errors
- **Tests**: ✅ Mock notifications working
- **Ready for**: Integration into existing components

---

**Next Step**: Start Phase 4 (Component Integration) when ready. Begin with CustomOrders.tsx order placement handler.
