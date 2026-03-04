# Language System Implementation Guide

## Current State (Demo - Hardcoded)

**Status:** ✅ Fully functional with Tamil, Hindi, English
**Method:** All language files bundled in build (~18KB total)
**Benefit:** Works offline, instant switching, no network errors

### What Works Now:
1. ✅ Language selection in onboarding (with download animation)
2. ✅ Full Tamil ↔ English ↔ Hindi switching
3. ✅ Language switcher floating button (top-left corner)
4. ✅ Translations cached in localStorage
5. ✅ Only selected languages appear in switcher
6. ✅ Voice feedback when switching languages

### How to Test:
1. Start the app → Language onboarding appears
2. Select Tamil as primary language
3. Optionally add English as secondary
4. "Download" happens (simulated, ~2 seconds)
5. Click floating 🇮🇳 flag button (top-left) to switch languages
6. All UI text changes instantly

---

## Future: Real Language Pack Download System

### When to Implement Real Downloads:
- **When you have 10+ languages** (bundle size becomes significant)
- **When targeting 2G networks** (need minimal initial load)
- **When languages are frequently updated** (easier to update server-side)

### Architecture for Real Implementation:

#### 1. Backend Setup (Required)

**Option A: CDN Hosting (Recommended)**
```
Structure:
https://cdn.kalaikatha.com/locales/
  ├── en.json (8KB)
  ├── ta.json (9KB)
  ├── hi.json (8KB)
  ├── te.json (8KB)
  ├── kn.json (8KB)
  ├── ml.json (8KB)
  ├── bn.json (8KB)
  └── mr.json (8KB)

Benefits:
✅ Fast downloads (CDN edge servers)
✅ Easy to update (just upload new JSON)
✅ Supports versioning (en.json?v=2.1.0)
✅ Can add new languages without app update
```

**Option B: Your Backend Server**
```
API Endpoint:
GET /api/locales/:languageCode

Response:
{
  "version": "2.1.0",
  "lastUpdated": "2026-01-09",
  "translations": { ...all translations... }
}
```

#### 2. Frontend Changes Needed

**File: `/components/onboarding/LanguageOnboarding.tsx`**

Replace line 217 (fake download) with real download:

```typescript
// CURRENT (Fake):
const response = await fetch(`/locales/${code}.json`);

// FUTURE (Real CDN):
const response = await fetch(`https://cdn.kalaikatha.com/locales/${code}.json?v=${APP_VERSION}`);

if (!response.ok) {
  throw new Error(`Failed to download ${code}`);
}

const translations = await response.json();

// Validate structure
if (!translations.app || !translations.common) {
  throw new Error('Invalid translation file');
}

