# Environment Variables Setup Guide

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your credentials** (see sections below)

3. **Restart development server:**
   ```bash
   npm run dev
   ```

---

## 🔥 Firebase Configuration

### Get Your Firebase Credentials:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create new one)
3. Click the gear icon ⚙️ → Project settings
4. Scroll to "Your apps" section
5. Click the web app icon `</>`
6. Copy the config values

### Add to .env:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=kalaikatha-96535.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=kalaikatha-96535
VITE_FIREBASE_STORAGE_BUCKET=kalaikatha-96535.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XHQZT4FJYC
```

### Enable Authentication:
1. Firebase Console → Authentication
2. Sign-in method → Enable "Email/Password"
3. Save

---

## ☁️ Azure Services Configuration

### 1. Azure Computer Vision

**Get Credentials:**
1. [Azure Portal](https://portal.azure.com) → Create "Computer Vision" resource
2. Copy endpoint and key from "Keys and Endpoint"

**Add to .env:**
```env
VITE_AZURE_VISION_ENDPOINT=https://kalaikatha-vision.cognitiveservices.azure.com
VITE_AZURE_VISION_KEY=your_32_char_key_here
```

---

### 2. Azure OpenAI GPT-4

**Get Credentials:**
1. Azure Portal → Create "Azure OpenAI" resource
2. Deploy GPT-4 model
3. Copy endpoint, key, and deployment name

**Add to .env:**
```env
VITE_AZURE_OPENAI_ENDPOINT=https://kalaikatha.openai.azure.com
VITE_AZURE_OPENAI_KEY=your_32_char_key_here
VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4
```

---

### 3. Azure Translator

**Get Credentials:**
1. Azure Portal → Create "Translator" resource
2. Copy key and region

**Add to .env:**
```env
VITE_AZURE_TRANSLATOR_KEY=your_32_char_key_here
VITE_AZURE_TRANSLATOR_REGION=uaenorth
VITE_AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com/
```

---

### 4. Azure Speech Services

**Get Credentials:**
1. Azure Portal → Create "Speech Services" resource
2. Copy key and region

**Add to .env:**
```env
VITE_AZURE_SPEECH_KEY=your_32_char_key_here
VITE_AZURE_SPEECH_REGION=uaenorth
```

---

### 5. Azure Blob Storage

**Get Credentials:**
1. Azure Portal → Create "Storage Account"
2. Create container "artisan-uploads"
3. Copy account name and access key

**Add to .env:**
```env
VITE_AZURE_STORAGE_ACCOUNT=kalaikathadata001
VITE_AZURE_STORAGE_KEY=your_storage_key_here
VITE_AZURE_STORAGE_CONTAINER=artisan-uploads
```

---

## ✅ Verify Setup

### Check if environment variables are loaded:

```bash
npm run dev
```

**Expected console output:**
```
✅ Firebase initialized successfully
🔧 Azure services configured
```

**Or if credentials missing:**
```
🔧 Firebase running in DEVELOPMENT MODE (no config)
🔧 Azure running in DEVELOPMENT MODE (mock data)
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` file in `.gitignore`
- Use different credentials for dev/production
- Rotate keys if exposed
- Use environment-specific files (`.env.development`, `.env.production`)

### ❌ DON'T:
- Commit `.env` to Git
- Share credentials in screenshots
- Use production keys in development
- Hardcode secrets in code

---

## 🚀 Deployment

### AWS Amplify:
1. AWS Amplify Console → App settings → Environment variables
2. Add all `VITE_*` variables
3. Redeploy

### Firebase Hosting:
1. Use Firebase Functions for server-side secrets
2. Client-side: Set in `.env.production`
3. Build and deploy

---

## 🐛 Troubleshooting

### Error: "Cannot read properties of undefined (reading 'VITE_FIREBASE_API_KEY')"

**Solution:**
1. Make sure `.env` file exists in project root
2. Restart development server (`npm run dev`)
3. Check variable names start with `VITE_`
4. Verify no syntax errors in `.env`

### Error: "Firebase initialization failed"

**Solution:**
1. Check all Firebase credentials are correct
2. Verify project ID matches Firebase Console
3. Enable Email/Password authentication in Firebase

### Error: "Azure API returns 401 Unauthorized"

**Solution:**
1. Verify API keys are correct
2. Check endpoint URLs match Azure Portal
3. Ensure Azure resources are active

---

## 📋 Complete .env Template

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Azure Computer Vision
VITE_AZURE_VISION_ENDPOINT=
VITE_AZURE_VISION_KEY=

# Azure OpenAI GPT-4
VITE_AZURE_OPENAI_ENDPOINT=
VITE_AZURE_OPENAI_KEY=
VITE_AZURE_OPENAI_DEPLOYMENT=gpt-4

# Azure Translator
VITE_AZURE_TRANSLATOR_KEY=
VITE_AZURE_TRANSLATOR_REGION=uaenorth
VITE_AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com/

# Azure Speech Services
VITE_AZURE_SPEECH_KEY=
VITE_AZURE_SPEECH_REGION=uaenorth

# Azure Blob Storage
VITE_AZURE_STORAGE_ACCOUNT=
VITE_AZURE_STORAGE_KEY=
VITE_AZURE_STORAGE_CONTAINER=artisan-uploads
```

---

## 💡 Development Mode (No Credentials)

**Good News:** The app works without any credentials!

- ✅ Mock authentication (localStorage)
- ✅ Simulated AI responses
- ✅ Browser Web Speech API for voice
- ✅ All UI features functional

**Perfect for:**
- UI testing
- Feature development
- Demo without Azure credits

**Limitations:**
- No real database persistence
- No real AI responses
- Voice features use browser APIs only

---

**Need Help?** Check `/docs/DEPLOYMENT_CHECKLIST.md` for full setup guide.
