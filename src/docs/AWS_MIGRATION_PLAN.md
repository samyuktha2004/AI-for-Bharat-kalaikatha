# AWS Migration Plan - Kalaikatha

## 📋 Executive Summary

**Objective:** Migrate Kalaikatha from Azure/Firebase to AWS while maintaining all functionality within free tier limits for MVP demonstration.

**Timeline:** Phased approach over 4 weeks
**Priority:** High availability with progressive enhancement
**Fallback Strategy:** Mock responses for all services to ensure demo functionality

---

## 🎯 Migration Overview

### Current Stack → AWS Stack

| Current Service | Current Usage | AWS Replacement | Free Tier Limit | Priority |
|----------------|---------------|-----------------|-----------------|----------|
| Firebase Auth | User authentication | **AWS Cognito** | 50,000 MAU | 🔴 Critical |
| Azure Blob Storage | Image uploads | **Amazon S3** | 5GB storage, 20K GET, 2K PUT | 🔴 Critical |
| Azure OpenAI GPT-4 | Smart pricing, marketing | **Amazon Bedrock** or OpenAI API | Bedrock: limited free | 🟡 High |
| Azure Translator | Tamil/English/Hindi | **Amazon Translate** | 2M chars/month | 🟡 High |
| Azure Computer Vision | Image analysis | **Amazon Rekognition** | 5K images/month | 🟢 Medium |
| Azure Speech (TTS) | Voice output | **Amazon Polly** | 5M chars/month | 🟢 Medium |
| Azure Speech (STT) | Voice input | **Amazon Transcribe** | 60 min/month | 🟢 Medium |
| Azure Maps | Map display | Keep **Leaflet** (open source) | Free | ✅ No change |

---

## 📅 Phase-by-Phase Migration Plan

### **Phase 1: Foundation (Week 1)** 🔴 CRITICAL
**Goal:** Set up core infrastructure and authentication

#### 1.1 AWS Account Setup
- [ ] Create AWS account (use India region: ap-south-1 Mumbai)
- [ ] Enable MFA for root account
- [ ] Create IAM admin user for development
- [ ] Set up billing alerts ($1, $5, $10 thresholds)
- [ ] Enable AWS Free Tier usage alerts

#### 1.2 Authentication Migration (Firebase → Cognito)
- [ ] Create Cognito User Pool
  - Email/phone sign-in
  - Password policy (min 6 chars to match current)
  - Custom attributes: `userType` (buyer/artisan)
- [ ] Configure Cognito Identity Pool (for AWS resource access)
- [ ] Update `AuthContext.tsx` to use AWS Amplify
- [ ] Migrate existing Firebase users (if any)
- [ ] Test authentication flows:
  - Sign up (email + password)
  - Sign in
  - Password reset
  - Session persistence
- [ ] **Fallback:** Keep mock auth for offline demo

**Deliverables:**
- `/services/AWSAuthService.ts`
- Updated `/contexts/AuthContext.tsx`
- Environment variables in `.env`

---

### **Phase 2: Storage & Static Assets (Week 1-2)** 🔴 CRITICAL
**Goal:** Enable image uploads and retrieval

#### 2.1 S3 Setup
- [ ] Create S3 bucket: `kalaikatha-artisan-uploads`
  - Region: ap-south-1 (Mumbai)
  - Enable versioning (for rollback)
  - Set CORS for web access
  - Enable server-side encryption
- [ ] Create lifecycle policy:
  - Move to S3 Infrequent Access after 30 days
  - Delete temp uploads after 7 days
- [ ] Set up CloudFront CDN (optional, for faster delivery)
- [ ] Create IAM policy for upload access

#### 2.2 Image Upload Implementation
- [ ] Create `/services/AWSS3Service.ts`
- [ ] Implement image compression before upload (reduce bandwidth)
- [ ] Add upload progress tracking
- [ ] Generate signed URLs for secure access
- [ ] Update components:
  - `AIStudio.tsx`
  - `SimplifiedPhotoUpload.tsx`
  - `VoiceProductStory.tsx`
- [ ] **Fallback:** Base64 storage in localStorage for demo

**Deliverables:**
- `/services/AWSS3Service.ts`
- Updated upload components
- S3 bucket configuration

---

### **Phase 3: AI & Language Services (Week 2-3)** 🟡 HIGH PRIORITY
**Goal:** Restore smart features with AWS AI

#### 3.1 Translation Service (Azure Translator → Amazon Translate)
- [ ] Enable Amazon Translate API
- [ ] Create `/services/AWSTranslateService.ts`
- [ ] Implement batch translation for efficiency
- [ ] Cache translations locally (reduce API calls)
- [ ] Update `useTranslation` hook
- [ ] Test language switching: Tamil ↔ English ↔ Hindi
- [ ] **Fallback:** Hardcoded translations from locale files

