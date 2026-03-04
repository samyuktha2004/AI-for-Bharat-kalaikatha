# AWS Setup Guide - Kalaikatha MVP (Free Tier)

## 🎯 Priority Order (Setup in This Sequence)

This guide prioritizes services by importance for MVP demo functionality.

---

## 🔴 **PRIORITY 1: Authentication (AWS Cognito)**
**Free Tier:** 50,000 Monthly Active Users
**Importance:** CRITICAL - Without auth, users can't access the app
**Setup Time:** 30 minutes

### Why This First?
- Required for all user flows (buyer & artisan)
- Blocks access to dashboard and personalized features
- Simple to implement with AWS Amplify

### Setup Steps

#### 1. Create Cognito User Pool
```bash
# AWS Console Steps:
1. Open AWS Console → Services → Cognito
2. Click "Create user pool"
3. Configure sign-in experience:
   ✓ Email
   ✓ Phone number (for artisans)
   ☐ Username (not needed)
4. Password policy:
   - Minimum length: 6 characters
   - Require lowercase, uppercase
   ☐ Require numbers, symbols (too complex for artisans)
5. MFA: Optional (disable for MVP)
6. User account recovery: Email
7. Custom attributes:
   - userType (String) - "buyer" or "artisan"
8. Email provider: Cognito default (send limit: 50/day)
9. User pool name: kalaikatha-users-prod
10. App client: kalaikatha-web-client
    ☐ Generate client secret (not needed for web)
11. Review and create
```

#### 2. Create Cognito Identity Pool
```bash
# For S3 upload permissions:
1. Cognito → Identity pools → Create
2. Name: kalaikatha-identity-pool
3. Authentication providers:
   - Add Cognito user pool ID and app client ID
4. Create pool
5. Note the Identity Pool ID
```

#### 3. Install AWS Amplify
```bash
npm install aws-amplify @aws-amplify/ui-react
```

#### 4. Environment Variables
Add to `.env`:
```env
# AWS Cognito
VITE_AWS_REGION=ap-south-1
VITE_AWS_COGNITO_USER_POOL_ID=ap-south-1_XXXXXXXXX
VITE_AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_AWS_COGNITO_IDENTITY_POOL_ID=ap-south-1:xxxx-xxxx-xxxx-xxxx-xxxx
```

### Fallback Strategy
**If AWS not configured:**
- Use existing mock authentication in `AuthContext.tsx`
- Show "(Demo Mode)" in toast notifications
- All features accessible for presentation

### Testing
- [ ] Sign up with email
- [ ] Sign in
- [ ] Session persists on refresh
- [ ] Logout works
- [ ] Password reset email sent

---

## 🔴 **PRIORITY 2: Storage (Amazon S3)**
**Free Tier:** 5 GB storage, 20,000 GET requests, 2,000 PUT requests/month
**Importance:** CRITICAL - Needed for image uploads (core feature)
**Setup Time:** 20 minutes

### Why This Second?
- Artisans need to upload product photos (core workflow)
- Required for AI image analysis
- Marketing material generation depends on images

### Setup Steps

#### 1. Create S3 Bucket
```bash
# AWS Console Steps:
1. S3 → Create bucket
2. Bucket name: kalaikatha-artisan-uploads
   (must be globally unique, add suffix if taken)
3. Region: Asia Pacific (Mumbai) ap-south-1
4. Block Public Access: Keep enabled (use signed URLs)
5. Bucket Versioning: Disabled (save storage)
6. Default encryption: Server-side encryption (SSE-S3)
7. Create bucket
```

