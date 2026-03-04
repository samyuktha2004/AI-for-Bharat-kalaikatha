# Design Specification

> **Generated via Kiro**  
> Outlining solution architecture and interaction flows

---

## 📋 Document Information

- **Project:** Kalaikatha - AI-Powered Artisan Marketplace
- **Version:** 1.0.0
- **Status:** Approved
- **Last Updated:** January 2026
- **Owner:** Technical Team
- **Related:** requirements.md, README.md

---

## 🏗️ Solution Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 18.3 + TypeScript 5.3 + Vite 6.3.5           │  │
│  │  - Component-based UI                                 │  │
│  │  - Context API for state management                  │  │
│  │  - Custom hooks for business logic                   │  │
│  │  - Tailwind CSS 4.0 for styling                      │  │
│  │  - Motion/React for animations                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS/TLS 1.3
┌─────────────────────────────────────────────────────────────┐
│                   SERVICE LAYER                             │
│  ┌──────────────┬──────────────┬──────────────────────┐    │
│  │ AWS Services │ OpenAI API   │ Fallback Services    │    │
│  │ - Cognito    │ - GPT-3.5/4  │ - localStorage       │    │
│  │ - S3         │ - Vision     │ - Web Speech API     │    │
│  │ - Translate  │              │ - Mock data          │    │
│  │ - Polly      │              │ - Formula-based      │    │
│  │ - Transcribe │              │                      │    │
│  │ - Rekognition│              │                      │    │
│  └──────────────┴──────────────┴──────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                               │
│  ┌──────────────┬──────────────┬──────────────────────┐    │
│  │ Amazon S3    │ localStorage │ Session Storage      │    │
│  │ - Images     │ - Cache      │ - Temp data          │    │
│  │ - Documents  │ - User prefs │ - Form state         │    │
│  │ - Encrypted  │ - Compressed │ - Session tokens     │    │
│  └──────────────┴──────────────┴──────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18.3 (UI framework)
- TypeScript 5.3 (type safety)
- Vite 6.3.5 (build tool, HMR)
- Tailwind CSS 4.0 (styling)
- Motion/React (animations)

**State Management:**
- React Context API (global state)
- Custom hooks (business logic)
- localStorage (persistence)

**AWS Cloud Services:**
- AWS Cognito (authentication)
- Amazon S3 (storage)
- Amazon Translate (multilingual)
- Amazon Polly (text-to-speech)
- Amazon Transcribe (speech-to-text)
- Amazon Rekognition (image analysis)

**AI Services:**
- OpenAI GPT-3.5-turbo (primary AI)
- OpenAI GPT-4-vision (image analysis)

**Deployment:**
- AWS Amplify (hosting)
- GitHub Actions (CI/CD)
- CloudWatch (monitoring)

---

## 🔄 Interaction Flows

### Flow 1: Artisan Onboarding

```
┌─────────────────────────────────────────────────────────────┐
│ START: New Artisan Opens App                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ WelcomeScreen                                               │
│ - Show 3 options: Artisan / Buyer / Browse                 │
│ - User taps "I'm an Artisan"                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ AuthScreen (Sign Up)                                        │
│ - Enter phone number or email                               │
│ - Receive OTP (if phone) or confirmation email             │
│ - Verify OTP/email                                          │
│ - Set password (min 6 chars)                               │
│ - Select user type: Artisan                                │
│ → AWS Cognito creates user account                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ NameConfirmation                                            │
│ - Voice input: "What should we call you?"                  │
│ - Artisan speaks name OR types it                          │
│ - Audio playback: "Did you say [name]?"                    │
│ - Confirm or re-record                                      │
│ → AWS Transcribe (voice) or text input                     │
│ → AWS Polly (playback confirmation)                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ LanguageSelection                                           │
│ - Show 3 language options with flags                       │
│ - Tamil (தமிழ்) | Hindi (हिंदी) | English                  │
│ - Tap language to hear sample                              │
│ - Select 1-3 languages                                      │
│ - Set primary language                                      │
│ → AWS Polly (language samples)                             │
│ → Save to user profile                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ ArtisanOnboarding (7 Slides)                               │
│                                                             │
│ Slide 1: Welcome to Kalaikatha                             │
│ - Voice: "Welcome! Let me show you around..."              │
│ - Visual: Vani mascot waving                               │
│                                                             │
│ Slide 2: Meet Vani (Voice Assistant)                       │
│ - Voice: "I'm Vani, your AI assistant..."                 │
│ - Visual: Vani button demo                                 │
│                                                             │
│ Slide 3: Upload Photos                                     │
│ - Voice: "Take photos of your products..."                │
│ - Visual: Camera icon animation                            │
│                                                             │
│ Slide 4: Smart Pricing                                     │
│ - Voice: "I'll help you price fairly..."                  │
│ - Visual: Pricing calculator                               │
│                                                             │
│ Slide 5: Marketing Magic                                   │
│ - Voice: "Tell your story, I'll create content..."        │
│ - Visual: Voice → Instagram/Amazon                         │
│                                                             │
│ Slide 6: Protected Vault                                   │
│ - Voice: "Keep your trade secrets safe..."                │
│ - Visual: Lock icon, encrypted vault                       │
│                                                             │
│ Slide 7: Let's Get Started!                                │
│ - Voice: "Ready to grow your business?"                   │
│ - Visual: Dashboard preview                                │
│                                                             │
│ → AWS Polly (narration for each slide)                    │
│ → Progress: 1/7, 2/7, ... 7/7                             │
│ → Skip option available                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ ArtisanDashboard                                            │
│ - Show quick actions                                        │
│ - Vani button (bottom-right, 80px)                        │
│ - Language switcher (top-left, 80px)                      │
│ - Order summary                                             │
│ → Onboarding complete!                                      │
└─────────────────────────────────────────────────────────────┘
```

