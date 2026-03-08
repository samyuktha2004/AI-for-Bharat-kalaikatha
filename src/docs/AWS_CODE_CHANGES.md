# AWS Migration - Code Changes Required

## 📋 Overview

This document details the exact code changes needed to migrate from Azure/Firebase to AWS. Each section includes file paths, code snippets, and implementation notes.

---

## 🔴 **Phase 1: Authentication (AWS Cognito)**

### Files to Create

#### 1. `/services/AWSAuthService.ts`
**Purpose:** Wrapper for AWS Cognito authentication

```typescript
/**
 * AWS Cognito Authentication Service
 * Replaces Firebase Authentication
 */

import { Amplify } from 'aws-amplify';
import { signUp, signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

// Configure Amplify
const COGNITO_CONFIG = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env?.VITE_AWS_COGNITO_USER_POOL_ID || '',
      userPoolClientId: import.meta.env?.VITE_AWS_COGNITO_CLIENT_ID || '',
      identityPoolId: import.meta.env?.VITE_AWS_COGNITO_IDENTITY_POOL_ID || '',
    }
  }
};

// Check if Cognito is configured
export function isCognitoConfigured(): boolean {
  return !!(
    COGNITO_CONFIG.Auth.Cognito.userPoolId &&
    COGNITO_CONFIG.Auth.Cognito.userPoolClientId
  );
}

// Initialize Amplify if configured
if (isCognitoConfigured()) {
  Amplify.configure(COGNITO_CONFIG);
  console.log('✅ AWS Cognito initialized');
} else {
  console.log('🔧 Cognito not configured - using mock auth');
}

/**
 * Sign up new user
 */
export async function signUpUser(
  email: string,
  password: string,
  userType: 'buyer' | 'artisan',
  name?: string
) {
  try {
    const { userId } = await signUp({
      username: email,
      password,
      options: {
        userAttributes: {
          email,
          name: name || email.split('@')[0],
          'custom:userType': userType,
        },
      },
    });

    return {
      success: true,
      userId,
    };
  } catch (error: any) {
    console.error('Cognito signup error:', error);
    throw new Error(error.message || 'Signup failed');
  }
}

/**
 * Sign in existing user
 */
export async function signInUser(email: string, password: string) {
  try {
    const { isSignedIn } = await signIn({
      username: email,
      password,
    });

    if (isSignedIn) {
      const user = await getCurrentUser();
      return {
        success: true,
        user,
      };
    }

    throw new Error('Sign in failed');
  } catch (error: any) {
    console.error('Cognito signin error:', error);
    throw new Error(error.message || 'Sign in failed');
  }
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  try {
    await signOut();
    return { success: true };
  } catch (error: any) {
    console.error('Cognito signout error:', error);
    throw new Error(error.message || 'Sign out failed');
  }
}

/**
 * Get current authenticated user
 */
export async function getAuthenticatedUser() {
  try {
    const user = await getCurrentUser();
    const session = await fetchAuthSession();
    
    return {
      user,
      session,
    };
  } catch (error) {
    return null;
  }
}
```

---

### Files to Modify

#### 2. `/contexts/AuthContext.tsx`
**Changes:** Add Cognito support alongside Firebase

```typescript
// Add imports
import {
  signUpUser as cognitoSignUp,
  signInUser as cognitoSignIn,
  signOutUser as cognitoSignOut,
  isCognitoConfigured,
  getAuthenticatedUser as getCognitoUser
} from '../services/AWSAuthService';

// Update signup function
const signup = async (
  email: string,
  password: string,
  type: 'buyer' | 'artisan',
  name?: string
) => {
  // Try Cognito first
  if (isCognitoConfigured()) {
    try {
      await cognitoSignUp(email, password, type, name);
      
      // Set user state
      const cognitoUser = await getCognitoUser();
      setUser({
        id: cognitoUser.user.userId,
        email,
        name: name || email.split('@')[0],
        type,
        avatar: `https://ui-avatars.com/api/?name=${name || 'User'}&background=random`,
      });
      
      localStorage.setItem('kalaikatha_user_type', type);
      toast.success('Account created successfully!');
      return;
    } catch (error) {
      console.error('Cognito signup failed:', error);
      toast.error(error.message);
      throw error;
    }
  }
  
  // Fall back to Firebase
  if (isFirebaseConfigured() && auth) {
    // ... existing Firebase code
  }
  
  // Fall back to mock
  // ... existing mock code
};