// Cache in localStorage
localStorage.setItem(`kalaikatha_lang_${code}`, JSON.stringify(translations));
localStorage.setItem(`kalaikatha_lang_${code}_version`, APP_VERSION);
```

**File: `/hooks/useTranslation.ts`**

Add version checking for updates:

```typescript
async function checkForUpdates(language: LanguageCode) {
  const cachedVersion = localStorage.getItem(`kalaikatha_lang_${language}_version`);
  
  if (cachedVersion !== APP_VERSION) {
    console.log(`Update available for ${language}: ${cachedVersion} → ${APP_VERSION}`);
    // Re-download updated language pack
    await downloadLanguagePack(language);
  }
}
```

#### 3. Build Configuration

**Remove static imports from bundle:**

In `/hooks/useTranslation.ts`, change from:

```typescript
// CURRENT (Bundled):
import enTranslations from '../locales/en';
import hiTranslations from '../locales/hi';
import taTranslations from '../locales/ta';
```

To:

```typescript
// FUTURE (Dynamic):
// No static imports - all downloaded at runtime
// Bundle size reduction: ~18KB → 0KB
```

Update `vite.config.ts` or `webpack.config.js`:

```typescript
export default {
  build: {
    rollupOptions: {
      external: ['../locales/*'] // Don't bundle language files
    }
  }
}
```

#### 4. Error Handling & Fallbacks

```typescript
async function downloadLanguagePack(code: LanguageCode) {
  try {
    // Try CDN first
    const response = await fetch(`https://cdn.kalaikatha.com/locales/${code}.json`);
    
    if (!response.ok) {
      throw new Error('CDN failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('CDN download failed, trying backup...');
    
    // Fallback to your server
    try {
      const response = await fetch(`/api/locales/${code}`);
      return await response.json();
    } catch (backupError) {
      // Ultimate fallback: English only (bundled)
      console.error('All downloads failed, using emergency fallback');
      return ENGLISH_FALLBACK; // Minimal English hardcoded
    }
  }
}
```

#### 5. Progressive Enhancement

**Smart Caching Strategy:**

```typescript
// Age-based cache invalidation
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

function isCacheValid(language: LanguageCode): boolean {
  const timestamp = localStorage.getItem(`kalaikatha_lang_${language}_timestamp`);
  
  if (!timestamp) return false;
  
  const age = Date.now() - parseInt(timestamp);
  return age < CACHE_DURATION;
}

// Only re-download if cache is old
if (!isCacheValid(language)) {
  await downloadLanguagePack(language);
}
```

#### 6. Offline Support

```typescript
// Install service worker to cache language files
// File: /public/sw.js

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/locales/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Otherwise download and cache
        return fetch(event.request).then((response) => {
          const responseClone = response.clone();
          caches.open('language-cache-v1').then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        });
      })
    );
  }
});
```

---

## Migration Checklist

When ready to implement real downloads:

### Step 1: Backend Preparation
- [ ] Set up CDN or API endpoint for language files
- [ ] Upload all 8 language JSON files
- [ ] Test download speeds from India (should be <1s on 3G)
- [ ] Set up versioning system
- [ ] Add CORS headers

### Step 2: Frontend Updates
- [ ] Remove static imports from `/hooks/useTranslation.ts`
- [ ] Update download URL in `/components/onboarding/LanguageOnboarding.tsx`
- [ ] Add error handling and fallbacks
- [ ] Implement cache validation
- [ ] Add version checking

### Step 3: Testing
- [ ] Test on 2G/3G/4G networks
- [ ] Test offline mode (should use cached versions)
- [ ] Test cache invalidation when updates available
- [ ] Test error handling (server down, network timeout)
- [ ] Test with all 8 languages

### Step 4: Deployment
- [ ] Update privacy policy (data downloaded from CDN)
- [ ] Add "Checking for updates..." UI for language updates
- [ ] Monitor CDN usage and costs
- [ ] Set up analytics for download success rate

---

## Cost Estimates

### CDN Hosting (Cloudflare/AWS CloudFront):
- **Storage:** 8 files × 8KB = 64KB total → FREE
- **Bandwidth:** 
  - 10,000 users × 2 languages × 8KB = 160MB/month
  - Cost: $0.01 - $0.05/month (negligible)

### Server Hosting:
- Minimal load (just serving static JSON files)
- Can use free tier of Vercel/Netlify

---

## Recommendations

### For Demo/MVP (Current):
✅ **Keep hardcoded** - 3 languages, 18KB is fine
✅ Faster, simpler, no backend needed
✅ Works offline perfectly

### For Production (Future):
🚀 Implement real downloads when:
- You have 10+ regional languages
- Bundle size > 50KB for languages alone
- Frequent translation updates needed
- Targeting ultra-low-end devices

---

## Current Implementation Details

### Files Involved:
1. `/locales/en.ts` - English translations (bundled)
2. `/locales/hi.ts` - Hindi translations (bundled)
3. `/locales/ta.ts` - Tamil translations (bundled)
4. `/hooks/useTranslation.ts` - Translation hook
5. `/components/LanguageSwitcher.tsx` - Switcher UI
6. `/components/onboarding/LanguageOnboarding.tsx` - Onboarding flow

### How It Works:
1. User selects Tamil in onboarding
2. Simulated "download" (2 seconds delay for UX)
3. Language saved to: `localStorage.kalaikatha_primary_language`
4. Selected languages: `localStorage.kalaikatha_selected_languages`
5. Translations cached: `localStorage.kalaikatha_lang_ta`
6. On app load, useTranslation reads from localStorage
7. Floating button appears (only if 2+ languages selected)
8. Click to switch instantly (already cached)

### Storage Keys:
- `kalaikatha_primary_language` → "ta"
- `kalaikatha_selected_languages` → ["ta", "en"]
- `kalaikatha_current_language` → "ta"
- `kalaikatha_lang_ta` → {...all Tamil translations...}
- `kalaikatha_lang_en` → {...all English translations...}

---

## Questions?

**Q: Why keep the fake download animation?**
A: Better UX - users expect a download. Instant would seem broken. Also prepares code for real implementation.

**Q: When should I switch to real downloads?**
A: When bundle size becomes an issue (10+ languages) OR when you need server-side translation updates without app updates.

**Q: Can I mix hardcoded + downloaded languages?**
A: Yes! Keep English hardcoded as emergency fallback, download others.

**Q: What about Azure Translator API?**
A: That's for DYNAMIC content (user-generated craft descriptions). Static UI should always use pre-translated JSON files for performance.

---

**Last Updated:** January 9, 2026
**Status:** Demo ready, production-ready architecture documented