**Key Interactions:**
- Voice input at every step (optional)
- Audio playback for confirmation
- Visual + audio guidance
- Skip option for confident users
- Progress tracking (1/7, 2/7, etc.)

**Technical Details:**
- AWS Cognito: User creation and authentication
- AWS Transcribe: Voice-to-text for name input
- AWS Polly: Text-to-speech for all narration
- localStorage: Save onboarding progress
- React Context: Manage onboarding state

---

### Flow 2: Voice Navigation (Vani)

```
┌─────────────────────────────────────────────────────────────┐
│ Artisan on Dashboard                                        │
│ - Sees Vani button (bottom-right, orange gradient)         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ User Taps Vani Button                                       │
│ - Button pulses (listening animation)                       │
│ - Microphone icon turns red                                 │
│ - Show "Listening..." text                                  │
│ → Start voice recognition                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ User Speaks Command                                         │
│ Example: "Upload photo" (Tamil: "புகைப்படம் பதிவேற்று")    │
│ - Real-time transcription displayed                         │
│ - Confidence score shown                                    │
│ → AWS Transcribe (or Browser Web Speech API)               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Command Interpretation                                      │
│ - Parse transcribed text                                    │
│ - Match to known commands:                                  │
│   • "Upload photo" → Navigate to AIStudio                  │
│   • "Check orders" → Navigate to CustomOrders              │
│   • "Calculate price" → Navigate to SmartPricing           │
│   • "Marketing" → Navigate to MarketingExport              │
│   • "Government schemes" → Navigate to GovernmentSchemes   │
│   • "Show vault" → Navigate to ProtectedVault              │
│   • "Go back" → Navigate back                              │
│   • "Help" → Show command list                             │
│ → Natural language processing                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Voice Confirmation                                          │
│ - Vani speaks: "Opening AI Studio"                         │
│ - Visual feedback: Screen transition                        │
│ → AWS Polly (text-to-speech)                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Navigate to Target Screen                                   │
│ - Smooth transition animation                               │
│ - Target screen loads                                       │
│ - Vani button remains accessible                           │
└─────────────────────────────────────────────────────────────┘
```

**Supported Commands:**

| Command (English) | Command (Tamil) | Command (Hindi) | Action |
|-------------------|-----------------|-----------------|--------|
| Upload photo | புகைப்படம் பதிவேற்று | फोटो अपलोड करें | Open AIStudio |
| Check orders | ஆர்டர்களைச் சரிபார்க்கவும் | ऑर्डर देखें | Open CustomOrders |
| Calculate price | விலையைக் கணக்கிடு | कीमत की गणना करें | Open SmartPricing |
| Marketing | சந்தைப்படுத்தல் | मार्केटिंग | Open MarketingExport |
| Government schemes | அரசு திட்டங்கள் | सरकारी योजनाएं | Open GovernmentSchemes |
| Show vault | பெட்டகத்தைக் காட்டு | तिजोरी दिखाएं | Open ProtectedVault |
| Go back | திரும்பிச் செல்லுங்கள் | वापस जाएं | Navigate back |
| Help | உதவி | मदद | Show commands |

**Error Handling:**
- If command not recognized: "Sorry, I didn't understand. Try 'Help' for commands."
- If too noisy: "I couldn't hear clearly. Please try again."
- If timeout: "I didn't hear anything. Tap Vani to try again."

---

### Flow 3: Smart Pricing