#### 3.2 Smart Pricing & Marketing (Azure OpenAI → Amazon Bedrock/OpenAI)
**Option A: Amazon Bedrock (AWS Native)**
- [ ] Enable Bedrock access to Claude 3 Sonnet
- [ ] Request model access (approval needed)
- [ ] Create `/services/AWSBedrockService.ts`
- [ ] Migrate pricing prompts
- [ ] Migrate marketing generation prompts

**Option B: OpenAI API Direct (Simpler for MVP)**
- [ ] Get OpenAI API key (pay-as-you-go, $5 free credit)
- [ ] Create `/services/OpenAIService.ts`
- [ ] Use GPT-3.5-turbo (cheaper) or GPT-4 (better quality)
- [ ] Implement prompt caching to reduce costs

#### 3.3 Implementation
- [ ] Update `SmartPricing.tsx`
- [ ] Update `MarketingExport.tsx`
- [ ] Update `GovernmentSchemes.tsx`
- [ ] Update `CustomOrderForm.tsx` (bargain bot)
- [ ] Add aggressive caching (24 hours for pricing, 7 days for marketing)
- [ ] **Fallback:** Pre-generated mock responses for common scenarios

**Deliverables:**
- `/services/AWSTranslateService.ts`
- `/services/AWSBedrockService.ts` OR `/services/OpenAIService.ts`
- Updated AI-powered components

---

### **Phase 4: Image & Voice Services (Week 3-4)** 🟢 MEDIUM PRIORITY
**Goal:** Enable advanced features

#### 4.1 Image Recognition (Azure Vision → Amazon Rekognition)
- [ ] Enable Amazon Rekognition
- [ ] Create `/services/AWSRekognitionService.ts`
- [ ] Implement trade secret detection:
  - Detect text in images
  - Identify objects/tools
  - Quality assessment
- [ ] Update `AIStudio.tsx`
- [ ] Update `TradeSecretConfirmation.tsx`
- [ ] **Fallback:** Mock analysis based on image metadata

#### 4.2 Voice Services (Azure Speech → Amazon Polly + Transcribe)
**Text-to-Speech (Polly)**
- [ ] Enable Amazon Polly
- [ ] Select voice: Aditi (Indian English) or Kajal (Hindi)
- [ ] Create `/services/AWSPollyService.ts`
- [ ] Update `VaniNavigationAssistant.tsx`
- [ ] Update `ArtisanOnboarding.tsx`
- [ ] **Fallback:** Browser Web Speech API

**Speech-to-Text (Transcribe)**
- [ ] Enable Amazon Transcribe
- [ ] Support languages: Tamil, Hindi, English
- [ ] Create `/services/AWSTranscribeService.ts`
- [ ] Update `VoiceProductStory.tsx`
- [ ] Implement real-time streaming (optional)
- [ ] **Fallback:** Mock transcription with sample text

**Deliverables:**
- `/services/AWSRekognitionService.ts`
- `/services/AWSPollyService.ts`
- `/services/AWSTranscribeService.ts`
- Updated voice/image components

---

## 🏗️ Technical Architecture

### Before (Azure/Firebase)
```
┌─────────────┐
│   Frontend  │
│   (React)   │
└──────┬──────┘
       │
       ├──────► Firebase Auth
       ├──────► Azure Blob Storage
       ├──────► Azure OpenAI GPT-4
       ├──────► Azure Translator
       ├──────► Azure Computer Vision
       └──────► Azure Speech Services
```

### After (AWS)
```
┌─────────────┐
│   Frontend  │
│   (React)   │
└──────┬──────┘
       │
       ├──────► AWS Cognito (Auth)
       ├──────► Amazon S3 (Storage)
       ├──────► Amazon Bedrock / OpenAI API (AI)
       ├──────► Amazon Translate (Languages)
       ├──────► Amazon Rekognition (Vision)
       ├──────► Amazon Polly (Text-to-Speech)
       └──────► Amazon Transcribe (Speech-to-Text)
```

### Service Layer Architecture
```
/services/
  ├── AWSAuthService.ts        (Cognito wrapper)
  ├── AWSS3Service.ts           (S3 upload/download)
  ├── AWSBedrockService.ts      (AI/GPT alternative)
  ├── OpenAIService.ts          (Direct OpenAI API)
  ├── AWSTranslateService.ts    (Translation)
  ├── AWSRekognitionService.ts  (Image analysis)
  ├── AWSPollyService.ts        (Text-to-Speech)
  └── AWSTranscribeService.ts   (Speech-to-Text)
```

---

## 💰 Cost Optimization Strategy

### Free Tier Maximization
1. **Cache Everything**
   - Translation: 30 days
   - Pricing: 24 hours
   - Marketing: 7 days
   - Image analysis: 24 hours

2. **Compress Before Upload**
   - Images: Max 1MB (reduce S3 storage)
   - Audio: Compress to 32kbps (reduce Transcribe costs)

3. **Batch Operations**
   - Translate multiple strings in one API call
   - Process images in batches

