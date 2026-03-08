# AWS Services Setup Checklist - Priority Ordered

## 🎯 Quick Reference

**Total Services:** 7 AWS services + 1 optional (OpenAI API)
**Total Setup Time:** ~3-4 hours (if Bedrock approved) or ~2 hours (with OpenAI API)
**Monthly Cost (MVP):** $2-5 within free tier limits
**All services have fallbacks:** ✅ Demo works without any AWS configuration

---

## 📋 Setup Order by Importance

### 🔴 **PRIORITY 1: Authentication (30 min)**
**Service:** AWS Cognito
**Why First:** Required for all user flows (buyer & artisan)
**Free Tier:** 50,000 Monthly Active Users
**Fallback:** Mock authentication (localStorage)

#### Setup Checklist
- [ ] Create AWS account (if new)
- [ ] Set billing alerts ($1, $5, $10)
- [ ] Create Cognito User Pool
  - [ ] Enable email sign-in
  - [ ] Enable phone sign-in (for artisans)
  - [ ] Set password policy (min 6 chars)
  - [ ] Add custom attribute: `userType` (buyer/artisan)
  - [ ] Configure email templates
- [ ] Create Cognito Identity Pool (for AWS resource access)
- [ ] Create IAM roles for authenticated/unauthenticated users
- [ ] Get credentials:
  - [ ] User Pool ID
  - [ ] App Client ID
  - [ ] Identity Pool ID
- [ ] Add to `.env`:
  ```env
  VITE_AWS_REGION=ap-south-1
  VITE_AWS_COGNITO_USER_POOL_ID=ap-south-1_XXXXXXXXX
  VITE_AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
  VITE_AWS_COGNITO_IDENTITY_POOL_ID=ap-south-1:xxxx-xxxx
  ```
- [ ] Install dependencies: `npm install aws-amplify @aws-amplify/ui-react`
- [ ] Create service file: `/services/AWSAuthService.ts`
- [ ] Update: `/contexts/AuthContext.tsx`
- [ ] Test: Sign up, Sign in, Session persistence

**Without AWS Setup:**
- ✅ Mock auth works
- ✅ All features accessible
- ✅ Shows "(Demo Mode)" indicator

---

### 🔴 **PRIORITY 2: Storage (20 min)**
**Service:** Amazon S3
**Why Second:** Core feature - artisans need to upload product photos
**Free Tier:** 5GB storage, 20,000 GET requests, 2,000 PUT requests/month
**Fallback:** Base64 storage in localStorage (max 5MB)

#### Setup Checklist
- [ ] Create S3 bucket
  - [ ] Name: `kalaikatha-artisan-uploads` (or unique variant)
  - [ ] Region: ap-south-1 (Mumbai)
  - [ ] Block public access: Enabled (use signed URLs)
  - [ ] Encryption: SSE-S3
  - [ ] Versioning: Disabled (save storage)
- [ ] Configure CORS policy (allow web app access)
- [ ] Set lifecycle policy:
  - [ ] Delete temp uploads after 7 days
  - [ ] Move to Infrequent Access after 30 days
- [ ] Create IAM policy for S3 access
  - [ ] `s3:PutObject`, `s3:GetObject`, `s3:DeleteObject`
  - [ ] `s3:ListBucket`
- [ ] Attach policy to Cognito Identity Pool role
- [ ] Add to `.env`:
  ```env
  VITE_AWS_S3_BUCKET=kalaikatha-artisan-uploads
  VITE_AWS_S3_REGION=ap-south-1
  ```
- [ ] Create service file: `/services/AWSS3Service.ts`
- [ ] Update components:
  - [ ] `AIStudio.tsx`
  - [ ] `SimplifiedPhotoUpload.tsx`
  - [ ] `VoiceProductStory.tsx`
- [ ] Test: Upload image, view image, delete image

**Without AWS Setup:**
- ✅ Images stored as base64 in localStorage
- ✅ Warning shown: "Images stored locally"
- ✅ Works for demo with small images (<5MB)

---

### 🟡 **PRIORITY 3: AI/GPT Services (30-60 min)**
**Service:** Amazon Bedrock OR OpenAI API
**Why Third:** Smart features (pricing, marketing, negotiations)
**Free Tier:** Bedrock limited (requires approval), OpenAI $5 free credit
**Fallback:** Formula-based calculations + pre-generated responses

#### Option A: Amazon Bedrock (AWS-native, but slower setup)
- [ ] Request model access in Bedrock console
  - [ ] Claude 3 Sonnet (recommended)
  - [ ] Claude 3 Haiku (faster, cheaper)
  - [ ] Fill use case: "AI assistant for Indian artisan platform"
  - [ ] ⏰ Wait 1-2 business days for approval