```
┌─────────────────────────────────────────────────────────────┐
│ Artisan Navigates to SmartPricing                          │
│ - Via voice: "Calculate price"                             │
│ - OR via dashboard: Tap "Smart Pricing" card              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ SmartPricing Form                                           │
│ Input Fields:                                               │
│ 1. Material Cost (₹): [____]                               │
│    Example: ₹500 for bronze                                │
│                                                             │
│ 2. Labor Hours: [____]                                     │
│    Example: 10 hours                                        │
│                                                             │
│ 3. Skill Level: [Dropdown]                                │
│    Options: Beginner / Intermediate / Expert / Master      │
│                                                             │
│ 4. Craft Type: [Dropdown]                                 │
│    Options: Bronze casting, Pottery, Weaving, etc.        │
│                                                             │
│ 5. Location: [Auto-filled from profile]                   │
│    Example: Tamil Nadu                                      │
│                                                             │
│ [Calculate Price] Button                                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ User Taps "Calculate Price"                                │
│ - Validate inputs (all fields required)                    │
│ - Show loading spinner                                      │
│ - Disable button during processing                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Check Cache                                                 │
│ - Generate cache key: hash(inputs)                         │
│ - Check localStorage for cached result                     │
│ - If found and <24 hours old: Return cached result        │
│ - If not found or expired: Proceed to AI                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ AI Pricing Analysis                                         │
│                                                             │
│ Try Priority 1: OpenAI API                                 │
│ - Send prompt to GPT-3.5-turbo:                           │
│   "Analyze pricing for Indian artisan craft:              │
│    Material cost: ₹500                                     │
│    Labor hours: 10                                         │
│    Skill level: Expert                                     │
│    Craft: Bronze casting                                   │
│    Location: Tamil Nadu                                    │
│    Provide fair pricing that prevents exploitation."      │
│                                                             │
│ - Timeout: 30 seconds                                      │
│ - Parse AI response                                        │
│                                                             │
│ If OpenAI fails → Try Priority 2: Formula                 │
│ - Floor price = Material cost × 1.5                       │
│ - Suggested price = (Material + Labor × ₹100) × 2.5      │
│ - Premium price = Suggested × 1.4                         │
│                                                             │
│ → OpenAI GPT-3.5-turbo or formula-based                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Display Results                                             │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ 💰 Pricing Recommendation                           │   │
│ │                                                      │   │
│ │ Floor Price (Minimum):     ₹1,250                   │   │
│ │ ⚠️ Never sell below this!                           │   │
│ │                                                      │   │
│ │ Suggested Price:           ₹1,800 ⭐                │   │
│ │ ✅ Fair value for your work                         │   │
│ │                                                      │   │
│ │ Premium Price:             ₹2,500                   │   │
│ │ 💎 For premium buyers                               │   │
│ │                                                      │   │
│ │ Reasoning:                                          │   │
│ │ "Based on 10 hours of expert labor in bronze       │   │
│ │ casting, your work deserves ₹1,800. This is 20%    │   │
│ │ above market average for similar products in       │   │
│ │ Tamil Nadu. Premium buyers may pay up to ₹2,500."  │   │
│ │                                                      │   │
│ │ [Save Pricing] [Share] [Calculate Again]           │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ - Cache result for 24 hours                                │
│ - Save to pricing history                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Voice Feedback (Optional)                                   │
│ - Vani speaks: "Your suggested price is ₹1,800"           │
│ - Artisan can ask: "Why this price?"                      │
│ - Vani explains reasoning                                   │
│ → AWS Polly (text-to-speech)                               │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Simple 5-field form
- Real-time validation
- Loading states
- 24-hour caching
- Fallback to formula if AI fails
- Voice feedback option
- Save pricing history

**Technical Details:**
- OpenAI GPT-3.5-turbo: AI analysis
- localStorage: Cache results (24h)
- Formula fallback: Always works
- React state: Form management
- Toast notifications: Success/error

---

### Flow 4: Image Upload & Trade Secret Detection

```
┌─────────────────────────────────────────────────────────────┐
│ Artisan Navigates to AIStudio                              │
│ - Via voice: "Upload photo"                                │
│ - OR via dashboard: Tap "AI Studio" card                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ AIStudio Screen                                             │
│ - Show upload options:                                      │
│   [📷 Take Photo] [🖼️ Choose from Gallery]                │
│ - Show existing uploads (if any)                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ User Selects Image                                          │
│ - Camera: Opens device camera                              │
│ - Gallery: Opens file picker                               │
│ - User selects image file                                  │
│ → File validation (JPEG/PNG/WebP, max 5MB)                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Image Compression                                           │
│ - Show preview of selected image                           │
│ - Client-side compression:                                 │
│   • Target size: 500KB                                     │
│   • Max width: 1200px                                      │
│   • Quality: 80% JPEG                                      │
│   • Maintain aspect ratio                                  │
│ - Show before/after size                                   │
│ → Canvas API (client-side)                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Upload to S3                                                │
│ - Generate unique filename: {timestamp}_{filename}         │
│ - Upload to S3 bucket: kalaikatha-artisan-uploads         │
│ - Folder: products/{user-id}/                             │
│ - Show progress bar (0% → 100%)                           │
│ - Cancel option available                                  │
│ → Amazon S3 (or localStorage fallback)                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Image Analysis                                              │
│ - Show "Analyzing image..." spinner                        │
│                                                             │
│ Parallel Analysis:                                          │
│                                                             │
│ 1. Amazon Rekognition:                                     │
│    - Detect labels (objects, tools, materials)            │
│    - Detect text in image                                  │
│    - Quality assessment                                    │
│    - Confidence scores                                     │
│                                                             │
│ 2. OpenAI GPT-4-vision:                                    │
│    - Analyze for trade secrets                            │
│    - Identify unique techniques                           │
│    - Detect proprietary tools                             │
│    - Flag sensitive information                           │
│                                                             │
│ → Combine results from both services                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Display Analysis Results                                    │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ 🔍 Image Analysis Complete                          │   │
│ │                                                      │   │
│ │ Detected Objects:                                   │   │
│ │ • Bronze casting mold (95% confidence)             │   │
│ │ • Hammer (92% confidence)                          │   │
│ │ • Furnace (88% confidence)                         │   │
│ │ • Finished statue (97% confidence)                 │   │
│ │                                                      │   │
│ │ Quality Score: 8.5/10 ✅                            │   │
│ │ • Good lighting                                     │   │
│ │ • Sharp focus                                       │   │
│ │ • Clear subject                                     │   │
│ │                                                      │   │
│ │ ⚠️ Potential Trade Secrets Detected:                │   │
│ │ • Custom bronze mold design (92% confidence)       │   │
│ │ • Unique polishing technique (87% confidence)      │   │
│ │ • Secret alloy mixture visible (78% confidence)    │   │
│ │                                                      │   │
│ │ [Confirm Trade Secrets] [Make Public]              │   │
│ └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Trade Secret Confirmation                                   │
│ - If potential secrets detected → Show confirmation screen │
│ - If no secrets → Save to public portfolio                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ TradeSecretConfirmation Screen                             │
│                                                             │
│ "We detected potential trade secrets in your image.        │
│  Please confirm which are actual secrets:"                 │
│                                                             │
│ ☐ Custom bronze mold design                                │
│   Explanation: Unique mold shape not commonly used         │
│                                                             │
│ ☐ Unique polishing technique                               │
│   Explanation: Hand movement pattern visible               │
│                                                             │
│ ☐ Secret alloy mixture visible                             │
│   Explanation: Ingredient containers in background         │
│                                                             │
│ ☐ Add custom secret: [____________]                        │
│                                                             │
│ Legal Notice:                                               │
│ "By confirming, you declare these as trade secrets.        │
│  This creates a legal record for protection."              │
│                                                             │
│ [✓ Signature] [Confirm & Save to Vault]                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Save Image                                                  │
│                                                             │
│ If secrets confirmed:                                       │
│ - Move to Protected Vault                                  │
│ - Folder: vault/{user-id}/                                │
│ - Add watermark (optional)                                 │
│ - Encrypt metadata                                         │
│ - Log access in audit trail                               │
│                                                             │
│ If no secrets:                                              │
│ - Save to public portfolio                                 │
│ - Folder: products/{user-id}/                             │
│ - Make available for buyers                                │
│                                                             │
│ → Amazon S3 with appropriate permissions                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Success Confirmation                                        │
│ - Toast notification: "Image uploaded successfully!"       │
│ - Show thumbnail in gallery                                │
│ - Option to upload more                                    │
│ - Option to generate marketing content                     │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Camera or gallery selection
- Client-side compression (save bandwidth)
- Progress indicator
- Parallel AI analysis (Rekognition + OpenAI)
- Trade secret detection with confidence scores
- Explicit artisan confirmation
- Legal audit trail
- Separate storage (vault vs public)