4. **Smart Fallbacks**
   - Use hardcoded translations when available
   - Use mock responses for repeated demos
   - Use browser APIs when possible (Web Speech API)

### Estimated Monthly Costs (MVP)
| Service | Free Tier | Expected Usage | Cost |
|---------|-----------|----------------|------|
| Cognito | 50K MAU | ~100 users | $0 |
| S3 | 5GB, 20K GET | ~500MB, 5K requests | $0 |
| Translate | 2M chars | ~100K chars | $0 |
| Polly | 5M chars | ~200K chars | $0 |
| Transcribe | 60 min | ~20 min | $0 |
| Rekognition | 5K images | ~500 images | $0 |
| Bedrock/OpenAI | Limited | ~1K requests | $2-5 |
| **Total** | | | **$2-5/month** |

---

## 🔄 Migration Checklist

### Pre-Migration
- [ ] Backup all Firebase data
- [ ] Export user list (if any production users)
- [ ] Document current API usage patterns
- [ ] Set up AWS account
- [ ] Create IAM users and policies

### During Migration
- [ ] Maintain both Azure and AWS services (dual operation)
- [ ] Use feature flags to switch between services
- [ ] Test each service independently
- [ ] Monitor error rates and performance

### Post-Migration
- [ ] Verify all features work with AWS
- [ ] Run end-to-end tests
- [ ] Update documentation
- [ ] Decommission Azure resources
- [ ] Delete Firebase project (after data export)

---

## 🧪 Testing Strategy

### Unit Tests
- [ ] Test each AWS service wrapper independently
- [ ] Mock AWS SDK calls
- [ ] Test error handling and retries

### Integration Tests
- [ ] Test authentication flow (signup → login → logout)
- [ ] Test image upload → analysis → storage
- [ ] Test translation accuracy
- [ ] Test voice input → transcribe → save

### Demo Scenarios (Without AWS Credentials)
- [ ] All features work with fallback data
- [ ] No errors in console
- [ ] Smooth user experience
- [ ] Clear indicators when using mock data

---

## 🚨 Risk Mitigation

### Risk 1: Free Tier Limits Exceeded
**Impact:** High
**Mitigation:**
- Set up CloudWatch billing alarms
- Implement rate limiting in frontend
- Use aggressive caching
- Disable features if quota exceeded

### Risk 2: Bedrock Access Denied
**Impact:** High
**Mitigation:**
- Use OpenAI API as backup
- Pre-generate common responses
- Use GPT-3.5 instead of GPT-4

### Risk 3: Poor Performance in India
**Impact:** Medium
**Mitigation:**
- Use Mumbai region (ap-south-1)
- Enable CloudFront CDN
- Implement retry logic with exponential backoff
- Cache aggressively

### Risk 4: Migration Downtime
**Impact:** Medium
**Mitigation:**
- Dual operation period (both Azure and AWS)
- Feature flags for gradual rollout
- Maintain fallback to mock data

---

## 📚 Documentation Updates Needed

- [ ] `/docs/AWS_SETUP_GUIDE.md` - Step-by-step AWS setup
- [ ] `/docs/ENV_SETUP.md` - Update with AWS variables
- [ ] `/docs/DEPLOYMENT_CHECKLIST.md` - Update deployment steps
- [ ] `/README.md` - Update tech stack section
- [ ] `/docs/TECHNICAL.md` - Update architecture diagrams

---

## 🎯 Success Criteria

### MVP Launch Ready
✅ All features work with AWS or fallbacks
✅ Monthly cost < $10
✅ Response time < 3 seconds (India)
✅ No errors in production
✅ Demo works without AWS credentials

### Production Ready (Post-MVP)
✅ 99.9% uptime
✅ < 500ms response time
✅ Automatic failover to fallbacks
✅ Comprehensive error logging
✅ Cost monitoring and alerts

---

## 👥 Team Responsibilities

### Phase 1 (Critical - Week 1)
**Owner:** Technical Lead
**Tasks:** Cognito setup, S3 configuration
**Blocker removal:** IAM policies, region selection

### Phase 2-3 (High Priority - Week 2-3)
**Owner:** Full Stack Developer
**Tasks:** Service integration, component updates
**Support:** AI/ML Engineer for prompt optimization

### Phase 4 (Medium Priority - Week 3-4)
**Owner:** Full Stack Developer
**Tasks:** Voice and vision features
**Support:** UX Designer for fallback experiences

---

## 📞 Support Contacts

- **AWS Support:** Free tier includes basic support
- **AWS Documentation:** https://docs.aws.amazon.com
- **Community:** AWS India Developer Community
- **Escalation:** AWS Technical Account Manager (if available)

---

**Next Steps:**
1. Review and approve migration plan
2. Set up AWS account (see `/docs/AWS_SETUP_GUIDE.md`)
3. Begin Phase 1 implementation
4. Schedule weekly progress reviews

**Estimated Completion:** 4 weeks from approval
**Go/No-Go Decision Point:** End of Phase 1 (authentication working)
