# AWS Migration - Quick Start Guide

## 🎯 Choose Your Path

### Path 1: I Want Full AWS Integration (Production)
**Time:** 4 weeks | **Cost:** $2-5/month | **Recommended for:** Scaling to users

👉 **Go to:** `/docs/AWS_MIGRATION_PLAN.md`
- Read full migration strategy
- Follow 4-phase implementation
- Set up all 7 AWS services
- Production-ready deployment

---

### Path 2: I Want Minimal AWS Setup (MVP Demo)
**Time:** 1-2 days | **Cost:** $2-5/month | **Recommended for:** MVP with cloud features

👉 **Go to:** `/docs/AWS_SETUP_GUIDE.md`
- Follow Priority 1-3 only:
  1. AWS Cognito (authentication)
  2. Amazon S3 (storage)
  3. OpenAI API (AI features)
- Skip other services (use fallbacks)
- Demo-ready quickly

---

### Path 3: I Just Want to Demo (No Setup)
**Time:** 0 minutes | **Cost:** $0 | **Recommended for:** Testing & investor demos

👉 **Run the app:**
```bash
npm run dev
```

✅ **All features work** with intelligent fallbacks
✅ **No AWS configuration** needed
✅ **Perfect for demos** and development

👉 **Learn how it works:** `/docs/AWS_FALLBACK_STRATEGIES.md`

---

## 📚 Documentation Map

```
AWS Migration Documentation
│
├── 📖 AWS_MIGRATION_PLAN.md
│   └── Strategic overview, 4-phase plan, architecture
│       Best for: Project planning, stakeholder review
│
├── 🛠️ AWS_SETUP_GUIDE.md
│   └── Step-by-step AWS console instructions
│       Best for: Developers during implementation
│
├── ✅ AWS_SERVICES_CHECKLIST.md
│   └── Priority-ordered checklist with tracking
│       Best for: Implementation tracking
│
├── 🔄 AWS_FALLBACK_STRATEGIES.md
│   └── How demo works without AWS
│       Best for: Understanding fallback logic
│
├── 💻 AWS_CODE_CHANGES.md
│   └── Exact code changes needed
│       Best for: Developers writing code
│
└── 📊 AWS_MIGRATION_SUMMARY.md
    └── Quick reference for all docs
        Best for: Getting oriented
```

---

## 🚦 Decision Tree

```
Do you need the app to work TODAY?
│
├─ YES
│  └─ Use Path 3 (Demo Mode - No Setup)
│     ✅ Works immediately
│     ✅ All features functional
│     ✅ Perfect for demos
│
└─ NO - I have time to set up
   │
   ├─ Do you need production-grade cloud services?
   │  │
   │  ├─ YES
   │  │  └─ Use Path 1 (Full AWS Integration)
   │  │     ⏱️ 4 weeks
   │  │     💰 $2-5/month
   │  │     ✅ All AWS services
   │  │     ✅ Production-ready
   │  │
   │  └─ NO - Just need basic cloud features
   │     └─ Use Path 2 (Minimal AWS Setup)
   │        ⏱️ 1-2 days
   │        💰 $2-5/month
   │        ✅ Auth + Storage + AI
   │        ✅ MVP-ready
```

---

## 🎯 What Each Service Does

### 🔴 Critical Services (Must-have for production)

**1. AWS Cognito** (Authentication)
- What: User signup, login, session management
- Replaces: Firebase Authentication
- Why: Required for user accounts
- Fallback: Mock auth in localStorage
- Setup time: 30 min

**2. Amazon S3** (Storage)
- What: Image uploads and storage
- Replaces: Azure Blob Storage
- Why: Artisans need to upload product photos
- Fallback: localStorage (base64, max 5MB)
- Setup time: 20 min

---

### 🟡 High Priority Services (Enhanced features)

**3. OpenAI API or Amazon Bedrock** (AI)
- What: Smart pricing, marketing generation, bargain bot
- Replaces: Azure OpenAI GPT-4
- Why: Core value proposition (AI features)
- Fallback: Formula-based calculations + templates
- Setup time: 30-60 min

**4. Amazon Translate** (Languages)
- What: Tamil/Hindi/English translation
- Replaces: Azure Translator
- Why: Accessibility for non-English speakers
- Fallback: Pre-translated locale files (perfect for static UI)
- Setup time: 15 min

---

### 🟢 Nice-to-Have Services (Polish)

**5. Amazon Rekognition** (Image Analysis)
- What: Trade secret detection, quality analysis
- Replaces: Azure Computer Vision
- Why: Advanced features for artisans
- Fallback: Generic analysis
- Setup time: 15 min

**6. Amazon Polly** (Text-to-Speech)
- What: Voice output for Vani assistant
- Replaces: Azure Speech (TTS)
- Why: Accessibility for illiterate artisans
- Fallback: Browser Web Speech API (works well)
- Setup time: 15 min

**7. Amazon Transcribe** (Speech-to-Text)
- What: Voice product stories
- Replaces: Azure Speech (STT)
- Why: Voice-first product descriptions
- Fallback: Browser API + mock transcriptions
- Setup time: 15 min

