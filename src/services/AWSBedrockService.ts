/**
 * AWS Bedrock Service - AI Features
 * Replaces Azure OpenAI + OpenAI API
 * Uses Claude 3 Sonnet via Amazon Bedrock
 * Falls back to rule-based logic when not configured
 */

import { Amplify } from 'aws-amplify';

// ── Config ────────────────────────────────────────────────────────────────────
const BEDROCK_CONFIG = {
  region: import.meta.env?.VITE_AWS_BEDROCK_REGION || 'us-east-1',
  modelId: import.meta.env?.VITE_AWS_BEDROCK_MODEL || 'anthropic.claude-3-sonnet-20240229-v1:0',
};

export function isBedrockConfigured(): boolean {
  // Bedrock needs Cognito Identity Pool credentials (set via Amplify)
  try {
    const config = Amplify.getConfig();
    return !!(config?.Auth?.Cognito?.identityPoolId);
  } catch {
    return false;
  }
}

// ── Cache (save credits) ──────────────────────────────────────────────────────
const _cache = new Map<string, { data: any; expiresAt: number }>();

function cacheGet<T>(key: string): T | null {
  const entry = _cache.get(key);
  if (!entry || Date.now() > entry.expiresAt) { _cache.delete(key); return null; }
  return entry.data as T;
}
function cacheSet(key: string, data: any, ttlMs: number) {
  _cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

// ── Core caller ───────────────────────────────────────────────────────────────
export async function callClaude(prompt: string, maxTokens = 1024): Promise<string> {
  if (!isBedrockConfigured()) throw new Error('Bedrock not configured');

  const { BedrockRuntimeClient, InvokeModelCommand } = await import('@aws-sdk/client-bedrock-runtime');
  const { fetchAuthSession } = await import('aws-amplify/auth');

  const session = await fetchAuthSession();
  const creds = session.credentials;
  if (!creds) throw new Error('No AWS credentials');

  const client = new BedrockRuntimeClient({
    region: BEDROCK_CONFIG.region,
    credentials: creds,
  });

  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  });

  const cmd = new InvokeModelCommand({
    modelId: BEDROCK_CONFIG.modelId,
    contentType: 'application/json',
    accept: 'application/json',
    body: new TextEncoder().encode(body),
  });

  const response = await client.send(cmd);
  const decoded = JSON.parse(new TextDecoder().decode(response.body));
  return decoded.content[0].text as string;
}

// ── Smart Pricing ─────────────────────────────────────────────────────────────
export async function calculateSmartPricing(
  materialCost: number,
  laborHours: number,
  skillLevel: number,
  uniqueness: number,
  marketDemand: number,
  craftType: string
): Promise<any> {
  const cacheKey = `pricing_${craftType}_${materialCost}_${laborHours}_${skillLevel}_${uniqueness}_${marketDemand}`;
  const cached = cacheGet<any>(cacheKey);
  if (cached) return cached;

  if (isBedrockConfigured()) {
    try {
      const prompt = `You are an expert in pricing handcrafted Indian artisan products.

Calculate fair pricing for a ${craftType} item with:
- Material cost: ₹${materialCost}
- Labor hours: ${laborHours}
- Skill level: ${skillLevel}/10
- Uniqueness: ${uniqueness}/10
- Market demand: ${marketDemand}/10

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "floorPrice": <number>,
  "suggestedPrice": <number>,
  "premiumPrice": <number>,
  "reasoning": "<string explaining the pricing in simple language>",
  "marketInsight": "<string with market trends>",
  "exportPotential": "<string about export opportunities>"
}`;

      const raw = await callClaude(prompt, 800);
      // Extract JSON (Claude sometimes adds explanation text)
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        cacheSet(cacheKey, result, 24 * 60 * 60 * 1000); // 24h cache
        return result;
      }
    } catch (err) {
      console.warn('Bedrock pricing failed, using calculation fallback:', err);
    }
  }

  // Rule-based fallback
  return calculatePricingFallback(materialCost, laborHours, skillLevel, uniqueness, marketDemand, craftType);
}

function calculatePricingFallback(
  materialCost: number,
  laborHours: number,
  skillLevel: number,
  uniqueness: number,
  marketDemand: number,
  craftType: string
) {
  const hourlyRate = 80 + (skillLevel * 20); // ₹80–₹280/hr based on skill
  const laborCost = laborHours * hourlyRate;
  const baseCost = materialCost + laborCost;
  const uniquenessMultiplier = 1 + (uniqueness / 10) * 0.5;
  const demandMultiplier = 1 + (marketDemand / 10) * 0.3;

  const floorPrice = Math.round(baseCost * 1.2);
  const suggestedPrice = Math.round(baseCost * uniquenessMultiplier * demandMultiplier * 1.5);
  const premiumPrice = Math.round(suggestedPrice * 1.4);

  return {
    floorPrice,
    suggestedPrice,
    premiumPrice,
    reasoning: `Based on ₹${materialCost} material cost and ${laborHours}hrs of labor at skill level ${skillLevel}/10. Minimum price to sustain your craft is ₹${floorPrice}.`,
    marketInsight: `${craftType} items with high uniqueness (${uniqueness}/10) and market demand (${marketDemand}/10) command premium pricing in both domestic and export markets.`,
    exportPotential: `This ${craftType} item has strong export potential. International buyers typically pay 2-3x the domestic price for authentic Indian handicrafts.`,
  };
}

