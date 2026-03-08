# 🚀 Kalaikatha — Complete AWS Setup Guide
## AI for Bharat Hackathon ($100 Credit)

> **Time to complete:** ~45 minutes  
> **Budget estimate:** ~$2–5 for hackathon usage (free tier covers most)  
> **Region:** ap-south-1 (Mumbai) for all services except Bedrock (us-east-1)

---

## 📋 What We're Setting Up

| # | AWS Service | Purpose | Est. Cost |
|---|-------------|---------|-----------|
| 1 | **Cognito** | User login/signup | FREE (50k MAU) |
| 2 | **S3** | Artisan image uploads | ~$0.01 |
| 3 | **Bedrock** (Claude 3) | AI pricing, marketing, chat bot | ~$2–4 |
| 4 | **Translate** | Hindi/Tamil/English | FREE (2M chars) |
| 5 | **Rekognition** | Product image analysis | FREE (5k images) |
| 6 | **Polly** | Voice narration (TTS) | FREE (5M chars) |
| 7 | **Transcribe** | Voice input (STT) | Browser fallback used |

---

## STEP 0 — Account & Safety Setup

### 0.1 Create AWS Account (skip if you have one)
1. Go to https://aws.amazon.com → **Create a Free Account**
2. Enter email, create root password
3. Credit card required (you won't be charged within free tier)
4. Choose **Basic** support plan

### 0.2 Set Billing Alert (IMPORTANT — protect your $100)
1. Go to **Billing Dashboard** → **Budgets** → **Create Budget**
2. Choose **Cost Budget** → Monthly → **$20 threshold**
3. Add your email for alerts
4. Create two more budgets: $50 and $80
> This ensures you get warned before accidentally overspending

### 0.3 Enable MFA on Root Account
1. Click your name (top-right) → **Security credentials**
2. **Assign MFA device** → Virtual MFA → Scan with Google Authenticator
3. Enter two consecutive codes → **Add MFA**

### 0.4 Create IAM Admin User (don't use root)
1. Go to **IAM** → **Users** → **Create user**
2. Username: `kalaikatha-dev`
3. ✅ **Provide user access to the AWS Management Console**
4. Select **Attach policies directly** → `AdministratorAccess`
5. Click **Create user** → Download the CSV credentials
6. Sign out of root → Sign in as `kalaikatha-dev`

---

## STEP 1 — AWS Cognito (Authentication) 🔴 CRITICAL

### 1.1 Create User Pool
1. Go to **AWS Console → Cognito → User pools → Create user pool**
2. **Step 1 — Configure sign-in options:**
   - ✅ Email
   - Click **Next**
3. **Step 2 — Security requirements:**
   - Password min length: **8** characters
   - ✅ Uppercase, lowercase, numbers
   - MFA: **No MFA** (for hackathon)
   - Click **Next**
4. **Step 3 — Sign-up options:**
   - ✅ Enable self-registration
   - Under **Required attributes**: add `name`
   - Under **Custom attributes**: add `custom:userType` (string, mutable)
   - Click **Next**
5. **Step 4 — Message delivery:**
   - Send email with **Cognito** (free, no SES needed)
   - Click **Next**
6. **Step 5 — Integrate your app:**
   - User pool name: `kalaikatha-users`
   - ✅ **Use the Cognito Hosted UI** (optional but useful for testing)
   - App client name: `kalaikatha-web`
   - ✅ Don't generate client secret (SPAs can't keep secrets)
   - Callback URL: `http://localhost:5173` (add production URL later)
   - Click **Next** → **Create user pool**

7. **Copy these values to your `.env.local`:**
   ```
   VITE_AWS_COGNITO_USER_POOL_ID=ap-south-1_XXXXXXXXX   ← from "User pool ID"
   VITE_AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx        ← from App clients tab
   ```

### 1.2 Create Identity Pool (needed for S3, Rekognition, etc.)
1. Go to **Cognito → Identity pools → Create identity pool**
2. Identity pool name: `kalaikatha-identity`
3. **Authentication providers → Cognito:**
   - User pool ID: (paste from above)
   - App client ID: (paste from above)
4. **Create new IAM roles:**
   - Authenticated role: `kalaikatha-auth-role`
   - Unauthenticated role: `kalaikatha-unauth-role`
5. Click **Create identity pool**
6. Click on **Edit identity pool** → copy the **Identity pool ID**

