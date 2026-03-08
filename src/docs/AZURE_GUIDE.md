# Azure Services Setup Guide

## Quick Setup (5 Minutes)

### Step 1: Create Azure Blob Container

1. **Go to:** https://portal.azure.com
2. **Search:** `kalaikathadata001` (your storage account)
3. **Click:** Left sidebar → **Containers**
4. **Create New:**
   - Name: `artisan-uploads`
   - Public access: **Blob** (allows public read)
   - Click **Create**

✅ **Done!** Storage is ready for uploads.

---

### Step 2: Verify Services

Start your dev server and check browser console:

```bash
npm run dev
```

**Expected Console Output:**
```
✅ Firebase initialized successfully
✅ Azure AI Service running with REAL credentials
```

**When uploading an image:**
```
✅ Uploaded to Azure Blob Storage: https://kalaikathadata001.blob.core...
```

✅ **All green checkmarks = Ready to demo!**

---

## Configured Services

### ✅ Critical Services (Tier 1)

| Service | Endpoint | Purpose | Cost |
|---------|----------|---------|------|
| **Blob Storage** | kalaikathadata001.blob.core.windows.net | Photo uploads | $1-2/month |
| **Computer Vision** | kalaikatha-vision-ai.cognitiveservices.azure.com | Photo analysis | $0-3/month |

**Total Tier 1:** $1-5/month (stays within free tier)

### ✅ Enhanced Features (Tier 2)

| Service | Endpoint | Purpose | Cost |
|---------|----------|---------|------|
| **OpenAI GPT-4** | kalaikatha.openai.azure.com | Pricing, Marketing, Negotiation | $3-8/month |
| **Translator** | api.cognitive.microsofttranslator.com | Language translation | $0-2/month |
| **Speech Services** | uaenorth.api.cognitive.microsoft.com | Vani voice assistant | $0-2/month |
| **Video Indexer** | Optional | AI-curated state videos from public data | $0-1/month |

**Total All Services:** $4-14/month

### 💰 Budget Projection

- **$200 Azure credit lasts:** 6-12 months
- **Daily cost:** ~$0.30-0.50
- **Demo/testing:** $5-10 total

---

## Features by Service

### 1. Blob Storage
- Photo uploads with progress tracking
- Auto-compression for low-data networks
- Offline fallback (localStorage)
- Public URLs for sharing

### 2. Computer Vision
- Image quality analysis
- Object & tag detection
- Photo enhancement suggestions
- Trade secret detection
- **Caching:** 24 hours (saves costs)

### 3. OpenAI GPT-4
- Smart pricing (material + labor + expertise)
- Marketing content (Instagram/Amazon/Etsy)
- Autonomous negotiation bot
- **Caching:** 7-30 days (saves 70% costs)

### 4. Translator
- 10 Indian languages supported
- Buyer-artisan communication
- **Caching:** 30 days

### 5. Speech Services (Vani)
- Voice input in Tamil/Hindi/English
- Text-to-speech output
- Microphone permission handling
- Browser API fallback

### 6. Video Indexer
- AI-curated state videos from public data
- Enhances user experience with video content
- **Caching:** 30 days

---

## Cost Optimization

### Aggressive Caching Strategy

```
Image Analysis: 24 hours (images don't change often)
Pricing: 24 hours (market prices stable)
Marketing: 7 days (reusable content)
Translation: 30 days (static UI text)
Negotiation: Never cache (real-time decisions)
```

**Result:** 70%+ cache hit rate = 70% cost reduction

### Free Tier Limits

- Computer Vision: 5,000 free calls/month
- Translator: 2M characters free/month
- Speech: 5 hours free/month
- Blob Storage: 5GB free

**For demo:** All features stay within free tier ✅

---

## Environment Variables

Your `.env.local` file contains all credentials. **Never commit this file!**

Required variables:
```
AZURE_STORAGE_ACCOUNT_NAME=kalaikathadata001
AZURE_STORAGE_CONTAINER=artisan-uploads
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=...

AZURE_VISION_ENDPOINT=https://kalaikatha-vision-ai...
AZURE_VISION_KEY=your_key_here

AZURE_OPENAI_ENDPOINT=https://kalaikatha.openai.azure.com/
AZURE_OPENAI_KEY=your_key_here
AZURE_OPENAI_DEPLOYMENT=gpt-4

AZURE_TRANSLATOR_KEY=your_key_here
AZURE_TRANSLATOR_REGION=global

AZURE_SPEECH_KEY=your_key_here
AZURE_SPEECH_REGION=uaenorth
```

---

## Troubleshooting

### Issue: "Blob container not found"
**Solution:** Create the `artisan-uploads` container (Step 1)

### Issue: "401 Unauthorized"
**Solution:** Check that credentials in `.env.local` match Azure Portal

### Issue: "Quota exceeded"
**Solution:** Check Azure Portal for current usage, consider adding limits in code

### Issue: "CORS error on uploads"
**Solution:** Add CORS rules in Azure Portal → Storage Account → CORS settings

---

### Why This Setup Wins

1. **Social Impact:** Empowers 7M illiterate artisans in India
2. **Cost Efficient:** $7/month vs. $500+ for traditional e-commerce
3. **Scalable:** Free tier supports 10K artisans
4. **Innovative:** Agentic AI (autonomous negotiation), Trade secret protection
5. **Accessible:** Voice-first, works on 2G networks, low-end devices


## Next Steps

1. ✅ Create `artisan-uploads` container (5 min)
2. ✅ Test upload functionality (2 min)
3. ✅ Practice demo script (see DEMO_SCRIPT_RAMESH.md)
4. ✅ Record demo video (see RAMESH_DEMO_FLOW.md)