**Technical Details:**
- Amazon S3: Image storage
- Amazon Rekognition: Object/text detection
- OpenAI GPT-4-vision: Trade secret analysis
- Canvas API: Client-side compression
- localStorage: Fallback storage
- React state: Upload progress

---


### Flow 5: Customer Discovery & Custom Order

```
┌─────────────────────────────────────────────────────────────┐
│ Buyer Opens App                                             │
│ - Lands on WelcomeScreen                                    │
│ - Taps "Browse Artisans" or "I'm a Buyer"                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ InteractiveMap (Customer Discovery)                        │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │         🗺️ Discover Artisans by State               │   │
│ │                                                      │   │
│ │     [India Map - SVG with clickable states]        │   │
│ │                                                      │   │
│ │     Tamil Nadu (45 artisans) 🔴                    │   │
│ │     Rajasthan (32 artisans) 🔴                     │   │
│ │     Karnataka (28 artisans) 🔴                     │   │
│ │     Gujarat (21 artisans) 🔴                       │   │
│ │     ...                                             │   │
│ │                                                      │   │
│ │     [🔍 Search by state or craft]                  │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ - Hover/tap state to highlight                            │
│ - Show artisan count tooltip                              │
│ - Click state to view artisans                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ User Clicks "Tamil Nadu"                                   │
│ - Map zooms to Tamil Nadu                                  │
│ - StateDrawer slides up from bottom                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ StateDrawer (Artisan Gallery)                              │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Tamil Nadu Artisans (45)                            │   │
│ │                                                      │   │
│ │ Filter: [All Crafts ▼] Sort: [Rating ▼]           │   │
│ │                                                      │   │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│ │ │  Ramesh  │ │  Lakshmi │ │  Kumar   │            │   │
│ │ │  Bronze  │ │  Pottery │ │  Weaving │            │   │
│ │ │  ⭐ 4.8  │ │  ⭐ 4.9  │ │  ⭐ 4.7  │            │   │
│ │ │  [Photo] │ │  [Photo] │ │  [Photo] │            │   │
│ │ └──────────┘ └──────────┘ └──────────┘            │   │
│ │                                                      │   │
│ │ ← Swipe for more →                                  │   │
│ └─────────────────────────────────────────────────────┘   │
│                                                             │
│ - Instagram-style swipeable cards                          │
│ - Lazy load images                                         │
│ - Tap card to view full profile                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ User Taps "Ramesh" Card                                    │
│ - Card expands with animation                              │
│ - Navigate to CraftDetails screen                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ CraftDetails (Full Artisan Profile)                        │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ [← Back]                    [❤️ Save] [Share 📤]    │   │
│ │                                                      │   │
│ │ 👤 Ramesh Kumar                                     │   │
│ │ Bronze Casting Master                               │   │
│ │ Tamil Nadu, India                                   │   │
│ │ ⭐⭐⭐⭐⭐ 4.8 (127 reviews)                          │   │
│ │                                                      │   │
│ │ About:                                              │   │
│ │ "Third-generation bronze caster specializing in    │   │
│ │  traditional Chola-style sculptures. 25 years of   │   │
│ │  experience in lost-wax casting technique."        │   │
│ │                                                      │   │
│ │ Product Gallery:                                    │   │
│ │ [Photo 1] [Photo 2] [Photo 3] [Photo 4] ...       │   │
│ │                                                      │   │
│ │ Recent Reviews:                                     │   │
│ │ ⭐⭐⭐⭐⭐ "Exceptional craftsmanship!" - Priya      │   │
│ │ ⭐⭐⭐⭐⭐ "Beautiful Nataraja statue" - Amit       │   │
│ │                                                      │   │
│ │ [📱 Contact] [🛒 Custom Order]                     │   │
│ └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ User Taps "Custom Order"                                   │
│ - Check if user is logged in                              │
│ - If not logged in → Show AuthScreen                      │
│ - If logged in → Open CustomOrderForm                     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ CustomOrderForm                                             │
│                                                             │
│ ┌─────────────────────────────────────────────────────┐   │
│ │ Custom Order for Ramesh                             │   │
│ │                                                      │   │
│ │ 1. Describe Your Requirements:                      │   │
│ │    [Text area or 🎤 Voice input]                   │   │
│ │    Example: "I need a 12-inch Nataraja statue      │   │
│ │    in bronze with green patina finish..."          │   │
│ │                                                      │   │
│ │ 2. Upload Reference Images (Optional):              │   │
│ │    [📷 Add Photos]                                  │   │
│ │    [Thumbnail 1] [Thumbnail 2] ...                 │   │
│ │                                                      │   │
│ │ 3. Budget Range:                                    │   │
│ │    Min: ₹[____] Max: ₹[____]                       │   │
│ │    Suggested: ₹5,000 - ₹8,000                      │   │
│ │                                                      │   │
│ │ 4. Deadline:                                        │   │
│ │    [📅 Select Date]                                │   │
│ │    Suggested: 4-6 weeks                            │   │
│ │                                                      │   │
│ │ 5. Enable Bargain Bot? ☐                           │   │
│ │    "Let AI negotiate the best price for you"      │   │
│ │                                                      │   │
│ │ [Submit Order]                                      │   │
│ └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Voice Input (If User Taps Mic)                            │
│ - Start recording                                          │
│ - Show waveform animation                                  │
│ - Real-time transcription                                  │
│ - User speaks requirements                                 │
│ - Tap to stop recording                                    │
│ → AWS Transcribe (or Browser Web Speech API)              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ User Submits Order                                         │
│ - Validate all required fields                            │
│ - Show confirmation dialog                                 │
│ - "Send order to Ramesh?"                                 │
│ - [Cancel] [Confirm]                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Order Submitted                                             │
│ - Save order to database (future: DynamoDB)                │
│ - Send notification to artisan (future: WhatsApp/Email)   │
│ - Show success message                                     │
│                                                             │
│ If Bargain Bot enabled:                                    │
│ - Initialize negotiation bot                               │
│ - Bot will negotiate with artisan                          │
│ - Buyer receives updates                                   │
│                                                             │
│ If Bargain Bot disabled:                                   │
│ - Wait for artisan response                                │
│ - Manual negotiation                                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Order Tracking                                              │
│ - Buyer can view order status                              │
│ - Statuses: Pending → Negotiating → Accepted → In Progress │
│            → Completed                                      │
│ - Receive notifications on status changes                  │
│ - Option to message artisan                                │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Interactive map for discovery
- Instagram-style artisan cards
- Full artisan profiles with reviews
- Voice or text order description
- Reference image upload
- Budget range suggestion
- Bargain bot option
- Order tracking

**Technical Details:**
- SVG India map with clickable regions
- React lazy loading for images
- AWS Transcribe for voice input
- localStorage for saved artisans
- Mock data for MVP (future: DynamoDB)
- Toast notifications for updates

---

## 🎨 User Interface Design

### Design System

**Color Palette:**
```css
/* Primary Colors */
--primary: #6366f1;        /* Indigo - Trust, technology */
--accent: #f59e0b;         /* Amber - Warmth, craft */
--success: #10b981;        /* Green - Success */
--warning: #f97316;        /* Orange - Attention */
--error: #ef4444;          /* Red - Error */

