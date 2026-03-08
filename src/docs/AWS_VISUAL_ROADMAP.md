# AWS Migration - Visual Roadmap

## 🗺️ Migration Journey Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    KALAIKATHA AWS MIGRATION                 │
│                  Azure/Firebase → AWS (Free Tier)           │
└─────────────────────────────────────────────────────────────┘

📅 Timeline: 4 Weeks (Phased Approach)
💰 Budget: $2-5/month (Within Free Tier)
🎯 Goal: Production-ready, scalable, cost-effective

WEEK 1          WEEK 2          WEEK 3          WEEK 4
   │               │               │               │
   ▼               ▼               ▼               ▼
┌──────┐       ┌──────┐       ┌──────┐       ┌──────┐
│ 🔴   │       │ 🟡   │       │ 🟢   │       │ ✅   │
│PHASE1│──────▶│PHASE2│──────▶│PHASE3│──────▶│PHASE4│
│      │       │      │       │      │       │      │
│CORE  │       │  AI  │       │VOICE │       │POLISH│
└──────┘       └──────┘       └──────┘       └──────┘
```

---

## 📊 Service Migration Matrix

### Current State (Azure/Firebase)
```
┌─────────────────────────────────────────────────────┐
│                  CURRENT STACK                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔐 Firebase Auth ────────────┐                    │
│                               │                    │
│  ☁️  Azure Blob Storage ───────┤                    │
│                               │                    │
│  🤖 Azure OpenAI GPT-4 ────────┤                    │
│                               │                    │
│  🌐 Azure Translator ──────────┤──▶ KALAIKATHA APP │
│                               │                    │
│  👁️  Azure Computer Vision ────┤                    │
│                               │                    │
│  🗣️  Azure Speech Services ────┘                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Target State (AWS)
```
┌─────────────────────────────────────────────────────┐
│                   TARGET STACK                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔐 AWS Cognito ───────────────┐                    │
│                               │                    │
│  ☁️  Amazon S3 ─────────────────┤                    │
│                               │                    │
│  🤖 Bedrock/OpenAI API ─────────┤                    │
│                               │                    │
│  🌐 Amazon Translate ───────────┤──▶ KALAIKATHA APP │
│                               │                    │
│  👁️  Amazon Rekognition ────────┤                    │
│                               │                    │
│  🗣️  Polly + Transcribe ────────┘                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📅 Week-by-Week Breakdown

### WEEK 1: Foundation (🔴 Critical)
```
┌──────────────────────────────────────────────────────────┐
│ DAY 1-2: AWS Account Setup                              │
│ ├─ Create AWS account                                   │
│ ├─ Enable MFA                                           │
│ ├─ Set billing alerts ($1, $5, $10)                     │
│ └─ Create IAM admin user                                │
│                                                          │
│ DAY 2-3: Authentication (AWS Cognito)                   │
│ ├─ Create User Pool                                     │
│ ├─ Create Identity Pool                                 │
│ ├─ Configure IAM roles                                  │
│ ├─ Install aws-amplify                                  │
│ ├─ Create AWSAuthService.ts                             │
│ ├─ Update AuthContext.tsx                               │
│ └─ Test: Signup, Login, Session                         │
│                                                          │
│ DAY 3-4: Storage (Amazon S3)                            │
│ ├─ Create S3 bucket (kalaikatha-artisan-uploads)        │
│ ├─ Configure CORS                                       │
│ ├─ Set lifecycle policies                               │
│ ├─ Create AWSS3Service.ts                               │
│ ├─ Update AIStudio.tsx                                  │
│ └─ Test: Upload, View, Delete images                    │
│                                                          │
│ DAY 4-5: Integration & Testing                          │
│ ├─ End-to-end testing                                   │
│ ├─ Verify fallbacks work                                │
│ └─ Document any issues                                  │
│                                                          │
│ ✅ DELIVERABLES:                                         │
│    • Authentication working (Cognito)                   │
│    • Image uploads working (S3)                         │
│    • Fallbacks tested and verified                      │
│    • Environment variables configured                   │
└──────────────────────────────────────────────────────────┘
```

### WEEK 2: AI Services (🟡 High Priority)
```
┌──────────────────────────────────────────────────────────┐
│ DAY 1-2: Choose AI Provider                             │
│ ├─ Option A: Request Bedrock access (1-2 days approval) │
│ ├─ Option B: Get OpenAI API key (instant) ⭐            │
│ └─ Decision: OpenAI API (faster for MVP)                │
│                                                          │
│ DAY 2-3: OpenAI Integration                             │
│ ├─ Create OpenAIService.ts                              │
│ ├─ Implement calculateSmartPricing()                    │
│ ├─ Implement generateMarketingContent()                 │
│ └─ Add caching layer (24h pricing, 7d marketing)        │
│                                                          │
│ DAY 3-4: Component Updates                              │
│ ├─ Update SmartPricing.tsx                              │
│ ├─ Update MarketingExport.tsx                           │
│ ├─ Update GovernmentSchemes.tsx                         │
│ ├─ Update CustomOrderForm.tsx (BargainBot)              │
│ └─ Add "Demo Mode" badges for fallbacks                 │
│                                                          │
│ DAY 4-5: Testing & Optimization                         │
│ ├─ Test all AI features                                 │
│ ├─ Verify cache working                                 │
│ ├─ Test fallback calculations                           │
│ └─ Monitor API costs                                    │
│                                                          │
│ ✅ DELIVERABLES:                                         │
│    • Smart Pricing working (OpenAI or formula)          │
│    • Marketing generation working                       │
│    • Bargain bot functional                             │
│    • Government schemes suggestions                     │
│    • Cost tracking enabled                              │
└──────────────────────────────────────────────────────────┘
```

### WEEK 3: Language & Image (🟢 Medium Priority)
```
┌──────────────────────────────────────────────────────────┐
│ DAY 1-2: Translation (Amazon Translate)                 │
│ ├─ Enable Amazon Translate                              │
│ ├─ Create AWSTranslateService.ts                        │
│ ├─ Update useTranslation hook                           │
│ ├─ Implement caching (30-day expiry)                    │
│ └─ Test: Tamil ↔ English ↔ Hindi                        │
│                                                          │
│ DAY 2-3: Image Recognition (Amazon Rekognition)         │
│ ├─ Enable Amazon Rekognition                            │
│ ├─ Create AWSRekognitionService.ts                      │
│ ├─ Update AIStudio.tsx                                  │
│ ├─ Update TradeSecretConfirmation.tsx                   │
│ └─ Test: Label detection, quality analysis              │
│                                                          │
│ DAY 3-4: Component Integration                          │
│ ├─ Update all components using translation              │
│ ├─ Update all components using image analysis           │
│ └─ Verify fallbacks (locale files, generic analysis)    │
│                                                          │
│ DAY 4-5: Testing & QA                                   │
│ ├─ Test language switching                              │
│ ├─ Test image analysis                                  │
│ ├─ Test trade secret detection                          │
│ └─ Verify performance (API call reduction)              │
│                                                          │
│ ✅ DELIVERABLES:                                         │
│    • Multi-language working (or using locale files)     │
│    • Image analysis working (or generic fallback)       │
│    • Trade secret detection functional                  │
│    • Performance optimized                              │
└──────────────────────────────────────────────────────────┘
```

### WEEK 4: Voice & Polish (🟢 Nice-to-Have)
```
┌──────────────────────────────────────────────────────────┐
│ DAY 1-2: Text-to-Speech (Amazon Polly)                  │
│ ├─ Enable Amazon Polly                                  │
│ ├─ Create AWSPollyService.ts                            │
│ ├─ Select voices (Aditi for English, Kajal for Hindi)   │
│ ├─ Update VaniNavigationAssistant.tsx                   │
│ └─ Test: Voice output in multiple languages             │
│                                                          │
│ DAY 2-3: Speech-to-Text (Amazon Transcribe)             │
│ ├─ Enable Amazon Transcribe                             │
│ ├─ Create AWSTranscribeService.ts                       │
│ ├─ Update VoiceProductStory.tsx                         │
│ └─ Test: Voice recording & transcription                │
│                                                          │
│ DAY 3-4: End-to-End Testing                             │
│ ├─ Test complete user journeys                          │
│ │  ├─ Customer flow (discovery → purchase)              │
│ │  └─ Artisan flow (onboarding → product creation)      │
│ ├─ Test all features with AWS                           │
│ ├─ Test all features with fallbacks                     │
│ └─ Performance testing (India region)                   │
│                                                          │
│ DAY 4-5: Documentation & Deployment                     │
│ ├─ Update all documentation                             │
│ ├─ Create deployment guide                              │
│ ├─ Set up CI/CD (optional)                              │
│ ├─ Final QA review                                      │
│ └─ Production deployment                                │
│                                                          │
│ ✅ DELIVERABLES:                                         │
│    • Voice features working (Polly/Transcribe)          │
│    • All services integrated                            │
│    • Documentation complete                             │
│    • Production-ready deployment                        │
│    • Cost monitoring enabled                            │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 Priority Levels Explained