// Similar updates for login, logout
```

---

## 🔴 **Phase 2: Storage (Amazon S3)**

### Files to Create

#### 3. `/services/AWSS3Service.ts`
**Purpose:** Wrapper for S3 uploads/downloads

```typescript
/**
 * AWS S3 Storage Service
 * Replaces Azure Blob Storage
 */

import { Amplify } from 'aws-amplify';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';

const S3_CONFIG = {
  Storage: {
    S3: {
      bucket: import.meta.env?.VITE_AWS_S3_BUCKET || '',
      region: import.meta.env?.VITE_AWS_S3_REGION || 'ap-south-1',
    }
  }
};

// Check if S3 is configured
export function isS3Configured(): boolean {
  return !!S3_CONFIG.Storage.S3.bucket;
}

if (isS3Configured()) {
  Amplify.configure({ ...Amplify.getConfig(), Storage: S3_CONFIG.Storage });
  console.log('✅ AWS S3 initialized');
} else {
  console.log('🔧 S3 not configured - using localStorage');
}

/**
 * Upload image to S3
 */
export async function uploadImage(
  file: File,
  folder: string = 'products',
  onProgress?: (progress: number) => void
): Promise<string> {
  // Check if S3 configured
  if (!isS3Configured()) {
    // Fallback to localStorage
    return uploadToLocalStorage(file);
  }

  try {
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${folder}/${timestamp}_${file.name}`;

    // Upload to S3
    const result = await uploadData({
      key: filename,
      data: file,
      options: {
        contentType: file.type,
        onProgress: ({ transferredBytes, totalBytes }) => {
          if (onProgress && totalBytes) {
            const progress = (transferredBytes / totalBytes) * 100;
            onProgress(progress);
          }
        },
      },
    }).result;

    // Get public URL
    const urlResult = await getUrl({
      key: result.key,
      options: {
        expiresIn: 604800, // 7 days
      },
    });

    return urlResult.url.toString();
  } catch (error) {
    console.error('S3 upload failed:', error);
    // Fallback to localStorage
    return uploadToLocalStorage(file);
  }
}

/**
 * Delete image from S3
 */
export async function deleteImage(key: string): Promise<void> {
  if (!isS3Configured()) {
    // Remove from localStorage
    localStorage.removeItem(`kalaikatha_image_${key}`);
    return;
  }

  try {
    await remove({ key });
  } catch (error) {
    console.error('S3 delete failed:', error);
  }
}

/**
 * Fallback: Upload to localStorage as base64
 */
function uploadToLocalStorage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    // Check file size (max 5MB for localStorage)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('File too large for local storage (max 5MB)'));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      const base64 = reader.result as string;
      const imageId = crypto.randomUUID();
      
      // Store in localStorage
      localStorage.setItem(`kalaikatha_image_${imageId}`, base64);
      
      // Store metadata
      const metadata = {
        id: imageId,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: Date.now(),
      };
      
      const existingMetadata = JSON.parse(
        localStorage.getItem('kalaikatha_images_metadata') || '[]'
      );
      existingMetadata.push(metadata);
      localStorage.setItem(
        'kalaikatha_images_metadata',
        JSON.stringify(existingMetadata)
      );

      console.log('⚠️ Image stored locally (S3 not configured)');
      resolve(base64);
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
```

---

### Files to Modify

#### 4. `/components/artisan/AIStudio.tsx`
**Changes:** Replace Azure Blob with S3

```typescript
// Add import
import { uploadImage, isS3Configured } from '../../services/AWSS3Service';

// Update upload handler
const handlePhotoUpload = async (file: File) => {
  setIsUploading(true);
  
  try {
    const imageUrl = await uploadImage(file, 'products', (progress) => {
      setUploadProgress(progress);
    });
    
    setUploadedImageUrl(imageUrl);
    
    if (!isS3Configured()) {
      toast.warning('Image stored locally. Upload to S3 to share.');
    } else {
      toast.success('Image uploaded successfully!');
    }
  } catch (error) {
    toast.error('Upload failed: ' + error.message);
  } finally {
    setIsUploading(false);
  }
};
```

---

## 🟡 **Phase 3: AI Services (OpenAI API)**

### Files to Create

#### 5. `/services/OpenAIService.ts`
**Purpose:** Direct OpenAI API integration (simpler than Bedrock)

```typescript
/**
 * OpenAI API Service
 * Replaces Azure OpenAI
 */

const OPENAI_CONFIG = {
  apiKey: import.meta.env?.VITE_OPENAI_API_KEY || '',
  model: import.meta.env?.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
  endpoint: 'https://api.openai.com/v1/chat/completions',
};

// Check if OpenAI is configured
export function isOpenAIConfigured(): boolean {
  return !!OPENAI_CONFIG.apiKey;
}

if (isOpenAIConfigured()) {
  console.log('✅ OpenAI API configured');
} else {
  console.log('🔧 OpenAI not configured - using fallback calculations');
}

/**
 * Call OpenAI API
 */
async function callOpenAI(
  messages: Array<{ role: string; content: string }>,
  temperature: number = 0.7
): Promise<string> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI not configured');
  }

  const response = await fetch(OPENAI_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_CONFIG.model,
      messages,
      temperature,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * Calculate smart pricing
 */
export async function calculateSmartPricing(
  materialCost: number,
  laborHours: number,
  skillLevel: number,
  uniqueness: number,
  marketDemand: number,
  craftType: string
): Promise<any> {
  // Try OpenAI
  if (isOpenAIConfigured()) {
    try {
      const prompt = `You are an expert in pricing handcrafted Indian artisan products.

Calculate fair pricing for a ${craftType} item with:
- Material cost: ₹${materialCost}
- Labor hours: ${laborHours}
- Skill level: ${skillLevel}/10
- Uniqueness: ${uniqueness}/10
- Market demand: ${marketDemand}/10

Provide:
1. Floor price (minimum to cover costs + 20% margin)
2. Suggested price (fair market value)
3. Premium price (for high-end buyers)
4. Detailed breakdown of calculations
5. Reasoning for each price point

Respond in JSON format:
{
  "floorPrice": number,
  "suggestedPrice": number,
  "premiumPrice": number,
  "breakdown": {
    "materialCost": number,
    "laborCost": number,
    "skillPremium": number,
    "uniquenessPremium": number
  },
  "reasoning": "string"
}`;

      const messages = [
        { role: 'system', content: 'You are an expert pricing consultant for Indian artisans.' },
        { role: 'user', content: prompt }
      ];

      const response = await callOpenAI(messages, 0.5);
      
      // Parse JSON response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('OpenAI pricing failed:', error);
      // Fall through to formula-based calculation
    }
  }

  // Fallback: Formula-based calculation
  return calculateFormulaBasedPricing(
    materialCost,
    laborHours,
    skillLevel,
    uniqueness,
    marketDemand
  );
}

/**
 * Fallback: Formula-based pricing
 */
function calculateFormulaBasedPricing(
  materialCost: number,
  laborHours: number,
  skillLevel: number,
  uniqueness: number,
  marketDemand: number
): any {
  const laborCost = laborHours * 150; // ₹150/hour average
  const baseCost = materialCost + laborCost;
  
  const skillMultiplier = 1 + (skillLevel * 0.1);
  const uniquenessMultiplier = 1 + (uniqueness * 0.05);
  const demandMultiplier = 1 + (marketDemand * 0.03);
  
  const floorPrice = Math.round(baseCost * 1.2);
  const suggestedPrice = Math.round(
    baseCost * skillMultiplier * uniquenessMultiplier * demandMultiplier
  );
  const premiumPrice = Math.round(suggestedPrice * 1.3);
  
  return {
    floorPrice,
    suggestedPrice,
    premiumPrice,
    breakdown: {
      materialCost,
      laborCost,
      skillPremium: Math.round(baseCost * (skillMultiplier - 1)),
      uniquenessPremium: Math.round(baseCost * (uniquenessMultiplier - 1)),
    },
    reasoning: 'Calculated using standard artisan pricing formula with skill, uniqueness, and market adjustments.',
  };
}

/**
 * Generate marketing content
 */
export async function generateMarketingContent(
  productName: string,
  description: string,
  craftType: string,
  materials: string,
  dimensions: string
): Promise<any> {
  // Try OpenAI
  if (isOpenAIConfigured()) {
    try {
      const prompt = `Generate marketing content for this handcrafted Indian artisan product:

Product: ${productName}
Craft: ${craftType}
Description: ${description}
Materials: ${materials}
Size: ${dimensions}

Create content for:
1. Instagram (engaging, with emojis)
2. Amazon (detailed product listing)
3. Etsy (storytelling, handmade focus)

Respond in JSON format:
{
  "instagram": "string",
  "amazon": "string",
  "etsy": "string"
}`;

      const messages = [
        { role: 'system', content: 'You are a marketing expert for handcrafted artisan products.' },
        { role: 'user', content: prompt }
      ];

      const response = await callOpenAI(messages, 0.8);
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('OpenAI marketing failed:', error);
    }
  }

  // Fallback: Template-based content
  return {
    instagram: `✨ ${productName} ✨

${description}

🎨 Handcrafted with ${craftType} techniques
💎 Each piece is unique
🇮🇳 Made in India with love

#${craftType.replace(' ', '')} #HandmadeInIndia #IndianArt`,

    amazon: `${productName} - Authentic Handcrafted ${craftType}

PRODUCT DESCRIPTION:
${description}

FEATURES:
• Handcrafted by skilled artisan
• Traditional ${craftType} techniques
• 100% authentic Indian craft
• Materials: ${materials}
• Size: ${dimensions}`,

    etsy: `${productName}

${description}

This ${craftType} piece is handcrafted using traditional Indian techniques.

MATERIALS: ${materials}
SIZE: ${dimensions}
ORIGIN: India`
  };
}
```

---

## 📝 Complete Environment Variables

### Add to `.env`:
```env
# AWS Configuration
VITE_AWS_REGION=ap-south-1