/* Neutral Colors */
--background: #fafaf9;     /* Stone-50 */
--surface: #ffffff;        /* White */
--text: #1c1917;           /* Stone-900 */
--text-secondary: #78716c; /* Stone-500 */

/* Dark Mode */
--dark-bg: #18181b;        /* Zinc-900 */
--dark-surface: #27272a;   /* Zinc-800 */
--dark-text: #fafafa;      /* Zinc-50 */
```

**Typography:**
```css
/* Font Families */
--font-sans: system-ui, -apple-system, sans-serif;
--font-tamil: "Noto Sans Tamil", sans-serif;
--font-hindi: "Noto Sans Devanagari", sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
```

**Spacing:**
```css
/* Base unit: 4px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-12: 3rem;     /* 48px - Min touch target */
--space-20: 5rem;     /* 80px - Vani button */
```

### Key Components

**1. Vani Button (Voice Assistant)**
```
Design:
- Size: 80px × 80px (exceeds 48px minimum)
- Position: Fixed bottom-right (20px margin)
- Background: Gradient (orange to amber)
- Icon: Microphone (white)
- Shadow: Large (0 10px 25px rgba(0,0,0,0.2))
- z-index: 1000 (always on top)

States:
- Idle: Solid gradient, mic icon
- Listening: Pulsing animation, red dot
- Processing: Spinner animation
- Speaking: Sound wave animation
- Error: Red background, alert icon