// ── Marketing Content ─────────────────────────────────────────────────────────
export async function generateMarketingContent(
  productName: string,
  craftType: string,
  description: string,
  price: number
): Promise<any> {
  const cacheKey = `marketing_${productName}_${craftType}`;
  const cached = cacheGet<any>(cacheKey);
  if (cached) return cached;

  if (isBedrockConfigured()) {
    try {
      const prompt = `You are a master copywriter for Indian artisan products selling on multiple platforms.

Create platform-specific marketing content for:
- Product: ${productName}
- Craft Type: ${craftType}
- Description: ${description}
- Price: ₹${price}

Return ONLY valid JSON (no markdown, no explanation):
{
  "instagram": {
    "caption": "<engaging IG post caption with emojis and 5-8 relevant hashtags like #IndianArtisan #Handmade #Etsy #Amazon>",
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
  },
  "etsy": {
    "title": "<product title optimized for Etsy search>",
    "description": "<detailed product description for Etsy (5-8 sentences, highlight uniqueness and craftsmanship)>",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
  },
  "amazon": {
    "title": "<Amazon product title (keep under 200 chars)>",
    "bulletPoints": [
      "<point about materials and craftsmanship>",
      "<point about uniqueness and authenticity>",
      "<point about artisan details>",
      "<point about care instructions>",
      "<point about perfect gift or use case>"
    ],
    "description": "<Amazon product description (3-4 paragraphs)>"
  },
  "flipkart": {
    "title": "<Flipkart product title>",
    "description": "<product description for Flipkart with benefits and features>",
    "highlights": ["highlight1", "highlight2", "highlight3", "highlight4"]
  }
}`;

      const raw = await callClaude(prompt, 1200);
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        cacheSet(cacheKey, result, 7 * 24 * 60 * 60 * 1000); // 7d cache
        return result;
      }
    } catch (err) {
      console.warn('Bedrock marketing failed, using fallback:', err);
    }
  }

  // Fallback content if Bedrock unavailable
  const hashtags = ['#HandmadeInIndia', '#IndianArtisan', '#Handicrafts', '#Etsy', '#Amazon', '#ArtisanCraft', '#SupportLocal'];
  return {
    instagram: {
      caption: `✨ Handcrafted ${productName} by a master artisan!\n\nEvery piece tells a story of generations of skill and passion. Made with love in India 🇮🇳\n\nPrice: ₹${price}\n\n${hashtags.slice(0, 5).join(' ')}`,
      hashtags: hashtags,
    },
    etsy: {
      title: `Authentic ${productName} - Handmade Indian ${craftType}`,
      description: `This stunning ${productName} is an authentic handcrafted ${craftType} made by skilled Indian artisans. Each piece is individually crafted with traditional techniques passed down through generations. The natural materials and careful attention to detail make this a unique and valuable addition to your home. Perfect as a gift or for personal collection.`,
      tags: [craftType, 'handmade', 'Indian', 'artisan', 'authentic'],
    },
    amazon: {
      title: `Handcrafted ${productName} - Authentic Indian ${craftType} (₹${price})`,
      bulletPoints: [
        `Authentic ${craftType} handcrafted by skilled Indian artisans`,
        `Made with natural materials using traditional techniques`,
        `Each piece is unique and one-of-a-kind`,
        `Perfect for home décor, gift-giving, or personal collection`,
        `Supports traditional craft and fair trade practices`,
      ],
      description: `This beautiful ${productName} is a testament to the rich heritage of Indian craftsmanship. Created by skilled artisans using traditional techniques, each piece is unique and tells a story of cultural authenticity. Made with high-quality natural materials, this ${craftType} combines aesthetic appeal with exceptional durability. Whether you're looking for a special gift or want to add authentic Indian artisan work to your home, this piece is a perfect choice. Supports traditional handicraft and ensures fair compensation for artisans.`,
    },
    flipkart: {
      title: `${productName} - Handmade Indian ${craftType} by Master Artisans`,
      description: `Celebrate authentic Indian craftsmanship with this handmade ${productName}. Each piece is carefully crafted by skilled artisans using traditional techniques and natural materials. This ${craftType} is not just a product but a work of art that carries the legacy of generations. Perfect for home decoration, gifting, or adding a touch of authenticity to your space.`,
      highlights: [
        'Handcrafted by skilled Indian artisans',
        'Made from natural materials',
        'Unique and one-of-a-kind piece',
        'Traditional craftsmanship technique',
      ],
    },
  };
}