#### 2. Configure CORS
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["http://localhost:5173", "https://kalaikatha.web.app"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

#### 3. Set Lifecycle Policy (Cost Optimization)
```json
{
  "Rules": [
    {
      "Id": "DeleteTempUploads",
      "Status": "Enabled",
      "Prefix": "temp/",
      "Expiration": {
        "Days": 7
      }
    },
    {
      "Id": "MoveToIA",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        }
      ]
    }
  ]
}
```

#### 4. Create IAM Policy for S3 Access
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
      "Resource": "arn:aws:s3:::kalaikatha-artisan-uploads/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::kalaikatha-artisan-uploads"
    }
  ]
}
```

#### 5. Attach Policy to Cognito Identity Pool Role
```bash
1. IAM → Roles → Find "Cognito_kalakathaIdentityPoolAuth_Role"
2. Attach policies → Attach the S3 policy created above
```

#### 6. Environment Variables
Add to `.env`:
```env
# AWS S3
VITE_AWS_S3_BUCKET=kalaikatha-artisan-uploads
VITE_AWS_S3_REGION=ap-south-1
```

### Fallback Strategy
**If S3 not configured:**
- Store images as base64 in localStorage (max 5MB)
- Show warning: "Images stored locally. Upload to cloud to share."
- Convert to S3 later if user connects

### Testing
- [ ] Upload image from AIStudio
- [ ] Image appears in S3 bucket
- [ ] Download/view image works
- [ ] Delete image works

---

## 🟡 **PRIORITY 3: AI Services (Amazon Bedrock OR OpenAI API)**
**Free Tier:** Limited (Bedrock requires approval), OpenAI $5 free credit
**Importance:** HIGH - Smart Pricing, Marketing, Government Schemes
**Setup Time:** 30-60 minutes (depending on Bedrock approval)

### Option A: Amazon Bedrock (Recommended for AWS-native)

#### 1. Request Model Access
```bash
# AWS Console Steps:
1. Bedrock → Model access → Request access
2. Select models:
   ✓ Claude 3 Sonnet (recommended)
   ✓ Claude 3 Haiku (faster, cheaper)
3. Fill use case: "AI assistant for Indian artisan platform"
4. Submit (approval takes 1-2 business days)
```

#### 2. Environment Variables
```env
# AWS Bedrock
VITE_AWS_BEDROCK_REGION=us-east-1
VITE_AWS_BEDROCK_MODEL=anthropic.claude-3-sonnet-20240229-v1:0
```

### Option B: OpenAI API Direct (Faster to set up)

#### 1. Get API Key
```bash
1. Visit https://platform.openai.com/api-keys
2. Create account / Sign in
3. Create new secret key
4. Copy key (starts with sk-...)
```

#### 2. Environment Variables
```env
# OpenAI API
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_OPENAI_MODEL=gpt-3.5-turbo  # or gpt-4 for better quality
```

### Fallback Strategy
**If neither configured:**
- Use pre-generated mock responses for:
  - Smart Pricing: ₹X based on material + labor formula
  - Marketing: Template-based copy with product details
  - Government Schemes: Hardcoded list with eligibility
- Show badge: "⚡ Demo Mode - AI suggestions"

### Testing
- [ ] Smart Pricing calculates price
- [ ] Marketing content generates
- [ ] Government schemes suggest relevant programs
- [ ] Bargain bot negotiates

---

## 🟡 **PRIORITY 4: Translation (Amazon Translate)**
**Free Tier:** 2 million characters/month
**Importance:** HIGH - Accessibility for Tamil/Hindi speakers
**Setup Time:** 15 minutes

### Setup Steps

#### 1. Enable Amazon Translate
```bash
# AWS Console Steps:
1. Services → Amazon Translate
2. No setup required - just use the API
```

#### 2. Create IAM Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "translate:TranslateText",
        "translate:TranslateDocument"
      ],
      "Resource": "*"
    }
  ]
}
```

#### 3. Environment Variables
```env
# AWS Translate
VITE_AWS_TRANSLATE_REGION=ap-south-1
```

### Cost Optimization
- Cache all translations locally (30-day expiry)
- Batch translate on app load (reduce API calls)
- Use hardcoded translations for static UI text

### Fallback Strategy
**If not configured:**
- Use pre-translated locale files (`/locales/en.json`, `/locales/ta.json`, `/locales/hi.json`)
- Only dynamic content won't translate (user names, product descriptions)

### Testing
- [ ] Switch language to Tamil - UI translates
- [ ] Switch to Hindi - UI translates
- [ ] Product descriptions translate
- [ ] Error messages translate

---

## 🟢 **PRIORITY 5: Image Recognition (Amazon Rekognition)**
**Free Tier:** 5,000 images/month
**Importance:** MEDIUM - Trade secret detection, quality enhancement
**Setup Time:** 15 minutes

### Setup Steps

#### 1. Enable Amazon Rekognition
```bash
# AWS Console Steps:
1. Services → Amazon Rekognition
2. No setup required - just use the API
```