7. **Add to `.env.local`:**
   ```
   VITE_AWS_COGNITO_IDENTITY_POOL_ID=ap-south-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

### 1.3 Attach Permissions to Authenticated Role
1. Go to **IAM → Roles → kalaikatha-auth-role → Add permissions → Attach policies**
2. Attach these managed policies:
   - `AmazonS3FullAccess` (for image uploads)
   - `AmazonRekognitionFullAccess` (for image analysis)
   - `TranslateFullAccess` (for translation)
   - `AmazonPollyFullAccess` (for text-to-speech)
   - `AmazonTranscribeFullAccess` (for voice input)
   - `AmazonBedrockFullAccess` (for AI)
3. Click **Add permissions**

> **Note:** For production, use fine-grained policies. For hackathon, FullAccess is fine.

---

## STEP 2 — Amazon S3 (Image Storage) 🔴 CRITICAL

### 2.1 Create S3 Bucket
1. Go to **S3 → Create bucket**
2. Bucket name: `kalaikatha-artisan-uploads`
   > Must be globally unique — add your name/number if needed
3. AWS Region: **Asia Pacific (Mumbai) ap-south-1**
4. **Block Public Access:** ✅ Keep all blocked (we'll use signed URLs)
5. Enable **Versioning** (optional, good practice)
6. Enable **Server-side encryption** → SSE-S3
7. Click **Create bucket**

### 2.2 Configure CORS
1. Click on your bucket → **Permissions** → **CORS** → **Edit**
2. Paste:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://YOUR-PRODUCTION-DOMAIN.com"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```
3. Click **Save changes**

### 2.3 Create Lifecycle Policy (save storage costs)
1. Bucket → **Management** → **Create lifecycle rule**
2. Rule name: `cleanup-temp`
3. Applies to: **all objects**
4. Actions:
   - ✅ Transition to **S3 Standard-IA** after **30 days**
   - ✅ Expire (delete) after **365 days**
5. Click **Create rule**

### 2.4 Add to `.env.local`
```
VITE_AWS_S3_BUCKET=kalaikatha-artisan-uploads
VITE_AWS_S3_REGION=ap-south-1
```

---

## STEP 3 — Amazon Bedrock (Claude AI) 🟡 HIGH PRIORITY

> **Important:** Bedrock Claude is available in **us-east-1** and **us-west-2**, NOT ap-south-1 yet.

### 3.1 Enable Model Access
1. **Switch region to us-east-1** (top-right region selector)
2. Go to **Bedrock → Model access** (left sidebar)
3. Click **Manage model access**
4. Find **Anthropic Claude 3 Sonnet** → ✅ Check it
5. Also enable **Claude 3 Haiku** (cheaper, faster fallback)
6. Click **Request model access**
7. Accept the EULA → Submit
8. Wait 2–5 minutes until status shows **Access granted** ✅

### 3.2 Test in Playground
1. **Bedrock → Playgrounds → Chat**
2. Select model: **Claude 3 Sonnet**
3. Send: "What is the fair price for a handcrafted bronze Nataraja?"
4. Verify response ✅

### 3.3 Add to `.env.local`
```
VITE_AWS_BEDROCK_REGION=us-east-1
VITE_AWS_BEDROCK_MODEL=anthropic.claude-3-sonnet-20240229-v1:0
```

> **Budget tip:** Claude 3 Haiku costs ~10x less than Sonnet. For a hackathon demo, use:
> `VITE_AWS_BEDROCK_MODEL=anthropic.claude-3-haiku-20240307-v1:0`

---

## STEP 4 — Amazon Translate 🟡 HIGH PRIORITY

### 4.1 No Setup Required!
Amazon Translate is ready to use in ap-south-1 as soon as your Identity Pool has permissions. The IAM role we set up in Step 1.3 already includes `TranslateFullAccess`.

**Supported in the app:**
- English ↔ Hindi (`hi`)
- English ↔ Tamil (`ta`)
- Auto-detect source language

### 4.2 Verify in Console
1. Go to **Translate → Real-time translation**
2. Source: `en`, Target: `hi`
3. Text: "Handcrafted bronze Nataraja"
4. Should show: "हस्तनिर्मित कांस्य नटराज" ✅

### 4.3 Add to `.env.local`
```
VITE_AWS_TRANSLATE_REGION=ap-south-1
```

---

## STEP 5 — Amazon Rekognition (Image Analysis) 🟢 MEDIUM

### 5.1 No Setup Required!
Like Translate, Rekognition works immediately with Identity Pool credentials.

**What it does in the app:**
- Detects craft type from product photos (Bronze, Pottery, Textile, etc.)
- Extracts labels/tags automatically
- Suggests product titles

### 5.2 Verify in Console
1. Go to **Rekognition → Label detection** (in the console demo)
2. Upload an artisan product photo
3. Should detect relevant labels ✅

### 5.3 Add to `.env.local`
```
VITE_AWS_REKOGNITION_REGION=ap-south-1
```

---

## STEP 6 — Amazon Polly (Voice) 🟢 MEDIUM

### 6.1 No Setup Required!
Polly works immediately with Identity Pool credentials.

**Voices used:**
- Hindi: **Kajal** (Neural — excellent quality)
- Tamil: **Aditi** (Standard)
- English: **Aditi** (Indian English)

> **Note:** Kajal (Neural) requires Neural Engine support. If you see errors, switch to `Aditi` for Hindi too.

### 6.2 Add to `.env.local`
```
VITE_AWS_POLLY_REGION=ap-south-1
VITE_AWS_POLLY_VOICE_ENGLISH=Aditi
VITE_AWS_POLLY_VOICE_HINDI=Kajal
VITE_AWS_POLLY_VOICE_TAMIL=Aditi
```

---

## STEP 7 — Amazon Transcribe (Voice Input) 🟢 LOW