# Cognito (Priority 1)
VITE_AWS_COGNITO_USER_POOL_ID=ap-south-1_XXXXXXXXX
VITE_AWS_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_AWS_COGNITO_IDENTITY_POOL_ID=ap-south-1:xxxx-xxxx

# S3 (Priority 2)
VITE_AWS_S3_BUCKET=kalaikatha-artisan-uploads
VITE_AWS_S3_REGION=ap-south-1

# OpenAI API (Priority 3)
VITE_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_OPENAI_MODEL=gpt-3.5-turbo
```

---

## 📦 Dependencies to Install

```bash
# AWS Amplify (for Cognito and S3)
npm install aws-amplify @aws-amplify/ui-react

# No additional packages needed for OpenAI (using fetch API)
```

---

## ✅ Testing Checklist

### After Each Phase

**Phase 1 (Authentication):**
- [ ] Sign up works with Cognito
- [ ] Sign in works
- [ ] Session persists on refresh
- [ ] Fallback to mock auth if Cognito not configured
- [ ] No errors in console

**Phase 2 (Storage):**
- [ ] Image upload to S3 works
- [ ] Progress tracking works
- [ ] Images display correctly
- [ ] Fallback to localStorage if S3 not configured
- [ ] Warning shown for local storage

**Phase 3 (AI):**
- [ ] Smart pricing with OpenAI works
- [ ] Marketing generation works
- [ ] Fallback to formula/templates if OpenAI not configured
- [ ] Cache working (24h for pricing, 7d for marketing)
- [ ] "Demo Mode" badge shown when using fallbacks

---

## 🚀 Deployment Steps

### 1. Update package.json scripts:
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy:dev": "npm run build && aws s3 sync dist/ s3://kalaikatha-dev --delete",
    "deploy:prod": "npm run build && aws s3 sync dist/ s3://kalaikatha-prod --delete"
  }
}
```