// ── Negotiation Bot ───────────────────────────────────────────────────────────
export async function generateNegotiationResponse(
  buyerOffer: number,
  floorPrice: number,
  suggestedPrice: number,
  productName: string,
  negotiationStyle: 'firm' | 'friendly' | 'flexible'
): Promise<any> {
  if (isBedrockConfigured()) {
    try {
      const styleGuide = {
        firm: 'polite but firm, emphasizing quality and fair value',
        friendly: 'warm and personable, building relationship while protecting value',
        flexible: 'open to reasonable compromise, seeking win-win outcome',
      }[negotiationStyle];

      const prompt = `You are a skilled negotiation AI for an Indian artisan.

Situation:
- Product: ${productName}
- Floor price (minimum acceptable): ₹${floorPrice}
- Your asking price: ₹${suggestedPrice}
- Buyer's offer: ₹${buyerOffer}
- Style: ${styleGuide}

${buyerOffer < floorPrice
  ? `The offer is BELOW floor price. You MUST decline but do it respectfully.`
  : `The offer is between floor and asking price. Counter-offer if needed.`
}

Return ONLY valid JSON:
{
  "action": "accept" | "counter" | "decline",
  "counterOffer": <number or null>,
  "message": "<your response message to the buyer>",
  "reasoning": "<internal note explaining your decision>"
}`;

      const raw = await callClaude(prompt, 400);
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (err) {
      console.warn('Bedrock negotiation failed, using fallback:', err);
    }
  }

  // Rule-based fallback
  if (buyerOffer >= suggestedPrice) {
    return { action: 'accept', counterOffer: null, message: `Thank you! ₹${buyerOffer} works perfectly for the ${productName}. I appreciate your generous offer and the respect for my craft.`, reasoning: 'Offer meets or exceeds asking price.' };
  }
  if (buyerOffer < floorPrice) {
    return { action: 'decline', counterOffer: floorPrice, message: `Thank you for your interest in my ${productName}. I understand you're looking for a good deal, but ₹${buyerOffer} doesn't cover my material and labor costs. The minimum I can accept is ₹${floorPrice}.`, reasoning: 'Offer below floor price.' };
  }
  const counter = Math.round((buyerOffer + suggestedPrice) / 2);
  return { action: 'counter', counterOffer: counter, message: `I appreciate the offer of ₹${buyerOffer} for my ${productName}. Each piece takes considerable skill and time. Could we meet at ₹${counter}? This is handcrafted with traditional techniques that have been in my family for generations.`, reasoning: 'Mid-point counter offer.' };
}

// ── Government Scheme AI Draft ────────────────────────────────────────────────
export async function generateSchemeApplicationLetter(
  schemeName: string,
  artisanName: string,
  craftType: string,
  location: string,
  yearsOfExperience: number
): Promise<string> {
  if (isBedrockConfigured()) {
    try {
      const prompt = `Write a formal government scheme application letter for an Indian artisan.

Details:
- Scheme: ${schemeName}
- Applicant: ${artisanName}
- Craft: ${craftType}
- Location: ${location}
- Experience: ${yearsOfExperience} years

Write a concise, professional letter (under 300 words) in English that:
1. States the purpose clearly
2. Highlights artisan's credentials
3. Explains why they deserve the scheme
4. Uses respectful, formal language

Return just the letter text, no JSON needed.`;

      return await callClaude(prompt, 600);
    } catch (err) {
      console.warn('Bedrock letter generation failed, using template:', err);
    }
  }

  return `To,
The Concerned Authority,
${schemeName}

Subject: Application for ${schemeName}

Respected Sir/Madam,

I, ${artisanName}, a traditional ${craftType} artisan from ${location} with ${yearsOfExperience} years of experience, humbly apply for the ${schemeName}.

My craft represents a centuries-old tradition that I have dedicated my life to preserving and promoting. I believe this scheme will help me sustain and grow my artisan practice while contributing to India's rich handicraft heritage.

I am committed to the objectives of this scheme and will utilize the support responsibly to enhance my craft, improve my livelihood, and create employment in my community.

Kindly consider my application favorably.

Yours faithfully,
${artisanName}`;
}

export default {
  isBedrockConfigured,
  calculateSmartPricing,
  generateMarketingContent,
  generateNegotiationResponse,
  generateSchemeApplicationLetter,
};