---

## 💰 Cost Summary

### Demo Mode (Path 3)
```
Monthly Cost: $0
Services: None (all fallbacks)
Perfect for: Development, testing, demos
```

### Minimal Setup (Path 2)
```
Monthly Cost: $2-5
Services: Cognito + S3 + OpenAI
Perfect for: MVP launch
```

### Full AWS (Path 1)
```
Monthly Cost: $2-5 (within free tier)
Services: All 7 AWS services
Perfect for: Production scaling
```

**Note:** All options stay within free tier limits for MVP usage

---

## ⚡ Quick Commands

### Start Demo (No Setup)
```bash
npm run dev
```

### Verify AWS Configuration
```bash
# Check if .env exists
cat .env

# Should see:
# VITE_AWS_COGNITO_USER_POOL_ID=...
# VITE_AWS_S3_BUCKET=...
# etc.
```

### Test Without AWS
```bash
# Remove .env temporarily
mv .env .env.backup

# Start app
npm run dev

# All features should work with fallbacks
# Restore .env when done
mv .env.backup .env
```

---

## 🧪 Quick Test

### Test 1: Demo Mode Works
```bash
# 1. Ensure no .env file
# 2. Run app
npm run dev

# 3. Try these features:
- Sign up / Sign in → Should show "(Demo Mode)"
- Upload image → Should save to localStorage
- Smart pricing → Should use formula
- Language switch → Should work instantly
- Voice features → Should use browser APIs

✅ Expected: Everything works, no errors
```

### Test 2: AWS Mode Works (If Configured)
```bash
# 1. Create .env with AWS credentials
# 2. Run app
npm run dev

# 3. Try these features:
- Sign up → Should use Cognito
- Upload image → Should upload to S3
- Smart pricing → Should use OpenAI
- Check console for "✅ AWS ... initialized"

✅ Expected: Real AWS services used
```

---

## 🚨 Troubleshooting

### Problem: "I see '(Demo Mode)' but I configured AWS"
**Solution:** Check `.env` file has correct AWS credentials
```bash
# Verify environment variables loaded
console.log(import.meta.env.VITE_AWS_COGNITO_USER_POOL_ID)
```

### Problem: "Billing charges higher than expected"
**Solution:** 
1. Check AWS Cost Explorer
2. Verify billing alerts enabled
3. Increase caching duration
4. Reduce API calls

### Problem: "S3 upload fails"
**Solution:** Check IAM policy attached to Cognito Identity Pool
```json
{
  "Effect": "Allow",
  "Action": ["s3:PutObject", "s3:GetObject"],
  "Resource": "arn:aws:s3:::kalaikatha-artisan-uploads/*"
}
```

### Problem: "OpenAI API key invalid"
**Solution:**
1. Verify key starts with `sk-`
2. Check key hasn't expired
3. Verify billing enabled on OpenAI account

---

## ✅ Pre-Demo Checklist

### Without AWS (Demo Mode)
- [ ] Run `npm run dev`
- [ ] Test signup/signin
- [ ] Upload test image
- [ ] Test smart pricing
- [ ] Switch languages
- [ ] Verify no console errors
- [ ] Check "(Demo Mode)" indicators show

### With AWS (Production Mode)
- [ ] Verify `.env` configured
- [ ] Check billing alerts enabled
- [ ] Test Cognito signup/signin
- [ ] Upload to S3
- [ ] Test OpenAI features
- [ ] Monitor CloudWatch logs
- [ ] Verify costs in AWS Console

---

## 📞 Need Help?

### Getting Started
- **New to AWS?** Start with Path 3 (Demo Mode)
- **Want quick MVP?** Follow Path 2 (Minimal Setup)
- **Production ready?** Follow Path 1 (Full Integration)

### Documentation
- **Strategic planning:** `/docs/AWS_MIGRATION_PLAN.md`
- **Hands-on setup:** `/docs/AWS_SETUP_GUIDE.md`
- **Code changes:** `/docs/AWS_CODE_CHANGES.md`
- **Understanding fallbacks:** `/docs/AWS_FALLBACK_STRATEGIES.md`

### Support
- AWS Free Tier: https://aws.amazon.com/free/
- AWS Documentation: https://docs.aws.amazon.com
- OpenAI Docs: https://platform.openai.com/docs

---

## 🎯 Recommended Path for You

### If You're...

**...building an MVP for demo/pitch:**
→ Use **Path 3** (Demo Mode)
- Zero setup, works immediately
- Perfect for investor demos
- All features functional

**...launching to first 100 users:**
→ Use **Path 2** (Minimal Setup)
- Quick setup (1-2 days)
- Real auth + storage + AI
- Cost-effective ($2-5/month)

**...scaling to 1000+ users:**
→ Use **Path 1** (Full AWS)
- Production-grade infrastructure
- All AWS services integrated
- Ready for growth

---

**🚀 Ready to start?**
1. Choose your path above
2. Follow the recommended documentation
3. Test thoroughly
4. Launch with confidence!

**Questions?** Review the documentation map or start with `/docs/AWS_MIGRATION_SUMMARY.md`