Accessibility:
- aria-label: "Voice assistant"
- role: "button"
- tabindex: 0
- Keyboard: Enter/Space to activate
```

**2. Language Switcher**
```
Design:
- Size: 80px × 80px
- Position: Fixed top-left (20px margin)
- Background: White with shadow
- Icon: Globe
- Dropdown: 3 language options
- z-index: 1000

Interaction:
- Tap to open dropdown
- Show current language with checkmark
- Tap language to switch
- Smooth transition (300ms)

Accessibility:
- aria-label: "Change language"
- role: "button"
- Keyboard navigation
```

**3. Artisan Card**
```
Design:
- Width: 100% (mobile), 300px (desktop)
- Aspect ratio: 3:4 (portrait)
- Border radius: 16px
- Shadow: Medium
- Hover: Lift effect (scale 1.02)

Layout:
┌─────────────────────┐
│                     │
│   Artisan Photo     │
│   (3:4 ratio)       │
│                     │
├─────────────────────┤
│ Name                │
│ Craft Type          │
│ Location            │
│ ⭐⭐⭐⭐⭐ (4.8)      │
└─────────────────────┘

Interaction:
- Tap to view full profile
- Swipe left/right for more
- Heart icon to save
- Share icon to share
```

**4. Bottom Sheet Navigation**
```
Design:
- Position: Fixed bottom
- Height: Auto (content-based)
- Max height: 80vh
- Border radius: 24px 24px 0 0
- Background: White
- Shadow: Large upward
- Drag handle: Visible at top

Interaction:
- Swipe up to expand
- Swipe down to collapse
- Tap outside to close
- Smooth animation (300ms)