### 🔴 CRITICAL (Must-Have for MVP)
```
┌────────────────────────────────────┐
│ 1. Authentication (Cognito)       │ ← Users can't sign up without this
│ 2. Storage (S3)                    │ ← Artisans can't upload photos
└────────────────────────────────────┘

⚠️ Without these: App is demo-only (localStorage fallbacks)
✅ With these: Core features work in production
```

### 🟡 HIGH PRIORITY (Enhanced Experience)
```
┌────────────────────────────────────┐
│ 3. AI/GPT (Bedrock/OpenAI)         │ ← Smart features (pricing, marketing)
│ 4. Translation (Translate)         │ ← Accessibility for non-English speakers
└────────────────────────────────────┘

⚠️ Without these: Basic formula calculations, hardcoded translations
✅ With these: AI-powered smart features, dynamic translations
```

### 🟢 MEDIUM PRIORITY (Polish & Accessibility)
```
┌────────────────────────────────────┐
│ 5. Image Analysis (Rekognition)   │ ← Trade secret detection
│ 6. Text-to-Speech (Polly)         │ ← Voice assistance
│ 7. Speech-to-Text (Transcribe)    │ ← Voice product stories
└────────────────────────────────────┘

⚠️ Without these: Generic analysis, browser speech APIs
✅ With these: Professional features, better UX for illiterate users
```