- [ ] Add to `.env`:
  ```env
  VITE_AWS_BEDROCK_REGION=us-east-1
  VITE_AWS_BEDROCK_MODEL=anthropic.claude-3-sonnet-20240229-v1:0
  ```
- [ ] Create service file: `/services/AWSBedrockService.ts`

#### Option B: OpenAI API (Faster, simpler for MVP) ⭐ RECOMMENDED
- [ ] Get OpenAI API key from https://platform.openai.com/api-keys
- [ ] Add to `.env`:
  ```env
  VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  VITE_OPENAI_MODEL=gpt-3.5-turbo
  ```
- [ ] Create service file: `/services/OpenAIService.ts`

#### Update Components
- [ ] `SmartPricing.tsx` (pricing calculator)
- [ ] `MarketingExport.tsx` (content generation)
- [ ] `GovernmentSchemes.tsx` (scheme suggestions)
- [ ] `CustomOrderForm.tsx` (bargain bot)
- [ ] Implement aggressive caching (24 hours pricing, 7 days marketing)
- [ ] Test: Calculate price, generate marketing, bargain bot

**Without AWS/OpenAI Setup:**
- ✅ Smart Pricing uses formula: `(material + labor) × 2.5`
- ✅ Marketing shows template-based content
- ✅ Government Schemes shows hardcoded list
- ✅ Bargain bot uses simple negotiation logic
- ✅ Badge shows "⚡ Demo Mode - AI suggestions"

---

### 🟡 **PRIORITY 4: Translation (15 min)**
**Service:** Amazon Translate
**Why Fourth:** Accessibility for Tamil/Hindi speakers
**Free Tier:** 2 million characters/month
**Fallback:** Pre-translated locale files

#### Setup Checklist
- [ ] Enable Amazon Translate (no console setup needed)
- [ ] Create IAM policy:
  - [ ] `translate:TranslateText`
  - [ ] `translate:TranslateDocument`
- [ ] Attach policy to IAM user/role
- [ ] Add to `.env`:
  ```env
  VITE_AWS_TRANSLATE_REGION=ap-south-1
  ```
- [ ] Create service file: `/services/AWSTranslateService.ts`
- [ ] Update: `useTranslation` hook
- [ ] Implement caching (30-day expiry for translations)
- [ ] Test: Switch language Tamil → English → Hindi

**Without AWS Setup:**
- ✅ Uses pre-translated locale files (`/locales/en.json`, `/locales/ta.json`, `/locales/hi.json`)
- ✅ Instant switching (no API delay)
- ✅ Only dynamic user content won't translate
- ✅ Perfect for MVP demo

---

### 🟢 **PRIORITY 5: Image Recognition (15 min)**
**Service:** Amazon Rekognition
**Why Fifth:** Enhanced features (trade secret detection, quality analysis)
**Free Tier:** 5,000 images/month
**Fallback:** Generic analysis based on image metadata

#### Setup Checklist
- [ ] Enable Amazon Rekognition (no console setup needed)
- [ ] Create IAM policy:
  - [ ] `rekognition:DetectLabels`
  - [ ] `rekognition:DetectText`
  - [ ] `rekognition:DetectModerationLabels`
- [ ] Attach policy to IAM user/role
- [ ] Add to `.env`:
  ```env
  VITE_AWS_REKOGNITION_REGION=ap-south-1
  ```
- [ ] Create service file: `/services/AWSRekognitionService.ts`
- [ ] Update components:
  - [ ] `AIStudio.tsx`
  - [ ] `TradeSecretConfirmation.tsx`
- [ ] Test: Upload image, verify labels detected, trade secrets flagged

**Without AWS Setup:**
- ✅ Shows generic analysis: "Bronze casting tools detected"
- ✅ Skips trade secret detection (all images public)
- ✅ Manual quality assessment by artisan

---

### 🟢 **PRIORITY 6: Text-to-Speech (15 min)**
**Service:** Amazon Polly
**Why Sixth:** Voice assistance for illiterate artisans (accessibility)
**Free Tier:** 5 million characters/month
**Fallback:** Browser Web Speech API

#### Setup Checklist
- [ ] Enable Amazon Polly (no console setup needed)
- [ ] Test voices in console:
  - [ ] Aditi (Indian English, female) ⭐ Recommended
  - [ ] Kajal (Hindi, female)
  - [ ] Raveena (Indian English, female)
- [ ] Create IAM policy:
  - [ ] `polly:SynthesizeSpeech`
- [ ] Attach policy to IAM user/role
- [ ] Add to `.env`:
  ```env
  VITE_AWS_POLLY_REGION=ap-south-1
  VITE_AWS_POLLY_VOICE_ENGLISH=Aditi
  VITE_AWS_POLLY_VOICE_HINDI=Kajal
  VITE_AWS_POLLY_VOICE_TAMIL=Aditi
  ```