Navigation Items:
┌─────────────────────────────────────┐
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ (drag handle)
│                                     │
│  📸 AI Studio                       │
│  💰 Smart Pricing                   │
│  📱 Marketing                       │
│  📦 Custom Orders                   │
│  🔒 Protected Vault                 │
│  🏛️ Government Schemes              │
│  🏪 My Shop                         │
│                                     │
└─────────────────────────────────────┘
```

### Responsive Breakpoints

```css
/* Mobile-first approach */

/* xs: 0-639px (default) */
/* Small phones */

/* sm: 640px+ */
@media (min-width: 640px) {
  /* Large phones */
  - Two-column grid
  - Larger touch targets
}

/* md: 768px+ */
@media (min-width: 768px) {
  /* Tablets */
  - Side drawer navigation
  - Card grid (2 columns)
}

/* lg: 1024px+ */
@media (min-width: 1024px) {
  /* Laptops */
  - Sidebar navigation
  - Card grid (3 columns)
  - Hover effects enabled
}

/* xl: 1280px+ */
@media (min-width: 1280px) {
  /* Desktops */
  - Card grid (4 columns)
  - Max width: 1280px
  - Centered layout
}
```

---

## 🔐 Security Architecture

### Authentication Flow

```
User Sign Up
        ↓
AWS Cognito User Pool
  - Email/phone validation
  - Password strength check (min 6 chars)
  - Custom attributes (userType, language)
        ↓
Confirmation Code (Email/SMS)
        ↓
User confirms
        ↓
Account created
        ↓
User Sign In
        ↓
AWS Cognito validates credentials
        ↓
JWT Token issued
  - Access Token (1 hour expiry)
  - ID Token (1 hour expiry)
  - Refresh Token (30 days expiry)
        ↓
Frontend stores tokens (localStorage)
        ↓
AWS Cognito Identity Pool
  - Exchanges JWT for temporary AWS credentials
  - Credentials valid for 1 hour
        ↓
User can access AWS resources
  - S3 (upload/download own files only)
  - Translate, Polly, Transcribe, Rekognition
```

### IAM Policies

**Authenticated User Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::kalaikatha-artisan-uploads/products/${cognito-identity.amazonaws.com:sub}/*",
        "arn:aws:s3:::kalaikatha-artisan-uploads/vault/${cognito-identity.amazonaws.com:sub}/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::kalaikatha-artisan-uploads",
      "Condition": {
        "StringLike": {
          "s3:prefix": [
            "products/${cognito-identity.amazonaws.com:sub}/*",
            "vault/${cognito-identity.amazonaws.com:sub}/*"
          ]
        }
      }
    },
    {
      "Effect": "Allow",
      "Action": [
        "translate:TranslateText",
        "polly:SynthesizeSpeech",
        "transcribe:StartTranscriptionJob",
        "transcribe:GetTranscriptionJob",
        "rekognition:DetectLabels",
        "rekognition:DetectText"
      ],
      "Resource": "*"
    }
  ]
}
```

**Key Security Features:**
- Users can only access their own S3 folders (${cognito-identity.amazonaws.com:sub})
- No delete permissions on other users' files
- Time-limited credentials (1 hour)
- Least privilege principle

### Data Protection

**Encryption:**
- **In Transit:** HTTPS/TLS 1.3 for all API calls
- **At Rest:** S3 server-side encryption (SSE-S3)
- **localStorage:** Sensitive data compressed (not encrypted - future improvement)

**Input Validation:**
```typescript
// File upload validation
export function validateImageUpload(file: File): ValidationResult {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }
  
  // Check file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'File too large (max 5MB)' };
  }
  
  return { valid: true };
}
```

---

## 📊 Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
const AIStudio = lazy(() => import('./artisan/AIStudio'));
const MarketingExport = lazy(() => import('./artisan/MarketingExport'));
const SmartPricing = lazy(() => import('./artisan/SmartPricing'));

// Usage with Suspense
<Suspense fallback={<LoadingState />}>
  {currentView === 'studio' && <AIStudio />}
  {currentView === 'marketing' && <MarketingExport />}
  {currentView === 'pricing' && <SmartPricing />}