---

## 💰 Cost Tracking by Week

### Week 1 (Foundation)
```
Service           Usage          Cost
─────────────────────────────────────
Cognito          ~10 users       $0 (Free: 50K MAU)
S3               ~50MB uploads   $0 (Free: 5GB)
─────────────────────────────────────
TOTAL WEEK 1:                    $0
```

### Week 2 (AI Services)
```
Service           Usage          Cost
─────────────────────────────────────
OpenAI API       ~100 requests   $1-2 (with $5 free credit)
─────────────────────────────────────
TOTAL WEEK 2:                    $1-2
```

### Week 3 (Language & Image)
```
Service           Usage          Cost
─────────────────────────────────────
Translate        ~10K chars      $0 (Free: 2M chars)
Rekognition      ~50 images      $0 (Free: 5K images)
─────────────────────────────────────
TOTAL WEEK 3:                    $0
```

### Week 4 (Voice & Polish)
```
Service           Usage          Cost
─────────────────────────────────────
Polly            ~50K chars      $0 (Free: 5M chars)
Transcribe       ~5 min audio    $0 (Free: 60 min)
─────────────────────────────────────
TOTAL WEEK 4:                    $0
```

### **TOTAL MVP COST: $1-5/month**

---

## ✅ Milestone Checkpoints

### End of Week 1 (Go/No-Go Decision Point)
```
✓ AWS account set up
✓ Billing alerts configured
✓ Cognito working (or fallback)
✓ S3 working (or fallback)
✓ No blocking issues

Decision: Proceed to Week 2?
├─ YES → Continue with AI services
└─ NO  → Stick with demo mode, revisit later
```

### End of Week 2 (MVP Viability Check)
```
✓ OpenAI working (or formula fallback)
✓ Smart pricing functional
✓ Marketing generation working
✓ Cost tracking shows < $5/month

Decision: Ship MVP now or continue?
├─ Ship Now → Deploy with Priority 1-3
└─ Continue → Proceed to Week 3
```

### End of Week 3 (Feature Complete Check)
```
✓ Translation working (or locale files)
✓ Image analysis working (or generic)
✓ Multi-language support confirmed
✓ Performance acceptable

Decision: Add voice features or ship?
├─ Ship Now → Production-ready (Priority 1-4)
└─ Continue → Proceed to Week 4
```

### End of Week 4 (Production Launch)
```
✓ All 7 services integrated
✓ Voice features working
✓ End-to-end testing complete
✓ Documentation updated
✓ Deployment successful

Decision: LAUNCH! 🚀
```

---

## 🔄 Rollback Plan

### If Week 1 Fails
```
Rollback: Keep using Azure/Firebase
Impact: None (current state)
Timeline: 0 days
Action: Use demo mode until AWS issues resolved
```

### If Week 2 Fails
```
Rollback: Keep Cognito + S3, use fallback AI
Impact: Smart features use formulas instead of GPT
Timeline: 0 days (instant fallback)
Action: Ship MVP with Priority 1-2 only
```

### If Week 3 Fails
```
Rollback: Keep Priority 1-2, use fallbacks
Impact: Hardcoded translations, generic image analysis
Timeline: 0 days
Action: Ship MVP with enhanced fallbacks
```

### If Week 4 Fails
```
Rollback: Ship without voice features
Impact: Use browser speech APIs
Timeline: 0 days
Action: Ship production without Priority 7
```

---

## 🎯 Success Metrics

### Week 1 Success Criteria
- ✅ Authentication working (Cognito or mock)
- ✅ Image uploads working (S3 or localStorage)
- ✅ No errors in production
- ✅ Fallbacks tested

### Week 2 Success Criteria
- ✅ Smart pricing calculations working
- ✅ Marketing content generation working
- ✅ Cost < $5/month
- ✅ Cache hit rate > 50%

### Week 3 Success Criteria
- ✅ Language switching working
- ✅ Image analysis functional
- ✅ Performance acceptable (< 3s response)
- ✅ API call reduction > 30%

### Week 4 Success Criteria
- ✅ Voice features working
- ✅ All documentation updated
- ✅ Production deployment successful
- ✅ User testing positive feedback

---

## 📞 Support & Escalation

### Issues During Week 1
**Contact:** Technical Lead
**Escalation:** AWS Support (free tier)
**Fallback:** Use demo mode

### Issues During Week 2
**Contact:** AI/ML Engineer
**Escalation:** OpenAI Support
**Fallback:** Formula-based calculations

### Issues During Week 3-4
**Contact:** Full Stack Developer
**Escalation:** AWS Community
**Fallback:** Use fallback services

---

**Ready to start?** Begin with Week 1, Day 1: `/docs/AWS_SETUP_GUIDE.md` → Priority 1 (Cognito)

**Questions?** Review `/docs/AWS_MIGRATION_SUMMARY.md` for quick reference.