- [ ] Create service file: `/services/AWSPollyService.ts`
- [ ] Update components:
  - [ ] `VaniNavigationAssistant.tsx`
  - [ ] `ArtisanOnboarding.tsx`
- [ ] Test: Vani speaks, language switching works

**Without AWS Setup:**
- ✅ Uses browser `window.speechSynthesis` API
- ✅ Quality varies by browser
- ✅ Works offline
- ✅ Good enough for demo

---

### 🟢 **PRIORITY 7: Speech-to-Text (15 min)**
**Service:** Amazon Transcribe
**Why Seventh:** Voice product stories (nice-to-have)
**Free Tier:** 60 minutes/month (120 min in first year)
**Fallback:** Browser Web Speech API + mock transcriptions

#### Setup Checklist
- [ ] Enable Amazon Transcribe (no console setup needed)
- [ ] Create IAM policy:
  - [ ] `transcribe:StartTranscriptionJob`
  - [ ] `transcribe:GetTranscriptionJob`
- [ ] Attach policy to IAM user/role
- [ ] Add to `.env`:
  ```env
  VITE_AWS_TRANSCRIBE_REGION=ap-south-1
  ```
- [ ] Create service file: `/services/AWSTranscribeService.ts`
- [ ] Update components:
  - [ ] `VoiceProductStory.tsx`
- [ ] Test: Record voice, verify transcription appears

**Without AWS Setup:**
- ✅ Uses browser `webkitSpeechRecognition` API
- ✅ Pre-generated sample transcriptions for demo
- ✅ Manual text entry option available

---

## 📊 Cost & Usage Summary

### Free Tier Limits (First 12 Months)

| Service | Free Tier | Estimated MVP Usage | Cost if Exceeded |
|---------|-----------|---------------------|------------------|
| **Cognito** | 50,000 MAU | ~100 users | $0.00 |
| **S3** | 5GB, 20K GET, 2K PUT | ~500MB, 5K requests | ~$0.50/month |
| **Translate** | 2M chars/month | ~100K chars (cached) | $0.00 |
| **Polly** | 5M chars/month | ~200K chars | $0.00 |
| **Transcribe** | 60 min/month | ~20 min | $0.00 |
| **Rekognition** | 5K images/month | ~500 images | $0.00 |
| **Bedrock** | Limited free | ~1K requests | ~$2-3/month |
| **OpenAI API** | $5 free credit | ~1K requests | ~$2-5/month |
| **Total** | | | **$2-5/month** |

### Cost Optimization Tips
- ✅ Cache translations (30 days)
- ✅ Cache AI responses (pricing: 24h, marketing: 7d)
- ✅ Compress images before upload (reduce S3 storage)
- ✅ Batch API calls when possible
- ✅ Use GPT-3.5-turbo instead of GPT-4 (10x cheaper)
- ✅ Set billing alerts ($1, $5, $10)

---

## 🧪 Testing Without AWS (Demo Mode)

### Verification Checklist
Run these tests without any `.env` configuration:

#### Authentication
- [ ] Sign up with email → Success (mock mode)
- [ ] Sign in → Success
- [ ] Session persists on refresh
- [ ] Logout works
- [ ] Shows "(Demo Mode)" indicator

#### Storage
- [ ] Upload image in AIStudio → Stored in localStorage
- [ ] Image displays correctly
- [ ] Warning shown: "Images stored locally"

#### AI Features
- [ ] Smart Pricing calculates → Formula: `(material + labor) × 2.5`
- [ ] Marketing generates → Template-based content
- [ ] Bargain bot negotiates → Simple logic
- [ ] Shows "⚡ Demo Mode" badge

#### Translation
- [ ] Switch to Tamil → UI changes instantly
- [ ] Switch to Hindi → UI changes instantly
- [ ] No API delay (using hardcoded translations)

#### Image Recognition
- [ ] Upload image → Generic analysis appears
- [ ] No errors in console

#### Voice (TTS/STT)
- [ ] Vani speaks → Browser speech API works
- [ ] Voice input → Browser recognition works
- [ ] Graceful fallback if unsupported

**Result:** ✅ All features functional for demo without any AWS setup

---

## 📝 Complete .env Template