</Suspense>
```

**Bundle Analysis:**
- Initial bundle: ~180KB (core only)
- AIStudio: ~45KB (loads on demand)
- Marketing: ~35KB (loads on demand)
- SmartPricing: ~30KB (loads on demand)
- Total: ~420KB (only loads what's used)

### Image Optimization

```typescript
// Compression before upload
export async function compressImage(file: File): Promise<File> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = await loadImage(file);
  
  // Calculate new dimensions (max 1200px width)
  let width = img.width;
  let height = img.height;
  if (width > 1200) {
    height = (height * 1200) / width;
    width = 1200;
  }
  
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  
  // Convert to JPEG with 80% quality
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(new File([blob], file.name, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.8);
  });
}
```

**Result:**
- 3MB image → ~500KB (6x reduction)
- Upload time: 10s → 2s on 3G

### Caching Strategy

```typescript
// localStorage cache structure
{
  // User session (30 days)
  "kalaikatha_user": {
    id: "user-123",
    expiresAt: 1234567890
  },
  
  // Artisan data (7 days)
  "kalaikatha_artisans_TN": [...],
  
  // Translations (30 days)
  "translate_en_ta_Welcome": "வரவேற்பு",
  
  // AI responses (24 hours)
  "pricing_500_10_expert": {
    floorPrice: 1250,
    cachedAt: 1234567890
  }
}
```

---

## 🚀 Deployment Architecture

### Current (MVP)

```
GitHub Repository
        ↓
GitHub Actions (CI/CD)
  - Lint code
  - Build production bundle
  - Run tests (future)
        ↓
AWS Amplify
  - Static site hosting
  - Auto HTTPS
  - Global CDN
  - Environment variables
        ↓
AWS Services
  - Cognito (auth)
  - S3 (storage)
  - Translate, Polly, Transcribe, Rekognition
        ↓
OpenAI API
  - GPT-3.5-turbo (AI features)
```

### Future (Production)

```
CloudFront CDN
  - Global edge locations
  - HTTPS/TLS 1.3
  - Cache static assets
        ↓
AWS Amplify
  - Frontend hosting
  - Auto build on Git push
        ↓
API Gateway
  - REST API endpoints
  - Rate limiting
        ↓
AWS Lambda
  - Serverless functions
  - Auto-scaling
        ↓
DynamoDB
  - User data
  - Products
  - Orders
        ↓
S3 + ElastiCache
  - Storage + caching
```

---

## 📈 Monitoring & Analytics

### CloudWatch Dashboards

```
Application Metrics:
- Active users (real-time)
- API response times
- Error rates
- S3 upload success rate
- AI API latency

Infrastructure Metrics:
- Lambda invocations
- DynamoDB read/write capacity
- S3 storage usage
- CloudFront cache hit rate

Business Metrics:
- New artisan signups
- Products uploaded
- Orders created
- AI feature usage
```

### Alarms

```typescript
{
  "ErrorRate": {
    threshold: "5%",
    period: "5 minutes",
    action: "SNS notification"
  },
  "APILatency": {
    threshold: "3 seconds",
    period: "5 minutes",
    action: "SNS notification"
  },
  "BillingAlert": {
    threshold: "$10",
    period: "daily",
    action: "Email to admin"
  }
}
```

---

## 📝 Technical Decisions

### Why React + TypeScript?
- **React:** Component-based, performant, large ecosystem
- **TypeScript:** Type safety, better IDE support, fewer runtime errors
- **Alternative considered:** Vue.js (rejected: smaller ecosystem)

### Why Vite?
- **Fast HMR:** Instant hot module replacement
- **Optimized builds:** Better than Create React App
- **Modern:** Native ES modules support
- **Alternative considered:** Webpack (rejected: slower)

### Why Tailwind CSS?
- **Utility-first:** Rapid development
- **Small bundle:** Only used classes included
- **Responsive:** Mobile-first by default
- **Alternative considered:** Styled Components (rejected: larger bundle)

### Why AWS over Azure?
- **Cost:** Better free tier for MVP
- **Ecosystem:** More services available
- **Documentation:** Better developer experience
- **Fallback:** Keep Azure as backup option

### Why OpenAI over AWS Bedrock?
- **Setup time:** Faster (no approval needed)
- **Proven:** More mature, better documentation
- **Cost:** Predictable pricing
- **Fallback:** Can switch to Bedrock later

---

## 🎯 Success Metrics

### Technical KPIs

**Performance:**
- First Contentful Paint: <2s on 3G
- Time to Interactive: <3.5s on 3G
- Lighthouse score: >80
- Error rate: <5%
- Uptime: 99.9%

**Scalability:**
- Support 10,000 concurrent users
- Handle 1TB of images
- Process 100K AI requests/month

**Security:**
- 0 data breaches
- 0 unauthorized access incidents
- 100% HTTPS traffic
- Regular security audits

### User Experience KPIs

**Artisan:**
- 85% complete onboarding
- 70% use voice commands
- 80% use smart pricing
- 60% use marketing automation
- 4.5+ star rating

**Buyer:**
- 80% use map to discover
- 5+ artisans viewed per session
- 20% conversion to custom order
- 4.5+ star rating

---

## 📚 References

- [AWS Documentation](https://docs.aws.amazon.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Generated via Kiro**  
**Version:** 1.0.0 | **Status:** Approved | **Last Updated:** January 2026