### 2. Create CloudFormation template (optional):
See `/docs/AWS_CLOUDFORMATION_TEMPLATE.md` (to be created)

---

## 📊 Progress Tracking

### Phase 1: Authentication
- [ ] Create `AWSAuthService.ts`
- [ ] Update `AuthContext.tsx`
- [ ] Test signup flow
- [ ] Test signin flow
- [ ] Test session persistence
- [ ] Verify fallback works

### Phase 2: Storage
- [ ] Create `AWSS3Service.ts`
- [ ] Update `AIStudio.tsx`
- [ ] Update `SimplifiedPhotoUpload.tsx`
- [ ] Update `VoiceProductStory.tsx`
- [ ] Test upload flow
- [ ] Verify fallback works

### Phase 3: AI
- [ ] Create `OpenAIService.ts`
- [ ] Update `SmartPricing.tsx`
- [ ] Update `MarketingExport.tsx`
- [ ] Update `GovernmentSchemes.tsx`
- [ ] Update `CustomOrderForm.tsx`
- [ ] Test AI features
- [ ] Verify fallback works

---

**Next:** For remaining phases (Translation, Image Recognition, Voice), follow similar patterns:
1. Create service file
2. Update components
3. Test with AWS
4. Test without AWS (fallback)
5. Document changes

**Need help?** See `/docs/AWS_SETUP_GUIDE.md` for AWS configuration.