#### 2. Create IAM Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "rekognition:DetectLabels",
        "rekognition:DetectText",
        "rekognition:DetectModerationLabels"
      ],
      "Resource": "*"
    }
  ]
}
```

#### 3. Environment Variables
```env
# AWS Rekognition
VITE_AWS_REKOGNITION_REGION=ap-south-1
```

### Fallback Strategy
**If not configured:**
- Show generic analysis: "Bronze casting tools detected"
- Skip trade secret detection (all images treated as public)
- Manual quality assessment by artisan

### Testing
- [ ] Upload image in AIStudio
- [ ] Trade secrets detected
- [ ] Quality score calculated
- [ ] Labels extracted

---

## 🟢 **PRIORITY 6: Text-to-Speech (Amazon Polly)**
**Free Tier:** 5 million characters/month
**Importance:** MEDIUM - Voice assistance for illiterate artisans
**Setup Time:** 15 minutes

### Setup Steps

#### 1. Enable Amazon Polly
```bash
# AWS Console Steps:
1. Services → Amazon Polly
2. Test voices:
   - Aditi (Indian English, female)
   - Kajal (Hindi, female)
   - Raveena (Indian English, female)
```

#### 2. Create IAM Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "polly:SynthesizeSpeech"
      ],
      "Resource": "*"
    }
  ]
}
```

#### 3. Environment Variables
```env
# AWS Polly
VITE_AWS_POLLY_REGION=ap-south-1
VITE_AWS_POLLY_VOICE_ENGLISH=Aditi
VITE_AWS_POLLY_VOICE_HINDI=Kajal
VITE_AWS_POLLY_VOICE_TAMIL=Aditi  # No Tamil voice, use English
```

### Fallback Strategy
**If not configured:**
- Use browser Web Speech API (`window.speechSynthesis`)
- Quality may vary by browser
- Works offline

### Testing
- [ ] Vani speaks instructions
- [ ] Onboarding tutorial plays audio
- [ ] Error messages read aloud
- [ ] Language switching works

---

## 🟢 **PRIORITY 7: Speech-to-Text (Amazon Transcribe)**
**Free Tier:** 60 minutes/month (converts to 120 min in first year)
**Importance:** MEDIUM - Voice product stories
**Setup Time:** 15 minutes

### Setup Steps

#### 1. Enable Amazon Transcribe
```bash
# AWS Console Steps:
1. Services → Amazon Transcribe
2. No setup required
```

#### 2. Create IAM Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "transcribe:StartTranscriptionJob",
        "transcribe:GetTranscriptionJob"
      ],
      "Resource": "*"
    }
  ]
}
```

#### 3. Environment Variables
```env
# AWS Transcribe
VITE_AWS_TRANSCRIBE_REGION=ap-south-1
```

### Fallback Strategy
**If not configured:**
- Use browser Web Speech API (`webkitSpeechRecognition`)
- Pre-generated sample transcriptions for demo
- Manual text entry option

### Testing
- [ ] Record voice in VoiceProductStory
- [ ] Audio transcribes to text
- [ ] Tamil/Hindi languages work
- [ ] Save transcript to vault

---

## 📝 Complete Environment Variables (.env)

```env
# ========================================
# AWS CONFIGURATION
# ========================================

# Region (Mumbai for India)
VITE_AWS_REGION=ap-south-1

# ========================================
# PRIORITY 1: Authentication (Cognito)
# ========================================
VITE_AWS_COGNITO_USER_POOL_ID=ap-south-1_XXXXXXXXX
VITE_AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_AWS_COGNITO_IDENTITY_POOL_ID=ap-south-1:xxxx-xxxx-xxxx-xxxx-xxxx

# ========================================
# PRIORITY 2: Storage (S3)
# ========================================
VITE_AWS_S3_BUCKET=kalaikatha-artisan-uploads
VITE_AWS_S3_REGION=ap-south-1

# ========================================
# PRIORITY 3: AI Services
# ========================================
# Option A: AWS Bedrock
VITE_AWS_BEDROCK_REGION=us-east-1
VITE_AWS_BEDROCK_MODEL=anthropic.claude-3-sonnet-20240229-v1:0

# Option B: OpenAI API (simpler for MVP)
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_OPENAI_MODEL=gpt-3.5-turbo

# ========================================
# PRIORITY 4: Translation (Translate)
# ========================================
VITE_AWS_TRANSLATE_REGION=ap-south-1

# ========================================
# PRIORITY 5: Image Recognition (Rekognition)
# ========================================
VITE_AWS_REKOGNITION_REGION=ap-south-1

