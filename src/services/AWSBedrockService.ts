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
async function callClaude(prompt: string, maxTokens = 1024): Promise<string> {
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
      const prompt = `You are a master copywriter for Indian artisan products.

Create compelling marketing content for:
- Product: ${productName}
- Craft Type: ${craftType}
- Description: ${description}
- Price: ₹${price}

Return ONLY valid JSON (no markdown):
{
  "instagramCaption": "<engaging IG caption with 3-5 relevant hashtags>",
  "whatsappMessage": "<short WhatsApp sales message in simple English>",
  "exportTagline": "<professional tagline for international buyers>",
  "storyTitle": "<artisan story title for personal branding>",
  "keywords": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>"]
}`;

      const raw = await callClaude(prompt, 600);
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

  return {
    instagramCaption: `✨ Handcrafted ${productName} by a master artisan!\n\nEvery piece tells a story of generations of skill and passion. Made with love in India 🇮🇳\n\n#HandmadeInIndia #${craftType.replace(/\s/g, '')} #IndianArtisan #Handicrafts #ArtisanCraft`,
    whatsappMessage: `Hello! I'm selling handcrafted ${productName} for just ₹${price}. Made by a skilled artisan using traditional techniques. Interested? Let's talk!`,
    exportTagline: `Authentic ${craftType} — A Masterpiece of Indian Heritage`,
    storyTitle: `The Art Behind ${productName}`,
    keywords: [craftType, 'handmade', 'Indian handicraft', 'artisan', productName],
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