> For hackathon MVP, the app uses **browser Web Speech API** which works without any AWS setup. AWS Transcribe is the production path.

### 7.1 Add to `.env.local`
```
VITE_AWS_TRANSCRIBE_REGION=ap-south-1
```

---

## STEP 8 — Final .env.local File

Create `d:\Kalaikatha AWS\.env.local` with these values (fill in your actual IDs):

```env
# Required
VITE_AWS_REGION=ap-south-1

# Cognito Auth (Step 1)
VITE_AWS_COGNITO_USER_POOL_ID=ap-south-1_YOUR_ID
VITE_AWS_COGNITO_CLIENT_ID=YOUR_CLIENT_ID
VITE_AWS_COGNITO_IDENTITY_POOL_ID=ap-south-1:YOUR-UUID

# S3 Storage (Step 2)
VITE_AWS_S3_BUCKET=kalaikatha-artisan-uploads
VITE_AWS_S3_REGION=ap-south-1

# Bedrock AI (Step 3) — us-east-1 region!
VITE_AWS_BEDROCK_REGION=us-east-1
VITE_AWS_BEDROCK_MODEL=anthropic.claude-3-haiku-20240307-v1:0

# Translate, Rekognition, Polly (Steps 4–6)
VITE_AWS_TRANSLATE_REGION=ap-south-1
VITE_AWS_REKOGNITION_REGION=ap-south-1
VITE_AWS_POLLY_REGION=ap-south-1
VITE_AWS_POLLY_VOICE_ENGLISH=Aditi
VITE_AWS_POLLY_VOICE_HINDI=Kajal
VITE_AWS_POLLY_VOICE_TAMIL=Aditi
VITE_AWS_TRANSCRIBE_REGION=ap-south-1
```

---

## STEP 9 — Install AWS SDK Packages

```bash
cd "d:\Kalaikatha AWS"
npm install @aws-sdk/client-bedrock-runtime @aws-sdk/client-translate @aws-sdk/client-rekognition @aws-sdk/client-polly @aws-sdk/client-transcribe @aws-sdk/client-comprehend
```

These SDK packages are loaded dynamically (code-split) so they don't bloat the initial bundle.

---

## STEP 10 — Test Everything

```bash
npm run dev
```

Check browser console for:
- ✅ `AWS Cognito initialized`
- ✅ `AWS S3 initialized`
- 🔧 Services will show as "not configured" until `.env.local` is filled

**Test flow:**
1. Open `http://localhost:5173`
2. Sign up as an artisan → should go through Cognito
3. Go to AI Studio → upload a product photo → Rekognition should analyze it
4. Go to Smart Pricing → enter values → Bedrock should calculate
5. Go to BargainBot → test negotiation → Bedrock should respond

---

## 💰 Budget Breakdown ($100 Credit)

| Service | Free Tier | Estimated Hackathon Use | Cost |
|---------|-----------|------------------------|------|
| Cognito | 50,000 MAU | ~10 users | **$0** |
| S3 | 5GB, 20k GET | ~100MB, 500 calls | **$0** |
| Bedrock (Haiku) | No free tier | ~1M tokens | **~$1** |
| Translate | 2M chars | ~50k chars | **$0** |
| Rekognition | 5k images | ~100 images | **$0** |
| Polly | 5M standard chars | ~10k chars | **$0** |
| Transcribe | 60 min | Browser STT used | **$0** |
| **Total** | | | **~$1–3** |

> Your $100 credit is MORE than enough. Even 1000 Bedrock calls = ~$1.

---

## 🔒 Security Notes for Hackathon

The app uses **Cognito Identity Pool** to give authenticated users temporary AWS credentials. This is the standard AWS pattern for browser apps. 

**Permissions are scoped** — users can only:
- Upload to their own S3 prefix
- Call Translate, Rekognition, Polly (read-only)
- Call Bedrock (inference only)

For production: Restrict IAM policies further using resource ARN conditions.

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|---------|
| `NotAuthorizedException` on sign-in | Check User Pool ID and Client ID in `.env.local` |
| S3 upload CORS error | Re-check S3 CORS config, add `localhost:5173` |
| Bedrock `AccessDeniedException` | Enable model access in Bedrock console (Step 3.1) |
| Bedrock returns errors | Use Haiku instead of Sonnet (cheaper, faster) |
| Polly Kajal not working | Switch to `Aditi` for Hindi (region issue) |
| Everything works offline | App has full rule-based fallbacks — that's by design! |

---

## 📞 Quick Reference Links

- [AWS Console](https://console.aws.amazon.com)
- [Cognito Console](https://console.aws.amazon.com/cognito)
- [S3 Console](https://s3.console.aws.amazon.com/s3)
- [Bedrock Console](https://us-east-1.console.aws.amazon.com/bedrock) (us-east-1)
- [Translate Console](https://ap-south-1.console.aws.amazon.com/translate)
- [Rekognition Console](https://ap-south-1.console.aws.amazon.com/rekognition)
- [Polly Console](https://ap-south-1.console.aws.amazon.com/polly)
- [IAM Console](https://console.aws.amazon.com/iam)
- [Billing Console](https://console.aws.amazon.com/billing)