# ========================================
# PRIORITY 6: Text-to-Speech (Polly)
# ========================================
VITE_AWS_POLLY_REGION=ap-south-1
VITE_AWS_POLLY_VOICE_ENGLISH=Aditi
VITE_AWS_POLLY_VOICE_HINDI=Kajal

# ========================================
# PRIORITY 7: Speech-to-Text (Transcribe)
# ========================================
VITE_AWS_TRANSCRIBE_REGION=ap-south-1
```

---

## 🔒 IAM User Setup (For Development)

### Create IAM User
```bash
1. IAM → Users → Add user
2. User name: kalaikatha-dev
3. Access type: ✓ Programmatic access
4. Permissions: Attach policies
   - AmazonS3FullAccess (or custom policy)
   - AmazonTranslateFullAccess
   - AmazonRekognitionFullAccess
   - AmazonPollyFullAccess
   - TranscribeFullAccess
   - AmazonBedrockFullAccess (if using Bedrock)
5. Create user
6. Download CSV with access keys
```

### Configure AWS CLI (Optional, for testing)
```bash
npm install -g aws-cli
aws configure
# Enter Access Key ID
# Enter Secret Access Key
# Region: ap-south-1
# Output format: json
```

---

## 💰 Free Tier Monitoring

### Set Up Billing Alerts
```bash
1. AWS Console → Billing → Budgets
2. Create budget:
   - Budget type: Cost budget
   - Amount: $10/month
   - Alerts:
     - 50% threshold → Email alert
     - 80% threshold → Email alert
     - 100% threshold → Email alert
3. Create budget
```

### Enable Free Tier Usage Alerts
```bash
1. Billing → Preferences
2. ✓ Receive Free Tier Usage Alerts
3. Enter email
4. Save preferences
```

### Track Usage
```bash
# AWS Console → Cost Explorer
- View by service
- Filter by time period
- Set up cost anomaly detection
```

---

## 🧪 Testing Checklist (Without AWS)

Ensure demo works even if AWS not configured:

### Authentication
- [ ] Mock login works
- [ ] Shows "(Demo Mode)" indicator
- [ ] All features accessible

### Storage
- [ ] Images store in localStorage as base64
- [ ] Warning shown about local storage
- [ ] Images display correctly

### AI Services
- [ ] Smart Pricing uses formula: (material + labor) × 2.5
- [ ] Marketing shows template-based content
- [ ] Government Schemes shows hardcoded list

### Translation
- [ ] Uses pre-translated locale files
- [ ] Language switching works instantly (no API delay)

### Image Recognition
- [ ] Shows generic analysis
- [ ] No errors in console

### Voice Services
- [ ] Uses browser Web Speech API
- [ ] Graceful fallback if unsupported

---

## 🚨 Troubleshooting

### Error: "User pool does not exist"
**Fix:** Check `VITE_AWS_COGNITO_USER_POOL_ID` is correct

### Error: "Access Denied" on S3 upload
**Fix:** Verify IAM role attached to Cognito Identity Pool has S3 permissions

### Error: "Rate exceeded" on API calls
**Fix:** Implement caching, check free tier limits

### Error: "Invalid region"
**Fix:** Ensure region is `ap-south-1` for India services

### Error: "Model access denied" (Bedrock)
**Fix:** Use OpenAI API instead while waiting for approval

---

## 📞 Support Resources

- **AWS Free Tier FAQ:** https://aws.amazon.com/free/
- **AWS India Support:** https://aws.amazon.com/contact-us/
- **Amplify Documentation:** https://docs.amplify.aws/
- **AWS SDK for JavaScript:** https://docs.aws.amazon.com/sdk-for-javascript/

---

## ✅ Setup Verification

Once all services are configured, run these tests:

```bash
# Check environment variables
npm run dev
# Console should show: "✅ AWS services configured"

# Test authentication
# Sign up → Log in → Verify token

# Test S3 upload
# AIStudio → Upload image → Check S3 bucket

# Test AI
# Smart Pricing → Calculate → Check response

# Test translation
# Switch language → Verify text changes

# Test image analysis
# Upload image → Verify labels detected

# Test voice
# Vani → Speak → Verify audio plays

# Test transcribe
# VoiceProductStory → Record → Verify text appears
```

---

**Next:** Once setup complete, proceed to `/docs/AWS_MIGRATION_IMPLEMENTATION.md` for code changes.