```env
# ========================================
# AWS CONFIGURATION - KALAIKATHA MVP
# ========================================

# AWS Region (Mumbai for India)
VITE_AWS_REGION=ap-south-1

# ========================================
# 🔴 PRIORITY 1: Authentication (AWS Cognito)
# ========================================
VITE_AWS_COGNITO_USER_POOL_ID=ap-south-1_XXXXXXXXX
VITE_AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_AWS_COGNITO_IDENTITY_POOL_ID=ap-south-1:xxxx-xxxx-xxxx-xxxx-xxxx

# ========================================
# 🔴 PRIORITY 2: Storage (Amazon S3)
# ========================================
VITE_AWS_S3_BUCKET=kalaikatha-artisan-uploads
VITE_AWS_S3_REGION=ap-south-1

# ========================================
# 🟡 PRIORITY 3: AI Services
# ========================================
# Option A: AWS Bedrock (AWS-native)
VITE_AWS_BEDROCK_REGION=us-east-1
VITE_AWS_BEDROCK_MODEL=anthropic.claude-3-sonnet-20240229-v1:0

# Option B: OpenAI API (simpler for MVP) ⭐ RECOMMENDED
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_OPENAI_MODEL=gpt-3.5-turbo

# ========================================
# 🟡 PRIORITY 4: Translation (Amazon Translate)
# ========================================
VITE_AWS_TRANSLATE_REGION=ap-south-1

# ========================================
# 🟢 PRIORITY 5: Image Recognition (Amazon Rekognition)
# ========================================
VITE_AWS_REKOGNITION_REGION=ap-south-1

# ========================================
# 🟢 PRIORITY 6: Text-to-Speech (Amazon Polly)
# ========================================
VITE_AWS_POLLY_REGION=ap-south-1
VITE_AWS_POLLY_VOICE_ENGLISH=Aditi
VITE_AWS_POLLY_VOICE_HINDI=Kajal

# ========================================
# 🟢 PRIORITY 7: Speech-to-Text (Amazon Transcribe)
# ========================================
VITE_AWS_TRANSCRIBE_REGION=ap-south-1
```

---

## 🚀 Quick Start Guide

### Option 1: Full AWS Setup (Production-Ready)
1. Follow Priority 1 → 7 in order
2. Configure all services (3-4 hours total)
3. Test each service independently
4. Monthly cost: $2-5

### Option 2: Minimal AWS Setup (MVP Demo)
1. Setup Priority 1 (Cognito) - 30 min
2. Setup Priority 2 (S3) - 20 min
3. Setup Priority 3 (OpenAI API) - 10 min
4. Skip Priority 4-7 (use fallbacks)
5. Test critical features
6. Monthly cost: $2-5

### Option 3: No AWS Setup (Demo Mode)
1. Skip all AWS setup
2. Run `npm run dev`
3. All features work with fallbacks
4. Perfect for testing and demos
5. Monthly cost: $0

**Recommended for MVP:** Option 2 (Minimal AWS Setup) or Option 3 (Demo Mode)

---

## 📞 Support & Resources

### AWS Documentation
- **Cognito:** https://docs.aws.amazon.com/cognito/
- **S3:** https://docs.aws.amazon.com/s3/
- **Bedrock:** https://docs.aws.amazon.com/bedrock/
- **Translate:** https://docs.aws.amazon.com/translate/
- **Rekognition:** https://docs.aws.amazon.com/rekognition/
- **Polly:** https://docs.aws.amazon.com/polly/
- **Transcribe:** https://docs.aws.amazon.com/transcribe/

### AWS Free Tier
- **Overview:** https://aws.amazon.com/free/
- **Calculator:** https://calculator.aws/
- **India Region:** https://aws.amazon.com/india/

### OpenAI API
- **Documentation:** https://platform.openai.com/docs
- **Pricing:** https://openai.com/api/pricing/
- **API Keys:** https://platform.openai.com/api-keys

---

## ✅ Final Verification

### Before Production Launch
- [ ] All Priority 1-2 services configured (critical)
- [ ] Billing alerts enabled ($1, $5, $10)
- [ ] All environment variables in `.env`
- [ ] Test authentication flow end-to-end
- [ ] Test image upload → S3 → retrieval
- [ ] Test AI features (pricing, marketing)
- [ ] Monitor CloudWatch for errors
- [ ] Verify costs in AWS Cost Explorer

### Demo Readiness
- [ ] App works without `.env` (fallback mode)
- [ ] No errors in browser console
- [ ] All features accessible
- [ ] Clear indicators when using mock data
- [ ] Smooth user experience

---

**Next Steps:**
1. ✅ Review this checklist
2. 📝 Decide on setup option (Full/Minimal/Demo)
3. 🚀 Follow `/docs/AWS_SETUP_GUIDE.md` for detailed instructions
4. 📋 Follow `/docs/AWS_MIGRATION_PLAN.md` for implementation

**Questions?** See `/docs/AWS_MIGRATION_PLAN.md` for troubleshooting and support contacts.
